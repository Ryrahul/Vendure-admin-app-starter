import { Stack } from 'expo-router';

import { JobListScreen } from '@/screens/system/jobs';

export default function JobsRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Job queue' }} />
      <JobListScreen />
    </>
  );
}
