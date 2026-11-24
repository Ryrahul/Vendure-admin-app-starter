/**
 * Order detail, most-used first: status + total, actions (add payment, fulfil, modify, refund,
 * cancel, state menu), customer, items, summary, payments (settle / cancel / transition / refunds
 * with settle), fulfillments (transitions), addresses, modifications, custom fields, info and the
 * history timeline with notes.
 */
import { Redirect, router, Stack } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  AddOrderNoteDocument,
  CancelPaymentDocument,
  DeleteOrderNoteDocument,
  OrderDetailDocument,
  OrderHistoryDocument,
  OrderListDocument,
  SetOrderCustomFieldsDocument,
  SettlePaymentDocument,
  SettleRefundDocument,
  TransitionFulfillmentDocument,
  TransitionOrderToStateDocument,
  TransitionPaymentToStateDocument,
  UpdateOrderNoteDocument,
} from '@/api/documents/orders';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, unwrapResult, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { openPicker } from '@/api/picker';
import { useChannelInfo } from '@/api/use-channel-info';
import { Button } from '@/components/button';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { TextRow, ValueRow } from '@/components/form/fields';
import { InlineError } from '@/components/inline-error';
import { ListRow } from '@/components/list-row';
import { ErrorState, LoadingState } from '@/components/screen-state';
import { useAfterTransition } from '@/hooks/use-after-transition';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import { Text } from '@/components/text';
import { Thumbnail } from '@/components/thumbnail';
import { useTheme } from '@/theme';
import { alertError, confirm } from '@/utils/confirm';
import { customerName, formatDate, formatMoney, humanizeState } from '@/utils/format';

import { HistoryTimeline } from './history';
import {
  ActionBar,
  addressLines,
  canAddFulfillment,
  canCancel,
  canRefund,
  fulfilledQuantities,
  paidAmount,
  type OrderDetail,
} from './parts';

const DESTRUCTIVE_STATES = new Set(['Cancelled', 'Declined', 'Error']);

/** Order mutation invalidation set. */
export const ORDER_DOCS = [OrderDetailDocument, OrderHistoryDocument, OrderListDocument];

export function OrderDetailScreen({ id }: { id: string }) {
  const query = useVendureQuery(OrderDetailDocument, { id });
  const order = query.data?.order;
  // Mount the (large) order body after the push transition; show a skeleton until then.
  const ready = useAfterTransition();

  if (query.isLoading || (!ready && order)) return <LoadingState variant="form" label="Loading order…" />;
  if (!order) {
    return query.error ? (
      <ErrorState error={query.error} onRetry={() => void query.refetch()} />
    ) : (
      <ErrorState error={new Error('This order does not exist in the active channel.')} />
    );
  }
  if (order.state === 'Draft') return <Redirect href={`/orders/draft/${order.id}`} />;
  return (
    <OrderBody order={order} refetch={() => void query.refetch()} refreshing={query.isRefetching} error={query.error} />
  );
}

