/**
 * TanStack Query bindings for typed Vendure documents.
 *
 *   const { data } = useVendureQuery(ProductListDocument, { options: { take: 20 } });
 *
 * Query keys include the operation, variables and the active channel, so switching
 * channels refetches everything automatically.
 */
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query';

import { useSession } from '@/api/session';
import type { TypedDocumentString } from '@/gql/graphql';

/** Extracts the operation name ("ProductList") for readable cache keys. */
export function operationName(doc: { toString(): string }) {
  return /(?:query|mutation)\s+(\w+)/.exec(doc.toString())?.[1] ?? 'anonymous';
}

export function useVendureQuery<R, V>(
  doc: TypedDocumentString<R, V>,
  variables?: V,
  options?: Omit<UseQueryOptions<R>, 'queryKey' | 'queryFn'>,
) {
  const { execute, state } = useSession();
  return useQuery<R>({
    queryKey: [operationName(doc), state.apiUrl, state.channelToken, variables ?? null],
    queryFn: ({ signal }) => execute(doc, variables, signal),
    enabled: !!state.authToken,
    ...options,
  });
}

/**
 * Offset pagination over a Vendure `PaginatedList` (`items` + `totalItems`).
 * `select` picks the list out of the result, `build` produces variables for a page.
 */
export function useVendureInfiniteList<R, V, Item>(
  doc: TypedDocumentString<R, V>,
  build: (skip: number, take: number) => V,
  select: (result: R) => { items: Item[]; totalItems: number },
  pageSize = 20,
  keyExtra: unknown = null,
) {
  const { execute, state } = useSession();
  const query = useInfiniteQuery({
    queryKey: [operationName(doc), state.apiUrl, state.channelToken, keyExtra],
    queryFn: async ({ pageParam, signal }) => select(await execute(doc, build(pageParam, pageSize), signal)),
    initialPageParam: 0,
    getNextPageParam: (last, pages) => {
      const loaded = pages.reduce((n, p) => n + p.items.length, 0);
      return loaded < last.totalItems ? loaded : undefined;
    },
    enabled: !!state.authToken,
    placeholderData: keepPreviousData,
  });
  const items = query.data?.pages.flatMap((p) => p.items) ?? [];
  const totalItems = query.data?.pages[0]?.totalItems ?? 0;
  return { ...query, items, totalItems };
}

export function useVendureMutation<R, V>(doc: TypedDocumentString<R, V>) {
  const { execute } = useSession();
  return useMutation<R, Error, V>({
    mutationFn: (variables) => execute(doc, variables),
  });
}
