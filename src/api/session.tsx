/**
 * Session: which server we talk to, the admin's auth token and the selected channel.
 *
 * Persisted in expo-secure-store so the app restores the session on cold start.
 * The root layout waits for `hydrated` before deciding between login and the app,
 * so the wrong screen never flashes.
 */
import * as SecureStore from 'expo-secure-store';
import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { CurrentUserDocument, LoginDocument, LogoutDocument } from '@/api/documents/auth';
import { normalizeApiUrl, request, VendureApiError, type ClientState } from '@/api/client';
import { DEFAULT_SERVER_URL } from '@/constants';
import type { TypedDocumentString } from '@/gql/graphql';

const KEYS = {
  apiUrl: 'vendure.apiUrl',
  authToken: 'vendure.authToken',
  channelToken: 'vendure.channelToken',
} as const;

export interface SessionChannel {
  id: string;
  code: string;
  token: string;
  permissions: string[];
}

interface SessionState extends ClientState {
  hydrated: boolean;
  channels: SessionChannel[];
  identifier?: string;
}

interface SessionContextValue {
  state: SessionState;
  isLoggedIn: boolean;
  login: (serverUrl: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setChannel: (token: string) => Promise<void>;
  /** Typed request bound to the current session. Logs out on an expired session. */
  execute: <R, V>(doc: TypedDocumentString<R, V>, variables?: V, signal?: AbortSignal) => Promise<R>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

async function save(key: string, value: string | null | undefined) {
  if (value) await SecureStore.setItemAsync(key, value);
  else await SecureStore.deleteItemAsync(key);
}

/** The default channel is the one whose code is Vendure's `__default_channel__`. */
function pickChannel(channels: SessionChannel[], previousToken?: string | null) {
  return (
    channels.find((c) => c.token === previousToken) ??
    channels.find((c) => c.code === '__default_channel__') ??
    channels[0]
  );
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<SessionState>({
    hydrated: false,
    apiUrl: DEFAULT_SERVER_URL,
    channels: [],
  });
  // Always-current snapshot for request(): avoids stale closures inside query functions.
  // Every write goes through update(), so the ref is the source of truth.
  const stateRef = useRef(state);

  const update = useCallback((patch: Partial<SessionState>) => {
    const next = { ...stateRef.current, ...patch };
    stateRef.current = next;
    setState(next);
  }, []);

  const clearSession = useCallback(async () => {
    await Promise.all([save(KEYS.authToken, null), save(KEYS.channelToken, null)]);
    update({ authToken: null, channelToken: null, channels: [], identifier: undefined });
    queryClient.clear();
  }, [queryClient, update]);

  const loadUser = useCallback(
    async (base: ClientState) => {
      const { data } = await request(base, CurrentUserDocument);
      const channels = (data.me?.channels ?? []) as SessionChannel[];
      if (!channels.length) {
        throw new VendureApiError('This account has no access to any channel.', 'NO_CHANNELS');
      }
      const channel = pickChannel(channels, base.channelToken);
      return { channels, channel, identifier: data.me?.identifier };
    },
    [],
  );

  // Hydrate from secure storage on startup.
  useEffect(() => {
    (async () => {
      const [apiUrl, authToken, channelToken] = await Promise.all([
        SecureStore.getItemAsync(KEYS.apiUrl),
        SecureStore.getItemAsync(KEYS.authToken),
        SecureStore.getItemAsync(KEYS.channelToken),
      ]);
      const base: ClientState = { apiUrl: apiUrl ?? DEFAULT_SERVER_URL, authToken, channelToken };
      if (authToken) {
        try {
          const { channels, channel, identifier } = await loadUser(base);
          await save(KEYS.channelToken, channel.token);
          update({ ...base, channelToken: channel.token, channels, identifier, hydrated: true });
          return;
        } catch (e) {
          // Expired session → back to login. Offline → keep the session and let screens retry.
          if (e instanceof VendureApiError && e.code !== 'NETWORK_ERROR') {
            await save(KEYS.authToken, null);
            update({ apiUrl: base.apiUrl, authToken: null, hydrated: true });
            return;
          }
        }
      }
      update({ ...base, hydrated: true });
    })();
  }, [loadUser, update]);

  const login = useCallback<SessionContextValue['login']>(
    async (serverUrl, username, password) => {
      const apiUrl = normalizeApiUrl(serverUrl);
      const res = await request({ apiUrl }, LoginDocument, { username, password, rememberMe: true });
      const result = res.data.login;
      if (result.__typename !== 'CurrentUser') {
        throw new VendureApiError(
          'message' in result ? result.message : 'Login failed',
          'errorCode' in result ? result.errorCode : undefined,
        );
      }
      if (!res.authToken) {
        throw new VendureApiError(
          'The server did not return a bearer token. Enable it with authOptions.tokenMethod: ["bearer", "cookie"].',
          'NO_BEARER_TOKEN',
        );
      }
      const base: ClientState = { apiUrl, authToken: res.authToken, channelToken: stateRef.current.channelToken };
      const { channels, channel, identifier } = await loadUser(base);
      await Promise.all([
        save(KEYS.apiUrl, apiUrl),
        save(KEYS.authToken, res.authToken),
        save(KEYS.channelToken, channel.token),
      ]);
      queryClient.clear();
      update({ apiUrl, authToken: res.authToken, channelToken: channel.token, channels, identifier });
    },
    [loadUser, queryClient, update],
  );

  const execute = useCallback<SessionContextValue['execute']>(
    async (doc, variables, signal) => {
      try {
        const res = await request(stateRef.current, doc, variables, signal);
        if (res.authToken && res.authToken !== stateRef.current.authToken) {
          await save(KEYS.authToken, res.authToken);
          update({ authToken: res.authToken });
        }
        return res.data;
      } catch (e) {
        if (e instanceof VendureApiError && e.isAuthError && stateRef.current.authToken) {
          await clearSession();
        }
        throw e;
      }
    },
    [clearSession, update],
  );

  const logout = useCallback(async () => {
    try {
      await request(stateRef.current, LogoutDocument);
    } catch {
      // Logging out locally is what matters; ignore server/network errors.
    }
    await clearSession();
  }, [clearSession]);

  const setChannel = useCallback(
    async (token: string) => {
      await save(KEYS.channelToken, token);
      update({ channelToken: token });
      await queryClient.invalidateQueries();
    },
    [queryClient, update],
  );

  const value = useMemo<SessionContextValue>(
    () => ({ state, isLoggedIn: !!state.authToken, login, logout, setChannel, execute }),
    [state, login, logout, setChannel, execute],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}

/** Channel currently selected for API calls. */
export function useActiveChannel() {
  const { state } = useSession();
  return state.channels.find((c) => c.token === state.channelToken);
}
