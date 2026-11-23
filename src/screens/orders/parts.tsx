/** Small pieces shared by the order screens (detail, fulfil, cancel, refund, modify, drafts). */
import { Pressable, StyleSheet, View } from 'react-native';

import { FieldShell } from '@/components/form/fields';
import { Icon } from '@/components/icon';
import { Text } from '@/components/text';
import type { OrderDetailQuery } from '@/gql/graphql';
import { useTheme } from '@/theme';

export type OrderDetail = NonNullable<OrderDetailQuery['order']>;

type Address = Partial<
  Record<'fullName' | 'company' | 'streetLine1' | 'streetLine2' | 'city' | 'province' | 'postalCode' | 'country' | 'phoneNumber', string | null>
> | null | undefined;

export function addressLines(a: Address) {
  if (!a) return [];
  return [
    a.fullName,
    a.company,
    a.streetLine1,
    a.streetLine2,
    [a.city, a.province, a.postalCode].filter(Boolean).join(', '),
    a.country,
    a.phoneNumber,
  ].filter((l): l is string => !!l && l.trim().length > 0);
}

/** Quantity of each line already in a non-cancelled fulfillment. */
export function fulfilledQuantities(order: Pick<OrderDetail, 'fulfillments' | 'lines'>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const f of order.fulfillments ?? []) {
    if (f.state === 'Cancelled') continue;
    for (const l of f.lines) out[l.orderLineId] = (out[l.orderLineId] ?? 0) + l.quantity;
  }
  return out;
}

/** Settled payments with what can still be refunded from each (amount minus non-failed refunds). */
export function refundablePayments(order: Pick<OrderDetail, 'payments'>) {
  return (order.payments ?? [])
    .filter((p) => p.state === 'Settled')
    .map((p) => {
      const refunded = p.refunds.filter((r) => r.state !== 'Failed').reduce((sum, r) => sum + r.total, 0);
      return { ...p, refundable: Math.max(0, p.amount - refunded) };
    });
}

/** Total of non-declined/cancelled payments, used for "outstanding" amounts. */
export function paidAmount(order: Pick<OrderDetail, 'payments'>) {
  return (order.payments ?? [])
    .filter((p) => p.state !== 'Declined' && p.state !== 'Cancelled' && p.state !== 'Error')
    .reduce((sum, p) => sum + p.amount, 0);
}

export function canAddFulfillment(order: OrderDetail) {
  const fulfilled = fulfilledQuantities(order);
  const unfulfilled = order.lines.some((l) => (fulfilled[l.id] ?? 0) < l.quantity);
  const fulfillable =
    ['Shipped', 'PartiallyShipped', 'Delivered'].some((s) => order.nextStates.includes(s)) &&
    order.state !== 'ArrangingAdditionalPayment';
  return unfulfilled && fulfillable && order.modifications.every((m) => m.isSettled);
}

export function canRefund(order: OrderDetail) {
  return order.type !== 'Aggregate' && !order.active && order.state !== 'PaymentAuthorized' && refundablePayments(order).some((p) => p.refundable > 0);
}

export function canCancel(order: OrderDetail) {
  return order.type === 'Regular' && !order.active && order.nextStates.includes('Cancelled');
}

/** −/+ stepper row for line quantities. */
export function QuantityRow({
  label,
  hint,
  value,
  min = 0,
  max,
  onChange,
  disabled,
}: {
  label: string;
  hint?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const { colors, radius, spacing } = useTheme();
  const button = (delta: number, ios: 'minus' | 'plus', android: 'remove' | 'add') => {
    const next = value + delta;
    const blocked = disabled || next < min || (max != null && next > max);
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${delta < 0 ? 'Decrease' : 'Increase'} ${label}`}
        disabled={blocked}
        hitSlop={6}
        onPress={() => onChange(next)}
        style={({ pressed }) => [
          styles.step,
          {
            borderRadius: radius.md,
            borderColor: colors.controlBorder,
            backgroundColor: pressed ? colors.accent : colors.surfaceRaised,
            opacity: blocked ? 0.4 : 1,
          },
        ]}>
        <Icon ios={ios} android={android} size={16} color="foreground" />
      </Pressable>
    );
  };
  return (
    <FieldShell label={label} hint={hint} inline>
      <View style={[styles.stepper, { gap: spacing[2] }]}>
        {button(-1, 'minus', 'remove')}
        <Text variant="bodyMedium" style={styles.value} accessibilityLabel={`${label} quantity ${value}`}>
          {value}
          {max != null ? <Text variant="caption" color="mutedForeground">{` / ${max}`}</Text> : null}
        </Text>
        {button(1, 'plus', 'add')}
      </View>
    </FieldShell>
  );
}

/** A row of small buttons under a list row (payment / fulfillment actions). */
export function ActionBar({ children }: { children: React.ReactNode }) {
  const { spacing } = useTheme();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], paddingHorizontal: spacing[4], paddingBottom: spacing[3] }}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  stepper: { flexDirection: 'row', alignItems: 'center' },
  step: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth * 2 },
  value: { minWidth: 48, textAlign: 'center' },
});
