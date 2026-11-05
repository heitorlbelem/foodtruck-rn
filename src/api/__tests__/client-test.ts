/* eslint-disable @typescript-eslint/no-require-imports -- each test reloads the modules to reset the in-memory session */
import type { TokenPair } from '@/api/types';

const mockStore = new Map<string, string>();
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async (key: string) => mockStore.get(key) ?? null),
  setItemAsync: jest.fn(async (key: string, value: string) => {
    mockStore.set(key, value);
  }),
  deleteItemAsync: jest.fn(async (key: string) => {
    mockStore.delete(key);
  }),
}));

type Reply = { status: number; body?: unknown } | Error;
type Handler = (path: string, init: RequestInit) => Reply;

const fetchMock = jest.fn();
globalThis.fetch = fetchMock as unknown as typeof fetch;

function serve(handler: Handler) {
  fetchMock.mockImplementation(async (url: string, init: RequestInit) => {
    const reply = handler(new URL(url).pathname.replace(/^.*\/api\/v1/, ''), init);
    if (reply instanceof Error) throw reply;
    return {
      status: reply.status,
      ok: reply.status >= 200 && reply.status < 300,
      json: async () => reply.body,
    };
  });
}

const ana = { id: 'u1', name: 'Ana', email: 'ana@exemplo.com', role: 'owner' };
const pair = (n: number): TokenPair => ({
  access_token: `A${n}`,
  token_type: 'Bearer',
  expires_in: 900,
  refresh_token: `R${n}`,
  refresh_expires_at: '2026-11-05T12:00:00.000Z',
  user: ana,
});
const unauthenticated = { status: 401, body: { code: 'UNAUTHENTICATED' } };
const headers = (call: number) => (fetchMock.mock.calls[call][1].headers ?? {}) as Record<string, string>;
const calls = (path: string) => fetchMock.mock.calls.filter(([url]) => String(url).endsWith(path)).length;

let api: typeof import('@/api/client')['api'];
let session: typeof import('@/api/session');
let secureStore: typeof import('expo-secure-store');

beforeEach(async () => {
  jest.resetModules();
  mockStore.clear();
  fetchMock.mockReset();
  api = require('@/api/client').api;
  session = require('@/api/session');
  secureStore = require('expo-secure-store');
  serve((path) => (path === '/auth/login' ? { status: 200, body: pair(1) } : { status: 500 }));
  await api.login('ana@exemplo.com', 'segredo123456');
  fetchMock.mockClear();
});

test('login keeps the refresh token in secure storage and returns the user', async () => {
  expect(mockStore.get(session.REFRESH_TOKEN_KEY)).toBe('R1');
  expect(session.getAccessToken()).toBe('A1');
});

test('sends the bearer on menu', async () => {
  serve(() => ({ status: 200, body: { categories: [], addons: [], combos: [] } }));
  await api.menu();
  expect(headers(0).Authorization).toBe('Bearer A1');
});

test('refreshes once on UNAUTHENTICATED and retries with the new token', async () => {
  serve((path, init) => {
    if (path === '/auth/refresh') return { status: 200, body: pair(2) };
    const auth = (init.headers as Record<string, string>).Authorization;
    return auth === 'Bearer A2' ? { status: 200, body: {} } : unauthenticated;
  });
  await api.menu();

  expect(fetchMock).toHaveBeenCalledTimes(3);
  expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ refresh_token: 'R1' });
  expect(headers(2).Authorization).toBe('Bearer A2');
  const savedR2 = (secureStore.setItemAsync as jest.Mock).mock.calls.findIndex(([, v]) => v === 'R2');
  const savedAt = (secureStore.setItemAsync as jest.Mock).mock.invocationCallOrder[savedR2];
  expect(savedAt).toBeLessThan(fetchMock.mock.invocationCallOrder[2]);
});

test('shares one refresh between concurrent requests', async () => {
  serve((path, init) => {
    if (path === '/auth/refresh') return { status: 200, body: pair(2) };
    const auth = (init.headers as Record<string, string>).Authorization;
    return auth === 'Bearer A2' ? { status: 200, body: {} } : unauthenticated;
  });
  await Promise.all([api.menu(), api.menu()]);
  expect(calls('/auth/refresh')).toBe(1);
});

test('ends the session on INVALID_REFRESH_TOKEN', async () => {
  const ended = jest.fn();
  session.onSessionEnded(ended);
  serve((path) =>
    path === '/auth/refresh' ? { status: 401, body: { code: 'INVALID_REFRESH_TOKEN' } } : unauthenticated,
  );

  await expect(api.menu()).rejects.toMatchObject({ code: 'INVALID_REFRESH_TOKEN' });
  expect(mockStore.has(session.REFRESH_TOKEN_KEY)).toBe(false);
  expect(session.getAccessToken()).toBeNull();
  expect(ended).toHaveBeenCalledTimes(1);
});

test('keeps the session when refresh fails by network', async () => {
  const ended = jest.fn();
  session.onSessionEnded(ended);
  serve((path) => (path === '/auth/refresh' ? new TypeError('Network request failed') : unauthenticated));

  await expect(api.menu()).rejects.toMatchObject({ code: 'NETWORK' });
  expect(mockStore.get(session.REFRESH_TOKEN_KEY)).toBe('R1');
  expect(ended).not.toHaveBeenCalled();
});

test('does not loop when the retried request is also 401', async () => {
  serve((path) => (path === '/auth/refresh' ? { status: 200, body: pair(2) } : unauthenticated));
  await expect(api.menu()).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
  expect(calls('/auth/refresh')).toBe(1);
});

test('archive sends Authorization but no Content-Type', async () => {
  serve(() => ({ status: 204 }));
  await api.archive('items', 'x');
  expect(headers(0).Authorization).toBe('Bearer A1');
  expect(headers(0)['Content-Type']).toBeUndefined();
  expect(fetchMock.mock.calls[0][1].body).toBeUndefined();
});

test('logout clears storage even when the request fails', async () => {
  serve(() => new TypeError('Network request failed'));
  await api.logout();
  expect(await session.hasStoredSession()).toBe(false);
  expect(session.getAccessToken()).toBeNull();
});

test('signing out during an in-flight refresh does not bring the session back', async () => {
  let releaseRefresh: () => void = () => {};
  fetchMock.mockImplementation((url: string) => {
    const path = new URL(url).pathname;
    if (path.endsWith('/auth/refresh')) {
      return new Promise((resolve) => {
        releaseRefresh = () => resolve({ status: 200, ok: true, json: async () => pair(2) });
      });
    }
    if (path.endsWith('/auth/logout')) return Promise.resolve({ status: 204, ok: true, json: async () => null });
    return Promise.resolve({ status: 401, ok: false, json: async () => ({ code: 'UNAUTHENTICATED' }) });
  });

  const menu = api.menu().catch((e) => e);
  await new Promise((r) => setTimeout(r, 0));
  await api.logout();
  releaseRefresh();
  await menu;

  expect(await session.hasStoredSession()).toBe(false);
  expect(session.getAccessToken()).toBeNull();
});

test('logout clears storage without waiting for a stalled request', async () => {
  fetchMock.mockImplementation(() => new Promise(() => {}));
  await api.logout();
  expect(await session.hasStoredSession()).toBe(false);
  expect(session.getAccessToken()).toBeNull();
});