function OrderBody({
  order,
  refetch,
  refreshing,
  error,
}: {
  order: OrderDetail;
  refetch: () => void;
  refreshing: boolean;
  error: Error | null;
}) {
  const { spacing } = useTheme();
  const { precision } = useChannelInfo();
  const { can } = usePermissions();
  const canUpdate = can('UpdateOrder');
  const invalidate = useInvalidate();
  const refreshAll = () => invalidate(...ORDER_DOCS);

  const transition = useVendureMutation(TransitionOrderToStateDocument);
  const settlePayment = useVendureMutation(SettlePaymentDocument);
  const cancelPayment = useVendureMutation(CancelPaymentDocument);
  const transitionPayment = useVendureMutation(TransitionPaymentToStateDocument);
  const settleRefund = useVendureMutation(SettleRefundDocument);
  const transitionFulfillment = useVendureMutation(TransitionFulfillmentDocument);
  const [busy, setBusy] = useState<string | null>(null);

  const money = (v: number) => formatMoney(v, order.currencyCode, precision);
  const shipping = addressLines(order.shippingAddress);
  const billing = addressLines(order.billingAddress);
  const fulfilled = fulfilledQuantities(order);
  const outstanding = order.totalWithTax - paidAmount(order);

  /** Runs a mutation with a busy marker, error alert and refetch. */
  const act = async (key: string, fn: () => Promise<unknown>, errorTitle = 'Could not update order') => {
    setBusy(key);
    try {
      await fn();
      await refreshAll();
    } catch (e) {
      alertError(e, errorTitle);
    } finally {
      setBusy(null);
    }
  };

  const transitionOrder = async (state: string) => {
    const destructive = DESTRUCTIVE_STATES.has(state);
    const ok = await confirm({
      title: `Move order to “${humanizeState(state)}”?`,
      message: destructive
        ? 'Cancelling an order cannot be undone.'
        : `The order is currently ${humanizeState(order.state)}.`,
      confirmLabel: humanizeState(state),
      destructive,
    });
    if (!ok) return;
    await act('state', async () => {
      const r = unwrapResult((await transition.mutateAsync({ id: order.id, state })).transitionOrderToState);
      return r;
    });
  };

  const openStateMenu = async () => {
    const states = order.nextStates.filter((s) => s !== 'Modifying');
    const picked = await openPicker({
      title: 'Change order state',
      options: states.map((s) => ({
        id: s,
        title: humanizeState(s),
        subtitle: DESTRUCTIVE_STATES.has(s) ? 'Cannot be undone' : undefined,
      })),
    });
    if (picked?.[0]) await transitionOrder(picked[0].id);
  };

  const startModify = async () => {
    if (order.state !== 'Modifying') {
      const ok = await confirm({
        title: 'Modify order?',
        message: 'The order moves to “Modifying” until you apply or cancel the changes.',
        confirmLabel: 'Modify',
      });
      if (!ok) return;
      setBusy('modify');
      try {
        unwrapResult((await transition.mutateAsync({ id: order.id, state: 'Modifying' })).transitionOrderToState);
        await refreshAll();
      } catch (e) {
        setBusy(null);
        return alertError(e, 'Could not start modifying');
      }
      setBusy(null);
    }
    router.push(`/orders/modify/${order.id}`);
  };

  const actions: { key: string; title: string; subtitle?: string; onPress: () => void }[] = [];
  if (canUpdate) {
    if (order.state === 'ArrangingPayment' || order.state === 'ArrangingAdditionalPayment') {
      actions.push({
        key: 'pay',
        title: 'Add payment',
        subtitle: outstanding > 0 ? `${money(outstanding)} outstanding` : undefined,
        onPress: () => router.push(`/orders/payment/${order.id}`),
      });
    }
    if (canAddFulfillment(order))
      actions.push({ key: 'fulfil', title: 'Fulfil', onPress: () => router.push(`/orders/fulfil/${order.id}`) });
    if (order.state === 'Modifying') actions.push({ key: 'modify', title: 'Continue modifying', onPress: startModify });
    else if (order.nextStates.includes('Modifying'))
      actions.push({ key: 'modify', title: 'Modify order', subtitle: 'Change line quantities', onPress: startModify });
    if (canRefund(order))
      actions.push({ key: 'refund', title: 'Refund', onPress: () => router.push(`/orders/refund/${order.id}`) });
    if (canCancel(order))
      actions.push({
        key: 'cancel',
        title: 'Cancel order or items',
        onPress: () => router.push(`/orders/cancel/${order.id}`),
      });
    if (order.nextStates.some((s) => s !== 'Modifying')) {
      actions.push({
        key: 'state',
        title: 'Change state…',
        subtitle: busy === 'state' ? 'Updating…' : `Currently ${humanizeState(order.state)}`,
        onPress: openStateMenu,
      });
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: order.code }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: spacing[4], gap: spacing[6], paddingBottom: spacing[12] }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}>
        {error ? <InlineError message={error.message} /> : null}

        {/* Status and total first: the code is already the screen title. */}
        <View style={{ gap: spacing[2] }}>
          <View style={{ flexDirection: 'row', gap: spacing[2], alignItems: 'center', flexWrap: 'wrap' }}>
            <StatusBadge state={order.state} />
            <Text variant="caption" color="mutedForeground">
              {order.orderPlacedAt
                ? `Placed ${formatDate(order.orderPlacedAt)}`
                : `Updated ${formatDate(order.updatedAt)}`}
            </Text>
          </View>
          <Text variant="metric">{money(order.totalWithTax)}</Text>
          <Text variant="caption" color="mutedForeground">
            {[
              `${order.totalQuantity} item${order.totalQuantity === 1 ? '' : 's'}`,
              outstanding > 0 && order.state !== 'Cancelled' ? `${money(outstanding)} outstanding` : '',
            ]
              .filter(Boolean)
              .join(' · ')}
          </Text>
        </View>

        {actions.length ? (
          <Section title="Actions">
            {actions.map((a) => (
              <ListRow
                key={a.key}
                title={a.title}
                subtitle={a.subtitle}
                onPress={busy ? undefined : a.onPress}
                chevron
              />
            ))}
          </Section>
        ) : null}

        <Section title="Customer">
          <ListRow
            title={customerName(order.customer)}
            subtitle={
              [order.customer?.emailAddress, order.customer?.phoneNumber].filter(Boolean).join(' · ') || undefined
            }
            onPress={order.customer ? () => router.push(`/customers/${order.customer!.id}`) : undefined}
          />
        </Section>

        <Section title={`Items (${order.totalQuantity})`}>
          {order.lines.map((line) => (
            <ListRow
              key={line.id}
              leading={<Thumbnail preview={line.featuredAsset?.preview} size={40} preset="tiny" />}
              title={line.productVariant.name}
              code={line.productVariant.sku}
              subtitle={[
                `${line.quantity} × ${money(line.unitPriceWithTax)}`,
                fulfilled[line.id] ? `${fulfilled[line.id]} fulfilled` : '',
                line.orderPlacedQuantity > line.quantity ? `${line.orderPlacedQuantity - line.quantity} cancelled` : '',
              ]
                .filter(Boolean)
                .join(' · ')}
              value={money(line.discountedLinePriceWithTax)}
            />
          ))}
        </Section>

        <Section title="Summary">
          <ListRow title="Subtotal" value={money(order.subTotalWithTax)} />
          {order.discounts.map((d, i) => (
            <ListRow key={i} title={d.description} value={money(d.amountWithTax)} />
          ))}
          {order.surcharges.map((s) => (
            <ListRow key={s.id} title={s.description} value={money(s.priceWithTax)} />
          ))}
          {order.shippingLines.map((s) => (
            <ListRow key={s.id} title={`Shipping · ${s.shippingMethod.name}`} value={money(s.discountedPriceWithTax)} />
          ))}
          <ListRow title="Tax" value={money(order.totalWithTax - order.total)} />
          <ListRow title="Total" value={money(order.totalWithTax)} />
          {order.couponCodes.length ? <ListRow title="Coupon codes" value={order.couponCodes.join(', ')} /> : null}
        </Section>

        {order.payments?.length ? (
          <Section title="Payments">
            {order.payments.map((p) => {
              const others = p.nextStates.filter((s) => s !== 'Settled' && s !== 'Cancelled');
              return (
                <View key={p.id}>
                  <ListRow
                    title={p.method}
                    code={p.transactionId ?? undefined}
                    subtitle={[formatDate(p.createdAt), p.errorMessage ?? '', metadataNote(p.metadata)]
                      .filter(Boolean)
                      .join(' · ')}
                    value={money(p.amount)}
                    trailing={<StatusBadge state={p.state} />}
                  />
                  {canUpdate && (p.state === 'Authorized' || p.nextStates.includes('Cancelled') || others.length) ? (
                    <ActionBar>
                      {p.state === 'Authorized' ? (
                        <Button
                          title="Settle"
                          size="sm"
                          loading={busy === `settle-${p.id}`}
                          onPress={async () => {
                            if (
                              !(await confirm({
                                title: 'Settle payment?',
                                message: `${money(p.amount)} via ${p.method}`,
                                confirmLabel: 'Settle',
                              }))
                            )
                              return;
                            await act(
                              `settle-${p.id}`,
                              async () => unwrapResult((await settlePayment.mutateAsync({ id: p.id })).settlePayment),
                              'Could not settle payment',
                            );
                          }}
                        />
                      ) : null}
                      {p.nextStates.includes('Cancelled') ? (
                        <Button
                          title="Cancel payment"
                          size="sm"
                          variant="secondary"
                          loading={busy === `cancel-${p.id}`}
                          onPress={async () => {
                            if (
                              !(await confirm({
                                title: 'Cancel payment?',
                                message: `${money(p.amount)} via ${p.method}. This cannot be undone.`,
                                confirmLabel: 'Cancel payment',
                                destructive: true,
                              }))
                            )
                              return;
                            await act(
                              `cancel-${p.id}`,
                              async () => unwrapResult((await cancelPayment.mutateAsync({ id: p.id })).cancelPayment),
                              'Could not cancel payment',
                            );
                          }}
                        />
                      ) : null}
                      {others.length ? (
                        <Button
                          title="Change state…"
                          size="sm"
                          variant="ghost"
                          loading={busy === `pstate-${p.id}`}
                          onPress={async () => {
                            const picked = await openPicker({
                              title: 'Payment state',
                              options: others.map((s) => ({ id: s, title: humanizeState(s) })),
                            });
                            const state = picked?.[0]?.id;
                            if (!state) return;
                            if (
                              !(await confirm({
                                title: `Move payment to “${humanizeState(state)}”?`,
                                confirmLabel: humanizeState(state),
                                destructive: DESTRUCTIVE_STATES.has(state),
                              }))
                            )
                              return;
                            await act(
                              `pstate-${p.id}`,
                              async () =>
                                unwrapResult(
                                  (await transitionPayment.mutateAsync({ id: p.id, state })).transitionPaymentToState,
                                ),
                              'Could not change payment state',
                            );
                          }}
                        />
                      ) : null}
                    </ActionBar>
                  ) : null}
                  {p.refunds.map((r) => (
                    <RefundRow
                      key={r.id}
                      refund={r}
                      money={money}
                      canSettle={canUpdate && r.state === 'Pending'}
                      busy={busy === `refund-${r.id}`}
                      onSettle={(transactionId) =>
                        act(
                          `refund-${r.id}`,
                          async () =>
                            unwrapResult(
                              (await settleRefund.mutateAsync({ input: { id: r.id, transactionId } })).settleRefund,
                            ),
                          'Could not settle refund',
                        )
                      }
                    />
                  ))}
                </View>
              );
            })}
            {outstanding > 0 && order.state !== 'Cancelled' ? (
              <ListRow title="Outstanding" value={money(outstanding)} />
            ) : null}
          </Section>
        ) : null}

        {order.fulfillments?.length ? (
          <Section title="Fulfillments">
            {order.fulfillments.map((f) => (
              <View key={f.id}>
                <ListRow
                  title={f.method || 'Fulfillment'}
                  code={f.trackingCode || undefined}
                  subtitle={`${f.lines.reduce((n, l) => n + l.quantity, 0)} item(s) · ${formatDate(f.createdAt)}`}
                  trailing={<StatusBadge state={f.state} />}
                />
                {canUpdate && f.nextStates.length ? (
                  <ActionBar>
                    {f.nextStates.map((s) => (
                      <Button
                        key={s}
                        title={humanizeState(s)}
                        size="sm"
                        variant={s === 'Cancelled' ? 'ghost' : 'secondary'}
                        loading={busy === `f-${f.id}-${s}`}
                        onPress={async () => {
                          const destructive = s === 'Cancelled';
                          if (
                            !(await confirm({
                              title: `Mark fulfillment as “${humanizeState(s)}”?`,
                              message: destructive ? 'The items become unfulfilled again.' : undefined,
                              confirmLabel: humanizeState(s),
                              destructive,
                            }))
                          )
                            return;
                          await act(
                            `f-${f.id}-${s}`,
                            async () =>
                              unwrapResult(
                                (await transitionFulfillment.mutateAsync({ id: f.id, state: s }))
                                  .transitionFulfillmentToState,
                              ),
                            'Could not update fulfillment',
                          );
                        }}
                      />
                    ))}
                  </ActionBar>
                ) : null}
              </View>
            ))}
          </Section>
        ) : null}

        {shipping.length || billing.length ? (
          <Section title="Addresses">
            {shipping.length ? <AddressBlock label="Shipping" lines={shipping} /> : null}
            {billing.length && billing.join() !== shipping.join() ? (
              <AddressBlock label="Billing" lines={billing} />
            ) : shipping.length && billing.length ? (
              <ListRow title="Billing" value="Same as shipping" />
            ) : null}
          </Section>
        ) : null}

        {order.modifications.length ? (
          <Section title="Modifications">
            {order.modifications.map((m) => (
              <ListRow
                key={m.id}
                title={m.note || 'Modification'}
                subtitle={formatDate(m.createdAt)}
                value={money(m.priceChange)}
                trailing={
                  <StatusBadge
                    label={m.isSettled ? 'Settled' : 'Unsettled'}
                    tone={m.isSettled ? 'neutral' : 'warning'}
                  />
                }
              />
            ))}
          </Section>
        ) : null}

        <OrderCustomFields key={order.updatedAt} order={order} canEdit={canUpdate} onSaved={refreshAll} />
        <LineCustomFields lines={order.lines} />

        <Section title="Info">
          <ValueRow label="ID" value={order.id} mono />
          <ValueRow label="Created" value={formatDate(order.createdAt)} />
          <ValueRow label="Updated" value={formatDate(order.updatedAt)} />
        </Section>

        <OrderHistory orderId={order.id} canNote={canUpdate} />
      </ScrollView>
    </>
  );
}

