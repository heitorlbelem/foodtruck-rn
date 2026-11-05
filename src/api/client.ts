import { ApiError, send } from './http';
import { endSession, getAccessToken, refreshSession, startSession } from './session';
import type { AuthUser, Menu, Resource, TokenPair } from './types';

/** Authorized call: on UNAUTHENTICATED, refreshes once and retries once. */
async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  try {
    return await send<T>(method, path, { body, token: getAccessToken() ?? undefined });
  } catch (e) {
    if (!(e instanceof ApiError) || e.code !== 'UNAUTHENTICATED') throw e;
    const pair = await refreshSession();
    return send<T>(method, path, { body, token: pair.access_token });
  }
}

export const api = {
  async login(email: string, password: string): Promise<AuthUser> {
    const pair = await send<TokenPair>('POST', '/auth/login', { body: { email, password } });
    await startSession(pair);
    return pair.user;
  },
  /**
   * Leaves at once, even with no internet or a stalled connection: the local session is
   * cleared first and the server is told afterwards, best effort.
   */
  async logout(): Promise<void> {
    const token = getAccessToken() ?? undefined;
    await endSession();
    send<void>('POST', '/auth/logout', { token }).catch(() => {
      // The owner pressed "Sair": she is out whatever the server says.
    });
  },
  me: () => request<AuthUser>('GET', '/auth/me'),
  menu: () => request<Menu>('GET', '/menu'),
  create: <T>(resource: Resource, body: object) => request<T>('POST', `/${resource}`, body),
  update: <T>(resource: Resource, id: string, body: object) => request<T>('PATCH', `/${resource}/${id}`, body),
  archive: (resource: Resource, id: string) => request<void>('DELETE', `/${resource}/${id}`),
  restore: <T>(resource: Resource, id: string) => request<T>('POST', `/${resource}/${id}/restore`),
};
