import { useLocalSearchParams } from 'expo-router';

import { ZoneDetailScreen } from '@/screens/settings/zones';

export default function ZoneRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ZoneDetailScreen id={id} />;
}
