import { ActiveChannelDocument } from '@/api/documents/auth';
import { useVendureQuery } from '@/api/hooks';

/** Active channel currency + server money precision (for aggregates without a row currency). */
export function useChannelInfo() {
  const query = useVendureQuery(ActiveChannelDocument, undefined, { staleTime: 5 * 60_000 });
  return {
    ...query,
    channel: query.data?.activeChannel,
    currencyCode: query.data?.activeChannel.defaultCurrencyCode ?? 'USD',
    precision: query.data?.globalSettings.serverConfig.moneyStrategyPrecision ?? 2,
  };
}
