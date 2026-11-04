import { ScrollView, StyleSheet } from 'react-native';

import type { Menu } from '@/api/types';
import { Chip } from '@/components/Chip';
import { EmptyState } from '@/components/EmptyState';
import { Grid } from '@/components/Grid';
import { ItemCard } from '@/components/ItemCard';
import { Screen } from '@/components/Screen';
import { CategoryForm } from '@/features/menu/CategoryForm';
import { ItemForm } from '@/features/menu/ItemForm';
import { useMenuScreen } from '@/features/menu/useMenuScreen';
import { WithMenu } from '@/features/shared/WithMenu';
import { space } from '@/theme';

export function MenuScreen() {
  return <WithMenu title="Cardápio">{(menu) => <MenuView menu={menu} />}</WithMenu>;
}

function MenuView({ menu }: { menu: Menu }) {
  const vm = useMenuScreen(menu);
  const { selected, panel } = vm;

  return (
    <Screen title="Cardápio" caption={vm.caption} action={vm.topAction}>
      {selected && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chips}>
          {vm.categories.map((c) => (
            <Chip
              key={c.id}
              label={c.name}
              selected={c.id === selected.id}
              onPress={() => vm.selectCategory(c.id)}
              onLongPress={() => vm.editCategory(c)}
            />
          ))}
          <Chip icon="add" label="Categoria" onPress={vm.newCategory} />
        </ScrollView>
      )}

      {vm.content === 'items' && <Grid data={vm.cards} keyOf={(c) => c.id} render={(card) => <ItemCard {...card} />} />}
      {vm.content === 'firstCategory' && (
        <EmptyState
          step={0}
          icon="restaurant_menu"
          title="Vamos montar seu cardápio"
          text="Comece pelas categorias, que organizam o cardápio, como Lanches, Bebidas e Porções. Depois você cadastra os itens de cada uma."
          actionLabel="Criar primeira categoria"
          onAction={vm.newCategory}
        />
      )}
      {vm.content === 'firstItem' && selected && (
        <EmptyState
          step={1}
          icon="restaurant_menu"
          title="Agora, o primeiro item"
          text={`Cadastre algo que você vende em ${selected.name}, como um X-Burguer, com preço e os ingredientes que dá para tirar.`}
          actionLabel="Criar primeiro item"
          onAction={vm.newItem}
        />
      )}
      {vm.content === 'emptyCategory' && selected && (
        <EmptyState
          icon="restaurant_menu"
          title={`${selected.name} ainda não tem itens`}
          text="Cadastre o primeiro item desta categoria. Para renomear ou arquivar a categoria, toque e segure no nome dela."
          actionLabel="Novo item"
          onAction={vm.newItem}
        />
      )}

      {panel?.kind === 'category' && <CategoryForm category={panel.category} onClose={vm.closePanel} />}
      {panel?.kind === 'item' && selected && (
        <ItemForm item={panel.item} categoryId={selected.id} onClose={vm.closePanel} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chipsScroll: { flexGrow: 0, marginHorizontal: -space[5] },
  chips: { gap: space[2], paddingHorizontal: space[5] },
});
