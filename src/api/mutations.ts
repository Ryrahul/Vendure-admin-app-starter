/**
 * Helpers for Vendure mutation results.
 *
 * Many mutations return `Entity | ErrorResult` unions; deletions return
 * `{ result: DELETED | NOT_DELETED, message }`. These turn the failure cases into thrown
 * `VendureApiError`s so screens handle every failure the same way.
 */
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { operationName } from '@/api/hooks';

export { assertDeleted, unwrapResult } from '@/api/results';

/** Invalidates every cached query of the given documents (any variables, any channel). */
export function useInvalidate() {
  const queryClient = useQueryClient();
  return useCallback(
    (...docs: { toString(): string }[]) =>
      Promise.all(docs.map((d) => queryClient.invalidateQueries({ queryKey: [operationName(d)] }))),
    [queryClient],
  );
}
