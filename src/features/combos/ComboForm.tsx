import { StyleSheet, View } from 'react-native';

import type { Combo } from '@/api/types';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Text } from '@/components/Text';
import { TextField } from '@/components/TextField';
import { ComboRowView } from '@/features/combos/ComboRowView';
import { useComboForm } from '@/features/combos/useComboForm';
import { EditorPanel } from '@/features/shared/EditorPanel';
import { ChipRow, FieldGroup } from '@/features/shared/FieldGroup';
import { formatAmount, formatPrice } from '@/lib/money';
import { space } from '@/theme';

type Props = { combo?: Combo; onClose: () => void };

export function ComboForm({ combo, onClose }: Props) {
  const vm = useComboForm(combo, onClose);
  const { values, errors } = vm;

  return (
    <EditorPanel {...vm.panel} saveLabel="Salvar combo">
      <TextField
        label="Nome"
        hint={vm.isNew ? 'Por exemplo: Combo X-Burguer.' : undefined}
        value={values.name}
        onChangeText={vm.setName}
        error={errors.name}
        autoFocus={vm.isNew}
      />

      <FieldGroup label="Itens do combo" error={errors.components}>
        {vm.rows.map((row) => (
          <ComboRowView
            key={row.itemId}
            row={row}
            onToggleSwap={() => vm.toggleSwap(row.index)}
            onDecrement={() => vm.decrement(row.index)}
            onIncrement={() => vm.increment(row.index)}
          />
        ))}
        {vm.picking ? (
          <>
            <Text variant="caption" muted>
              Toque no item para colocar no combo.
            </Text>
            <ChipRow>
              {vm.available.map((i) => (
                <Chip key={i.id} label={i.name} onPress={() => vm.addItem(i.id)} />
              ))}
            </ChipRow>
          </>
        ) : (
          vm.available.length > 0 && (
            <ChipRow>
              <Chip icon="add" label="Adicionar item" onPress={vm.startPicking} />
            </ChipRow>
          )
        )}
      </FieldGroup>

      <View style={styles.group}>
        <TextField
          label="Preço do combo"
          price
          value={values.price}
          onChangeText={vm.setPrice}
          error={errors.price}
          placeholder={vm.isNew ? formatAmount(vm.suggested) : '0,00'}
        />
        <View style={styles.suggest}>
          <Text variant="caption" muted style={styles.suggestText}>
            Sugerido: <Text variant="caption" style={styles.strong}>{formatPrice(vm.suggested)}</Text>, a soma dos
            itens.{vm.isNew ? ' Deixe vazio para usar a soma.' : ''}
          </Text>
          <Button variant="ghost" label="Usar sugerido" onPress={vm.applySuggested} />
        </View>
      </View>
    </EditorPanel>
  );
}

const styles = StyleSheet.create({
  group: { gap: space[2] },
  suggest: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space[3] },
  suggestText: { flex: 1 },
  strong: { fontWeight: '800' },
});
