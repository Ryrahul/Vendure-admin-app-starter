import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/text';
import { orderStateTone, useTheme, type StatusTone } from '@/theme';
import { humanizeState } from '@/utils/format';

export interface StatusBadgeProps {
  /** An order/payment/fulfillment state, e.g. "PaymentSettled". */
  state?: string;
  /** Or an explicit label + tone. */
  label?: string;
  tone?: StatusTone;
}

/**
 * Vendure status badge: tinted pill with matching text + border.
 * Routine states are neutral on purpose — only states that need attention get colour.
 */
export function StatusBadge({ state, label, tone }: StatusBadgeProps) {
  const theme = useTheme();
  const resolvedTone = tone ?? (state ? orderStateTone[state] : undefined) ?? 'neutral';
  const c = theme.badge(resolvedTone);
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: c.background,
          borderColor: c.border,
          minHeight: theme.metrics.badgeHeight,
          paddingHorizontal: theme.metrics.badgePaddingX,
          borderRadius: theme.radius.full,
        },
      ]}>
      <View style={[styles.dot, { backgroundColor: c.dot }]} />
      <Text variant="caption" style={{ color: c.foreground }} numberOfLines={1}>
        {label ?? humanizeState(state ?? '')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    borderWidth: 1,
  },
  // 6px dot is an optical detail of the Vendure badge, not a spacing step.
  dot: { width: 6, height: 6, borderRadius: 3 },
});
