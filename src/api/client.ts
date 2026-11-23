/**
 * Minimal Vendure Admin API client.
 *
 * - Sends `Authorization: Bearer <token>` (Vendure's bearer token method; the server must
 *   have `authOptions.tokenMethod` include `'bearer'` — the default config does).
 * - Sends the selected channel token in the `vendure-token` header.
 * - Captures a refreshed session token from the `vendure-auth-token` response header.
 *
 * Documents are typed by graphql-codegen (`src/gql`), so `request()` infers both the
 * variables and the result type from the document you pass in.
 */
import type { TypedDocumentString } from '@/gql/graphql';

export const AUTH_TOKEN_HEADER = 'vendure-auth-token';
export const CHANNEL_TOKEN_HEADER = 'vendure-token';

export interface ClientState {
  apiUrl: string;
  authToken?: string | null;
  channelToken?: string | null;
}

export interface GraphQLErrorShape {
  message: string;
  extensions?: { code?: string; [key: string]: unknown };
}

export class VendureApiError extends Error {
  constructor(
    message: string,
    readonly code?: string,
    readonly errors: GraphQLErrorShape[] = [],
    readonly status?: number,
  ) {
    super(message);
    this.name = 'VendureApiError';
  }

  get isAuthError() {
    return this.code === 'FORBIDDEN' || this.code === 'UNAUTHORIZED' || this.status === 401;
  }
}

export interface RequestResult<T> {
  data: T;
  /** New session token, if the server sent one back. */
  authToken: string | null;
}

/** Turns what a user typed ("shop.com", "https://shop.com/") into an Admin API URL. */
export function normalizeApiUrl(input: string): string {
  let url = input.trim().replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  if (!/\/admin-api$/i.test(url)) url = `${url}/admin-api`;
  return url;
}

/** Origin of the server (for resolving relative asset URLs). */
export function serverOrigin(apiUrl: string): string {
  const match = /^(https?:\/\/[^/]+)/i.exec(apiUrl);
  return match ? match[1] : apiUrl;
}

export async function request<TResult, TVariables>(
  state: ClientState,
  document: TypedDocumentString<TResult, TVariables>,
  variables?: TVariables,
  signal?: AbortSignal,
): Promise<RequestResult<TResult>> {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    accept: 'application/json',
  };
  if (state.authToken) headers.authorization = `Bearer ${state.authToken}`;
  if (state.channelToken) headers[CHANNEL_TOKEN_HEADER] = state.channelToken;

  let response: Response;
  try {
    response = await fetch(state.apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: document.toString(), variables: variables ?? {} }),
      signal,
    });
  } catch {
    throw new VendureApiError(
      `Could not reach ${state.apiUrl}. Check the server URL and your connection.`,
      'NETWORK_ERROR',
    );
  }

  let json: { data?: TResult; errors?: GraphQLErrorShape[] } | undefined;
  try {
    json = await response.json();
  } catch {
    throw new VendureApiError(
      `Unexpected response (${response.status}) from ${state.apiUrl}. Is this a Vendure Admin API URL?`,
      'BAD_RESPONSE',
      [],
      response.status,
    );
  }

  if (json?.errors?.length) {
    const first = json.errors[0];
    throw new VendureApiError(first.message, first.extensions?.code, json.errors, response.status);
  }
  if (!json?.data) {
    throw new VendureApiError(`Empty response (${response.status})`, 'BAD_RESPONSE', [], response.status);
  }

  return { data: json.data, authToken: response.headers.get(AUTH_TOKEN_HEADER) };
}
