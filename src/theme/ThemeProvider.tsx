import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from 'react';
import { useColorScheme } from 'react-native';
import {
  darkColors,
  lightColors,
  type ResolvedTheme,
  type ThemeColors,
} from './colors';
import {
  useThemeModeStore,
  type ThemeMode,
} from './store';

type ThemeContextValue = {
  mode: ThemeMode;
  resolvedMode: ResolvedTheme;
  isDark: boolean;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const mode = useThemeModeStore((state) => state.mode);
  const setMode = useThemeModeStore((state) => state.setMode);

  const resolvedMode: ResolvedTheme =
    mode === 'system'
      ? systemScheme === 'light'
        ? 'light'
        : 'dark'
      : mode;

  const colors = resolvedMode === 'dark' ? darkColors : lightColors;

  const value = useMemo(
    () => ({
      mode,
      resolvedMode,
      isDark: resolvedMode === 'dark',
      colors,
      setMode,
    }),
    [mode, resolvedMode, colors, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider.');
  }

  return context;
}
