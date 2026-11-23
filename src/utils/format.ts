/**
 * Formatting helpers. Vendure stores money as integers in minor units; the divisor is
 * 10^moneyStrategyPrecision (2 by default). Currency always comes from the row's currencyCode.
 */
export function formatMoney(value: number | null | undefined, currencyCode: string, precision = 2) {
  if (value == null) return '—';
  const major = value / 10 ** precision;
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    }).format(major);
  } catch {
    // Older Hermes Intl builds may not know every currency.
    return `${currencyCode} ${major.toFixed(precision)}`;
  }
}

/** Compact money for metric tiles: NPR 1.2M */
export function formatMoneyCompact(value: number, currencyCode: string, precision = 2) {
  const major = value / 10 ** precision;
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(major);
  } catch {
    return `${currencyCode} ${major.toFixed(0)}`;
  }
}

export function formatDate(iso: string | null | undefined, withTime = true) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

/** "5m ago", "3h ago", "2d ago", then a short date. */
export function formatRelative(iso: string | null | undefined) {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  return formatDate(iso, false);
}

/** "PaymentSettled" -> "Payment settled" (mirrors the dashboard's fallback labels). */
export function humanizeState(state: string) {
  const words = state.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function customerName(c: { firstName?: string | null; lastName?: string | null } | null | undefined) {
  const name = [c?.firstName, c?.lastName].filter(Boolean).join(' ').trim();
  return name || 'Guest';
}

/** Strips HTML tags from Vendure rich-text descriptions. */
export function stripHtml(html: string | null | undefined) {
  return (html ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
