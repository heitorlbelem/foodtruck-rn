import { Pressable, StyleSheet, Text } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { color, radius, size, space, type } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  label?: string;
  icon?: IconName;
  variant?: Variant;
  onPress: () => void;
  disabled?: boolean;
  /** For icon-only buttons. */
  accessibilityLabel?: string;
  /** Text color of a ghost button on a dark background (Toast). */
  tint?: string;
};

const colors: Record<Variant, { bg: string; pressed: string; fg: string }> = {
  primary: { bg: color.primary, pressed: color.primaryHover, fg: color.onPrimary },
  secondary: { bg: color.primarySoft, pressed: color.primarySoft, fg: color.primary },
  ghost: { bg: 'transparent', pressed: color.primarySoft, fg: color.primary },
  danger: { bg: color.dangerSoft, pressed: color.dangerSoft, fg: color.danger },
};

export function Button({ label, icon, variant = 'primary', onPress, disabled, accessibilityLabel, tint }: Props) {
  const c = colors[variant];
  const fg = disabled ? color.inkMuted : (tint ?? c.fg);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        !label && styles.iconOnly,
        { backgroundColor: disabled ? color.surface300 : pressed ? c.pressed : c.bg },
        pressed && variant !== 'primary' && { opacity: 0.8 },
      ]}>
      {icon && <Icon name={icon} color={fg} />}
      {label && <Text style={[type.price, { color: fg }]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: size.touchMin,
    paddingHorizontal: space[5],
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
  },
  iconOnly: { width: size.touchMin, paddingHorizontal: 0 },
});
