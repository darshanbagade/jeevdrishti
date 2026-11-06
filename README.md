# JeevDrishti

## Wildlife Re-Identification and Monitoring Platform

JeevDrishti is a wildlife re-identification and monitoring platform
designed to support forest teams working with camera-trap and field
imagery. It helps officials review possible individual-animal matches,
maintain animal profiles, connect sightings over time, and examine
wildlife-monitoring and human--wildlife-conflict information.

**Achievement:** First Prize at WildHack 2026 (₹50,000), organised by
Tadoba-Andhari Tiger Reserve in collaboration with BITS Ballarpur.

> **Decision-support notice:** AI-generated matches are suggestions for
> human review, not autonomous identity decisions. Operational
> performance must be validated with representative field data before
> consequential use.

## Contents

-   [Overview](#overview)
-   [Capabilities](#capabilities)
-   [Identification workflow](#identification-workflow)
-   [Architecture](#architecture)
-   [Technology stack](#technology-stack)
-   [Data model concepts](#data-model-concepts)
-   [Security and responsible use](#security-and-responsible-use)
-   [Local development](#local-development)
-   [Configuration](#configuration)
-   [Testing and evaluation](#testing-and-evaluation)
-   [Deployment](#deployment)
-   [Limitations](#limitations)
-   [Future scope](#future-scope)
-   [Team and acknowledgements](#team-and-acknowledgements)
-   [License](#license)

## Overview

Identifying the same wild animal across camera-trap images is
challenging. Images can differ in distance, angle, lighting, sharpness,
and visibility. A practical workflow must also account for animals that
have not yet been enrolled in the reference gallery.

JeevDrishti combines animal detection, visual feature extraction,
similarity retrieval, ranked candidate presentation, and human review.
It also provides animal profiles and sighting histories to support
movement monitoring.

The solution includes: - A **web application** for forest officials,
reviewers, and administrative users. - A **mobile application** for
field users such as forest guards and guides. - An **AI-assisted
identification workflow** that returns up to five candidate profiles. -
A **Not Identified** outcome when no candidate meets the configured
acceptance criteria. - A **human-in-the-loop review workflow** with
explainable visual evidence. - Animal profiles, sighting history,
movement views, and historical conflict-incident mapping. - Offline
field capture with later synchronisation, as supported by the mobile
implementation.

## Capabilities

### Individual animal re-identification

-   Accepts camera-trap or field images.
-   Detects and localises animals before feature extraction.
-   Searches enrolled reference images using visual embeddings and
    vector similarity.
-   Ranks up to five candidate individual profiles.
-   Returns **Not Identified** rather than forcing an arbitrary identity
    when no suitable candidate is found.

### Human-in-the-loop review and explainability

Forest officials can inspect suggested matches and supporting evidence
before recording an identity decision. Evidence may include candidate
ranking, similarity information, reference-image comparison, flank
metadata where available, SIFT local-feature correspondences, and RANSAC
inlier evidence.

These signals support review; they do not independently prove identity.
Similarity values must not be interpreted as calibrated probabilities
unless separately calibrated and validated.

### Animal profiles and movement tracking

-   Maintains individual animal profiles and reference images.
-   Connects reviewed sightings to animal profiles.
-   Builds sighting histories using recorded dates, times, and location
    metadata.
-   Allows officials to inspect observed movement across recorded
    sightings.

Movement views represent recorded observations. They do not imply
continuous GPS tracking or knowledge of an animal's exact route between
sightings.

### Wildlife monitoring and conflict-zone information

Historical human--wildlife conflict incident records can be viewed in a
map-oriented monitoring workflow to help officials inspect locations and
patterns. This is decision-support information and does not replace
local expertise or official operating procedures.

### Web and mobile applications

The web application supports official and reviewer workflows. The mobile
application supports field capture and local retention of records when
connectivity is unavailable, followed by synchronisation when a network
connection returns. Exact retry and conflict-resolution behaviour
depends on the mobile implementation.

## Identification workflow

1.  **Image submission:** A user uploads or captures an animal image.
2.  **Detection:** MegaDetector detects/localises the animal region.
3.  **Crop extraction:** The detected region is cropped for downstream
    processing.
4.  **Embedding:** MegaDescriptor-B-224 generates a feature
    representation for the crop.
5.  **Similarity retrieval:** FAISS searches the enrolled reference
    gallery.
6.  **Candidate ranking:** The system ranks candidate profiles and
    returns up to five results.
7.  **Unknown handling:** If configured acceptance logic is not met, the
    result is **Not Identified**.
8.  **Human review:** An authorised reviewer inspects candidates and
    available visual evidence.
9.  **Profile update:** Once a sighting is reviewed and associated with
    an individual, it can contribute to that animal's profile and
    sighting history.

``` mermaid
flowchart TD
    A[Camera-trap or field image] --> B[Image submission]
    B --> C[MegaDetector: animal detection]
    C --> D[Animal crop]
    D --> E[MegaDescriptor-B-224: embedding]
    E --> F[FAISS similarity search]
    G[(Enrolled reference gallery)] --> F
    F --> H[Rank candidate profiles]
    H --> I{Acceptance criteria met?}
    I -- No --> J[Not Identified]
    I -- Yes --> K[Top 5 candidate matches]
    K --> L[Explainable visual evidence]
    J --> M[Human review / follow-up]
    L --> M
    M --> N{Reviewer decision}
    N -- Confirm --> O[Update animal profile and sighting history]
    N -- Reject or uncertain --> P[Keep unresolved / further review]
```

## Architecture

JeevDrishti uses a layered architecture with separate client
applications, a FastAPI application backend, an ML inference component,
and persistence services.

### Presentation layer

-   **Web client:** official workflows, animal profiles, identification
    review, and monitoring views.
-   **Mobile client:** field capture, offline record retention, and
    later synchronisation.

### Application backend

The Python/FastAPI backend provides REST APIs, authentication and
role-based access, request validation, application logic, animal-profile
and sighting workflows, review decisions, persistence, and integration
with the ML service.

SQLAlchemy is used for database access. SQLite has been used for local
development; production should use persistent database infrastructure
suitable for concurrent users and operational data.

### ML inference layer

-   **MegaDetector:** animal detection/localisation.
-   **MegaDescriptor-B-224:** visual embedding extraction.
-   **FAISS:** nearest-neighbour retrieval over enrolled reference
    embeddings.
-   **OpenCV, SIFT, and RANSAC:** supporting local-feature comparison
    and geometric-consistency evidence for human review.

### Data layer

Logical data groups include: - User accounts, roles, and access
information. - Animal profiles and reference images. - Image-submission
and detection records. - Embeddings and vector-index references. -
Candidate-match results and review decisions. - Sightings, timestamps,
and location metadata. - Historical human--wildlife conflict incident
records. - Mobile synchronisation state and pending submissions.

### Detailed architecture diagram

``` mermaid
flowchart TB
    A["Users<br/>Forest Officials · Guards · Guides"]

    B["Web Application"]
    C["Mobile Application<br/>React Native + Expo"]

    D["Backend<br/>FastAPI · Authentication · REST APIs"]

    E["AI Identification Pipeline<br/>MegaDetector → MegaDescriptor → FAISS"]

    F["Human-in-the-Loop Review<br/>Top 5 Matches · Explainable AI"]

    G["Wildlife Monitoring<br/>Animal Profiles · Movement Tracking<br/>Conflict Zone Mapping"]

    H[("Database and Storage<br/>Animal Records · Images · Sightings")]

    A --> B
    A --> C
    B --> D
    C --> D
    D --> E
    E --> F
    F --> G
    D --> H
    G --> H
```

### Identification sequence diagram

``` mermaid
sequenceDiagram
    actor User as Field user / official
    participant Client as Web or mobile client
    participant API as FastAPI backend
    participant ML as ML inference service
    participant Gallery as FAISS gallery
    participant Reviewer as Authorised reviewer
    participant DB as Application database

    User->>Client: Submit animal image and sighting details
    Client->>API: Upload image / create request
    API->>DB: Validate user and record request
    API->>ML: Send image for inference
    ML->>ML: Detect animal and extract crop
    ML->>ML: Generate visual embedding
    ML->>Gallery: Search enrolled references
    Gallery-->>ML: Similar candidate references
    ML->>ML: Rank candidates and apply acceptance logic
    ML-->>API: Top candidates or Not Identified
    API->>DB: Store result and review status
    API-->>Client: Return result and evidence
    Client-->>Reviewer: Display candidates for review
    Reviewer->>Client: Confirm, reject, or leave unresolved
    Client->>API: Submit review decision
    API->>DB: Persist reviewer decision
    opt Identity confirmed
        API->>DB: Associate sighting with animal profile
        API->>DB: Update sighting history
    end
    API-->>Client: Return review status
```

### Offline capture and synchronisation diagram

``` mermaid
flowchart TD
    A[Capture image and sighting details] --> B{Network available?}
    B -- No --> C[Save record locally]
    C --> D[Mark pending synchronisation]
    D --> E[Wait for connectivity]
    E --> F{Network restored?}
    F -- No --> E
    F -- Yes --> G[Submit pending record]
    B -- Yes --> G
    G --> H{Backend accepts record?}
    H -- No --> I[Retain pending state / show error]
    I --> E
    H -- Yes --> J[Persist server record]
    J --> K[Update local sync state]
```

## Technology stack

  -----------------------------------------------------------------------
  Area                                Technology
  ----------------------------------- -----------------------------------
  Mobile application                  React Native, Expo, TypeScript

  Backend API                         Python, FastAPI

  ORM / persistence                   SQLAlchemy

  Local development database          SQLite

  API style                           REST

  Animal detection                    MegaDetector

  Visual representation               MegaDescriptor-B-224

  Vector similarity search            FAISS

  Image processing / local features   OpenCV, SIFT, RANSAC

  Dataset references                  ATRW and TATR tiger data, according
                                      to the specific test run
  -----------------------------------------------------------------------

Only add additional frameworks, cloud services, or infrastructure
products when they are present in the actual repository and used by the
implementation.

## Data model concepts

The main logical entities are:

  -----------------------------------------------------------------------
  Entity                              Purpose
  ----------------------------------- -----------------------------------
  User                                Account, role, and permissions

  Animal profile                      Individual animal identity and
                                      profile metadata

  Reference image                     Enrolled image associated with an
                                      animal

  Sighting                            Observation with date/time and
                                      available location metadata

  Identification result               Result of an image-identification
                                      request

  Candidate match                     Ranked candidate profile and
                                      retrieval evidence

  Review decision                     Human confirmation, rejection, or
                                      unresolved decision

  Incident record                     Historical human--wildlife conflict
                                      event and location
  -----------------------------------------------------------------------

The following conceptual ER diagram is illustrative; reconcile it with
the actual SQLAlchemy models before treating it as the database schema.

``` mermaid
erDiagram
    USER ||--o{ SIGHTING : records
    ANIMAL_PROFILE ||--o{ REFERENCE_IMAGE : has
    ANIMAL_PROFILE ||--o{ SIGHTING : associated_with
    SIGHTING ||--o{ IDENTIFICATION_RESULT : produces
    IDENTIFICATION_RESULT ||--o{ CANDIDATE_MATCH : contains
    USER ||--o{ REVIEW_DECISION : submits
    IDENTIFICATION_RESULT ||--o{ REVIEW_DECISION : reviewed_by

    USER {
        string id
        string role
    }
    ANIMAL_PROFILE {
        string id
        string species
        string profile_status
    }
    REFERENCE_IMAGE {
        string id
        string animal_profile_id
        string image_reference
    }
    SIGHTING {
        string id
        string animal_profile_id
        datetime observed_at
        string location_reference
        string review_status
    }
    IDENTIFICATION_RESULT {
        string id
        string sighting_id
        string result_status
    }
    CANDIDATE_MATCH {
        string id
        string result_id
        string animal_profile_id
        float similarity_value
        int rank
    }
    REVIEW_DECISION {
        string id
        string result_id
        string reviewer_id
        string decision
    }
```

## Security and responsible use

Because the platform may process sensitive wildlife locations and
operational records: - Require authentication for protected workflows. -
Apply role-based access to administrative, reviewer, and field-user
actions. - Keep API keys, service tokens, and database credentials out
of source control. - Store secrets in environment variables or the
deployment platform's secret manager. - Restrict access to precise
animal locations and sensitive incident information. - Use HTTPS for
deployed API traffic. - Validate uploaded files and enforce
file-size/type limits. - Back up database records, images, and vector
indexes. - Define data-retention and access policies with the relevant
forest authority. - Keep human review in the identity-confirmation
process. - Do not expose sensitive wildlife coordinates in public-facing
views.

This README does not replace a security review, field-safety review, or
approval from the relevant authority.

## Local development

The commands below are a starting point. Confirm the actual package
paths, entry points, and environment variable names in the repository
before running them.

### Prerequisites

-   Python version supported by the backend and ML dependencies.
-   Node.js version supported by the Expo project.
-   npm or the package manager used by the mobile project.
-   Git.
-   Required model weights and data assets.
-   Access to the configured database and image storage.

### Clone the repository

``` bash
git clone <YOUR_REPOSITORY_URL>
cd JeevDrishti
```

### Backend setup

``` bash
cd backend
python -m venv .venv
```

Activate the environment:

**Windows PowerShell**

``` powershell
.venv\Scripts\Activate.ps1
```

**macOS / Linux**

``` bash
source .venv/bin/activate
```

Install dependencies:

``` bash
pip install -r requirements.txt
```

Create the local environment file using the variables expected by the
backend. Do not commit real credentials.

If the FastAPI entry point is `app.main:app`, start it with:

``` bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

When enabled, interactive API documentation is commonly available at
`http://localhost:8000/docs`.

### ML service setup

Install the ML service's own dependencies in its supported Python
environment. Configure model paths, inference settings, service
authentication, and the backend-to-ML service URL using environment
variables. Start the service using the entry point defined in that
component.

The ML service should be reachable from the backend environment. Do not
place model credentials or service tokens in client-side configuration.

### Mobile setup

``` bash
cd mobile
npm install
```

Create the local environment file expected by the Expo project. For
example:

``` env
EXPO_PUBLIC_API_URL=http://<DEVELOPMENT_MACHINE_LAN_IP>:8000
```

Start Expo:

``` bash
npx expo start
```

For a physical device, ensure it can reach the development machine over
the network, or use the supported USB/ADB development workflow.

### Web setup

If the web client is maintained as a separate package, install its
dependencies and configure its API base URL according to that package's
own scripts and environment configuration.

## Configuration

Use the actual variable names in the repository's `.env.example` files.
Common configuration categories include:

  Configuration                 Purpose
  ----------------------------- ---------------------------------------------
  API host and port             Backend bind address
  Database URL                  Database connection
  ML service URL                Backend-to-inference service address
  ML service token              Authenticates backend requests to inference
  Model/checkpoint paths        Detector and embedding model weights
  Image storage path/provider   Uploaded and reference image storage
  FAISS index path              Enrolled vector index location
  Upload limits                 Accepted file sizes and types
  CORS origins                  Allowed browser origins
  Authentication settings       Session/token behaviour

Keep `.env` files, credentials, tokens, private datasets, model weights,
and user data out of Git unless there is an explicit secure and approved
storage policy.

## Testing and evaluation

Run tests from each component directory using the commands defined by
the repository.

Backend example:

``` bash
cd backend
pytest
```

ML service example:

``` bash
cd ml-service
pytest
```

For the mobile project, use only scripts defined in `package.json`, such
as:

``` bash
npm test
npm run lint
npx tsc --noEmit
```

### Recommended validation coverage

-   Backend and ML-service API compatibility.
-   Authentication and role-based permissions.
-   Image upload validation and failure handling.
-   Detection and crop handling.
-   Embedding generation and vector retrieval.
-   Top-5 ranking behaviour.
-   Not Identified behaviour for unenrolled animals.
-   Human review and decision persistence.
-   Sighting-to-profile association and movement-history display.
-   Offline capture, retries, and duplicate-safe synchronisation.
-   Historical incident mapping.
-   Access restrictions for sensitive location data.

### Reporting model performance

For a credible evaluation, document the dataset source and permissions,
identity-separated train/validation/test splits, number of identities
and images, image conditions, Top-1 and Top-5 retrieval metrics,
false-match rate, unknown-animal rejection performance, and results
across distance, blur, lighting, and viewpoint conditions.

Do not report accuracy, precision, recall, or false-match figures unless
measured under a documented, reproducible evaluation protocol. A
successful integration test, synthetic test, or small demo-gallery smoke
test is not a field-accuracy result.

## Deployment considerations

A production deployment should address:

1.  **Backend hosting:** deploy FastAPI with HTTPS and production
    environment variables.
2.  **ML hosting:** deploy inference where model dependencies and
    compute requirements are supported.
3.  **Database:** use persistent database infrastructure suitable for
    concurrent users. SQLite is useful for local development but should
    not be assumed to be a production multi-user database.
4.  **Image storage:** use durable storage with access controls and
    backup policies.
5.  **Vector index:** persist and version the FAISS index with metadata
    mapping vectors to animal profiles.
6.  **Mobile configuration:** build with the production API URL and test
    offline synchronisation against the deployed backend.
7.  **Observability:** monitor application errors, inference failures,
    sync failures, and review events without leaking sensitive
    coordinates or credentials.
8.  **Operational validation:** test with representative data and
    workflows in collaboration with the relevant forest authority.

A deployment is not complete until authentication, authorisation,
backups, monitoring, data retention, and recovery procedures have been
tested.

## Future scope

Potential directions include broader field validation, improved gallery
management, more comprehensive offline-sync observability, additional
reporting tools for forest teams, responsible wildlife-tourism
information, and anti-poaching monitoring support. Tourism and
anti-poaching applications are future possibilities and should not be
presented as delivered capabilities unless implemented and validated
with the relevant authorities.

## Team and acknowledgements

**Project:** JeevDrishti --- Wildlife Re-Identification and Monitoring
Platform\
**Team:** Darshan Wagde and Aditya Kumar Roy\
**Achievement:** First Prize, WildHack 2026 (₹50,000)\
**Organised by:** Tadoba-Andhari Tiger Reserve in collaboration with
BITS Ballarpur


## License

**Proprietary — All Rights Reserved.**

The JeevDrishti project materials are proprietary. No permission is granted to use, copy, modify, distribute, sublicense, or deploy this project, in whole or in part, without prior written permission from the copyright holders. Making this repository publicly visible does not grant usage rights.

See the [`LICENSE`](LICENSE) file for the full terms. Third-party libraries, models, datasets, and assets remain subject to their respective licenses and terms; this project license does not override them.
