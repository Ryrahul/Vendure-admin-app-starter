/**
 * Scheduled tasks (System): each task with its schedule, last/next run and last result;
 * enable/disable and "Run now".
 */
import { View } from 'react-native';

import { RunScheduledTaskDocument, ScheduledTasksDocument, UpdateScheduledTaskDocument } from '@/api/documents/scheduled-tasks';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { Button } from '@/components/button';
import { SwitchRow, ValueRow } from '@/components/form/fields';
import { ListRow } from '@/components/list-row';
import { FormScroll } from '@/components/screen-kit';
import { EmptyState, ErrorState, LoadingState } from '@/components/screen-state';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import { Text } from '@/components/text';
import type { ScheduledTasksQuery } from '@/gql/graphql';
import { useTheme } from '@/theme';
import { alertError, confirm } from '@/utils/confirm';
import { formatDate, formatRelative } from '@/utils/format';

type Task = ScheduledTasksQuery['scheduledTasks'][number];

export function ScheduledTaskListScreen() {
  const query = useVendureQuery(ScheduledTasksDocument, undefined, {
    refetchInterval: (q) => (q.state.data?.scheduledTasks.some((t) => t.isRunning) ? 3000 : false),
  });

  if (query.isLoading) return <LoadingState label="Loading scheduled tasks…" />;
  if (!query.data) return <ErrorState error={query.error} onRetry={() => void query.refetch()} />;
  const tasks = query.data.scheduledTasks;

  return (
    <FormScroll refreshing={query.isRefetching} onRefresh={() => void query.refetch()}>
      {tasks.length === 0 ? (
        <EmptyState title="No scheduled tasks" message="This server has no scheduled tasks configured." />
      ) : (
        tasks.map((t) => <TaskSection key={t.id} task={t} />)
      )}
    </FormScroll>
  );
}

function TaskSection({ task }: { task: Task }) {
  const { spacing } = useTheme();
  const { can } = usePermissions();
  const invalidate = useInvalidate();
  const update = useVendureMutation(UpdateScheduledTaskDocument);
  const run = useVendureMutation(RunScheduledTaskDocument);
  const canEdit = can('UpdateSettings', 'UpdateSystem');

  const toggle = async (enabled: boolean) => {
    try {
      await update.mutateAsync({ input: { id: task.id, enabled } });
      await invalidate(ScheduledTasksDocument);
    } catch (e) {
      alertError(e, 'Could not update task');
    }
  };

  const runNow = async () => {
    const ok = await confirm({
      title: `Run “${task.id}” now?`,
      message: 'The task runs once immediately, outside its schedule.',
      confirmLabel: 'Run now',
    });
    if (!ok) return;
    try {
      const res = await run.mutateAsync({ id: task.id });
      if (!res.runScheduledTask.success) throw new Error('The server did not start the task.');
      await invalidate(ScheduledTasksDocument);
    } catch (e) {
      alertError(e, 'Could not run task');
    }
  };

  const result = task.lastResult == null ? null : typeof task.lastResult === 'string' ? task.lastResult : JSON.stringify(task.lastResult, null, 2);

  return (
    <Section title={task.id}>
      <ListRow
        title={task.description || task.id}
        subtitle={[task.scheduleDescription, task.timezone].filter(Boolean).join(' · ')}
        code={task.schedule}
        trailing={
          task.isRunning ? (
            <StatusBadge label="Running" tone="progress" />
          ) : !task.enabled ? (
            <StatusBadge label="Disabled" tone="neutral" />
          ) : undefined
        }
      />
      <SwitchRow label="Enabled" value={task.enabled} disabled={!canEdit || update.isPending} onValueChange={(v) => void toggle(v)} />
      <ValueRow label="Last run" value={task.lastExecutedAt ? `${formatRelative(task.lastExecutedAt)} (${formatDate(task.lastExecutedAt)})` : 'Never'} />
      <ValueRow label="Next run" value={task.enabled ? formatDate(task.nextExecutionAt) : '—'} />
      {result ? (
        <View style={{ paddingHorizontal: spacing[4], paddingVertical: spacing[3], gap: spacing[1] }}>
          <Text variant="caption" color="mutedForeground">
            Last result
          </Text>
          <Text variant="mono" color="foreground" selectable numberOfLines={12}>
            {result}
          </Text>
        </View>
      ) : null}
      {canEdit ? (
        <View style={{ padding: spacing[3] }}>
          <Button
            title={task.isRunning ? 'Running…' : 'Run now'}
            variant="secondary"
            size="sm"
            disabled={task.isRunning}
            loading={run.isPending}
            onPress={() => void runNow()}
          />
        </View>
      ) : null}
    </Section>
  );
}
