import { useEffect, useState, type ReactNode } from 'react';
import {
  Animated,
  BackHandler,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { color, radius, shadow, size, space } from '@/theme';

type Props = {
  title: string;
  /** Tapping the scrim or the "×" calls onClose; the caller decides whether to confirm first. */
  onClose: () => void;
  footer: ReactNode;
  children: ReactNode;
};

/** Create/edit panel that slides in from the right over the scrim. */
export function SidePanel({ title, onClose, footer, children }: Props) {
  const { width, height } = useWindowDimensions();
  const portrait = height > width;
  const [offset] = useState(() => new Animated.Value(size.panelWidth));

  useEffect(() => {
    // JS driver on purpose: with the native driver, React still holds the initial translateX,
    // and the next layout change (e.g. the keyboard opening on iOS) pushes the panel back off-screen.
    Animated.timing(offset, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  }, [offset]);

  // Android Back closes the panel, not the app.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [onClose]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable
        style={[StyleSheet.absoluteFill, { backgroundColor: color.scrim }]}
        accessibilityLabel="Fechar painel"
        onPress={onClose}
      />
      <KeyboardAvoidingView
        behavior="padding"
        style={[styles.panel, portrait ? styles.full : { width: size.panelWidth }]}>
        <Animated.View style={[styles.inner, { transform: [{ translateX: offset }] }]}>
          <View style={styles.header}>
            <Text variant="title" numberOfLines={1} style={styles.title}>
              {title}
            </Text>
            <Button variant="ghost" icon="close" accessibilityLabel="Fechar" onPress={onClose} />
          </View>
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
          <View style={styles.footer}>{footer}</View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { position: 'absolute', top: 0, right: 0, bottom: 0 },
  full: { left: 0 },
  inner: {
    flex: 1,
    backgroundColor: color.surface200,
    borderTopLeftRadius: radius.xl,
    borderBottomLeftRadius: radius.xl,
    boxShadow: shadow.panel,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: space[5],
    paddingHorizontal: space[5],
    paddingBottom: space[3],
  },
  title: { flex: 1 },
  body: { paddingHorizontal: space[5], paddingBottom: space[5], gap: space[5] },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    padding: space[5],
    borderTopWidth: 1,
    borderTopColor: color.line,
  },
});
