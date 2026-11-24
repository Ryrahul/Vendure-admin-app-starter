import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/text';
import { useTheme } from '@/theme';

export interface BarDatum {
  label: string;
  value: number;
}

/**
 * Dependency-free daily bar chart. A single series stays neutral ("neutral by default");
 * Vendure Blue highlights only the most recent day.
 */
export function BarChart({
  data,
  height = 120,
  formatValue,
}: {
  data: BarDatum[];
  height?: number;
  formatValue: (v: number) => string;
}) {
  const { colors, radius, spacing } = useTheme();
  const max = Math.max(1, ...data.map((d) => d.value));
  const total = data.reduce((s, d) => s + d.value, 0);
  const first = data[0]?.label;
  const last = data[data.length - 1]?.label;

  return (
    <View style={{ gap: spacing[2], padding: spacing[4] }}>
      <View
        accessible
        accessibilityLabel={`Daily chart, total ${formatValue(total)}, peak ${formatValue(max)}`}
        style={[styles.bars, { height, gap: spacing[0.5] }]}>
        {data.map((d, i) => (
          <View
            key={d.label + i}
            style={{
              flex: 1,
              height: Math.max(2, (d.value / max) * height),
              backgroundColor: i === data.length - 1 ? colors.brand : colors.mutedForeground,
              opacity: d.value === 0 ? 0.25 : 1,
              borderTopLeftRadius: radius.sm,
              borderTopRightRadius: radius.sm,
            }}
          />
        ))}
      </View>
      <View style={styles.axis}>
        <Text variant="caption" color="mutedForeground">
          {first ? shortDate(first) : ''}
        </Text>
        <Text variant="caption" color="mutedForeground">
          peak {formatValue(max)}
        </Text>
        <Text variant="caption" color="mutedForeground">
          {last ? shortDate(last) : ''}
        </Text>
      </View>
    </View>
  );
}

function shortDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  bars: { flexDirection: 'row', alignItems: 'flex-end' },
  axis: { flexDirection: 'row', justifyContent: 'space-between' },
});
