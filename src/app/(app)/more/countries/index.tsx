import { Stack } from 'expo-router';

import { CountryListScreen } from '@/screens/settings/countries';

export default function CountriesRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Countries' }} />
      <CountryListScreen />
    </>
  );
}
