import { Stack } from 'expo-router';

import { TaxRateListScreen } from '@/screens/settings/tax-rates';

export default function TaxRatesRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tax rates' }} />
      <TaxRateListScreen />
    </>
  );
}
