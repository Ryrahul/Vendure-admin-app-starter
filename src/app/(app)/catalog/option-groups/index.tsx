import { Stack } from 'expo-router';

import { OptionGroupListScreen } from '@/screens/option-groups/option-groups';

export default function OptionGroupListRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Option groups' }} />
      <OptionGroupListScreen />
    </>
  );
}
