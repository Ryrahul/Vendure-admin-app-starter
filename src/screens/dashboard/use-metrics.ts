/**
 * 30-day order metrics for the Insights screen.
 *
 * Uses `metricSummary` when the server has it (AdminUiPlugin). Otherwise it computes the same
 * daily series from core `orders`, so the dashboard works on any Vendure server. The fallback
 * reads at most FALLBACK_LIMIT orders; `approximate` is true when there were more.
 */
import { useMemo, useState } from 'react';

import { DashboardMetricsDocument, DashboardOrderTotalsDocument } from '@/api/documents/dashboard';
import { useVendureQuery } from '@/api/hooks';

const DAYS = 30;
const FALLBACK_LIMIT = 1000;

export interface MetricEntry {
  label: string;
  value: number;
}

const isMissingField = (e: unknown) => e instanceof Error && /Cannot query field "metricSummary"/.test(e.message);

function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function useDashboardMetrics() {
  const metrics = useVendureQuery(DashboardMetricsDocument, undefined, { retry: (n, e) => !isMissingField(e) && n < 2 });
  const fallback = isMissingField(metrics.error);
  const [since] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (DAYS - 1));
    return d;
  });
  const totals = useVendureQuery(
    DashboardOrderTotalsDocument,
    { since: since.toISOString(), take: FALLBACK_LIMIT },
    { enabled: fallback },
  );

  const series = useMemo(() => {
    if (!fallback) {
      const byType = (t: string): MetricEntry[] => metrics.data?.metricSummary.find((m) => m.type === t)?.entries ?? [];
      return metrics.data ? { OrderCount: byType('OrderCount'), OrderTotal: byType('OrderTotal') } : undefined;
    }
    if (!totals.data) return undefined;
    const days = Array.from({ length: DAYS }, (_, i) => {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      return dayKey(d);
    });
    const count = new Map(days.map((k) => [k, 0]));
    const total = new Map(days.map((k) => [k, 0]));
    for (const o of totals.data.orders.items) {
      if (!o.orderPlacedAt) continue;
      const k = dayKey(new Date(o.orderPlacedAt));
      if (!count.has(k)) continue;
      count.set(k, count.get(k)! + 1);
      total.set(k, total.get(k)! + o.totalWithTax);
    }
    return {
      OrderCount: days.map((label) => ({ label, value: count.get(label)! })),
      OrderTotal: days.map((label) => ({ label, value: total.get(label)! })),
    };
  }, [fallback, metrics.data, totals.data, since]);

  const active = fallback ? totals : metrics;
  return {
    series,
    approximate: !!totals.data && totals.data.orders.totalItems > totals.data.orders.items.length,
    isLoading: metrics.isLoading || (fallback && totals.isLoading),
    isRefetching: active.isRefetching,
    error: fallback ? totals.error : metrics.error,
    refetch: () => void active.refetch(),
  };
}
