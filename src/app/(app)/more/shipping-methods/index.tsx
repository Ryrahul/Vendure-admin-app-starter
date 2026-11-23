import { Stack } from 'expo-router';

import { ShippingMethodListScreen } from '@/screens/settings/shipping-methods';

export default function ShippingMethodsRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Shipping methods' }} />
      <ShippingMethodListScreen />
    </>
  );
}
