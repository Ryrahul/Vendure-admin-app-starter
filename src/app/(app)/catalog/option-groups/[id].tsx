import { useLocalSearchParams } from 'expo-router';

import { OptionGroupDetailScreen } from '@/screens/option-groups/option-groups';

export default function OptionGroupRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <OptionGroupDetailScreen id={id} />;
}
