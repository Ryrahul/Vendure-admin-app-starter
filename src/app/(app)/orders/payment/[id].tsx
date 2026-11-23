import { Stack, useLocalSearchParams } from 'expo-router';

import { AddPaymentScreen } from '@/screens/orders/payment';

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <>
      <Stack.Screen options={{ title: 'Add payment', headerLargeTitleEnabled: false }} />
      <AddPaymentScreen id={id} />
    </>
  );
}
