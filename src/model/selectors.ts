// Menu derivations, React-free: used by the ViewModels.
import type { Menu } from '@/api/types';

export const allItems = (menu: Menu) => menu.categories.flatMap((c) => c.items);

export const categoryName = (menu: Menu, id: string) => menu.categories.find((c) => c.id === id)?.name ?? '';

/** How many items accept this addon. */
export const addonUsage = (menu: Menu, addonId: string) =>
  allItems(menu).filter((i) => i.addons.some((a) => a.id === addonId)).length;
