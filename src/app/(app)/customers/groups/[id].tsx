import { Stack, useLocalSearchParams } from 'expo-router';

import { CustomerGroupDetailScreen } from '@/screens/customer-groups/detail';

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <>
      <Stack.Screen options={{ title: 'Customer group', headerLargeTitleEnabled: false }} />
      <CustomerGroupDetailScreen id={id} />
    </>
  );
}
