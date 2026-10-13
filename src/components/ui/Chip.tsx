import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';
import { radius, spacing, useTheme } from '@/theme';

export type StatusVariant =
  | 'matched' | 'review' | 'unknown' | 'queued'
  | 'synced' | 'offline' | 'error' | 'syncing';

const definitions: Record<StatusVariant, { icon: IconName; tone: 'positive' | 'warning' | 'danger' | 'info' }> = {
  matched: { icon: 'check', tone: 'positive' },
  review: { icon: 'clock', tone: 'warning' },
  unknown: { icon: 'unknown', tone: 'danger' },
  queued: { icon: 'upload', tone: 'warning' },
  synced: { icon: 'check', tone: 'positive' },
  offline: { icon: 'offline', tone: 'info' },
  error: { icon: 'alert', tone: 'danger' },
  syncing: { icon: 'sync', tone: 'info' },
};

export function Chip({ status }: { status: StatusVariant }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const definition = definitions[status];
  const background = definition.tone === 'positive' ? colors.primaryStrong
    : definition.tone === 'warning' ? colors.accent
      : definition.tone === 'danger' ? colors.dangerStrong : colors.surfaceRaised;
  const foreground = definition.tone === 'warning' ? colors.accentText
    : definition.tone === 'info' ? colors.info : colors.onStrong;

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Icon name={definition.icon} color={foreground} size={14} />
      <AppText strong style={styles.label}>{t('status.' + status)}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.pill,
  },
  label: { color: '#FFFFFF', fontSize: 13, lineHeight: 18 },
});
