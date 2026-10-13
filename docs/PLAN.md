# Implementation Plan: JeevDrishti Field App

## Build Steps

2. **Scaffold**
   - **Goal**: Initialize the project structure and essential configurations.
   - **Files**: `package.json`, `app.json`, `tsconfig.json`, `src/config/env.ts`. (Note: .env contains only placeholder non-secret keys).
   - **Packages**: `expo-router`, `zod`.
   - **Test**: Run `npx expo start` and confirm the app boots to a blank screen or basic router setup.

3. **Theme and UI kit**
   - **Goal**: Create the design system foundation.
   - **Files**: `src/theme/colors.ts`, `src/theme/typography.ts`, `src/theme/spacing.ts`, `src/theme/icons.ts`, `src/components/Button.tsx`, `src/components/AppText.tsx`, `src/components/Card.tsx`.
   - **Packages**: `@expo/vector-icons`, `expo-font`, `@expo-google-fonts/inter`, `@expo-google-fonts/poppins`, `@expo-google-fonts/noto-sans-devanagari`.
   - **Test**: A temporary "Style Guide" screen showing all colors, fonts, and component variants. Verify contrast ratios for accessibility.

4. **Navigation shell and roles**
   - **Goal**: Set up the tab bar, root layout, and auth-based routing.
   - **Files**: `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `src/store/useAuthStore.ts`, `src/utils/permissions.ts`.
   - **Packages**: `expo-router`, `zustand`, `expo-secure-store`.
   - **Test**: Switch roles in the store and verify that restricted tabs/screens are hidden or redirected.

5. **Data layer and mocks**
   - **Goal**: Configure the API client (typed fetch wrapper), React Query, and mock system.
   - **Files**: `src/api/client.ts` (fetch wrapper with timeout and multipart support), `src/api/adapters.ts`, `src/api/queries/`.
   - **Packages**: `@tanstack/react-query`, `date-fns`.
   - **Test**: Set `EXPO_PUBLIC_USE_MOCK=true` and verify that queries return data from the local mock logic. Test timeout and failure states.

6. **Home**
   - **Goal**: Build the main dashboard layout.
   - **Files**: `app/(tabs)/home.tsx`, `src/components/HeroCard.tsx`, `src/components/StatCard.tsx`, `src/features/home/RecentSightings.tsx`.
   - **Packages**: `expo-linear-gradient`, `expo-blur`.
   - **Test**: Verify the layout matches the design brief and handles empty states for recent sightings.

7. **Capture flow and local database**
   - **Goal**: Implement image/video capture and SQLite persistence.
   - **Files**: `app/capture/index.tsx`, `app/capture/details.tsx`, `src/db/schema.ts`, `src/db/queue.ts`.
   - **Packages**: `expo-camera`, `expo-image-picker`, `expo-video`, `expo-sqlite`, `expo-location`.
   - **Test**: Capture a photo, fill details, and verify it is saved in the local SQLite `queue` table. Test behavior when camera permissions are denied.

8. **Sync engine and queue**
   - **Goal**: Build the logic to upload queued items when online.
   - **Files**: `src/sync/engine.ts`, `src/sync/tasks.ts`, `app/queue.tsx`.
   - **Packages**: `expo-network`, `expo-task-manager`, `expo-background-task`.
   - **Test**: Toggle Airplane mode, verify items queue up, and check they sync automatically when network returns.

9. **Analyzing and Results**
   - **Goal**: UI for processing state and match results.
   - **Files**: `app/analyzing.tsx`, `app/results/[observationId].tsx`, `src/components/ConfidenceBar.tsx`, `src/components/AnimalCard.tsx`.
   - **Packages**: `react-native-reanimated`.
   - **Test**: Trigger an "Analyze" action and verify the sequential animation of result cards.

10. **Animal profile and Track map**
    - **Goal**: Detailed animal view and movement tracking.
    - **Files**: `app/animal/[id].tsx`, `app/track/[id].tsx`, `src/features/track/MapView.tsx`, `src/features/track/TrackSVG.tsx`.
    - **Packages**: `react-native-webview`, `react-native-svg`, `@turf/distance`.
    - **Test**: View a track online (WebView) vs offline (SVG fallback) and check the "unlikely movement" flag.

11. **Compare, review and new animal approval**
    - **Goal**: Tools for reviewers and admins to process identifications.
    - **Files**: `app/compare.tsx`, `app/review/new-animal.tsx`, `app/admin/approvals.tsx`.
    - **Packages**: `expo-image-manipulator`.
    - **Test**: Perform a "Confirm" action and a "Possibly new" proposal; verify they are queued for sync.

12. **Animals registry**
    - **Goal**: Searchable list of all known animals.
    - **Files**: `app/(tabs)/animals.tsx`, `src/features/animals/AnimalFilters.tsx`.
    - **Packages**: None additional.
    - **Test**: Search by animal code and filter by zone/species.

13. **Incident mode**
    - **Goal**: Conflict mode for finding nearby suspects.
    - **Files**: `app/incident.tsx`, `src/api/queries/useIncidentShortlist.ts`.
    - **Packages**: `@turf/circle`.
    - **Test**: Input coordinates/radius and verify the list of animals seen nearby.

14. **Settings, i18n and About**
    - **Goal**: Localization and app configuration.
    - **Files**: `src/i18n/index.ts`, `app/(tabs)/settings.tsx`.
    - **Packages**: `i18next`, `react-i18next`, `expo-localization`.
    - **Test**: Switch language to Hindi and verify all UI strings update.

15. **Polish and accessibility**
    - **Goal**: Haptics, animations, and ARIA compliance.
    - **Files**: Revisit components to add `accessibilityLabel` and `expo-haptics`.
    - **Packages**: `expo-haptics`.
    - **Test**: Run with Screen Reader and ensure all touch targets are at least 48dp.

16. **Backend connection**
    - **Goal**: Switch from mock data to the real FastAPI service.
    - **Files**: `.env` (production values), `src/api/adapters.ts`.
    - **Packages**: None additional.
    - **Test**: Verify end-to-end flow with a staging environment.

17. **APK and demo mode**
    - **Goal**: Final build and demonstration tools.
    - **Files**: `eas.json`, `src/features/demo/DemoSwitcher.tsx`.
    - **Packages**: None additional.
    - **Test**: Run EAS build and test the resulting APK with `EXPO_PUBLIC_DEMO=true`.

## Risks
- **SQLite/Sync Conflicts**: Race conditions when multiple items sync; mitigated by `client_id` and idempotency.
- **Offline Map Quality**: SVG fallback might be too basic for complex tracks.
- **Battery Drain**: Background sync and polling can drain battery; must be optimized with appropriate intervals.
- **Memory Usage**: High-resolution photos in a multi-step flow; requires careful image resizing.

