import { Stack, router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { useVendureInfiniteList } from '@/api/hooks';
import { getPickerRequest, settlePicker, type PickerItem, type PickerRequest, type PickerSource } from '@/api/picker';
import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { ListRow } from '@/components/list-row';
import { LIST_TUNING } from '@/components/screen-kit';
import { EmptyState, ErrorState, LoadingState } from '@/components/screen-state';
import { SearchField } from '@/components/search-field';
import { groupedRowStyle } from '@/components/section';
import { Thumbnail } from '@/components/thumbnail';
import { PAGE_SIZE } from '@/constants';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTheme } from '@/theme';

export function PickerScreen({ id }: { id: string }) {
  const request = getPickerRequest(id);
  // Closing the sheet any other way than "Done"/selecting resolves with null.
  useEffect(() => () => settlePicker(id, null), [id]);
  if (!request) return <ErrorState error={new Error('This picker is no longer open.')} />;
  return <PickerBody id={id} request={request} />;
}

function PickerBody({ id, request }: { id: string; request: PickerRequest }) {
  const theme = useTheme();
  const { spacing, colors } = theme;
  const [search, setSearch] = useState('');
  const term = useDebouncedValue(search.trim());
  const [selected, setSelected] = useState<Map<string, PickerItem>>(
    () =>
      new Map(
        (request.selected ?? []).map((sid) => [
          sid,
          request.selectedItems?.find((i) => i.id === sid) ?? { id: sid, title: `#${sid}` },
        ]),
      ),
  );

  const remote = useRemoteItems(request.source, term, id);
  const staticItems = useMemo(() => {
    const q = term.toLowerCase();
    return (request.options ?? []).filter(
      (o) => !q || o.title.toLowerCase().includes(q) || o.subtitle?.toLowerCase().includes(q) || o.code?.toLowerCase().includes(q),
    );
  }, [request.options, term]);
  const items = request.source ? remote.items : staticItems;

  const finish = (result: PickerItem[]) => {
    settlePicker(id, result);
    router.back();
  };

  const toggle = (item: PickerItem) => {
    if (!request.multiple) return finish([item]);
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.set(item.id, item);
      return next;
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: request.title,
          headerRight: request.multiple
            ? () => (
                <Button
                  title={`Done${selected.size ? ` (${selected.size})` : ''}`}
                  size="sm"
                  variant="ghost"
                  onPress={() => {
                    // Prefer fully-loaded items over the id-only placeholders.
                    const byId = new Map(items.map((i) => [i.id, i]));
                    finish([...selected.keys()].map((k) => byId.get(k) ?? selected.get(k)!));
                  }}
                />
              )
            : undefined,
        }}
      />
      <FlatList
        {...LIST_TUNING}
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: spacing[4], flexGrow: 1 }}
        ListHeaderComponent={
          <View style={{ paddingBottom: spacing[3] }}>
            <SearchField value={search} onChangeText={setSearch} placeholder={request.searchPlaceholder ?? 'Search'} />
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={groupedRowStyle(index, items.length, theme)}>
            <ListRow
              leading={item.preview !== undefined ? <Thumbnail preview={item.preview} size={40} /> : undefined}
              title={item.title}
              subtitle={item.subtitle}
              code={item.code}
              chevron={false}
              trailing={
                selected.has(item.id) ? <Icon ios="checkmark" android="check" size={18} color="foreground" /> : undefined
              }
              onPress={() => toggle(item)}
            />
          </View>
        )}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (remote.hasNextPage && !remote.isFetchingNextPage) remote.fetchNextPage();
        }}
        ListEmptyComponent={
          request.source && remote.isLoading ? (
            <LoadingState />
          ) : request.source && remote.error ? (
            <ErrorState error={remote.error} onRetry={() => void remote.refetch()} />
          ) : (
            <EmptyState title="Nothing found" message={term ? `Nothing matches “${term}”.` : 'There is nothing to pick.'} />
          )
        }
        ListFooterComponent={
          remote.isFetchingNextPage ? <ActivityIndicator style={{ padding: spacing[4] }} color={colors.mutedForeground} /> : undefined
        }
      />
    </>
  );
}

const NO_SOURCE: PickerSource = {
  document: { toString: () => 'query None { __typename }' } as PickerSource['document'],
  variables: () => ({}),
  select: () => ({ items: [], totalItems: 0 }),
};

function useRemoteItems(source: PickerSource | undefined, term: string, id: string) {
  const s = source ?? NO_SOURCE;
  const list = useVendureInfiniteList(s.document, (skip, take) => s.variables(term, skip, take), s.select, PAGE_SIZE, [
    'picker',
    id,
    term,
  ]);
  return source ? list : { ...list, items: [] as PickerItem[], isLoading: false, error: null, hasNextPage: false };
}
