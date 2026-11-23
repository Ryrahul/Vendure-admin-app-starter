import { useLocalSearchParams } from 'expo-router';

import { TaxRateDetailScreen } from '@/screens/settings/tax-rates';

export default function TaxRateRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TaxRateDetailScreen id={id} />;
}
