import { useLocalSearchParams } from 'expo-router';

import { ShippingMethodDetailScreen } from '@/screens/settings/shipping-methods';

export default function ShippingMethodRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ShippingMethodDetailScreen id={id} />;
}
