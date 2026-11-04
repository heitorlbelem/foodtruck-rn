import { useState } from 'react';

import { ApiError, api } from '@/api/client';
import type { Resource } from '@/api/types';
import type { DialogProps } from '@/components/Dialog';
import { useToast } from '@/components/Toast';
import { useMenu } from '@/model/MenuContext';
import { errorMessage, texts } from '@/model/texts';

const asApiError = (e: unknown) => (e instanceof ApiError ? e : new ApiError('INTERNAL_ERROR', 0));

/**
 * Save, archive and restore a record inside the side panel, with the design
 * system behaviors: success toast, undo after archiving, name error on the
 * field and a dialog to restore an archived name.
 */
export function useEditor(resource: Resource, onClose: () => void) {
  const { reload } = useMenu();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState<string>();
  const [dialog, setDialog] = useState<DialogProps | null>(null);
  const t = texts[resource];

  async function restore(id: string, name: string) {
    try {
      await api.restore(resource, id);
      await reload();
      toast({ message: t.restored(name), variant: 'success' });
    } catch (e) {
      toast({ message: errorMessage(asApiError(e)), variant: 'error' });
      await reload();
    }
  }

  async function handleGoneOrFail(error: ApiError) {
    if (error.code.endsWith('_NOT_FOUND')) {
      toast({ message: t.notFound, variant: 'error' });
      onClose();
    } else {
      toast({ message: errorMessage(error), variant: 'error' });
    }
    await reload();
  }

  /**
   * Creates (without `id`) or updates the record. `onError` handles
   * form-specific codes and returns true when it handled one.
   */
  async function save<B extends { name: string }>(body: B, id?: string, onError?: (e: ApiError) => boolean) {
    setSaving(true);
    setNameError(undefined);
    try {
      await (id ? api.update(resource, id, body) : api.create(resource, body));
      await reload();
      onClose();
      toast({ message: t.saved, variant: 'success' });
    } catch (e) {
      const error = asApiError(e);
      if (error.code === 'NAME_TAKEN') {
        setNameError(t.nameTaken(body.name));
      } else if (error.code === 'NAME_TAKEN_ARCHIVED' && error.details.archived_id) {
        const archivedId = error.details.archived_id;
        setDialog({
          title: t.nameTakenArchived(body.name),
          text: 'Restaure para voltar ao cardápio como era antes, ou escolha outro nome.',
          confirmLabel: 'Restaurar',
          onConfirm: () => {
            setDialog(null);
            onClose();
            restore(archivedId, body.name);
          },
          cancelLabel: 'Escolher outro nome',
          onCancel: () => setDialog(null),
        });
      } else if (!onError?.(error)) {
        await handleGoneOrFail(error);
      }
    } finally {
      setSaving(false);
    }
  }

  async function archive(id: string, name: string) {
    setSaving(true);
    try {
      await api.archive(resource, id);
      await reload();
      onClose();
      toast({ message: t.archived(name), onUndo: () => restore(id, name) });
    } catch (e) {
      await handleGoneOrFail(asApiError(e));
    } finally {
      setSaving(false);
    }
  }

  /** Closes the panel, asking first if there are unsaved changes. */
  function requestClose(dirty: boolean) {
    if (!dirty) return onClose();
    setDialog({
      title: 'Descartar mudanças?',
      text: 'O que você mudou neste painel não será salvo.',
      confirmLabel: 'Descartar',
      onConfirm: () => {
        setDialog(null);
        onClose();
      },
      cancelLabel: 'Continuar editando',
      onCancel: () => setDialog(null),
    });
  }

  return {
    saving,
    nameError,
    clearNameError: () => setNameError(undefined),
    save,
    archive,
    requestClose,
    /** Currently open dialog; EditorPanel renders it. */
    dialog,
  };
}
