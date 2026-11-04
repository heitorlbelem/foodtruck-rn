import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Dialog, type DialogProps } from '@/components/Dialog';
import { SidePanel } from '@/components/SidePanel';

/** What each form's ViewModel hands to the panel. */
export type EditorPanelState = {
  title: string;
  saving: boolean;
  dialog: DialogProps | null;
  onSave: () => void;
  /** Closes, asking first if there are changes. */
  onClose: () => void;
  /** Only when editing. When creating, the footer shows "Cancelar". */
  onArchive?: () => void;
};

type Props = EditorPanelState & { saveLabel: string; children: ReactNode };

/** Side panel to create/edit a menu record, with footer and dialog. */
export function EditorPanel({ title, saving, dialog, onSave, onClose, onArchive, saveLabel, children }: Props) {
  return (
    <SidePanel
      title={title}
      onClose={onClose}
      footer={
        <>
          {onArchive && <Button variant="danger" icon="archive" label="Arquivar" onPress={onArchive} disabled={saving} />}
          <View style={styles.spacer} />
          {!onArchive && <Button variant="secondary" label="Cancelar" onPress={onClose} disabled={saving} />}
          <Button label={saving ? 'Salvando…' : saveLabel} onPress={onSave} disabled={saving} />
        </>
      }>
      {children}
      {dialog && <Dialog {...dialog} />}
    </SidePanel>
  );
}

const styles = StyleSheet.create({
  spacer: { flex: 1 },
});
