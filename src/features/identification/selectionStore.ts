import { create } from 'zustand';

export type SelectedMediaAsset = {
  uri: string;
  type?: string | null;
  fileName?: string | null;
  width?: number;
  height?: number;
  duration?: number | null;
  capturedAt?: string | null;
  captureTimeSource?: 'photo-exif' | 'camera-return-time' | 'unknown';
  location?: {
    latitude: number;
    longitude: number;
    accuracyMeters: number | null;
  } | null;
  locationSource?: 'photo-exif' | 'device-gps-after-capture' | 'unknown';
};

type IdentifySelectionState = {
  assets: SelectedMediaAsset[];
  setAssets: (assets: SelectedMediaAsset[] | ((current: SelectedMediaAsset[]) => SelectedMediaAsset[])) => void;
  clearAssets: () => void;
};

export const useIdentifySelectionStore =
  create<IdentifySelectionState>((set) => ({
    assets: [],
    setAssets: (nextAssets) => set((state) => ({ assets: typeof nextAssets === 'function' ? nextAssets(state.assets) : nextAssets })),
    clearAssets: () => set({ assets: [] }),
  }));