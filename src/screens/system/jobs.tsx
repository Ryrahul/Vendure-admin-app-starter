/**
 * Job queue (System): jobs newest first with queue + state filters, auto-refresh while
 * jobs are unsettled, "Rebuild search index", and a detail screen with the payloads and cancel.
 */
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  ActiveJobCountDocument,
  CancelJobDocument,
  JobDetailDocument,
  JobListDocument,
  JobQueueListDocument,
  RebuildSearchIndexDocument,
} from '@/api/documents/jobs';
import { useVendureMutation, useVendureQuery } from '@/api/hooks';
import { useInvalidate } from '@/api/mutations';
import { usePermissions } from '@/api/permissions';
import { Button } from '@/components/button';
import { ValueRow } from '@/components/form/fields';
import { ListRow } from '@/components/list-row';
import { EntityListScreen, FilterChips, FormScroll, QueryBoundary } from '@/components/screen-kit';
import { Section } from '@/components/section';
import { StatusBadge } from '@/components/status-badge';
import { Text } from '@/components/text';
import type { JobFilterParameter, JobState } from '@/gql/graphql';
import { useTheme, type StatusTone } from '@/theme';
import { alertError, confirm } from '@/utils/confirm';
import { formatDate, formatRelative } from '@/utils/format';

const POLL_MS = 3000;

type StateFilter = 'all' | 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

const STATE_FILTERS: Record<Exclude<StateFilter, 'all'>, JobState[]> = {
  pending: ['PENDING', 'RETRYING'],
  running: ['RUNNING'],
  completed: ['COMPLETED'],
  failed: ['FAILED'],
  cancelled: ['CANCELLED'],
};

export const jobStateTone: Record<JobState, StatusTone> = {
  PENDING: 'neutral',
  RETRYING: 'warning',
  RUNNING: 'progress',
  COMPLETED: 'success',
  FAILED: 'critical',
  CANCELLED: 'neutral',
};

const humanizeQueue = (name: string) => name.replace(/[-_]+/g, ' ').replace(/^./, (c) => c.toUpperCase());

function formatDuration(ms: number) {
  if (ms < 1000) return `${ms} ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)} s`;
  const m = Math.floor(s / 60);
  return `${m}m ${Math.round(s % 60)}s`;
}

