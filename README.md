# JeevDrishti

An Android application for wildlife identification and monitoring, designed for forest staff working in areas with weak or no internet connectivity.

## Current Status

The initial Expo SDK 57 scaffold is configured. Wildlife capture, offline storage, synchronization, animal profiles, and backend integration are not implemented yet.

## Planned Features

- Capture wildlife photos and videos with observation details.
- Save observations locally when offline.
- Queue uploads and synchronize when connectivity returns.
- Browse cached animal profiles and previous sightings.
- Display the top five candidate animal matches.
- Support human verification of identification results.
- Support English, Hindi, and Marathi.

## Technology Stack

- React Native, Expo SDK 57, and Expo Router
- TypeScript with strict checking
- Expo Camera, Image Picker, and Location
- Planned local database: SQLite
- Planned identification service: backend API connected to the ML model

## ML Integration Strategy

The initial approach uses server-side animal matching. The app will capture and save observations, upload queued data when connectivity is available, and display the candidates returned by the backend API.

The API layer will remain separate from the UI so the ML model or backend can evolve without requiring a complete app redesign. On-device inference is a possible future phase, subject to feasibility and performance testing.

ML results support forest officers and do not replace human verification and approval.

## Development

Install dependencies using `npm install`.

Start the development server using `npx expo start`.

Validate the project using `npx expo-doctor`, `npx tsc --noEmit`, and `npx expo lint`.

## Environment Configuration

Copy `.env.example` to `.env` and configure `EXPO_PUBLIC_API_URL` when the backend is available.

`EXPO_PUBLIC_USE_MOCK` controls mock mode. `EXPO_PUBLIC_DEMO` controls demo mode.

Never put secrets or private API keys in `EXPO_PUBLIC_*` variables.

## Project Structure

- `app/` — Expo Router screens
- `src/components/` — reusable UI components
- `src/config/` — app configuration
- `src/api/` — planned backend API layer
- `src/db/` — planned local database
- `src/sync/` — planned offline synchronization
- `src/features/` — planned feature modules

## Current Limitations

This is an initial scaffold. Wildlife identification, offline synchronization, and production backend integration are not implemented yet.
