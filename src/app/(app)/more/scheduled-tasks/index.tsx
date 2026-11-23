import { Stack } from 'expo-router';

import { ScheduledTaskListScreen } from '@/screens/system/scheduled-tasks';

export default function ScheduledTasksRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Scheduled tasks' }} />
      <ScheduledTaskListScreen />
    </>
  );
}
