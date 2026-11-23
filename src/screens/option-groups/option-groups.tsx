/** Product option groups: list, and a detail form with inline option editing (create when id === 'new'). */
import { router } from 'expo-router';
import { useState } from 'react';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  CreateOptionGroupDocument,
  CreateProductOptionDocument,
  DeleteOptionGroupDocument,
  DeleteProductOptionDocument,
  OptionGroupDetailDocument,
  OptionGroupListDocument,
  UpdateOptionGroupDocument,
  UpdateProductOptionDocument,
} from '@/api/documents/option-groups';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { TextRow, ValueRow } from '@/components/form/fields';
import { DeleteSection, EntityListScreen, FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import type { OptionGroupDetailQuery } from '@/gql/graphql';
import { ChildValuesEditor, childDrafts, childValuesInput } from '@/screens/facets/child-values';
import { activeTranslation, editLanguage, toCode } from '@/screens/products/helpers';
import { alertError } from '@/utils/confirm';
import { formatDate } from '@/utils/format';

export function OptionGroupListScreen() {
  const { can } = usePermissions();
  return (
    <EntityListScreen
      document={OptionGroupListDocument}
      variables={(term, skip, take) => ({
        options: {
          skip,
          take,
          sort: { name: 'ASC' as const },
          ...(term ? { filter: { _or: [{ name: { contains: term } }, { code: { contains: term } }] } } : {}),
        },
      })}
      select={(r) => r.productOptionGroups}
      noun={['option group', 'option groups']}
      createHref={can('CreateCatalog', 'CreateProduct') ? '/catalog/option-groups/new' : undefined}
      row={(g) => ({
        title: g.name,
        code: g.code,
        subtitle: `${g.options.length} option${g.options.length === 1 ? '' : 's'} · ${g.productCount} product${g.productCount === 1 ? '' : 's'}`,
        onPress: () => router.push(`/catalog/option-groups/${g.id}`),
      })}
    />
  );
}

type OptionGroup = NonNullable<OptionGroupDetailQuery['productOptionGroup']>;

/** Remounts the form (dropping local drafts) when the group or its options change on the server. */
const formKey = (g: OptionGroup) => [g.updatedAt, ...g.options.map((o) => `${o.id}:${o.code}:${o.name}`)].join('|');

export function OptionGroupDetailScreen({ id }: { id: string }) {
  const query = useVendureQuery(OptionGroupDetailDocument, { id }, { enabled: id !== 'new' });
  if (id === 'new') return <OptionGroupForm />;
  return (
    <QueryBoundary query={query} pick={(d) => d.productOptionGroup} noun="option group">
      {(group) => (
        <OptionGroupForm key={formKey(group)} group={group} refetch={() => void query.refetch()} refreshing={query.isRefetching} />
      )}
    </QueryBoundary>
  );
}

function OptionGroupForm({ group, refetch, refreshing }: { group?: OptionGroup; refetch?: () => void; refreshing?: boolean }) {
  const { can } = usePermissions();
  const defs = useCustomFields('ProductOptionGroup');
  const optionDefs = useCustomFields('ProductOption');
  const invalidate = useInvalidate();
  const create = useVendureMutation(CreateOptionGroupDocument);
  const update = useVendureMutation(UpdateOptionGroupDocument);
  const remove = useVendureMutation(DeleteOptionGroupDocument);
  const createOption = useVendureMutation(CreateProductOptionDocument);
  const updateOption = useVendureMutation(UpdateProductOptionDocument);
  const deleteOption = useVendureMutation(DeleteProductOptionDocument);

  const translation = activeTranslation(group);
  const [name, setName] = useState(translation?.name ?? group?.name ?? '');
  const [code, setCode] = useState(group?.code ?? '');
  const [codeTouched, setCodeTouched] = useState(!!group);
  const [cf, setCf] = useState(() => customFieldValues(defs, group?.customFields, translation));
  const [options, setOptions] = useState(() => childDrafts(group?.options ?? [], optionDefs));
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const edit =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      set(v);
      setDirty(true);
    };

  const canEdit = group ? can('UpdateCatalog', 'UpdateProduct') : can('CreateCatalog', 'CreateProduct');

  const save = async () => {
    if (!name.trim()) return alertError(new Error('Name is required.'), 'Missing name');
    const language = editLanguage(group);
    const optionInput = childValuesInput(options, optionDefs, language);
    if (optionInput.invalid.length) return alertError(new Error('Every option needs a name.'), 'Missing name');
    const { customFields, translationCustomFields } = customFieldsInput(defs, cf);
    const translations = [
      { ...(translation ? { id: translation.id } : {}), languageCode: language, name: name.trim(), customFields: translationCustomFields },
    ];
    setSaving(true);
    try {
      if (group) {
        await update.mutateAsync({ input: { id: group.id, code: code.trim() || toCode(name), customFields, translations } });
        for (const o of optionInput.create) await createOption.mutateAsync({ input: { ...o, productOptionGroupId: group.id } });
        for (const o of optionInput.update) await updateOption.mutateAsync({ input: o });
      } else {
        // New groups are created with their options in one call.
        const res = await create.mutateAsync({
          input: { code: code.trim() || toCode(name), customFields, translations, options: optionInput.create },
        });
        router.replace(`/catalog/option-groups/${res.createProductOptionGroup.id}`);
      }
      setDirty(false);
      await invalidate(OptionGroupListDocument, OptionGroupDetailDocument);
    } catch (e) {
      alertError(e, 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SaveHeader
        title={group?.name ?? 'New option group'}
        dirty={dirty}
        saving={saving}
        onSave={save}
        label={group ? 'Save' : 'Create'}
        hidden={!canEdit}
      />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        <Section title={translation ? `General (${translation.languageCode})` : 'General'}>
          <TextRow
            label="Name"
            value={name}
            readOnly={!canEdit}
            autoFocus={!group}
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
          title="Options"
          noun="option"
          defs={optionDefs}
          value={options}
          onChange={edit(setOptions)}
          readOnly={!canEdit}
          canDelete={can('DeleteCatalog', 'DeleteProduct', 'UpdateCatalog', 'UpdateProduct')}
          onDelete={async (optionId) => {
            assertDeleted((await deleteOption.mutateAsync({ id: optionId })).deleteProductOption);
            await invalidate(OptionGroupListDocument);
          }}
        />
        {group ? (
          <Section title="Info">
            <ValueRow label="ID" value={group.id} mono />
            <ValueRow label="Used by" value={`${group.productCount} product${group.productCount === 1 ? '' : 's'}`} />
            <ValueRow label="Created" value={formatDate(group.createdAt)} />
            <ValueRow label="Updated" value={formatDate(group.updatedAt)} />
          </Section>
        ) : null}
        {group ? (
          <DeleteSection
            label="Delete option group"
            message={`“${group.name}” and its options will be deleted. Groups used by product variants can't be deleted.`}
            hidden={!can('DeleteCatalog', 'DeleteProduct')}
            onDelete={async () => {
              assertDeleted((await remove.mutateAsync({ id: group.id, force: false })).deleteProductOptionGroup);
              await invalidate(OptionGroupListDocument);
            }}
          />
        ) : null}
      </FormScroll>
    </>
  );
}
