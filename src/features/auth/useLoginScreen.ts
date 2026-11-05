import { useEffect, useRef, useState } from 'react';

import { ApiError } from '@/api/http';
import { useToast } from '@/components/Toast';
import { plural } from '@/lib/plural';
import { useAuth } from '@/model/AuthContext';
import { errorMessage } from '@/model/texts';

type Errors = { email?: string; password?: string };

export function useLoginScreen() {
  const { signIn, sessionEnded, lastEmail } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState(sessionEnded ? lastEmail : '');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const unblockTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(unblockTimer.current), []);

  function block(seconds: number) {
    setBlocked(true);
    clearTimeout(unblockTimer.current);
    unblockTimer.current = setTimeout(() => setBlocked(false), seconds * 1000);
  }

  async function submit() {
    const trimmed = email.trim();
    const next: Errors = {
      email: trimmed ? undefined : 'Informe o seu e-mail.',
      password: password ? undefined : 'Informe a sua senha.',
    };
    setErrors(next);
    if (next.email || next.password) return;

    setSubmitting(true);
    try {
      await signIn(trimmed, password);
    } catch (e) {
      const error = e instanceof ApiError ? e : new ApiError('INTERNAL_ERROR', 0);
      if (error.code === 'INVALID_CREDENTIALS') {
        // Never say which of the two was wrong.
        setErrors({ password: 'E-mail ou senha incorretos.' });
      } else if (error.code === 'TOO_MANY_ATTEMPTS') {
        const seconds = error.details.retry_after_seconds ?? 15 * 60;
        const minutes = plural(Math.ceil(seconds / 60), 'minuto', 'minutos');
        setErrors({ password: `Muitas tentativas. Tente de novo em ${minutes}.` });
        block(seconds);
      } else {
        toast({ message: errorMessage(error), variant: 'error' });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return {
    email,
    password,
    setEmail: (text: string) => {
      setEmail(text);
      setErrors((e) => ({ ...e, email: undefined }));
    },
    setPassword: (text: string) => {
      setPassword(text);
      setErrors((e) => ({ ...e, password: undefined }));
    },
    errors,
    submitting,
    blocked,
    notice: sessionEnded ? 'Sua sessão terminou. Entre de novo para continuar.' : undefined,
    submit,
  };
}
