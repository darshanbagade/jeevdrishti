import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { animalRepository } from '@/features/animals/repository';
import type { AnimalRecord } from '@/features/animals/types';
import {
  useSightingsStore,
  type SightingSource,
  type SightingZone,
} from '@/features/sightings/sightingsStore';
import { radius, spacing, useTheme } from '@/theme';

const sourceOptions: { value: SightingSource; label: string }[] = [
  { value: 'field', label: 'Field' },
  { value: 'camera', label: 'Camera trap' },
  { value: 'cctv', label: 'CCTV' },
  { value: 'photo-upload', label: 'Photo upload' },
  { value: 'other', label: 'Other' },
];

const zoneOptions: { value: SightingZone; label: string }[] = [
  { value: 'core', label: 'Core zone' },
  { value: 'buffer', label: 'Buffer zone' },
  { value: 'unknown', label: 'Unknown zone' },
];

function localDateTimeInput(date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function SightingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const sightings = useSightingsStore((state) => state.sightings);
  const addSighting = useSightingsStore((state) => state.addSighting);

  const [animals, setAnimals] = useState<AnimalRecord[]>([]);
  const [animalId, setAnimalId] = useState('T-003');
  const [observedAt, setObservedAt] = useState(localDateTimeInput);
  const [latitudeText, setLatitudeText] = useState('');
  const [longitudeText, setLongitudeText] = useState('');
  const [notes, setNotes] = useState('');
  const [source, setSource] = useState<SightingSource>('field');
  const [zone, setZone] = useState<SightingZone>('unknown');

  useEffect(() => {
    let active = true;

    void animalRepository.listAnimals()
      .then((records) => {
        if (active) {
          setAnimals(records.filter((animal) => animal.status === 'active'));
        }
      })
      .catch(() => {
        if (active) setAnimals([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const animalOptions = [
    ...animals.map((animal) => animal.id),
    'UNKNOWN',
  ].filter((id, index, all) => all.indexOf(id) === index);

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.surface,
      color: colors.text,
      borderColor: colors.border,
    },
  ];

  const saveSighting = () => {
    const hasLatitude = latitudeText.trim().length > 0;
    const hasLongitude = longitudeText.trim().length > 0;

    if (hasLatitude !== hasLongitude) {
      Alert.alert(
        'Incomplete coordinates',
        'Enter both latitude and longitude, or leave both empty.',
      );
      return;
    }

    let latitude: number | null = null;
    let longitude: number | null = null;

    if (hasLatitude && hasLongitude) {
      latitude = Number(latitudeText);
      longitude = Number(longitudeText);

      if (
        !Number.isFinite(latitude) ||
        latitude < -90 ||
        latitude > 90 ||
        !Number.isFinite(longitude) ||
        longitude < -180 ||
        longitude > 180
      ) {
        Alert.alert(
          'Invalid coordinates',
          'Latitude must be between -90 and 90; longitude between -180 and 180.',
        );
        return;
      }
    }

    const observedDate = new Date(observedAt);
    if (!Number.isFinite(observedDate.getTime())) {
      Alert.alert(
        'Invalid date/time',
        'Enter a valid date/time, for example 2026-10-14T17:30.',
      );
      return;
    }

    addSighting({
      animalId: animalId.trim() || 'UNKNOWN',
      observedAt: observedDate.toISOString(),
      latitude,
      longitude,
      accuracyMeters: null,
      locationSource: latitude === null ? 'unknown' : 'manual-entry',
      source,
      zone,
      notes: notes.trim(),
    });

    setLatitudeText('');
    setLongitudeText('');
    setNotes('');
    setObservedAt(localDateTimeInput());

    Alert.alert(
      'Sighting saved',
      'The record is saved on this device. Server sync is not connected yet.',
    );
  };

  return (
    <ScreenContainer scroll={false} stripes style={styles.page}>
      <View style={styles.header}>
        <IconButton
          name="back"
          label="Back"
          onPress={() => router.back()}
        />
        <View style={styles.heading}>
          <AppText variant="title" strong>Sightings</AppText>
          <AppText variant="caption" muted>
            Create and view locally saved field records
          </AppText>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Card padding={spacing.md}>
          <View style={styles.sectionTitle}>
            <Icon name="location" color={colors.primary} size={20} />
            <AppText variant="subtitle" strong>Add a sighting</AppText>
          </View>

          <AppText strong>Animal ID</AppText>
          <View style={styles.choiceWrap}>
            {animalOptions.map((id) => (
              <Pressable
                key={id}
                accessibilityRole="button"
                accessibilityState={{ selected: animalId === id }}
                onPress={() => setAnimalId(id)}
                style={[
                  styles.choice,
                  {
                    backgroundColor: animalId === id
                      ? colors.surfaceRaised
                      : colors.surface,
                    borderColor: animalId === id
                      ? colors.primary
                      : colors.border,
                  },
                ]}
              >
                <AppText strong style={{ color: animalId === id ? colors.primary : colors.text }}>
                  {id === 'UNKNOWN' ? 'Unknown animal' : id}
                </AppText>
              </Pressable>
            ))}
          </View>

          <AppText strong>Observed date and time</AppText>
          <TextInput
            accessibilityLabel="Observed date and time"
            value={observedAt}
            onChangeText={setObservedAt}
            placeholder="YYYY-MM-DDTHH:mm"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            style={inputStyle}
          />
          <AppText variant="caption" muted>
            Local time format, for example 2026-10-14T17:30.
          </AppText>

          <AppText strong>Location coordinates (optional)</AppText>
          <View style={styles.coordinateRow}>
            <TextInput
              accessibilityLabel="Latitude"
              value={latitudeText}
              onChangeText={setLatitudeText}
              placeholder="Latitude"
              keyboardType="decimal-pad"
              placeholderTextColor={colors.textMuted}
              style={[inputStyle, styles.coordinateInput]}
            />
            <TextInput
              accessibilityLabel="Longitude"
              value={longitudeText}
              onChangeText={setLongitudeText}
              placeholder="Longitude"
              keyboardType="decimal-pad"
              placeholderTextColor={colors.textMuted}
              style={[inputStyle, styles.coordinateInput]}
            />
          </View>
          <AppText variant="caption" muted>
            Coordinates entered here are marked as manual. Photo GPS import will be connected separately.
          </AppText>

          <AppText strong>Zone</AppText>
          <View style={styles.choiceWrap}>
            {zoneOptions.map((option) => (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected: zone === option.value }}
                onPress={() => setZone(option.value)}
                style={[
                  styles.choice,
                  {
                    backgroundColor: zone === option.value
                      ? colors.surfaceRaised
                      : colors.surface,
                    borderColor: zone === option.value
                      ? colors.primary
                      : colors.border,
                  },
                ]}
              >
                <AppText strong style={{ color: zone === option.value ? colors.primary : colors.text }}>
                  {option.label}
                </AppText>
              </Pressable>
            ))}
          </View>

          <AppText strong>Source</AppText>
          <View style={styles.choiceWrap}>
            {sourceOptions.map((option) => (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected: source === option.value }}
                onPress={() => setSource(option.value)}
                style={[
                  styles.choice,
                  {
                    backgroundColor: source === option.value
                      ? colors.surfaceRaised
                      : colors.surface,
                    borderColor: source === option.value
                      ? colors.primary
                      : colors.border,
                  },
                ]}
              >
                <AppText strong style={{ color: source === option.value ? colors.primary : colors.text }}>
                  {option.label}
                </AppText>
              </Pressable>
            ))}
          </View>

          <AppText strong>Notes (optional)</AppText>
          <TextInput
            accessibilityLabel="Sighting notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Describe the observation..."
            placeholderTextColor={colors.textMuted}
            multiline
            textAlignVertical="top"
            style={[inputStyle, styles.notesInput]}
          />

          <Button icon="location" onPress={saveSighting}>
            Save sighting
          </Button>
        </Card>

        <View style={styles.listHeading}>
          <AppText variant="subtitle" strong>Saved sightings</AppText>
          <AppText variant="caption" muted>{sightings.length} on this device</AppText>
        </View>

        {sightings.length === 0 ? (
          <Card padding={spacing.md}>
            <AppText muted>No sightings saved yet. Add your first record above.</AppText>
          </Card>
        ) : (
          sightings.map((sighting) => (
            <Card key={sighting.id} padding={spacing.md}>
              <View style={styles.recordHeading}>
                <View style={styles.recordTitle}>
                  <AppText variant="subtitle" strong>{sighting.animalId}</AppText>
                  <AppText variant="caption" muted>
                    {new Date(sighting.observedAt).toLocaleString()}
                  </AppText>
                </View>
                <AppText variant="caption" strong style={{ color: colors.primary }}>
                  {sighting.reviewStatus === 'verified' ? 'VERIFIED' : 'UNREVIEWED'}
                </AppText>
              </View>

              <AppText variant="caption" muted>
                {sighting.latitude !== null && sighting.longitude !== null
                  ? `${sighting.latitude.toFixed(6)}, ${sighting.longitude.toFixed(6)}`
                  : 'Location not recorded'}
                {' · '}
                {sighting.zone === 'unknown' ? 'Zone unknown' : `${sighting.zone} zone`}
              </AppText>

              <AppText variant="caption" muted>
                Source: {sourceOptions.find((option) => option.value === sighting.source)?.label ?? sighting.source}
              </AppText>

              {sighting.notes ? <AppText>{sighting.notes}</AppText> : null}
            </Card>
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingBottom: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  heading: { flex: 1, gap: spacing.xxs },
  scroll: { flex: 1 },
  content: { gap: spacing.md, paddingBottom: spacing.xl },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  choiceWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  choice: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderRadius: radius.medium,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  coordinateRow: { flexDirection: 'row', gap: spacing.sm },
  coordinateInput: { flex: 1, minWidth: 0 },
  notesInput: { minHeight: 90 },
  listHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recordHeading: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  recordTitle: { flex: 1, gap: spacing.xxs },
});