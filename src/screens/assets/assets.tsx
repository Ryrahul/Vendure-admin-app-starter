/** Assets: a 3-column thumbnail grid with search and upload, and a detail screen. */
import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, TextInput, useWindowDimensions, View } from 'react-native';

import { customFieldsInput, customFieldValues } from '@/api/custom-fields';
import {
  AssetDetailDocument,
  AssetListDocument,
  AssetTagsDocument,
  DeleteAssetsDocument,
  UpdateAssetDocument,
} from '@/api/documents/assets';
import { useVendureInfiniteList, useVendureMutation, useVendureQuery } from '@/api/hooks';
import { assertDeleted, useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { openPicker } from '@/api/picker';
import { PickAssetsDocument } from '@/api/pickers/common';
import { useSession } from '@/api/session';
import { Button } from '@/components/button';
import { CustomFieldsSection, useCustomFields } from '@/components/form/custom-fields-section';
import { TextRow, ValueRow } from '@/components/form/fields';
import { Icon } from '@/components/icon';
import { InlineError } from '@/components/inline-error';
import { DeleteSection, FormScroll, HeaderIconButton, QueryBoundary, SaveHeader } from '@/components/screen-kit';
import { EmptyState, ErrorState, LoadingState } from '@/components/screen-state';
import { SearchField } from '@/components/search-field';
import { Section } from '@/components/section';
import { Text } from '@/components/text';
import { Thumbnail } from '@/components/thumbnail';
import { PAGE_SIZE } from '@/constants';
import type { AssetDetailQuery } from '@/gql/graphql';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTheme } from '@/theme';
import { assetUrl } from '@/utils/asset';
import { alertError } from '@/utils/confirm';
import { formatDate } from '@/utils/format';

import { useAssetUpload } from './use-asset-upload';

const COLUMNS = 3;

export function AssetListScreen() {
  const { colors, spacing } = useTheme();
  const { can } = usePermissions();
  const { width } = useWindowDimensions();
  const { upload, uploading } = useAssetUpload();
  const [search, setSearch] = useState('');
  const term = useDebouncedValue(search.trim());
  const list = useVendureInfiniteList(
    AssetListDocument,
    (skip, take) => ({
      options: { skip, take, sort: { createdAt: 'DESC' as const }, ...(term ? { filter: { name: { contains: term } } } : {}) },
    }),
    (r) => r.assets,
    PAGE_SIZE * 2,
    term,
  );
  const gap = spacing[2];
  const tile = Math.floor((width - spacing[4] * 2 - gap * (COLUMNS - 1)) / COLUMNS);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: can('CreateCatalog', 'CreateAsset')
            ? () =>
                uploading ? (
                  <ActivityIndicator color={colors.foreground} />
                ) : (
                  <HeaderIconButton
                    label="Upload image"
                    ios="square.and.arrow.up"
                    android="upload"
                    onPress={async () => {
                      const created = await upload();
                      if (created.length) await list.refetch();
                    }}
                  />
                )
            : undefined,
        }}
      />
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        data={list.items}
        numColumns={COLUMNS}
        keyExtractor={(a) => a.id}
        columnWrapperStyle={{ gap }}
        contentContainerStyle={{ padding: spacing[4], gap, flexGrow: 1 }}
        ListHeaderComponent={
          <View style={{ gap: spacing[3], paddingBottom: spacing[1] }}>
            <SearchField value={search} onChangeText={setSearch} placeholder="Search assets by name" />
            {list.error && list.items.length ? <InlineError message={list.error.message} /> : null}
            {list.data ? (
              <Text variant="caption" color="mutedForeground">
                {list.totalItems.toLocaleString()} asset{list.totalItems === 1 ? '' : 's'}
              </Text>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={item.name}
            onPress={() => router.push(`/catalog/assets/${item.id}`)}
            style={({ pressed }) => ({ width: tile, opacity: pressed ? 0.7 : 1, gap: spacing[1] })}>
            <Thumbnail preview={item.preview} size={tile} preset="small" />
            <Text variant="caption" color="mutedForeground" numberOfLines={1}>
              {item.name}
            </Text>
          </Pressable>
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
            <LoadingState label="Loading assets…" />
          ) : list.error ? (
            <ErrorState error={list.error} onRetry={() => void list.refetch()} />
          ) : term ? (
            <EmptyState
              title="No matching assets"
              message={`Nothing matches “${term}”.`}
              icon={{ ios: 'magnifyingglass', android: 'search_off' }}
              actionTitle="Clear search"
              onAction={() => setSearch('')}
            />
          ) : (
            <EmptyState title="No assets yet" message="Upload images from your photo library or camera." />
          )
        }
        ListFooterComponent={
          list.isFetchingNextPage ? <ActivityIndicator style={{ padding: spacing[4] }} color={colors.mutedForeground} /> : undefined
        }
      />
    </>
  );
}

