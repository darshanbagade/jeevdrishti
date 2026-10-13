import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { Button } from './Button';
import { spacing } from '@/theme';

export function SectionHeader({
  title, subtitle, actionLabel, onAction,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <AppText variant="title" strong>{title}</AppText>
        {subtitle ? <AppText muted>{subtitle}</AppText> : null}
      </View>
      {actionLabel ? <Button variant="ghost" onPress={onAction}>{actionLabel}</Button> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  text: { flex: 1, gap: spacing.xxs },
});
