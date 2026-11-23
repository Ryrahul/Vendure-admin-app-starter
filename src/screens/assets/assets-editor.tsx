/**
 * Assets section for products, variants and collections: a strip of thumbnails with
 * featured / move / remove controls, plus "Add" (asset picker) and "Upload image".
 */
import { Pressable, ScrollView, View } from 'react-native';

import { usePermissions } from '@/api/permissions';
import { openPicker } from '@/api/picker';
import { assetPicker } from '@/api/pickers/common';
import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { Section } from '@/components/section';
import { Text } from '@/components/text';
import { Thumbnail } from '@/components/thumbnail';
import { move } from '@/screens/products/helpers';
import { useTheme } from '@/theme';

import { useAssetUpload } from './use-asset-upload';

export interface EditableAsset {
  id: string;
  preview?: string | null;
  name?: string | null;
}

export interface AssetsValue {
  assets: EditableAsset[];
  featuredId: string | null;
}

/** Initial value from an entity's `assets` + `featuredAsset`. */
export function assetsValue(entity?: { assets: EditableAsset[]; featuredAsset?: EditableAsset | null } | null): AssetsValue {
  const assets = [...(entity?.assets ?? [])];
  const featured = entity?.featuredAsset ?? null;
  if (featured && !assets.some((a) => a.id === featured.id)) assets.unshift(featured);
  return { assets, featuredId: featured?.id ?? assets[0]?.id ?? null };
}

/** `assetIds` + `featuredAssetId` for an input. */
export function assetsInput(value: AssetsValue) {
  return { assetIds: value.assets.map((a) => a.id), featuredAssetId: value.featuredId ?? (value.assets[0]?.id || null) };
}

export function AssetsEditor({
  value,
  onChange,
  readOnly,
  title = 'Assets',
}: {
  value: AssetsValue;
  onChange: (value: AssetsValue) => void;
  readOnly?: boolean;
  title?: string;
}) {
  const { colors, spacing, radius } = useTheme();
  const { upload, uploading } = useAssetUpload();
  const { can } = usePermissions();
  const canUpload = can('CreateCatalog', 'CreateAsset');
  const { assets, featuredId } = value;

  const add = (added: EditableAsset[]) => {
    const fresh = added.filter((a) => !assets.some((x) => x.id === a.id));
    if (!fresh.length) return;
    const next = [...assets, ...fresh];
    onChange({ assets: next, featuredId: featuredId ?? next[0].id });
  };

  const remove = (id: string) => {
    const next = assets.filter((a) => a.id !== id);
    onChange({ assets: next, featuredId: featuredId === id ? (next[0]?.id ?? null) : featuredId });
  };

  const control = (label: string, ios: Parameters<typeof Icon>[0]['ios'], android: Parameters<typeof Icon>[0]['android'], onPress: () => void, active?: boolean) => (
    <Pressable accessibilityRole="button" accessibilityLabel={label} hitSlop={6} onPress={onPress} style={{ padding: 2 }}>
      <Icon ios={ios} android={android} size={16} color={active ? 'brand' : 'mutedForeground'} />
    </Pressable>
  );

  return (
    <Section title={`${title} (${assets.length})`}>
      {assets.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[3], padding: spacing[4] }}>
          {assets.map((a, i) => {
            const featured = a.id === featuredId;
            return (
              <View key={a.id} style={{ gap: spacing[1.5], alignItems: 'center' }}>
                <View
                  style={{
                    borderRadius: radius.lg + 2,
                    borderWidth: 2,
                    borderColor: featured ? colors.brand : 'transparent',
                  }}>
                  <Thumbnail preview={a.preview} size={88} preset="thumb" />
                </View>
                {featured ? (
                  <Text variant="caption" color="brand">
                    Featured
                  </Text>
                ) : null}
                {!readOnly ? (
                  <View style={{ flexDirection: 'row', gap: spacing[2] }}>
                    {control('Set as featured', featured ? 'star.fill' : 'star', 'star', () => onChange({ assets, featuredId: a.id }), featured)}
                    {i > 0 ? control('Move left', 'chevron.left', 'chevron_left', () => onChange({ assets: move(assets, i, -1), featuredId })) : null}
                    {i < assets.length - 1
                      ? control('Move right', 'chevron.right', 'chevron_right', () => onChange({ assets: move(assets, i, 1), featuredId }))
                      : null}
                    {control('Remove asset', 'xmark', 'close', () => remove(a.id))}
                  </View>
                ) : null}
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <Text variant="caption" color="mutedForeground" style={{ padding: spacing[4] }}>
          No assets.
        </Text>
      )}
      {!readOnly ? (
        <View style={{ flexDirection: 'row', gap: spacing[2], padding: spacing[3] }}>
          <Button
            title="Add from assets"
            variant="secondary"
            size="sm"
            onPress={async () => {
              const picked = await openPicker({ title: 'Add assets', source: assetPicker, multiple: true });
              if (picked) add(picked.map((p) => ({ id: p.id, preview: p.preview, name: p.title })));
            }}
          />
          {canUpload ? (
            <Button
              title="Upload image"
              variant="secondary"
              size="sm"
              loading={uploading}
              onPress={async () => add(await upload())}
            />
          ) : null}
        </View>
      ) : null}
    </Section>
  );
}
