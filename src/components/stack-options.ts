import { Platform } from 'react-native';

import type { AppTheme } from '@/theme';

/**
 * Shared native-stack options: Vendure header styling plus transition settings.
 *
 * Transitions are native (react-native-screens) on the UI thread. Android uses a plain
 * slide-from-right instead of the OS-version-dependent default, and `freezeOnBlur` stops
 * covered screens from re-rendering (e.g. on query refetches) while another is on top.
 */
export function stackScreenOptions(theme: AppTheme) {
  return {
    animation: Platform.OS === 'android' ? ('slide_from_right' as const) : ('default' as const),
    animationMatchesGesture: true,
    freezeOnBlur: true,
    headerLargeTitleEnabled: true,
    headerShadowVisible: false,
    headerLargeTitleShadowVisible: false,
    headerBackButtonDisplayMode: 'minimal' as const,
    headerStyle: { backgroundColor: theme.colors.background },
    headerLargeStyle: { backgroundColor: theme.colors.background },
    headerTintColor: theme.colors.foreground,
    headerTitleStyle: { fontFamily: theme.text.subheading.fontFamily, color: theme.colors.foreground },
    headerLargeTitleStyle: { fontFamily: theme.text.title.fontFamily, color: theme.colors.foreground },
    contentStyle: { backgroundColor: theme.colors.background },
  };
}
