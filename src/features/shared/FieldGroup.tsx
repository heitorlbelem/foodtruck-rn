import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';
import { color, space } from '@/theme';

type Props = { label: string; error?: string; children: ReactNode };

/** A form group that is not a TextField: label, content and error. */
export function FieldGroup({ label, error, children }: Props) {
  return (
    <View style={styles.group}>
      <Text variant="label">{label}</Text>
      {children}
      {error && (
        <Text variant="caption" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

/** Chips side by side, wrapping lines. */
export function ChipRow({ children }: { children: ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  group: { gap: space[2] },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  error: { color: color.danger },
});
