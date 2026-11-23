import { Stack, useLocalSearchParams } from 'expo-router';

import { CustomerDetailScreen } from '@/screens/customers/detail';

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <>
      <Stack.Screen options={{ title: 'Customer', headerLargeTitleEnabled: false }} />
      <CustomerDetailScreen id={id} />
    </>
  );
}
