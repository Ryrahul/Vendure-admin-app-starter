import { useLocalSearchParams } from 'expo-router';

import { RoleDetailScreen } from '@/screens/settings/roles';

export default function RoleRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <RoleDetailScreen id={id} />;
}
