import { Stack } from 'expo-router';

import { ChannelListScreen } from '@/screens/settings/channels';

export default function ChannelsRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Channels' }} />
      <ChannelListScreen />
    </>
  );
}
