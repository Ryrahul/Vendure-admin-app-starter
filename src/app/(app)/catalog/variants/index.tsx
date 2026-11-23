import { Stack } from 'expo-router';

import { VariantListScreen } from '@/screens/variants/list';

export default function VariantsRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Product variants' }} />
      <VariantListScreen />
    </>
  );
}