function AddressBlock({ label, lines }: { label: string; lines: string[] }) {
  const { spacing } = useTheme();
  return (
    <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[3], gap: spacing[1] }}>
      <Text variant="caption" color="mutedForeground">
        {label}
      </Text>
      <Text>{lines.join('\n')}</Text>
    </View>
  );
}

function metadataNote(metadata: unknown) {
  const m = metadata as { note?: unknown; public?: { note?: unknown } } | null;
  const note = m?.note ?? m?.public?.note;
  return typeof note === 'string' ? note : '';
}

function RefundRow({
  refund,
  money,
  canSettle,
  busy,
  onSettle,
}: {
  refund: NonNullable<OrderDetail['payments']>[number]['refunds'][number];
  money: (v: number) => string;
  canSettle: boolean;
  busy: boolean;
  onSettle: (transactionId: string) => Promise<unknown>;
}) {
  const { spacing } = useTheme();
  const [txId, setTxId] = useState('');
  return (
    <View>
      <ListRow
        title={`Refund${refund.reason ? ` · ${refund.reason}` : ''}`}
        code={refund.transactionId ?? undefined}
        subtitle={formatDate(refund.createdAt)}
        value={`−${money(refund.total)}`}
        trailing={<StatusBadge state={refund.state} />}
      />
      {canSettle ? (
        <View style={{ paddingBottom: spacing[2] }}>
          <TextRow
            label="Refund transaction ID"
            value={txId}
            onChangeText={setTxId}
            autoCapitalize="none"
            placeholder="Required to settle"
          />
          <ActionBar>
            <Button
              title="Settle refund"
              size="sm"
              loading={busy}
              disabled={!txId.trim()}
              onPress={() => void onSettle(txId.trim())}
            />
          </ActionBar>
        </View>
      ) : null}
    </View>
  );
}

