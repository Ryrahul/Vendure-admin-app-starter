import { useLocalSearchParams } from 'expo-router';

import { TaxCategoryDetailScreen } from '@/screens/settings/tax-categories';

export default function TaxCategoryRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TaxCategoryDetailScreen id={id} />;
}
