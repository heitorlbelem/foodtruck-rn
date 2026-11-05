import { Image, ImageBackground, KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { TextField } from '@/components/TextField';
import { useLoginScreen } from '@/features/auth/useLoginScreen';
import { color, radius, shadow, size, space } from '@/theme';

const background = require('@/assets/images/login.jpg');
const logo = require('@/assets/images/logo.png');

export function LoginScreen() {
  const vm = useLoginScreen();

  return (
    <ImageBackground testID="login-background" source={background} resizeMode="cover" style={styles.root}>
      {/* The card rises when the keyboard opens, so "Entrar" stays visible. */}
      <KeyboardAvoidingView testID="login-content" behavior="padding" style={styles.fill}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <Image source={logo} style={styles.logo} accessibilityIgnoresInvertColors />
            <Text variant="title">Ember</Text>
          </View>

          <View style={styles.card}>
            <Text variant="title">Entrar</Text>

            {vm.notice && (
              <View style={styles.notice}>
                <Icon name="schedule" color={color.primary} size={20} />
                <Text variant="label" style={styles.noticeText}>
                  {vm.notice}
                </Text>
              </View>
            )}

            <TextField
              label="E-mail"
              value={vm.email}
              onChangeText={vm.setEmail}
              error={vm.errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              returnKeyType="next"
            />
            <TextField
              label="Senha"
              password
              value={vm.password}
              onChangeText={vm.setPassword}
              error={vm.errors.password}
              returnKeyType="go"
              onSubmitEditing={vm.submit}
            />

            <Button
              label={vm.submitting ? 'Entrando…' : 'Entrar'}
              onPress={vm.submit}
              disabled={vm.submitting || vm.blocked}
            />
            <Text variant="caption" muted style={styles.help}>
              Esqueceu a senha? Fale com quem criou a sua conta.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // Cream only behind the illustration, while it loads; nothing on top may be opaque.
  root: { flex: 1, backgroundColor: color.surface100 },
  fill: { flex: 1 },
  content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: space[5], gap: space[5] },
  brand: { alignItems: 'center', gap: space[3] },
  logo: { width: 96, height: 96, borderRadius: radius.lg },
  card: {
    width: size.panelWidth,
    maxWidth: '100%',
    backgroundColor: color.surface200,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.xl,
    boxShadow: shadow.panel,
    padding: space[5],
    gap: space[4],
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[2],
    paddingVertical: space[3],
    paddingHorizontal: space[4],
    borderRadius: radius.md,
    backgroundColor: color.primarySoft,
  },
  noticeText: { flex: 1, color: color.primary },
  help: { textAlign: 'center' },
});
