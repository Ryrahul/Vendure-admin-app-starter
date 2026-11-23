import { Stack, useLocalSearchParams } from 'expo-router';

import { FulfilOrderScreen } from '@/screens/orders/fulfil';

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <>
      <Stack.Screen options={{ title: 'Fulfil', headerLargeTitleEnabled: false }} />
      <FulfilOrderScreen id={id} />
    </>
  );
}
