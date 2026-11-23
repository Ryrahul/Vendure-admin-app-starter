/** Facets: list, and a detail form with inline facet value editing (create when id === 'new'). */
import { router } from 'expo-router';
import { useState } from 'react';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  CreateFacetDocument,
  CreateFacetValuesDocument,
  DeleteFacetDocument,
  DeleteFacetValuesDocument,
  FacetDetailDocument,
  FacetListDocument,
  UpdateFacetDocument,
  UpdateFacetValuesDocument,
} from '@/api/documents/facets';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { PickFacetValuesDocument } from '@/api/pickers/common';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { SwitchRow, TextRow, ValueRow } from '@/components/form/fields';
import { DeleteSection, EntityListScreen, FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import type { FacetDetailQuery } from '@/gql/graphql';
import { activeTranslation, editLanguage, toCode } from '@/screens/products/helpers';
import { alertError } from '@/utils/confirm';
import { formatDate } from '@/utils/format';

import { ChildValuesEditor, childDrafts, childValuesInput } from './child-values';

export function FacetListScreen() {
  const { can } = usePermissions();
  return (
    <EntityListScreen
      document={FacetListDocument}
      variables={(term, skip, take) => ({
        options: {
          skip,
          take,
          sort: { name: 'ASC' as const },
          ...(term ? { filter: { _or: [{ name: { contains: term } }, { code: { contains: term } }] } } : {}),
        },
      })}
      select={(r) => r.facets}
      noun={['facet', 'facets']}
      createHref={can('CreateCatalog', 'CreateFacet') ? '/catalog/facets/new' : undefined}
      row={(f) => {
        const { totalItems, items } = f.valueList;
        const preview = items.map((v) => v.name).join(', ');
        return {
          title: f.name,
          code: f.code,
          subtitle: `${totalItems} value${totalItems === 1 ? '' : 's'}${preview ? ` · ${preview}${totalItems > items.length ? '…' : ''}` : ''}`,
          trailing: f.isPrivate ? <StatusBadge label="Private" tone="neutral" /> : undefined,
          onPress: () => router.push(`/catalog/facets/${f.id}`),
        };
      }}
    />
  );
}

type Facet = NonNullable<FacetDetailQuery['facet']>;

/** Remounts the form (dropping local drafts) when the facet or its values change on the server. */
const formKey = (f: Facet) => [f.updatedAt, ...f.values.map((v) => `${v.id}:${v.code}:${v.name}`)].join('|');

export function FacetDetailScreen({ id }: { id: string }) {
  const query = useVendureQuery(FacetDetailDocument, { id }, { enabled: id !== 'new' });
  if (id === 'new') return <FacetForm />;
  return (
    <QueryBoundary query={query} pick={(d) => d.facet} noun="facet">
      {(facet) => <FacetForm key={formKey(facet)} facet={facet} refetch={() => void query.refetch()} refreshing={query.isRefetching} />}
    </QueryBoundary>
  );
}

function FacetForm({ facet, refetch, refreshing }: { facet?: Facet; refetch?: () => void; refreshing?: boolean }) {
  const { can } = usePermissions();
  const defs = useCustomFields('Facet');
  const valueDefs = useCustomFields('FacetValue');
  const invalidate = useInvalidate();
  const create = useVendureMutation(CreateFacetDocument);
  const update = useVendureMutation(UpdateFacetDocument);
  const remove = useVendureMutation(DeleteFacetDocument);
  const createValues = useVendureMutation(CreateFacetValuesDocument);
  const updateValues = useVendureMutation(UpdateFacetValuesDocument);
  const deleteValues = useVendureMutation(DeleteFacetValuesDocument);

  const translation = activeTranslation(facet);
  const [name, setName] = useState(translation?.name ?? facet?.name ?? '');
  const [code, setCode] = useState(facet?.code ?? '');
  const [codeTouched, setCodeTouched] = useState(!!facet);
  const [isPrivate, setIsPrivate] = useState(facet?.isPrivate ?? false);
  const [cf, setCf] = useState(() => customFieldValues(defs, facet?.customFields, translation));
  const [values, setValues] = useState(() => childDrafts(facet?.values ?? [], valueDefs));
  const [dirty, setDirty] = useState(false);
  const edit =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      set(v);
      setDirty(true);
    };

  const canEdit = facet ? can('UpdateCatalog', 'UpdateFacet') : can('CreateCatalog', 'CreateFacet');
  const saving = create.isPending || update.isPending || createValues.isPending || updateValues.isPending;
  const refresh = () => invalidate(FacetListDocument, FacetDetailDocument, PickFacetValuesDocument);

  const save = async () => {
    if (!name.trim()) return alertError(new Error('Name is required.'), 'Missing name');
    const language = editLanguage(facet);
    const valueInput = childValuesInput(values, valueDefs, language);
    if (valueInput.invalid.length) return alertError(new Error('Every facet value needs a name.'), 'Missing name');
    const { customFields, translationCustomFields } = customFieldsInput(defs, cf);
    const translations = [
      {
        ...(translation ? { id: translation.id } : {}),
        languageCode: language,
        name: name.trim(),
        customFields: translationCustomFields,
      },
    ];
    try {
      let facetId = facet?.id;
      if (facet) {
        await update.mutateAsync({ input: { id: facet.id, code: code.trim() || toCode(name), isPrivate, customFields, translations } });
      } else {
        const res = await create.mutateAsync({ input: { code: code.trim() || toCode(name), isPrivate, customFields, translations } });
        facetId = res.createFacet.id;
      }
      if (facetId && valueInput.create.length) {
        await createValues.mutateAsync({ input: valueInput.create.map((v) => ({ ...v, facetId })) });
      }
      if (valueInput.update.length) await updateValues.mutateAsync({ input: valueInput.update });
      if (!facet && facetId) router.replace(`/catalog/facets/${facetId}`);
      setDirty(false);
      await refresh();
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  return (
    <>
      <SaveHeader
        title={facet?.name ?? 'New facet'}
        dirty={dirty}
        saving={saving}
        onSave={save}
        label={facet ? 'Save' : 'Create'}
        hidden={!canEdit}
      />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        <Section title={translation ? `General (${translation.languageCode})` : 'General'}>
          <TextRow
            label="Name"
            value={name}
            readOnly={!canEdit}
            autoFocus={!facet}
            onChangeText={(v) => {
              edit(setName)(v);
              if (!codeTouched) setCode(toCode(v));
            }}
          />
          <TextRow
            label="Code"
            value={code}
            mono
            autoCapitalize="none"
            autoCorrect={false}
            readOnly={!canEdit}
            onChangeText={(v) => {
              setCodeTouched(true);
              edit(setCode)(v);
            }}
          />
          <SwitchRow
            label="Private"
            hint="Private facets are not visible in the Shop API."
            value={isPrivate}
            disabled={!canEdit}
            onValueChange={edit(setIsPrivate)}
          />
        </Section>
        <CustomFieldsSection
          defs={defs}
          values={cf}
          readOnly={!canEdit}
          onChange={(k, v) => {
            setCf((prev) => ({ ...prev, [k]: v }));
            setDirty(true);
          }}
        />
        <ChildValuesEditor
          title="Values"
          noun="value"
          defs={valueDefs}
          value={values}
          onChange={edit(setValues)}
          readOnly={!canEdit}
          canDelete={can('DeleteCatalog', 'DeleteFacet')}
          onDelete={async (valueId) => {
            const res = await deleteValues.mutateAsync({ ids: [valueId], force: false });
            assertDeleted(res.deleteFacetValues);
            await invalidate(FacetListDocument, PickFacetValuesDocument);
          }}
        />
        {facet ? (
          <Section title="Info">
            <ValueRow label="ID" value={facet.id} mono />
            <ValueRow label="Created" value={formatDate(facet.createdAt)} />
            <ValueRow label="Updated" value={formatDate(facet.updatedAt)} />
          </Section>
        ) : null}
        {facet ? (
          <DeleteSection
            label="Delete facet"
            message={`“${facet.name}” and its ${facet.values.length} value(s) will be deleted. Facets in use by products or variants can't be deleted.`}
            hidden={!can('DeleteCatalog', 'DeleteFacet')}
            onDelete={async () => {
              assertDeleted((await remove.mutateAsync({ id: facet.id, force: false })).deleteFacet);
              await invalidate(FacetListDocument, PickFacetValuesDocument);
            }}
          />
        ) : null}
      </FormScroll>
    </>
  );
}
