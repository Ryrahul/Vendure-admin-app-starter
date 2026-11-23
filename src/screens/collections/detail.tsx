/**
 * Collection detail: create (optionally under `parentId`) and edit. General fields, assets,
 * filters (configurable operations), contents preview, custom fields, children, move, delete.
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  CollectionContentsDocument,
  CollectionDetailDocument,
  CollectionFiltersDocument,
  CollectionListDocument,
  CreateCollectionDocument,
  DeleteCollectionDocument,
  MoveCollectionDocument,
  UpdateCollectionDocument,
} from '@/api/documents/collections';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { openPicker } from '@/api/picker';
import { collectionPicker, PickCollectionsDocument } from '@/api/pickers/common';
import { Button } from '@/components/button';
import {
  missingArgs,
  OperationListEditor,
  toOperationInput,
  type ConfigurableOperationInput,
  type OperationDefinition,
} from '@/components/form/configurable-operation';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { LinkRow, SwitchRow, TextRow, ValueRow } from '@/components/form/fields';
import { ListRow } from '@/components/list-row';
import { DeleteSection, FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import { Text } from '@/components/text';
import { Thumbnail } from '@/components/thumbnail';
import type { CollectionDetailQuery } from '@/gql/graphql';
import { AssetsEditor, assetsInput, assetsValue } from '@/screens/assets/assets-editor';
import { activeTranslation, descriptionToText, editLanguage, slugify, textToHtml } from '@/screens/products/helpers';
import { useTheme } from '@/theme';
import { alertError, confirm } from '@/utils/confirm';
import { formatDate } from '@/utils/format';

type Collection = NonNullable<CollectionDetailQuery['collection']>;

export function CollectionDetailScreen({ id, parentId }: { id: string; parentId?: string }) {
  const query = useVendureQuery(CollectionDetailDocument, { id }, { enabled: id !== 'new' });
  const filters = useVendureQuery(CollectionFiltersDocument, undefined, { staleTime: 5 * 60_000 });
  const defs = (filters.data?.collectionFilters ?? []) as OperationDefinition[];
  if (id === 'new') return <CollectionForm parentId={parentId} filterDefs={defs} />;
  return (
    <QueryBoundary query={query} pick={(d) => d.collection} noun="collection">
      {(collection) => (
        <CollectionForm
          // The initial filter state doesn't depend on the definitions (they only drive the editor
          // UI and validation via props), so their arrival must not remount the form and drop edits.
          key={collection.updatedAt}
          collection={collection}
          filterDefs={defs}
          refetch={() => void query.refetch()}
          refreshing={query.isRefetching}
        />
      )}
    </QueryBoundary>
  );
}

function CollectionForm({
  collection,
  parentId,
  filterDefs,
  refetch,
  refreshing,
}: {
  collection?: Collection;
  parentId?: string;
  filterDefs: OperationDefinition[];
  refetch?: () => void;
  refreshing?: boolean;
}) {
  const { can } = usePermissions();
  const defs = useCustomFields('Collection');
  const invalidate = useInvalidate();
  const create = useVendureMutation(CreateCollectionDocument);
  const update = useVendureMutation(UpdateCollectionDocument);
  const remove = useVendureMutation(DeleteCollectionDocument);

  const translation = activeTranslation(collection);
  const [name, setName] = useState(translation?.name ?? collection?.name ?? '');
  const [slug, setSlug] = useState(translation?.slug ?? collection?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(!!collection);
  const [description, setDescription] = useState(() => descriptionToText(translation?.description ?? collection?.description));
  const [descriptionEdited, setDescriptionEdited] = useState(false);
  const [isPrivate, setIsPrivate] = useState(collection?.isPrivate ?? false);
  const [inheritFilters, setInheritFilters] = useState(collection?.inheritFilters ?? true);
  const [filters, setFilters] = useState<ConfigurableOperationInput[]>(() =>
    (collection?.filters ?? []).map(toOperationInput),
  );
  const [assets, setAssets] = useState(() => assetsValue(collection));
  const [cf, setCf] = useState(() => customFieldValues(defs, collection?.customFields, translation));
  const [dirty, setDirty] = useState(false);
  const edit =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      set(v);
      setDirty(true);
    };

  const canEdit = collection ? can('UpdateCatalog', 'UpdateCollection') : can('CreateCatalog', 'CreateCollection');
  const saving = create.isPending || update.isPending;

  const save = async () => {
    if (!name.trim()) return alertError(new Error('Name is required.'), 'Missing name');
    const missing = filters.flatMap((f) => missingArgs(f, filterDefs));
    if (missing.length) return alertError(new Error(`Fill in: ${missing.join(', ')}.`), 'Incomplete filter');
    const { customFields, translationCustomFields } = customFieldsInput(defs, cf);
    const html = descriptionEdited ? textToHtml(description) : (translation?.description ?? collection?.description ?? '');
    const common = {
      isPrivate,
      inheritFilters,
      filters: filters,
      ...assetsInput(assets),
      customFields,
    };
    const tr = {
      languageCode: editLanguage(collection),
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      description: html,
      customFields: translationCustomFields,
    };
    try {
      if (collection) {
        await update.mutateAsync({
          input: { id: collection.id, ...common, translations: [{ ...(translation ? { id: translation.id } : {}), ...tr }] },
        });
      } else {
        const res = await create.mutateAsync({ input: { ...common, ...(parentId ? { parentId } : {}), translations: [tr] } });
        router.replace(`/catalog/collections/${res.createCollection.id}`);
      }
      setDirty(false);
      await invalidate(CollectionListDocument, CollectionDetailDocument, CollectionContentsDocument, PickCollectionsDocument);
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  return (
    <>
      <SaveHeader
        title={collection?.name ?? 'New collection'}
        dirty={dirty}
        saving={saving}
        onSave={save}
        label={collection ? 'Save' : 'Create'}
        hidden={!canEdit}
      />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        {collection ? <ParentSection collection={collection} canMove={can('UpdateCatalog', 'UpdateCollection')} /> : null}
        <Section title={translation ? `General (${translation.languageCode})` : 'General'}>
          <TextRow
            label="Name"
            value={name}
            readOnly={!canEdit}
            autoFocus={!collection}
            onChangeText={(v) => {
              edit(setName)(v);
              if (!slugTouched) setSlug(slugify(v));
            }}
          />
          <TextRow
            label="Slug"
            value={slug}
            mono
            autoCapitalize="none"
            autoCorrect={false}
            readOnly={!canEdit}
            onChangeText={(v) => {
              setSlugTouched(true);
              edit(setSlug)(v);
            }}
          />
          <TextRow
            label="Description"
            hint={descriptionEdited ? 'Saved as simple paragraphs.' : undefined}
            value={description}
            multiline
            readOnly={!canEdit}
            onChangeText={(v) => {
              setDescriptionEdited(true);
              edit(setDescription)(v);
            }}
          />
          <SwitchRow
            label="Private"
            hint="Private collections are hidden from the Shop API."
            value={isPrivate}
            disabled={!canEdit}
            onValueChange={edit(setIsPrivate)}
          />
          <SwitchRow
            label="Inherit filters"
            hint="Also apply the parent collection's filters."
            value={inheritFilters}
            disabled={!canEdit}
            onValueChange={edit(setInheritFilters)}
          />
        </Section>

        <AssetsEditor value={assets} onChange={edit(setAssets)} readOnly={!canEdit} />

        <OperationListEditor
          title="Filters"
          addLabel="Add filter"
          definitions={filterDefs}
          value={filters}
          readOnly={!canEdit}
          onChange={edit(setFilters)}
        />

        <CustomFieldsSection
          defs={defs}
          values={cf}
          readOnly={!canEdit}
          onChange={(k, v) => {
            setCf((prev) => ({ ...prev, [k]: v }));
            setDirty(true);
          }}
        />

        {collection ? <Contents id={collection.id} /> : null}
        {collection ? <Children collection={collection} canCreate={can('CreateCatalog', 'CreateCollection')} /> : null}

        {collection ? (
          <Section title="Info">
            <ValueRow label="ID" value={collection.id} mono />
            <ValueRow label="Created" value={formatDate(collection.createdAt)} />
            <ValueRow label="Updated" value={formatDate(collection.updatedAt)} />
          </Section>
        ) : null}
        {collection ? (
          <DeleteSection
            label="Delete collection"
            message={`“${collection.name}”${collection.children?.length ? ` and its ${collection.children.length} sub-collection(s)` : ''} will be deleted.`}
            hidden={!can('DeleteCatalog', 'DeleteCollection')}
            onDelete={async () => {
              assertDeleted((await remove.mutateAsync({ id: collection.id })).deleteCollection);
              await invalidate(CollectionListDocument, PickCollectionsDocument);
            }}
          />
        ) : null}
      </FormScroll>
    </>
  );
}

/** Parent row with "Move": to the top level or under another collection. */
function ParentSection({ collection, canMove }: { collection: Collection; canMove: boolean }) {
  const invalidate = useInvalidate();
  const moveMutation = useVendureMutation(MoveCollectionDocument);
  const rootId = collection.breadcrumbs[0]?.id;
  const isTopLevel = collection.parentId === rootId;
  const path = collection.breadcrumbs
    .slice(1, -1)
    .map((b) => b.name)
    .join(' › ');

  const moveTo = async (parentId: string, label: string) => {
    if (parentId === collection.parentId) return;
    if (parentId === collection.id) return alertError(new Error('A collection cannot be its own parent.'), 'Could not move');
    const ok = await confirm({ title: `Move “${collection.name}”?`, message: `It will be moved to ${label}.`, confirmLabel: 'Move' });
    if (!ok) return;
    try {
      await moveMutation.mutateAsync({ input: { collectionId: collection.id, parentId, index: 0 } });
      await invalidate(CollectionDetailDocument, CollectionListDocument, PickCollectionsDocument);
    } catch (e) {
      alertError(e, 'Could not move');
    }
  };

  const choose = () => {
    const pick = async () => {
      const picked = await openPicker({ title: 'Move to', source: collectionPicker });
      if (picked?.[0]) await moveTo(picked[0].id, `“${picked[0].title}”`);
    };
    if (isTopLevel || !rootId) return void pick();
    Alert.alert('Move collection', undefined, [
      { text: 'Top level', onPress: () => void moveTo(rootId, 'the top level') },
      { text: 'Choose collection…', onPress: () => void pick() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <Section>
      <LinkRow
        label="Parent"
        value={isTopLevel ? 'Top level' : path || collection.parent?.name}
        hint={canMove ? 'Tap to move this collection.' : undefined}
        disabled={!canMove || moveMutation.isPending}
        onPress={choose}
      />
    </Section>
  );
}

function Children({ collection, canCreate }: { collection: Collection; canCreate: boolean }) {
  const children = collection.children ?? [];
  return (
    <Section
      title={`Sub-collections (${children.length})`}
      action={
        canCreate ? (
          <Button
            title="Add"
            variant="ghost"
            size="sm"
            onPress={() => router.push({ pathname: '/catalog/collections/[id]', params: { id: 'new', parentId: collection.id } })}
          />
        ) : undefined
      }>
      {children.length ? (
        children.map((c) => <ListRow key={c.id} title={c.name} onPress={() => router.push(`/catalog/collections/${c.id}`)} />)
      ) : (
        <ListRow title="No sub-collections" />
      )}
    </Section>
  );
}

/** Read-only preview of the variants the saved filters match. */
function Contents({ id }: { id: string }) {
  const { spacing } = useTheme();
  const query = useVendureQuery(CollectionContentsDocument, { id, options: { take: 10 } });
  const list = query.data?.collection?.productVariants;
  return (
    <Section
      title={`Contents${list ? ` (${list.totalItems})` : ''}`}
      footer="Matches update in the background after the filters are saved.">
      {query.isLoading ? (
        <ListRow title="Loading…" />
      ) : list?.items.length ? (
        [
          ...list.items.map((v) => (
            <ListRow
              key={v.id}
              leading={<Thumbnail preview={v.featuredAsset?.preview ?? v.product.featuredAsset?.preview} size={36} />}
              title={v.name}
              code={v.sku}
              onPress={() => router.push(`/catalog/variants/${v.id}`)}
            />
          )),
          list.totalItems > list.items.length ? (
            <View key="more" style={{ padding: spacing[4] }}>
              <Text variant="caption" color="mutedForeground">
                and {list.totalItems - list.items.length} more
              </Text>
            </View>
          ) : null,
        ]
      ) : (
        <ListRow title={query.error ? query.error.message : 'No matching variants'} />
      )}
    </Section>
  );
}
