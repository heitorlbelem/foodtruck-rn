import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import type { Menu } from '@/api/types';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { useMenu } from '@/model/MenuContext';
import { color } from '@/theme';

/** Renders the content only once the menu has loaded; before that, a spinner or an error. */
export function WithMenu({ title, children }: { title: string; children: (menu: Menu) => ReactNode }) {
  const { menu, failed, reload } = useMenu();
  if (menu) return children(menu);
  return (
    <Screen title={title}>
      {failed ? (
        <EmptyState
          icon="restaurant_menu"
          title="Não deu para abrir o cardápio"
          text="Confira a internet e tente de novo."
          actionLabel="Tentar de novo"
          actionIcon={null}
          onAction={reload}
        />
      ) : (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={color.primary} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
