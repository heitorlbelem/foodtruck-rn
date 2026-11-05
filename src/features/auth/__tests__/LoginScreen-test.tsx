import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { LoginScreen } from '@/features/auth/LoginScreen';

jest.mock('@/features/auth/useLoginScreen', () => ({
  useLoginScreen: () => ({
    email: '',
    password: '',
    setEmail: jest.fn(),
    setPassword: jest.fn(),
    errors: {},
    submitting: false,
    blocked: false,
    notice: undefined,
    submit: jest.fn(),
  }),
}));

test('nothing opaque covers the background illustration', async () => {
  await render(<LoginScreen />);
  expect(screen.getByTestId('login-background')).toBeTruthy();
  const overlay = StyleSheet.flatten(screen.getByTestId('login-content').props.style);
  expect(overlay?.backgroundColor).toBeUndefined();
});
