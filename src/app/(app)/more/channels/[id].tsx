import { useLocalSearchParams } from 'expo-router';

import { ChannelDetailScreen } from '@/screens/settings/channels';

export default function ChannelRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ChannelDetailScreen id={id} />;
}
