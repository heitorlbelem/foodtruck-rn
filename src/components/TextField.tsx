import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Text } from '@/components/Text';
import { maskPrice } from '@/lib/money';
import { color, radius, size, space, type } from '@/theme';

type Props = Omit<TextInputProps, 'style'> & {
  label: string;
  hint?: string;
  error?: string;
  /** Price field: "R$" prefix, number keyboard and a cents mask while typing (maskPrice). */
  price?: boolean;
};

export function TextField({ label, hint, error, price, ...input }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <Text variant="label">{label}</Text>
      <View
        style={[
          styles.control,
          focused && styles.focused,
          error !== undefined && { borderColor: color.danger, backgroundColor: color.dangerSoft },
        ]}>
        {price && <Text style={[type.price, { color: color.inkMuted }]}>R$</Text>}
        <TextInput
          accessibilityLabel={label}
          keyboardType={price ? 'number-pad' : 'default'}
          placeholderTextColor={color.inkMuted}
          cursorColor={color.primary}
          selectionColor={color.primarySoft}
          {...input}
          onChangeText={(text) => {
            if (!price) return input.onChangeText?.(text);
            const masked = maskPrice(text);
            if (masked !== null) input.onChangeText?.(masked);
          }}
          onFocus={(e) => {
            setFocused(true);
            input.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            input.onBlur?.(e);
          }}
          style={styles.input}
        />
      </View>
      {(error ?? hint) && (
        <Text variant="caption" style={{ color: error ? color.danger : color.inkMuted }}>
          {error ?? hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: space[2] },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: size.touchMin,
    backgroundColor: color.surface200,
    borderWidth: 1,
    borderColor: color.lineStrong,
    borderRadius: radius.md,
    paddingHorizontal: space[4],
    gap: space[2],
  },
  // Design system focus ring: 3px solid primary.
  focused: { outlineColor: color.primary, outlineWidth: 3, outlineOffset: 2, outlineStyle: 'solid' },
  input: { ...type.body, flex: 1, color: color.ink, paddingVertical: 0 },
});
