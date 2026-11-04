import type { Menu } from '@/api/types';
import { EmptyState } from '@/components/EmptyState';
import { Grid } from '@/components/Grid';
import { ItemCard } from '@/components/ItemCard';
import { Screen } from '@/components/Screen';
import { ComboForm } from '@/features/combos/ComboForm';
import { useCombosScreen } from '@/features/combos/useCombosScreen';
import { WithMenu } from '@/features/shared/WithMenu';

export function CombosScreen() {
  return <WithMenu title="Combos">{(menu) => <CombosView menu={menu} />}</WithMenu>;
}

function CombosView({ menu }: { menu: Menu }) {
  const vm = useCombosScreen(menu);

  return (
    <Screen title="Combos" caption={vm.caption} action={vm.topAction}>
      {vm.content === 'combos' && (
        <Grid data={vm.cards} keyOf={(c) => c.id} render={(card) => <ItemCard {...card} />} />
      )}
      {vm.content === 'firstCombo' && (
        <EmptyState
          step={3}
          icon="lunch_dining"
          title="Por fim, os combos"
          text="Junte itens que já estão no cardápio, como um lanche e uma bebida, com um preço especial."
          actionLabel="Criar primeiro combo"
          onAction={vm.newCombo}
        />
      )}
      {vm.content === 'needsItems' && (
        <EmptyState
          icon="lunch_dining"
          title="Primeiro, cadastre os itens"
          text="Um combo junta itens do cardápio. Cadastre alguns itens e volte aqui para montar os combos."
          actionLabel="Ir para o cardápio"
          actionIcon="restaurant_menu"
          onAction={vm.goToMenu}
        />
      )}
      {vm.panel && <ComboForm combo={vm.panel.combo} onClose={vm.closePanel} />}
    </Screen>
  );
}
