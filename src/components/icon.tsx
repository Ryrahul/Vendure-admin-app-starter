import { SymbolView, type SFSymbol } from 'expo-symbols';
import type { ComponentProps } from 'react';

import { useTheme, type ThemeColors } from '@/theme';

type AndroidSymbol = Extract<ComponentProps<typeof SymbolView>['name'], { android?: unknown }>['android'];

export interface IconProps {
  /** SF Symbol name (iOS). */
  ios: SFSymbol;
  /** Material Symbol name (Android / web). */
  android: NonNullable<AndroidSymbol>;
  size?: number;
  color?: keyof ThemeColors;
}

/** Native icons: SF Symbols on iOS, Material Symbols on Android. */
export function Icon({ ios, android, size = 20, color = 'mutedForeground' }: IconProps) {
  const theme = useTheme();
  return (
    <SymbolView
      name={{ ios, android, web: android }}
      size={size}
      tintColor={theme.colors[color]}
      resizeMode="scaleAspectFit"
    />
  );
}
