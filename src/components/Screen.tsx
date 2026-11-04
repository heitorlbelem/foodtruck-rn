import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { space } from '@/theme';

type Props = {
  title: string;
  caption?: string;
  action?: { label: string; onPress: () => void };
  children: ReactNode;
};

/** Display title, caption and at most one primary action at the top. */
export function Screen({ title, caption, action, children }: Props) {
  return (
    <View style={styles.main}>
      <View style={styles.topbar}>
        <View>
          <Text variant="display">{title}</Text>
          {caption ? (
            <Text variant="caption" muted>
              {caption}
            </Text>
          ) : null}
        </View>
        {action && <Button icon="add" label={action.label} onPress={action.onPress} />}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, padding: space[5], gap: space[4] },
  topbar: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: space[4] },
});
