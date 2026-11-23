import { useLocalSearchParams } from 'expo-router';

import { ProductDetailScreen } from '@/screens/products/detail';

export default function ProductRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ProductDetailScreen id={id} />;
}
