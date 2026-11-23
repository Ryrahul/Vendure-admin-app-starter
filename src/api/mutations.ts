/**
 * Helpers for Vendure mutation results.
 *
 * Many mutations return `Entity | ErrorResult` unions; deletions return
 * `{ result: DELETED | NOT_DELETED, message }`. These turn the failure cases into thrown
 * `VendureApiError`s so screens handle every failure the same way.
 */
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { VendureApiError } from '@/api/client';
import { operationName } from '@/api/hooks';

type MaybeError = { __typename?: string; errorCode?: string; message?: string } | null | undefined;

/** Throws if a union result is an ErrorResult; returns it narrowed otherwise. */
export function unwrapResult<T>(result: T): Exclude<T, { errorCode: string }> {
  const r = result as MaybeError;
  if (r && typeof r === 'object' && 'errorCode' in r && r.errorCode) {
    throw new VendureApiError(r.message ?? r.errorCode, r.errorCode);
  }
  return result as Exclude<T, { errorCode: string }>;
}

/** Throws with the server's message when a deletion was refused. */
export function assertDeleted(res: { result: string; message?: string | null } | { result: string; message?: string | null }[]) {
  for (const r of Array.isArray(res) ? res : [res]) {
    if (r.result !== 'DELETED') throw new VendureApiError(r.message || 'The server refused to delete this item.', 'NOT_DELETED');
  }
}

/** Invalidates every cached query of the given documents (any variables, any channel). */
export function useInvalidate() {
  const queryClient = useQueryClient();
  return useCallback(
    (...docs: { toString(): string }[]) =>
      Promise.all(docs.map((d) => queryClient.invalidateQueries({ queryKey: [operationName(d)] }))),
    [queryClient],
  );
}
