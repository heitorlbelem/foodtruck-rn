import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { api } from '@/api/client';
import { ApiError } from '@/api/http';
import { hasStoredSession, onSessionEnded, refreshSession } from '@/api/session';
import { AuthProvider, useAuth } from '@/model/AuthContext';

jest.mock('@/api/client', () => ({ api: { login: jest.fn(), logout: jest.fn() } }));
jest.mock('@/api/session', () => ({
  hasStoredSession: jest.fn(),
  refreshSession: jest.fn(),
  onSessionEnded: jest.fn(),
}));

const ana = { id: 'u1', name: 'Ana', email: 'ana@exemplo.com', role: 'owner' };
const pair = {
  access_token: 'A1',
  token_type: 'Bearer' as const,
  expires_in: 900,
  refresh_token: 'R1',
  refresh_expires_at: '2026-11-05T12:00:00.000Z',
  user: ana,
};

let endSession: () => void;
beforeEach(() => {
  jest.clearAllMocks();
  (onSessionEnded as jest.Mock).mockImplementation((listener: () => void) => {
    endSession = listener;
    return () => {};
  });
});

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;
const renderAuth = () => renderHook(() => useAuth(), { wrapper });

test('starts signedOut without a stored session', async () => {
  (hasStoredSession as jest.Mock).mockResolvedValue(false);
  const { result } = await renderAuth();
  await waitFor(() => expect(result.current.status).toBe('signedOut'));
  expect(refreshSession).not.toHaveBeenCalled();
});

test('restores the session on boot', async () => {
  (hasStoredSession as jest.Mock).mockResolvedValue(true);
  (refreshSession as jest.Mock).mockResolvedValue(pair);
  const { result } = await renderAuth();
  await waitFor(() => expect(result.current.status).toBe('signedIn'));
  expect(result.current.user?.name).toBe('Ana');
});

test('stays signedIn without user when boot refresh fails by network', async () => {
  (hasStoredSession as jest.Mock).mockResolvedValue(true);
  (refreshSession as jest.Mock).mockRejectedValue(new ApiError('NETWORK', 0));
  const { result } = await renderAuth();
  await waitFor(() => expect(result.current.status).toBe('signedIn'));
  expect(result.current.user).toBeNull();
});

test('goes to login without the notice when boot refresh is invalid', async () => {
  (hasStoredSession as jest.Mock).mockResolvedValue(true);
  (refreshSession as jest.Mock).mockRejectedValue(new ApiError('INVALID_REFRESH_TOKEN', 401));
  const { result } = await renderAuth();
  await waitFor(() => expect(result.current.status).toBe('signedOut'));
  expect(result.current.sessionEnded).toBe(false);
});

test('marks sessionEnded when the session ends while signed in', async () => {
  (hasStoredSession as jest.Mock).mockResolvedValue(true);
  (refreshSession as jest.Mock).mockResolvedValue(pair);
  const { result } = await renderAuth();
  await waitFor(() => expect(result.current.status).toBe('signedIn'));

  await act(async () => endSession());

  expect(result.current.status).toBe('signedOut');
  expect(result.current.sessionEnded).toBe(true);
  expect(result.current.lastEmail).toBe('ana@exemplo.com');
});

test('signIn enters and clears the session notice', async () => {
  (hasStoredSession as jest.Mock).mockResolvedValue(false);
  (api.login as jest.Mock).mockResolvedValue(ana);
  const { result } = await renderAuth();
  await waitFor(() => expect(result.current.status).toBe('signedOut'));

  await act(() => result.current.signIn('ana@exemplo.com', 'segredo123456'));

  expect(api.login).toHaveBeenCalledWith('ana@exemplo.com', 'segredo123456');
  expect(result.current.status).toBe('signedIn');
  expect(result.current.user).toEqual(ana);
  expect(result.current.sessionEnded).toBe(false);
});

test('signIn rethrows the API error and stays signedOut', async () => {
  (hasStoredSession as jest.Mock).mockResolvedValue(false);
  (api.login as jest.Mock).mockRejectedValue(new ApiError('INVALID_CREDENTIALS', 401));
  const { result } = await renderAuth();
  await waitFor(() => expect(result.current.status).toBe('signedOut'));

  await act(() => expect(result.current.signIn('ana@exemplo.com', 'errada')).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' }));
  expect(result.current.status).toBe('signedOut');
});

test('signOut leaves even when logout fails', async () => {
  (hasStoredSession as jest.Mock).mockResolvedValue(true);
  (refreshSession as jest.Mock).mockResolvedValue(pair);
  (api.logout as jest.Mock).mockResolvedValue(undefined);
  const { result } = await renderAuth();
  await waitFor(() => expect(result.current.status).toBe('signedIn'));

  await act(() => result.current.signOut());

  expect(api.logout).toHaveBeenCalledTimes(1);
  expect(result.current.status).toBe('signedOut');
  expect(result.current.sessionEnded).toBe(false);
});
