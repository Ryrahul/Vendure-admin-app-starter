import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { useTheme, type TextVariant, type ThemeColors } from '@/theme';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  /** Semantic color token; defaults to `foreground`. */
  color?: keyof ThemeColors;
  align?: TextStyle['textAlign'];
}

/**
 * Themed text. The font family already encodes weight (Inter_600SemiBold, …), so
 * `fontWeight` is dropped — combining both makes Android fall back to the system font.
 */
export function Text({ variant = 'body', color = 'foreground', align, style, ...rest }: TextProps) {
  const theme = useTheme();
  const { fontWeight: _ignored, ...variantStyle } = theme.text[variant] as TextStyle;
  return (
    <RNText
      {...rest}
      style={[variantStyle, { color: theme.colors[color], textAlign: align }, style]}
    />
  );
}
