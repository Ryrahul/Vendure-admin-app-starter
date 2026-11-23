/**
 * Modify order (simplified): change line quantities and add items, preview the new totals with
 * `modifyOrder(dryRun: true)`, then apply. A lower total is refunded across settled payments; a
 * higher one moves the order to ArrangingAdditionalPayment. Otherwise the order returns to the
 * state it was in before "Modifying" (read from the history, like the dashboard).
 */
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ModifyOrderDocument, OrderDetailDocument, OrderHistoryDocument, TransitionOrderToStateDocument } from '@/api/documents/orders';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { unwrapResult, useInvalidate } from '@/api/mutations';
import { openPicker } from '@/api/picker';
import { variantPicker } from '@/api/pickers/common';
import { useChannelInfo } from '@/api/use-channel-info';
import { Button } from '@/components/button';
import { SelectRow, TextRow } from '@/components/form/fields';
import { InlineError } from '@/components/inline-error';
import { ListRow } from '@/components/list-row';
import { FormScroll, QueryBoundary } from '@/components/screen-kit';
import { Section } from '@/components/section';
import type { ModifyOrderMutation } from '@/gql/graphql';
import { useTheme } from '@/theme';
import { alertError, confirm } from '@/utils/confirm';
import { formatMoney, humanizeState } from '@/utils/format';

import { ORDER_DOCS } from './detail';
import { QuantityRow, refundablePayments, type OrderDetail } from './parts';

type Preview = Extract<ModifyOrderMutation['modifyOrder'], { __typename: 'Order' }>;

/** A modification that was applied but whose follow-up state transition failed. */
type Stranded = { orderId: string; code: string; target: string; message: string };

export function ModifyOrderScreen({ id }: { id: string }) {
  const query = useVendureQuery(OrderDetailDocument, { id });
  const history = useVendureQuery(OrderHistoryDocument, {
    id,
    options: { take: 50, sort: { createdAt: 'DESC' as const }, filter: { type: { eq: 'ORDER_STATE_TRANSITION' } } },
  });
  const entry = history.data?.order?.history.items.find((h) => (h.data as { to?: string }).to === 'Modifying');
  const previousState = (entry?.data as { from?: string } | undefined)?.from;
  // Lives above the form: the form is keyed by `updatedAt` and remounts once the applied
  // modification refetches, which must not bring the Apply button back.
  const [stranded, setStranded] = useState<Stranded | null>(null);
  if (stranded) return <StrandedModification stranded={stranded} onRetried={() => setStranded(null)} />;
  return (
    <QueryBoundary query={query} pick={(d) => d.order} noun="order">
      {(order) =>
        order.state !== 'Modifying' ? (
          <View style={{ padding: 16 }}>
            <Stack.Screen options={{ title: 'Modify order' }} />
            <InlineError message={`Order ${order.code} is ${humanizeState(order.state)}, not Modifying. Start a modification from the order.`} />
          </View>
        ) : (
          <ModifyForm
            key={order.updatedAt}
            order={order}
            history={{
              state: previousState,
              loading: history.isLoading,
              error: history.isError && !history.data,
              retry: () => void history.refetch(),
            }}
            onStranded={setStranded}
          />
        )
      }
    </QueryBoundary>
  );
}

/** The modification is already saved; only offer the state transition, never a re-apply. */
function StrandedModification({ stranded, onRetried }: { stranded: Stranded; onRetried: () => void }) {
  const { spacing } = useTheme();
  const invalidate = useInvalidate();
  const transition = useVendureMutation(TransitionOrderToStateDocument);
  const [message, setMessage] = useState(stranded.message);
  const retry = async () => {
    try {
      unwrapResult((await transition.mutateAsync({ id: stranded.orderId, state: stranded.target })).transitionOrderToState);
      await invalidate(...ORDER_DOCS);
      onRetried();
      router.back();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : String(e));
    }
  };
  return (
    <FormScroll>
      <Stack.Screen options={{ title: `Modify ${stranded.code}` }} />
      <InlineError
        message={`The modification was applied, but the order could not move to ${humanizeState(stranded.target)}: ${message}\nDo not modify again; return the order to ${humanizeState(stranded.target)} instead, or change its state from the order.`}
      />
      <View style={{ gap: spacing[3] }}>
        <Button title={`Return order to ${humanizeState(stranded.target)}`} loading={transition.isPending} onPress={retry} />
        <Button title="Back to order" variant="ghost" disabled={transition.isPending} onPress={() => router.back()} />
      </View>
    </FormScroll>
  );
}