export function JobListScreen() {
  const { spacing } = useTheme();
  const { can } = usePermissions();
  const invalidate = useInvalidate();
  const [queue, setQueue] = useState('all');
  const [state, setState] = useState<StateFilter>('all');
  const queues = useVendureQuery(JobQueueListDocument, undefined, { staleTime: 60_000 });
  const reindex = useVendureMutation(RebuildSearchIndexDocument);

  const filter: JobFilterParameter = {
    ...(queue === 'all' ? {} : { queueName: { eq: queue } }),
    ...(state === 'all' ? {} : { state: { in: STATE_FILTERS[state] } }),
  };

  // Poll a cheap count; while anything in view is unsettled, refresh the list.
  const active = useVendureQuery(
    ActiveJobCountDocument,
    { filter: { ...(queue === 'all' ? {} : { queueName: { eq: queue } }), isSettled: { eq: false } } },
    { refetchInterval: POLL_MS },
  );
  const hasActive = (active.data?.jobs.totalItems ?? 0) > 0;
  useEffect(() => {
    if (!hasActive) return;
    const t = setInterval(() => void invalidate(JobListDocument), POLL_MS);
    return () => clearInterval(t);
  }, [hasActive, invalidate]);

  const rebuild = async () => {
    const ok = await confirm({
      title: 'Rebuild search index?',
      message: 'Queues a job that reindexes every product variant. Search results may be incomplete until it finishes.',
      confirmLabel: 'Rebuild',
    });
    if (!ok) return;
    try {
      const res = await reindex.mutateAsync({});
      await invalidate(JobListDocument, ActiveJobCountDocument);
      router.push(`/more/jobs/${res.reindex.id}`);
    } catch (e) {
      alertError(e, 'Could not start reindex');
    }
  };

  return (
    <EntityListScreen
      document={JobListDocument}
      variables={(_term, skip, take) => ({ options: { skip, take, sort: { createdAt: 'DESC' as const }, filter } })}
      select={(r) => r.jobs}
      noun={['job', 'jobs']}
      searchable={false}
      keyExtra={`${queue}|${state}`}
      filters={
        <View style={{ gap: spacing[3] }}>
          {can('UpdateCatalog', 'UpdateProduct') ? (
            <Section footer={hasActive ? 'Jobs are running; this list refreshes automatically.' : undefined}>
              <ListRow
                title={reindex.isPending ? 'Starting reindex…' : 'Rebuild search index'}
                subtitle="Reindex all products for storefront search"
                onPress={reindex.isPending ? undefined : () => void rebuild()}
              />
            </Section>
          ) : null}
          <FilterChips
            value={queue}
            onChange={setQueue}
            options={[
              { value: 'all', label: 'All queues' },
              ...(queues.data?.jobQueues ?? []).map((q) => ({ value: q.name, label: humanizeQueue(q.name) })),
            ]}
          />
          <FilterChips
            value={state}
            onChange={setState}
            options={[
              { value: 'all', label: 'All' },
              { value: 'pending', label: 'Pending' },
              { value: 'running', label: 'Running' },
              { value: 'completed', label: 'Completed' },
              { value: 'failed', label: 'Failed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
          />
        </View>
      }
      row={(j) => ({
        title: humanizeQueue(j.queueName),
        code: `#${j.id}`,
        subtitle: [
          formatRelative(j.createdAt),
          j.state === 'RUNNING' ? `${Math.round(j.progress)}%` : null,
          j.settledAt && j.duration ? formatDuration(j.duration) : null,
        ]
          .filter(Boolean)
          .join(' · '),
        trailing: <StatusBadge label={humanizeState(j.state)} tone={jobStateTone[j.state]} />,
        onPress: () => router.push(`/more/jobs/${j.id}`),
      })}
    />
  );
}

const humanizeState = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

export function JobDetailScreen({ id }: { id: string }) {
  const { spacing } = useTheme();
  const { can } = usePermissions();
  const invalidate = useInvalidate();
  const query = useVendureQuery(
    JobDetailDocument,
    { id },
    { refetchInterval: (q) => (q.state.data?.job && !q.state.data.job.isSettled ? POLL_MS : false) },
  );
  const cancel = useVendureMutation(CancelJobDocument);

  return (
    <>
      <Stack.Screen options={{ title: `Job #${id}` }} />
      <QueryBoundary query={query} pick={(d) => d.job} noun="job">
        {(job) => (
          <FormScroll refreshing={query.isRefetching} onRefresh={() => void query.refetch()}>
            <Section title="Status">
              <ListRow
                title={humanizeQueue(job.queueName)}
                code={job.queueName}
                trailing={<StatusBadge label={humanizeState(job.state)} tone={jobStateTone[job.state]} />}
              />
              <ValueRow label="Progress" value={`${Math.round(job.progress)}%`} />
              <ValueRow label="Attempts" value={`${job.attempts} of ${job.retries + 1}`} />
              <ValueRow label="Duration" value={job.isSettled ? formatDuration(job.duration) : '—'} />
            </Section>
            {job.error != null ? <JsonSection title="Error" value={job.error} tone="destructive" /> : null}
            <JsonSection title="Result" value={job.result} />
            <JsonSection title="Data" value={job.data} />
            <Section title="Info">
              <ValueRow label="ID" value={job.id} mono />
              <ValueRow label="Created" value={formatDate(job.createdAt)} />
              <ValueRow label="Started" value={formatDate(job.startedAt)} />
              <ValueRow label="Settled" value={formatDate(job.settledAt)} />
            </Section>
            {!job.isSettled && can('DeleteSettings', 'DeleteSystem') ? (
              <Section>
                <View style={{ padding: spacing[3] }}>
                  <Button
                    title="Cancel job"
                    variant="destructive"
                    loading={cancel.isPending}
                    onPress={async () => {
                      const ok = await confirm({
                        title: 'Cancel job?',
                        message: 'The job stops (if the worker supports it) and will not be retried.',
                        confirmLabel: 'Cancel job',
                        destructive: true,
                      });
                      if (!ok) return;
                      try {
                        await cancel.mutateAsync({ jobId: job.id });
                        await invalidate(JobDetailDocument, JobListDocument, ActiveJobCountDocument);
                      } catch (e) {
                        alertError(e, 'Could not cancel job');
                      }
                    }}
                  />
                </View>
              </Section>
            ) : null}
          </FormScroll>
        )}
      </QueryBoundary>
    </>
  );
}

/** Pretty-printed JSON in monospace, horizontally scrollable for long lines. */
export function JsonSection({ title, value, tone }: { title: string; value: unknown; tone?: 'destructive' }) {
  const { spacing } = useTheme();
  const text = value == null ? 'null' : typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  return (
    <Section title={title}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: spacing[4] }}>
        <Text variant="mono" color={tone ?? (value == null ? 'mutedForeground' : 'foreground')} selectable>
          {text}
        </Text>
      </ScrollView>
    </Section>
  );
}
