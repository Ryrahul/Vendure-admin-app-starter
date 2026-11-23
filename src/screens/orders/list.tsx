import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, ScrollView, View } from 'react-native';

import { CreateDraftOrderDocument } from '@/api/documents/draft-orders';
import { OrderListDocument } from '@/api/documents/orders';
import { useVendureInfiniteList, useVendureMutation } from '@/api/hooks';
import { useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { useChannelInfo } from '@/api/use-channel-info';
import { InlineError } from '@/components/inline-error';
import { OrderRow } from '@/components/order-row';
import { HeaderIconButton } from '@/components/screen-kit';
import { EmptyState, ErrorState, LoadingState } from '@/components/screen-state';
import { SearchField } from '@/components/search-field';
import { groupedRowStyle } from '@/components/section';
import { Text } from '@/components/text';
import { PAGE_SIZE } from '@/constants';
import type { OrderListQueryVariables } from '@/gql/graphql';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTheme } from '@/theme';
import { alertError } from '@/utils/confirm';

/** Quick state filters. "Placed" hides carts and drafts, like the dashboard widgets do. */
const FILTERS = [
  { key: 'placed', label: 'Placed' },
  { key: 'PaymentAuthorized', label: 'Authorized' },
  { key: 'PaymentSettled', label: 'Settled' },
  { key: 'Shipped', label: 'Shipped' },
  { key: 'Delivered', label: 'Delivered' },
  { key: 'Cancelled', label: 'Cancelled' },
  { key: 'Draft', label: 'Drafts' },
  { key: 'all', label: 'All' },
] as const;
type FilterKey = (typeof FILTERS)[number]['key'];

function buildVariables(filter: FilterKey, term: string, skip: number, take: number): OrderListQueryVariables {
  const stateFilter =
    filter === 'all'
      ? {}
      : filter === 'placed'
        ? { active: { eq: false }, state: { notIn: ['Draft'] } }
        : { state: { eq: filter } };
  const search = term
    ? { _or: [{ code: { contains: term } }, { customerLastName: { contains: term } }, { transactionId: { contains: term } }] }
    : {};
  return {
    options: {
      skip,
      take,
      sort: filter === 'all' || filter === 'Draft' ? { updatedAt: 'DESC' } : { orderPlacedAt: 'DESC' },
      filter: { ...stateFilter, ...search },
    },
  };
}

export function OrderListScreen() {
  const theme = useTheme();
  const { colors, radius, spacing } = theme;
  const { precision } = useChannelInfo();
  const [filter, setFilter] = useState<FilterKey>('placed');
  const [search, setSearch] = useState('');
  const term = useDebouncedValue(search.trim());
  const { can } = usePermissions();
  const invalidate = useInvalidate();
  const createDraft = useVendureMutation(CreateDraftOrderDocument);
  const newDraft = async () => {
    if (createDraft.isPending) return;
    try {
      const { createDraftOrder } = await createDraft.mutateAsync({});
      await invalidate(OrderListDocument);
      router.push(`/orders/draft/${createDraftOrder.id}`);
    } catch (e) {
      alertError(e, 'Could not create draft order');
    }
  };

  const list = useVendureInfiniteList(
    OrderListDocument,
    (skip, take) => buildVariables(filter, term, skip, take),
    (r) => r.orders,
    PAGE_SIZE,
    [filter, term],
  );

  const header = (
    <View style={{ gap: spacing[3], paddingBottom: spacing[3] }}>
      <SearchField value={search} onChangeText={setSearch} placeholder="Search code, customer or transaction" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[2] }}>
        {FILTERS.map((f) => {
          const selected = f.key === filter;
          return (
            <Pressable
              key={f.key}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setFilter(f.key)}
              style={({ pressed }) => ({
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[1.5],
                borderRadius: radius.full,
                borderWidth: 1,
                borderColor: selected ? colors.primary : colors.border,
                backgroundColor: selected ? colors.primary : pressed ? colors.accent : colors.surfaceRaised,
              })}>
              <Text variant="label" color={selected ? 'primaryForeground' : 'foreground'}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {list.error && list.items.length ? <InlineError message={list.error.message} /> : null}
      {list.data ? (
        <Text variant="caption" color="mutedForeground">
          {list.totalItems.toLocaleString()} order{list.totalItems === 1 ? '' : 's'}
        </Text>
      ) : null}
    </View>
  );

  return (
    <>
      {can('CreateOrder') ? (
        <Stack.Screen
          options={{
            headerRight: () => (
              <HeaderIconButton label="New draft order" ios="square.and.pencil" android="edit_square" onPress={() => void newDraft()} />
            ),
          }}
        />
      ) : null}
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      data={list.items}
      keyExtractor={(o) => o.id}
      ListHeaderComponent={header}
      contentContainerStyle={{ padding: spacing[4], flexGrow: 1 }}
      renderItem={({ item, index }) => (
        <View style={groupedRowStyle(index, list.items.length, theme)}>
          <OrderRow order={item} precision={precision} />
        </View>
      )}
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        if (list.hasNextPage && !list.isFetchingNextPage) list.fetchNextPage();
      }}
      refreshControl={
        <RefreshControl refreshing={list.isRefetching && !list.isFetchingNextPage} onRefresh={() => void list.refetch()} />
      }
      ListEmptyComponent={
        list.isLoading || (list.isFetching && !list.data) ? (
          <LoadingState label="Loading orders…" />
        ) : list.error ? (
          <ErrorState error={list.error} onRetry={() => void list.refetch()} />
        ) : (
          <EmptyState
            title="No orders found"
            message={term ? `Nothing matches “${term}”.` : 'Try another filter.'}
            icon={{ ios: 'bag', android: 'shopping_bag' }}
            actionTitle={term || filter !== 'all' ? 'Show all orders' : undefined}
            onAction={() => {
              setSearch('');
              setFilter('all');
            }}
          />
        )
      }
      ListFooterComponent={
        list.isFetchingNextPage ? <ActivityIndicator style={{ padding: spacing[4] }} color={colors.mutedForeground} /> : undefined
      }
    />
    </>
  );
}
