import { create } from 'zustand';

export type ThemeMode = 'system' | 'dark' | 'light';

type ThemeModeStore = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

export const useThemeModeStore = create<ThemeModeStore>((set) => ({
  mode: 'system',
  setMode: (mode) => set({ mode }),
}));
