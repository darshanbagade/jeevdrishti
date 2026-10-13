import { create } from 'zustand';

export type SelectedMediaAsset = {
  uri: string;
  type?: string | null;
  fileName?: string | null;
  width?: number;
  height?: number;
  duration?: number | null;
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