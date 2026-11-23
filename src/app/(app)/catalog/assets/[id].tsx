import { useLocalSearchParams } from 'expo-router';

import { AssetDetailScreen } from '@/screens/assets/assets';

export default function AssetRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <AssetDetailScreen id={id} />;
}
