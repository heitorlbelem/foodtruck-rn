import { Text, type ColorValue } from 'react-native';

import { color as colors } from '@/theme';

// Material Symbols Rounded, weight 500. The fonts in assets/fonts contain only these icons;
// to add one, re-download the font from Google Fonts with its name in `icon_names`.
const glyphs = {
  add: '\ue145',
  add_circle: '\ue147',
  archive: '\ue149',
  check: '\ue5ca',
  close: '\ue5cd',
  lunch_dining: '\uea61',
  remove: '\ue15b',
  restaurant_menu: '\ue561',
  undo: '\ue166',
} as const;

export type IconName = keyof typeof glyphs;

type Props = { name: IconName; color?: ColorValue; size?: number; filled?: boolean };

export function Icon({ name, color = colors.ink, size = 24, filled }: Props) {
  return (
    <Text
      accessible={false}
      style={{
        fontFamily: filled ? 'MaterialSymbolsRoundedFilled-Medium' : 'MaterialSymbolsRounded-Medium',
        fontSize: size,
        lineHeight: size,
        color,
      }}>
      {glyphs[name]}
    </Text>
  );
}
