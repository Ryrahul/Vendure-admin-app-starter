import { Stack } from 'expo-router';

import { SellerListScreen } from '@/screens/settings/sellers';

export default function SellersRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Sellers' }} />
      <SellerListScreen />
    </>
  );
}
