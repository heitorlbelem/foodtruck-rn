import { Pressable, StyleSheet, View } from 'react-native';

import { Price } from '@/components/Price';
import { Text } from '@/components/Text';
import { color, radius, shadow, space, type } from '@/theme';

export type ItemCardProps = {
  name: string;
  priceCents: number;
  /** Item ingredients, or the combo's "sugerido R$ X". */
  meta?: string;
  /** Short footer summary: "+ Bacon", "2 itens". */
  summary?: string;
  selected?: boolean;
  onPress: () => void;
};

export function ItemCard({ name, priceCents, meta, summary, selected, onPress }: ItemCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { backgroundColor: color.surface300 },
        selected && styles.selected,
      ]}>
      {/* The API has no photos yet: the image area shows the initial. */}
      <View style={styles.media}>
        <Text style={[type.display, { color: color.primary }]}>{name.charAt(0).toUpperCase()}</Text>
      </View>
      <View>
        <Text variant="heading" numberOfLines={2}>
          {name}
        </Text>
        {meta ? (
          <Text variant="caption" muted numberOfLines={2}>
            {meta}
          </Text>
        ) : null}
      </View>
      <View style={styles.footer}>
        <Text variant="caption" muted numberOfLines={1} style={styles.summary}>
          {summary ?? ''}
        </Text>
        <Price cents={priceCents} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: color.surface200,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.lg,
    boxShadow: shadow.card,
    padding: space[3],
    gap: space[3],
  },
  selected: { borderColor: color.primary, outlineColor: color.primarySoft, outlineWidth: 2 },
  media: {
    height: 96,
    borderRadius: radius.md,
    backgroundColor: color.surface300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: space[2],
  },
  summary: { flex: 1 },
});
