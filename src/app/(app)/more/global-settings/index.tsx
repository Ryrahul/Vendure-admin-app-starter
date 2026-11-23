import { Stack } from 'expo-router';

import { GlobalSettingsScreen } from '@/screens/settings/global-settings';

export default function GlobalSettingsRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Global settings' }} />
      <GlobalSettingsScreen />
    </>
  );
}
