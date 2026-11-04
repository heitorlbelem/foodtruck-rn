import type { Item } from '@/api/types';
import { Chip } from '@/components/Chip';
import { Text } from '@/components/Text';
import { TextField } from '@/components/TextField';
import { useItemForm } from '@/features/menu/useItemForm';
import { EditorPanel } from '@/features/shared/EditorPanel';
import { ChipRow, FieldGroup } from '@/features/shared/FieldGroup';
import { formatPrice } from '@/lib/money';

type Props = { item?: Item; categoryId: string; onClose: () => void };

export function ItemForm({ item, categoryId, onClose }: Props) {
  const vm = useItemForm(item, categoryId, onClose);
  const { values, errors } = vm;

  return (
    <EditorPanel {...vm.panel} saveLabel="Salvar item">
      <TextField
        label="Nome"
        hint={vm.isNew ? 'Por exemplo: X-Burguer.' : undefined}
        value={values.name}
        onChangeText={vm.setName}
        error={errors.name}
        autoFocus={vm.isNew}
      />

      <FieldGroup label="Categoria">
        <ChipRow>
          {vm.categories.map((c) => (
            <Chip
              key={c.id}
              label={c.name}
              selected={c.id === values.categoryId}
              onPress={() => vm.setCategory(c.id)}
            />
          ))}
        </ChipRow>
      </FieldGroup>

      <TextField
        label="Preço"
        price
        value={values.price}
        onChangeText={vm.setPrice}
        error={errors.price}
        placeholder="0,00"
      />

      <FieldGroup label="Ingredientes que dá para tirar">
        <ChipRow>
          {values.ingredients.map((ingredient) => (
            <Chip key={ingredient} label={ingredient} onRemove={() => vm.removeIngredient(ingredient)} />
          ))}
          {vm.newIngredient === null && <Chip icon="add" label="Ingrediente" onPress={vm.openIngredient} />}
        </ChipRow>
        {vm.newIngredient !== null && (
          <TextField
            label="Novo ingrediente"
            hint="Escreva e toque em concluir no teclado."
            value={vm.newIngredient}
            onChangeText={vm.setNewIngredient}
            autoFocus
            returnKeyType="done"
            submitBehavior="submit"
            onSubmitEditing={vm.addIngredient}
            onBlur={vm.closeIngredient}
          />
        )}
      </FieldGroup>

      <FieldGroup label="Adicionais aceitos">
        {vm.addons.length > 0 ? (
          <>
            <ChipRow>
              {vm.addons.map((a) => {
                const on = vm.hasAddon(a.id);
                return (
                  <Chip
                    key={a.id}
                    icon={on ? 'check' : undefined}
                    label={`${a.name} · ${formatPrice(a.price_cents)}`}
                    selected={on}
                    onPress={() => vm.toggleAddon(a.id)}
                  />
                );
              })}
            </ChipRow>
            <Text variant="caption" muted>
              Toque para ligar ou desligar.
            </Text>
          </>
        ) : (
          <Text variant="caption" muted>
            Ainda não há adicionais. Cadastre na aba Adicionais e volte aqui para ligá-los.
          </Text>
        )}
      </FieldGroup>
    </EditorPanel>
  );
}
