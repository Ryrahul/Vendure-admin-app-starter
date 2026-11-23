import { Stack } from 'expo-router';

import { FacetListScreen } from '@/screens/facets/facets';

export default function FacetListRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Facets' }} />
      <FacetListScreen />
    </>
  );
}
