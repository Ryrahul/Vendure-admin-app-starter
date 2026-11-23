import { Stack } from 'expo-router';

import { stackScreenOptions } from '@/components/stack-options';
import { useTheme } from '@/theme';

/** One stack for the whole Catalog tab; detail screens use a regular (small) title. */
export default function CatalogLayout() {
  const theme = useTheme();
  return (
    <Stack screenOptions={{ ...stackScreenOptions(theme), headerLargeTitleEnabled: false }}>
      <Stack.Screen name="index" options={{ title: 'Catalog', headerLargeTitleEnabled: true }} />
      <Stack.Screen name="products/index" options={{ title: 'Products', headerLargeTitleEnabled: true }} />
    </Stack>
  );
}
