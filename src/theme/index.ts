/**
 * App theme — the single source of visual truth.
 *
 * Raw values live in `./tokens.ts` (generated from the Vendure design system,
 * https://github.com/vendurehq/design). This file adapts them for React Native and
 * exposes a `useTheme()` hook that follows the system light/dark setting.
 *
 * Rule of thumb from the Vendure design system: "neutral by default, tone for state,
 * brand for identity". `primary` is near-black / near-white, Vendure Blue (`brand`)
 * is used sparingly (logo, selection, highlights).
 */
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, type Theme as NavTheme } from 'expo-router';

import {
  componentMetrics,
  darkColors,
  fontFamily,
  lightColors,
  radius,
  shadows,
  spacing,
  statusBadgeColors,
  typography,
  type StatusTone,
  type ThemeColors,
} from './tokens';

export { orderStateTone, statusBadgeColors, type StatusTone, type ThemeColors } from './tokens';

/** Font assets to load at startup; names match `fontFamily` in tokens.ts. */
export { fontAssets } from './fonts';

/** Typography ramp used by <Text variant="…">. Sizes come from the Vendure type scale. */
export const textVariants = {
  title: typography.styles.pageTitle,
  heading: typography.styles.sectionTitle,
  subheading: typography.styles.cardTitle,
  body: typography.styles.body,
  bodyMedium: { ...typography.styles.body, fontFamily: fontFamily.body[500], fontWeight: '500' },
  label: { fontFamily: fontFamily.body[500], fontSize: 14, lineHeight: 20, fontWeight: '500' },
  caption: typography.styles.caption,
  metric: { fontFamily: fontFamily.heading[600], fontSize: 28, lineHeight: 34, letterSpacing: -0.7, fontWeight: '600' },
  mono: { ...typography.styles.code, fontSize: 13, lineHeight: 18 },
} as const;

export type TextVariant = keyof typeof textVariants;

export interface AppTheme {
  dark: boolean;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  metrics: typeof componentMetrics;
  shadows: typeof shadows;
  text: typeof textVariants;
  badge: (tone: StatusTone) => ReturnType<typeof statusBadgeColors>;
}

const make = (dark: boolean): AppTheme => {
  const colors = dark ? darkColors : lightColors;
  return {
    dark,
    colors,
    spacing,
    radius,
    metrics: componentMetrics,
    shadows,
    text: textVariants,
    badge: (tone) => statusBadgeColors(tone, colors),
  };
};

export const lightTheme = make(false);
export const darkTheme = make(true);

export function useTheme(): AppTheme {
  return useColorScheme() === 'dark' ? darkTheme : lightTheme;
}

/** React Navigation theme derived from the Vendure tokens (headers, tab bar, backgrounds). */
export function navigationTheme(theme: AppTheme): NavTheme {
  const base = theme.dark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surfaceRaised,
      text: theme.colors.foreground,
      border: theme.colors.border,
      notification: theme.colors.destructive,
    },
  };
}
