
import {
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { useIdentifySelectionStore } from '@/features/identification/selectionStore';
import { spacing, radius, useTheme } from '@/theme';



export default function IdentifyReviewScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const assets = useIdentifySelectionStore((state) => state.assets);
  const setAssets = useIdentifySelectionStore((state) => state.setAssets);

  return (
    <ScreenContainer stripes style={styles.page}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Icon name="back" color={colors.text} size={20} />
        <AppText>{t('identifyFlow.backToInput')}</AppText>
      </Pressable>

      <View style={styles.heading}>
        <AppText
          variant="caption"
          strong
          style={{ color: colors.primary }}
        >
          {t('identifyFlow.stepReview')}
        </AppText>

        <AppText variant="display" strong>
          {t('identifyFlow.reviewTitle')}
        </AppText>

        <AppText muted>
          {t('identifyFlow.reviewSubtitle')}
        </AppText>
      </View>

      <View style={styles.sectionHeading}>
        <AppText variant="subtitle" strong>{t('identifyFlow.selectedMedia')}</AppText>

        <AppText variant="caption" muted>
          {t('identifyFlow.selectedCount', { value: assets.length })}
        </AppText>
      </View>

      {assets.length === 0 ? (
        <View
          style={[
            styles.emptyState,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Icon name="alert" color={colors.textMuted} size={28} />

          <AppText strong>{t('identifyFlow.noMediaReceived')}</AppText>

          <AppText variant="caption" muted>
            {t('identifyFlow.returnToInput')}
          </AppText>
        </View>
      ) : (
        <View style={styles.mediaList}>
          {assets.map((asset, index) => (
            <View
              key={`${asset.uri}-${index}`}
              style={[
                styles.mediaCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {asset.type === 'video' ? (
                <View
                  style={[
                    styles.videoPreview,
                    { backgroundColor: colors.surfaceRaised },
                  ]}
                >
                  <Icon name="camera" color={colors.primary} size={30} />

                  <AppText strong>{t('identifyFlow.videoSelected')}</AppText>

                  <AppText variant="caption" muted>
                    {asset.fileName ?? t('identifyFlow.selectedVideo')}
                  </AppText>
                </View>
              ) : (
                <Image
                  source={{ uri: asset.uri }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                  accessibilityLabel={t('identifyFlow.reviewImageAccessibilityLabel', { value: index + 1 })}
                />
              )}

              <View style={styles.mediaDetails}>
                <AppText strong>
                  {asset.type === 'video'
                    ? t('identifyFlow.videoInput')
                    : t('identifyFlow.imageLabel', { value: index + 1 })}
                </AppText>

                <AppText variant="caption" muted>
                  {asset.width && asset.height
                    ? `${asset.width} × ${asset.height}`
                    : asset.fileName ?? t('identifyFlow.selectedMedia')}
                </AppText>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('identifyFlow.removeSelectedItem', { value: index + 1 })}
                  onPress={() =>
                    setAssets((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                  style={styles.removeMediaButton}
                >
                  <AppText
                    variant="caption"
                    strong
                    style={{ color: colors.danger }}
                  >
                    {t('identifyFlow.remove')}
                  </AppText>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}

      <View
        style={[
          styles.notice,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Icon name="identify" color={colors.primary} size={22} />

        <View style={styles.noticeText}>
          <AppText strong>{t('identifyFlow.readyNextTitle')}</AppText>

          <AppText variant="caption" muted>{t('identifyFlow.mlNotConnected')}</AppText>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  heading: {
    gap: spacing.sm,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mediaList: {
    gap: spacing.md,
  },
  mediaCard: {
    borderWidth: 1,
    borderRadius: radius.large,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 240,
  },
  videoPreview: {
    minHeight: 180,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  mediaDetails: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  removeMediaButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.medium,
  },  emptyState: {
    borderWidth: 1,
    borderRadius: radius.large,
    padding: spacing.xl,
    alignItems: 'center',
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
    gap: spacing.xs,
  },
});