import { Stack } from 'expo-router';

import { stackScreenOptions } from '@/components/stack-options';
import { useTheme } from '@/theme';

export default function ProductsLayout() {
  const theme = useTheme();
  return (
    <Stack screenOptions={stackScreenOptions(theme)}>
      <Stack.Screen name="index" options={{ title: 'Products' }} />
      <Stack.Screen name="[id]" options={{ title: 'Product', headerLargeTitleEnabled: false }} />
    </Stack>
  );
}
