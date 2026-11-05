// Tokens copied from ../foodtruck-ds/design-system/tokens.json, the source of truth.
// Do not invent values here: if something is missing, change the design system first.
import type { TextStyle } from 'react-native';

export const color = {
  surface100: '#fbf8f2',
  surface200: '#fffdf8',
  surface300: '#f4ebdd',
  line: '#ece6da',
  lineStrong: '#948c7c',
  ink: '#2a211e',
  inkMuted: '#6b5f58',
  primary: '#d11f2a',
  primaryHover: '#a8141f',
  onPrimary: '#ffffff',
  primarySoft: '#fde8e6',
  accent: '#ffc72c',
  onAccent: '#2a211e',
  accentSoft: '#fff1cc',
  accentInk: '#8a5a00',
  success: '#1f7a4d',
  successSoft: '#e3f1e9',
  danger: '#9b1c1c',
  dangerSoft: '#fbe4e1',
  scrim: 'rgba(42, 33, 30, 0.32)',
} as const;

export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48 } as const;

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 } as const;

export const shadow = {
  card: '0 1px 2px rgba(42, 33, 30, 0.06)',
  panel: '-8px 0 24px rgba(42, 33, 30, 0.14)',
} as const;

export const size = { touchMin: 48, railWidth: 88, panelWidth: 440 } as const;

const font = 'Nunito';

export const type = {
  display: { fontFamily: font, fontSize: 32, lineHeight: 38, fontWeight: '800' },
  title: { fontFamily: font, fontSize: 24, lineHeight: 30, fontWeight: '800' },
  heading: { fontFamily: font, fontSize: 18, lineHeight: 24, fontWeight: '800' },
  body: { fontFamily: font, fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodyStrong: { fontFamily: font, fontSize: 16, lineHeight: 24, fontWeight: '700' },
  label: { fontFamily: font, fontSize: 14, lineHeight: 20, fontWeight: '700' },
  caption: { fontFamily: font, fontSize: 13, lineHeight: 18, fontWeight: '600' },
  price: { fontFamily: font, fontSize: 16, lineHeight: 20, fontWeight: '800' },
} satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof type;
