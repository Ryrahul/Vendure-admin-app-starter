/**
 * Building blocks every list/detail/form screen shares, so the ~25 admin areas look and
 * behave the same:
 *
 * - <EntityListScreen>: search + paginated grouped list + "New" header button
 * - <FormScroll>: scrolling form body with pull-to-refresh and keyboard insets
 * - <SaveHeader>: header "Save" button bound to dirty/saving state
 * - <DeleteSection>: confirm-then-delete row at the bottom of a detail screen
 * - <QueryBoundary>: loading / error / not-found states for a detail query
 *
 * Lists and detail bodies mount after the push transition (useAfterTransition) and show a
 * skeleton until then, so the native slide-in never waits on a heavy first render.
 */
import type { UseQueryResult } from '@tanstack/react-query';
import { Stack, router, type Href } from 'expo-router';
import { useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';

import { useVendureInfiniteList } from '@/api/hooks';
import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { InlineError } from '@/components/inline-error';
import { ListRow, type ListRowProps } from '@/components/list-row';
import { EmptyState, ErrorState, LoadingState } from '@/components/screen-state';
import { SearchField } from '@/components/search-field';
import { groupedRowStyle, Section } from '@/components/section';
import { Text } from '@/components/text';
import { PAGE_SIZE } from '@/constants';
import type { TypedDocumentString } from '@/gql/graphql';
import { useAfterTransition } from '@/hooks/use-after-transition';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTheme } from '@/theme';
import { alertError, confirm } from '@/utils/confirm';

export interface EntityListScreenProps<R, V, Item extends { id: string }> {
  document: TypedDocumentString<R, V>;
  variables: (term: string, skip: number, take: number) => NoInfer<V>;
  select: (result: NoInfer<R>) => { items: Item[]; totalItems: number };
  row: (item: Item) => ListRowProps;
  /** Singular / plural nouns for counts and empty states. */
  noun: [string, string];
  searchPlaceholder?: string;
  /** Hide the search field (for short lists without a text filter). */
  searchable?: boolean;
  /** Shows a "New" header button when set. */
  createHref?: Href;
  /** Extra controls under the search field (filter chips…). */
  filters?: ReactNode;
  /** Changes to this value reset pagination (e.g. the active filter). */
  keyExtra?: unknown;
}

export function EntityListScreen<R, V, Item extends { id: string }>({
  document,
  variables,
  select,
  row,
  noun,
  searchPlaceholder,
  searchable = true,
  createHref,
  filters,
  keyExtra = null,
}: EntityListScreenProps<R, V, Item>) {
  const theme = useTheme();
  const { colors, spacing } = theme;
  const [search, setSearch] = useState('');
  const term = useDebouncedValue(search.trim());
  const list = useVendureInfiniteList(document, (skip, take) => variables(term, skip, take), select, PAGE_SIZE, [
    term,
    keyExtra,
  ]);
  const ready = useAfterTransition();
  const items = ready ? list.items : [];

  // React Compiler memoizes this, so rows don't re-render on search keystrokes or fetch-status changes.
  const renderItem = ({ item, index }: { item: Item; index: number }) => (
    <View style={groupedRowStyle(index, items.length, theme)}>
      <ListRow {...row(item)} />
    </View>
  );

  return (
    <>
      {createHref ? (
        <Stack.Screen
          options={{
            headerRight: () => <HeaderIconButton label={`New ${noun[0]}`} onPress={() => router.push(createHref)} />,
          }}
        />
      ) : null}
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        {...LIST_TUNING}
        contentContainerStyle={{ padding: spacing[4], flexGrow: 1 }}
        ListHeaderComponent={
          <View style={{ gap: spacing[3], paddingBottom: spacing[3] }}>
            {searchable ? (
              <SearchField
                value={search}
                onChangeText={setSearch}
                placeholder={searchPlaceholder ?? `Search ${noun[1]}`}
              />
            ) : null}
            {filters}
            {list.error && list.items.length ? <InlineError message={list.error.message} /> : null}
            {list.data ? (
              <Text variant="caption" color="mutedForeground">
                {list.totalItems.toLocaleString()} {list.totalItems === 1 ? noun[0] : noun[1]}
              </Text>
            ) : null}
          </View>
        }
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (list.hasNextPage && !list.isFetchingNextPage) list.fetchNextPage();
        }}
        refreshControl={
          <RefreshControl
            refreshing={list.isRefetching && !list.isFetchingNextPage}
            onRefresh={() => void list.refetch()}
          />
        }
        ListEmptyComponent={
          !ready || list.isLoading || (list.isFetching && !list.data) ? (
            <LoadingState label={`Loading ${noun[1]}…`} />
          ) : list.error ? (
            <ErrorState error={list.error} onRetry={() => void list.refetch()} />
          ) : term ? (
            <EmptyState
              title={`No matching ${noun[1]}`}
              message={`Nothing matches “${term}”.`}
              icon={{ ios: 'magnifyingglass', android: 'search_off' }}
              actionTitle="Clear search"
              onAction={() => setSearch('')}
            />
          ) : (
            <EmptyState title={`No ${noun[1]} yet`} message={`${capitalize(noun[1])} you create appear here.`} />
          )
        }
        ListFooterComponent={
          list.isFetchingNextPage ? (
            <ActivityIndicator style={{ padding: spacing[4] }} color={colors.mutedForeground} />
          ) : undefined
        }
      />
    </>
  );
}

