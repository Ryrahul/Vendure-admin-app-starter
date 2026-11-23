import { useLocalSearchParams } from 'expo-router';

import { CountryDetailScreen } from '@/screens/settings/countries';

export default function CountryRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CountryDetailScreen id={id} />;
}
