import { Stack, useLocalSearchParams } from 'expo-router';

import { ModifyOrderScreen } from '@/screens/orders/modify';

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <>
      <Stack.Screen options={{ title: 'Modify order', headerLargeTitleEnabled: false }} />
      <ModifyOrderScreen id={id} />
    </>
  );
}
