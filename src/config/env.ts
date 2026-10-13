export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
  useMock: process.env.EXPO_PUBLIC_USE_MOCK !== 'false',
  demo: process.env.EXPO_PUBLIC_DEMO === 'true',
} as const;
