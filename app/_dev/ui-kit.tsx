import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { StatCard } from '@/components/ui/StatCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useTheme, useThemeModeStore, spacing } from '@/theme';

export default function UIKitScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const setMode = useThemeModeStore((state) => state.setMode);

  if (!__DEV__) return null;

  return (
    <ScreenContainer stripes style={styles.page}>
      <AppText variant="display" strong>{t('ui.title')}</AppText>
      <AppText muted>{t('ui.subtitle')}</AppText>

      <SectionHeader title="Appearance" />
      <View style={styles.row}>
        <Button onPress={() => setMode('dark')}>{t('common.dark')}</Button>
        <Button variant="ghost" onPress={() => setMode('light')}>{t('common.light')}</Button>
      </View>
      <Button variant="ghost" onPress={() => setMode('system')}>{t('common.system')}</Button>

      <SectionHeader title="Language" />
      <View style={styles.row}>
        <Button variant="ghost" onPress={() => void i18n.changeLanguage('en')}>English</Button>
        <Button variant="ghost" onPress={() => void i18n.changeLanguage('hi')}>??????</Button>
        <Button variant="ghost" onPress={() => void i18n.changeLanguage('mr')}>?????</Button>
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
  page: { paddingBottom: spacing.xl },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm },
  stat: { flex: 1, minWidth: 130 },
  swatch: { height: 8, width: '40%', borderRadius: 999 },
});
