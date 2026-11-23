import { Stack } from 'expo-router';

import { ZoneListScreen } from '@/screens/settings/zones';

export default function ZonesRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Zones' }} />
      <ZoneListScreen />
    </>
  );
}
