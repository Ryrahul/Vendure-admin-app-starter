import { Stack, useLocalSearchParams } from 'expo-router';

import { CustomerAddressScreen } from '@/screens/customers/address';

export default function Route() {
  const { id, customerId } = useLocalSearchParams<{ id: string; customerId: string }>();
  return (
    <>
      <Stack.Screen options={{ title: id === 'new' ? 'New address' : 'Address', headerLargeTitleEnabled: false }} />
      <CustomerAddressScreen id={id} customerId={customerId} />
    </>
  );
}
