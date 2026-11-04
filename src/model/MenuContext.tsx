import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { api } from '@/api/client';
import type { Menu } from '@/api/types';

type MenuState = {
  menu: Menu | null;
  failed: boolean;
  reload: () => Promise<void>;
};

const MenuContext = createContext<MenuState | null>(null);

/** The whole menu comes from GET /menu and is reloaded after every change. */
export function MenuProvider({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [failed, setFailed] = useState(false);

  const reload = useCallback(
    () =>
      api.menu().then(
        (next) => {
          setMenu(next);
          setFailed(false);
        },
        () => setFailed(true),
      ),
    [],
  );

  useEffect(() => {
    reload();
  }, [reload]);

  const value = useMemo(() => ({ menu, failed, reload }), [menu, failed, reload]);

  return <MenuContext value={value}>{children}</MenuContext>;
}

export function useMenu() {
  const state = useContext(MenuContext);
  if (!state) throw new Error('useMenu requires MenuProvider');
  return state;
}

/** For components rendered only after loading (inside WithMenu). */
export function useLoadedMenu(): Menu {
  const { menu } = useMenu();
  if (!menu) throw new Error('useLoadedMenu can only be used after the menu has loaded');
  return menu;
}
