import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { AnimalThumb } from '@/components/ui/AnimalThumb';
import { useIdentifyHistoryStore } from '@/features/identification/historyStore';
import { useIdentifySelectionStore } from '@/features/identification/selectionStore';
import { formatLastSeen, getAnimalCopy } from '@/features/animals/labels';
import { radius, spacing, useTheme } from '@/theme';

function InputVideoPreview({ uri, style }: { uri: string; style: StyleProp<ViewStyle> }) {
  const player = useVideoPlayer(uri, (videoPlayer) => {
    videoPlayer.loop = false;
  });

  return (
    <VideoView
      player={player}
      style={style}
      nativeControls
      contentFit="contain"
    />
  );
}

export default function IdentifyMatchReviewScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ historyId?: string }>();
  const historyId = typeof params.historyId === 'string' ? params.historyId : '';
  const entries = useIdentifyHistoryStore((state) => state.entries);
  const inputAssets = useIdentifySelectionStore((state) => state.assets);
  const recordCandidateDecision = useIdentifyHistoryStore((state) => state.recordCandidateDecision);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const entry = entries.find((item) => item.id === historyId);
  const selectedId = selectedAnimalId && entry?.candidates.some((candidate) => candidate.animal.id === selectedAnimalId)
    ? selectedAnimalId
    : entry?.candidates[0]?.animal.id;
  const selectedCandidate = entry?.candidates.find((candidate) => candidate.animal.id === selectedId);
  const selectedDecision = selectedCandidate ? entry?.candidateReviews?.[selectedCandidate.animal.id] : undefined;
  const language = (i18n.resolvedLanguage ?? i18n.language).split('-')[0];
  const animalCopy = getAnimalCopy(language);
  const allRejected = Boolean(entry && entry.candidates.length > 0 && entry.candidates.every(
    (candidate) => entry.candidateReviews?.[candidate.animal.id] === 'rejected',
  ));

  const confirmSelected = () => {
    if (!entry || !selectedCandidate) return;
    recordCandidateDecision(entry.id, selectedCandidate.animal.id, 'confirmed');
    router.replace('/identify-history');
  };

  const rejectSelected = () => {
    if (!entry || !selectedCandidate) return;
    const nextReviews = { ...(entry.candidateReviews ?? {}), [selectedCandidate.animal.id]: 'rejected' as const };
    const everyCandidateRejected = entry.candidates.length > 0 && entry.candidates.every(
      (candidate) => nextReviews[candidate.animal.id] === 'rejected',
    );
    recordCandidateDecision(entry.id, selectedCandidate.animal.id, 'rejected');
    if (everyCandidateRejected) router.replace('/identify-history');
  };

  const markUnresolved = () => {
    if (!entry) return;
    recordCandidateDecision(entry.id, undefined, 'unresolved');
    router.replace('/identify-history');
  };

  return (
    <ScreenContainer stripes style={styles.page}>
      <View style={styles.header}>
        <IconButton name="back" label={t('identifyFlow.back')} onPress={() => router.back()} />
        <AppText variant="subtitle" strong>{t('identifyFlow.matchReviewTitle')}</AppText>
      </View>

      <View style={styles.heading}>
        <AppText variant="display" strong>{t('identifyFlow.matchReviewTitle')}</AppText>
        <AppText muted>{t('identifyFlow.matchReviewSubtitle')}</AppText>
      </View>

      <Card style={styles.notice}>
        <Icon name="alert" color={colors.primary} size={22} />
        <View style={styles.noticeText}>
          <AppText variant="caption" strong>{t('identifyFlow.matchReviewDemoNotice')}</AppText>
        </View>
      </Card>

      {entry ? (
        <View style={styles.inputSection}>
          <View style={styles.inputHeading}>
            <AppText variant="subtitle" strong>{t('identifyFlow.selectedMedia')}</AppText>
            <AppText variant="caption" muted>
              {t('identifyFlow.selectedCount', { value: inputAssets.length })}
            </AppText>
          </View>
          {inputAssets.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.inputScroll}
            >
              {inputAssets.map((asset, index) => (
                <View
                  key={`${asset.uri}-${index}`}
                  style={[styles.inputCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  {asset.type === 'video' ? (
                    <InputVideoPreview
                      uri={asset.uri}
                      style={[styles.inputVideo, { backgroundColor: colors.surfaceRaised }]}
                    />
                  ) : (
                    <Image
                      source={{ uri: asset.uri }}
                      style={styles.inputImage}
                      resizeMode="cover"
                      accessibilityLabel={t('identifyFlow.reviewImageAccessibilityLabel', { value: index + 1 })}
                    />
                  )}
                  <View style={styles.inputCaption}>
                    <AppText strong numberOfLines={1}>
                      {asset.type === 'video'
                        ? (asset.fileName ?? t('identifyFlow.selectedVideo'))
                        : t('identifyFlow.imageLabel', { value: index + 1 })}
                    </AppText>
                    {asset.width && asset.height ? (
                      <AppText variant="caption" muted>{`${asset.width} Ã— ${asset.height}`}</AppText>
                    ) : null}
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Card style={styles.emptyMediaNotice}>
              <AppText variant="caption" muted>{t('identifyFlow.noMediaReceived')}</AppText>
            </Card>
          )}
        </View>
      ) : null}

      {!entry ? (
        <Card>
          <AppText strong>{t('identifyFlow.matchReviewNoRecord')}</AppText>
          <Button onPress={() => router.replace('/identify-results')}>{t('identifyFlow.resultsTitle')}</Button>
        </Card>
      ) : entry.candidates.length === 0 ? (
        <Card>
          <AppText strong>{t('identifyFlow.resultsEmpty')}</AppText>
          <Button onPress={() => router.replace('/identify-history')}>{t('identifyFlow.historyTitle')}</Button>
        </Card>
      ) : (
        <>
          <AppText variant="subtitle" strong>{t('identifyFlow.matchReviewSelectCandidate')}</AppText>
          <View style={styles.candidateList}>
            {entry.candidates.map((candidate) => {
              const selected = candidate.animal.id === selectedId;
              const decision = entry.candidateReviews?.[candidate.animal.id];
              return (
                <Pressable
                  key={`${entry.id}-${candidate.animal.id}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setSelectedAnimalId(candidate.animal.id)}
                  style={({ pressed }) => [
                    styles.candidateCard,
                    {
                      backgroundColor: selected ? colors.surfaceRaised : colors.surface,
                      borderColor: selected ? colors.primary : colors.border,
                      opacity: pressed ? 0.82 : 1,
                    },
                  ]}
                >
                  <AnimalThumb size={56} imageUri={candidate.animal.referenceImageUri} />
                  <View style={styles.candidateDetails}>
                    <AppText variant="subtitle" strong>{candidate.animal.id}</AppText>
                    <AppText variant="caption" muted>
                      {candidate.animal.species === 'Tiger' ? animalCopy.tiger : animalCopy.leopard}
                      {' · '}{t('identifyFlow.resultsRank', { rank: candidate.rank })}
                      {' · '}{candidate.similarityScore}%
                    </AppText>
                    <AppText variant="caption" muted>
                      {candidate.animal.zone === 'core' ? animalCopy.core : animalCopy.buffer}
                      {' · '}{formatLastSeen(candidate.animal.lastSeenDaysAgo, animalCopy)}
                    </AppText>
                    {decision ? (
                      <AppText variant="caption" strong style={{ color: decision === 'confirmed' ? colors.primary : colors.danger }}>
                        {decision === 'confirmed'
                          ? t('identifyFlow.candidateReviewConfirmed')
                          : t('identifyFlow.candidateReviewRejected')}
                      </AppText>
                    ) : null}
                  </View>
                  <Icon name={selected ? 'check' : 'forward'} color={selected ? colors.primary : colors.textMuted} size={20} />
                </Pressable>
              );
            })}
          </View>

          {selectedDecision === 'rejected' ? (
            <Card>
              <AppText variant="caption" muted>{t('identifyFlow.matchReviewRejectedInfo')}</AppText>
            </Card>
          ) : null}
          {allRejected ? (
            <Card>
              <AppText strong>{t('identifyFlow.historyRejected')}</AppText>
            </Card>
          ) : null}

          <Button icon="check" onPress={confirmSelected} disabled={!selectedCandidate}>
            {t('identifyFlow.matchReviewConfirm')}
          </Button>
          <Button variant="danger" icon="close" onPress={rejectSelected} disabled={!selectedCandidate || selectedDecision === 'rejected' || allRejected}>
            {t('identifyFlow.matchReviewReject')}
          </Button>
          <Button variant="ghost" icon="unknown" onPress={markUnresolved}>
            {t('identifyFlow.matchReviewUnresolved')}
          </Button>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: spacing.xl, gap: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  heading: { gap: spacing.sm },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  noticeText: { flex: 1 },
  inputSection: { gap: spacing.sm },
  inputHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  inputScroll: { gap: spacing.sm, paddingRight: spacing.md },
  inputCard: { width: 178, borderWidth: 1, borderRadius: radius.medium, overflow: 'hidden' },
  inputImage: { width: '100%', height: 166, backgroundColor: '#e8ece7' },
  inputVideo: { width: '100%', height: 166, padding: spacing.sm, alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  inputCaption: { padding: spacing.sm, gap: spacing.xxs },
  emptyMediaNotice: { padding: spacing.sm },
  candidateList: { gap: spacing.sm },
  candidateCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    padding: spacing.sm, borderWidth: 1, borderRadius: radius.large,
  },
  candidateDetails: { flex: 1, minWidth: 0, gap: spacing.xxs },
});