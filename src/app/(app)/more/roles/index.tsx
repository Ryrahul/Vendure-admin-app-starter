import { Stack } from 'expo-router';

import { RoleListScreen } from '@/screens/settings/roles';

export default function RolesRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Roles' }} />
      <RoleListScreen />
    </>
  );
}
