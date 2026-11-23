import { router } from 'expo-router';

import { VariantListDocument } from '@/api/documents/variants';
import { useChannelInfo } from '@/api/use-channel-info';
import { EntityListScreen } from '@/components/screen-kit';
import { StatusBadge } from '@/components/status-badge';
import { Thumbnail } from '@/components/thumbnail';
import { formatMoney } from '@/utils/format';

export function VariantListScreen() {
  const { precision } = useChannelInfo();
  return (
    <EntityListScreen
      document={VariantListDocument}
      variables={(term, skip, take) => ({
        options: {
          skip,
          take,
          sort: { updatedAt: 'DESC' as const },
          ...(term ? { filter: { _or: [{ name: { contains: term } }, { sku: { contains: term } }] } } : {}),
        },
      })}
      select={(r) => r.productVariants}
      noun={['variant', 'variants']}
      searchPlaceholder="Search name or SKU"
      row={(v) => {
        const onHand = v.stockLevels.reduce((s, l) => s + l.stockOnHand, 0);
        return {
          leading: <Thumbnail preview={v.featuredAsset?.preview ?? v.product.featuredAsset?.preview} preset="thumb" />,
          title: v.name,
          code: v.sku,
          subtitle: `Stock ${onHand}`,
          value: formatMoney(v.priceWithTax, v.currencyCode, precision),
          trailing: v.enabled ? undefined : <StatusBadge label="Disabled" tone="neutral" />,
          onPress: () => router.push(`/catalog/variants/${v.id}`),
        };
      }}
    />
  );
}
