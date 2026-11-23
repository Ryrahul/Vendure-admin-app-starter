/**
 * Pure helpers for Vendure mutation results (no React / native imports, so Node smoke
 * scripts can use them too). Re-exported from `@/api/mutations`.
 */
import { VendureApiError } from '@/api/client';

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
