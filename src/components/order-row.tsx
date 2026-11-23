import { router } from 'expo-router';

import { ListRow } from '@/components/list-row';
import { StatusBadge } from '@/components/status-badge';
import type { OrderListItemFragment } from '@/gql/graphql';
import { customerName, formatMoney, formatRelative } from '@/utils/format';

export function OrderRow({ order, precision = 2 }: { order: OrderListItemFragment; precision?: number }) {
  return (
    <ListRow
      title={customerName(order.customer)}
      code={order.code}
      subtitle={formatRelative(order.orderPlacedAt ?? order.updatedAt)}
      value={formatMoney(order.totalWithTax, order.currencyCode, precision)}
      trailing={<StatusBadge state={order.state} />}
      onPress={() => router.push(`/orders/${order.id}`)}
    />
  );
}
