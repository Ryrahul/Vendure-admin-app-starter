/** Refundable-quantity math for the refund screen (pure, so the dev smoke can import it too). */

type RefundsShape = {
  payments?: { refunds: { state: string; lines: { orderLineId: string; quantity: number }[] }[] }[] | null;
};

/** Quantity of each line already in a non-failed refund. */
export function refundedQuantities(order: RefundsShape): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of order.payments ?? []) {
    for (const r of p.refunds) {
      if (r.state === 'Failed') continue;
      for (const l of r.lines) out[l.orderLineId] = (out[l.orderLineId] ?? 0) + l.quantity;
    }
  }
  return out;
}

/**
 * How many more units of a line can be refunded: the greater of the placed and current quantity
 * (cancelled units keep their placed quantity; units added by a modification only show in
 * `quantity`), minus what non-failed refunds already cover. Mirrors the dashboard's
 * getMaxRefundableQuantity.
 */
export function maxRefundableQuantity(line: { id: string; quantity: number; orderPlacedQuantity: number }, refunded: Record<string, number>) {
  return Math.max(0, Math.max(line.orderPlacedQuantity, line.quantity) - (refunded[line.id] ?? 0));
}
