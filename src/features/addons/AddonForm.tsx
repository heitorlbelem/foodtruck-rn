import type { Addon } from '@/api/types';
import { TextField } from '@/components/TextField';
import { useAddonForm } from '@/features/addons/useAddonForm';
import { EditorPanel } from '@/features/shared/EditorPanel';

type Props = { addon?: Addon; onClose: () => void };

export function AddonForm({ addon, onClose }: Props) {
  const vm = useAddonForm(addon, onClose);
  return (
    <EditorPanel {...vm.panel} saveLabel="Salvar adicional">
      <TextField
        label="Nome"
        hint="Por exemplo: Bacon, Ovo, Cheddar."
        value={vm.values.name}
        onChangeText={vm.setName}
        error={vm.errors.name}
        autoFocus={vm.isNew}
      />
      <TextField
        label="Preço"
        price
        value={vm.values.price}
        onChangeText={vm.setPrice}
        error={vm.errors.price}
        placeholder="0,00"
      />
    </EditorPanel>
  );
}
