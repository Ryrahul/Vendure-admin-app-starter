import { graphql } from '@/gql';

export const JobListDocument = graphql(`
  query JobList($options: JobListOptions) {
    jobs(options: $options) {
      items {
        id
        queueName
        state
        progress
        createdAt
        settledAt
        duration
      }
      totalItems
    }
  }
`);

export const JobDetailDocument = graphql(`
  query JobDetail($id: ID!) {
    job(jobId: $id) {
      id
      queueName
      state
      progress
      createdAt
      startedAt
      settledAt
      isSettled
      duration
      data
      result
      error
      retries
      attempts
    }
  }
`);

export const JobQueueListDocument = graphql(`
  query JobQueueList {
    jobQueues {
      name
      running
    }
  }
`);

export const CancelJobDocument = graphql(`
  mutation CancelJob($jobId: ID!) {
    cancelJob(jobId: $jobId) {
      id
      state
    }
  }
`);

export const RebuildSearchIndexDocument = graphql(`
  mutation RebuildSearchIndex {
    reindex {
      id
      queueName
      state
    }
  }
`);

/** Count of unsettled jobs; polled to decide whether the job list auto-refreshes. */
export const ActiveJobCountDocument = graphql(`
  query ActiveJobCount($filter: JobFilterParameter) {
    jobs(options: { take: 1, filter: $filter }) {
      totalItems
    }
  }
`);
