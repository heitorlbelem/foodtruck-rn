import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Text } from '@/components/Text';
import { MAX_QUANTITY, type ComboRow } from '@/features/combos/useComboForm';
import { formatPrice } from '@/lib/money';
import { color, radius, space } from '@/theme';

type Props = {
  row: ComboRow;
  onToggleSwap: () => void;
  onDecrement: () => void;
  onIncrement: () => void;
};

/** One combo item: name, price, "swap for" and quantity. */
export function ComboRowView({ row, onToggleSwap, onDecrement, onIncrement }: Props) {
  const { item, quantity, swapCategoryId } = row;
  const last = quantity === 1;
  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text variant="heading">{item.name}</Text>
        <Text variant="caption" muted>
          {formatPrice(item.price_cents)} cada
        </Text>
        <View style={styles.swap}>
          <Chip
            icon={swapCategoryId ? 'check' : undefined}
            label={`Troca por ${row.categoryName}`}
            selected={!!swapCategoryId}
            onPress={onToggleSwap}
          />
        </View>
      </View>
      <View style={styles.stepper}>
        <Button
          variant="secondary"
          icon={last ? 'close' : 'remove'}
          accessibilityLabel={last ? `Tirar ${item.name} do combo` : 'Menos'}
          onPress={onDecrement}
        />
        <Text variant="heading" style={styles.quantity}>
          {quantity}
        </Text>
        <Button
          variant="secondary"
          icon="add"
          accessibilityLabel="Mais"
          disabled={quantity >= MAX_QUANTITY}
          onPress={onIncrement}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    padding: space[3],
    backgroundColor: color.surface100,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.lg,
  },
  info: { flex: 1, gap: space[1] },
  swap: { flexDirection: 'row', marginTop: space[1] },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  quantity: { minWidth: 24, textAlign: 'center' },
});
