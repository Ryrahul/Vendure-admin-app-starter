import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

import { DashboardOrdersDocument } from '@/api/documents/dashboard';
import { useVendureQuery } from '@/api/hooks';
import { useChannelInfo } from '@/api/use-channel-info';
import { Button } from '@/components/button';
import { InlineError } from '@/components/inline-error';
import { OrderRow } from '@/components/order-row';
import { EmptyState, ErrorState, LoadingState } from '@/components/screen-state';
import { Section } from '@/components/section';
import { useTheme } from '@/theme';
import { formatMoneyCompact } from '@/utils/format';

import { BarChart } from './bar-chart';
import { MetricTile } from './metric-tile';
import { useDashboardMetrics } from './use-metrics';

function periodStarts() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return { today: today.toISOString(), monthStart: monthStart.toISOString() };
}

export function DashboardScreen() {
  const { spacing } = useTheme();
  const [periods] = useState(periodStarts);
  const [chartType, setChartType] = useState<'OrderCount' | 'OrderTotal'>('OrderTotal');
  const channel = useChannelInfo();
  const metrics = useDashboardMetrics();
  const orders = useVendureQuery(DashboardOrdersDocument, periods);

  const summary = useMemo(() => {
    const count = (metrics.series?.OrderCount ?? []).reduce((s, e) => s + e.value, 0);
    const total = (metrics.series?.OrderTotal ?? []).reduce((s, e) => s + e.value, 0);
    return { count, total, aov: count ? total / count : 0, series: metrics.series?.[chartType] ?? [] };
  }, [metrics.series, chartType]);

  const money = (v: number) => formatMoneyCompact(v, channel.currencyCode, channel.precision);
  const refreshing = (metrics.isRefetching || orders.isRefetching) && !metrics.isLoading;
  const onRefresh = () => {
    metrics.refetch();
    orders.refetch();
    channel.refetch();
  };

  if (metrics.isLoading && orders.isLoading) return <LoadingState variant="form" label="Loading insights…" />;
  if (!metrics.series && !orders.data && (metrics.error || orders.error)) {
    return <ErrorState error={metrics.error ?? orders.error} onRetry={onRefresh} />;
  }

  const latest = orders.data?.latest.items ?? [];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: spacing[4], gap: spacing[6], paddingBottom: spacing[12] }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {metrics.error || orders.error ? (
        <InlineError message={(metrics.error ?? orders.error)?.message ?? 'Refresh failed'} />
      ) : null}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] }}>
        <MetricTile label="Orders today" value={String(orders.data?.today.totalItems ?? '—')} />
        <MetricTile label="Orders this month" value={String(orders.data?.month.totalItems ?? '—')} />
        <MetricTile
          label="Revenue · 30 days"
          value={metrics.series ? money(summary.total) : '—'}
          hint={`${summary.count}${metrics.approximate ? '+' : ''} orders`}
        />
        <MetricTile label="Avg. order value" value={metrics.series ? money(summary.aov) : '—'} hint="Last 30 days" />
      </View>

      {summary.series.length ? (
        <Section
          title={chartType === 'OrderTotal' ? 'Daily revenue' : 'Daily orders'}
          action={
            <Button
              size="sm"
              variant="ghost"
              title={chartType === 'OrderTotal' ? 'Show orders' : 'Show revenue'}
              onPress={() => setChartType((t) => (t === 'OrderTotal' ? 'OrderCount' : 'OrderTotal'))}
            />
          }>
          <BarChart
            data={summary.series}
            formatValue={(v) => (chartType === 'OrderTotal' ? money(v) : String(Math.round(v)))}
          />
        </Section>
      ) : null}

      <Section
        title="Latest orders"
        action={<Button size="sm" variant="ghost" title="View all" onPress={() => router.navigate('/orders')} />}>
        {latest.length ? (
          latest.map((o) => <OrderRow key={o.id} order={o} precision={channel.precision} />)
        ) : (
          <EmptyState title="No orders yet" message="Placed orders will show up here." />
        )}
      </Section>
    </ScrollView>
  );
}