function LineCustomFields({ lines }: { lines: OrderDetail['lines'] }) {
  const defs = useCustomFields('OrderLine');
  if (!defs.length) return null;
  return (
    <>
      {lines.map((line) => (
        <CustomFieldsSection
          key={line.id}
          title={`${line.productVariant.name} · fields`}
          defs={defs}
          values={customFieldValues(defs, line.customFields)}
          readOnly
          onChange={() => undefined}
        />
      ))}
    </>
  );
}

function OrderCustomFields({
  order,
  canEdit,
  onSaved,
}: {
  order: OrderDetail;
  canEdit: boolean;
  onSaved: () => Promise<unknown>;
}) {
  const { spacing } = useTheme();
  const defs = useCustomFields('Order');
  const save = useVendureMutation(SetOrderCustomFieldsDocument);
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
        <Section>
          <View style={{ padding: spacing[3] }}>
            <Button
              title="Save custom fields"
              size="sm"
              loading={save.isPending}
              onPress={async () => {
                try {
                  await save.mutateAsync({
                    input: { id: order.id, customFields: customFieldsInput(defs, values).customFields },
                  });
                  setDirty(false);
                  await onSaved();
                } catch (e) {
                  alertError(e, 'Could not save custom fields');
                }
              }}
            />
          </View>
        </Section>
      ) : null}
    </View>
  );
}

