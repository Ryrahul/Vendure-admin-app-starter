/**
 * Refund: choose lines and quantities, shipping and an adjustment; the total is refunded to one
 * settled payment. Uses the v2.2+ `refundOrder` shape (`amount` + `paymentId`), with `lines`
 * recorded on the refund. Refunded items can be cancelled (restocked) first, like the dashboard.
 */
import { router } from 'expo-router';
import { useState } from 'react';

import { CancelOrderDocument, OrderDetailDocument, RefundOrderDocument } from '@/api/documents/orders';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { unwrapResult, useInvalidate } from '@/api/mutations';
import { useChannelInfo } from '@/api/use-channel-info';
import { MoneyRow, SelectRow, SwitchRow, TextRow, ValueRow } from '@/components/form/fields';
import { InlineError } from '@/components/inline-error';
import { FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import { alertError, confirm } from '@/utils/confirm';
import { formatMoney } from '@/utils/format';

import { ORDER_DOCS } from './detail';
import { QuantityRow, refundablePayments, type OrderDetail } from './parts';
import { maxRefundableQuantity, refundedQuantities } from './refundable';

export function RefundOrderScreen({ id }: { id: string }) {
  const query = useVendureQuery(OrderDetailDocument, { id });
  // Lives above the form so it survives a remount after the order refetches.
  const [cancelled, setCancelled] = useState<CancelledStep | null>(null);
  return (
    <QueryBoundary query={query} pick={(d) => d.order} noun="order">
      {(order) => <RefundForm order={order} cancelled={cancelled} onCancelled={setCancelled} />}
    </QueryBoundary>
  );
}

/**
 * The items were cancelled but the refund then failed. The selection and the amount are frozen
 * as they were at cancel time (cancelling shipping zeroes its price on refetch), and a retry
 * only sends the refund, never the cancel again.
 */
type CancelledStep = { quantities: Record<string, number>; shippingIds: string[]; base: number; message: string };

function RefundForm({
  order,
  cancelled,
  onCancelled,
}: {
  order: OrderDetail;
  cancelled: CancelledStep | null;
  onCancelled: (step: CancelledStep) => void;
}) {
  const { precision } = useChannelInfo();
  const money = (v: number) => formatMoney(v, order.currencyCode, precision);
  const invalidate = useInvalidate();
  const cancel = useVendureMutation(CancelOrderDocument);
  const refund = useVendureMutation(RefundOrderDocument);

  const payments = refundablePayments(order).filter((p) => p.refundable > 0);
  const [paymentId, setPaymentId] = useState<string | null>(payments[0]?.id ?? null);
  const [quantities, setQuantities] = useState<Record<string, number>>(() => cancelled?.quantities ?? {});
  const [shippingIds, setShippingIds] = useState<string[]>(() => cancelled?.shippingIds ?? []);
  const locked = !!cancelled;
  const [adjustment, setAdjustment] = useState(0);
  const [reason, setReason] = useState('');
  const [cancelItems, setCancelItems] = useState(true);

  const refunded = refundedQuantities(order);
  const refundableLines = order.lines
    .map((l) => ({ line: l, max: maxRefundableQuantity(l, refunded) }))
    .filter((x) => x.max > 0);
  const itemsTotal = order.lines.reduce((sum, l) => sum + l.proratedUnitPriceWithTax * (quantities[l.id] ?? 0), 0);
  const shippingTotal = order.shippingLines.filter((s) => shippingIds.includes(s.id)).reduce((sum, s) => sum + s.discountedPriceWithTax, 0);
  const base = cancelled ? cancelled.base : itemsTotal + shippingTotal;
  const total = base + adjustment;
  const payment = payments.find((p) => p.id === paymentId);
  const lines = Object.entries(quantities)
    .filter(([, q]) => q > 0)
    .map(([orderLineId, quantity]) => ({ orderLineId, quantity }));
  // Only units still on the order can be cancelled (some may have been cancelled already).
  const cancelLines = lines
    .map((l) => ({ ...l, quantity: Math.min(l.quantity, order.lines.find((x) => x.id === l.orderLineId)?.quantity ?? 0) }))
    .filter((l) => l.quantity > 0);

  const errors: string[] = [];
  for (const { line, max } of locked ? [] : refundableLines) {
    if ((quantities[line.id] ?? 0) > max) errors.push(`Only ${max} of ${line.productVariant.name} can still be refunded.`);
  }
  if (total < 0) errors.push('The refund total cannot be negative.');
  if (payment && total > payment.refundable) errors.push(`The refund exceeds the refundable ${money(payment.refundable)} on this payment.`);
  const ready = !!payment && total > 0 && errors.length === 0 && !!reason.trim();

  const submit = async () => {
    if (!payment) return;
    if (!reason.trim()) return alertError(new Error('Enter a reason for the refund.'), 'Missing reason');
    if (!ready) return alertError(new Error(errors[0] ?? 'Select something to refund.'), 'Cannot refund');
    const ok = await confirm({
      title: `Refund ${money(total)}?`,
      message: `To ${payment.method}${!locked && cancelItems && cancelLines.length ? '. Refunded items are cancelled and restocked.' : '.'} This cannot be undone.`,
      confirmLabel: 'Refund',
      destructive: true,
    });
    if (!ok) return;
    let justCancelled = false;
    try {
      if (!locked && cancelItems && cancelLines.length) {
        unwrapResult(
          (
            await cancel.mutateAsync({
              input: { orderId: order.id, lines: cancelLines, reason: reason.trim(), cancelShipping: shippingIds.length > 0 },
            })
          ).cancelOrder,
        );
        justCancelled = true;
      }
    } catch (e) {
      await invalidate(...ORDER_DOCS);
      return alertError(e, 'Could not cancel items');
    }
    try {
      unwrapResult(
        (
          await refund.mutateAsync({
            input: { paymentId: payment.id, amount: total, lines, shipping: 0, adjustment: 0, reason: reason.trim() },
          })
        ).refundOrder,
      );
      await invalidate(...ORDER_DOCS);
      router.back();
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      if (justCancelled || locked) {
        onCancelled({ quantities, shippingIds, base, message });
        await invalidate(...ORDER_DOCS);
        alertError(new Error(`The items were cancelled, but the refund failed: ${message}\nRetrying sends only the refund.`), 'Refund failed');
      } else {
        await invalidate(...ORDER_DOCS);
        alertError(e, 'Could not refund');
      }
    }
  };

  if (!payments.length) return <InlineError message="This order has no settled payment with a refundable balance." />;

  return (
    <>
      <SaveHeader title={`Refund ${order.code}`} dirty={ready} saving={cancel.isPending || refund.isPending} onSave={submit} label="Refund…" />
      <FormScroll>
        {cancelled ? (
          <InlineError
            message={`The selected items were already cancelled, but the refund failed: ${cancelled.message}\nRetrying sends only the refund of ${money(total)}; the items and shipping can no longer be changed.`}
          />
        ) : null}
        <Section title="Items">
          {refundableLines.map(({ line: l, max }) => (
            <QuantityRow
              key={l.id}
              label={l.productVariant.name}
              hint={`${money(l.proratedUnitPriceWithTax)} each${refunded[l.id] ? ` · ${refunded[l.id]} already refunded` : ''}`}
              value={quantities[l.id] ?? 0}
              max={max}
              disabled={locked}
              onChange={(q) => setQuantities((prev) => ({ ...prev, [l.id]: q }))}
            />
          ))}
          <SwitchRow label="Cancel refunded items" hint="Removes them from the order and returns them to stock." value={locked || cancelItems} onValueChange={setCancelItems} disabled={locked} />
        </Section>
        {order.shippingLines.length ? (
          <Section title="Shipping">
            {order.shippingLines.map((s) => (
              <SwitchRow
                key={s.id}
                label={`${s.shippingMethod.name} · ${money(s.discountedPriceWithTax)}`}
                value={shippingIds.includes(s.id)}
                disabled={locked}
                onValueChange={(on) => setShippingIds((prev) => (on ? [...prev, s.id] : prev.filter((x) => x !== s.id)))}
              />
            ))}
          </Section>
        ) : null}
        <Section title="Refund">
          <MoneyRow label="Adjustment" hint="Added to (or, if negative, taken from) the refund." value={adjustment} onChange={setAdjustment} currencyCode={order.currencyCode} precision={precision} />
          <SelectRow
            label="Payment"
            value={paymentId}
            options={payments.map((p) => ({ value: p.id, label: `${p.method} · ${money(p.refundable)} left` }))}
            onChange={setPaymentId}
          />
          <TextRow label="Reason" value={reason} onChangeText={setReason} placeholder="Required" />
          <ValueRow label="Refund total" value={money(total)} />
        </Section>
        {errors.length ? <InlineError message={errors.join('\n')} /> : null}
      </FormScroll>
    </>
  );
}
