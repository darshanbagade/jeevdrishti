# Architecture: JeevDrishti Field App

## Folder Structure

```text
app/
  (tabs)/             # Tab bar routes
    home.tsx
    animals.tsx
    tracks.tsx
    settings.tsx
    _layout.tsx
  capture/            # Multi-step capture flow
    index.tsx
    details.tsx
  results/
    [observationId].tsx
  animal/
    [id].tsx
  track/
    [id].tsx
  admin/
    approvals.tsx
  _layout.tsx         # Root provider setup
  login.tsx
  analyzing.tsx
  compare.tsx
  review/
    new-animal.tsx
  incident.tsx
  queue.tsx
src/
  api/                # React Query hooks, fetch wrapper (typed, timeout, multipart), Zod schemas
  components/         # Shared UI components (Button, Card, Icon)
  features/           # Feature-specific components and logic
    home/
    capture/
    results/
    track/
  theme/              # Colors, typography, spacing, icons
  db/                 # SQLite schema, migrations, local queries
  sync/               # Sync engine and background tasks
  store/              # Zustand stores (auth, settings, local state)
  i18n/               # Translations (en, hi, mr)
  mocks/              # Local mock data and logic for demo mode
  utils/              # Helpers (date formatting, coordinate rounding)
  types/              # Global TypeScript interfaces
  config/             # Environment variables and constants
```

## Route Map

- `/login`: Auth entry point.
- `/(tabs)/home`: Dashboard with hero, stats, and recent sightings.
- `/(tabs)/animals`: Registry with search and filters.
- `/(tabs)/tracks`: Global track view or map entry.
- `/(tabs)/settings`: User profile, language, theme, and about.
- `/capture`: Camera/Gallery selection and media capture.
- `/capture/details`: Metadata entry (side, species, location).
- `/analyzing`: Processing state animation.
- `/results/[observationId]`: Top 5 matches with similarity scores.
- `/animal/[id]`: Detailed profile of a known individual.
- `/track/[id]`: Time-series movement map for one animal.
- `/compare`: Side-by-side comparison for review.
- `/review/new-animal`: Proposal form for unidentified animals.
- `/admin/approvals`: Management queue for new animal proposals.
- `/incident`: Conflict mode with proximity shortlist.
- `/queue`: Local sync queue status.

## State and Data Flow

### Server Data (React Query)
All remote data (animals, sightings, results) is managed by TanStack Query.
- Persistence: Cached using `SQLite` for offline availability.
- Revalidation: Focused on stale-while-revalidate strategy.

### App State (Zustand)
- `useAuthStore`: Token, user object, and role-based permissions.
- `useSettingsStore`: Theme (dark/light), language, and haptics preference.
- `useCaptureStore`: Temporary state for the multi-step capture flow before it is committed to SQLite.

### Offline Storage (SQLite)
- Table `queue`: Stores capture payloads and review actions with `client_id` and status (`pending`, `failed`).
- Table `cache_animals`: Local copy of the registry for fast offline search.
- Table `cache_tracks`: Last viewed tracks for offline SVG rendering.

## Offline Queue and Synchronization

1. **Write Action**: User submits a capture or review.
2. **Persistence**: Action is saved to the SQLite `queue` table.
3. **Trigger**: Sync engine is triggered immediately.
4. **Execution**:
   - Engine reads `pending` items.
   - Sends to API with `Idempotency-Key` (from `client_id`).
   - On `2xx`: Mark as `synced`.
   - On `5xx` or network error: Retry with exponential backoff.
5. **Background**: Expo Task Manager runs the sync engine in the background. Note: Background synchronization is best-effort and execution timing is managed by the OS; it is not guaranteed to run at exact intervals.

## Track and Map Design

### WebView (Leaflet)
- Used for the primary map when online.
- Renders GeoJSON tracks with custom marker icons.
- Displays "© OpenStreetMap contributors" attribution.
- Track data refresh follows the app data-fetching flow when online and the screen is active; no fixed polling interval is assumed.

### SVG Fallback
- Used when offline.
- Renders a schematic representation of the track using `react-native-svg`.
- Shows points and lines relative to the bounding box of the track data.

## Error Handling

- **Global Boundary**: Catches React rendering errors.
- **API Wrapper**: Standardized error response parsing using Zod.
- **Toasts**: Non-blocking feedback for sync status and validation.
- **Retry Mechanism**: Manual "Retry" button on failed sync items in the `/queue` screen.

## Role-Based Access

- **Field**:
  - Coordinates are rounded for field staff according to product requirements.
  - Hide "Approve" and "Audit" features.
  - Can only submit "Possibly new" proposals, not approve them.
- **Reviewer**:
  - Coordinate visibility follows the role permissions defined in the product requirements.
  - Full access to review actions (Confirm, Reassign, Reject).
- **Admin**:
  - All Reviewer rights.
  - Access to `/admin/approvals` and the audit log.

