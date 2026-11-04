import { useState } from 'react';

import type { Item } from '@/api/types';
import type { EditorPanelState } from '@/features/shared/EditorPanel';
import { useForm } from '@/features/shared/useForm';
import { formatAmount, parsePrice } from '@/lib/money';
import { useLoadedMenu } from '@/model/MenuContext';
import { useEditor } from '@/model/useEditor';

const withIngredient = (list: string[], text: string | undefined) =>
  text && !list.includes(text) ? [...list, text] : list;

export function useItemForm(item: Item | undefined, categoryId: string, onClose: () => void) {
  const menu = useLoadedMenu();
  const editor = useEditor('items', onClose);
  const form = useForm({
    name: item?.name ?? '',
    categoryId: item?.category_id ?? categoryId,
    price: item ? formatAmount(item.price_cents) : '',
    ingredients: item?.ingredients ?? [],
    addonIds: item?.addons.map((a) => a.id) ?? [],
  });
  const { values } = form;
  /** Text of the ingredient being typed; null when the field is closed. */
  const [newIngredient, setNewIngredient] = useState<string | null>(null);

  function addIngredient() {
    form.set('ingredients', withIngredient(values.ingredients, newIngredient?.trim()));
    setNewIngredient('');
  }

  function save() {
    const name = values.name.trim();
    const cents = parsePrice(values.price);
    const valid = form.validate({
      name: name ? undefined : 'Dê um nome para o item.',
      price: cents === null ? 'Informe o preço, por exemplo 25,00.' : undefined,
    });
    if (!valid || cents === null) return;
    editor.save(
      {
        name,
        category_id: values.categoryId,
        price_cents: cents,
        // An ingredient typed but not yet confirmed is included too.
        ingredients: withIngredient(values.ingredients, newIngredient?.trim()),
        addon_ids: values.addonIds,
      },
      item?.id,
    );
  }

  const panel: EditorPanelState = {
    title: item?.name ?? 'Novo item',
    saving: editor.saving,
    dialog: editor.dialog,
    onSave: save,
    onClose: () => editor.requestClose(form.dirty),
    onArchive: item && (() => editor.archive(item.id, item.name)),
  };

  return {
    panel,
    isNew: !item,
    values,
    errors: { name: form.errors.name ?? editor.nameError, price: form.errors.price },
    categories: menu.categories,
    addons: menu.addons,

    setName: (name: string) => {
      form.set('name', name);
      editor.clearNameError();
    },
    setCategory: (id: string) => form.set('categoryId', id),
    setPrice: (price: string) => form.set('price', price),

    newIngredient,
    setNewIngredient,
    openIngredient: () => setNewIngredient(''),
    addIngredient,
    /** On blur, whatever was typed is added and the field closes. */
    closeIngredient: () => {
      addIngredient();
      setNewIngredient(null);
    },
    removeIngredient: (ingredient: string) =>
      form.set(
        'ingredients',
        values.ingredients.filter((i) => i !== ingredient),
      ),

    hasAddon: (id: string) => values.addonIds.includes(id),
    toggleAddon: (id: string) =>
      form.set(
        'addonIds',
        values.addonIds.includes(id) ? values.addonIds.filter((a) => a !== id) : [...values.addonIds, id],
      ),
  };
}
