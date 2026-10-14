import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { AnimalThumb } from "@/components/ui/AnimalThumb";
import { animalRepository } from "@/features/animals/repository";
import type { AnimalRecord } from "@/features/animals/types";
import { formatLastSeen, getAnimalCopy } from "@/features/animals/labels";
import { useIdentifySelectionStore } from "@/features/identification/selectionStore";
import { useIdentifyHistoryStore } from "@/features/identification/historyStore";
import { spacing, radius, useTheme } from "@/theme";

const demoSimilarityScores = [96, 92, 88, 84, 80] as const;

export default function IdentifyResultsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();

  const assets = useIdentifySelectionStore((state) => state.assets);
  const addHistoryEntry = useIdentifyHistoryStore((state) => state.addEntry);
  const [historyHydrated, setHistoryHydrated] = useState(() =>
    useIdentifyHistoryStore.persist.hasHydrated(),
  );
  const hasSavedHistory = useRef(false);
  const [historyEntryId] = useState(
    () => `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  );
  const language = (i18n.resolvedLanguage ?? i18n.language).split("-")[0];
  const copy = getAnimalCopy(language);

  const [candidates, setCandidates] = useState<AnimalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const unsubscribe = useIdentifyHistoryStore.persist.onFinishHydration(
      () => {
        setHistoryHydrated(true);
      },
    );

    // Handle hydration that finished just before this listener subscribed.
    void Promise.resolve().then(() => {
      if (useIdentifyHistoryStore.persist.hasHydrated()) {
        setHistoryHydrated(true);
      }
    });

    return unsubscribe;
  }, []);
  const loadCandidates = useCallback(async () => {
    setIsLoading(true);
    setLoadError(false);

    try {
      const records = await animalRepository.listAnimals();
      setCandidates(records.slice(0, 5));
    } catch {
      setCandidates([]);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadCandidates();
    }, 0);

    return () => clearTimeout(timeout);
  }, [loadCandidates]);
  useEffect(() => {
    if (
      !historyHydrated ||
      isLoading ||
      loadError ||
      candidates.length === 0 ||
      assets.length === 0 ||
      hasSavedHistory.current
    ) {
      return;
    }

    hasSavedHistory.current = true;

    addHistoryEntry({
      id: historyEntryId,
      createdAt: new Date().toISOString(),
      source: "demo",
      reviewStatus: "not-reviewed",
      mediaCount: assets.length,
      mediaTypes: assets.map((asset) => asset.type ?? "unknown"),
      mediaMetadata: assets.map((asset, index) => ({
        index: index + 1,
        mediaType: asset.type ?? "unknown",
        capturedAt: asset.capturedAt ?? null,
        captureTimeSource: asset.captureTimeSource ?? "unknown",
        location: asset.location ?? null,
        locationSource: asset.locationSource ?? "unknown",
      })),
      candidates: candidates.slice(0, 5).map((animal, index) => ({
        rank: index + 1,
        animal,
        similarityScore: demoSimilarityScores[index] ?? 0,
      })),
    });
  }, [
    addHistoryEntry,
    assets,
    candidates,
    historyEntryId,
    historyHydrated,
    isLoading,
    loadError,
  ]);

  return (
    <ScreenContainer stripes style={styles.page}>
      <View style={styles.header}>
        <IconButton
          name="back"
          label={t("identifyFlow.back")}
          onPress={() => router.back()}
        />
        <AppText variant="subtitle" strong>
          {t("identifyFlow.resultsTitle")}
        </AppText>
      </View>

      <View style={styles.heading}>
        <AppText variant="caption" strong style={{ color: colors.primary }}>
          {t("identifyFlow.resultsDemoBadge")}
        </AppText>
        <AppText variant="display" strong>
          {t("identifyFlow.resultsTitle")}
        </AppText>
        <AppText muted>{t("identifyFlow.resultsSubtitle")}</AppText>
        <AppText variant="caption" muted>
          {t("identifyFlow.selectedCount", { value: assets.length })}
        </AppText>
      </View>

      <View
        style={[
          styles.notice,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Icon name="alert" color={colors.primary} size={22} />
        <View style={styles.noticeText}>
          <AppText strong>{t("identifyFlow.resultsDemoNotice")}</AppText>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.state}>
          <ActivityIndicator size="large" color={colors.primary} />
          <AppText muted>{t("identifyFlow.resultsLoading")}</AppText>
        </View>
      ) : loadError ? (
        <View style={styles.state}>
          <AppText variant="title" strong>
            {t("identifyFlow.resultsLoadError")}
          </AppText>
          <AppText muted>{t("identifyFlow.resultsLoadErrorHelp")}</AppText>
          <Button variant="ghost" onPress={() => void loadCandidates()}>
            {t("identifyFlow.resultsRetry")}
          </Button>
        </View>
      ) : candidates.length === 0 ? (
        <View style={styles.state}>
          <AppText variant="title" strong>
            {t("identifyFlow.resultsEmpty")}
          </AppText>
          <AppText muted>{t("identifyFlow.resultsEmptyHelp")}</AppText>
          <Button variant="ghost" onPress={() => void loadCandidates()}>
            {t("identifyFlow.resultsRetry")}
          </Button>
        </View>
      ) : (
        <>
          <View style={styles.resultsList}>
            {candidates.map((animal, index) => (
              <Pressable
                key={animal.id}
                accessibilityRole="button"
                accessibilityLabel={`${t("identifyFlow.resultsRank", { rank: index + 1 })}, ${animal.id}`}
                onPress={() =>
                  router.push({
                    pathname: "/animal/[id]",
                    params: { id: animal.id },
                  })
                }
                style={({ pressed }) => [
                  styles.candidateCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <View style={styles.candidateTop}>
                  <AppText
                    variant="caption"
                    strong
                    style={{ color: colors.primary }}
                  >
                    {t("identifyFlow.resultsRank", { rank: index + 1 })}
                  </AppText>
                  <AppText variant="title" strong>
                    {`${demoSimilarityScores[index] ?? 0}%`}
                  </AppText>
                </View>

                <View style={styles.candidateContent}>
                  <AnimalThumb size={78} />

                  <View style={styles.candidateDetails}>
                    <AppText variant="subtitle" strong>
                      {animal.id}
                    </AppText>
                    {animal.displayName ? (
                      <AppText muted>{animal.displayName}</AppText>
                    ) : null}
                    <AppText>
                      {animal.species === "Tiger" ? copy.tiger : copy.leopard}
                    </AppText>
                    <AppText variant="caption" muted>
                      {animal.zone === "core" ? copy.core : copy.buffer}
                      {" Â· "}
                      {formatLastSeen(animal.lastSeenDaysAgo, copy)}
                    </AppText>
                    <AppText variant="caption" muted>
                      {t("identifyFlow.resultsSampleSimilarity")}
                    </AppText>
                  </View>

                  <Icon name="forward" color={colors.textMuted} size={19} />
                </View>
              </Pressable>
            ))}
          </View>
          <Button
            icon="forward"
            onPress={() =>
              router.push({
                pathname: "/identify-match-review",
                params: { historyId: historyEntryId },
              })
            }
          >
            {t("identifyFlow.matchReviewOpen")}
          </Button>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  heading: {
    gap: spacing.sm,
  },
  notice: {
    borderWidth: 1,
    borderRadius: radius.large,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  noticeText: {
    flex: 1,
    gap: spacing.xs,
  },
  state: {
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.md,
  },
  resultsList: {
    gap: spacing.md,
  },
  candidateCard: {
    borderWidth: 1,
    borderRadius: radius.large,
    padding: spacing.md,
    gap: spacing.sm,
  },
  candidateTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  candidateContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  candidateDetails: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
});
