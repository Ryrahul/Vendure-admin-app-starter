import { useLocalSearchParams } from 'expo-router';

import { PromotionDetailScreen } from '@/screens/promotions/promotions';

export default function PromotionRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PromotionDetailScreen id={id} />;
}
