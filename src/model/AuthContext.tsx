import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { api } from '@/api/client';
import { ApiError } from '@/api/http';
import { hasStoredSession, onSessionEnded, refreshSession } from '@/api/session';
import type { AuthUser } from '@/api/types';

type AuthStatus = 'checking' | 'signedOut' | 'signedIn';

type AuthState = {
  status: AuthStatus;
  /** Null while signed in offline: the session is kept, but the API could not say who it is. */
  user: AuthUser | null;
  /** True only when the session ended by itself while in use, not on "Sair". */
  sessionEnded: boolean;
  /** Email of the last user, to prefill the login. */
  lastEmail: string;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('checking');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [lastEmail, setLastEmail] = useState('');
  const userRef = useRef<AuthUser | null>(null);

  const enter = useCallback((next: AuthUser | null) => {
    userRef.current = next;
    if (next) setLastEmail(next.email);
    setUser(next);
    setSessionEnded(false);
    setStatus('signedIn');
  }, []);

  useEffect(() => {
    const unsubscribe = onSessionEnded(() => {
      if (userRef.current) setLastEmail(userRef.current.email);
      userRef.current = null;
      setUser(null);
      setSessionEnded(true);
      setStatus('signedOut');
    });

    (async () => {
      if (!(await hasStoredSession())) return setStatus('signedOut');
      try {
        enter((await refreshSession()).user);
      } catch (e) {
        // Offline or server error: keep the session and let the screens offer a retry.
        if (e instanceof ApiError && e.code === 'INVALID_REFRESH_TOKEN') setStatus('signedOut');
        else enter(null);
      }
    })();

    return unsubscribe;
  }, [enter]);

  const signIn = useCallback(async (email: string, password: string) => enter(await api.login(email, password)), [enter]);

  const signOut = useCallback(async () => {
    await api.logout();
    userRef.current = null;
    setUser(null);
    setSessionEnded(false);
    setStatus('signedOut');
  }, []);

  const value = useMemo(
    () => ({ status, user, sessionEnded, lastEmail, signIn, signOut }),
    [status, user, sessionEnded, lastEmail, signIn, signOut],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const state = useContext(AuthContext);
  if (!state) throw new Error('useAuth requires AuthProvider');
  return state;
}
