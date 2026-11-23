import { Stack } from 'expo-router';

import { AdministratorListScreen } from '@/screens/settings/administrators';

export default function AdministratorsRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Administrators' }} />
      <AdministratorListScreen />
    </>
  );
}
