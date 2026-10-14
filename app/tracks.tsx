import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { AnimalThumb } from '@/components/ui/AnimalThumb';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { animalRepository } from '@/features/animals/repository';
import type { AnimalRecord } from '@/features/animals/types';
import { getAnimalCopy, formatLastSeen } from '@/features/animals/labels';
import { spacing, useTheme } from '@/theme';

export default function TracksScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const language = (i18n.resolvedLanguage ?? i18n.language).split('-')[0];
  const animalCopy = getAnimalCopy(language);
  const uiCopy = language === 'hi'
    ? {
        title: 'पशु ट्रैकिंग',
        subtitle: 'नक्शे पर देखे जाने के स्थान देखने के लिए एक पशु चुनें।',
        note: 'नक्शे पर दिखाए गए स्थान उदाहरण के लिए हैं, वास्तविक क्षेत्रीय निरीक्षण नहीं।',
        loading: 'पशुओं की जानकारी लोड हो रही है...',
        error: 'पशुओं की जानकारी लोड नहीं हो सकी।',
        retry: 'फिर से प्रयास करें',
        empty: 'कोई पशु रिकॉर्ड उपलब्ध नहीं है।',
      }
    : language === 'mr'
      ? {
          title: 'प्राणी ट्रॅकिंग',
          subtitle: 'दर्शनस्थळांचा नकाशा पाहण्यासाठी प्राणी निवडा.',
          note: 'नकाशावरील ठिकाणे केवळ प्रातिनिधिक आहेत; ती प्रत्यक्ष क्षेत्रीय नोंदी नाहीत.',
          loading: 'प्राण्यांची माहिती लोड होत आहे...',
          error: 'प्राण्यांची माहिती लोड करता आली नाही.',
          retry: 'पुन्हा प्रयत्न करा',
          empty: 'प्राण्यांची नोंद उपलब्ध नाही.',
        }
      : {
          title: 'Animal tracking',
          subtitle: 'Choose an animal to view its sighting map.',
          note: 'Map locations are illustrative demo points, not verified field sightings.',
          loading: 'Loading animals...',
          error: 'Unable to load animal records.',
          retry: 'Try again',
          empty: 'No animal records are available.',
        };

  const [animals, setAnimals] = useState<AnimalRecord[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');

  const loadAnimals = useCallback(async () => {
    setLoadState('loading');
    try {
      const records = await animalRepository.listAnimals();
      setAnimals(records);
      setLoadState('ready');
    } catch {
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadAnimals();
    }, 0);

    return () => clearTimeout(timeout);
  }, [loadAnimals]);

  return (
    <ScreenContainer stripes style={styles.screen}>
      <View style={styles.header}>
        <IconButton name="back" label={t('common.back', { defaultValue: 'Back' })} onPress={() => router.back()} />
        <View style={styles.heading}>
          <AppText variant="title" strong>{uiCopy.title}</AppText>
          <AppText variant="caption" muted>{uiCopy.subtitle}</AppText>
        </View>
      </View>

      <Card padding={spacing.md}>
        <View style={styles.noteHeader}>
          <Icon name="location" color={colors.primary} size={19} />
          <AppText variant="subtitle" strong>{t('tracking.demoTitle', { defaultValue: 'Illustrative demo locations' })}</AppText>
        </View>
        <AppText muted>{uiCopy.note}</AppText>
      </Card>

      {loadState === 'loading' ? (
        <AppText muted>{uiCopy.loading}</AppText>
      ) : loadState === 'error' ? (
        <Card padding={spacing.md}>
          <AppText>{uiCopy.error}</AppText>
          <Button variant="ghost" onPress={() => void loadAnimals()}>{uiCopy.retry}</Button>
        </Card>
      ) : animals.length === 0 ? (
        <AppText muted>{uiCopy.empty}</AppText>
      ) : (
        <View style={styles.animalList}>
          {animals.map((animal) => (
            <Card
              key={animal.id}
              padding={spacing.md}
              onPress={() => router.push({ pathname: '/tracks/[id]', params: { id: animal.id } } as never)}
              accessibilityLabel={`${animal.id}, ${animal.species}, tracking map`}
            >
              <View style={styles.animalRow}>
                <AnimalThumb size={76} />
                <View style={styles.animalDetails}>
                  <AppText variant="subtitle" strong>{animal.id}</AppText>
                  {animal.displayName ? <AppText muted>{animal.displayName}</AppText> : null}
                  <AppText>{animal.species === 'Tiger' ? animalCopy.tiger : animalCopy.leopard}</AppText>
                  <AppText variant="caption" muted>
                    {animal.zone === 'core' ? animalCopy.core : animalCopy.buffer} {' | '}{formatLastSeen(animal.lastSeenDaysAgo, animalCopy)}
                  </AppText>
                  <AppText variant="caption" muted>
                    {animal.sightings} {' | '}{animalCopy.sightings}
                  </AppText>
                </View>
                <Icon name="forward" color={colors.primary} size={21} />
              </View>
              <View style={[styles.openMapRow, { borderTopColor: colors.border }]}>
                <Icon name="tracks" color={colors.primary} size={17} />
                <AppText strong style={{ color: colors.primary }}>{t('tracking.openMap')}</AppText>
              </View>
            </Card>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { paddingBottom: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  heading: { flex: 1, minWidth: 0, gap: spacing.xxs },
  noteHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  animalList: { gap: spacing.md },
  animalRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  animalDetails: { flex: 1, minWidth: 0, gap: spacing.xxs },
  openMapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
});