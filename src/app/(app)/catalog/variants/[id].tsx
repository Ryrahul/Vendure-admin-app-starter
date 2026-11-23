import { useLocalSearchParams } from 'expo-router';

import { VariantDetailScreen } from '@/screens/variants/detail';

export default function VariantRoute() {
  const { id, productId } = useLocalSearchParams<{ id: string; productId?: string }>();
  return <VariantDetailScreen id={id} productId={productId} />;
}
