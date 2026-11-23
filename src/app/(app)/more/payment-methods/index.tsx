import { Stack } from 'expo-router';

import { PaymentMethodListScreen } from '@/screens/settings/payment-methods';

export default function PaymentMethodsRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Payment methods' }} />
      <PaymentMethodListScreen />
    </>
  );
}
