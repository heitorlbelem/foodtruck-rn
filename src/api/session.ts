// The access token lives only in memory; the refresh token only in the secure store.
import * as SecureStore from 'expo-secure-store';

import { ApiError, send } from './http';
import type { TokenPair } from './types';

export const REFRESH_TOKEN_KEY = 'ember.refresh_token';

let accessToken: string | null = null;
let refreshing: Promise<TokenPair> | null = null;
/** Bumped on every endSession: a refresh started before it must not bring the session back. */
let generation = 0;
const endedListeners = new Set<() => void>();

export const getAccessToken = () => accessToken;

/** Saves the refresh token before exposing the access token: a crash in between never loses the session. */
export async function startSession(pair: TokenPair): Promise<void> {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, pair.refresh_token);
  accessToken = pair.access_token;
}

export async function endSession(): Promise<void> {
  generation += 1;
  accessToken = null;
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

export async function hasStoredSession(): Promise<boolean> {
  return (await SecureStore.getItemAsync(REFRESH_TOKEN_KEY)) !== null;
}

export function onSessionEnded(listener: () => void): () => void {
  endedListeners.add(listener);
  return () => endedListeners.delete(listener);
}

/**
 * Trades the stored refresh token for a new pair. Concurrent callers share the same
 * call: two refreshes with the same token would end the session as reuse.
 */
export function refreshSession(): Promise<TokenPair> {
  refreshing ??= (async () => {
    const startedAt = generation;
    const ended = () => new ApiError('INVALID_REFRESH_TOKEN', 401);
    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      if (!refreshToken) throw ended();
      const pair = await send<TokenPair>('POST', '/auth/refresh', { body: { refresh_token: refreshToken } });
      // Signed out while the refresh was in flight: drop the new pair.
      if (generation !== startedAt) throw ended();
      await startSession(pair);
      if (generation !== startedAt) {
        await endSession();
        throw ended();
      }
      return pair;
    } catch (e) {
      // Only an invalid refresh token ends the session; network and server errors keep it.
      if (e instanceof ApiError && e.code === 'INVALID_REFRESH_TOKEN' && generation === startedAt) {
        await endSession();
        endedListeners.forEach((listener) => listener());
      }
      throw e;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}
