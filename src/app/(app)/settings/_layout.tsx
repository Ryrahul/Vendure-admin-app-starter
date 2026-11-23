import { Stack } from 'expo-router';

import { stackScreenOptions } from '@/components/stack-options';
import { useTheme } from '@/theme';

export default function SettingsLayout() {
  const theme = useTheme();
  return (
    <Stack screenOptions={stackScreenOptions(theme)}>
      <Stack.Screen name="index" options={{ title: 'Settings' }} />
    </Stack>
  );
}
