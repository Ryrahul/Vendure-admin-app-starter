import { graphql } from '@/gql';

export const ScheduledTasksDocument = graphql(`
  query ScheduledTasks {
    scheduledTasks {
      id
      description
      schedule
      scheduleDescription
      timezone
      lastExecutedAt
      nextExecutionAt
      isRunning
      lastResult
      enabled
    }
  }
`);

export const UpdateScheduledTaskDocument = graphql(`
  mutation UpdateScheduledTask($input: UpdateScheduledTaskInput!) {
    updateScheduledTask(input: $input) {
      id
      enabled
    }
  }
`);

export const RunScheduledTaskDocument = graphql(`
  mutation RunScheduledTask($id: String!) {
    runScheduledTask(id: $id) {
      success
    }
  }
`);
