import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { setLanguagePreference } from '@/i18n';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { StatCard } from '@/components/ui/StatCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { IconButton } from '@/components/ui/IconButton';
import { useTheme, useThemeModeStore, spacing } from '@/theme';

export default function UIKitScreen() {
  const { t, i18n } = useTranslation();
  const { colors, mode } = useTheme();
  const router = useRouter();
  const currentLanguage = (i18n.resolvedLanguage ?? i18n.language).split('-')[0];
  const setMode = useThemeModeStore((state) => state.setMode);

  if (!__DEV__) return null;

  return (
    <ScreenContainer stripes style={styles.page}>
      <View style={styles.header}>
        <IconButton name="back" label="Back" onPress={() => router.back()} />
        <View style={styles.titleBlock}>
          <AppText variant="subtitle" strong>{t('ui.title')}</AppText>

        </View>
      </View>

      <SectionHeader title="Appearance" />
      <View style={styles.row}>
        <Button
          variant={mode === 'dark' ? 'primary' : 'ghost'}
          onPress={() => setMode('dark')}
        >
          {t('common.dark')}
        </Button>
        <Button
          variant={mode === 'light' ? 'primary' : 'ghost'}
          onPress={() => setMode('light')}
        >
          {t('common.light')}
        </Button>
        <Button
          variant={mode === 'system' ? 'primary' : 'ghost'}
          onPress={() => setMode('system')}
        >
          {t('common.system')}
        </Button>
      </View>

      <SectionHeader title="Language" />
      <View style={styles.row}>
        <Button
          variant={currentLanguage === 'en' ? 'primary' : 'ghost'}
          onPress={() => void setLanguagePreference('en')}
        >
          English
        </Button>
        <Button
          variant={currentLanguage === 'hi' ? 'primary' : 'ghost'}
          onPress={() => void setLanguagePreference('hi')}
        >
          हिन्दी
        </Button>
        <Button
          variant={currentLanguage === 'mr' ? 'primary' : 'ghost'}
          onPress={() => void setLanguagePreference('mr')}
        >
          मराठी
        </Button>
      </View>

      <SectionHeader title="Field overview" subtitle={t('ui.sample')} />
      <View style={styles.row}>
        <View style={styles.stat}><StatCard label={t('dashboard.animals')} value="06" icon="animals" /></View>
        <View style={styles.stat}><StatCard label={t('dashboard.sightings')} value="08" icon="location" /></View>
      </View>

      <SectionHeader title="Status chips" />
      <View style={styles.row}>
        <Chip status="matched" />
        <Chip status="review" />
        <Chip status="unknown" />
      </View>
      <View style={styles.row}>
        <Chip status="queued" />
        <Chip status="synced" />
        <Chip status="offline" />
      </View>

      <Card>
        <AppText variant="subtitle" strong>Theme surface</AppText>
        <AppText muted>Cards and text use shared theme tokens.</AppText>
        <View style={[styles.swatch, { backgroundColor: colors.primary }]} />
      </Card>

      <AppText variant="caption" muted>
        Development preview only. Sample data is illustrative.
      </AppText>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  titleBlock: { flex: 1, gap: spacing.xs },
  page: { paddingBottom: spacing.xl },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm },
  stat: { flex: 1, minWidth: 130 },
  swatch: { height: 8, width: '40%', borderRadius: 999 },
});
