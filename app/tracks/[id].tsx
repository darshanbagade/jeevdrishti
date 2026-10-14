import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { WebView } from 'react-native-webview';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { animalRepository } from '@/features/animals/repository';
import type { AnimalRecord } from '@/features/animals/types';
import { radius, spacing, useTheme } from '@/theme';

type DemoSighting = {
  id: string;
  latitude: number;
  longitude: number;
  observedAt: string;
};

// These points are deliberately simulated UI data; they are not field observations.
// Replace them with backend sighting coordinates and timestamps during integration.
const DEMO_SIGHTINGS: Record<string, DemoSighting[]> = {
  'T-003': [
    { id: 'T-003-1', latitude: 20.241, longitude: 79.341, observedAt: '11 Oct 2026 · 07:20' },
    { id: 'T-003-2', latitude: 20.246, longitude: 79.348, observedAt: '12 Oct 2026 · 09:10' },
    { id: 'T-003-3', latitude: 20.253, longitude: 79.355, observedAt: '13 Oct 2026 · 16:40' },
    { id: 'T-003-4', latitude: 20.258, longitude: 79.348, observedAt: '14 Oct 2026 · 06:50' },
  ],
  'T-011': [
    { id: 'T-011-1', latitude: 20.262, longitude: 79.363, observedAt: '11 Oct 2026 · 06:35' },
    { id: 'T-011-2', latitude: 20.256, longitude: 79.357, observedAt: '12 Oct 2026 · 14:05' },
    { id: 'T-011-3', latitude: 20.248, longitude: 79.36, observedAt: '13 Oct 2026 · 11:30' },
    { id: 'T-011-4', latitude: 20.244, longitude: 79.368, observedAt: '14 Oct 2026 · 07:05' },
  ],
  'T-007': [
    { id: 'T-007-1', latitude: 20.234, longitude: 79.355, observedAt: '11 Oct 2026 · 08:00' },
    { id: 'T-007-2', latitude: 20.239, longitude: 79.364, observedAt: '12 Oct 2026 · 10:45' },
    { id: 'T-007-3', latitude: 20.248, longitude: 79.369, observedAt: '13 Oct 2026 · 15:25' },
    { id: 'T-007-4', latitude: 20.253, longitude: 79.361, observedAt: '14 Oct 2026 · 06:15' },
  ],
  'T-005': [
    { id: 'T-005-1', latitude: 20.263, longitude: 79.342, observedAt: '11 Oct 2026 · 07:50' },
    { id: 'T-005-2', latitude: 20.258, longitude: 79.336, observedAt: '12 Oct 2026 · 12:10' },
    { id: 'T-005-3', latitude: 20.251, longitude: 79.341, observedAt: '13 Oct 2026 · 17:00' },
    { id: 'T-005-4', latitude: 20.245, longitude: 79.347, observedAt: '14 Oct 2026 · 06:30' },
  ],
  'T-014': [
    { id: 'T-014-1', latitude: 20.229, longitude: 79.349, observedAt: '11 Oct 2026 · 09:15' },
    { id: 'T-014-2', latitude: 20.235, longitude: 79.343, observedAt: '12 Oct 2026 · 13:25' },
    { id: 'T-014-3', latitude: 20.241, longitude: 79.347, observedAt: '13 Oct 2026 · 10:40' },
    { id: 'T-014-4', latitude: 20.246, longitude: 79.352, observedAt: '14 Oct 2026 · 07:30' },
  ],
};

