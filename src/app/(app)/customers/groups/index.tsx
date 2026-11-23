import { Stack } from 'expo-router';

import { CustomerGroupListScreen } from '@/screens/customer-groups/list';

export default function CustomerGroupsRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Customer groups' }} />
      <CustomerGroupListScreen />
    </>
  );
}
