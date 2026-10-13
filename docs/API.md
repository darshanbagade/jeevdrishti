# API contract v1

The app talks to the existing FastAPI service. Adapters can map this contract to the real backend.

## Configuration

- Base URL: EXPO_PUBLIC_API_URL
- Authentication header: Authorization: Bearer <token>
- JSON uses snake_case.
- src/api/adapters.ts converts snake_case to camelCase.
- If the real backend differs, change only the adapters, never the screens.

## Authentication

POST /api/auth/login

Request:
{ "username": "string", "password": "string" }

Response:
{ "token": "string", "user": { "id": "string", "name": "string", "role": "field | reviewer | admin" } }

## Dashboard and registry

- GET /api/dashboard/summary
  Returns: { "animals": "number", "reference_images": "number", "sightings": "number", "pending_review": "number", "cameras": "number" }

- GET /api/animals
  Returns: Animal[]

- GET /api/animals/{id}
  Returns: Animal

- GET /api/animals/{id}/sightings?since=ISO
  Returns: Sighting[]

- GET /api/cameras
  Returns: Camera[]

## Animal identification

POST /api/identify

Multipart input:
- images[]: 1 to 5 files, or video
- side_hint: any | left | right per image
- species_hint: optional species
- source: camera | guard
- camera_id: optional camera ID
- lat, lng: optional coordinates
- captured_at: ISO timestamp
- client_id: unique client identifier

Header:
Idempotency-Key: <client_id>

Returns: IdentifyResponse

GET /api/jobs/{id}

Returns:
{ "state": "pending | done | failed", "result": "IdentifyResponse, when available" }

## Observation decisions

POST /api/observations/{id}/decision

Request:
{ "action": "confirm | reassign | reject | new_animal", "animal_id": "optional string", "reason": "optional string" }

Returns:
{ "ok": true, "sighting": "optional Sighting" }

GET /api/review-queue

Returns: Observation[]

## New animal proposals

POST /api/animals/propose

Request:
{ "observation_id": "string", "species": "string", "sex": "optional string", "notes": "optional string" }

Returns:
{ "animal_id": "PROV-0007", "status": "provisional" }

POST /api/animals/{id}/approve

Admin only.

Returns:
{ "animal_id": "string", "code": "string" }

## Incidents

POST /api/incidents

Request:
{ "lat": "number", "lng": "number", "time": "ISO timestamp", "type": "string", "radius_km": "number", "lookback_days": "number", "species": "string[]" }

Returns:
{ "id": "string" }

GET /api/incidents/{id}/shortlist

Returns:
[{ "animal_id": "string", "last_seen": "ISO timestamp", "distance_km": "number", "sightings": "number" }]

## Audit

GET /api/audit

Admin only.

Returns:
[{ "who": "string", "when": "ISO timestamp", "action": "string", "object": "string", "reason": "string" }]

## Data models

### Animal

- id: string, for example T-005
- species: string
- display_name: optional string
- sex: optional string
- age_class: optional string
- zone: optional core | buffer
- first_seen: optional timestamp
- last_seen: optional timestamp
- notes: optional string
- status: active | provisional | archived
- photos: array of { url: string, side: string }

### Sighting

- id: string
- animal_id: string
- lat, lng: numbers
- time: timestamp
- source: camera | guard
- camera_id: optional string
- observer: optional string
- review_status: confirmed | pending
- image_url: optional string

### Camera

- id: string, for example C-008
- name: string
- zone: string
- lat, lng: numbers
- status: string

### IdentifyResponse

- observation_id: string
- status: ok | retake | species_only | error
- quality: { passed: boolean, issues: string[] }
- capture: { source: string, camera_id?: string, lat?: number, lng?: number, captured_at: string, timestamp_source: string }
- detections: array of detections containing:
  - box
  - species
  - species_confidence
  - individual_id_available
  - side
  - decision: matched | review | unknown
  - similarity
  - margin
  - candidates: up to 5 entries containing rank, animal_id, similarity, photo_url, profile and last_sighting

## Implementation notes

- Parse API responses using Zod schemas.
- Use typed errors and a 15-second request timeout.
- Support multipart uploads and Idempotency-Key headers.
- Screens must call API hooks, not fetch directly.
- Never assume an endpoint is implemented until the backend team confirms it.
