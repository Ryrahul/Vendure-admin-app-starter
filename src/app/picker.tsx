import { useLocalSearchParams } from 'expo-router';

import { PickerScreen } from '@/screens/picker';

export default function PickerRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PickerScreen id={id} />;
}
