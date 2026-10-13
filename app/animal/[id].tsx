import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { AnimalThumb } from '@/components/ui/AnimalThumb';
import { Card } from '@/components/ui/Card';
import { useTheme, spacing, radius } from '@/theme';
import { demoAnimals, type AnimalRecord } from '@/features/animals/demoData';
import { getAnimalCopy, formatLastSeen, type AnimalCopy } from '@/features/animals/labels';

function InfoRow({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
      <AppText variant="caption" muted>{label}</AppText>
      <AppText strong>{value}</AppText>
    </View>
  );
}

function StatusBadge({
  status,
  copy,
}: {
  status: AnimalRecord['status'];
  copy: AnimalCopy;
}) {
  const { colors } = useTheme();
  const active = status === 'active';

  return (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: active ? colors.primaryStrong : colors.surfaceRaised },
      ]}
    >
      <AppText
        variant="caption"
        strong
        style={{ color: active ? colors.onStrong : colors.textMuted }}
      >
        {active ? copy.active : copy.archived}
      </AppText>
    </View>
  );
}

export default function AnimalProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { i18n } = useTranslation();
  const { colors } = useTheme();
  const language = (i18n.resolvedLanguage ?? i18n.language).split('-')[0];
  const copy = getAnimalCopy(language);
  const animal = demoAnimals.find((item) => item.id === params.id);

  return (
    <ScreenContainer stripes style={styles.page}>
      <View style={styles.header}>
        <IconButton name="back" label={copy.back} onPress={() => router.back()} />
        <AppText variant="subtitle" strong>
          {animal ? animal.id : copy.notFound}
        </AppText>
      </View>

      {!animal ? null : (
        <>
          <Card>
            <View style={styles.hero}>
              <AnimalThumb size={124} />
              <View style={styles.heroDetails}>
                <AppText variant="title" strong>
                  {animal.species === 'Tiger' ? copy.tiger : copy.leopard}
                </AppText>
                {animal.displayName ? (
                  <AppText muted>{animal.displayName}</AppText>
                ) : null}
                <StatusBadge status={animal.status} copy={copy} />
                <View style={styles.locationRow}>
                  <Icon name="location" color={colors.textMuted} size={16} />
                  <AppText variant="caption" muted>
                    {animal.zone === 'core' ? copy.core : copy.buffer}
                  </AppText>
                </View>
              </View>
            </View>
          </Card>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <AppText variant="caption" muted>{copy.sightings}</AppText>
              <AppText variant="title" strong>{animal.sightings}</AppText>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <AppText variant="caption" muted>{copy.lastSeenLabel}</AppText>
              <AppText variant="subtitle" strong>
                {formatLastSeen(animal.lastSeenDaysAgo, copy)}
              </AppText>
            </View>
          </View>

          <Card>
            <AppText variant="title" strong>{copy.profile}</AppText>
            <InfoRow label={copy.firstSeen} value={animal.firstSeen} />
            {animal.sex ? (
              <InfoRow
                label={copy.sex}
                value={animal.sex === 'female' ? copy.female : copy.male}
              />
            ) : null}
            {animal.ageClass ? (
              <InfoRow
                label={copy.ageClass}
                value={animal.ageClass === 'adult' ? copy.adult : copy.subadult}
              />
            ) : null}
            <InfoRow
              label={copy.lastKnownLocation}
              value={
                animal.source === 'camera'
                  ? `${animal.cameraCode ?? ''} · ${copy.cameraTrap}`
                  : copy.fieldCapture
              }
            />
            {animal.notes ? <InfoRow label={copy.notes} value={animal.notes} /> : null}
          </Card>

          <Card style={styles.noticeCard}>
            <AppText variant="caption" muted>{copy.internalIdNote}</AppText>
          </Card>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  hero: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.md },
  heroDetails: { flex: 1, minWidth: 150, gap: spacing.sm },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statCard: {
    flex: 1,
    minWidth: 130,
    borderWidth: 1,
    borderRadius: radius.large,
    padding: spacing.md,
    gap: spacing.xs,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  infoRow: {
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.xxs,
  },
  noticeCard: { marginTop: 0 },
});