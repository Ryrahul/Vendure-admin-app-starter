/**
 * Customers list: search by name or email, filter All / Registered / Guests.
 * The Admin API cannot filter customers by account (`user`), so the Registered / Guests chips
 * filter the loaded pages and keep loading more as you scroll.
 */
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';

import { CustomerListDocument } from '@/api/documents/customers';
import { useVendureInfiniteList } from '@/api/hooks';
import { usePermissions } from '@/api/permissions';
import { InlineError } from '@/components/inline-error';
import { ListRow } from '@/components/list-row';
import { FilterChips, HeaderIconButton } from '@/components/screen-kit';
import { EmptyState, ErrorState, LoadingState } from '@/components/screen-state';
import { SearchField } from '@/components/search-field';
import { groupedRowStyle } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import { Text } from '@/components/text';
import { PAGE_SIZE } from '@/constants';
import type { CustomerListQuery } from '@/gql/graphql';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTheme } from '@/theme';
import { customerName } from '@/utils/format';

type Filter = 'all' | 'registered' | 'guest';
type Customer = CustomerListQuery['customers']['items'][number];

export function CustomerStatusBadge({ user }: { user?: { verified: boolean } | null }) {
  if (!user) return <StatusBadge label="Guest" tone="neutral" />;
  return user.verified ? <StatusBadge label="Verified" tone="success" /> : <StatusBadge label="Unverified" tone="warning" />;
}

export function CustomerListScreen() {
  const theme = useTheme();
  const { colors, spacing } = theme;
  const { can } = usePermissions();
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const term = useDebouncedValue(search.trim());

  const list = useVendureInfiniteList(
    CustomerListDocument,
    (skip, take) => ({
      options: {
        skip,
        take,
        sort: { createdAt: 'DESC' as const },
        ...(term
          ? { filter: { emailAddress: { contains: term }, firstName: { contains: term }, lastName: { contains: term } }, filterOperator: 'OR' as const }
          : {}),
      },
    }),
    (r) => r.customers,
    PAGE_SIZE,
    [term],
  );
  const items = list.items.filter((c: Customer) => (filter === 'all' ? true : filter === 'registered' ? !!c.user : !c.user));
  // A client-side filter can leave a short page; keep loading until it fills (or the list ends).
  const { hasNextPage, isFetching, fetchNextPage } = list;
  useEffect(() => {
    if (filter !== 'all' && items.length < PAGE_SIZE && hasNextPage && !isFetching) void fetchNextPage();
  }, [filter, items.length, hasNextPage, isFetching, fetchNextPage]);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: spacing[4] }}>
              <HeaderIconButton label="Customer groups" ios="person.3" android="groups" onPress={() => router.push('/customers/groups')} />
              {can('CreateCustomer') ? <HeaderIconButton label="New customer" onPress={() => router.push('/customers/new')} /> : null}
            </View>
          ),
        }}
      />
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        data={items}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: spacing[4], flexGrow: 1 }}
        ListHeaderComponent={
          <View style={{ gap: spacing[3], paddingBottom: spacing[3] }}>
            <SearchField value={search} onChangeText={setSearch} placeholder="Search name or email" />
            <FilterChips
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: 'All' },
                { value: 'registered', label: 'Registered' },
                { value: 'guest', label: 'Guests' },
              ]}
            />
            {list.error && list.items.length ? <InlineError message={list.error.message} /> : null}
            {list.data ? (
              <Text variant="caption" color="mutedForeground">
                {filter === 'all'
                  ? `${list.totalItems.toLocaleString()} customer${list.totalItems === 1 ? '' : 's'}`
                  : `${items.length} of ${list.items.length} loaded (${list.totalItems.toLocaleString()} total)`}
              </Text>
            ) : null}
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={groupedRowStyle(index, items.length, theme)}>
            <ListRow
              title={customerName(item)}
              subtitle={[item.emailAddress, item.phoneNumber].filter(Boolean).join(' · ')}
              trailing={<CustomerStatusBadge user={item.user} />}
              onPress={() => router.push(`/customers/${item.id}`)}
            />
          </View>
        )}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (list.hasNextPage && !list.isFetchingNextPage) list.fetchNextPage();
        }}
        refreshControl={<RefreshControl refreshing={list.isRefetching && !list.isFetchingNextPage} onRefresh={() => void list.refetch()} />}
        ListEmptyComponent={
          list.isLoading || (list.isFetching && !list.data) ? (
            <LoadingState label="Loading customers…" />
          ) : list.error ? (
            <ErrorState error={list.error} onRetry={() => void list.refetch()} />
          ) : list.hasNextPage ? (
            <ActivityIndicator style={{ padding: spacing[4] }} color={colors.mutedForeground} />
          ) : (
            <EmptyState
              title="No customers found"
              message={term ? `Nothing matches “${term}”.` : 'Customers appear here when they register or order.'}
              icon={{ ios: 'person.2', android: 'group' }}
              actionTitle={term || filter !== 'all' ? 'Show all customers' : undefined}
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
