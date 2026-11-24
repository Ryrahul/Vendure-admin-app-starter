/** Cancel a whole order, or selected line quantities, with an optional shipping cancel and reason. */
import { router } from 'expo-router';
import { useState } from 'react';

import { CancelOrderDocument, OrderDetailDocument } from '@/api/documents/orders';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { unwrapResult, useInvalidate } from '@/api/mutations';
import { SwitchRow, TextRow } from '@/components/form/fields';
import { FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import { alertError, confirm } from '@/utils/confirm';

import { ORDER_DOCS } from './detail';
import { QuantityRow, type OrderDetail } from './parts';

export function CancelOrderScreen({ id }: { id: string }) {
  const query = useVendureQuery(OrderDetailDocument, { id });
  return (
    <QueryBoundary query={query} pick={(d) => d.order} noun="order">
      {(order) => <CancelForm order={order} />}
    </QueryBoundary>
  );
}

function CancelForm({ order }: { order: OrderDetail }) {
  const invalidate = useInvalidate();
  const cancel = useVendureMutation(CancelOrderDocument);
  const [whole, setWhole] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  // Shipping is only cancelled by default with the whole order; a partial cancel keeps it.
  const [cancelShipping, setCancelShipping] = useState(whole);
  const [reason, setReason] = useState('');
  const selected = Object.values(quantities).reduce((a, b) => a + b, 0);
  const ready = whole || selected > 0;

  const submit = async () => {
    if (!ready) return;
    const ok = await confirm({
      title: whole ? `Cancel order ${order.code}?` : `Cancel ${selected} item(s)?`,
      message:
        'Cancelled items are returned to stock. This cannot be undone. Settled payments must be refunded separately.',
      confirmLabel: whole ? 'Cancel order' : 'Cancel items',
      destructive: true,
    });
    if (!ok) return;
    try {
      unwrapResult(
        (
          await cancel.mutateAsync({
            input: {
              orderId: order.id,
              reason: reason.trim() || undefined,
              cancelShipping,
              lines: whole
                ? undefined
                : Object.entries(quantities)
                    .filter(([, q]) => q > 0)
                    .map(([orderLineId, quantity]) => ({ orderLineId, quantity })),
            },
          })
        ).cancelOrder,
      );
      await invalidate(...ORDER_DOCS);
      router.back();
    } catch (e) {
      alertError(e, 'Could not cancel');
    }
  };

  return (
    <>
      <SaveHeader
        title={`Cancel ${order.code}`}
        dirty={ready}
        saving={cancel.isPending}
        onSave={submit}
        label="Cancel…"
      />
      <FormScroll>
        <Section>
          <SwitchRow
            label="Cancel the whole order"
            value={whole}
            onValueChange={(on) => {
              setWhole(on);
              setCancelShipping(on);
            }}
          />
          <SwitchRow
            label="Cancel shipping"
            hint="Removes the shipping charge as well."
            value={cancelShipping}
            onValueChange={setCancelShipping}
          />
          <TextRow
            label="Reason (optional)"
            value={reason}
            onChangeText={setReason}
            multiline
            placeholder="Why is this being cancelled?"
          />
        </Section>
        {!whole ? (
          <Section title={`Items to cancel (${selected})`}>
            {order.lines
              .filter((l) => l.quantity > 0)
              .map((l) => (
                <QuantityRow
                  key={l.id}
                  label={l.productVariant.name}
                  hint={l.productVariant.sku}
                  value={quantities[l.id] ?? 0}
                  max={l.quantity}
                  onChange={(q) => setQuantities((prev) => ({ ...prev, [l.id]: q }))}
                />
              ))}
          </Section>
        ) : null}
      </FormScroll>
    </>
  );
}
