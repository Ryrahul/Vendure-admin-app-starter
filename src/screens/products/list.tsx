import { router } from 'expo-router';
import { useState } from 'react';

import { ProductListDocument } from '@/api/documents/products';
import { usePermissions } from '@/api/permissions';
import { useChannelInfo } from '@/api/use-channel-info';
import { EntityListScreen, FilterChips } from '@/components/screen-kit';
import { StatusBadge } from '@/components/status-badge';
import { Thumbnail } from '@/components/thumbnail';
import { formatMoney } from '@/utils/format';

type EnabledFilter = 'all' | 'enabled' | 'disabled';

const FILTERS: { value: EnabledFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'enabled', label: 'Enabled' },
  { value: 'disabled', label: 'Disabled' },
];

export function ProductListScreen() {
  const { precision } = useChannelInfo();
  const { can } = usePermissions();
  const [enabled, setEnabled] = useState<EnabledFilter>('all');

  return (
    <EntityListScreen
      document={ProductListDocument}
      // Same text filter the web dashboard uses: name, slug or SKU contains the term.
      variables={(term, skip, take) => ({
        options: {
          skip,
          take,
          sort: { updatedAt: 'DESC' as const },
          filter: {
            ...(enabled !== 'all' ? { enabled: { eq: enabled === 'enabled' } } : {}),
            ...(term ? { _or: [{ name: { contains: term } }, { slug: { contains: term } }, { sku: { contains: term } }] } : {}),
          },
        },
      })}
      select={(r) => r.products}
      noun={['product', 'products']}
      searchPlaceholder="Search name, slug or SKU"
      keyExtra={enabled}
      filters={<FilterChips value={enabled} options={FILTERS} onChange={setEnabled} />}
      createHref={can('CreateCatalog', 'CreateProduct') ? '/catalog/products/new' : undefined}
      row={(item) => {
        const variant = item.variantList.items[0];
        const variants = item.variantList.totalItems;
        return {
          leading: <Thumbnail preview={item.featuredAsset?.preview} preset="thumb" />,
          title: item.name,
          subtitle: `${variants} variant${variants === 1 ? '' : 's'}`,
          value: variant ? formatMoney(variant.priceWithTax, variant.currencyCode, precision) : undefined,
          trailing: item.enabled ? undefined : <StatusBadge label="Disabled" tone="neutral" />,
          onPress: () => router.push(`/catalog/products/${item.id}`),
        };
      }}
    />
  );
}