function createTrackingMapHtml(sightings: DemoSighting[], animalId: string): string {
  const safeSightings = JSON.stringify(sightings).replace(/</g, '\\u003c');
  const safeAnimalId = JSON.stringify(animalId).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; width: 100%; padding: 0; margin: 0; background: #edf0e8; }
    body { overflow: hidden; font-family: sans-serif; }
    .leaflet-container { height: 100%; width: 100%; background: #edf0e8; }
    .leaflet-control-attribution { font-size: 10px !important; }
    #map-title { position: absolute; z-index: 800; top: 8px; left: 8px; right: 8px; padding: 8px 10px; border-radius: 8px; background: rgba(255,255,255,.94); color: #173b28; box-shadow: 0 1px 6px #0003; font: 13px sans-serif; pointer-events: none; }
    #map-title small { display: block; margin-top: 3px; color: #46534a; font-size: 10px; }
    #map-error { display: none; position: absolute; z-index: 1000; top: 62px; left: 12px; right: 12px; padding: 12px; border-radius: 8px; background: #fff; color: #222; font: 14px sans-serif; box-shadow: 0 1px 6px #0003; }
  </style>
</head>
<body>
  <div id="map"></div>
  <div id="map-title"><strong>Tadoba-Andhari Tiger Reserve</strong><small>Illustrative tracking demo â€” not real sightings</small></div>
  <div id="map-error">The map library could not load. Check your internet connection and reopen this screen.</div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" onerror="document.getElementById('map-error').style.display='block'"></script>
  <script>
    (function () {
      if (typeof L === 'undefined') return;
      const points = ${safeSightings};
      const animal = ${safeAnimalId};
      // Tadoba-area overview; sample sightings below are simulated demo coordinates.
      const tadobaCenter = [20.245, 79.35];
      const map = L.map('map', { zoomControl: true, attributionControl: true }).setView(tadobaCenter, 12);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
      }).addTo(map);
      const coordinates = points.map(function (point) { return [point.latitude, point.longitude]; });
      if (coordinates.length > 1) {
        L.polyline(coordinates, { color: '#237647', weight: 4, opacity: 0.9 }).addTo(map);
      }
      points.forEach(function (point, index) {
        const marker = L.marker([point.latitude, point.longitude]).addTo(map);
        const time = String(point.observedAt).replace(/[&<>]/g, function (character) {
          return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[character];
        });
        marker.bindPopup('<strong>' + animal + '</strong><br/>Sighting ' + (index + 1) + '<br/>' + time);
      });
      if (coordinates.length > 1) {
        map.fitBounds(coordinates, { padding: [32, 66], maxZoom: 13 });
      }
      setTimeout(function () { map.invalidateSize(); }, 250);
    })();
  </script>
