import { Stack } from 'expo-router';
import { RefreshControl, ScrollView, View } from 'react-native';

import { OrderDetailDocument } from '@/api/documents/orders';
import { useVendureQuery } from '@/api/hooks';
import { useChannelInfo } from '@/api/use-channel-info';
import { InlineError } from '@/components/inline-error';
import { ListRow } from '@/components/list-row';
import { ErrorState, LoadingState } from '@/components/screen-state';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import { Text } from '@/components/text';
import { Thumbnail } from '@/components/thumbnail';
import { useTheme } from '@/theme';
import { customerName, formatDate, formatMoney, humanizeState } from '@/utils/format';

type Address = Partial<Record<'fullName' | 'company' | 'streetLine1' | 'streetLine2' | 'city' | 'province' | 'postalCode' | 'country' | 'phoneNumber', string | null>> | null;

function addressLines(a: Address) {
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

export function OrderDetailScreen({ id }: { id: string }) {
  const { spacing } = useTheme();
  const { precision } = useChannelInfo();
  const query = useVendureQuery(OrderDetailDocument, { id });
  const order = query.data?.order;

  if (query.isLoading) return <LoadingState label="Loading order…" />;
  if (!order) {
    return query.error ? (
      <ErrorState error={query.error} onRetry={() => void query.refetch()} />
    ) : (
      <ErrorState error={new Error('This order does not exist in the active channel.')} />
    );
  }

  const money = (v: number) => formatMoney(v, order.currencyCode, precision);
  const shipping = addressLines(order.shippingAddress);
  const billing = addressLines(order.billingAddress);

  return (
    <>
      <Stack.Screen options={{ title: order.code }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: spacing[4], gap: spacing[6] }}
        refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} />}>
        {query.error ? <InlineError message={query.error.message} /> : null}

        <View style={{ gap: spacing[2] }}>
          <Text variant="mono" color="mutedForeground">
            {order.code}
          </Text>
          <Text variant="metric">{money(order.totalWithTax)}</Text>
          <View style={{ flexDirection: 'row', gap: spacing[2], alignItems: 'center', flexWrap: 'wrap' }}>
            <StatusBadge state={order.state} />
            <Text variant="caption" color="mutedForeground">
              {order.orderPlacedAt ? `Placed ${formatDate(order.orderPlacedAt)}` : `Updated ${formatDate(order.updatedAt)}`}
            </Text>
          </View>
        </View>

        <Section title={`Items (${order.totalQuantity})`}>
          {order.lines.map((line) => (
            <ListRow
              key={line.id}
              leading={<Thumbnail preview={line.featuredAsset?.preview} size={40} preset="tiny" />}
              title={line.productVariant.name}
              code={line.productVariant.sku}
              subtitle={`${line.quantity} × ${money(line.unitPriceWithTax)}`}
              value={money(line.linePriceWithTax)}
            />
          ))}
        </Section>

        <Section title="Summary">
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

        <Section title="Customer">
          <ListRow
            title={customerName(order.customer)}
            subtitle={[order.customer?.emailAddress, order.customer?.phoneNumber].filter(Boolean).join(' · ') || undefined}
          />
        </Section>

        {shipping.length ? (
          <Section title="Shipping address">
            <Text style={{ padding: spacing[4] }}>{shipping.join('\n')}</Text>
          </Section>
        ) : null}
        {billing.length && billing.join() !== shipping.join() ? (
          <Section title="Billing address">
            <Text style={{ padding: spacing[4] }}>{billing.join('\n')}</Text>
          </Section>
        ) : null}

        {order.payments?.length ? (
          <Section title="Payments">
            {order.payments.map((p) => (
              <ListRow
                key={p.id}
                title={p.method}
                code={p.transactionId ?? undefined}
                subtitle={formatDate(p.createdAt)}
                value={money(p.amount)}
                trailing={<StatusBadge state={p.state} />}
              />
            ))}
          </Section>
        ) : null}

        {order.fulfillments?.length ? (
          <Section title="Fulfillments">
            {order.fulfillments.map((f) => (
              <ListRow
                key={f.id}
                title={f.method}
                code={f.trackingCode ?? undefined}
                subtitle={formatDate(f.createdAt)}
                trailing={<StatusBadge state={f.state} />}
              />
            ))}
          </Section>
        ) : null}

        {order.nextStates.length ? (
          <Text variant="caption" color="mutedForeground">
            Next possible states: {order.nextStates.map(humanizeState).join(', ')}. State changes are left to the
            web dashboard in this starter.
          </Text>
        ) : null}
      </ScrollView>
    </>
  );
}
