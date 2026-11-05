import { fireEvent, render, screen } from '@testing-library/react-native';

import { TextField } from '@/components/TextField';

test('password field hides the text until "Mostrar senha" is pressed', async () => {
  await render(<TextField label="Senha" password value="segredo" onChangeText={() => {}} />);
  expect(screen.getByLabelText('Senha').props.secureTextEntry).toBe(true);

  await fireEvent.press(screen.getByLabelText('Mostrar senha'));

  expect(screen.getByLabelText('Senha').props.secureTextEntry).toBe(false);
  expect(screen.getByLabelText('Ocultar senha')).toBeTruthy();
});
