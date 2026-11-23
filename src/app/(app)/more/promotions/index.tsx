import { Stack } from 'expo-router';

import { PromotionListScreen } from '@/screens/promotions/promotions';

export default function PromotionsRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Promotions' }} />
      <PromotionListScreen />
    </>
  );
}