function OrderHistory({ orderId, canNote }: { orderId: string; canNote: boolean }) {
  const [take, setTake] = useState(50);
  const history = useVendureQuery(OrderHistoryDocument, {
    id: orderId,
    options: { take, sort: { createdAt: 'DESC' as const } },
  });
  const invalidate = useInvalidate();
  const add = useVendureMutation(AddOrderNoteDocument);
  const update = useVendureMutation(UpdateOrderNoteDocument);
  const remove = useVendureMutation(DeleteOrderNoteDocument);
  const refresh = () => invalidate(OrderHistoryDocument);
  const page = history.data?.order?.history;
  if (history.error && !page) return <InlineError message={history.error.message} />;
  return (
    <HistoryTimeline
      entries={page?.items ?? []}
      totalItems={page?.totalItems ?? 0}
      meId={history.data?.activeAdministrator?.id}
      canNote={canNote}
      withVisibility
      onLoadMore={() => setTake((t) => t + 50)}
      onAdd={async (note, isPublic) => {
        await add.mutateAsync({ input: { id: orderId, note, isPublic } });
        await refresh();
      }}
      onUpdate={async (noteId, note, isPublic) => {
        await update.mutateAsync({ input: { noteId, note, isPublic } });
        await refresh();
      }}
      onDelete={async (noteId) => {
        assertDeleted((await remove.mutateAsync({ id: noteId })).deleteOrderNote);
        await refresh();
      }}
    />
  );
}
