/**
 * Tax categories — the reference implementation of a simple settings area:
 * list (search + pagination + "New"), detail form for create *and* edit (id === 'new'),
 * custom fields, permission gating, delete with confirmation.
 */
import { router } from 'expo-router';
import { useState } from 'react';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  CreateTaxCategoryDocument,
  DeleteTaxCategoryDocument,
  TaxCategoryDetailDocument,
  TaxCategoryListDocument,
  UpdateTaxCategoryDocument,
} from '@/api/documents/tax-categories';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { SwitchRow, TextRow, ValueRow } from '@/components/form/fields';
import { DeleteSection, EntityListScreen, FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import type { TaxCategoryDetailQuery } from '@/gql/graphql';
import { alertError } from '@/utils/confirm';
import { formatDate } from '@/utils/format';

export function TaxCategoryListScreen() {
  const { can } = usePermissions();
  return (
    <EntityListScreen
      document={TaxCategoryListDocument}
      variables={(term, skip, take) => ({
        options: { skip, take, sort: { name: 'ASC' as const }, ...(term ? { filter: { name: { contains: term } } } : {}) },
      })}
      select={(r) => r.taxCategories}
      noun={['tax category', 'tax categories']}
      createHref={can('CreateSettings', 'CreateTaxCategory') ? '/more/tax-categories/new' : undefined}
      row={(c) => ({
        title: c.name,
        trailing: c.isDefault ? <StatusBadge label="Default" tone="info" /> : undefined,
        onPress: () => router.push(`/more/tax-categories/${c.id}`),
      })}
    />
  );
}

type TaxCategory = NonNullable<TaxCategoryDetailQuery['taxCategory']>;

export function TaxCategoryDetailScreen({ id }: { id: string }) {
  const query = useVendureQuery(TaxCategoryDetailDocument, { id }, { enabled: id !== 'new' });
  if (id === 'new') return <TaxCategoryForm />;
  return (
    <QueryBoundary query={query} pick={(d) => d.taxCategory} noun="tax category">
      {(category) => (
        // Keyed on updatedAt so the form resets to server values after a save.
        <TaxCategoryForm key={category.updatedAt} category={category} refetch={() => void query.refetch()} refreshing={query.isRefetching} />
      )}
    </QueryBoundary>
  );
}

function TaxCategoryForm({ category, refetch, refreshing }: { category?: TaxCategory; refetch?: () => void; refreshing?: boolean }) {
  const { can } = usePermissions();
  const defs = useCustomFields('TaxCategory');
  const invalidate = useInvalidate();
  const create = useVendureMutation(CreateTaxCategoryDocument);
  const update = useVendureMutation(UpdateTaxCategoryDocument);
  const remove = useVendureMutation(DeleteTaxCategoryDocument);

  const [name, setName] = useState(category?.name ?? '');
  const [isDefault, setIsDefault] = useState(category?.isDefault ?? false);
  const [cf, setCf] = useState(() => customFieldValues(defs, category?.customFields));
  const [dirty, setDirty] = useState(false);
  const edit = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setDirty(true);
  };

  const canEdit = category ? can('UpdateSettings', 'UpdateTaxCategory') : can('CreateSettings', 'CreateTaxCategory');
  const saving = create.isPending || update.isPending;

  const save = async () => {
    if (!name.trim()) return alertError(new Error('Name is required.'), 'Missing name');
    const { customFields } = customFieldsInput(defs, cf);
    try {
      if (category) {
        await update.mutateAsync({ input: { id: category.id, name: name.trim(), isDefault, customFields } });
      } else {
        const res = await create.mutateAsync({ input: { name: name.trim(), isDefault, customFields } });
        router.replace(`/more/tax-categories/${res.createTaxCategory.id}`);
      }
      setDirty(false);
      await invalidate(TaxCategoryListDocument, TaxCategoryDetailDocument);
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  return (
    <>
      <SaveHeader
        title={category?.name ?? 'New tax category'}
        dirty={dirty}
        saving={saving}
        onSave={save}
        label={category ? 'Save' : 'Create'}
        hidden={!canEdit}
      />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        <Section title="General">
          <TextRow label="Name" value={name} onChangeText={edit(setName)} readOnly={!canEdit} autoFocus={!category} />
          <SwitchRow
            label="Default tax category"
            hint="Used for new product variants."
            value={isDefault}
            disabled={!canEdit}
            onValueChange={edit(setIsDefault)}
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
        {category ? (
          <Section title="Info">
            <ValueRow label="ID" value={category.id} mono />
            <ValueRow label="Created" value={formatDate(category.createdAt)} />
            <ValueRow label="Updated" value={formatDate(category.updatedAt)} />
          </Section>
        ) : null}
        {category ? (
          <DeleteSection
            label="Delete tax category"
            message={`“${category.name}” will be deleted. Tax rates using it must be removed first.`}
            hidden={!can('DeleteSettings', 'DeleteTaxCategory')}
            onDelete={async () => {
              assertDeleted((await remove.mutateAsync({ id: category.id })).deleteTaxCategory);
              await invalidate(TaxCategoryListDocument);
            }}
          />
        ) : null}
      </FormScroll>
    </>
  );
}
