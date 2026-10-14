import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { AnimalThumb } from '@/components/ui/AnimalThumb';
import { useIdentifyHistoryStore } from '@/features/identification/historyStore';
import { useIdentifySelectionStore } from '@/features/identification/selectionStore';
import { getAnimalCopy, formatLastSeen } from '@/features/animals/labels';
import { spacing, radius, useTheme } from '@/theme';

export default function IdentifyHistoryScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();

  const entries = useIdentifyHistoryStore((state) => state.entries);
  const clearAssets = useIdentifySelectionStore((state) => state.clearAssets);
  const [hydrated, setHydrated] = useState(
    () => useIdentifyHistoryStore.persist.hasHydrated(),
  );

  const language = (i18n.resolvedLanguage ?? i18n.language).split('-')[0];
  const copy = getAnimalCopy(language);
  const dateLocale =
    language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';

  useEffect(() => {
    const unsubscribe =
      useIdentifyHistoryStore.persist.onFinishHydration(() => {
        setHydrated(true);
      });

    void Promise.resolve().then(() => {
      if (useIdentifyHistoryStore.persist.hasHydrated()) {
        setHydrated(true);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <ScreenContainer scroll={false} stripes style={styles.page}>
      <View style={styles.header}>
        <IconButton
          name="back"
          label={t('identifyFlow.back')}
          onPress={() => router.back()}
        />
        <AppText variant="subtitle" strong>
          {t('identifyFlow.historyTitle')}
        </AppText>
      </View>

      <View style={styles.heading}>
        <AppText variant="display" strong>
          {t('identifyFlow.historyTitle')}
        </AppText>
        <AppText muted>
          {t('identifyFlow.historySubtitle')}
        </AppText>
      </View>

      <View
        style={[
          styles.notice,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Icon name="alert" color={colors.primary} size={21} />
        <View style={styles.noticeText}>
          <AppText variant="caption">
            {t('identifyFlow.historyDemoNotice')}
          </AppText>
        </View>
      </View>

      {!hydrated ? (
        <View style={styles.state}>
          <ActivityIndicator size="large" color={colors.primary} />
          <AppText muted>{t('identifyFlow.historyLoading')}</AppText>
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.state}>
          <Icon name="clock" color={colors.textMuted} size={34} />
          <AppText variant="title" strong>
            {t('identifyFlow.historyEmptyTitle')}
          </AppText>
          <AppText muted>
            {t('identifyFlow.historyEmptyBody')}
          </AppText>
          <Button
            icon="identify"
            onPress={() => {
              clearAssets();
              router.push('/identify');
            }}
          >
            {t('identifyFlow.historyStart')}
          </Button>
        </View>
      ) : (
        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.historyList}
          showsVerticalScrollIndicator={false}
        >
          {entries.map((entry) => {
            const date = new Date(entry.createdAt);
            const dateLabel = Number.isNaN(date.getTime())
              ? t('identifyFlow.historyUnknownDate')
              : date.toLocaleString(dateLocale);

            const statusLabel =
              entry.reviewStatus === 'confirmed'
                ? t('identifyFlow.historyConfirmed')
                : entry.reviewStatus === 'rejected'
                  ? t('identifyFlow.historyRejected')
                  : entry.reviewStatus === 'unresolved'
                    ? t('identifyFlow.historyUnresolved')
                    : entry.reviewStatus === 'pending-review'
                      ? t('identifyFlow.historyPending')
                      : t('identifyFlow.historyNotReviewed');

            return (
              <View
                key={entry.id}
                style={[
                  styles.entryCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.entryHeader}>
                  <View style={styles.entryHeaderText}>
                    <AppText
                      variant="caption"
                      strong
                      style={{ color: colors.primary }}
                    >
                      {entry.source === 'demo'
                        ? t('identifyFlow.historySourceDemo')
                        : t('identifyFlow.historySourceModel')}
                    </AppText>
                    <AppText variant="subtitle" strong>
                      {dateLabel}
                    </AppText>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      { backgroundColor: colors.surfaceRaised },
                    ]}
                  >
                    <AppText variant="caption" strong>
                      {statusLabel}
                    </AppText>
                  </View>
                </View>

                <AppText variant="caption" muted>
                  {t('identifyFlow.historyMediaCount', {
                    count: entry.mediaCount,
                  })}
                </AppText>
                <AppText variant="caption" muted>
                  {t('identifyFlow.historyCandidatesCount', {
                    count: entry.candidates.length,
                  })}
                </AppText>
                {entry.mediaMetadata?.map((media) => (
                  <View key={`${entry.id}-media-${media.index}`}>
                    <AppText variant="caption" muted>
                      {`Media ${media.index} · ${
                        media.capturedAt
                          ? new Date(media.capturedAt).toLocaleString()
                          : 'Capture time unknown'
                      }`}
                    </AppText>
                    <AppText variant="caption" muted>
                      {media.location
                        ? `${media.location.latitude.toFixed(6)}, ${media.location.longitude.toFixed(6)} · ${
                            media.location.accuracyMeters === null
                              ? 'accuracy unknown'
                              : `±${Math.round(media.location.accuracyMeters)} m`
                          } · ${media.locationSource}`
                        : `Location unavailable · ${media.locationSource}`}
                    </AppText>
                  </View>
                ))}
                {entry.reviewedAnimalId ? (
                  <AppText variant="caption" strong>
                    {t('identifyFlow.historyReviewedAnimal', { id: entry.reviewedAnimalId })}
                  </AppText>
                ) : null}
                <Button
                  variant="ghost"
                  icon="forward"
                  onPress={() =>
                    router.push({
                      pathname: '/identify-match-review',
                      params: { historyId: entry.id },
                    })
                  }
                >
                  {t('identifyFlow.matchReviewOpen')}
                </Button>

                {entry.candidates.length > 0 ? (
                  <View style={styles.candidatesSection}>
                    <AppText variant="subtitle" strong>
                      {t('identifyFlow.historyCandidatesTitle')}
                    </AppText>

                    {entry.candidates.map((candidate) => (
                      <Pressable
                        key={`${entry.id}-${candidate.rank}-${candidate.animal.id}`}
                        accessibilityRole="button"
                        accessibilityLabel={`${t('identifyFlow.historyOpenProfile')}: ${candidate.animal.id}`}
                        onPress={() =>
                          router.push({
                            pathname: '/animal/[id]',
                            params: { id: candidate.animal.id },
                          })
                        }
                        style={({ pressed }) => [
                          styles.candidateRow,
                          {
                            borderColor: colors.border,
                            opacity: pressed ? 0.75 : 1,
                          },
                        ]}
                      >
                        <AnimalThumb size={52} />

                        <View style={styles.candidateDetails}>
                          <AppText variant="subtitle" strong>
                            {candidate.animal.id}
                          </AppText>
                          <AppText variant="caption" muted>
                            {candidate.animal.species === 'Tiger'
                              ? copy.tiger
                              : copy.leopard}
                            {' Â· '}
                            {candidate.animal.zone === 'core'
                              ? copy.core
                              : copy.buffer}
                            {' Â· '}
                            {formatLastSeen(candidate.animal.lastSeenDaysAgo, copy)}
                          </AppText>
                          <AppText variant="caption" muted>
                            {entry.candidateReviews?.[candidate.animal.id] === 'confirmed'
                              ? t('identifyFlow.candidateReviewConfirmed')
                              : entry.candidateReviews?.[candidate.animal.id] === 'rejected'
                                ? t('identifyFlow.candidateReviewRejected')
                                : entry.source === 'demo'
                                  ? t('identifyFlow.resultsSampleSimilarity')
                                  : t('identifyFlow.historyModelScoreLabel')}
                          </AppText>
                        </View>

                        <View style={styles.score}>
                          <AppText variant="subtitle" strong>
                            {`${candidate.similarityScore}%`}
                          </AppText>
                          <AppText variant="caption" muted>
                            {t('identifyFlow.resultsRank', {
                              rank: candidate.rank,
                            })}
                          </AppText>
                        </View>

                        <Icon
                          name="forward"
                          color={colors.textMuted}
                          size={18}
                        />
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  heading: {
    gap: spacing.sm,
  },
  notice: {
    borderWidth: 1,
    borderRadius: radius.large,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  noticeText: {
    flex: 1,
  },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  listScroll: {
    flex: 1,
  },
  historyList: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  entryCard: {
    borderWidth: 1,
    borderRadius: radius.large,
    padding: spacing.md,
    gap: spacing.sm,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  entryHeaderText: {
    flex: 1,
    minWidth: 150,
    gap: spacing.xs,
  },
  statusPill: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  candidatesSection: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  candidateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  candidateDetails: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xxs,
  },
  score: {
    alignItems: 'flex-end',
    gap: spacing.xxs,
  },
});