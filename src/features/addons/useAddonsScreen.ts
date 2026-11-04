import { useState } from 'react';

import type { Addon, Menu } from '@/api/types';
import type { ItemCardProps } from '@/components/ItemCard';
import { plural } from '@/lib/plural';
import { addonUsage } from '@/model/selectors';

type Panel = { addon?: Addon } | null;

export function useAddonsScreen(menu: Menu) {
  const [panel, setPanel] = useState<Panel>(null);
  const hasAddons = menu.addons.length > 0;
  const newAddon = () => setPanel({});

  const cards = menu.addons.map((addon): ItemCardProps & { id: string } => {
    const count = addonUsage(menu, addon.id);
    return {
      id: addon.id,
      name: addon.name,
      priceCents: addon.price_cents,
      meta: count ? `aceito em ${plural(count, 'item', 'itens')}` : 'ainda não ligado a nenhum item',
      selected: panel?.addon?.id === addon.id,
      onPress: () => setPanel({ addon }),
    };
  });

  return {
    hasAddons,
    cards,
    panel,
    caption: hasAddons ? plural(menu.addons.length, 'adicional', 'adicionais') : 'Ainda vazio',
    topAction: hasAddons ? { label: 'Novo adicional', onPress: newAddon } : undefined,
    newAddon,
    closePanel: () => setPanel(null),
  };
}
