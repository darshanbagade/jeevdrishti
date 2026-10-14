import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AnimalRecord } from '@/features/animals/types';

export type IdentificationSource = 'demo' | 'ml';

export type IdentificationReviewStatus =
  | 'not-reviewed'
  | 'pending-review'
  | 'confirmed'
  | 'rejected';

export type IdentificationHistoryCandidate = {
  rank: number;
  animal: AnimalRecord;
  similarityScore: number;
};

export type IdentificationHistoryEntry = {
  id: string;
  createdAt: string;
  source: IdentificationSource;
  reviewStatus: IdentificationReviewStatus;
  mediaCount: number;
  mediaTypes: string[];
  candidates: IdentificationHistoryCandidate[];
};

type IdentificationHistoryState = {
  entries: IdentificationHistoryEntry[];
  addEntry: (entry: IdentificationHistoryEntry) => void;
  setReviewStatus: (
    id: string,
    status: IdentificationReviewStatus,
  ) => void;
};

export const useIdentifyHistoryStore =
  create<IdentificationHistoryState>()(
    persist(
      (set) => ({
        entries: [],

        addEntry: (entry) =>
          set((state) => {
            if (state.entries.some((item) => item.id === entry.id)) {
              return state;
            }

            return {
              entries: [entry, ...state.entries],
            };
          }),

        setReviewStatus: (id, status) =>
          set((state) => ({
            entries: state.entries.map((entry) =>
              entry.id === id
                ? { ...entry, reviewStatus: status }
                : entry,
            ),
          })),
      }),
      {
        name: 'jeevdrishti-identification-history-v1',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  );