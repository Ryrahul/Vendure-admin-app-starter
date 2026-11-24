import { Children, Fragment, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '@/components/text';
import { useTheme } from '@/theme';

export interface SectionProps {
  title?: string;
  action?: ReactNode;
  footer?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Grouped section: one raised surface with hairline separators between rows,
 * instead of a card per row ("everything's a card" is a native-slop tell).
 */
export function Section({ title, action, footer, children, style }: SectionProps) {
  const { colors, radius, spacing } = useTheme();
  const rows = Children.toArray(children).filter(Boolean);
  return (
    <View style={[{ gap: spacing[2] }, style]}>
      {title || action ? (
        <View style={[styles.header, { paddingHorizontal: spacing[1] }]}>
          {title ? (
            <Text variant="label" color="mutedForeground">
              {title}
            </Text>
          ) : (
            <View />
          )}
          {action}
        </View>
      ) : null}
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: radius.xl,
          borderColor: colors.border,
          borderWidth: StyleSheet.hairlineWidth,
          overflow: 'hidden',
        }}>
        {rows.map((child, i) => (
          <Fragment key={i}>
            {i > 0 ? (
              <View style={[styles.separator, { backgroundColor: colors.border, marginLeft: spacing[4] }]} />
            ) : null}
            {child}
          </Fragment>
        ))}
      </View>
      {footer ? (
        <Text variant="caption" color="mutedForeground" style={{ paddingHorizontal: spacing[1] }}>
          {footer}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  separator: { height: StyleSheet.hairlineWidth },
});

/**
 * Style for a row inside a virtualized grouped list (FlatList), so long lists get the
 * same single-surface look as <Section> without rendering every row up front.
 */
export function groupedRowStyle(
  index: number,
  count: number,
  theme: { colors: { card: string; border: string }; radius: { xl: number } },
): ViewStyle {
  const first = index === 0;
  const last = index === count - 1;
  const r = theme.radius.xl;
  const hair = StyleSheet.hairlineWidth;
  return {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderLeftWidth: hair,
    borderRightWidth: hair,
    borderTopWidth: first ? hair : 0,
    borderBottomWidth: hair,
    borderTopLeftRadius: first ? r : 0,
    borderTopRightRadius: first ? r : 0,
    borderBottomLeftRadius: last ? r : 0,
    borderBottomRightRadius: last ? r : 0,
    overflow: 'hidden',
  };
}
