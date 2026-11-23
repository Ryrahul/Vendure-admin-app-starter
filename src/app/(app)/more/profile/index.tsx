import { Stack } from 'expo-router';

import { ProfileScreen } from '@/screens/settings/profile';

export default function ProfileRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Profile' }} />
      <ProfileScreen />
    </>
  );
}
