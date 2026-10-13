import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useIdentifySelectionStore } from '@/features/identification/selectionStore';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { spacing, radius, useTheme } from '@/theme';

type CaptureMode = 'photo' | 'video';

export default function IdentifyScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const assets = useIdentifySelectionStore((state) => state.assets);
  const setAssets = useIdentifySelectionStore((state) => state.setAssets);
  const [isBusy, setIsBusy] = useState(false);

  const captureMedia = async (mode: CaptureMode) => {
    try {
      setIsBusy(true);

      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Camera permission required',
          'Allow camera access to capture photos or videos.',
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: mode === 'photo' ? ['images'] : ['videos'],
        quality: 0.8,
        videoMaxDuration: 15,
      });

      if (result.canceled || !result.assets[0]) {
        return;
      }

      const asset = result.assets[0];

      if (
        mode === 'video' ||
        assets.some((item) => item.type === 'video')
      ) {
        setAssets([asset]);
        return;
      }

      if (assets.length >= 5) {
        Alert.alert(
          'Image limit reached',
          'Select up to five images.',
        );
        return;
      }

      setAssets((current) => [...current, asset]);
    } catch (error) {
      Alert.alert(
        'Unable to open camera',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setIsBusy(false);
    }
  };

  const selectFromGallery = async () => {
    try {
      setIsBusy(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsMultipleSelection: true,
        selectionLimit: 5,
        quality: 0.8,
      });

      if (result.canceled || result.assets.length === 0) {
        return;
      }

      const mediaTypes = new Set(
        result.assets.map((asset) => asset.type ?? 'image'),
      );

      if (mediaTypes.size > 1) {
        Alert.alert(
          'Choose one media type',
          'Select images or one video at a time.',
        );
        return;
      }

      if (
        mediaTypes.has('video') &&
        result.assets.length > 1
      ) {
        Alert.alert(
          'Choose one video',
          'Select a single video at a time.',
        );
        return;
      }

      if (
        result.assets.some((asset) => asset.type === 'video') &&
        assets.some((asset) => asset.type === 'image')
      ) {
        Alert.alert(
          'Replace selected images?',
          'Remove the current images before selecting a video.',
        );
        return;
      }

      if (
        result.assets.some((asset) => asset.type === 'image') &&
        assets.some((asset) => asset.type === 'video')
      ) {
        Alert.alert(
          'Replace selected video?',
          'Remove the current video before selecting images.',
        );
        return;
      }

      if (result.assets.length > 5) {
        Alert.alert(
          'Image limit reached',
          'Select up to five images.',
        );
        return;
      }

      setAssets(result.assets);
    } catch (error) {
      Alert.alert(
        'Unable to open gallery',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <ScreenContainer stripes style={styles.page}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Icon name="back" color={colors.text} size={20} />
        <AppText>Back</AppText>
      </Pressable>

      <View style={styles.heading}>
        <AppText
          variant="caption"
          strong
          style={{ color: colors.primary }}
        >
          STEP 1 OF 5
        </AppText>

        <AppText variant="display" strong>
          Identify wildlife
        </AppText>

        <AppText muted>
          Capture a sighting or choose existing media to identify
          an animal.
        </AppText>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          disabled={isBusy}
          onPress={() => void captureMedia('photo')}
          style={[
            styles.action,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            isBusy && styles.disabled,
          ]}
        >
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: colors.surfaceRaised },
            ]}
          >
            <Icon name="camera" color={colors.primary} size={23} />
          </View>

          <View style={styles.actionText}>
            <AppText variant="subtitle" strong>
              Take a photo
            </AppText>
            <AppText variant="caption" muted>
              Capture an animal image
            </AppText>
          </View>

          <Icon
            name="forward"
            color={colors.textMuted}
            size={19}
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          disabled={isBusy}
          onPress={() => void captureMedia('video')}
          style={[
            styles.action,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            isBusy && styles.disabled,
          ]}
        >
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: colors.surfaceRaised },
            ]}
          >
            <Icon name="camera" color={colors.primary} size={23} />
          </View>

          <View style={styles.actionText}>
            <AppText variant="subtitle" strong>
              Record a video
            </AppText>
            <AppText variant="caption" muted>
              Record up to 15 seconds
            </AppText>
          </View>

          <Icon
            name="forward"
            color={colors.textMuted}
            size={19}
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          disabled={isBusy}
          onPress={() => void selectFromGallery()}
          style={[
            styles.action,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            isBusy && styles.disabled,
          ]}
        >
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: colors.surfaceRaised },
            ]}
          >
            <Icon name="image" color={colors.primary} size={23} />
          </View>

          <View style={styles.actionText}>
            <AppText variant="subtitle" strong>
              Choose from gallery
            </AppText>
            <AppText variant="caption" muted>
              Up to five images or one video
            </AppText>
          </View>

          <Icon
            name="forward"
            color={colors.textMuted}
            size={19}
          />
        </Pressable>
      </View>

      <View style={styles.sectionHeading}>
        <AppText variant="subtitle" strong>
          Selected input
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
              borderColor: colors.border,
              backgroundColor: colors.surface,
            },
          ]}
        >
          <Icon name="image" color={colors.textMuted} size={30} />

          <AppText strong>No media selected</AppText>

          <AppText
            variant="caption"
            muted
            style={styles.emptyDescription}
          >
            Your selected photos or video will appear here for review.
          </AppText>
        </View>
      ) : (
        <View style={styles.previewGrid}>
          {assets.map((asset, index) => (
            <View
              key={`${asset.uri}-${index}`}
              style={[
                styles.previewTile,
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
                  <Icon
                    name="camera"
                    color={colors.primary}
                    size={34}
                  />

                  <AppText strong>Video selected</AppText>

                  <AppText variant="caption" muted>
                    {asset.fileName ?? 'Selected video'}
                  </AppText>
                </View>
              ) : (
                <Image
                  source={{ uri: asset.uri }}
                  style={styles.previewImage}
                  resizeMode="cover"
                  accessibilityLabel={`Selected wildlife image ${index + 1}`}
                />
              )}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove selected item ${index + 1}`}
                onPress={() =>
                  setAssets((current) =>
                    current.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                style={styles.removeButton}
              >
                <AppText
                  variant="caption"
                  strong
                  style={{ color: colors.danger }}
                >
                  Remove
                </AppText>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {isBusy && (
        <AppText variant="caption" muted>
          Opening media picker…
        </AppText>
      )}

      <AppText variant="caption" muted>
        Identification and top-five ranking will be connected in the
        next stages.
      </AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Continue to review selected media"
        disabled={isBusy || assets.length === 0}
        onPress={() => router.push('/identify-review')}
        style={[
          styles.continueButton,
          { backgroundColor: colors.primaryStrong },
          (isBusy || assets.length === 0) && styles.disabled,
        ]}
      >
        <AppText strong style={{ color: '#FFFFFF' }}>
          Continue to review
        </AppText>
        <Icon name="forward" color="#FFFFFF" size={20} />
      </Pressable>
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
  actions: {
    gap: spacing.sm,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.large,
    padding: spacing.md,
    gap: spacing.md,
    minHeight: 78,
  },
  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    flex: 1,
    gap: spacing.xxs,
  },
  disabled: {
    opacity: 0.55,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  continueButton: {
    minHeight: 54,
    borderRadius: radius.large,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },  emptyState: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: radius.large,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyDescription: {
    textAlign: 'center',
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  previewTile: {
    width: '48%',
    borderWidth: 1,
    borderRadius: radius.medium,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 140,
  },
  videoPreview: {
    height: 140,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  removeButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
});