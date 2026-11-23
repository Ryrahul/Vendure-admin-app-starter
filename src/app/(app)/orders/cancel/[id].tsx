import { Stack, useLocalSearchParams } from 'expo-router';

import { CancelOrderScreen } from '@/screens/orders/cancel';

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <>
      <Stack.Screen options={{ title: 'Cancel order', headerLargeTitleEnabled: false }} />
      <CancelOrderScreen id={id} />
    </>
  );
}
