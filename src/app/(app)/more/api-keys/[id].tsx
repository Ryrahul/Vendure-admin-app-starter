import { useLocalSearchParams } from 'expo-router';

import { ApiKeyDetailScreen } from '@/screens/settings/api-keys';

export default function ApiKeyRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ApiKeyDetailScreen id={id} />;
}
