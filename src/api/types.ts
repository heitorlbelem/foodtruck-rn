// API contract shapes (openapi.json, components Category, Item, Addon, Combo and Menu).

export type Category = { id: string; name: string; sort_order: number };

export type Addon = { id: string; name: string; price_cents: number };

export type Item = {
  id: string;
  category_id: string;
  name: string;
  price_cents: number;
  ingredients: string[];
  addons: Addon[];
};

export type ComboComponent = {
  id: string;
  item_id: string;
  quantity: number;
  swap_category_id: string | null;
};

export type Combo = {
  id: string;
  name: string;
  price_cents: number;
  suggested_price_cents: number;
  components: ComboComponent[];
};

export type MenuCategory = Category & { items: Item[] };

export type Menu = {
  categories: MenuCategory[];
  addons: Addon[];
  combos: Combo[];
};

export type CategoryBody = { name: string; sort_order?: number };

export type ItemBody = {
  category_id: string;
  name: string;
  price_cents: number;
  ingredients: string[];
  addon_ids: string[];
};

export type AddonBody = { name: string; price_cents: number };

export type ComboBody = {
  name: string;
  price_cents?: number;
  components: { item_id: string; quantity: number; swap_category_id?: string }[];
};

export type Resource = 'categories' | 'items' | 'addons' | 'combos';

export type NamedRef = { id: string; name: string };

export type ErrorDetails = {
  archived_id?: string;
  items?: NamedRef[];
  combos?: NamedRef[];
  categories?: NamedRef[];
  ids?: string[];
  suggested_price_cents?: number;
  retry_after_seconds?: number;
};

export type AuthUser = { id: string; name: string; email: string; role: string };

export type TokenPair = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  refresh_expires_at: string;
  user: AuthUser;
};
