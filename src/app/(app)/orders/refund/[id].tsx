import { Stack, useLocalSearchParams } from 'expo-router';

import { RefundOrderScreen } from '@/screens/orders/refund';

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <>
      <Stack.Screen options={{ title: 'Refund', headerLargeTitleEnabled: false }} />
      <RefundOrderScreen id={id} />
    </>
  );
}
