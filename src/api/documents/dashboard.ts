import { graphql } from '@/gql';

/**
 * Daily order metrics for the last ~30 days. `metricSummary` is provided by the AdminUiPlugin,
 * not Vendure core, so the dashboard falls back to `DashboardOrderTotalsDocument` without it.
 */
export const DashboardMetricsDocument = graphql(`
  query DashboardMetrics {
    metricSummary(input: { interval: Daily, types: [OrderCount, OrderTotal, AverageOrderValue] }) {
      type
      title
      entries {
        label
        value
      }
    }
  }
`);

/**
 * Placed-order counts for "today" and "this month", plus the latest placed orders.
 * Mirrors the web dashboard widgets: placed orders only (`active: false`), no drafts / cancelled.
 */
export const DashboardOrdersDocument = graphql(`
  query DashboardOrders($today: DateTime!, $monthStart: DateTime!) {
    today: orders(
      options: {
        take: 0
        filter: { active: { eq: false }, orderPlacedAt: { after: $today }, state: { notIn: ["Draft", "Cancelled"] } }
      }
    ) {
      totalItems
    }
    month: orders(
      options: {
        take: 0
        filter: { active: { eq: false }, orderPlacedAt: { after: $monthStart }, state: { notIn: ["Draft", "Cancelled"] } }
      }
    ) {
      totalItems
    }
    latest: orders(
      options: {
        take: 6
        sort: { orderPlacedAt: DESC }
        filter: { active: { eq: false }, state: { notIn: ["Draft"] } }
      }
    ) {
      items {
        ...OrderListItem
      }
    }
  }
`);

/** Core-API fallback for the 30-day metrics: placed orders since a date (totals computed client-side). */
export const DashboardOrderTotalsDocument = graphql(`
  query DashboardOrderTotals($since: DateTime!, $take: Int!) {
    orders(
      options: {
        take: $take
        sort: { orderPlacedAt: DESC }
        filter: { active: { eq: false }, orderPlacedAt: { after: $since }, state: { notIn: ["Draft", "Cancelled"] } }
      }
    ) {
      totalItems
      items {
        id
        orderPlacedAt
        totalWithTax
      }
    }
  }
`);
