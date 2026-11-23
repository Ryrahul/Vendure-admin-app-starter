import { Stack } from 'expo-router';

import { AssetListScreen } from '@/screens/assets/assets';

export default function AssetListRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Assets' }} />
      <AssetListScreen />
    </>
  );
}
