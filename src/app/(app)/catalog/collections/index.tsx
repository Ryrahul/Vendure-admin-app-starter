import { useLocalSearchParams } from 'expo-router';

import { CollectionListScreen } from '@/screens/collections/list';

export default function CollectionsRoute() {
  const { parentId, parentName } = useLocalSearchParams<{ parentId?: string; parentName?: string }>();
  return <CollectionListScreen parentId={parentId} parentName={parentName} />;
}
