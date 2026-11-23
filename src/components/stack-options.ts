import type { AppTheme } from '@/theme';

/** Shared native-stack header styling (Vendure surfaces + Public Sans titles). */
export function stackScreenOptions(theme: AppTheme) {
  return {
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
