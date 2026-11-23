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

export function RefundOrderScreen({ id }: { id: string }) {
  const query = useVendureQuery(OrderDetailDocument, { id });
  return (
    <QueryBoundary query={query} pick={(d) => d.order} noun="order">
      {(order) => <RefundForm order={order} />}
    </QueryBoundary>
  );
}

function RefundForm({ order }: { order: OrderDetail }) {
  const { precision } = useChannelInfo();
  const money = (v: number) => formatMoney(v, order.currencyCode, precision);
  const invalidate = useInvalidate();
  const cancel = useVendureMutation(CancelOrderDocument);
  const refund = useVendureMutation(RefundOrderDocument);

  const payments = refundablePayments(order).filter((p) => p.refundable > 0);
  const [paymentId, setPaymentId] = useState<string | null>(payments[0]?.id ?? null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [shippingIds, setShippingIds] = useState<string[]>([]);
  const [adjustment, setAdjustment] = useState(0);
  const [reason, setReason] = useState('');
  const [cancelItems, setCancelItems] = useState(true);

  const itemsTotal = order.lines.reduce((sum, l) => sum + l.proratedUnitPriceWithTax * (quantities[l.id] ?? 0), 0);
  const shippingTotal = order.shippingLines.filter((s) => shippingIds.includes(s.id)).reduce((sum, s) => sum + s.discountedPriceWithTax, 0);
  const total = itemsTotal + shippingTotal + adjustment;
  const payment = payments.find((p) => p.id === paymentId);
  const lines = Object.entries(quantities)
    .filter(([, q]) => q > 0)
    .map(([orderLineId, quantity]) => ({ orderLineId, quantity }));

  const errors: string[] = [];
  if (total < 0) errors.push('The refund total cannot be negative.');
  if (payment && total > payment.refundable) errors.push(`The refund exceeds the refundable ${money(payment.refundable)} on this payment.`);
  const ready = !!payment && total > 0 && errors.length === 0 && !!reason.trim();

  const submit = async () => {
    if (!payment) return;
    if (!reason.trim()) return alertError(new Error('Enter a reason for the refund.'), 'Missing reason');
    if (!ready) return alertError(new Error(errors[0] ?? 'Select something to refund.'), 'Cannot refund');
    const ok = await confirm({
      title: `Refund ${money(total)}?`,
      message: `To ${payment.method}${cancelItems && lines.length ? '. Refunded items are cancelled and restocked.' : '.'} This cannot be undone.`,
      confirmLabel: 'Refund',
      destructive: true,
    });
    if (!ok) return;
    try {
      if (cancelItems && lines.length) {
        unwrapResult(
          (
            await cancel.mutateAsync({
              input: { orderId: order.id, lines, reason: reason.trim(), cancelShipping: shippingIds.length > 0 },
            })
          ).cancelOrder,
        );
      }
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
      await invalidate(...ORDER_DOCS);
      alertError(e, 'Could not refund');
    }
  };

  if (!payments.length) return <InlineError message="This order has no settled payment with a refundable balance." />;

  return (
    <>
      <SaveHeader title={`Refund ${order.code}`} dirty={ready} saving={cancel.isPending || refund.isPending} onSave={submit} label="Refund…" />
      <FormScroll>
        <Section title="Items">
          {order.lines
            .filter((l) => l.quantity > 0)
            .map((l) => (
              <QuantityRow
                key={l.id}
                label={l.productVariant.name}
                hint={`${money(l.proratedUnitPriceWithTax)} each`}
                value={quantities[l.id] ?? 0}
                max={l.quantity}
                onChange={(q) => setQuantities((prev) => ({ ...prev, [l.id]: q }))}
              />
            ))}
          <SwitchRow label="Cancel refunded items" hint="Removes them from the order and returns them to stock." value={cancelItems} onValueChange={setCancelItems} />
        </Section>
        {order.shippingLines.length ? (
          <Section title="Shipping">
            {order.shippingLines.map((s) => (
              <SwitchRow
                key={s.id}
                label={`${s.shippingMethod.name} · ${money(s.discountedPriceWithTax)}`}
                value={shippingIds.includes(s.id)}
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
