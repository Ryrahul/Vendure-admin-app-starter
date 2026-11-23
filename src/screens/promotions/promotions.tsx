/**
 * Promotions (Marketing): list with an enabled filter and date window, create/edit with
 * conditions and actions (configurable operations), limits, coupon code, custom fields, delete.
 */
import { router } from 'expo-router';
import { useState } from 'react';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  CreatePromotionDocument,
  DeletePromotionDocument,
  PromotionDetailDocument,
  PromotionListDocument,
  PromotionOperationsDocument,
  UpdatePromotionDocument,
} from '@/api/documents/promotions';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, unwrapResult, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { useChannelInfo } from '@/api/use-channel-info';
import {
  missingArgs,
  OperationListEditor,
  toOperationInput,
  type ConfigurableOperationInput,
} from '@/components/form/configurable-operation';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { DateRow, NumberRow, SwitchRow, TextRow, ValueRow } from '@/components/form/fields';
import { InlineError } from '@/components/inline-error';
import { DeleteSection, EntityListScreen, FilterChips, FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import type { LanguageCode, PromotionDetailQuery } from '@/gql/graphql';
import type { StatusTone } from '@/theme';
import { alertError } from '@/utils/confirm';
import { formatDate, stripHtml } from '@/utils/format';

const canCreate = (can: (...p: string[]) => boolean) => can('CreatePromotion');

type EnabledFilter = 'all' | 'enabled' | 'disabled';

/** Status of a promotion's date window right now. */
function windowStatus(p: { enabled: boolean; startsAt?: string | null; endsAt?: string | null }): { label: string; tone: StatusTone } | null {
  if (!p.enabled) return { label: 'Disabled', tone: 'neutral' };
  const now = Date.now();
  if (p.startsAt && new Date(p.startsAt).getTime() > now) return { label: 'Scheduled', tone: 'info' };
  if (p.endsAt && new Date(p.endsAt).getTime() < now) return { label: 'Expired', tone: 'warning' };
  return null;
}

function dateWindow(startsAt?: string | null, endsAt?: string | null) {
  if (!startsAt && !endsAt) return undefined;
  const from = startsAt ? formatDate(startsAt, false) : 'Any time';
  const to = endsAt ? formatDate(endsAt, false) : 'no end';
  return `${from} → ${to}`;
}

export function PromotionListScreen() {
  const { can } = usePermissions();
  const [filter, setFilter] = useState<EnabledFilter>('all');
  return (
    <EntityListScreen
      document={PromotionListDocument}
      variables={(term, skip, take) => ({
        options: {
          skip,
          take,
          sort: { createdAt: 'DESC' as const },
          filter: {
            ...(filter === 'all' ? {} : { enabled: { eq: filter === 'enabled' } }),
            ...(term ? { _or: [{ name: { contains: term } }, { couponCode: { contains: term } }] } : {}),
          },
        },
      })}
      select={(r) => r.promotions}
      noun={['promotion', 'promotions']}
      searchPlaceholder="Search by name or coupon code"
      keyExtra={filter}
      filters={
        <FilterChips
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'All' },
            { value: 'enabled', label: 'Enabled' },
            { value: 'disabled', label: 'Disabled' },
          ]}
        />
      }
      createHref={canCreate(can) ? '/more/promotions/new' : undefined}
      row={(p) => {
        const status = windowStatus(p);
        return {
          title: p.name,
          code: p.couponCode ?? undefined,
          subtitle: dateWindow(p.startsAt, p.endsAt),
          trailing: status ? <StatusBadge label={status.label} tone={status.tone} /> : undefined,
          onPress: () => router.push(`/more/promotions/${p.id}`),
        };
      }}
    />
  );
}

type Promotion = NonNullable<PromotionDetailQuery['promotion']>;

