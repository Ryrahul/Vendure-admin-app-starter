import { useLocalSearchParams } from 'expo-router';

import { OrderDetailScreen } from '@/screens/orders/detail';

export default function OrderRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <OrderDetailScreen id={id} />;
}
