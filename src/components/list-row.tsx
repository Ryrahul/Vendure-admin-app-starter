import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Text } from '@/components/text';
import { useTheme } from '@/theme';

export interface ListRowProps {
  title: string;
  subtitle?: string;
  /** Monospace detail under the title (codes, SKUs). */
  code?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  /** Trailing value text (right-aligned), e.g. a price. */
  value?: string;
  onPress?: () => void;
  chevron?: boolean;
}

export function ListRow({ title, subtitle, code, leading, trailing, value, onPress, chevron }: ListRowProps) {
  const { colors, spacing } = useTheme();
  const content = (
    <>
      {leading}
      <View style={styles.body}>
        <Text variant="bodyMedium" numberOfLines={2}>
          {title}
        </Text>
        {code ? (
          <Text variant="mono" color="mutedForeground" numberOfLines={1}>
            {code}
          </Text>
        ) : null}
        {subtitle ? (
          <Text variant="caption" color="mutedForeground" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value || trailing ? (
        <View style={styles.trailing}>
          {value ? (
            <Text variant="bodyMedium" align="right">
              {value}
            </Text>
          ) : null}
          {trailing}
        </View>
      ) : null}
      {chevron ?? !!onPress ? <Icon ios="chevron.right" android="chevron_right" size={16} /> : null}
    </>
  );
  const rowStyle = [styles.row, { paddingHorizontal: spacing[4], paddingVertical: spacing[3], gap: spacing[3] }];

  if (!onPress) return <View style={rowStyle}>{content}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      android_ripple={{ color: colors.accent }}
      style={({ pressed }) => [rowStyle, pressed && { backgroundColor: colors.accent }]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 52 },
  body: { flex: 1, gap: 2 },
  trailing: { alignItems: 'flex-end', gap: 4, maxWidth: '45%' },
});
