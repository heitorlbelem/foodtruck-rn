import type { Menu } from '@/api/types';
import { EmptyState } from '@/components/EmptyState';
import { Grid } from '@/components/Grid';
import { ItemCard } from '@/components/ItemCard';
import { Screen } from '@/components/Screen';
import { AddonForm } from '@/features/addons/AddonForm';
import { useAddonsScreen } from '@/features/addons/useAddonsScreen';
import { WithMenu } from '@/features/shared/WithMenu';

export function AddonsScreen() {
  return <WithMenu title="Adicionais">{(menu) => <AddonsView menu={menu} />}</WithMenu>;
}

function AddonsView({ menu }: { menu: Menu }) {
  const vm = useAddonsScreen(menu);

  return (
    <Screen title="Adicionais" caption={vm.caption} action={vm.topAction}>
      {vm.hasAddons ? (
        <Grid data={vm.cards} keyOf={(c) => c.id} render={(card) => <ItemCard {...card} />} />
      ) : (
        <EmptyState
          step={2}
          icon="add_circle"
          title="Agora, os adicionais"
          text="Extras com preço próprio, como Bacon ou Ovo. Depois de cadastrar, ligue cada um aos itens que o aceitam, no painel do item."
          actionLabel="Criar primeiro adicional"
          onAction={vm.newAddon}
        />
      )}
      {vm.panel && <AddonForm addon={vm.panel.addon} onClose={vm.closePanel} />}
    </Screen>
  );
}
