import { StyleSheet, Text } from 'react-native';

import { formatPrice } from '@/lib/money';
import { color, radius, space, type } from '@/theme';

/** Price tag: accent-ink on accent-soft. */
export function Price({ cents }: { cents: number }) {
  return <Text style={styles.price}>{formatPrice(cents)}</Text>;
}

const styles = StyleSheet.create({
  price: {
    ...type.price,
    color: color.accentInk,
    backgroundColor: color.accentSoft,
    borderRadius: radius.sm,
    paddingVertical: space[1],
    paddingHorizontal: space[2],
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
});
