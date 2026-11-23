import { useLocalSearchParams } from 'expo-router';

import { FacetDetailScreen } from '@/screens/facets/facets';

export default function FacetRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <FacetDetailScreen id={id} />;
}