const keyExtractor = (i: { id: string }) => i.id;

/** FlatList windowing for paginated admin lists: a full first screen, small render batches. */
export const LIST_TUNING = {
  initialNumToRender: 12,
  maxToRenderPerBatch: 10,
  updateCellsBatchingPeriod: 50,
  windowSize: 9,
  removeClippedSubviews: Platform.OS === 'android',
} as const;
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function HeaderIconButton({
  label,
  onPress,
  ios = 'plus',
  android = 'add',
}: {
  label: string;
  onPress: () => void;
  ios?: Parameters<typeof Icon>[0]['ios'];
  android?: Parameters<typeof Icon>[0]['android'];
}) {
  const { spacing } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={10}
      onPress={onPress}
      style={({ pressed }) => ({ padding: spacing[1], opacity: pressed ? 0.5 : 1 })}>
      <Icon ios={ios} android={android} size={22} color="foreground" />
    </Pressable>
  );
}

/** Scroll container for detail/edit screens. */
export function FormScroll({
  children,
  refreshing,
  onRefresh,
}: {
  children: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
}) {
  const { spacing } = useTheme();
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={{ padding: spacing[4], gap: spacing[6], paddingBottom: spacing[12] }}
        refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} /> : undefined}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/** Sets the screen title and a header "Save" button. */
export function SaveHeader({
  title,
  dirty,
  saving,
  onSave,
  label = 'Save',
  hidden,
}: {
  title?: string;
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  label?: string;
  /** Hide the button (e.g. the admin lacks the update permission). */
  hidden?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Stack.Screen
      options={{
        ...(title ? { title } : {}),
        headerRight: hidden
          ? undefined
          : () =>
              saving ? (
                <ActivityIndicator color={colors.foreground} />
              ) : (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={label}
                  accessibilityState={{ disabled: !dirty }}
                  disabled={!dirty}
                  hitSlop={10}
                  onPress={onSave}
                  style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                  <Text variant="bodyMedium" color={dirty ? 'foreground' : 'mutedForeground'}>
                    {label}
                  </Text>
                </Pressable>
              ),
      }}
    />
  );
}

/**
 * Destructive action at the bottom of a detail screen. Asks for confirmation, runs
 * `onDelete`, then goes back. Errors (incl. NOT_DELETED) are shown in an alert.
 */
export function DeleteSection({
  label,
  message,
  onDelete,
  hidden,
}: {
  label: string;
  message: string;
  onDelete: () => Promise<unknown>;
  hidden?: boolean;
}) {
  const { spacing } = useTheme();
  const [busy, setBusy] = useState(false);
  if (hidden) return null;
  return (
    <Section>
      <View style={{ padding: spacing[3] }}>
        <Button
          title={label}
          variant="destructive"
          loading={busy}
          onPress={async () => {
            if (!(await confirm({ title: `${label}?`, message, confirmLabel: 'Delete', destructive: true }))) return;
            setBusy(true);
            try {
              await onDelete();
              if (router.canGoBack()) router.back();
            } catch (e) {
              alertError(e, 'Could not delete');
            } finally {
              setBusy(false);
            }
          }}
        />
      </View>
    </Section>
  );
}

/** Renders loading / error / missing states for a detail query, or the children with data. */
export function QueryBoundary<T, D>({
  query,
  pick,
  noun,
  children,
}: {
  query: UseQueryResult<T>;
  pick: (data: T) => D | null | undefined;
  noun: string;
  children: (data: D) => ReactNode;
}) {
  const ready = useAfterTransition();
  if (query.isLoading || (!ready && query.data)) return <LoadingState variant="form" label={`Loading ${noun}…`} />;
  const value = query.data ? pick(query.data) : undefined;
  if (value == null) {
    return query.error ? (
      <ErrorState error={query.error} onRetry={() => void query.refetch()} />
    ) : (
      <ErrorState error={new Error(`This ${noun} does not exist in the active channel.`)} />
    );
  }
  return <>{children(value)}</>;
}

/** Horizontal filter chips (single choice). */
export function FilterChips<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const { colors, radius, spacing } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[2] }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(o.value)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              paddingHorizontal: spacing[3],
              paddingVertical: spacing[1.5],
              borderRadius: radius.full,
              borderWidth: 1,
              borderColor: active ? colors.primary : colors.border,
              backgroundColor: active ? colors.primary : colors.surfaceRaised,
            })}>
            <Text variant="label" color={active ? 'primaryForeground' : 'foreground'}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
