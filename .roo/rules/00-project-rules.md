
# JeevDrishti app: rules for every Roo mode

Read before any task: docs/PRODUCT.md, docs/DESIGN.md, docs/API.md, and docs/PLAN.md when it exists.

Work only on the step the user names. Do not build extra features.

## Stack (fixed)

- Expo SDK 57 (latest 57.x patch), React Native, TypeScript strict, Expo Router, New Architecture.
- Never upgrade Expo or change the SDK. Install packages with: npx expo install <package>
- Navigation imports come from expo-router. Never import from @react-navigation/*.
- Approved packages: expo-router, expo-camera, expo-image-picker, expo-image, expo-image-manipulator, expo-video, expo-video-thumbnails (only if it supports SDK 57, otherwise use the thumbnail API in expo-video), expo-sqlite, expo-file-system, expo-network, expo-location, expo-secure-store, expo-localization, expo-haptics, expo-linear-gradient, expo-blur, expo-font, expo-splash-screen, expo-background-task, expo-task-manager, expo-print, expo-sharing, react-native-reanimated, react-native-worklets, react-native-gesture-handler, react-native-svg, react-native-webview, @tanstack/react-query, zustand, i18next, react-i18next, zod, date-fns, @turf/distance, @turf/circle, @turf/helpers, @expo/vector-icons, @expo-google-fonts/inter, @expo-google-fonts/poppins, @expo-google-fonts/noto-sans-devanagari.
- Ask the user before adding any other package.
- If you are not sure an Expo or React Native API exists in SDK 57, read the official docs first. Do not guess API names.

## Folders

app/ = routes only (thin files), src/components, src/features/<feature>, src/theme, src/api, src/db, src/sync, src/store, src/i18n, src/mocks, src/utils, src/types, src/config. Alias: @/ points to src/.

## Code rules

- Functional components and hooks. No any. No class components. Keep files under 250 lines; split big screens into components.
- Styling: StyleSheet with tokens from src/theme. No hard-coded colours, font sizes, spacing or radius values in screens.
- Text: every user-facing string uses i18n t('key') with entries in en, hi and mr. Never hard-code UI text.
- Animation: react-native-reanimated. Respect reduced motion.
- Icons: use only vector icons from @expo/vector-icons (Ionicons first, MaterialCommunityIcons when Ionicons has no match). Use them through one Icon component and one name map in src/theme/icons.ts. Never use emoji characters as icons or inside UI text.
- Accessibility: touch targets at least 48dp, accessibilityLabel on icon buttons, text contrast 4.5:1 or better, never show a status with colour alone (add an icon and a word).
- Offline first: user actions write to the local SQLite queue first and sync later. Always show the offline state.
- Mock mode: when EXPO_PUBLIC_USE_MOCK=true the app uses src/mocks, otherwise it calls the API. Screens never call fetch directly; they use hooks from src/api.
- Privacy: no secrets in code. API address comes from env. Round coordinates for the field role (see docs/PRODUCT.md).
- Wording: scores are 'model similarity scores', not probabilities. Animal codes are internal.

## After every task

1. Run npx tsc --noEmit and npx expo lint. Fix every error.
2. Do not edit files outside the task. Do not delete files unless asked.
3. Finish with: files changed, exact steps to test, and anything left undone.
