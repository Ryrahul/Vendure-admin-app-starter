/** Fulfil an order: pick a fulfillment handler, fill its arguments and choose line quantities. */
import { router } from 'expo-router';
import { useState } from 'react';

import { FulfillmentHandlersDocument, FulfillOrderDocument, OrderDetailDocument } from '@/api/documents/orders';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { unwrapResult, useInvalidate } from '@/api/mutations';
import {
  defaultOperation,
  missingArgs,
  OperationEditor,
  type ConfigurableOperationInput,
  type OperationDefinition,
} from '@/components/form/configurable-operation';
import { FormScroll, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { Section } from '@/components/section';
import { alertError } from '@/utils/confirm';

import { ORDER_DOCS } from './detail';
import { fulfilledQuantities, QuantityRow, type OrderDetail } from './parts';

export function FulfilOrderScreen({ id }: { id: string }) {
  const order = useVendureQuery(OrderDetailDocument, { id });
  const handlers = useVendureQuery(FulfillmentHandlersDocument);
  return (
    <QueryBoundary query={order} pick={(d) => d.order} noun="order">
      {(o) => (
        <QueryBoundary query={handlers} pick={(d) => d.fulfillmentHandlers} noun="fulfillment handlers">
          {(defs) => <FulfilForm order={o} definitions={defs as OperationDefinition[]} />}
        </QueryBoundary>
      )}
    </QueryBoundary>
  );
}

function FulfilForm({ order, definitions }: { order: OrderDetail; definitions: OperationDefinition[] }) {
  const invalidate = useInvalidate();
  const fulfil = useVendureMutation(FulfillOrderDocument);
  const fulfilled = fulfilledQuantities(order);
  const remaining = (lineId: string, qty: number) => Math.max(0, qty - (fulfilled[lineId] ?? 0));

  const [op, setOp] = useState<ConfigurableOperationInput | null>(() => {
    const preferred = order.shippingLines[0]?.shippingMethod.fulfillmentHandlerCode;
    const def = definitions.find((d) => d.code === preferred) ?? definitions.find((d) => d.code === 'manual-fulfillment') ?? definitions[0];
    return def ? defaultOperation(def) : null;
  });
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(order.lines.map((l) => [l.id, remaining(l.id, l.quantity)])),
  );
  const total = Object.values(quantities).reduce((a, b) => a + b, 0);

  const submit = async () => {
    if (!op) return alertError(new Error('Choose a fulfillment handler.'), 'Missing handler');
    const missing = missingArgs(op, definitions);
    if (missing.length) return alertError(new Error(`Fill in: ${missing.join(', ')}`), 'Missing fields');
    if (total === 0) return alertError(new Error('Select at least one item to fulfil.'), 'Nothing to fulfil');
    try {
      unwrapResult(
        (
          await fulfil.mutateAsync({
            input: {
              handler: op,
              lines: Object.entries(quantities)
                .filter(([, q]) => q > 0)
                .map(([orderLineId, quantity]) => ({ orderLineId, quantity })),
            },
          })
        ).addFulfillmentToOrder,
      );
      await invalidate(...ORDER_DOCS);
      router.back();
    } catch (e) {
      alertError(e, 'Could not fulfil');
    }
  };

  return (
    <>
      <SaveHeader title={`Fulfil ${order.code}`} dirty={total > 0} saving={fulfil.isPending} onSave={submit} label="Fulfil" />
      <FormScroll>
        <Section title={`Items (${total})`} footer="Defaults to everything not yet fulfilled.">
          {order.lines.map((l) => {
            const max = remaining(l.id, l.quantity);
            return (
              <QuantityRow
                key={l.id}
                label={l.productVariant.name}
                hint={`${l.productVariant.sku} · ${fulfilled[l.id] ?? 0} of ${l.quantity} fulfilled`}
                value={quantities[l.id] ?? 0}
                max={max}
                disabled={max === 0}
                onChange={(q) => setQuantities((prev) => ({ ...prev, [l.id]: q }))}
              />
            );
          })}
        </Section>
        <OperationEditor title="Fulfillment handler" definitions={definitions} value={op} onChange={setOp} />
      </FormScroll>
    </>
  );
}
