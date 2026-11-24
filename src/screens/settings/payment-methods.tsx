/**
 * Payment methods: list, create/edit (handler + optional eligibility checker, custom fields), delete.
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  CreatePaymentMethodDocument,
  DeletePaymentMethodDocument,
  PaymentMethodDetailDocument,
  PaymentMethodListDocument,
  PaymentMethodOperationsDocument,
  UpdatePaymentMethodDocument,
} from '@/api/documents/payment-methods';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { useChannelInfo } from '@/api/use-channel-info';
import { Button } from '@/components/button';
import {
  defaultOperation,
  missingArgs,
  OperationEditor,
  toOperationInput,
  type ConfigurableOperationInput,
} from '@/components/form/configurable-operation';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { SwitchRow, TextRow, ValueRow } from '@/components/form/fields';
import { InlineError } from '@/components/inline-error';
import { DeleteSection, EntityListScreen, FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import type { LanguageCode, PaymentMethodDetailQuery } from '@/gql/graphql';
import { useTheme } from '@/theme';
import { alertError } from '@/utils/confirm';
import { formatDate } from '@/utils/format';

const canCreate = (can: (...p: string[]) => boolean) => can('CreateSettings', 'CreatePaymentMethod');

export function PaymentMethodListScreen() {
  const { can } = usePermissions();
  return (
    <EntityListScreen
      document={PaymentMethodListDocument}
      variables={(term, skip, take) => ({
        options: {
          skip,
          take,
          sort: { name: 'ASC' as const },
          ...(term
            ? { filter: { name: { contains: term }, code: { contains: term } }, filterOperator: 'OR' as const }
            : {}),
        },
      })}
      select={(r) => r.paymentMethods}
      noun={['payment method', 'payment methods']}
      createHref={canCreate(can) ? '/more/payment-methods/new' : undefined}
      row={(m) => ({
        title: m.name || m.code,
        code: m.code,
        subtitle: m.handler.code,
        trailing: m.enabled ? undefined : <StatusBadge label="Disabled" tone="neutral" />,
        onPress: () => router.push(`/more/payment-methods/${m.id}`),
      })}
    />
  );
}

type PaymentMethod = NonNullable<PaymentMethodDetailQuery['paymentMethod']>;

export function PaymentMethodDetailScreen({ id }: { id: string }) {
  const query = useVendureQuery(PaymentMethodDetailDocument, { id }, { enabled: id !== 'new' });
  if (id === 'new') return <PaymentMethodForm />;
  return (
    <QueryBoundary query={query} pick={(d) => d.paymentMethod} noun="payment method">
      {(method) => (
        <PaymentMethodForm
          key={method.updatedAt}
          method={method}
          refetch={() => void query.refetch()}
          refreshing={query.isRefetching}
        />
      )}
    </QueryBoundary>
  );
}

function PaymentMethodForm({
  method,
  refetch,
  refreshing,
}: {
  method?: PaymentMethod;
  refetch?: () => void;
  refreshing?: boolean;
}) {
  const { spacing } = useTheme();
  const { can } = usePermissions();
  const { channel } = useChannelInfo();
  const defs = useCustomFields('PaymentMethod');
  const ops = useVendureQuery(PaymentMethodOperationsDocument, undefined, { staleTime: 5 * 60_000 });
  const invalidate = useInvalidate();
  const create = useVendureMutation(CreatePaymentMethodDocument);
  const update = useVendureMutation(UpdatePaymentMethodDocument);
  const remove = useVendureMutation(DeletePaymentMethodDocument);

  const translation =
    method?.translations.find((t) => t.languageCode === channel?.defaultLanguageCode) ?? method?.translations[0];
  const languageCode = (translation?.languageCode ?? channel?.defaultLanguageCode ?? 'en') as LanguageCode;

  const [code, setCode] = useState(method?.code ?? '');
  const [name, setName] = useState(translation?.name ?? method?.name ?? '');
  const [description, setDescription] = useState(translation?.description ?? method?.description ?? '');
  const [enabled, setEnabled] = useState(method?.enabled ?? true);
  const [handler, setHandler] = useState<ConfigurableOperationInput | null>(
    method ? toOperationInput(method.handler) : null,
  );
  const [checker, setChecker] = useState<ConfigurableOperationInput | null>(
    method?.checker ? toOperationInput(method.checker) : null,
  );
  const [cf, setCf] = useState(() =>
    customFieldValues(defs, method?.customFields, translation as { customFields?: unknown } | undefined),
  );
  const [dirty, setDirty] = useState(false);
  const edit =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      set(v);
      setDirty(true);
    };

  const handlers = ops.data?.paymentMethodHandlers ?? [];
  const checkers = ops.data?.paymentMethodEligibilityCheckers ?? [];
  const canEdit = method ? can('UpdateSettings', 'UpdatePaymentMethod') : canCreate(can);
  const saving = create.isPending || update.isPending;

  const save = async () => {
    const problems: string[] = [];
    if (!code.trim()) problems.push('Code is required.');
    if (!name.trim()) problems.push('Name is required.');
    if (!handler) problems.push('Choose a payment handler.');
    if (handler) for (const a of missingArgs(handler, handlers)) problems.push(`Handler: “${a}” is required.`);
    if (checker) for (const a of missingArgs(checker, checkers)) problems.push(`Checker: “${a}” is required.`);
    if (problems.length || !handler) return alertError(new Error(problems.join('\n')), 'Check the form');
    const { customFields, translationCustomFields } = customFieldsInput(defs, cf);
    const translations = [
      {
        ...(translation?.id ? { id: translation.id } : {}),
        languageCode,
        name: name.trim(),
        description,
        ...(translationCustomFields ? { customFields: translationCustomFields } : {}),
      },
    ];
    try {
      if (method) {
        // `checker: null` removes an existing checker.
        await update.mutateAsync({
          input: { id: method.id, code: code.trim(), enabled, handler, checker, translations, customFields },
        });
      } else {
        const res = await create.mutateAsync({
          input: { code: code.trim(), enabled, handler, checker, translations, customFields },
        });
        router.replace(`/more/payment-methods/${res.createPaymentMethod.id}`);
      }
      setDirty(false);
      await invalidate(PaymentMethodListDocument, PaymentMethodDetailDocument);
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  return (
    <>
      <SaveHeader
        title={method?.name ?? 'New payment method'}
        dirty={dirty}
        saving={saving}
        onSave={save}
        label={method ? 'Save' : 'Create'}
        hidden={!canEdit}
      />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        {ops.error ? <InlineError message={ops.error.message} /> : null}
        <Section title="General">
          <TextRow
            label={`Name (${languageCode})`}
            value={name}
            onChangeText={edit(setName)}
            readOnly={!canEdit}
            autoFocus={!method}
          />
          <TextRow
            label="Code"
            value={code}
            onChangeText={edit(setCode)}
            readOnly={!canEdit}
            autoCapitalize="none"
            autoCorrect={false}
            mono
          />
          <SwitchRow label="Enabled" value={enabled} disabled={!canEdit} onValueChange={edit(setEnabled)} />
          <TextRow
            label={`Description (${languageCode})`}
            value={description}
            onChangeText={edit(setDescription)}
            readOnly={!canEdit}
            multiline
          />
        </Section>
        <OperationEditor
          title="Payment handler"
          definitions={handlers}
          value={handler}
          onChange={edit(setHandler)}
          readOnly={!canEdit}
        />
        {checker ? (
          <>
            <OperationEditor
              title="Eligibility checker"
              definitions={checkers}
              value={checker}
              onChange={edit(setChecker)}
              readOnly={!canEdit}
            />
            {canEdit ? (
              <Section>
                <View style={{ padding: spacing[3] }}>
                  <Button title="Remove eligibility checker" variant="ghost" onPress={() => edit(setChecker)(null)} />
                </View>
              </Section>
            ) : null}
          </>
        ) : checkers.length && canEdit ? (
          <Section
            title="Eligibility checker"
            footer="Optional. Without a checker the method is available for every order.">
            <View style={{ padding: spacing[3] }}>
              <Button
                title="Add eligibility checker"
                variant="ghost"
                onPress={() => edit(setChecker)(defaultOperation(checkers[0]))}
              />
            </View>
          </Section>
        ) : null}
        <CustomFieldsSection
          defs={defs}
          values={cf}
          readOnly={!canEdit}
          onChange={(k, v) => {
            setCf((prev) => ({ ...prev, [k]: v }));
            setDirty(true);
          }}
        />
        {method ? (
          <Section title="Info">
            <ValueRow label="ID" value={method.id} mono />
            <ValueRow label="Created" value={formatDate(method.createdAt)} />
            <ValueRow label="Updated" value={formatDate(method.updatedAt)} />
          </Section>
        ) : null}
        {method ? (
          <DeleteSection
            label="Delete payment method"
            message={`“${method.name}” will be deleted. Payments already taken with it are kept.`}
            hidden={!can('DeleteSettings', 'DeletePaymentMethod')}
            onDelete={async () => {
              assertDeleted((await remove.mutateAsync({ id: method.id })).deletePaymentMethod);
              await invalidate(PaymentMethodListDocument);
            }}
          />
        ) : null}
      </FormScroll>
    </>
  );
}
