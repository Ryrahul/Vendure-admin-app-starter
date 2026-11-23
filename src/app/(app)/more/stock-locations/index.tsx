import { Stack } from 'expo-router';

import { StockLocationListScreen } from '@/screens/settings/stock-locations';

export default function StockLocationsRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Stock locations' }} />
      <StockLocationListScreen />
    </>
  );
}
