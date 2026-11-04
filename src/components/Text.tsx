import { Text as RNText, type TextProps } from 'react-native';

import { color, type, type TypeVariant } from '@/theme';

type Props = TextProps & { variant?: TypeVariant; muted?: boolean };

export function Text({ variant = 'body', muted, style, ...props }: Props) {
  return <RNText style={[type[variant], { color: muted ? color.inkMuted : color.ink }, style]} {...props} />;
}
