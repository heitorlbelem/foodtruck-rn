import type { Category } from '@/api/types';
import type { EditorPanelState } from '@/features/shared/EditorPanel';
import { useForm } from '@/features/shared/useForm';
import { useLoadedMenu } from '@/model/MenuContext';
import { useEditor } from '@/model/useEditor';

export function useCategoryForm(category: Category | undefined, onClose: () => void) {
  const menu = useLoadedMenu();
  const editor = useEditor('categories', onClose);
  const form = useForm({ name: category?.name ?? '' });

  function save() {
    const name = form.values.name.trim();
    if (!form.validate({ name: name ? undefined : 'Dê um nome para a categoria.' })) return;
    // A new category goes to the end of the menu.
    editor.save(category ? { name } : { name, sort_order: menu.categories.length }, category?.id);
  }

  const panel: EditorPanelState = {
    title: category?.name ?? 'Nova categoria',
    saving: editor.saving,
    dialog: editor.dialog,
    onSave: save,
    onClose: () => editor.requestClose(form.dirty),
    onArchive: category && (() => editor.archive(category.id, category.name)),
  };

  return {
    panel,
    isNew: !category,
    name: form.values.name,
    nameError: form.errors.name ?? editor.nameError,
    setName: (name: string) => {
      form.set('name', name);
      editor.clearNameError();
    },
    save,
  };
}
