
import {
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { useIdentifySelectionStore } from '@/features/identification/selectionStore';
import { spacing, radius, useTheme } from '@/theme';



export default function IdentifyReviewScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const assets = useIdentifySelectionStore((state) => state.assets);

  return (
    <ScreenContainer stripes style={styles.page}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Icon name="back" color={colors.text} size={20} />
        <AppText>Back to input</AppText>
      </Pressable>

      <View style={styles.heading}>
        <AppText
          variant="caption"
          strong
          style={{ color: colors.primary }}
        >
          STEP 2 OF 5
        </AppText>

        <AppText variant="display" strong>
          Review your input
        </AppText>

        <AppText muted>
          Check your selected media before proceeding to identification.
        </AppText>
      </View>

      <View style={styles.sectionHeading}>
        <AppText variant="subtitle" strong>
          Selected media
        </AppText>

        <AppText variant="caption" muted>
          {assets.length} selected
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

          <AppText strong>No media received</AppText>

          <AppText variant="caption" muted>
            Return to the previous screen and select your input again.
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

                  <AppText strong>Video selected</AppText>

                  <AppText variant="caption" muted>
                    {asset.fileName ?? 'Selected video'}
                  </AppText>
                </View>
              ) : (
                <Image
                  source={{ uri: asset.uri }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                  accessibilityLabel={`Review image ${index + 1}`}
                />
              )}

              <View style={styles.mediaDetails}>
                <AppText strong>
                  {asset.type === 'video'
                    ? 'Video input'
                    : `Image ${index + 1}`}
                </AppText>

                <AppText variant="caption" muted>
                  {asset.width && asset.height
                    ? `${asset.width} × ${asset.height}`
                    : asset.fileName ?? 'Selected media'}
                </AppText>
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
          <AppText strong>Ready for the next stage</AppText>

          <AppText variant="caption" muted>
            The ML identification service is not connected yet. This
            screen reviews your input and does not generate real animal
            matches.
          </AppText>
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
  emptyState: {
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