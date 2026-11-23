import { Stack } from 'expo-router';

import { stackScreenOptions } from '@/components/stack-options';
import { useTheme } from '@/theme';

/** Marketing, Settings, System, account. One stack; sub-screens use a regular title. */
export default function MoreLayout() {
  const theme = useTheme();
  return (
    <Stack screenOptions={{ ...stackScreenOptions(theme), headerLargeTitleEnabled: false }}>
      <Stack.Screen name="index" options={{ title: 'More', headerLargeTitleEnabled: true }} />
    </Stack>
  );
}
