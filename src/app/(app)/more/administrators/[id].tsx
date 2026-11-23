import { useLocalSearchParams } from 'expo-router';

import { AdministratorDetailScreen } from '@/screens/settings/administrators';

export default function AdministratorRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <AdministratorDetailScreen id={id} />;
}
