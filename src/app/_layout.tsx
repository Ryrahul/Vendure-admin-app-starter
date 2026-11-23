import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { VendureApiError } from '@/api/client';
import { SessionProvider, useSession } from '@/api/session';
import { stackScreenOptions } from '@/components/stack-options';
import { fontAssets, navigationTheme, useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (count, error) =>
        !(error instanceof VendureApiError && (error.isAuthError || error.code === 'BAD_RESPONSE')) && count < 2,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <RootNavigator />
      </SessionProvider>
    </QueryClientProvider>
  );
}

function RootNavigator() {
  const theme = useTheme();
  const { state, isLoggedIn } = useSession();
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  // Gate on hydration: never decide login-vs-app before the stored session is read.
  const ready = (fontsLoaded || !!fontError) && state.hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <ThemeProvider value={navigationTheme(theme)}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(app)" />
          <Stack.Screen
            name="picker"
            options={{ ...stackScreenOptions(theme), headerShown: true, headerLargeTitleEnabled: false, presentation: 'modal' }}
          />
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="login" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
