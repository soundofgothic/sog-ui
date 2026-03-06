# CLAUDE.md — SoundOfGothic UI

This file provides guidance for AI assistants (Claude Code) working on the **sog-ui** codebase.

---

## Project Overview

`sog-ui` is an **Angular 6 Universal** single-page application that serves as the web frontend for [soundofgothic.pl](https://soundofgothic.pl) — a community website for browsing and managing Polish dubbing audio files from the video games **Gothic I** and **Gothic II: Night of the Raven**.

The app communicates with a separate REST API (`soundofgothic/sog-api`). It uses **Server-Side Rendering (SSR)** via Angular Universal and Express.js.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 6.1.10 |
| Language | TypeScript 2.7.2 |
| UI components | Angular Material 7.3.5 |
| SSR | Angular Universal 6.0.0 + Express.js |
| State | RxJS 6 (BehaviorSubject / Subject) |
| Audio playback | Pizzicato 0.6.4 |
| Build | Angular CLI 6.1.3 + Webpack |
| Linting | TSLint 5.9.1 |
| Testing | Jasmine + Karma (unit), Protractor (e2e) |
| Containerization | Docker (node:14) |
| Orchestration | Kubernetes |
| CI/CD | GitHub Actions |

---

## Repository Layout

```
sog-ui/
├── src/
│   ├── app/
│   │   ├── access/          # Auth: login, register, AuthGuard, UserService
│   │   ├── items/           # List item components (TextItem, SfxItem, PlayButton, …)
│   │   ├── layout/          # BasicLayout, combo-boxes, info panel
│   │   ├── panels/          # Content panels: TextsPanel, SfxPanel, RecordPanel
│   │   ├── routing/         # Angular RouterModule configuration
│   │   ├── services/        # Core services + domain types
│   │   ├── app.module.ts
│   │   ├── app.browser.module.ts
│   │   ├── app.server.module.ts
│   │   ├── app.component.ts
│   │   └── interceptor.ts   # HTTP interceptor (base URL + auth token)
│   ├── environments/        # environment.ts / environment.prod.ts
│   ├── assets/              # Fonts, static files
│   ├── styles.css           # Global styles + Material theme
│   ├── main.ts              # Browser bootstrap
│   └── main.server.ts       # Server bootstrap
├── docker/Dockerfile
├── server.ts                # Express SSR server
├── local.js                 # Local dev server helper
├── webpack.server.config.js
├── angular.json
├── tsconfig.json
├── tslint.json
├── Makefile
├── k8s.yml
└── .github/workflows/release.yml
```

---

## Common Development Commands

```bash
# Start development server (port 4200, hot-reload)
npm start              # or: ng serve

# Run TSLint
npm run lint

# Development build (browser only, no SSR)
npm run build

# Full production build (browser + server bundles)
npm run build:prod

# Run unit tests (Karma + Jasmine)
npm test

# Run e2e tests (Protractor)
npm run e2e

# Start the SSR node server locally (requires a prior production build)
npm run server
```

---

## Environment & Configuration

### Development
- API base URL: `http://localhost:3001`
- Sounds assets URL: `http://localhost`
- Configured in `src/environments/environment.ts`

### Production
- API base URL: `https://api.soundofgothic.pl` (or `BROWSER_API_URL` / `SERVER_API_URL` env vars)
- Sounds URL: `https://soundsv2.soundofgothic.pl` (or `BROWSER_SOUNDS_ASSETS_URL` env var)
- Config is injected at runtime via `window.CONFIG` by the Express server

### Runtime environment variables (Docker / K8s)
| Variable | Purpose |
|---|---|
| `API_URL` | API base URL (both browser and server) |
| `BROWSER_API_URL` | API URL used by the browser client |
| `SERVER_API_URL` | API URL used during server-side rendering |
| `SOUNDS_ASSETS_URL` | Audio assets CDN URL |
| `BROWSER_SOUNDS_ASSETS_URL` | Audio CDN URL for browser |
| `PORT` | HTTP port for Express server (default: 8080) |

---

## Core Services

### `CollectorService` (`src/app/services/collector.service.ts`)
The central state/search service. Holds all search results and filter state.

- **`observedRecords`** — `BehaviorSubject<RecordingsResponse>` — current search results
- **`observedMetadata`** — `BehaviorSubject<Metadata>` — pagination/filter metadata
- **`loading`** — `BehaviorSubject<boolean>` — loading indicator
- **`lastSearchConfig`** — `BehaviorSubject<SearchConfig>` — current search parameters
- **`recordMode`** — `BehaviorSubject<boolean>` — whether a single record is open

Key methods: `search()`, `filterText()`, `filterVersions()`, `filterVoices()`, `filterNPCs()`, `filterGuilds()`, `filterScripts()`, `filterTags()`, `nextPage()`, `previousPage()`, `updatePageSize()`.

### `UserService` (`src/app/access/user.service.ts`)
Handles login/logout and token storage via `localStorage`.

### `VoiceService`, `NpcService`, `GuildService`, `ScriptsService`
Fetch filter-option data from the API.

### `SfxService` (`src/app/services/sfx.service.ts`)
Handles SFX reports: submitting (`/sfx/report`) and resolving (`/sfx/resolve`).

### `URLParamsService` (`src/app/services/urlparams.service.ts`)
Syncs Angular query parameters with the browser address bar.

---

## HTTP Interceptor (`src/app/interceptor.ts`)
All HTTP requests are intercepted to:
1. Prepend the configured `apiUrl` to relative request URLs.
2. Attach a `Bearer <token>` `Authorization` header when the user is authenticated.
3. Display a `MatSnackBar` error toast on non-401 HTTP errors.

---

## Routing

| Path | Component | Auth required |
|---|---|---|
| `/` | `TextsPanelComponent` | No |
| `/text` | `TextsPanelComponent` | No |
| `/sfx` | `SfxPanelComponent` | No |
| `/record/:g/:name` | `RecordPanelComponent` | No |
| `/reports/sfx` | `SfxPanelExtendedComponent` | **Yes** (`AuthGuard`) |
| `/login` | `LoginComponent` | No |
| `/register` | `RegisterComponent` | No |

---

## Domain Types (`src/app/services/domain.ts`)

| Type | Description |
|---|---|
| `Recording` | Single audio recording with transcript, NPC, guild, voice, game info |
| `Game` | Gothic I or Gothic II |
| `SourceFile` | Script file of type `guild`, `svm`, or `mission` |
| `NPC` | In-game NPC entity |
| `Guild` | In-game faction/guild |
| `Voice` | Voice actor assignment |
| `PagedResponse<T>` | Paginated API response wrapper |

---

## Search Types (`SearchType` enum)

| Value | API endpoint | Route |
|---|---|---|
| `TEXT` (0) | `/recordings` | `/text` |
| `SOURCE` (1) | `/recordings` | `/text` |
| `REPORT` (2) | `/reports` | `/reports` |
| `SFX` (3) | `/sfx` | `/sfx` |
| `SFX_E` (4) | `/sfx` (sorted by reported) | `/reports/sfx` |

---

## SSR Notes

- The app is rendered server-side using Angular Universal + `@nguniversal/express-engine`.
- `server.ts` boots Express, renders Angular, and injects `window.CONFIG` with runtime configuration.
- The `@ng-toolkit/universal` package provides SSR-safe `LOCAL_STORAGE` and `WINDOW` tokens — always use these instead of direct browser globals.
- Platform checks (`isPlatformBrowser`) are needed for any browser-only APIs.

---

## Build & Deployment

### Docker
```bash
# Build image (tagged with current git short hash)
make docker

# Build and push to Docker Hub (requires clean working tree)
make docker-push

# Print image version
make version
```

### Kubernetes
`k8s.yml` contains a `Service` (LoadBalancer, port 80→8080) and a `Deployment` (single replica). Template variables: `${PROJECT_NAME}`, `${DOCKERHUB_REPO_NAME}`, `${CIRCLE_SHA1}`.

### GitHub Actions (`release.yml`)
Triggered on push to `v2/main`. Steps:
1. Calculate next semantic version tag.
2. Build multi-platform Docker image (`linux/amd64`, `linux/arm64`).
3. Push image to Docker Hub.
4. Create and push a git version tag.

---

## Testing

Unit tests exist only as scaffolded stubs — functional coverage is minimal. The project README acknowledges this intentionally. Do **not** expect existing tests to provide safety nets when refactoring.

E2E tests use Protractor (`e2e/`) with a page-object pattern (`e2e/src/app.po.ts`).

---

## Code Style

- TSLint config in `tslint.json`.
- Follow Angular style guide conventions (one class per file, `PascalCase` for classes, `camelCase` for variables/methods).
- Reactive patterns preferred — use `BehaviorSubject`/`Subject` for shared state, avoid direct property mutation across components.
- Use `@ng-toolkit/universal` tokens (`LOCAL_STORAGE`, `WINDOW`) instead of `window`/`localStorage` directly.
- Error strings and UI messages are currently in **Polish** (the target audience is Polish-speaking users).

---

## Known Limitations / Things to Be Aware Of

1. **Angular 6 / legacy stack** — Many packages are outdated. Be careful when recommending upgrades; they may require significant migration work.
2. **No meaningful unit tests** — Rely on manual testing and e2e tests.
3. **`UserService.logged()` always returns `false`** — The authentication guard will always redirect to `/login`. This appears to be an intentional placeholder for a feature not yet implemented.
4. **Polish language** — Error messages, some UI labels, and commit messages may be in Polish.
5. **Pizzicato** — The audio library (`pizzicato`) is browser-only. Wrap any usage in `isPlatformBrowser` guards.
