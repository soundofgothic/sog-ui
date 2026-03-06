# SoundOfGothic UI

A web application for browsing and managing the Polish voice dubbing recordings from the classic RPG games **Gothic I** and **Gothic II: Night of the Raven**. Built with Angular Universal (SSR) and Angular Material.

- **Production site:** [soundofgothic.pl](https://soundofgothic.pl)
- **Docker Hub:** [soundofgothic/ui](https://hub.docker.com/r/soundofgothic/ui)
- **API repository:** [soundofgothic/sog-api](https://github.com/soundofgothic/sog-api) (same GitHub organisation)

---

## Table of Contents

1. [Features](#features)
2. [Architecture Overview](#architecture-overview)
3. [Prerequisites](#prerequisites)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Configuration](#configuration)
7. [Available Scripts](#available-scripts)
8. [Routing](#routing)
9. [Core Services](#core-services)
10. [Data Model](#data-model)
11. [API Reference](#api-reference)
12. [Authentication](#authentication)
13. [Styling](#styling)
14. [Server-Side Rendering (SSR)](#server-side-rendering-ssr)
15. [Building for Production](#building-for-production)
16. [Docker](#docker)
17. [Kubernetes](#kubernetes)
18. [CI/CD Pipeline](#cicd-pipeline)
19. [Testing](#testing)
20. [Contributing](#contributing)

---

## Features

- **Full-text search** of thousands of Polish voice recordings from Gothic I & II.
- **Multi-filter search** — filter by game version, NPC, guild (faction), voice actor, and script source file.
- **In-browser audio playback** using the Pizzicato audio library.
- **Paginated results** with device-responsive page sizes (10 on mobile, 50 on desktop).
- **SFX (Sound Effects) browser** — explore and manage sound effects separately.
- **Recording detail view** — view metadata and related recordings for a single audio file.
- **Tag-based filtering** for sound effects.
- **Report system** — authenticated users can report and resolve SFX issues.
- **User authentication** — login/register with JWT token-based sessions.
- **Server-Side Rendering** — initial page load is server-rendered for SEO and performance.
- **URL state synchronisation** — all search filters are reflected in the URL (bookmarkable, shareable).

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│  Angular SPA (client-side hydration after SSR)   │
│                                                  │
│  ┌──────────┐  ┌─────────┐  ┌────────────────┐  │
│  │ Layout   │  │ Panels  │  │  Item Components│  │
│  │ (search, │  │ (Texts, │  │  (TextItem,     │  │
│  │  filters,│  │  SFX,   │  │   SfxItem,      │  │
│  │  paging) │  │  Record)│  │   PlayButton)   │  │
│  └────┬─────┘  └────┬────┘  └────────────────┘  │
│       │             │                             │
│       └──────┬──────┘                             │
│              ▼                                    │
│     ┌─────────────────┐                          │
│     │  CollectorService│ ◄─── URL params ────────│
│     │  (search state) │                          │
│     └────────┬────────┘                          │
│              │ HttpClient + Interceptor           │
└──────────────┼──────────────────────────────────┘
               ▼
┌─────────────────────────────────────────────────┐
│         Express SSR Server (server.ts)           │
│  - Angular Universal rendering                   │
│  - Injects window.CONFIG at runtime              │
│  - Serves static assets with 1-year cache        │
└─────────────────────────────────────────────────┘
               ▼
┌─────────────────────────────────────────────────┐
│          REST API (sog-api)                      │
│  https://api.soundofgothic.pl                   │
└─────────────────────────────────────────────────┘
               ▼
┌─────────────────────────────────────────────────┐
│        Audio CDN                                 │
│  https://soundsv2.soundofgothic.pl              │
└─────────────────────────────────────────────────┘
```

**Key technology decisions:**
- **Angular Universal (SSR)** — renders pages on the server so search engines can index recordings, and so users see content faster on first load.
- **RxJS BehaviorSubject** — chosen over NgRx/Redux for lightweight reactive state management.
- **URL as state** — every search configuration is serialised into query parameters so the page is bookmarkable and shareable.
- **HTTP Interceptor** — handles base URL injection and Bearer token attachment in a single place.

---

## Prerequisites

| Tool | Minimum version |
|---|---|
| Node.js | 14.x |
| npm | 6.x |
| Angular CLI | 6.1.x (`npm install -g @angular/cli@6`) |
| Docker | 20.x *(optional, for containerised builds)* |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/soundofgothic/sog-ui.git
cd sog-ui
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The app reloads automatically on file changes.

By default the development server points to the **public production API** at `https://api.soundofgothic.pl`. To use a local API instance, edit `src/environments/environment.ts`:

```ts
export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:3001',       // your local API
  soundsAssetsUrl: 'http://localhost',   // your local audio server
};
```

---

## Project Structure

```
sog-ui/
├── src/
│   ├── app/
│   │   ├── access/                     # Authentication
│   │   │   ├── login/                  # Login page component
│   │   │   ├── register/               # Registration page component
│   │   │   ├── auth.guard.ts           # Route guard (redirects to /login)
│   │   │   ├── user.service.ts         # Auth state + API calls
│   │   │   ├── access.module.ts        # Access feature module
│   │   │   └── access-routing.module.ts
│   │   │
│   │   ├── items/                      # Reusable list-item components
│   │   │   ├── play-button/            # Audio play/stop button
│   │   │   ├── text-item/              # Dialogue recording list item
│   │   │   ├── sfx-item/               # SFX list item
│   │   │   ├── sfx-item-extended/      # SFX item with report controls
│   │   │   └── filter-descriptor/      # Active filter chip/tag display
│   │   │
│   │   ├── layout/                     # App shell
│   │   │   ├── basic-layout/           # Main page shell (search bar, filters, pagination)
│   │   │   ├── combo-box/              # Generic searchable dropdown
│   │   │   ├── versions-combo-box/     # Game version filter dropdown
│   │   │   ├── tags-combo-box/         # Tag multi-select filter
│   │   │   └── info-panel-component/   # Right-side info panel
│   │   │
│   │   ├── panels/                     # Primary content views (router outlets)
│   │   │   ├── texts-panel/            # Dialogue search results
│   │   │   ├── sfx-panel/              # SFX search results
│   │   │   ├── sfx-panel-extended/     # SFX management panel (auth-only)
│   │   │   └── record-panel/           # Single recording detail view
│   │   │
│   │   ├── routing/
│   │   │   └── routing-module/
│   │   │       └── routing.module.ts   # All Angular routes
│   │   │
│   │   ├── services/
│   │   │   ├── domain.ts               # TypeScript types / interfaces
│   │   │   ├── collector.service.ts    # Central search & pagination service
│   │   │   ├── voice.service.ts        # Voice actor filter data
│   │   │   ├── npc.service.ts          # NPC filter data
│   │   │   ├── guild.service.ts        # Guild filter data
│   │   │   ├── scripts.service.ts      # Script source file filter data
│   │   │   ├── sfx.service.ts          # SFX report operations
│   │   │   ├── report.service.ts       # General report fetching
│   │   │   └── urlparams.service.ts    # Query-param ↔ state sync
│   │   │
│   │   ├── app.component.ts            # Root component
│   │   ├── app.module.ts               # Root NgModule
│   │   ├── app.browser.module.ts       # Browser-specific bootstrap module
│   │   ├── app.server.module.ts        # SSR bootstrap module
│   │   ├── interceptor.ts              # HTTP interceptor
│   │   └── tokens.ts                   # DI tokens
│   │
│   ├── environments/
│   │   ├── environment.ts              # Development config
│   │   ├── environment.prod.ts         # Production config (replaced at build time)
│   │   └── environment.type.ts         # Shared Environment interface
│   │
│   ├── assets/
│   │   └── fonts/font.ttf              # Custom UI font
│   ├── styles.css                      # Global styles + Material theme
│   ├── index.html
│   ├── main.ts                         # Browser entry point
│   ├── main.server.ts                  # Server entry point
│   └── test.ts                         # Karma test entry
│
├── e2e/                                # End-to-end tests (Protractor)
│   └── src/
│       ├── app.e2e-spec.ts
│       └── app.po.ts
│
├── docker/
│   └── Dockerfile
│
├── .github/
│   └── workflows/
│       └── release.yml                 # GitHub Actions CI/CD
│
├── server.ts                           # Express SSR server
├── local.js                            # Helper to run server locally
├── webpack.server.config.js            # Webpack config for server bundle
├── angular.json                        # Angular CLI workspace config
├── tsconfig.json                       # TypeScript config
├── tslint.json                         # TSLint rules
├── karma.conf.js → src/karma.conf.js   # Karma test runner config
├── Makefile                            # Docker build helpers
├── k8s.yml                             # Kubernetes manifests
└── package.json
```

---

## Configuration

### Environment files

| File | Used when |
|---|---|
| `src/environments/environment.ts` | `ng serve` / `ng build` (development) |
| `src/environments/environment.prod.ts` | `ng build --prod` (production browser bundle) |

```ts
// environment.type.ts
export interface Environment {
  production: boolean;
  apiUrl: string;        // REST API base URL
  soundsAssetsUrl: string; // Audio file CDN base URL
}
```

### Runtime configuration (production)

In production the Express server reads environment variables and injects them as `window.CONFIG` into the SSR'd HTML. This allows changing API endpoints **without rebuilding the image**.

| Environment variable | Default | Purpose |
|---|---|---|
| `API_URL` | `https://api.soundofgothic.pl` | API URL for both browser and server |
| `BROWSER_API_URL` | value of `API_URL` | API URL used by the browser client |
| `SERVER_API_URL` | value of `API_URL` | API URL used during server-side rendering |
| `SOUNDS_ASSETS_URL` | `https://soundsv2.soundofgothic.pl` | Audio CDN URL |
| `BROWSER_SOUNDS_ASSETS_URL` | value of `SOUNDS_ASSETS_URL` | Audio CDN URL for browser |
| `PORT` | `8080` | HTTP port for the Express server |

---

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start development server on port 4200 |
| `npm run build` | Development browser build → `dist/browser/` |
| `npm run build:prod` | Full production build (browser + server bundles) |
| `npm run build:browser:prod` | Production browser bundle only |
| `npm run build:server:prod` | Production server bundle only |
| `npm run server` | Start the SSR Express server (requires a prior production build) |
| `npm test` | Run unit tests with Karma |
| `npm run e2e` | Run end-to-end tests with Protractor |
| `npm run lint` | Run TSLint |

---

## Routing

All routes are defined in `src/app/routing/routing-module/routing.module.ts`.

| URL pattern | Component | Authentication |
|---|---|---|
| `/` | `TextsPanelComponent` | Public |
| `/text` | `TextsPanelComponent` | Public |
| `/sfx` | `SfxPanelComponent` | Public |
| `/record/:g/:name` | `RecordPanelComponent` | Public |
| `/reports/sfx` | `SfxPanelExtendedComponent` | **Required** (`AuthGuard`) |
| `/login` | `LoginComponent` | Public |
| `/register` | `RegisterComponent` | Public |
| `/**` | Redirects to `/` | — |

**URL query parameters (search state):**

| Parameter | Type | Description |
|---|---|---|
| `filter` | `string` | Full-text search query |
| `page` | `number` | Current page number |
| `pageSize` | `number` | Results per page |
| `type` | `number` | `SearchType` enum value |
| `gameID` | `number[]` | Filter by game version IDs |
| `voiceID` | `number[]` | Filter by voice actor IDs |
| `npcID` | `number[]` | Filter by NPC IDs |
| `guildID` | `number[]` | Filter by guild IDs |
| `sourceFileID` | `number[]` | Filter by script source file IDs |
| `tags` | `string[]` | Filter by tags (SFX) |

---

## Core Services

### `CollectorService`
**Location:** `src/app/services/collector.service.ts`

The heart of the application. Manages all search state and communicates with the API.

**Public observables:**

| Observable | Type | Description |
|---|---|---|
| `observedRecords` | `Subject<RecordingsResponse>` | Latest search results |
| `observedMetadata` | `BehaviorSubject<Metadata>` | Pagination & filter metadata |
| `loading` | `Subject<boolean>` | True while an API request is in flight |
| `lastSearchConfig` | `BehaviorSubject<SearchConfig>` | The current active search configuration |
| `recordMode` | `BehaviorSubject<boolean>` | True when a single record detail is shown |

**Key methods:**

| Method | Description |
|---|---|
| `search(configs, forceMode?)` | Compose a new `SearchConfig` and either redirect or fetch in place |
| `filterText(filter)` | Apply a text filter and navigate to page 1 |
| `filterVersions(versions)` | Apply game version filter |
| `filterVoices(voices)` | Apply voice actor filter |
| `filterNPCs(npcs)` | Apply NPC filter |
| `filterGuilds(guilds)` | Apply guild filter |
| `filterScripts(scripts)` | Apply source file filter |
| `filterTags(tags)` | Apply tag filter |
| `nextPage()` / `previousPage()` | Paginate through results |
| `updatePageSize(size)` | Change page size while preserving position |
| `getGNameRecord(version, filename)` | Load a single recording by game version + filename |
| `loadFamiliarRecordings(recording)` | Load all recordings from the same script source file |
| `reloadPage()` | Re-fetch using the current search configuration |

**`SearchType` enum:**

```ts
enum SearchType {
  TEXT   = 0,  // Search dialogues  → /recordings
  SOURCE = 1,  // Search by source  → /recordings
  REPORT = 2,  // Reports view      → /reports
  SFX    = 3,  // SFX browser       → /sfx
  SFX_E  = 4,  // SFX extended      → /sfx (sorted by reported)
}
```

---

### `UserService`
**Location:** `src/app/access/user.service.ts`

Handles user authentication state.

| Method | Description |
|---|---|
| `login(username, password)` | POST `/user/auth`, stores JWT in localStorage |
| `create(user)` | POST `/user/create` — register new user |
| `logged()` | Returns `Promise<boolean>` — currently always `false` (placeholder) |
| `logout()` | Clears localStorage, redirects to `/login` |
| `getToken()` | Returns stored JWT string |

---

### `VoiceService`, `NpcService`, `GuildService`, `ScriptsService`
Fetch autocomplete data for the filter dropdowns. Results are passed to `CollectorService.filterVoices()` etc.

---

### `SfxService`
**Location:** `src/app/services/sfx.service.ts`

| Method | Description |
|---|---|
| `report(sfxId, tags, description)` | POST `/sfx/report` — submit an SFX issue report |
| `resolve(sfxId)` | POST `/sfx/resolve` — mark an SFX report as resolved |

---

### HTTP Interceptor
**Location:** `src/app/interceptor.ts`

Automatically applied to every `HttpClient` request:
1. Prepends `config.apiUrl` to all relative URLs.
2. Adds `Authorization: Bearer <token>` header when a token exists in localStorage.
3. Shows a `MatSnackBar` error notification on HTTP errors (except 401).

---

## Data Model

All types are defined in `src/app/services/domain.ts`.

### `Recording`
```ts
type Recording = {
  id: number;
  wave: string;          // Audio filename (e.g. "DIA_NPC_1234.wav")
  transcript: string;    // Polish text of the dialogue line
  gameID: number;        // 1 = Gothic I, 2 = Gothic II
  game?: Game;
  sourceFileID: number;
  sourceFile?: SourceFile;
  npcID: number | null;
  npc?: NPC;
  guildID: number | null;
  guild?: Guild;
  voice?: Voice;
  voiceID: number;
};
```

### `SourceFile`
```ts
type SourceFile = {
  id: number;
  name: string;
  type: "guild" | "svm" | "mission";  // Script file category
  gameID: number;
  count: number;   // Number of recordings in this file
};
```

### `NPC`
```ts
type NPC = {
  id: number;
  name: string;
  inGameID: number;      // Game's internal NPC identifier
  inGameAlias: string;
  gameID: number;
  voiceID: number;
  guildID: number;
  count: number;
};
```

### `Guild`
```ts
type Guild = {
  id: number;
  name: string;          // e.g. "Bractwo Śniącego" (Sleeper's Brotherhood)
  inGameID: number;
  inGameAlias: string;
  gameID: number;
  count: number;
};
```

### `PagedResponse<T>`
```ts
type PagedResponse<T> = {
  total: number;     // Total matching results across all pages
  page: number;      // Current page (1-indexed)
  pageSize: number;
  results: T[];
};
```

---

## API Reference

All requests go through the HTTP interceptor which prepends the configured base URL (`https://api.soundofgothic.pl` in production).

### Recordings

| Method | Path | Query params | Description |
|---|---|---|---|
| GET | `/recordings` | `page`, `pageSize`, `filter`, `gameID[]`, `voiceID[]`, `npcID[]`, `guildID[]`, `sourceFileID[]` | Search/list dialogue recordings |
| GET | `/recordings/:gameID/:filename` | — | Get a single recording by game + filename |

### SFX (Sound Effects)

| Method | Path | Query params | Description |
|---|---|---|---|
| GET | `/sfx` | `page`, `pageSize`, `filter`, `tags[]`, `sortField` | List sound effects |
| POST | `/sfx/report` | — | Submit a report for an SFX issue |
| POST | `/sfx/resolve` | — | Mark an SFX report as resolved |

### Reports

| Method | Path | Description |
|---|---|---|
| GET | `/reports` | Get all reports (authenticated) |

### Filter Options

| Method | Path | Description |
|---|---|---|
| GET | `/voices` | Get all available voice actors |
| GET | `/npcs/:page` | Get paginated NPC list |
| GET | `/guilds/:page` | Get paginated guild list |
| GET | `/source-files` | Get all script source files |

### User / Authentication

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/user/auth` | `{ email, password }` | Login, returns JWT token |
| POST | `/user/create` | `{ email, password, … }` | Register a new user |

---

## Authentication

Authentication uses **JWT Bearer tokens** stored in `localStorage`.

**Login flow:**
1. User submits email + password on `/login`.
2. `UserService.login()` posts to `/user/auth`.
3. On success, the token and user data are stored in `localStorage` under the key `currentUser`.
4. The HTTP interceptor automatically attaches the token to subsequent requests.

**Logout flow:**
1. `UserService.logout()` removes `currentUser` from `localStorage` and redirects to `/login`.

**Route protection:**
`AuthGuard` (`src/app/access/auth.guard.ts`) calls `UserService.logged()` before activating protected routes. If the user is not logged in, they are redirected to `/login?returnUrl=<original-path>`.

> **Note:** `UserService.logged()` currently always returns `false` — the authenticated routes (`/reports/sfx`) are not accessible without modifying this method.

---

## Styling

- **Global theme:** Angular Material prebuilt theme `indigo-pink` (`@angular/material/prebuilt-themes/indigo-pink.css`).
- **Custom font:** `DefaultFont` loaded from `/assets/fonts/font.ttf`.
- **Responsive breakpoint:** UI elements are hidden/adjusted at `≤ 600px` viewport width. Page size is automatically reduced to 10 on mobile.
- **Component styles:** Each component has its own scoped CSS file alongside the TypeScript file.
- **Material icons:** Loaded from Google Fonts CDN.

---

## Server-Side Rendering (SSR)

The app uses **Angular Universal** for server-side rendering.

**How it works:**
1. Express (`server.ts`) receives an incoming request.
2. Angular Universal renders the route on the server and returns full HTML.
3. The Express server injects `window.CONFIG` into the HTML `<head>` — this contains the runtime API URLs so the browser-side Angular app knows where to send requests.
4. The browser downloads the static JS bundles and hydrates the server-rendered DOM.

**SSR-safe code practices:**
- Use `@ng-toolkit/universal` tokens instead of direct browser globals:
  ```ts
  // ✓ Correct
  constructor(@Inject(LOCAL_STORAGE) private localStorage: any,
              @Inject(WINDOW) private window: Window) {}

  // ✗ Avoid
  localStorage.getItem('key');
  window.innerWidth;
  ```
- Wrap browser-only code with `isPlatformBrowser(this.platformId)`.

---

## Building for Production

```bash
# Full production build (browser + server)
npm run build:prod

# This runs both:
#   ng build --prod                              → dist/browser/
#   ng run soundofgothic:server + webpack ...   → dist/server/

# Start the SSR server
npm run server
# Server listens on PORT env var (default 8080)
```

The build output:
- `dist/browser/` — static files (HTML, CSS, JS) served directly to browsers
- `dist/server/` — Node.js bundle for server-side rendering

---

## Docker

A `Dockerfile` is provided at `docker/Dockerfile`. It uses a `node:14` base image, runs the full production build inside the container, and starts the Express SSR server.

```bash
# Build image (tagged with current git commit short hash)
make docker
# → soundofgothic/ui:<short-hash>

# Build and push to Docker Hub (requires clean git status)
make docker-push

# Print the image tag that would be used
make version
```

**Run the container:**
```bash
docker run -p 8080:8080 \
  -e API_URL=https://api.soundofgothic.pl \
  -e SOUNDS_ASSETS_URL=https://soundsv2.soundofgothic.pl \
  soundofgothic/ui:<tag>
```

---

## Kubernetes

`k8s.yml` contains a minimal Kubernetes manifest with:
- **Service** — `LoadBalancer` type, exposes port 80, forwards to container port 8080.
- **Deployment** — single replica using the Docker Hub image.

Template variables that must be substituted before applying:
- `${PROJECT_NAME}` — deployment and service name
- `${DOCKERHUB_REPO_NAME}` — Docker Hub image name (e.g. `soundofgothic/ui`)
- `${CIRCLE_SHA1}` — image tag (full git commit SHA)

```bash
# Example using envsubst
PROJECT_NAME=sog-ui \
DOCKERHUB_REPO_NAME=soundofgothic/ui \
CIRCLE_SHA1=abc123 \
envsubst < k8s.yml | kubectl apply -f -
```

---

## CI/CD Pipeline

**File:** `.github/workflows/release.yml`
**Trigger:** Push to branch `v2/main`

**Steps:**
1. **Checkout** — full git history clone.
2. **Calculate version** — determine next semantic version tag from git history.
3. **Setup Docker Buildx + QEMU** — enables multi-platform builds.
4. **Build Docker image** — compiles a multi-platform image (`linux/amd64` + `linux/arm64`).
5. **Push to Docker Hub** — tagged with the calculated semantic version.
6. **Create git tag** — pushes the new version tag back to the repository.

Required GitHub Actions secrets:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

---

## Testing

### Unit Tests

```bash
npm test
```

Uses **Karma** with **Jasmine**. Test files are co-located with source files (`*.spec.ts`).

> The project has minimal unit test coverage — mostly generated stubs. Functional coverage relies on manual testing and the e2e test suite.

### End-to-End Tests

```bash
npm run e2e
```

Uses **Protractor** with a page-object pattern. Test files are in `e2e/src/`.

### Linting

```bash
npm run lint
```

Runs **TSLint** using the configuration in `tslint.json`.

---

## Contributing

1. Fork the repository and create a feature branch from `v2/main`.
2. Follow Angular style guide conventions.
3. Run `npm run lint` before committing.
4. Use conventional commit messages where possible.
5. Submit a Pull Request targeting `v2/main`.

For questions about the project, the Polish dubbing community, or the Gothic games, refer to the organisation at [github.com/soundofgothic](https://github.com/soundofgothic).
