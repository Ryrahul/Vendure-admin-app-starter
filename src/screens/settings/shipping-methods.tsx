/**
 * Shipping methods: list, create/edit (fulfillment handler, eligibility checker, price
 * calculator, custom fields), delete, and a "Test" section that runs the method's current
 * (unsaved) checker + calculator against a sample order, like the web dashboard.
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  CreateShippingMethodDocument,
  DeleteShippingMethodDocument,
  ShippingMethodDetailDocument,
  ShippingMethodListDocument,
  ShippingMethodOperationsDocument,
  TestShippingMethodDocument,
  UpdateShippingMethodDocument,
} from '@/api/documents/shipping-methods';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { openPicker, type PickerItem } from '@/api/picker';
import { variantPicker } from '@/api/pickers/common';
import { countryPicker } from '@/api/pickers/settings-b';
import { useChannelInfo } from '@/api/use-channel-info';
import { Button } from '@/components/button';
import {
  missingArgs,
  OperationEditor,
  toOperationInput,
  type ConfigurableOperationInput,
} from '@/components/form/configurable-operation';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { LinkRow, NumberRow, SelectRow, TextRow, ValueRow } from '@/components/form/fields';
import { InlineError } from '@/components/inline-error';
import { ListRow } from '@/components/list-row';
import { DeleteSection, EntityListScreen, FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import { Text } from '@/components/text';
import type { LanguageCode, ShippingMethodDetailQuery, TestShippingMethodQuery } from '@/gql/graphql';
import { useTheme } from '@/theme';
import { alertError } from '@/utils/confirm';
import { formatDate, formatMoney } from '@/utils/format';

const canCreate = (can: (...p: string[]) => boolean) => can('CreateSettings', 'CreateShippingMethod');

export function ShippingMethodListScreen() {
  const { can } = usePermissions();
  return (
    <EntityListScreen
      document={ShippingMethodListDocument}
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
      select={(r) => r.shippingMethods}
      noun={['shipping method', 'shipping methods']}
      createHref={canCreate(can) ? '/more/shipping-methods/new' : undefined}
      row={(m) => ({
        title: m.name || m.code,
        code: m.code,
        subtitle: m.fulfillmentHandlerCode,
        onPress: () => router.push(`/more/shipping-methods/${m.id}`),
      })}
    />
  );
}

type ShippingMethod = NonNullable<ShippingMethodDetailQuery['shippingMethod']>;

export function ShippingMethodDetailScreen({ id }: { id: string }) {
  const query = useVendureQuery(ShippingMethodDetailDocument, { id }, { enabled: id !== 'new' });
  if (id === 'new') return <ShippingMethodForm />;
  return (
    <QueryBoundary query={query} pick={(d) => d.shippingMethod} noun="shipping method">
      {(method) => (
        <ShippingMethodForm
          key={method.updatedAt}
          method={method}
          refetch={() => void query.refetch()}
          refreshing={query.isRefetching}
        />
      )}
    </QueryBoundary>
  );
}

function ShippingMethodForm({
  method,
  refetch,
  refreshing,
}: {
  method?: ShippingMethod;
  refetch?: () => void;
  refreshing?: boolean;
}) {
  const { can } = usePermissions();
  const { channel } = useChannelInfo();
  const defs = useCustomFields('ShippingMethod');
  const ops = useVendureQuery(ShippingMethodOperationsDocument, undefined, { staleTime: 5 * 60_000 });
  const invalidate = useInvalidate();
  const create = useVendureMutation(CreateShippingMethodDocument);
  const update = useVendureMutation(UpdateShippingMethodDocument);
  const remove = useVendureMutation(DeleteShippingMethodDocument);

  const translation =
    method?.translations.find((t) => t.languageCode === method.languageCode) ?? method?.translations[0];
  const languageCode = (translation?.languageCode ?? channel?.defaultLanguageCode ?? 'en') as LanguageCode;

  const [code, setCode] = useState(method?.code ?? '');
  const [name, setName] = useState(translation?.name ?? method?.name ?? '');
  const [description, setDescription] = useState(translation?.description ?? method?.description ?? '');
  const [handler, setHandler] = useState<string | null>(method?.fulfillmentHandlerCode ?? null);
  const [checker, setChecker] = useState<ConfigurableOperationInput | null>(
    method ? toOperationInput(method.checker) : null,
  );
  const [calculator, setCalculator] = useState<ConfigurableOperationInput | null>(
    method ? toOperationInput(method.calculator) : null,
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

  const checkers = ops.data?.shippingEligibilityCheckers ?? [];
  const calculators = ops.data?.shippingCalculators ?? [];
  const handlers = ops.data?.fulfillmentHandlers ?? [];
  // Default the handler for new methods once the definitions load.
  const handlerValue = handler ?? (method ? null : (handlers[0]?.code ?? null));

  const canEdit = method ? can('UpdateSettings', 'UpdateShippingMethod') : canCreate(can);
  const saving = create.isPending || update.isPending;

  const save = async () => {
    const problems: string[] = [];
    if (!code.trim()) problems.push('Code is required.');
    if (!name.trim()) problems.push('Name is required.');
    if (!handlerValue) problems.push('Choose a fulfillment handler.');
    if (!checker) problems.push('Choose an eligibility checker.');
    if (!calculator) problems.push('Choose a shipping calculator.');
    if (checker) for (const a of missingArgs(checker, checkers)) problems.push(`Checker: “${a}” is required.`);
    if (calculator)
      for (const a of missingArgs(calculator, calculators)) problems.push(`Calculator: “${a}” is required.`);
    if (problems.length || !checker || !calculator || !handlerValue) {
      return alertError(new Error(problems.join('\n')), 'Check the form');
    }
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
        await update.mutateAsync({
          input: {
            id: method.id,
            code: code.trim(),
            fulfillmentHandler: handlerValue,
            checker,
            calculator,
            translations,
            customFields,
          },
        });
      } else {
        const res = await create.mutateAsync({
          input: {
            code: code.trim(),
            fulfillmentHandler: handlerValue,
            checker,
            calculator,
            translations,
            customFields,
          },
        });
        router.replace(`/more/shipping-methods/${res.createShippingMethod.id}`);
      }
      setDirty(false);
      await invalidate(ShippingMethodListDocument, ShippingMethodDetailDocument);
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  return (
    <>
      <SaveHeader
        title={method?.name ?? 'New shipping method'}
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
          <TextRow
            label={`Description (${languageCode})`}
            value={description}
            onChangeText={edit(setDescription)}
            readOnly={!canEdit}
            multiline
          />
          <SelectRow
            label="Fulfillment handler"
            value={handlerValue}
            disabled={!canEdit}
            options={handlers.map((h) => ({ value: h.code, label: h.description || h.code }))}
            onChange={(v) => {
              setHandler(v);
              setDirty(true);
            }}
          />
        </Section>
        <OperationEditor
          title="Eligibility checker"
          definitions={checkers}
          value={checker}
          onChange={edit(setChecker)}
          readOnly={!canEdit}
        />
        <OperationEditor
          title="Shipping calculator"
          definitions={calculators}
          value={calculator}
          onChange={edit(setCalculator)}
          readOnly={!canEdit}
        />
        <TestSection checker={checker} calculator={calculator} />
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
            label="Delete shipping method"
            message={`“${method.name}” will be deleted. Orders that used it keep their shipping lines.`}
            hidden={!can('DeleteSettings', 'DeleteShippingMethod')}
            onDelete={async () => {
              assertDeleted((await remove.mutateAsync({ id: method.id })).deleteShippingMethod);
              await invalidate(ShippingMethodListDocument);
            }}
          />
        ) : null}
      </FormScroll>
    </>
  );
}

type TestLine = PickerItem & { quantity: number };
type TestResult = TestShippingMethodQuery['testShippingMethod'];

/** Runs `testShippingMethod` with the form's current checker and calculator. */
function TestSection({
  checker,
  calculator,
}: {
  checker: ConfigurableOperationInput | null;
  calculator: ConfigurableOperationInput | null;
}) {
  const { spacing } = useTheme();
  const { currencyCode, precision } = useChannelInfo();
  const test = useVendureMutation(TestShippingMethodDocument);
  const [lines, setLines] = useState<TestLine[]>([]);
  const [country, setCountry] = useState<PickerItem | null>(null);
  const [postalCode, setPostalCode] = useState('');
  const [result, setResult] = useState<TestResult | null>(null);
  const [stale, setStale] = useState(false);
  const touch = () => setStale(true);

  const ready = !!checker && !!calculator && lines.length > 0 && !!country?.code;

  const run = async () => {
    if (!checker || !calculator || !country?.code) return;
    try {
      const res = await test.mutateAsync({
        input: {
          checker,
          calculator,
          shippingAddress: {
            streetLine1: 'Test street',
            countryCode: country.code,
            postalCode: postalCode || undefined,
          },
          lines: lines.map((l) => ({ productVariantId: l.id, quantity: l.quantity })),
        },
      });
      setResult(res.testShippingMethod);
      setStale(false);
    } catch (e) {
      alertError(e, 'Test failed');
    }
  };

  return (
    <>
      <Section
        title="Test"
        footer="Runs the checker and calculator above (including unsaved changes) against a sample order."
        action={
          <Button
            title="Add variants"
            size="sm"
            variant="ghost"
            onPress={async () => {
              const picked = await openPicker({
                title: 'Test order',
                source: variantPicker,
                multiple: true,
                selectedItems: lines,
              });
              if (!picked) return;
              setLines(picked.map((p) => lines.find((l) => l.id === p.id) ?? { ...p, quantity: 1 }));
              touch();
            }}
          />
        }>
        {lines.length === 0 ? (
          <ListRow title="No variants yet" subtitle="Add the variants a test order contains." />
        ) : (
          lines.map((l) => (
            <NumberRow
              key={l.id}
              label={l.code ? `${l.title} · ${l.code}` : l.title}
              integer
              value={l.quantity}
              hint="Quantity (0 removes the line)"
              onChange={(q) => {
                setLines((prev) =>
                  q === 0
                    ? prev.filter((x) => x.id !== l.id)
                    : prev.map((x) => (x.id === l.id ? { ...x, quantity: q ?? 1 } : x)),
                );
                touch();
              }}
            />
          ))
        )}
        <LinkRow
          label="Country"
          value={country ? `${country.title} (${country.code})` : undefined}
          onPress={async () => {
            const picked = await openPicker({ title: 'Shipping country', source: countryPicker });
            if (picked?.[0]) {
              setCountry(picked[0]);
              touch();
            }
          }}
        />
        <TextRow
          label="Postal code (optional)"
          value={postalCode}
          autoCapitalize="characters"
          onChangeText={(t) => {
            setPostalCode(t);
            touch();
          }}
        />
        <View style={{ padding: spacing[3] }}>
          <Button
            title={result ? 'Run test again' : 'Run test'}
            variant="secondary"
            disabled={!ready}
            loading={test.isPending}
            onPress={run}
          />
        </View>
      </Section>
      {result ? (
        <Section title={stale ? 'Result (out of date)' : 'Result'}>
          <ListRow
            title="Eligibility"
            trailing={
              <StatusBadge
                label={result.eligible ? 'Eligible' : 'Not eligible'}
                tone={result.eligible ? 'success' : 'warning'}
              />
            }
          />
          {result.quote ? (
            <>
              <ListRow title="Price" value={formatMoney(result.quote.price, currencyCode, precision)} />
              <ListRow title="Price with tax" value={formatMoney(result.quote.priceWithTax, currencyCode, precision)} />
              {result.quote.metadata ? (
                <View style={{ padding: spacing[4] }}>
                  <Text variant="mono" color="mutedForeground">
                    {JSON.stringify(result.quote.metadata, null, 2)}
                  </Text>
                </View>
              ) : null}
            </>
          ) : null}
        </Section>
      ) : null}
    </>
  );
}
