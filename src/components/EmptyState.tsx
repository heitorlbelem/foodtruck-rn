import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Icon, type IconName } from '@/components/Icon';
import { Text } from '@/components/Text';
import { color, radius, space } from '@/theme';

const STEPS = ['Categoria', 'Item', 'Adicional', 'Combo'];

type Props = {
  icon: IconName;
  title: string;
  text: string;
  actionLabel: string;
  onAction: () => void;
  actionIcon?: IconName | null;
  /** Onboarding: shows the step trail with this step (0 to 3) highlighted. */
  step?: number;
};

/** A single button for the next step. */
export function EmptyState({ icon, title, text, actionLabel, onAction, actionIcon = 'add', step }: Props) {
  return (
    <View style={styles.empty}>
      <View style={styles.art}>
        <Icon name={icon} size={48} color={color.accentInk} />
      </View>
      {step !== undefined && (
        <View style={styles.steps}>
          {STEPS.map((label, i) => (
            <Text
              key={label}
              variant="caption"
              style={
                i < step
                  ? { color: color.success }
                  : i === step
                    ? { color: color.primary, fontWeight: '800' }
                    : { color: color.inkMuted }
              }>
              {i > 0 ? '·  ' : ''}
              {i + 1} {label}
            </Text>
          ))}
        </View>
      )}
      <Text variant="title" style={styles.center}>
        {title}
      </Text>
      <Text muted style={[styles.center, styles.text]}>
        {text}
      </Text>
      <Button icon={actionIcon ?? undefined} label={actionLabel} onPress={onAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[3],
    paddingVertical: space[7],
    paddingHorizontal: space[5],
  },
  art: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    backgroundColor: color.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  steps: { flexDirection: 'row', gap: space[2] },
  center: { textAlign: 'center' },
  text: { maxWidth: 400 },
});
