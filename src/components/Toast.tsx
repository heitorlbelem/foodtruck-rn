import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { color, radius, shadow, size, space, type } from '@/theme';

type Toast = {
  message: string;
  variant?: 'default' | 'success' | 'error';
  /** Only "Desfazer" (undo), after archiving. */
  onUndo?: () => void;
};

const ToastContext = createContext<(toast: Toast) => void>(() => {});

export const useToast = () => useContext(ToastContext);

// Default (with undo): 6 s. Success: 3 s. Error: stays until tapped.
const duration = { default: 6000, success: 3000, error: null };

/** Short notice at the bottom, centered over the content. A new one replaces the previous. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const show = useCallback((next: Toast) => setToast(next), []);

  useEffect(() => {
    const ms = toast && duration[toast.variant ?? 'default'];
    if (!ms) return;
    const timer = setTimeout(() => setToast(null), ms);
    return () => clearTimeout(timer);
  }, [toast]);

  const variant = toast?.variant ?? 'default';

  return (
    <ToastContext value={show}>
      {children}
      {toast && (
        <View style={styles.zone} pointerEvents="box-none">
          <Pressable
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            onPress={() => setToast(null)}
            style={[styles.toast, styles[variant]]}>
            <Text style={[type.bodyStrong, styles.text, { color: textColor[variant] }]}>{toast.message}</Text>
            {toast.onUndo && (
              <Button
                variant="ghost"
                icon="undo"
                label="Desfazer"
                tint={color.accent}
                onPress={() => {
                  setToast(null);
                  toast.onUndo?.();
                }}
              />
            )}
          </Pressable>
        </View>
      )}
    </ToastContext>
  );
}

const textColor = { default: color.surface200, success: color.success, error: color.danger };

const styles = StyleSheet.create({
  zone: { position: 'absolute', left: 0, right: 0, bottom: space[5], alignItems: 'center' },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    minHeight: size.touchMin,
    maxWidth: '80%',
    paddingVertical: space[2],
    paddingLeft: space[5],
    paddingRight: space[2],
    borderRadius: radius.pill,
    boxShadow: shadow.panel,
  },
  default: { backgroundColor: color.ink },
  success: { backgroundColor: color.successSoft, paddingRight: space[5] },
  error: {
    backgroundColor: color.dangerSoft,
    borderRadius: radius.lg,
    paddingVertical: space[3],
    paddingHorizontal: space[5],
  },
  text: { flexShrink: 1 },
});
