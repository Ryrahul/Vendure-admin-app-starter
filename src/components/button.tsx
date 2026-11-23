import { ActivityIndicator, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '@/components/text';
import { useTheme } from '@/theme';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Vendure button: neutral primary (near-black / near-white), 4px radius, pressed feedback. */
export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  style,
}: ButtonProps) {
  const { colors, metrics, radius, spacing } = useTheme();
  const palette = {
    primary: { bg: colors.primary, fg: colors.primaryForeground, border: colors.primary },
    secondary: { bg: colors.surfaceRaised, fg: colors.foreground, border: colors.controlBorder },
    ghost: { bg: 'transparent', fg: colors.foreground, border: 'transparent' },
    destructive: { bg: colors.destructive, fg: colors.destructiveForeground, border: colors.destructive },
  }[variant];
  const height = { sm: metrics.buttonHeightSm, md: metrics.buttonHeight + 8, lg: metrics.buttonHeight + 16 }[size];
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: height,
          paddingHorizontal: spacing[4],
          borderRadius: radius.md,
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: inactive ? 0.5 : pressed ? 0.8 : 1,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <Text variant="label" style={{ color: palette.fg }}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
});
