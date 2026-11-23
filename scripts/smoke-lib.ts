/**
 * Shared helpers for the smoke tests: a session-bound `run()` that expands `@customFields`
 * exactly like the app does, plus a guard that keeps write tests on a local server.
 */
import { CurrentUserDocument, LoginDocument } from '../src/api/documents/auth';
import { ServerConfigDocument } from '../src/api/documents/server-config';
import { normalizeApiUrl, request, type ClientState } from '../src/api/client';
import { buildCustomFieldsMap, expandCustomFields, type CustomFieldsMap } from '../src/api/custom-fields';
import type { TypedDocumentString } from '../src/gql/graphql';

export interface SmokeContext {
  state: ClientState;
  customFields: CustomFieldsMap;
  run: <R, V>(doc: TypedDocumentString<R, V>, variables?: V) => Promise<R>;
  ok: (label: string, detail: string) => void;
}

export async function connect(api: string, user: string, pass: string): Promise<SmokeContext> {
  const state: ClientState = { apiUrl: normalizeApiUrl(api) };
  const login = await request(state, LoginDocument, { username: user, password: pass });
  if (login.data.login.__typename !== 'CurrentUser' || !login.authToken) throw new Error('login failed');
  state.authToken = login.authToken;
  const me = await request(state, CurrentUserDocument);
  const channels = me.data.me?.channels ?? [];
  state.channelToken = (channels.find((c) => c.code === '__default_channel__') ?? channels[0])?.token;
  const cfg = await request(state, ServerConfigDocument);
  const customFields = buildCustomFieldsMap(cfg.data.globalSettings.serverConfig.entityCustomFields);
  const run = async <R, V>(doc: TypedDocumentString<R, V>, variables?: V) => {
    const expanded = expandCustomFields(doc.toString(), customFields);
    return (await request(state, { toString: () => expanded } as typeof doc, variables)).data;
  };
  const ok = (label: string, detail: string) => console.log(`✔ ${label.padEnd(24)} ${detail}`);
  return { state, customFields, run, ok };
}

/** Write/destructive suites must only ever hit a local dev server. */
export function assertLocal(apiUrl: string) {
  if (!/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//.test(apiUrl)) {
    throw new Error(`Refusing to run destructive smoke tests against ${apiUrl} — use the local dev-server.`);
  }
}

export function expect(cond: unknown, message: string): asserts cond {
  if (!cond) throw new Error(`✗ ${message}`);
}
