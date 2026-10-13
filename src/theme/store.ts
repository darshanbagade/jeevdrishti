import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export type ThemeMode = 'system' | 'dark' | 'light';

const THEME_MODE_KEY = 'jeevdrishti.themeMode';

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'system' || value === 'dark' || value === 'light';
}

type ThemeModeStore = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  hydrate: () => Promise<void>;
};

export const useThemeModeStore = create<ThemeModeStore>((set) => ({
  mode: 'system',

  setMode: (mode) => {
    set({ mode });
    void SecureStore.setItemAsync(THEME_MODE_KEY, mode).catch((error: unknown) => {
      if (__DEV__) console.warn('Unable to save theme preference.', error);
    });
  },

  hydrate: async () => {
    try {
      const savedMode = await SecureStore.getItemAsync(THEME_MODE_KEY);
      if (isThemeMode(savedMode)) set({ mode: savedMode });
    } catch (error) {
      if (__DEV__) console.warn('Unable to load theme preference.', error);
    }
  },
}));