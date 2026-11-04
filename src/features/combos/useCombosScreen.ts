import { router } from 'expo-router';
import { useState } from 'react';

import type { Combo, Menu } from '@/api/types';
import type { ItemCardProps } from '@/components/ItemCard';
import { formatPrice } from '@/lib/money';
import { plural } from '@/lib/plural';
import { categoryName } from '@/model/selectors';

type Panel = { combo?: Combo } | null;

/**
 * - firstCombo: onboarding, step 4;
 * - needsItems: a combo requires items, so we don't offer a step the API doesn't allow yet.
 */
type Content = 'combos' | 'firstCombo' | 'needsItems';

export function useCombosScreen(menu: Menu) {
  const [panel, setPanel] = useState<Panel>(null);
  const hasCombos = menu.combos.length > 0;
  const hasItems = menu.categories.some((c) => c.items.length > 0);
  const content: Content = hasCombos ? 'combos' : hasItems ? 'firstCombo' : 'needsItems';
  const newCombo = () => setPanel({});

  /** "3 itens · troca bebidas" */
  function summary(combo: Combo) {
    const count = combo.components.reduce((n, c) => n + c.quantity, 0);
    const swaps = combo.components.flatMap((c) =>
      c.swap_category_id ? [`troca ${categoryName(menu, c.swap_category_id).toLowerCase()}`] : [],
    );
    return [plural(count, 'item', 'itens'), ...swaps].join(' · ');
  }

  const cards = menu.combos.map(
    (combo): ItemCardProps & { id: string } => ({
      id: combo.id,
      name: combo.name,
      priceCents: combo.price_cents,
      meta: `sugerido ${formatPrice(combo.suggested_price_cents)}`,
      summary: summary(combo),
      selected: panel?.combo?.id === combo.id,
      onPress: () => setPanel({ combo }),
    }),
  );

  return {
    content,
    cards,
    panel,
    caption: hasCombos ? plural(menu.combos.length, 'combo', 'combos') : 'Ainda vazio',
    topAction: hasCombos ? { label: 'Novo combo', onPress: newCombo } : undefined,
    newCombo,
    goToMenu: () => router.navigate('/'),
    closePanel: () => setPanel(null),
  };
}
