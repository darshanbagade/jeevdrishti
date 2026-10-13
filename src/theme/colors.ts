export const darkColors = {
  background: '#0B1A14',
  surface: '#12261D',
  surfaceRaised: '#183227',
  border: '#24463A',
  text: '#E8F1EC',
  textMuted: '#9DB5A9',
  primary: '#3FB97C',
  primaryStrong: '#1F7A4D',
  accent: '#F5A524',
  accentText: '#1A1200',
  danger: '#E5534B',
  dangerStrong: '#B93A34',
  info: '#5BA7D6',
  success: '#3FB97C',
  onStrong: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.56)',
} as const;

export const lightColors = {
  background: '#F4F1E8',
  surface: '#FFFFFF',
  surfaceRaised: '#ECE8DC',
  border: '#D6D0BF',
  text: '#14261D',
  textMuted: '#4F6359',
  primary: '#1B5E3F',
  primaryStrong: '#1B5E3F',
  accent: '#A45F00',
  accentText: '#FFFFFF',
  danger: '#B3261E',
  dangerStrong: '#B3261E',
  info: '#1F5F8B',
  success: '#1B5E3F',
  onStrong: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.40)',
} as const;

export type ThemeColors = {
  [Key in keyof typeof darkColors]: string;
};
export type ResolvedTheme = 'dark' | 'light';

export const colorSchemes: Record<ResolvedTheme, ThemeColors> = {
  dark: darkColors,
  light: lightColors,
};
