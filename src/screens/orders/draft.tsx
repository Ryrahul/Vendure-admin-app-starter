/**
 * Draft order editor: customer (pick or create), lines (add / adjust / remove), shipping and
 * billing addresses (pick from the customer's addresses, enter, or unset), shipping method,
 * coupon codes, totals, custom fields, then "Complete draft" (→ ArrangingPayment) or delete.
 */
import { router, Stack } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { View } from 'react-native';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  AddItemToDraftOrderDocument,
  AdjustDraftOrderLineDocument,
  ApplyCouponCodeToDraftOrderDocument,
  DeleteDraftOrderDocument,
  DraftOrderDetailDocument,
  DraftOrderEligibleShippingMethodsDocument,
  RemoveCouponCodeFromDraftOrderDocument,
  RemoveDraftOrderLineDocument,
  SetCustomerForDraftOrderDocument,
  SetDraftOrderBillingAddressDocument,
  SetDraftOrderCustomFieldsDocument,
  SetDraftOrderShippingAddressDocument,
  SetDraftOrderShippingMethodDocument,
  UnsetDraftOrderBillingAddressDocument,
  UnsetDraftOrderShippingAddressDocument,
} from '@/api/documents/draft-orders';
import { OrderDetailDocument, OrderListDocument, TransitionOrderToStateDocument } from '@/api/documents/orders';
import { operationName, useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, unwrapResult, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { openPicker } from '@/api/picker';
import { customerPicker, variantPicker } from '@/api/pickers/common';
import { useChannelInfo } from '@/api/use-channel-info';
import { Button } from '@/components/button';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { TextRow } from '@/components/form/fields';
import { InlineError } from '@/components/inline-error';
import { ListRow } from '@/components/list-row';
import { DeleteSection, FormScroll, QueryBoundary } from '@/components/screen-kit';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import { Text } from '@/components/text';
import type { DraftOrderDetailQuery } from '@/gql/graphql';
import { useTheme } from '@/theme';
import { alertError, confirm } from '@/utils/confirm';
import { customerName, formatMoney, humanizeState } from '@/utils/format';
import { addressProblem, addressRows, emptyAddress, toAddressInput, toAddressValue, type AddressValue } from '@/screens/customers/address-fields';

import { ActionBar, addressLines, QuantityRow } from './parts';

type Draft = NonNullable<DraftOrderDetailQuery['order']>;

export function DraftOrderScreen({ id }: { id: string }) {
  const query = useVendureQuery(DraftOrderDetailDocument, { id });
  return (
    <QueryBoundary query={query} pick={(d) => d.order} noun="draft order">
      {(order) =>
        order.state !== 'Draft' ? (
          <View style={{ padding: 16, gap: 12 }}>
            <Stack.Screen options={{ title: order.code }} />
            <InlineError message={`This order is ${humanizeState(order.state)}, no longer a draft.`} />
            <Button title="Open order" onPress={() => router.replace(`/orders/${order.id}`)} />
          </View>
        ) : (
          <DraftEditor order={order} refetch={() => void query.refetch()} refreshing={query.isRefetching} />
        )
      }
    </QueryBoundary>
  );
}

function DraftEditor({ order, refetch, refreshing }: { order: Draft; refetch: () => void; refreshing: boolean }) {
  const { spacing } = useTheme();
  const { precision } = useChannelInfo();
  const { can } = usePermissions();
  // Mirrors the Vendure resolvers: draft mutations need CreateOrder, except adjustDraftOrderLine
  // (UpdateOrder); completing uses transitionOrderToState (UpdateOrder).
  const canEdit = can('CreateOrder');
  const canAdjustLines = canEdit && can('UpdateOrder');
  const canComplete = can('UpdateOrder');
  const money = (v: number) => formatMoney(v, order.currencyCode, precision);
  const invalidate = useInvalidate();
  const queryClient = useQueryClient();
  const orderId = order.id;

  const setCustomer = useVendureMutation(SetCustomerForDraftOrderDocument);
  const addItem = useVendureMutation(AddItemToDraftOrderDocument);
  const adjustLine = useVendureMutation(AdjustDraftOrderLineDocument);
  const removeLine = useVendureMutation(RemoveDraftOrderLineDocument);
  const setShippingAddress = useVendureMutation(SetDraftOrderShippingAddressDocument);
  const setBillingAddress = useVendureMutation(SetDraftOrderBillingAddressDocument);
  const unsetShippingAddress = useVendureMutation(UnsetDraftOrderShippingAddressDocument);
  const unsetBillingAddress = useVendureMutation(UnsetDraftOrderBillingAddressDocument);
  const setShippingMethod = useVendureMutation(SetDraftOrderShippingMethodDocument);
  const applyCoupon = useVendureMutation(ApplyCouponCodeToDraftOrderDocument);
  const removeCoupon = useVendureMutation(RemoveCouponCodeFromDraftOrderDocument);
  const transition = useVendureMutation(TransitionOrderToStateDocument);
  const remove = useVendureMutation(DeleteDraftOrderDocument);

  const hasShippingAddress = !!order.shippingAddress?.streetLine1;
  const methods = useVendureQuery(
    DraftOrderEligibleShippingMethodsDocument,
    { orderId },
    { enabled: order.lines.length > 0 && hasShippingAddress },
  );

  const [busy, setBusy] = useState<string | null>(null);
  const [newCustomer, setNewCustomer] = useState<{ firstName: string; lastName: string; emailAddress: string } | null>(null);
  const [coupon, setCoupon] = useState('');

  const refresh = () => invalidate(DraftOrderDetailDocument, DraftOrderEligibleShippingMethodsDocument, OrderListDocument);
  const act = async (key: string, fn: () => Promise<unknown>, errorTitle = 'Could not update draft') => {
    setBusy(key);
    try {
      await fn();
      await refresh();
      return true;
    } catch (e) {
      alertError(e, errorTitle);
      return false;
    } finally {
      setBusy(null);
    }
  };

  const chooseCustomer = async () => {
    const picked = await openPicker({ title: 'Customer', source: customerPicker });
    const c = picked?.[0];
    if (c) await act('customer', async () => unwrapResult((await setCustomer.mutateAsync({ orderId, customerId: c.id })).setCustomerForDraftOrder));
  };

  const addLine = async () => {
    const picked = await openPicker({ title: 'Add item', source: variantPicker });
    const v = picked?.[0];
    if (!v) return;
    const existing = order.lines.find((l) => l.productVariant.id === v.id);
    await act('lines', async () =>
      existing && canAdjustLines
        ? unwrapResult((await adjustLine.mutateAsync({ orderId, input: { orderLineId: existing.id, quantity: existing.quantity + 1 } })).adjustDraftOrderLine)
        : unwrapResult((await addItem.mutateAsync({ orderId, input: { productVariantId: v.id, quantity: 1 } })).addItemToDraftOrder),
    );
  };

  const changeQuantity = (lineId: string, quantity: number) =>
    act(`line-${lineId}`, async () =>
      quantity <= 0
        ? unwrapResult((await removeLine.mutateAsync({ orderId, orderLineId: lineId })).removeDraftOrderLine)
        : unwrapResult((await adjustLine.mutateAsync({ orderId, input: { orderLineId: lineId, quantity } })).adjustDraftOrderLine),
    );

  const complete = async () => {
    const problems = [
      !order.customer && 'a customer',
      !order.lines.length && 'at least one item',
      !hasShippingAddress && 'a shipping address',
      !order.shippingLines.length && 'a shipping method',
    ].filter(Boolean);
    if (problems.length) return alertError(new Error(`The draft needs ${problems.join(', ')}.`), 'Draft incomplete');
    if (!(await confirm({ title: 'Complete draft?', message: 'The order moves to “Arranging payment”. You can then add a payment.', confirmLabel: 'Complete' }))) return;
    const ok = await act('complete', async () => unwrapResult((await transition.mutateAsync({ id: orderId, state: 'ArrangingPayment' })).transitionOrderToState), 'Could not complete draft');
    if (ok) {
      // Refetch (not just mark stale) before navigating: orders/detail redirects Draft orders back
      // here, so it must not render from a cached Draft copy.
      await Promise.all([
        queryClient.refetchQueries({ queryKey: [operationName(OrderDetailDocument)] }),
        invalidate(OrderListDocument),
      ]);
      router.replace(`/orders/${orderId}`);
    }
  };

  const customerAddresses = order.customer?.addresses ?? [];

  return (
    <>
      <Stack.Screen options={{ title: `Draft ${order.code}` }} />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        <View style={{ gap: spacing[2] }}>
          <Text variant="metric">{money(order.totalWithTax)}</Text>
          <StatusBadge state={order.state} />
        </View>

        <Section title="Customer">
          {order.customer ? (
            <ListRow
              title={customerName(order.customer)}
              subtitle={order.customer.emailAddress}
              onPress={() => router.push(`/customers/${order.customer!.id}`)}
            />
          ) : (
            <Text variant="caption" color="mutedForeground" style={{ padding: spacing[4] }}>
              No customer yet.
            </Text>
          )}
          {newCustomer ? (
            <View>
              <TextRow label="First name" value={newCustomer.firstName} onChangeText={(t) => setNewCustomer({ ...newCustomer, firstName: t })} autoFocus />
              <TextRow label="Last name" value={newCustomer.lastName} onChangeText={(t) => setNewCustomer({ ...newCustomer, lastName: t })} />
              <TextRow
                label="Email"
                value={newCustomer.emailAddress}
                onChangeText={(t) => setNewCustomer({ ...newCustomer, emailAddress: t })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <ActionBar>
                <Button
                  title="Create and set"
                  size="sm"
                  loading={busy === 'customer'}
                  disabled={!newCustomer.firstName.trim() || !newCustomer.lastName.trim() || !newCustomer.emailAddress.trim()}
                  onPress={async () => {
                    const input = {
                      firstName: newCustomer.firstName.trim(),
                      lastName: newCustomer.lastName.trim(),
                      emailAddress: newCustomer.emailAddress.trim(),
                    };
                    const ok = await act('customer', async () => unwrapResult((await setCustomer.mutateAsync({ orderId, input })).setCustomerForDraftOrder));
                    if (ok) setNewCustomer(null);
                  }}
                />
                <Button title="Cancel" size="sm" variant="ghost" onPress={() => setNewCustomer(null)} />
              </ActionBar>
            </View>
          ) : canEdit ? (
            <ActionBar>
              <Button title={order.customer ? 'Change customer' : 'Choose customer'} size="sm" variant="secondary" loading={busy === 'customer'} onPress={chooseCustomer} />
              <Button title="New customer" size="sm" variant="ghost" onPress={() => setNewCustomer({ firstName: '', lastName: '', emailAddress: '' })} />
            </ActionBar>
          ) : null}
        </Section>

        <Section title={`Items (${order.totalQuantity})`}>
          {order.lines.map((l) => (
            <QuantityRow
              key={l.id}
              label={l.productVariant.name}
              hint={`${l.productVariant.sku} · ${money(l.discountedLinePriceWithTax)}`}
              value={l.quantity}
              disabled={!canAdjustLines || busy === `line-${l.id}`}
              onChange={(q) => {
                if (q > 0) return void changeQuantity(l.id, q);
                void confirm({ title: 'Remove line?', message: l.productVariant.name, confirmLabel: 'Remove', destructive: true }).then(
                  (ok) => ok && changeQuantity(l.id, 0),
                );
              }}
            />
          ))}
          {canEdit ? (
            <ActionBar>
              <Button title="Add item" size="sm" variant="secondary" loading={busy === 'lines'} onPress={addLine} />
            </ActionBar>
          ) : null}
        </Section>

        <AddressEditor
          title="Shipping address"
          address={order.shippingAddress}
          customerAddresses={customerAddresses}
          canEdit={canEdit}
          busy={busy === 'shipping-address'}
          onSet={(input) => act('shipping-address', () => setShippingAddress.mutateAsync({ orderId, input }))}
          onUnset={() => act('shipping-address', () => unsetShippingAddress.mutateAsync({ orderId }))}
        />
        <AddressEditor
          title="Billing address"
          address={order.billingAddress}
          customerAddresses={customerAddresses}
          canEdit={canEdit}
          busy={busy === 'billing-address'}
          sameAs={hasShippingAddress ? toAddressValue(order.shippingAddress) : undefined}
          onSet={(input) => act('billing-address', () => setBillingAddress.mutateAsync({ orderId, input }))}
          onUnset={() => act('billing-address', () => unsetBillingAddress.mutateAsync({ orderId }))}
        />

        <Section title="Shipping method">
          {!order.lines.length || !hasShippingAddress ? (
            <Text variant="caption" color="mutedForeground" style={{ padding: spacing[4] }}>
              Add items and a shipping address to see eligible methods.
            </Text>
          ) : methods.error ? (
            <InlineError message={methods.error.message} />
          ) : (
            (methods.data?.eligibleShippingMethodsForDraftOrder ?? []).map((m) => {
              const selected = order.shippingLines.some((s) => s.shippingMethod.id === m.id);
              return (
                <ListRow
                  key={m.id}
                  title={m.name}
                  code={m.code}
                  value={money(m.priceWithTax)}
                  trailing={selected ? <StatusBadge label="Selected" tone="info" /> : undefined}
                  chevron={false}
                  onPress={
                    canEdit && !selected && !busy
                      ? () => void act('shipping', async () => unwrapResult((await setShippingMethod.mutateAsync({ orderId, shippingMethodId: m.id })).setDraftOrderShippingMethod))
                      : undefined
                  }
                />
              );
            })
          )}
        </Section>

        <Section title="Coupon codes">
          {order.couponCodes.map((code) => (
            <ListRow
              key={code}
              title={code}
              subtitle={order.promotions.find((p) => p.couponCode === code)?.name}
              trailing={
                canEdit ? (
                  <Button
                    title="Remove"
                    size="sm"
                    variant="ghost"
                    onPress={() => void act('coupon', () => removeCoupon.mutateAsync({ orderId, couponCode: code }))}
                  />
                ) : undefined
              }
            />
          ))}
          {canEdit ? (
            <View>
              <TextRow label="Coupon code" value={coupon} onChangeText={setCoupon} autoCapitalize="characters" placeholder="Enter a code" />
              <ActionBar>
                <Button
                  title="Apply"
                  size="sm"
                  variant="secondary"
                  loading={busy === 'coupon'}
                  disabled={!coupon.trim()}
                  onPress={async () => {
                    const ok = await act(
                      'coupon',
                      async () => unwrapResult((await applyCoupon.mutateAsync({ orderId, couponCode: coupon.trim() })).applyCouponCodeToDraftOrder),
                      'Coupon not applied',
                    );
                    if (ok) setCoupon('');
                  }}
                />
              </ActionBar>
            </View>
          ) : null}
        </Section>

        <Section title="Totals">
          <ListRow title="Subtotal" value={money(order.subTotalWithTax)} />
          {order.discounts.map((d, i) => (
            <ListRow key={i} title={d.description} value={money(d.amountWithTax)} />
          ))}
          {order.shippingLines.map((s) => (
            <ListRow key={s.id} title={`Shipping · ${s.shippingMethod.name}`} value={money(s.priceWithTax)} />
          ))}
          <ListRow title="Tax" value={money(order.totalWithTax - order.total)} />
          <ListRow title="Total" value={money(order.totalWithTax)} />
        </Section>

        <DraftCustomFields key={order.updatedAt} order={order} canEdit={canEdit} onSaved={refresh} />

        {canComplete ? <Button title="Complete draft" loading={busy === 'complete'} onPress={complete} /> : null}

        <DeleteSection
          label="Delete draft"
          message={`Draft ${order.code} will be deleted.`}
          hidden={!can('DeleteOrder')}
          onDelete={async () => {
            assertDeleted((await remove.mutateAsync({ orderId })).deleteDraftOrder);
            await invalidate(OrderListDocument);
          }}
        />
      </FormScroll>
    </>
  );
}

type CustomerAddress = NonNullable<Draft['customer']>['addresses'] extends (infer A)[] | null | undefined ? A : never;

function AddressEditor({
  title,
  address,
  customerAddresses,
  canEdit,
  busy,
  sameAs,
  onSet,
  onUnset,
}: {
  title: string;
  address: Draft['shippingAddress'];
  customerAddresses: CustomerAddress[];
  canEdit: boolean;
  busy: boolean;
  sameAs?: AddressValue;
  onSet: (input: ReturnType<typeof toAddressInput>) => Promise<boolean>;
  onUnset: () => Promise<boolean>;
}) {
  const { spacing } = useTheme();
  const [editing, setEditing] = useState<AddressValue | null>(null);
  const lines = address?.streetLine1 ? addressLines(address) : [];

  const save = async (value: AddressValue) => {
    const problem = addressProblem(value);
    if (problem) return alertError(new Error(problem), 'Incomplete address');
    if (await onSet(toAddressInput(value))) setEditing(null);
  };

  if (editing) {
    return (
      <Section title={title}>
        {addressRows({ value: editing, onChange: setEditing })}
        <ActionBar>
          <Button title="Save address" size="sm" loading={busy} onPress={() => void save(editing)} />
          <Button title="Cancel" size="sm" variant="ghost" onPress={() => setEditing(null)} />
        </ActionBar>
      </Section>
    );
  }

  return (
    <Section title={title}>
      {lines.length ? (
        <Text style={{ padding: spacing[4] }}>{lines.join('\n')}</Text>
      ) : (
        <Text variant="caption" color="mutedForeground" style={{ padding: spacing[4] }}>
          Not set.
        </Text>
      )}
      {canEdit ? (
        <ActionBar>
          {customerAddresses.length ? (
            <Button
              title="From customer"
              size="sm"
              variant="secondary"
              loading={busy}
              onPress={async () => {
                const picked = await openPicker({
                  title: 'Customer address',
                  options: customerAddresses.map((a) => ({
                    id: a.id,
                    title: a.fullName || a.streetLine1,
                    subtitle: addressLines({ ...a, country: a.country.name }).join(', '),
                  })),
                });
                const a = customerAddresses.find((x) => x.id === picked?.[0]?.id);
                if (a) await onSet(toAddressInput(toAddressValue(a)));
              }}
            />
          ) : null}
          {sameAs ? <Button title="Same as shipping" size="sm" variant="secondary" loading={busy} onPress={() => void onSet(toAddressInput(sameAs))} /> : null}
          <Button
            title={lines.length ? 'Edit' : 'Enter address'}
            size="sm"
            variant="secondary"
            onPress={() => setEditing(lines.length ? toAddressValue(address) : { ...emptyAddress })}
          />
          {lines.length ? <Button title="Unset" size="sm" variant="ghost" loading={busy} onPress={() => void onUnset()} /> : null}
        </ActionBar>
      ) : null}
    </Section>
  );
}

function DraftCustomFields({ order, canEdit, onSaved }: { order: Draft; canEdit: boolean; onSaved: () => Promise<unknown> }) {
  const { spacing } = useTheme();
  const defs = useCustomFields('Order');
  const save = useVendureMutation(SetDraftOrderCustomFieldsDocument);
  const [values, setValues] = useState(() => customFieldValues(defs, order.customFields));
  const [dirty, setDirty] = useState(false);
  if (!defs.length) return null;
  return (
    <View style={{ gap: spacing[2] }}>
      <CustomFieldsSection
        defs={defs}
        values={values}
        readOnly={!canEdit}
        onChange={(k, v) => {
          setValues((prev) => ({ ...prev, [k]: v }));
          setDirty(true);
        }}
      />
      {canEdit && dirty ? (
        <Button
          title="Save custom fields"
          size="sm"
          loading={save.isPending}
          onPress={async () => {
            try {
              await save.mutateAsync({ orderId: order.id, input: { id: order.id, customFields: customFieldsInput(defs, values).customFields } });
              setDirty(false);
              await onSaved();
            } catch (e) {
              alertError(e, 'Could not save custom fields');
            }
          }}
        />
      ) : null}
    </View>
  );
}
