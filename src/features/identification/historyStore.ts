import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AnimalRecord } from '@/features/animals/types';

export type IdentificationSource = 'demo' | 'ml';

export type IdentificationReviewStatus =
  | 'not-reviewed'
  | 'pending-review'
  | 'confirmed'
  | 'rejected'
  | 'unresolved';

export type IdentificationCandidateReviewStatus = 'confirmed' | 'rejected';
export type IdentificationCandidateDecision = 'confirmed' | 'rejected' | 'unresolved';

export type IdentificationHistoryCandidate = {
  rank: number;
  animal: AnimalRecord;
  similarityScore: number;
};

export type IdentificationMediaMetadata = {
  index: number;
  mediaType: string;
  capturedAt: string | null;
  captureTimeSource: 'photo-exif' | 'camera-return-time' | 'unknown';
  location: {
    latitude: number;
    longitude: number;
    accuracyMeters: number | null;
  } | null;
  locationSource: 'photo-exif' | 'device-gps-after-capture' | 'unknown';
};
export type IdentificationHistoryEntry = {
  id: string;
  createdAt: string;
  source: IdentificationSource;
  reviewStatus: IdentificationReviewStatus;
  mediaCount: number;
  mediaTypes: string[];
  /** Location and capture metadata for each selected media item. */
  mediaMetadata?: IdentificationMediaMetadata[];
  candidates: IdentificationHistoryCandidate[];
  /** Per-candidate officer decisions; absent entries have not been reviewed. */
  candidateReviews?: Record<string, IdentificationCandidateReviewStatus>;
  /** Animal ID selected by the officer when the match is confirmed. */
  reviewedAnimalId?: string;
};

type IdentificationHistoryState = {
  entries: IdentificationHistoryEntry[];
  addEntry: (entry: IdentificationHistoryEntry) => void;
  setReviewStatus: (
    id: string,
    status: IdentificationReviewStatus,
  ) => void;
  recordCandidateDecision: (
    id: string,
    animalId: string | undefined,
    decision: IdentificationCandidateDecision,
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

        recordCandidateDecision: (id, animalId, decision) =>
          set((state) => ({
            entries: state.entries.map((entry) => {
              if (entry.id !== id) return entry;

              if (decision === 'unresolved') {
                const candidateReviews = { ...(entry.candidateReviews ?? {}) };
                for (const candidate of entry.candidates) {
                  if (candidateReviews[candidate.animal.id] === 'confirmed') {
                    delete candidateReviews[candidate.animal.id];
                  }
                }
                return {
                  ...entry,
                  candidateReviews,
                  reviewStatus: 'unresolved',
                  reviewedAnimalId: undefined,
                };
              }

              if (!animalId || !entry.candidates.some((candidate) => candidate.animal.id === animalId)) {
                return entry;
              }

              const candidateReviews: Record<string, IdentificationCandidateReviewStatus> = {
                ...(entry.candidateReviews ?? {}),
                [animalId]: decision,
              };

              if (decision === 'confirmed') {
                // Keep only one confirmed candidate for an identification case.
                const singleConfirmationReviews = { ...candidateReviews };
                for (const candidate of entry.candidates) {
                  if (
                    candidate.animal.id !== animalId &&
                    singleConfirmationReviews[candidate.animal.id] === 'confirmed'
                  ) {
                    delete singleConfirmationReviews[candidate.animal.id];
                  }
                }
                return {
                  ...entry,
                  candidateReviews: singleConfirmationReviews,
                  reviewStatus: 'confirmed',
                  reviewedAnimalId: animalId,
                };
              }

              // A rejected or changed decision must not leave stale confirmed entries.
              for (const candidate of entry.candidates) {
                if (candidateReviews[candidate.animal.id] === 'confirmed') {
                  delete candidateReviews[candidate.animal.id];
                }
              }

              const allCandidatesRejected =
                entry.candidates.length > 0 &&
                entry.candidates.every((candidate) => candidateReviews[candidate.animal.id] === 'rejected');

              return {
                ...entry,
                candidateReviews,
                reviewStatus: allCandidatesRejected ? 'rejected' : 'pending-review',
                reviewedAnimalId: undefined,
              };
            }),
          })),
      }),
      {
        name: 'jeevdrishti-identification-history-v1',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  );