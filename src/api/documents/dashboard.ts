import { graphql } from '@/gql';

/** Daily order metrics for the last ~30 days (core Admin API `metricSummary`). */
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
