import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';

import { ProductListDocument } from '@/api/documents/products';
import { useVendureInfiniteList } from '@/api/hooks';
import { useChannelInfo } from '@/api/use-channel-info';
import { InlineError } from '@/components/inline-error';
import { ListRow } from '@/components/list-row';
import { EmptyState, ErrorState, LoadingState } from '@/components/screen-state';
import { SearchField } from '@/components/search-field';
import { groupedRowStyle } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import { Text } from '@/components/text';
import { Thumbnail } from '@/components/thumbnail';
import { PAGE_SIZE } from '@/constants';
import type { ProductListQueryVariables } from '@/gql/graphql';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTheme } from '@/theme';
import { formatMoney } from '@/utils/format';

/** Same filter the web dashboard uses: name, slug or SKU contains the term. */
function buildVariables(term: string, skip: number, take: number): ProductListQueryVariables {
  return {
    options: {
      skip,
      take,
      sort: { updatedAt: 'DESC' },
      ...(term
        ? { filter: { _or: [{ name: { contains: term } }, { slug: { contains: term } }, { sku: { contains: term } }] } }
        : {}),
    },
  };
}

export function ProductListScreen() {
  const theme = useTheme();
  const { colors, spacing } = theme;
  const { precision } = useChannelInfo();
  const [search, setSearch] = useState('');
  const term = useDebouncedValue(search.trim());

  const list = useVendureInfiniteList(
    ProductListDocument,
    (skip, take) => buildVariables(term, skip, take),
    (r) => r.products,
    PAGE_SIZE,
    term,
  );

  const header = (
    <View style={{ gap: spacing[3], paddingBottom: spacing[3] }}>
      <SearchField value={search} onChangeText={setSearch} placeholder="Search name, slug or SKU" />
      {list.error && list.items.length ? <InlineError message={list.error.message} /> : null}
      {list.data ? (
        <Text variant="caption" color="mutedForeground">
          {list.totalItems.toLocaleString()} product{list.totalItems === 1 ? '' : 's'}
        </Text>
      ) : null}
    </View>
  );

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      data={list.items}
      keyExtractor={(p) => p.id}
      ListHeaderComponent={header}
      contentContainerStyle={{ padding: spacing[4], flexGrow: 1 }}
      renderItem={({ item, index }) => {
        const variant = item.variantList.items[0];
        const variants = item.variantList.totalItems;
        return (
          <View style={groupedRowStyle(index, list.items.length, theme)}>
            <ListRow
              leading={<Thumbnail preview={item.featuredAsset?.preview} preset="thumb" />}
              title={item.name}
              subtitle={`${variants} variant${variants === 1 ? '' : 's'}`}
              value={variant ? formatMoney(variant.priceWithTax, variant.currencyCode, precision) : undefined}
              trailing={item.enabled ? undefined : <StatusBadge label="Disabled" tone="neutral" />}
              onPress={() => router.push(`/catalog/products/${item.id}`)}
            />
          </View>
        );
      }}
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        if (list.hasNextPage && !list.isFetchingNextPage) list.fetchNextPage();
      }}
      refreshControl={
        <RefreshControl refreshing={list.isRefetching && !list.isFetchingNextPage} onRefresh={() => void list.refetch()} />
      }
      ListEmptyComponent={
        list.isLoading || (list.isFetching && !list.data) ? (
          <LoadingState label="Loading products…" />
        ) : list.error ? (
          <ErrorState error={list.error} onRetry={() => void list.refetch()} />
        ) : term ? (
          <EmptyState
            title="No matching products"
            message={`Nothing matches “${term}”.`}
            icon={{ ios: 'magnifyingglass', android: 'search_off' }}
            actionTitle="Clear search"
            onAction={() => setSearch('')}
          />
        ) : (
          <EmptyState title="No products yet" message="Products created in Vendure appear here." />
        )
      }
      ListFooterComponent={
        list.isFetchingNextPage ? <ActivityIndicator style={{ padding: spacing[4] }} color={colors.mutedForeground} /> : undefined
      }
    />
  );
}
