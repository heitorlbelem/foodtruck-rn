import { useState } from 'react';

import type { Combo, Item } from '@/api/types';
import type { EditorPanelState } from '@/features/shared/EditorPanel';
import { useForm } from '@/features/shared/useForm';
import { formatAmount, parsePrice } from '@/lib/money';
import { useLoadedMenu } from '@/model/MenuContext';
import { allItems, categoryName } from '@/model/selectors';
import { useEditor } from '@/model/useEditor';

export type ComboPart = { itemId: string; quantity: number; swapCategoryId: string | null };

/** A combo row ready for the view: the part plus its menu item. */
export type ComboRow = ComboPart & { index: number; item: Item; categoryName: string };

export const MAX_QUANTITY = 99;

export function useComboForm(combo: Combo | undefined, onClose: () => void) {
  const menu = useLoadedMenu();
  const editor = useEditor('combos', onClose);
  const items = new Map(allItems(menu).map((i) => [i.id, i]));

  const form = useForm({
    name: combo?.name ?? '',
    price: combo ? formatAmount(combo.price_cents) : '',
    components: (combo?.components ?? []).map<ComboPart>((c) => ({
      itemId: c.item_id,
      quantity: c.quantity,
      swapCategoryId: c.swap_category_id,
    })),
  });
  const { values } = form;
  const [picking, setPicking] = useState(false);

  // The same sum the API computes in suggested_price_cents, using current prices.
  const suggested = values.components.reduce(
    (sum, c) => sum + c.quantity * (items.get(c.itemId)?.price_cents ?? 0),
    0,
  );

  /** Updates a part; null removes it from the combo. */
  function updatePart(index: number, patch: Partial<ComboPart> | null) {
    form.set(
      'components',
      values.components.flatMap((c, i) => (i !== index ? [c] : patch ? [{ ...c, ...patch }] : [])),
    );
  }

  function save() {
    const name = values.name.trim();
    // When creating, an empty price becomes the items' sum (the API computes it). When editing, it is required.
    const cents = values.price.trim() === '' && !combo ? undefined : parsePrice(values.price);
    const valid = form.validate({
      name: name ? undefined : 'Dê um nome para o combo.',
      price: cents === null ? 'Informe o preço, por exemplo 30,00.' : undefined,
      components: values.components.length ? undefined : 'Adicione pelo menos um item.',
    });
    if (!valid || cents === null) return;
    editor.save(
      {
        name,
        ...(cents !== undefined && { price_cents: cents }),
        components: values.components.map((c) => ({
          item_id: c.itemId,
          quantity: c.quantity,
          ...(c.swapCategoryId && { swap_category_id: c.swapCategoryId }),
        })),
      },
      combo?.id,
      (error) => {
        if (error.code !== 'SUGGESTED_PRICE_TOO_HIGH') return false;
        form.setErrors({ price: 'A soma dos itens passou do limite. Informe o preço do combo.' });
        return true;
      },
    );
  }

  const rows = values.components.flatMap((part, index): ComboRow[] => {
    const item = items.get(part.itemId);
    return item ? [{ ...part, index, item, categoryName: categoryName(menu, item.category_id) }] : [];
  });

  const panel: EditorPanelState = {
    title: combo?.name ?? 'Novo combo',
    saving: editor.saving,
    dialog: editor.dialog,
    onSave: save,
    onClose: () => editor.requestClose(form.dirty),
    onArchive: combo && (() => editor.archive(combo.id, combo.name)),
  };

  return {
    panel,
    isNew: !combo,
    values,
    errors: { ...form.errors, name: form.errors.name ?? editor.nameError },
    setName: (name: string) => {
      form.set('name', name);
      editor.clearNameError();
    },
    setPrice: (price: string) => form.set('price', price),

    rows,
    /** Items not yet in the combo. */
    available: [...items.values()].filter((i) => !values.components.some((c) => c.itemId === i.id)),
    picking,
    startPicking: () => setPicking(true),
    addItem: (itemId: string) => {
      form.set('components', [...values.components, { itemId, quantity: 1, swapCategoryId: null }]);
      setPicking(false);
    },
    toggleSwap: (index: number) => {
      const part = values.components[index];
      const item = items.get(part.itemId);
      updatePart(index, { swapCategoryId: part.swapCategoryId ? null : (item?.category_id ?? null) });
    },
    /** At quantity 1, "minus" removes the item from the combo. */
    decrement: (index: number) => {
      const { quantity } = values.components[index];
      updatePart(index, quantity === 1 ? null : { quantity: quantity - 1 });
    },
    increment: (index: number) => updatePart(index, { quantity: values.components[index].quantity + 1 }),

    suggested,
    applySuggested: () => form.set('price', formatAmount(suggested)),
  };
}
