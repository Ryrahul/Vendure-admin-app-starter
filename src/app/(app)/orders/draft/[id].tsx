import { Stack, useLocalSearchParams } from 'expo-router';

import { DraftOrderScreen } from '@/screens/orders/draft';

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <>
      <Stack.Screen options={{ title: 'Draft order', headerLargeTitleEnabled: false }} />
      <DraftOrderScreen id={id} />
    </>
  );
}
