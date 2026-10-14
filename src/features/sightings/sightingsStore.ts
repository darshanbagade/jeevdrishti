import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type SightingSource = 'field' | 'camera' | 'photo-upload' | 'cctv' | 'other';
export type SightingZone = 'core' | 'buffer' | 'unknown';
export type SightingLocationSource =
  | 'manual-entry'
  | 'photo-exif'
  | 'device-gps-after-capture'
  | 'unknown';

export type SightingRecord = {
  id: string;
  animalId: string;
  observedAt: string;
  createdAt: string;
  latitude: number | null;
  longitude: number | null;
  accuracyMeters: number | null;
  locationSource: SightingLocationSource;
  source: SightingSource;
  zone: SightingZone;
  notes: string;
  reviewStatus: 'unreviewed' | 'verified';
};

export type NewSighting = Omit<
  SightingRecord,
  'id' | 'createdAt' | 'reviewStatus'
>;

type SightingsState = {
  sightings: SightingRecord[];
  addSighting: (input: NewSighting) => string;
  setReviewStatus: (
    id: string,
    status: SightingRecord['reviewStatus'],
  ) => void;
};

export const useSightingsStore = create<SightingsState>()(
  persist(
    (set) => ({
      sightings: [],

      addSighting: (input) => {
        const id = `sighting-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const record: SightingRecord = {
          ...input,
          id,
          createdAt: new Date().toISOString(),
          reviewStatus: 'unreviewed',
        };

        set((state) => ({
          sightings: [record, ...state.sightings],
        }));

        return id;
      },

      setReviewStatus: (id, status) =>
        set((state) => ({
          sightings: state.sightings.map((sighting) =>
            sighting.id === id
              ? { ...sighting, reviewStatus: status }
              : sighting,
          ),
        })),
    }),
    {
      name: 'jeevdrishti-sightings-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);