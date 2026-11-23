import { Stack } from 'expo-router';

import { stackScreenOptions } from '@/components/stack-options';
import { useTheme } from '@/theme';

export default function CustomersLayout() {
  const theme = useTheme();
  return (
    <Stack screenOptions={{ ...stackScreenOptions(theme), headerLargeTitleEnabled: false }}>
      <Stack.Screen name="index" options={{ title: 'Customers', headerLargeTitleEnabled: true }} />
    </Stack>
  );
}
