import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { Card } from './Card';
import { Icon, type IconName } from './Icon';
import { spacing, useTheme } from '@/theme';

export function StatCard({ label, value, icon }: { label: string; value: string | number; icon: IconName }) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: colors.surfaceRaised }]}>
        <Icon name={icon} color={colors.primary} size={20} />
      </View>
      <AppText variant="title" strong>{value}</AppText>
      <AppText muted>{label}</AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 0 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
});
