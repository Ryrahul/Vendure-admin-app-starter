import { useLocalSearchParams } from 'expo-router';

import { JobDetailScreen } from '@/screens/system/jobs';

export default function JobRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <JobDetailScreen id={id} />;
}
