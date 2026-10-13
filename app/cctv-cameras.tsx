import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { spacing, radius, useTheme } from '@/theme';

export default function CctvCamerasScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Illustrative records only. These are not real forest cameras.
  const cameras = [
    {
      id: 'DEMO-CAM-01',
      name: t('identifyFlow.cctvCameraOne'),
      location: t('identifyFlow.cctvLocationA'),
    },
    {
      id: 'DEMO-CAM-02',
      name: t('identifyFlow.cctvCameraTwo'),
      location: t('identifyFlow.cctvLocationB'),
    },
  ];

  const selectedCamera = cameras.find((camera) => camera.id === selectedId);

  return (
    <ScreenContainer stripes style={styles.page}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Icon name="back" color={colors.text} size={20} />
        <AppText>{t('identifyFlow.back')}</AppText>
      </Pressable>

      <View style={styles.heading}>
        <AppText
          variant="caption"
          strong
          style={{ color: colors.primary }}
        >
          {t('identifyFlow.cctvDemoBadge')}
        </AppText>
        <AppText variant="display" strong>
          {t('identifyFlow.cctvTitle')}
        </AppText>
        <AppText muted>
          {t('identifyFlow.cctvSubtitle')}
        </AppText>
      </View>

      <View
        style={[
          styles.notice,
          {
            backgroundColor: colors.surfaceRaised,
            borderColor: colors.border,
          },
        ]}
      >
        <Icon name="alert" color={colors.textMuted} size={21} />
        <View style={styles.noticeText}>
          <AppText variant="caption" strong>
            {t('identifyFlow.cctvDemoBanner')}
          </AppText>
        </View>
      </View>

      <View style={styles.cameraList}>
        {cameras.map((camera) => {
          const isSelected = camera.id === selectedId;

          return (
            <Pressable
              key={camera.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => setSelectedId(camera.id)}
              style={[
                styles.cameraCard,
                {
                  backgroundColor: isSelected
                    ? colors.surfaceRaised
                    : colors.surface,
                  borderColor: isSelected
                    ? colors.primary
                    : colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.cameraIcon,
                  { backgroundColor: colors.surfaceRaised },
                ]}
              >
                <Icon
                  name={isSelected ? 'check' : 'camera'}
                  color={colors.primary}
                  size={23}
                />
              </View>

              <View style={styles.cameraDetails}>
                <AppText variant="subtitle" strong>
                  {camera.name}
                </AppText>
                <AppText variant="caption" muted>
                  {camera.id}
                </AppText>
                <AppText variant="caption" muted>
                  {t('identifyFlow.cctvSampleLocation')}: {camera.location}
                </AppText>
              </View>

              <View
                style={[
                  styles.demoBadge,
                  { backgroundColor: colors.primaryStrong },
                ]}
              >
                <AppText
                  variant="caption"
                  strong
                  style={{ color: colors.onStrong }}
                >
                  {t('identifyFlow.cctvDemoBadge')}
                </AppText>
              </View>
            </Pressable>
          );
        })}
      </View>

      {selectedCamera ? (
        <View
          style={[
            styles.statusPanel,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <AppText variant="subtitle" strong>
            {t('identifyFlow.cctvSelectedCamera')}
          </AppText>
          <AppText strong>{selectedCamera.name}</AppText>
          <AppText variant="caption" muted>
            {t('identifyFlow.cctvConnectionStatus')}: {t('identifyFlow.cctvFeedNotConfigured')}
          </AppText>
          <AppText variant="caption" muted>
            {t('identifyFlow.cctvNoLiveFeed')}
          </AppText>
        </View>
      ) : (
        <View
          style={[
            styles.statusPanel,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Icon name="location" color={colors.textMuted} size={24} />
          <AppText variant="caption" muted>
            {t('identifyFlow.cctvSelectPrompt')}
          </AppText>
        </View>
      )}

      <View
        style={[
          styles.disabledAction,
          {
            backgroundColor: colors.surfaceRaised,
            borderColor: colors.border,
          },
        ]}
      >
        <Icon name="camera" color={colors.textMuted} size={20} />
        <View style={styles.noticeText}>
          <AppText variant="subtitle" strong>
            {t('identifyFlow.cctvCaptureUnavailable')}
          </AppText>
          <AppText variant="caption" muted>
            {t('identifyFlow.cctvCaptureHelp')}
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
  notice: {
    borderWidth: 1,
    borderRadius: radius.large,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  noticeText: {
    flex: 1,
    gap: spacing.xs,
  },
  cameraList: {
    gap: spacing.sm,
  },
  cameraCard: {
    borderWidth: 1,
    borderRadius: radius.large,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cameraIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraDetails: {
    flex: 1,
    gap: spacing.xs,
  },
  demoBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  statusPanel: {
    borderWidth: 1,
    borderRadius: radius.large,
    padding: spacing.md,
    gap: spacing.sm,
  },
  disabledAction: {
    borderWidth: 1,
    borderRadius: radius.large,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    opacity: 0.7,
  },
});