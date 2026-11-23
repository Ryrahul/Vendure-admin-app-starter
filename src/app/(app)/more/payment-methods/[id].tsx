import { useLocalSearchParams } from 'expo-router';

import { PaymentMethodDetailScreen } from '@/screens/settings/payment-methods';

export default function PaymentMethodRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PaymentMethodDetailScreen id={id} />;
}
