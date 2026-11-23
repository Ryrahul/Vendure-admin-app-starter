/**
 * Tax rates: list (category · zone · value), create/edit (category, zone, optional
 * customer group, value), custom fields, delete.
 */
import { router } from 'expo-router';
import { useState } from 'react';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  CreateTaxRateDocument,
  DeleteTaxRateDocument,
  TaxRateDetailDocument,
  TaxRateListDocument,
  TaxRateOptionsDocument,
  UpdateTaxRateDocument,
} from '@/api/documents/tax-rates';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { openPicker } from '@/api/picker';
import { customerGroupPicker } from '@/api/pickers/common';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { LinkRow, NumberRow, SelectRow, SwitchRow, TextRow, ValueRow } from '@/components/form/fields';
import { InlineError } from '@/components/inline-error';
import { DeleteSection, EntityListScreen, FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import type { TaxRateDetailQuery } from '@/gql/graphql';
import { alertError } from '@/utils/confirm';
import { formatDate } from '@/utils/format';

const canCreate = (can: (...p: string[]) => boolean) => can('CreateSettings', 'CreateTaxRate');

export function TaxRateListScreen() {
  const { can } = usePermissions();
  return (
    <EntityListScreen
      document={TaxRateListDocument}
      variables={(term, skip, take) => ({
        options: { skip, take, sort: { name: 'ASC' as const }, ...(term ? { filter: { name: { contains: term } } } : {}) },
      })}
      select={(r) => r.taxRates}
      noun={['tax rate', 'tax rates']}
      createHref={canCreate(can) ? '/more/tax-rates/new' : undefined}
      row={(r) => ({
        title: r.name,
        subtitle: [r.category.name, r.zone.name, r.customerGroup?.name].filter(Boolean).join(' · '),
        value: `${r.value}%`,
        trailing: r.enabled ? undefined : <StatusBadge label="Disabled" tone="neutral" />,
        onPress: () => router.push(`/more/tax-rates/${r.id}`),
      })}
    />
  );
}

type TaxRate = NonNullable<TaxRateDetailQuery['taxRate']>;

export function TaxRateDetailScreen({ id }: { id: string }) {
  const query = useVendureQuery(TaxRateDetailDocument, { id }, { enabled: id !== 'new' });
  if (id === 'new') return <TaxRateForm />;
  return (
    <QueryBoundary query={query} pick={(d) => d.taxRate} noun="tax rate">
      {(rate) => <TaxRateForm key={rate.updatedAt} rate={rate} refetch={() => void query.refetch()} refreshing={query.isRefetching} />}
    </QueryBoundary>
  );
}

function TaxRateForm({ rate, refetch, refreshing }: { rate?: TaxRate; refetch?: () => void; refreshing?: boolean }) {
  const { can } = usePermissions();
  const defs = useCustomFields('TaxRate');
  const options = useVendureQuery(TaxRateOptionsDocument, undefined, { staleTime: 60_000 });
  const invalidate = useInvalidate();
  const create = useVendureMutation(CreateTaxRateDocument);
  const update = useVendureMutation(UpdateTaxRateDocument);
  const remove = useVendureMutation(DeleteTaxRateDocument);

  const [name, setName] = useState(rate?.name ?? '');
  const [enabled, setEnabled] = useState(rate?.enabled ?? true);
  const [value, setValue] = useState<number | null>(rate?.value ?? null);
  const [categoryId, setCategoryId] = useState<string | null>(rate?.category.id ?? null);
  const [zoneId, setZoneId] = useState<string | null>(rate?.zone.id ?? null);
  const [group, setGroup] = useState<{ id: string; name: string } | null>(rate?.customerGroup ?? null);
  const [cf, setCf] = useState(() => customFieldValues(defs, rate?.customFields));
  const [dirty, setDirty] = useState(false);
  const edit = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setDirty(true);
  };

  const canEdit = rate ? can('UpdateSettings', 'UpdateTaxRate') : canCreate(can);
  const saving = create.isPending || update.isPending;

  const save = async () => {
    const problems: string[] = [];
    if (!name.trim()) problems.push('Name is required.');
    if (value == null) problems.push('Enter the rate value.');
    if (!categoryId) problems.push('Choose a tax category.');
    if (!zoneId) problems.push('Choose a zone.');
    if (problems.length || value == null || !categoryId || !zoneId) return alertError(new Error(problems.join('\n')), 'Check the form');
    const { customFields } = customFieldsInput(defs, cf);
    const base = { name: name.trim(), enabled, value, categoryId, zoneId, customFields };
    try {
      if (rate) {
        // Vendure ignores a null/undefined customerGroupId on update, so clearing a group is not possible via the API.
        await update.mutateAsync({ input: { id: rate.id, ...base, ...(group ? { customerGroupId: group.id } : {}) } });
      } else {
        const res = await create.mutateAsync({ input: { ...base, customerGroupId: group?.id } });
        router.replace(`/more/tax-rates/${res.createTaxRate.id}`);
      }
      setDirty(false);
      await invalidate(TaxRateListDocument, TaxRateDetailDocument);
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  return (
    <>
      <SaveHeader
        title={rate?.name ?? 'New tax rate'}
        dirty={dirty}
        saving={saving}
        onSave={save}
        label={rate ? 'Save' : 'Create'}
        hidden={!canEdit}
      />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        {options.error ? <InlineError message={options.error.message} /> : null}
        <Section title="General">
          <TextRow label="Name" value={name} onChangeText={edit(setName)} readOnly={!canEdit} autoFocus={!rate} />
          <SwitchRow label="Enabled" value={enabled} disabled={!canEdit} onValueChange={edit(setEnabled)} />
          <NumberRow label="Rate" suffix="%" value={value} onChange={edit(setValue)} readOnly={!canEdit} />
        </Section>
        <Section title="Applies to">
          <SelectRow
            label="Tax category"
            value={categoryId}
            disabled={!canEdit}
            options={(options.data?.taxCategories.items ?? []).map((c) => ({ value: c.id, label: c.name }))}
            onChange={edit(setCategoryId)}
          />
          <SelectRow
            label="Zone"
            value={zoneId}
            disabled={!canEdit}
            options={(options.data?.zones.items ?? []).map((z) => ({ value: z.id, label: z.name }))}
            onChange={edit(setZoneId)}
          />
          <LinkRow
            label="Customer group"
            hint="Optional. Limits the rate to customers in this group."
            value={group?.name}
            disabled={!canEdit}
            onPress={async () => {
              const picked = await openPicker({ title: 'Customer group', source: customerGroupPicker });
              if (picked?.[0]) edit(setGroup)({ id: picked[0].id, name: picked[0].title });
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
        {rate ? (
          <Section title="Info">
            <ValueRow label="ID" value={rate.id} mono />
            <ValueRow label="Created" value={formatDate(rate.createdAt)} />
            <ValueRow label="Updated" value={formatDate(rate.updatedAt)} />
          </Section>
        ) : null}
        {rate ? (
          <DeleteSection
            label="Delete tax rate"
            message={`“${rate.name}” will be deleted. Prices in its zone and category will no longer include this tax.`}
            hidden={!can('DeleteSettings', 'DeleteTaxRate')}
            onDelete={async () => {
              assertDeleted((await remove.mutateAsync({ id: rate.id })).deleteTaxRate);
              await invalidate(TaxRateListDocument);
            }}
          />
        ) : null}
      </FormScroll>
    </>
  );
}
