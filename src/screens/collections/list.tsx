/**
 * Collections as a tree: the top level by default, a collection's children when `parentId`
 * is set. Rows open the detail; the "n ›" chip drills into the children. Search spans all levels.
 */
import { Stack, router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { CollectionListDocument } from '@/api/documents/collections';
import { usePermissions } from '@/api/permissions';
import { Icon } from '@/components/icon';
import { EntityListScreen } from '@/components/screen-kit';
import { StatusBadge } from '@/components/status-badge';
import { Text } from '@/components/text';
import { Thumbnail } from '@/components/thumbnail';
import { useTheme } from '@/theme';

export function CollectionListScreen({ parentId, parentName }: { parentId?: string; parentName?: string }) {
  const { can } = usePermissions();
  const { colors, spacing, radius } = useTheme();
  return (
    <>
      <Stack.Screen options={{ title: parentName ?? 'Collections' }} />
      <EntityListScreen
        document={CollectionListDocument}
        variables={(term, skip, take) => ({
          options: {
            skip,
            take,
            sort: { position: 'ASC' as const },
            ...(term
              ? { filter: { _or: [{ name: { contains: term } }, { slug: { contains: term } }] } }
              : parentId
                ? { filter: { parentId: { eq: parentId } } }
                : { topLevelOnly: true }),
          },
        })}
        select={(r) => r.collections}
        noun={['collection', 'collections']}
        keyExtra={parentId ?? 'top'}
        createHref={
          can('CreateCatalog', 'CreateCollection')
            ? { pathname: '/catalog/collections/[id]', params: { id: 'new', ...(parentId ? { parentId } : {}) } }
            : undefined
        }
        row={(c) => {
          const children = c.children?.length ?? 0;
          const path = c.breadcrumbs
            .slice(1, -1)
            .map((b) => b.name)
            .join(' › ');
          return {
            leading: <Thumbnail preview={c.featuredAsset?.preview} preset="thumb" size={40} />,
            title: c.name,
            subtitle: [path, `${c.productVariantCount} variant${c.productVariantCount === 1 ? '' : 's'}`].filter(Boolean).join(' · '),
            onPress: () => router.push(`/catalog/collections/${c.id}`),
            trailing: (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                {c.isPrivate ? <StatusBadge label="Private" tone="neutral" /> : null}
                {children ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Show ${children} sub-collections of ${c.name}`}
                    hitSlop={8}
                    onPress={() =>
                      router.push({ pathname: '/catalog/collections', params: { parentId: c.id, parentName: c.name } })
                    }
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing[0.5],
                      paddingLeft: spacing[2],
                      paddingRight: spacing[1],
                      paddingVertical: spacing[1],
                      borderRadius: radius.full,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}>
                    <Text variant="caption">{children}</Text>
                    <Icon ios="chevron.right" android="chevron_right" size={14} />
                  </Pressable>
                ) : null}
              </View>
            ),
          };
        }}
      />
    </>
  );
}
