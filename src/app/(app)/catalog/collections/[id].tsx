import { useLocalSearchParams } from 'expo-router';

import { CollectionDetailScreen } from '@/screens/collections/detail';

export default function CollectionRoute() {
  const { id, parentId } = useLocalSearchParams<{ id: string; parentId?: string }>();
  return <CollectionDetailScreen id={id} parentId={parentId} />;
}