</body>
</html>`;
}

export default function TracksScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const requestedAnimalId = typeof params.id === 'string' ? params.id : 'T-003';
  const [animals, setAnimals] = useState<AnimalRecord[]>([]);
  const [selectedAnimalId, setSelectedAnimalId] = useState(requestedAnimalId);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let isMounted = true;

    void animalRepository.listAnimals().then((records) => {
      if (!isMounted) return;
      setAnimals(records);
      setSelectedAnimalId((current) =>
        records.some((animal) => animal.id === current)
          ? current
          : records[0]?.id ?? '',
      );      setLoadState('ready');
    }).catch(() => {
      if (isMounted) setLoadState('error');
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedAnimal = animals.find((animal) => animal.id === selectedAnimalId);
  const sightings = useMemo(
    () => (selectedAnimalId ? DEMO_SIGHTINGS[selectedAnimalId] ?? [] : []),
    [selectedAnimalId],
  );

  return (
    <ScreenContainer stripes style={styles.screen}>
      <View style={styles.header}>
        <IconButton name="back" label={t('common.back', { defaultValue: 'Back' })} onPress={() => router.back()} />
        <View style={styles.heading}>
          <AppText variant="title" strong>{t('tracking.title')}</AppText>
          <AppText variant="caption" muted>{t('tracking.subtitle')}</AppText>
        </View>
      </View>

      <Card padding={spacing.md}>
        <View style={styles.noticeHeading}>
          <AppText strong>{t('tracking.dataTitle')}</AppText>
        </View>
        <AppText variant="caption" muted>{t('tracking.dataWarning')}</AppText>
      </Card>

      {loadState === 'loading' ? (
        <AppText muted>{t('tracking.loading')}</AppText>
      ) : loadState === 'error' ? (
        <AppText muted>{t('tracking.loadError')}</AppText>
      ) : animals.length === 0 ? (
        <AppText muted>{t('tracking.noAnimals')}</AppText>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('tracking.openInteractiveMap', { defaultValue: 'Open interactive map' })}
        onPress={() => setMapModalVisible(true)}
        style={[styles.mapShell, { borderColor: colors.border }]}
      >
        <WebView
          key={`${selectedAnimalId}-preview`}
          originWhitelist={['*']}
          source={{ html: createTrackingMapHtml(sightings, selectedAnimalId) }}
          javaScriptEnabled
          domStorageEnabled
          scrollEnabled={false}
          pointerEvents="none"
          style={styles.map}
        />
        <View
          pointerEvents="none"
          style={[styles.mapPreviewHint, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <AppText strong>{t('tracking.openInteractiveMap', { defaultValue: 'Tap to open interactive map' })}</AppText>
        </View>
      </Pressable>

      <AppText variant="caption" muted>Â© OpenStreetMap contributors Â· Illustrative demo locations</AppText>

      <Modal
        visible={mapModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setMapModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalRoot, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
          >
            <IconButton
              name="close"
              label={t('common.close', { defaultValue: 'Close map' })}
              onPress={() => setMapModalVisible(false)}
            />
            <View style={styles.modalHeading}>
              <AppText variant="subtitle" strong>{selectedAnimalId} Â· {selectedAnimal?.species ?? 'Animal'}</AppText>
              <AppText variant="caption" muted>{t('tracking.mapGestureHelp', { defaultValue: 'Drag to move Â· Pinch to zoom' })}</AppText>
            </View>
          </View>
          <WebView
            key={`${selectedAnimalId}-fullscreen`}
            originWhitelist={['*']}
            source={{ html: createTrackingMapHtml(sightings, selectedAnimalId) }}
            javaScriptEnabled
            domStorageEnabled
            scrollEnabled={false}
            style={styles.modalMap}
          />
          <View style={[styles.modalFooter, { backgroundColor: colors.surface, borderTopColor: colors.border }]}
          >
            <AppText variant="caption" muted>
              {t('tracking.demoTitle', { defaultValue: 'Illustrative demo locations' })} Â· {t('tracking.openMapNotice', { defaultValue: 'Coordinates are simulated, not verified sightings.' })}
            </AppText>
          </View>
        </SafeAreaView>
      </Modal>
      {selectedAnimal && sightings.length === 0 ? (
        <Card padding={spacing.md}>
          <AppText strong>{selectedAnimal.id}</AppText>
          <AppText variant="caption" muted>
            {t('tracking.noSightingCoordinates', { defaultValue: 'No sample sighting coordinates are available for this animal yet.' })}
          </AppText>
        </Card>
      ) : null}
      {selectedAnimal && sightings.length > 0 ? (
        <>
          <View style={styles.timelineHeader}>
            <View style={styles.timelineTitle}>
              <AppText variant="subtitle" strong>{t('tracking.sightings')}</AppText>
              <AppText variant="caption" muted>{selectedAnimal.id} · {selectedAnimal.species}</AppText>
            </View>
            <Button variant="ghost" onPress={() => router.push({ pathname: '/animal/[id]', params: { id: selectedAnimal.id } })}>
              {t('tracking.openProfile')}
            </Button>
          </View>
          <Card padding={spacing.md}>
            {sightings.map((sighting, index) => (
              <View key={sighting.id} style={[styles.sightingRow, index < sightings.length - 1 && styles.sightingRowDivider, { borderBottomColor: colors.border }]}>
                <View style={[styles.pointNumber, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                  <AppText strong style={{ color: colors.primaryStrong }}>{index + 1}</AppText>
                </View>
                <View style={styles.sightingDetails}>
                  <AppText strong>{t('tracking.point')} {index + 1}</AppText>
                                    <AppText variant="caption" muted>{sighting.observedAt}</AppText>
                  <AppText variant="caption" muted>
                    {sighting.latitude.toFixed(5)}, {sighting.longitude.toFixed(5)}
                  </AppText>
                </View>
              </View>
            ))}
          </Card>
        </>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { paddingBottom: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  heading: { flex: 1, minWidth: 0, gap: spacing.xxs },
  noticeHeading: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  selectorSection: { gap: spacing.sm },
  selectorRow: { flexDirection: 'row', gap: spacing.sm, paddingRight: spacing.md },
  animalPill: {
    minHeight: 42,
    minWidth: 76,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapShell: {
    height: 480,
    borderWidth: 1,
    borderRadius: radius.large,
    overflow: 'hidden',
  },
  map: { flex: 1 },
  mapPreviewHint: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.medium,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    opacity: 0.97,
  },
  modalRoot: { flex: 1 },
  modalHeader: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalHeading: { flex: 1, minWidth: 0, gap: spacing.xxs },
  modalMap: { flex: 1 },
  modalFooter: {
    padding: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },  timelineHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.sm },
  timelineTitle: { gap: spacing.xxs, flex: 1 },
  sightingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  sightingRowDivider: { borderBottomWidth: StyleSheet.hairlineWidth },
  pointNumber: { width: 34, height: 34, borderWidth: 1, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  sightingDetails: { flex: 1, gap: spacing.xxs },
});