type Asset = NonNullable<AssetDetailQuery['asset']>;

export function AssetDetailScreen({ id }: { id: string }) {
  const query = useVendureQuery(AssetDetailDocument, { id });
  return (
    <QueryBoundary query={query} pick={(d) => d.asset} noun="asset">
      {(asset) => <AssetForm key={asset.updatedAt} asset={asset} refetch={() => void query.refetch()} refreshing={query.isRefetching} />}
    </QueryBoundary>
  );
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function AssetForm({ asset, refetch, refreshing }: { asset: Asset; refetch: () => void; refreshing: boolean }) {
  const { can } = usePermissions();
  const { state } = useSession();
  const { colors, spacing, radius } = useTheme();
  const { width } = useWindowDimensions();
  const defs = useCustomFields('Asset');
  const invalidate = useInvalidate();
  const update = useVendureMutation(UpdateAssetDocument);
  const remove = useVendureMutation(DeleteAssetsDocument);
  const tagsQuery = useVendureQuery(AssetTagsDocument, { options: { take: 200, sort: { value: 'ASC' as const } } });

  const [name, setName] = useState(asset.name);
  const [tags, setTags] = useState(() => asset.tags.map((t) => t.value));
  const [newTag, setNewTag] = useState('');
  const [cf, setCf] = useState(() => customFieldValues(defs, asset.customFields));
  const [dirty, setDirty] = useState(false);

  const canEdit = can('UpdateCatalog', 'UpdateAsset');
  const previewSize = Math.min(width - spacing[4] * 2, 480);
  const uri = assetUrl(asset.preview, state.apiUrl, 'large');

  const addTag = (value: string) => {
    const v = value.trim();
    if (!v || tags.includes(v)) return;
    setTags([...tags, v]);
    setDirty(true);
  };

  const save = async () => {
    if (!name.trim()) return alertError(new Error('Name is required.'), 'Missing name');
    try {
      await update.mutateAsync({ input: { id: asset.id, name: name.trim(), tags, customFields: customFieldsInput(defs, cf).customFields } });
      setDirty(false);
      await invalidate(AssetDetailDocument, AssetListDocument, AssetTagsDocument, PickAssetsDocument);
    } catch (e) {
      alertError(e, 'Could not save');
    }
  };

  return (
    <>
      <SaveHeader title={asset.name} dirty={dirty} saving={update.isPending} onSave={save} hidden={!canEdit} />
      <FormScroll refreshing={refreshing} onRefresh={refetch}>
        <View style={{ alignItems: 'center' }}>
          {uri && asset.type === 'IMAGE' ? (
            <Image
              source={{ uri }}
              style={{
                width: previewSize,
                height: asset.width && asset.height ? Math.min(previewSize * (asset.height / asset.width), previewSize * 1.5) : previewSize,
                borderRadius: radius.xl,
                backgroundColor: colors.neutralSubtle,
              }}
              contentFit="contain"
              transition={150}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <Thumbnail preview={asset.preview} size={160} preset="medium" />
          )}
        </View>

        <Section title="General">
          <TextRow
            label="Name"
            value={name}
            readOnly={!canEdit}
            onChangeText={(v) => {
              setName(v);
              setDirty(true);
            }}
          />
        </Section>

        <Section
          title={`Tags (${tags.length})`}
          action={
            canEdit && tagsQuery.data?.tags.items.length ? (
              <Button
                title="Choose"
                variant="ghost"
                size="sm"
                onPress={async () => {
                  const all = tagsQuery.data?.tags.items ?? [];
                  const picked = await openPicker({
                    title: 'Tags',
                    multiple: true,
                    options: all.map((t) => ({ id: t.value, title: t.value })),
                    selected: tags,
                    selectedItems: tags.map((t) => ({ id: t, title: t })),
                  });
                  if (!picked) return;
                  setTags(picked.map((p) => p.id));
                  setDirty(true);
                }}
              />
            ) : undefined
          }>
          {tags.length ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], padding: spacing[4] }}>
              {tags.map((t) => (
                <View
                  key={t}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing[1.5],
                    paddingHorizontal: spacing[2.5],
                    paddingVertical: spacing[1],
                    borderRadius: radius.full,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.neutralSubtle,
                  }}>
                  <Text variant="caption" color="neutralSubtleForeground">
                    {t}
                  </Text>
                  {canEdit ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Remove tag ${t}`}
                      hitSlop={8}
                      onPress={() => {
                        setTags(tags.filter((x) => x !== t));
                        setDirty(true);
                      }}>
                      <Icon ios="xmark.circle.fill" android="cancel" size={14} />
                    </Pressable>
                  ) : null}
                </View>
              ))}
            </View>
          ) : (
            <Text variant="caption" color="mutedForeground" style={{ padding: spacing[4] }}>
              No tags.
            </Text>
          )}
          {canEdit ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], paddingHorizontal: spacing[4], paddingVertical: spacing[2] }}>
              <TextInput
                value={newTag}
                onChangeText={setNewTag}
                placeholder="New tag"
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                accessibilityLabel="New tag"
                onSubmitEditing={() => {
                  addTag(newTag);
                  setNewTag('');
                }}
                style={{ flex: 1, color: colors.foreground, paddingVertical: spacing[1] }}
              />
              <Button
                title="Add"
                size="sm"
                variant="secondary"
                disabled={!newTag.trim()}
                onPress={() => {
                  addTag(newTag);
                  setNewTag('');
                }}
              />
            </View>
          ) : null}
        </Section>

        <CustomFieldsSection
          defs={defs}
          values={cf}
          readOnly={!canEdit}
          onChange={(k, v) => {
            setCf((prev) => ({ ...prev, [k]: v }));
            setDirty(true);
          }}
        />

        <Section title="File">
          <ValueRow label="Type" value={asset.mimeType} />
          <ValueRow label="Dimensions" value={asset.width && asset.height ? `${asset.width} × ${asset.height}` : undefined} />
          <ValueRow label="Size" value={formatBytes(asset.fileSize)} />
          <ValueRow label="Source" value={asset.source} mono />
          <ValueRow label="ID" value={asset.id} mono />
          <ValueRow label="Created" value={formatDate(asset.createdAt)} />
        </Section>

        <DeleteSection
          label="Delete asset"
          message={`“${asset.name}” will be deleted. Assets used by products, variants or collections can't be deleted.`}
          hidden={!can('DeleteCatalog', 'DeleteAsset')}
          onDelete={async () => {
            assertDeleted((await remove.mutateAsync({ input: { assetIds: [asset.id], force: false } })).deleteAssets);
            await invalidate(AssetListDocument, PickAssetsDocument);
          }}
        />
      </FormScroll>
    </>
  );
}
