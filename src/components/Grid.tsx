import { useState, type ReactNode } from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';

import { space } from '@/theme';

type Props<T> = { data: T[]; keyOf: (item: T) => string; render: (item: T) => ReactNode };

const Gap = () => <View style={styles.gap} />;

/** Virtualized card grid: 3 to 4 columns in landscape, 2 in portrait. */
export function Grid<T>({ data, keyOf, render }: Props<T>) {
  const window = useWindowDimensions();
  const [width, setWidth] = useState(0);
  const columns = window.height > window.width ? 2 : width >= 960 ? 4 : 3;
  const cell = (width - space[4] * (columns - 1)) / columns;

  return (
    <FlatList
      // numColumns can't change on a mounted list: the key forces a remount.
      key={columns}
      numColumns={columns}
      // Only render cards once the width is known, so they don't jump.
      data={width > 0 ? data : []}
      keyExtractor={keyOf}
      renderItem={({ item }) => <View style={{ width: cell }}>{render(item)}</View>}
      ItemSeparatorComponent={Gap}
      columnWrapperStyle={styles.row}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width - space[5] * 2)}
      style={styles.list}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  list: { marginHorizontal: -space[5] },
  // Bottom space so the Toast doesn't cover the last row.
  content: { paddingHorizontal: space[5], paddingBottom: space[7] + space[5] },
  row: { gap: space[4] },
  gap: { height: space[4] },
});
