import type { Category } from '@/api/types';
import { TextField } from '@/components/TextField';
import { useCategoryForm } from '@/features/menu/useCategoryForm';
import { EditorPanel } from '@/features/shared/EditorPanel';

type Props = { category?: Category; onClose: () => void };

export function CategoryForm({ category, onClose }: Props) {
  const vm = useCategoryForm(category, onClose);
  return (
    <EditorPanel {...vm.panel} saveLabel="Salvar categoria">
      <TextField
        label="Nome"
        hint="Por exemplo: Lanches, Bebidas, Porções."
        value={vm.name}
        onChangeText={vm.setName}
        error={vm.nameError}
        autoFocus={vm.isNew}
        returnKeyType="done"
        onSubmitEditing={vm.save}
      />
    </EditorPanel>
  );
}
