/**
 * Loading placeholders shaped like the content they stand in for, so screens don't pop
 * from a spinner to a full layout. The pulse runs on the UI thread (Reanimated) and is
 * turned off when the system "reduce motion" setting is on.
 */
import { useEffect } from 'react';
import { StyleSheet, View, type DimensionValue } from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { groupedRowStyle } from '@/components/section';
import { useTheme } from '@/theme';

function Pulse({ children, label }: { children: React.ReactNode; label?: string }) {
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.45, { duration: 800, reduceMotion: ReduceMotion.System }), -1, true);
  }, [opacity]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      style={style}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label ?? 'Loading'}
      accessibilityState={{ busy: true }}>
      {children}
    </Animated.View>
  );
}

export function SkeletonBar({ width = '60%', height = 12 }: { width?: DimensionValue; height?: number }) {
  const { colors, radius } = useTheme();
  return <View style={{ width, height, borderRadius: radius.sm, backgroundColor: colors.accent }} />;
}

const WIDTHS: DimensionValue[] = ['72%', '54%', '64%', '46%', '68%', '58%'];

function SkeletonRow({ index }: { index: number }) {
  const { spacing } = useTheme();
  return (
    <View style={[styles.row, { paddingHorizontal: spacing[4], paddingVertical: spacing[3], gap: spacing[2] }]}>
      <SkeletonBar width={WIDTHS[index % WIDTHS.length]} height={14} />
      <SkeletonBar width="32%" height={10} />
    </View>
  );
}

/** Placeholder for a grouped list (list screens). */
export function SkeletonList({ rows = 8, label }: { rows?: number; label?: string }) {
  const theme = useTheme();
  return (
    <Pulse label={label}>
      {Array.from({ length: rows }, (_, i) => (
        <View key={i} style={groupedRowStyle(i, rows, theme)}>
          <SkeletonRow index={i} />
        </View>
      ))}
    </Pulse>
  );
}

/** Placeholder for a detail/form screen: a few titled sections of rows. */
export function SkeletonForm({ sections = [3, 4, 2], label }: { sections?: number[]; label?: string }) {
  const theme = useTheme();
  const { spacing } = theme;
  return (
    <Pulse label={label}>
      <View style={{ padding: spacing[4], gap: spacing[6] }}>
        {sections.map((rows, s) => (
          <View key={s} style={{ gap: spacing[2] }}>
            <View style={{ paddingHorizontal: spacing[1] }}>
              <SkeletonBar width="28%" height={10} />
            </View>
            <View>
              {Array.from({ length: rows }, (_, i) => (
                <View key={i} style={groupedRowStyle(i, rows, theme)}>
                  <SkeletonRow index={s * 3 + i} />
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </Pulse>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 52, justifyContent: 'center' },
});
