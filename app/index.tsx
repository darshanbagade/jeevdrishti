import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { StatCard } from '@/components/ui/StatCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AnimalThumb } from '@/components/ui/AnimalThumb';
import { spacing, radius, useTheme } from '@/theme';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();

  const comingSoon = (title: string) =>
    Alert.alert(title, t('dashboard.comingSoon'));

  const sightings = [
    { id: 'T-003', zone: 'coreZone', time: 'today', status: 'matched' as const },
    { id: 'T-011', zone: 'bufferZone', time: 'yesterday', status: 'review' as const },
    { id: 'T-007', zone: 'coreZone', time: 'today', status: 'unknown' as const },
  ];

  return (
    <ScreenContainer stripes style={styles.page}>
      <View style={styles.header}>
        <View style={styles.brand}>
          <View style={[styles.brandMark, { backgroundColor: colors.surfaceRaised }]}>
            <Icon name="leaf" color={colors.primary} size={25} />
          </View>
          <View style={styles.brandText}>
            <AppText variant="subtitle" strong>JeevDrishti</AppText>

          </View>
        </View>
        {__DEV__ && (
          <IconButton
            name="settings"
            label="Settings"
            onPress={() => router.push('/settings')}
          />
        )}
      </View>

      <LanguageSwitcher />
      <View style={[styles.hero, { borderColor: colors.border }]}>
        <LinearGradient
          colors={[colors.primaryStrong, colors.surface, colors.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Svg
          width="100%"
          height="100%"
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Path
            d="M190 0 L340 0 L150 260 L60 260 Z M300 0 L430 0 L250 260 L180 260 Z M430 0 L520 0 L350 260 L290 260 Z"
            fill={colors.primary}
            opacity={0.09}
          />
        </Svg>

        <View style={[styles.heroPill, { backgroundColor: colors.surfaceRaised }]}>
          <View style={[styles.liveDot, { backgroundColor: colors.accent }]} />
          <AppText variant="caption" strong>{t('dashboard.landscape')}</AppText>
        </View>

        <AppText variant="display" strong style={styles.heroTitle}>
          {t('dashboard.heroTitle')}
        </AppText>
        <AppText style={[styles.heroBody, { color: colors.textMuted }]}>
          {t('dashboard.heroBody')}
        </AppText>

        <View style={styles.heroButton}>
          <Button
            variant="accent"
            icon="identify"
            style={styles.identifyButton}
            onPress={() => comingSoon(t('dashboard.identify'))}
          >
            {t('dashboard.identify')}
          </Button>
        </View>

        <View style={styles.heroFooter}>
          <Icon name="shield" color={colors.primary} size={17} />
          <AppText variant="caption" muted>{t('dashboard.humanReview')}</AppText>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          title={t('dashboard.overview')}
          subtitle={t('dashboard.sampleData')}
        />

        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <StatCard label={t('dashboard.animals')} value="06" icon="animals" />
          </View>
          <View style={styles.statItem}>
            <StatCard label={t('dashboard.referenceImages')} value="33" icon="image" />
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <StatCard label={t('dashboard.sightings')} value="08" icon="location" />
          </View>
          <View style={styles.statItem}>
            <StatCard label={t('dashboard.pending')} value="00" icon="clock" />
          </View>
        </View>

        <Card padding={spacing.md}>
          <View style={styles.cameraStat}>
            <View style={[styles.cameraIcon, { backgroundColor: colors.surfaceRaised }]}>
              <Icon name="camera" color={colors.primary} size={22} />
            </View>
            <View style={styles.cameraText}>
              <AppText strong>{t('dashboard.cameras')}</AppText>
              <AppText variant="caption" muted>{t('dashboard.cameraCaption')}</AppText>
            </View>
            <AppText variant="title" strong>10</AppText>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader
          title={t('dashboard.recent')}
          subtitle={t('dashboard.sampleRecords')}
          actionLabel={t('dashboard.viewAll')}
          onAction={() => comingSoon(t('dashboard.recent'))}
        />

        {sightings.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={item.id + ', ' + t('dashboard.' + item.zone)}
            onPress={() => comingSoon(item.id)}
            style={({ pressed }) => [pressed && styles.pressed]}
          >
            <Card padding={spacing.sm}>
              <View style={styles.sightingRow}>
                <AnimalThumb size={58} />
                <View style={styles.sightingDetails}>
                  <AppText variant="subtitle" strong>{item.id}</AppText>
                  <View style={styles.metaRow}>
                    <Icon name="location" color={colors.textMuted} size={14} />
                    <AppText variant="caption" muted>
                      {t('dashboard.' + item.zone)}
                    </AppText>
                    <AppText variant="caption" muted>?</AppText>
                    <AppText variant="caption" muted>
                      {t('dashboard.' + item.time)}
                    </AppText>
                  </View>
                </View>
                <Chip status={item.status} />
              </View>
            </Card>
          </Pressable>
        ))}
      </View>

      <Card>
        <View style={styles.fieldReady}>
          <View style={[styles.readyIcon, { backgroundColor: colors.surfaceRaised }]}>
            <Icon name="offline" color={colors.primary} size={22} />
          </View>
          <View style={styles.readyText}>
            <AppText strong>{t('dashboard.fieldReady')}</AppText>
            <AppText variant="caption" muted>{t('dashboard.fieldDescription')}</AppText>
          </View>
        </View>
      </Card>

      <View style={styles.footer}>
        <AppText variant="caption" muted>{t('dashboard.notConnected')}</AppText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  brandMark: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: { gap: 0 },
  hero: {
    borderWidth: 1,
    borderRadius: radius.large,
    overflow: 'hidden',
    padding: spacing.lg,
    gap: spacing.md,
  },
  heroPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  liveDot: { width: 7, height: 7, borderRadius: radius.pill },
  heroTitle: { maxWidth: 300 },
  heroBody: { lineHeight: 24 },
  heroButton: { alignSelf: 'flex-start', marginTop: spacing.xs },
  identifyButton: { width: 200, minHeight: 48 },
  heroFooter: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  section: { gap: spacing.md },
  statRow: { flexDirection: 'row', gap: spacing.sm },
  statItem: { flex: 1, minWidth: 0 },
  cameraStat: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cameraIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraText: { flex: 1, gap: spacing.xxs },
  sightingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sightingDetails: { flex: 1, minWidth: 0, gap: spacing.xs },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  pressed: { opacity: 0.78 },
  fieldReady: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  readyIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readyText: { flex: 1, gap: spacing.xxs },
  footer: { alignItems: 'center', paddingTop: spacing.xs, paddingBottom: spacing.md },
});
