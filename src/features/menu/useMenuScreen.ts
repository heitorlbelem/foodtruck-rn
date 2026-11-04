import { useState } from 'react';

import type { Category, Item, Menu } from '@/api/types';
import type { ItemCardProps } from '@/components/ItemCard';
import { allItems } from '@/model/selectors';
import { plural } from '@/lib/plural';

type Panel = { kind: 'category'; category?: Category } | { kind: 'item'; item?: Item } | null;

/**
 * What the screen shows in place of the grid:
 * - firstCategory: onboarding, step 1 (items can't be created without a category);
 * - firstItem: onboarding, step 2;
 * - emptyCategory: the selected category has no items yet.
 */
type Content = 'firstCategory' | 'firstItem' | 'emptyCategory' | 'items';

export function useMenuScreen(menu: Menu) {
  const [selectedId, setSelectedId] = useState<string>();
  const [panel, setPanel] = useState<Panel>(null);

  const { categories } = menu;
  const selected = categories.find((c) => c.id === selectedId) ?? categories[0];
  const itemCount = allItems(menu).length;

  const content: Content = !selected
    ? 'firstCategory'
    : selected.items.length > 0
      ? 'items'
      : itemCount === 0
        ? 'firstItem'
        : 'emptyCategory';

  const newItem = () => setPanel({ kind: 'item' });

  const cards = (selected?.items ?? []).map(
    (item): ItemCardProps & { id: string } => ({
      id: item.id,
      name: item.name,
      priceCents: item.price_cents,
      meta: item.ingredients.join(', '),
      summary: item.addons.length ? `+ ${item.addons.map((a) => a.name).join(', ')}` : undefined,
      selected: panel?.kind === 'item' && panel.item?.id === item.id,
      onPress: () => setPanel({ kind: 'item', item }),
    }),
  );

  return {
    content,
    categories,
    selected,
    cards,
    panel,
    caption: selected
      ? [
          plural(categories.length, 'categoria', 'categorias'),
          plural(itemCount, 'item', 'itens'),
          plural(menu.combos.length, 'combo', 'combos'),
        ].join(' · ')
      : 'Ainda vazio',
    selectCategory: setSelectedId,
    newCategory: () => setPanel({ kind: 'category' }),
    // Long-pressing a category opens the panel to rename or archive it.
    editCategory: (category: Category) => setPanel({ kind: 'category', category }),
    newItem,
    /** "Novo item" at the top only once the grid has items; before that, the EmptyState offers it. */
    topAction: content === 'items' ? { label: 'Novo item', onPress: newItem } : undefined,
    closePanel: () => setPanel(null),
  };
}
