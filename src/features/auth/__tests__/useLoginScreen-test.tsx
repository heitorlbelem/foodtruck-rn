import { act, renderHook } from '@testing-library/react-native';

import { ApiError } from '@/api/http';
import { useToast } from '@/components/Toast';
import { useLoginScreen } from '@/features/auth/useLoginScreen';
import { useAuth } from '@/model/AuthContext';

jest.mock('@/model/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('@/components/Toast', () => ({ useToast: jest.fn() }));

const signIn = jest.fn();
const toast = jest.fn();

function setup(auth: { sessionEnded?: boolean; lastEmail?: string } = {}) {
  (useAuth as jest.Mock).mockReturnValue({ signIn, sessionEnded: false, lastEmail: '', ...auth });
  (useToast as jest.Mock).mockReturnValue(toast);
  return renderHook(() => useLoginScreen());
}

async function fillAndSubmit(result: { current: ReturnType<typeof useLoginScreen> }, email: string, password: string) {
  await act(() => result.current.setEmail(email));
  await act(() => result.current.setPassword(password));
  await act(() => result.current.submit());
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
});

test('requires email and password', async () => {
  const { result } = await setup();
  await act(() => result.current.submit());
  expect(result.current.errors).toEqual({ email: 'Informe o seu e-mail.', password: 'Informe a sua senha.' });
  expect(signIn).not.toHaveBeenCalled();
});

test('trims the email before signing in', async () => {
  signIn.mockResolvedValue(undefined);
  const { result } = await setup();
  await fillAndSubmit(result, ' Ana@Exemplo.com ', 'segredo123456');
  expect(signIn).toHaveBeenCalledWith('Ana@Exemplo.com', 'segredo123456');
});

test('shows invalid credentials on the password field', async () => {
  signIn.mockRejectedValue(new ApiError('INVALID_CREDENTIALS', 401));
  const { result } = await setup();
  await fillAndSubmit(result, 'ana@exemplo.com', 'errada');
  expect(result.current.errors.password).toBe('E-mail ou senha incorretos.');
  expect(result.current.submitting).toBe(false);
});

test('blocks after too many attempts, rounding the wait up', async () => {
  jest.useFakeTimers();
  signIn.mockRejectedValue(new ApiError('TOO_MANY_ATTEMPTS', 429, { retry_after_seconds: 61 }));
  const { result } = await setup();
  await fillAndSubmit(result, 'ana@exemplo.com', 'errada');

  expect(result.current.errors.password).toBe('Muitas tentativas. Tente de novo em 2 minutos.');
  expect(result.current.blocked).toBe(true);

  await act(() => jest.advanceTimersByTime(61_000));
  expect(result.current.blocked).toBe(false);
});

test('says "1 minuto" for a one-minute wait', async () => {
  signIn.mockRejectedValue(new ApiError('TOO_MANY_ATTEMPTS', 429, { retry_after_seconds: 60 }));
  const { result } = await setup();
  await fillAndSubmit(result, 'ana@exemplo.com', 'errada');
  expect(result.current.errors.password).toBe('Muitas tentativas. Tente de novo em 1 minuto.');
});

test('toasts network errors', async () => {
  signIn.mockRejectedValue(new ApiError('NETWORK', 0));
  const { result } = await setup();
  await fillAndSubmit(result, 'ana@exemplo.com', 'segredo123456');
  expect(toast).toHaveBeenCalledWith({
    message: 'Sem conexão com o servidor. Confira a internet e tente de novo.',
    variant: 'error',
  });
});

test('toasts unexpected errors', async () => {
  signIn.mockRejectedValue(new ApiError('INTERNAL_ERROR', 500));
  const { result } = await setup();
  await fillAndSubmit(result, 'ana@exemplo.com', 'segredo123456');
  expect(toast).toHaveBeenCalledWith({ message: 'Algo deu errado. Tente de novo.', variant: 'error' });
});

test('shows the session notice and prefills the email', async () => {
  const { result } = await setup({ sessionEnded: true, lastEmail: 'ana@exemplo.com' });
  expect(result.current.notice).toBe('Sua sessão terminou. Entre de novo para continuar.');
  expect(result.current.email).toBe('ana@exemplo.com');
});
