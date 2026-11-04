import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { color, radius, size, space, type } from '@/theme';

type Props = {
  label: string;
  icon?: IconName;
  selected?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  /** Removable ingredient: shows the "×". */
  onRemove?: () => void;
};

export function Chip({ label, icon, selected, onPress, onLongPress, onRemove }: Props) {
  const fg = selected ? color.onPrimary : color.primary;
  const content = (
    <>
      {icon && <Icon name={icon} color={fg} size={20} />}
      <Text numberOfLines={1} style={[type.label, { color: fg, flexShrink: 0 }]}>
        {label}
      </Text>
    </>
  );
  const chipStyle = [styles.chip, { backgroundColor: selected ? color.primary : color.primarySoft }];

  if (onRemove) {
    return (
      <View style={[chipStyle, styles.removable]}>
        {content}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remover ${label}`}
          hitSlop={8}
          onPress={onRemove}
          style={styles.remove}>
          <Icon name="close" color={fg} size={20} />
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={selected === undefined ? undefined : { selected }}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [chipStyle, pressed && { opacity: 0.8 }]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: size.touchMin,
    paddingHorizontal: space[4],
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
  },
  removable: { paddingRight: space[2] },
  remove: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