function ModifyForm({
  order,
  history,
  onStranded,
}: {
  order: OrderDetail;
  history: { state?: string; loading: boolean; error: boolean; retry: () => void };
  onStranded: (s: Stranded) => void;
}) {
  const { spacing } = useTheme();
  const { precision } = useChannelInfo();
  const money = (v: number) => formatMoney(v, order.currencyCode, precision);
  const invalidate = useInvalidate();
  const modify = useVendureMutation(ModifyOrderDocument);
  const transition = useVendureMutation(TransitionOrderToStateDocument);

  const [quantities, setQuantities] = useState<Record<string, number>>(() => Object.fromEntries(order.lines.map((l) => [l.id, l.quantity])));
  const [added, setAdded] = useState<{ id: string; title: string; quantity: number }[]>([]);
  const [note, setNote] = useState('');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);
  // Fallback when the history has no "→ Modifying" entry: the user picks the state to return to.
  const [chosenState, setChosenState] = useState<string | null>(null);
  const returnOptions = order.nextStates.filter((s) => s !== 'Modifying' && s !== 'Cancelled' && s !== 'ArrangingAdditionalPayment');
  const historyMissing = !history.loading && !history.error && !history.state;
  const previousState = history.state ?? (historyMissing ? (chosenState ?? undefined) : undefined);

  const adjust = order.lines.filter((l) => quantities[l.id] !== l.quantity).map((l) => ({ orderLineId: l.id, quantity: quantities[l.id] ?? 0 }));
  const addItems = added.filter((a) => a.quantity > 0).map((a) => ({ productVariantId: a.id, quantity: a.quantity }));
  const changed = adjust.length > 0 || addItems.length > 0;
  const input = {
    orderId: order.id,
    adjustOrderLines: adjust.length ? adjust : undefined,
    addItems: addItems.length ? addItems : undefined,
    note: note.trim() || undefined,
  };
  const reset = () => setPreview(null);

  const returnState = async (state: string) => {
    unwrapResult((await transition.mutateAsync({ id: order.id, state })).transitionOrderToState);
  };
  const diff = preview ? preview.totalWithTax - order.totalWithTax : 0;
  // A higher total goes to ArrangingAdditionalPayment; otherwise back to the pre-Modifying state.
  const target = diff > 0 ? 'ArrangingAdditionalPayment' : previousState;

  const runPreview = async () => {
    setBusy(true);
    try {
      const r = unwrapResult((await modify.mutateAsync({ input: { ...input, dryRun: true } })).modifyOrder);
      if (r.__typename === 'Order') setPreview(r);
    } catch (e) {
      alertError(e, 'Could not preview');
    } finally {
      setBusy(false);
    }
  };

  const apply = async () => {
    if (!preview || !target) return;
    const ok = await confirm({
      title: 'Apply modification?',
      message:
        diff > 0
          ? `The total increases by ${money(diff)}. The order moves to “Arranging additional payment”.`
          : diff < 0
            ? `The total decreases by ${money(-diff)}, which is refunded to the order’s settled payments.`
            : 'The total does not change.',
      confirmLabel: 'Apply',
      destructive: diff < 0,
    });
    if (!ok) return;
    setBusy(true);
    try {
      let refunds: { paymentId: string; amount: number; reason?: string }[] | undefined;
      if (diff < 0) {
        let remaining = -diff;
        refunds = [];
        for (const p of refundablePayments(order)) {
          const amount = Math.min(remaining, p.refundable);
          if (amount <= 0) continue;
          refunds.push({ paymentId: p.id, amount, reason: note.trim() || 'Order modification' });
          remaining -= amount;
        }
        if (remaining > 0) throw new Error(`Settled payments cannot cover a refund of ${money(-diff)}.`);
      }
      unwrapResult((await modify.mutateAsync({ input: { ...input, dryRun: false, refunds } })).modifyOrder);
    } catch (e) {
      await invalidate(...ORDER_DOCS);
      setBusy(false);
      alertError(e, 'Could not modify order');
      return;
    }
    // The modification is saved from here on; a failure below must never lead to a re-apply.
    try {
      await returnState(target);
    } catch (e) {
      onStranded({ orderId: order.id, code: order.code, target, message: e instanceof Error ? e.message : String(e) });
      await invalidate(...ORDER_DOCS);
      return;
    }
    await invalidate(...ORDER_DOCS);
    setBusy(false);
    router.back();
  };

  const cancelModification = async () => {
    if (!previousState) return;
    setBusy(true);
    try {
      await returnState(previousState);
      await invalidate(...ORDER_DOCS);
      router.back();
    } catch (e) {
      alertError(e, 'Could not leave Modifying');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: `Modify ${order.code}` }} />
      <FormScroll>
        <Section title="Lines" footer="Set a quantity to 0 to remove the line.">
          {order.lines.map((l) => (
            <QuantityRow
              key={l.id}
              label={l.productVariant.name}
              hint={`${l.productVariant.sku} · was ${l.quantity}`}
              value={quantities[l.id] ?? 0}
              onChange={(q) => {
                setQuantities((prev) => ({ ...prev, [l.id]: q }));
                reset();
              }}
            />
          ))}
          {added.map((a) => (
            <QuantityRow
              key={a.id}
              label={a.title}
              hint="New item"
              value={a.quantity}
              onChange={(q) => {
                setAdded((prev) => prev.map((x) => (x.id === a.id ? { ...x, quantity: q } : x)));
                reset();
              }}
            />
          ))}
          <View style={{ padding: spacing[3] }}>
            <Button
              title="Add item"
              size="sm"
              variant="secondary"
              onPress={async () => {
                const picked = await openPicker({ title: 'Add item', source: variantPicker });
                const v = picked?.[0];
                if (!v) return;
                setAdded((prev) => (prev.some((x) => x.id === v.id) ? prev : [...prev, { id: v.id, title: v.title, quantity: 1 }]));
                reset();
              }}
            />
          </View>
        </Section>
        <Section title="Note">
          <TextRow label="Note (optional)" value={note} onChangeText={setNote} multiline />
        </Section>
        {preview ? (
          <Section title="Preview">
            <ListRow title="Current total" value={money(order.totalWithTax)} />
            <ListRow title="New subtotal" value={money(preview.subTotalWithTax)} />
            <ListRow title="New shipping" value={money(preview.shippingWithTax)} />
            <ListRow title="New total" value={money(preview.totalWithTax)} />
            <ListRow
              title="Difference"
              value={`${preview.totalWithTax - order.totalWithTax >= 0 ? '+' : '−'}${money(Math.abs(preview.totalWithTax - order.totalWithTax))}`}
            />
          </Section>
        ) : null}
        {history.loading ? (
          <Section title="Return state">
            <ListRow title="Loading order history…" subtitle="Needed to find the state the order was in before Modifying." />
          </Section>
        ) : history.error ? (
          <Section title="Return state">
            <InlineError message="Could not load the order history, so the state to return to is unknown." />
            <View style={{ padding: spacing[3] }}>
              <Button title="Retry" size="sm" variant="secondary" onPress={history.retry} />
            </View>
          </Section>
        ) : historyMissing ? (
          <Section title="Return state" footer="The history does not show the state before Modifying. Choose where the order goes afterwards.">
            <SelectRow
              label="Return to"
              value={chosenState}
              options={returnOptions.map((s) => ({ value: s, label: humanizeState(s) }))}
              onChange={setChosenState}
            />
          </Section>
        ) : null}
        <View style={{ gap: spacing[3] }}>
          {preview ? (
            <Button title="Apply modification" loading={busy} disabled={!target} onPress={apply} />
          ) : (
            <Button title="Preview changes" loading={busy} disabled={!changed} onPress={runPreview} />
          )}
          <Button
            title={previousState ? `Cancel (back to ${humanizeState(previousState)})` : 'Cancel modification'}
            variant="ghost"
            disabled={busy || !previousState}
            onPress={cancelModification}
          />
        </View>
      </FormScroll>
    </>
  );
}
