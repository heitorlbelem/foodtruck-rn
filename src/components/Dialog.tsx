import { Modal, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { color, radius, shadow, space } from '@/theme';

export type DialogProps = {
  title: string;
  text: string;
  /** Primary button, on the right, labeled with the action verb. */
  confirmLabel: string;
  onConfirm: () => void;
  cancelLabel: string;
  onCancel: () => void;
};

/** A decision that can't be undone with one tap. Two buttons, never more. */
export function Dialog({ title, text, confirmLabel, onConfirm, cancelLabel, onCancel }: DialogProps) {
  return (
    <Modal transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.scrim}>
        <View style={styles.dialog} accessibilityRole="alert">
          <Text variant="title">{title}</Text>
          <Text muted>{text}</Text>
          <View style={styles.actions}>
            <Button variant="secondary" label={cancelLabel} onPress={onCancel} />
            <Button label={confirmLabel} onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: color.scrim, alignItems: 'center', justifyContent: 'center' },
  dialog: {
    width: 440,
    maxWidth: '90%',
    backgroundColor: color.surface200,
    borderRadius: radius.xl,
    boxShadow: shadow.panel,
    padding: space[5],
    gap: space[3],
  },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: space[3], marginTop: space[3] },
});
