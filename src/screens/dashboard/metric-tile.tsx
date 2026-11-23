import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/text';
import { useTheme } from '@/theme';

export function MetricTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  const { colors, radius, spacing } = useTheme();
  return (
    <View
      style={[
        styles.tile,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: radius.xl,
          padding: spacing[4],
          gap: spacing[1],
        },
      ]}>
      <Text variant="caption" color="mutedForeground" numberOfLines={1}>
        {label}
      </Text>
      <Text variant="metric" numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      {hint ? (
        <Text variant="caption" color="mutedForeground" numberOfLines={1}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flexBasis: '47%', flexGrow: 1, borderWidth: StyleSheet.hairlineWidth },
});
