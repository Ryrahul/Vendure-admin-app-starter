import { Stack } from 'expo-router';

import { ApiKeyListScreen } from '@/screens/settings/api-keys';

export default function ApiKeysRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'API keys' }} />
      <ApiKeyListScreen />
    </>
  );
}
