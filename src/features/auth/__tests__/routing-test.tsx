import { fireEvent, renderRouter, screen } from 'expo-router/testing-library';
import type { ReactNode } from 'react';

import { useAuth } from '@/model/AuthContext';

jest.mock('@/model/AuthContext', () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => children,
  useAuth: jest.fn(),
}));
jest.mock('@/api/client', () => ({
  api: { menu: jest.fn(async () => ({ categories: [], addons: [], combos: [] })) },
}));

const ana = { id: 'u1', name: 'Ana', email: 'ana@exemplo.com', role: 'owner' };
const signOut = jest.fn();

function signedAs(status: 'signedOut' | 'signedIn') {
  (useAuth as jest.Mock).mockReturnValue({
    status,
    user: status === 'signedIn' ? ana : null,
    sessionEnded: false,
    lastEmail: '',
    signIn: jest.fn(),
    signOut,
  });
}

beforeEach(() => jest.clearAllMocks());

test('shows the login when signed out', async () => {
  signedAs('signedOut');
  await renderRouter('src/app', { initialUrl: '/' });
  expect(screen.getByRole('button', { name: 'Entrar' })).toBeTruthy();
  expect(screen).toHavePathname('/login');
});

test('shows the menu when signed in', async () => {
  signedAs('signedIn');
  await renderRouter('src/app', { initialUrl: '/' });
  expect(await screen.findAllByText('Cardápio')).not.toHaveLength(0);
  expect(screen).toHavePathname('/');
});

test('asks before signing out', async () => {
  signedAs('signedIn');
  await renderRouter('src/app', { initialUrl: '/' });

  await fireEvent.press(screen.getByRole('button', { name: 'Sair' }));
  expect(screen.getByText('Sair da conta?')).toBeTruthy();
  expect(
    screen.getByText('Você entrou como Ana (ana@exemplo.com). Para voltar, vai precisar do e-mail e da senha.'),
  ).toBeTruthy();

  await fireEvent.press(screen.getByRole('button', { name: 'Continuar aqui' }));
  expect(screen.queryByText('Sair da conta?')).toBeNull();
  expect(signOut).not.toHaveBeenCalled();

  await fireEvent.press(screen.getByRole('button', { name: 'Sair' }));
  await fireEvent.press(screen.getByRole('button', { name: 'Sair da conta' }));
  expect(signOut).toHaveBeenCalledTimes(1);
});
