
# Product brief: JeevDrishti field app

## What it does

Staff capture 1 to 5 photos or one short video of a wild animal. The app sends them to the model and shows the top 5 matching known animals. Staff confirm, reassign or reject. Each confirmed match becomes a sighting, so every animal gets a movement track on a map. The app works offline: it saves captures and syncs later.

## Roles

- field: guards and watchers. Capture, see results, flag 'possibly new'. Cannot approve. Sees coordinates rounded to 2 decimals.
- reviewer: officers. Everything field can do, plus confirm, reassign, reject, conflict mode, exact coordinates.
- admin: reviewer rights, plus approving new animals and the audit log.

## Main flow

1. Home > Identify.
2. Choose input: Photos (1 to 5; best is 2 to 3: left flank, right flank, one extra clear angle), Video (up to 15 s; the app takes 6 frames), or Gallery.
3. Details: side hint per image (Any / Left / Right), optional species, source (camera code or 'Field capture'), GPS and time filled in automatically (editable). Show 'timestamp source: device'.
4. Save. Online: 'Identify now'. Offline: saved to the queue.
5. Analyzing screen, then Results.
6. Results show one decision label and 5 animal cards that appear one after another.
7. Tap a card: animal profile, then Track map.
8. Review actions: Confirm, Reassign, Reject, Possibly new animal.

## Result rules (from the existing prototype)

- Thresholds: match >= 0.70, review >= 0.50, margin >= 0.05 (margin = best score minus second best).
- Labels: MATCHED shown as 'Likely match'. REVIEW shown as 'Needs review'. UNKNOWN shown as 'Not sure, possibly new'.
- Always show similarity and margin, and the line 'Model similarity score, not a probability.'
- Photo-quality failure: show the reason and a Retake button.
- Species with no individual ID: 'Species recorded. Individual ID is not available for this species.'
- A photo with several animals gives one result group per animal.

## Animal card (each of the 5)

Clear reference photo; animal code (for example T-005); species; similarity bar and number; profile fields only when they exist (display name, sex, age class, zone, first seen, last seen, notes); last known location: camera code or 'Field capture', zone, time. Missing fields are hidden, never shown blank.

## Tracking rules

- Track = confirmed sightings of one animal, sorted by time.
- Each new confirmed sighting adds a point, so the line grows as the same animal is identified in more places.
- Merge rule: sightings within 100 m and 30 minutes become one marker with a count.
- Draw the line through points in time order. Newer segments are brighter. Number the markers. An unconfirmed new capture is a dashed segment with a hollow marker.
- Show total distance, time span, and an 'unlikely movement' flag when the implied speed is above 20 km/h (soft warning, never a block).
- Filters: 7 days, 30 days, all. Replay slider.
- While the Track screen is open and online, check for new sightings every 20 seconds and animate new points in.
- Offline: show the cached track on a schematic map (SVG, no tiles).

## Human review

- Reject needs a reason. Reassign needs the target animal.
- Possibly new animal: show the nearest animals from both flanks (duplicate check), then a proposal form. It creates a provisional animal, hidden from search, that waits for an admin to approve (two-person rule).
- Every action is saved with who, when and why (audit log).

## Offline rules

- Captures, incidents and review actions go to a local queue. Each item has a unique client id sent as an Idempotency-Key header, so retries never create duplicates.
- Sync runs when the app opens, when the network returns, on 'Sync now', and in a background task (best effort).
- Cached for offline reading: animals and profiles, last results, last tracks.
- Not available offline: new identification, live map tiles. Review decisions queue until online.

## Other features

Conflict (incident) mode with a suspect shortlist (map circle, default radius 5 km, look-back 30 days, species filter). Animals registry with search and filters. Queue screen. English, Hindi and Marathi. Dark, light and sunlight themes. About and limits page. Demo tools (role switcher, mock scenarios) only when EXPO_PUBLIC_DEMO=true.

## Routes

- /login
- /(tabs)/home
- /(tabs)/animals
- /(tabs)/tracks
- /(tabs)/settings
- /capture
- /capture/details
- /analyzing
- /results/[observationId]
- /animal/[id]
- /track/[id]
- /compare
- /review/new-animal
- /admin/approvals
- /incident
- /queue

## Not in this version

On-device AI, offline map tiles, push notifications, user management (login uses a token from the API).
