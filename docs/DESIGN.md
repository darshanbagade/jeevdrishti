
# Design brief: forest theme

## Mood

Dark forest night by default (matches the web demo): deep green background, soft green cards, amber for the main action, red only for errors and 'unknown'. Calm, modern, premium wildlife look. A light 'sunlight' theme for use outdoors.

## Colour tokens (only in src/theme/colors.ts)

Dark:
- background: #0B1A14
- surface: #12261D
- surfaceRaised: #183227
- border: #24463A
- text: #E8F1EC
- textMuted: #9DB5A9
- primary: #3FB97C
- primaryStrong: #1F7A4D (white text)
- accent amber: #F5A524 (dark text #1A1200)
- danger: #E5534B
- dangerStrong: #B93A34 (white text)
- info: #5BA7D6

Light (sunlight):
- background: #F4F1E8
- surface: #FFFFFF
- surfaceRaised: #ECE8DC
- border: #D6D0BF
- text: #14261D
- textMuted: #4F6359
- primary: #1B5E3F
- accent: #A45F00 (white text)
- danger: #B3261E
- info: #1F5F8B

These are starting values. Check every text and background pair with a contrast checker (4.5:1 for text, 3:1 for icons and borders). Later, re-sample the palette from the Tadoba website.

## Type

- Poppins SemiBold for headings.
- Inter for text.
- Noto Sans Devanagari for Hindi and Marathi.
- Sizes: display 28/34, title 22/28, subtitle 18/24, body 16/24, caption 13/18.
- Never use text below 13.

## Shape and space

- Spacing scale: 4, 8, 12, 16, 24, 32.
- Radius: small 10, medium 16, large 24, pill 999.
- Cards: surface colour, 1px border, soft shadow.
- Glass effect (expo-blur) only on the tab bar and hero.

## Decoration

- Dark gradient from background to surface.
- A drawn diagonal stripe pattern in SVG at about 8 percent opacity on the hero card and splash.
- No photos copied from other websites.

## Components to build

- ScreenContainer
- AppText
- Icon
- Button (primary, amber, ghost, danger; loading; haptic)
- IconButton
- Card
- Chip (status with icon + word)
- StatCard
- SectionHeader
- ConfidenceBar (animated)
- SyncChip
- OfflineBanner
- EmptyState
- Skeleton
- Toast
- Sheet (modal bottom sheet)
- AnimalThumb
- AnimalCard
- SightingRow
- TabBar with a centre Identify button

## Icons

- Only vector icons from @expo/vector-icons.
- Use Ionicons by default and MaterialCommunityIcons for animal and map symbols.
- One Icon component and one name map in src/theme/icons.ts.
- Sizes: 20, 24 and 32.
- Colours come from theme tokens.
- Outline style when inactive, filled style when active in the tab bar.
- Never use emoji characters anywhere in the UI, neither as icons nor inside text.
- Every icon-only button has an accessibilityLabel.

## Motion

- Durations: 150, 250, 400 ms.
- Result cards enter one by one, 220 ms apart, with FadeInDown and a light spring.
- Similarity bars fill in 600 ms.
- Chips appear in 150 ms.
- Shutter button ripple.
- Analyzing screen: pulsing rings and step text.
- Track line draws one segment every 350 ms.
- When reduced motion is enabled: no stagger, no spring, instant transitions.

## Home layout (top to bottom)

1. Top bar: small logo, app name, SyncChip, avatar. Greeting with the user's name and zone.
2. Hero card: gradient + stripe pattern, title 'Which animal is it?', subtitle 'Take 2 to 3 photos or one short video', amber 'Start identification' button, and three small buttons: Photos, Video, Gallery.
3. Stat cards in a horizontal row: Enrolled animals, Sightings today, Pending review, Active cameras.
4. Waiting card (only if the queue is not empty): '3 captures waiting to upload' + Sync now.
5. Recent sightings carousel: thumbnail, animal code, result chip, camera, time.
6. Tracking now card: a small preview that opens the last viewed track.
7. Quick links: Animals, Incident, Review queue (reviewer and admin), About and limits.

Tab bar: Home, Animals, Identify (centre button), Tracks, Settings.

## Result card layout

- Rank badge 1 to 5.
- Photo 88 x 88 with rounded corners.
- Animal code and species chip.
- Similarity bar and number.
- Profile chips: sex, age class, zone.
- Last-seen row with an icon (camera or person) and time.
- Chevron for navigation.
- The best match has a green border and a 'Best match' label.

## Track screen layout

- Full-screen map.
- Floating top bar: back, animal code, 7d / 30d / All chips.
- Bottom sheet with distance, time span, speed flag and the list of sightings.
- Replay slider above the sheet.
- Map credit '© OpenStreetMap contributors' always visible.

## Wording

- Follow the Tadoba site's wording: Core and Buffer, gates, frontline forest staff.
- Splash line: 'The kingdom of the majestic wild!'
- Empty sightings: 'The forest is quiet.'
- Offline chip example: 'Offline, 3 waiting'.
- Use plain words: 'Suggested matches', never 'Identified as'.