export function PromotionDetailScreen({ id }: { id: string }) {
  const query = useVendureQuery(PromotionDetailDocument, { id }, { enabled: id !== 'new' });
  if (id === 'new') return <PromotionForm />;
  return (
    <QueryBoundary query={query} pick={(d) => d.promotion} noun="promotion">
      {(promotion) => (
        <PromotionForm
          key={promotion.updatedAt}
          promotion={promotion}
          refetch={() => void query.refetch()}
          refreshing={query.isRefetching}
        />
      )}
    </QueryBoundary>
  );
}

function PromotionForm({ promotion, refetch, refreshing }: { promotion?: Promotion; refetch?: () => void; refreshing?: boolean }) {
  const { can } = usePermissions();
  const { channel } = useChannelInfo();
  const defs = useCustomFields('Promotion');
  const ops = useVendureQuery(PromotionOperationsDocument, undefined, { staleTime: 5 * 60_000 });
  const invalidate = useInvalidate();
  const create = useVendureMutation(CreatePromotionDocument);
  const update = useVendureMutation(UpdatePromotionDocument);
  const remove = useVendureMutation(DeletePromotionDocument);

  const translation =
    promotion?.translations.find((t) => t.languageCode === channel?.defaultLanguageCode) ?? promotion?.translations[0];
  const languageCode = (translation?.languageCode ?? channel?.defaultLanguageCode ?? 'en') as LanguageCode;

  const [name, setName] = useState(translation?.name ?? promotion?.name ?? '');
  const [description, setDescription] = useState(translation?.description ?? promotion?.description ?? '');
  const [enabled, setEnabled] = useState(promotion?.enabled ?? true);
  const [couponCode, setCouponCode] = useState(promotion?.couponCode ?? '');
  const [perCustomerUsageLimit, setPerCustomerUsageLimit] = useState<number | null>(promotion?.perCustomerUsageLimit ?? null);
  const [usageLimit, setUsageLimit] = useState<number | null>(promotion?.usageLimit ?? null);
  const [startsAt, setStartsAt] = useState<string | null>(promotion?.startsAt ?? null);
  const [endsAt, setEndsAt] = useState<string | null>(promotion?.endsAt ?? null);
  const [conditions, setConditions] = useState<ConfigurableOperationInput[]>(() => (promotion?.conditions ?? []).map(toOperationInput));
  const [actions, setActions] = useState<ConfigurableOperationInput[]>(() => (promotion?.actions ?? []).map(toOperationInput));
  const [cf, setCf] = useState(() =>
    customFieldValues(defs, promotion?.customFields, translation as { customFields?: unknown } | undefined),
  );
  const [dirty, setDirty] = useState(false);
  const edit = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setDirty(true);
  };

  const conditionDefs = ops.data?.promotionConditions ?? [];
  const actionDefs = ops.data?.promotionActions ?? [];
  const canEdit = promotion ? can('UpdatePromotion') : canCreate(can);
  const saving = create.isPending || update.isPending;

  const save = async () => {
    const problems: string[] = [];
    if (!name.trim()) problems.push('Name is required.');
    if (!actions.length) problems.push('Add at least one action.');
    if (!conditions.length && !couponCode.trim()) problems.push('Add a condition or a coupon code.');
    if (startsAt && endsAt && new Date(endsAt) <= new Date(startsAt)) problems.push('The end date must be after the start date.');
    const label = (op: ConfigurableOperationInput, list: typeof conditionDefs) =>
      stripHtml(list.find((d) => d.code === op.code)?.description) || op.code;
    for (const op of conditions) for (const a of missingArgs(op, conditionDefs)) problems.push(`${label(op, conditionDefs)}: “${a}” is required.`);
    for (const op of actions) for (const a of missingArgs(op, actionDefs)) problems.push(`${label(op, actionDefs)}: “${a}” is required.`);
    if (problems.length) return alertError(new Error(problems.join('\n')), 'Check the form');

    const { customFields, translationCustomFields } = customFieldsInput(defs, cf);
    const input = {
      enabled,
      couponCode: couponCode.trim() || null,
      perCustomerUsageLimit,
      usageLimit,
      startsAt,
      endsAt,
      conditions,
      actions,
      translations: [
        {
          ...(translation?.id ? { id: translation.id } : {}),
          languageCode,
          name: name.trim(),
          description,
          ...(translationCustomFields ? { customFields: translationCustomFields } : {}),
        },
      ],
      customFields,
    };
    try {
      if (promotion) {
        unwrapResult((await update.mutateAsync({ input: { id: promotion.id, ...input } })).updatePromotion);
      } else {
        const res = unwrapResult((await create.mutateAsync({ input })).createPromotion);
        if ('id' in res) router.replace(`/more/promotions/${res.id}`);
      }
      setDirty(false);
      await invalidate(PromotionListDocument, PromotionDetailDocument);
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  return (
    <>
      <SaveHeader
        title={promotion?.name ?? 'New promotion'}
        dirty={dirty}
        saving={saving}
        onSave={save}
        label={promotion ? 'Save' : 'Create'}
        hidden={!canEdit}
      />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        {ops.error ? <InlineError message={ops.error.message} /> : null}
        <Section title="General">
          <TextRow label={`Name (${languageCode})`} value={name} onChangeText={edit(setName)} readOnly={!canEdit} autoFocus={!promotion} />
          <TextRow
            label={`Description (${languageCode})`}
            value={description}
            onChangeText={edit(setDescription)}
            readOnly={!canEdit}
            multiline
          />
          <SwitchRow label="Enabled" value={enabled} disabled={!canEdit} onValueChange={edit(setEnabled)} />
        </Section>
        <Section title="Availability" footer="Leave the limits empty for unlimited use.">
          <TextRow
            label="Coupon code"
            hint="Optional. Customers must enter it to get the promotion."
            value={couponCode}
            onChangeText={edit(setCouponCode)}
            readOnly={!canEdit}
            autoCapitalize="characters"
            autoCorrect={false}
            mono
          />
          <NumberRow
            label="Per-customer usage limit"
            integer
            value={perCustomerUsageLimit}
            onChange={edit(setPerCustomerUsageLimit)}
            readOnly={!canEdit}
          />
          <NumberRow label="Usage limit" hint="Total uses across all customers." integer value={usageLimit} onChange={edit(setUsageLimit)} readOnly={!canEdit} />
          <DateRow label="Starts at" value={startsAt} onChange={edit(setStartsAt)} readOnly={!canEdit} />
          <DateRow label="Ends at" value={endsAt} onChange={edit(setEndsAt)} readOnly={!canEdit} />
        </Section>
        <OperationListEditor
          title="Conditions"
          addLabel="Add condition"
          definitions={conditionDefs}
          value={conditions}
          onChange={edit(setConditions)}
        />
        <OperationListEditor title="Actions" addLabel="Add action" definitions={actionDefs} value={actions} onChange={edit(setActions)} />
        <CustomFieldsSection
          defs={defs}
          values={cf}
          readOnly={!canEdit}
          onChange={(k, v) => {
            setCf((prev) => ({ ...prev, [k]: v }));
            setDirty(true);
          }}
        />
        {promotion ? (
          <Section title="Info">
            <ValueRow label="ID" value={promotion.id} mono />
            <ValueRow label="Created" value={formatDate(promotion.createdAt)} />
            <ValueRow label="Updated" value={formatDate(promotion.updatedAt)} />
          </Section>
        ) : null}
        {promotion ? (
          <DeleteSection
            label="Delete promotion"
            message={`“${promotion.name}” will be deleted. Orders that already used it keep their discounts.`}
            hidden={!can('DeletePromotion')}
            onDelete={async () => {
              assertDeleted((await remove.mutateAsync({ id: promotion.id })).deletePromotion);
              await invalidate(PromotionListDocument);
            }}
          />
        ) : null}
      </FormScroll>
    </>
  );
}
