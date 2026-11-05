import { router, usePathname, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { color, radius, size, space, type } from '@/theme';

const destinations: { href: Href; label: string; icon: IconName }[] = [
  { href: '/', label: 'Cardápio', icon: 'restaurant_menu' },
  { href: '/addons', label: 'Adicionais', icon: 'add_circle' },
  { href: '/combos', label: 'Combos', icon: 'lunch_dining' },
];

type Props = {
  brand: string;
  /** "Sair" at the bottom; not a destination, the caller confirms first. */
  onSignOut: () => void;
};

/** Fixed navigation rail on the left. The top is the customer's only branding spot. */
export function NavRail({ brand, onSignOut }: Props) {
  const pathname = usePathname();
  return (
    <View style={styles.rail} accessibilityRole="tablist">
      <View style={styles.brand} accessibilityLabel="Logo do foodtruck">
        <Text style={[type.heading, { color: color.onAccent }]}>{brand}</Text>
      </View>
      {destinations.map(({ href, label, icon }) => {
        const active = pathname === href;
        return (
          <Pressable
            key={label}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => router.navigate(href)}
            style={[styles.item, active && styles.active]}>
            <Icon name={icon} filled={active} color={active ? color.accent : color.onPrimary} />
            <Text style={[type.caption, styles.label]}>{label}</Text>
          </Pressable>
        );
      })}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Sair"
        onPress={onSignOut}
        style={[styles.item, styles.signOut]}>
        <Icon name="logout" color={color.onPrimary} />
        <Text style={[type.caption, styles.label]}>Sair</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    width: size.railWidth,
    backgroundColor: color.primary,
    alignItems: 'center',
    gap: space[2],
    paddingVertical: space[4],
  },
  brand: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space[4],
  },
  item: {
    width: 72,
    minHeight: 64,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[1],
  },
  signOut: { marginTop: 'auto' },
  active: { backgroundColor: 'rgba(255, 255, 255, 0.12)' },
  label: { color: color.onPrimary, fontWeight: '700' },
});
