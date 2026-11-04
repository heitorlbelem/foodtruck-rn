import type { Addon } from '@/api/types';
import type { EditorPanelState } from '@/features/shared/EditorPanel';
import { useForm } from '@/features/shared/useForm';
import { formatAmount, parsePrice } from '@/lib/money';
import { useEditor } from '@/model/useEditor';

export function useAddonForm(addon: Addon | undefined, onClose: () => void) {
  const editor = useEditor('addons', onClose);
  const form = useForm({
    name: addon?.name ?? '',
    price: addon ? formatAmount(addon.price_cents) : '',
  });

  function save() {
    const name = form.values.name.trim();
    const cents = parsePrice(form.values.price);
    const valid = form.validate({
      name: name ? undefined : 'Dê um nome para o adicional.',
      price: cents === null ? 'Informe o preço, por exemplo 5,00.' : undefined,
    });
    if (!valid || cents === null) return;
    editor.save({ name, price_cents: cents }, addon?.id);
  }

  const panel: EditorPanelState = {
    title: addon?.name ?? 'Novo adicional',
    saving: editor.saving,
    dialog: editor.dialog,
    onSave: save,
    onClose: () => editor.requestClose(form.dirty),
    onArchive: addon && (() => editor.archive(addon.id, addon.name)),
  };

  return {
    panel,
    isNew: !addon,
    values: form.values,
    errors: { name: form.errors.name ?? editor.nameError, price: form.errors.price },
    setName: (name: string) => {
      form.set('name', name);
      editor.clearNameError();
    },
    setPrice: (price: string) => form.set('price', price),
  };
}
