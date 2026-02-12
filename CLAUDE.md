# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Kova — AI-agent-powered multi-format content creation platform. Users create once, publish everywhere. Key differentiator: Style Reference System that extracts stylistic patterns from example content.

Monorepo:
- `/server` — Python / FastAPI (hexagonal architecture)
- `/web` — Next.js on Cloudflare Workers
- `/infra` — Pulumi (GCP, Cloudflare, Neon)

## Build & Dev Commands

### Server (`cd server`)
```bash
uv run uvicorn app.main:app --reload  # Dev server
uv run pytest                          # Run all tests
uv run pytest -k "test_style"          # Run tests matching pattern
uv run alembic upgrade head            # Run migrations
uv sync                                # Install dependencies (lockfile: uv.lock)
```

### Web (`cd web`)
```bash
bun dev                                # Next.js dev server
bun run build                          # Production build
bun run lint                           # ESLint
bun test                               # Run tests
```

### Infra (`cd infra`)
```bash
pulumi preview                         # Preview changes
pulumi up                              # Deploy changes
```

## Infrastructure

| Component | Technology |
|---|---|
| Backend API | FastAPI (Python) on GCP Cloud Run |
| Web Frontend | Next.js on Cloudflare Workers |
| Database | Neon DB (Serverless PostgreSQL) |
| Job Queue | Google Cloud Tasks |
| Scheduler | Google Cloud Scheduler (cron triggers for pipelines + trend collection) |
| Event Bus | Google Pub/Sub (fan-out) |
| File Storage | Cloudflare R2 |
| Real-time | SSE (Server-Sent Events) |
| Package Mgmt | uv (lockfile committed: uv.lock) |
| Error Tracking | Sentry |

## Principles (MUST CONFORM TO)

1. All implementation must use skills:
   - server: Use **fastapi-hexagonal** skill + **postgresql** skill for queries
   - web: Use **nextjs** skill
2. Once the implementation is complete, run the two sub-agents below in parallel:
   - Run a **security-reviewer** sub-agent for security audit → fix
   - Run a **tester** sub-agent for testing only changed code → fix

## Server

### Workflow
1. **data-modeling** → **database-reviewer** (agent) → **api-design** (plan)
2. **fastapi-hexagonal** (implementation) + **postgresql** (queries)

### Architecture — Hexagonal (Ports & Adapters)

Dependencies always point inward. Domain never imports from `inbound/` or `outbound/`.

```
INBOUND (FastAPI Routes, Cloud Tasks Handler, Webhooks)
    → DOMAIN (Models, Errors, Ports/Protocols, Services)
        → OUTBOUND (Postgres, Claude/OpenAI, R2, Deployers)
```

| Layer | Responsibility | Key Rule |
|---|---|---|
| Domain | Business logic, frozen dataclass models, Protocol ports, services | Never imports from inbound/ or outbound/. No FastAPI, no SQLAlchemy, no SDKs. |
| Inbound | HTTP routes, Cloud Tasks handlers, webhooks | Parse input → call service → map response. No SQL. No business logic. |
| Outbound | Protocol implementations | Implements domain Protocols. Owns transactions. Maps infra errors to domain errors. |
| App (Bootstrap) | Constructs adapters, wires services, starts app | No FastAPI/SQLAlchemy imports in main.py. Pure assembly. |

### Domain Boundaries

| Domain | Responsibility | Key Models |
|---|---|---|
| pipeline | Orchestration, run state, step execution | Pipeline, PipelineRun, StepConfig, PipelineContext |
| steps | Step execution contracts and registry | StepInput, StepOutput, StepProgress |
| style | Reference analysis, profile management | StyleProfile, StyleAttribute, ReferenceSource |
| content | Assets, transformations, deployment | ContentAsset, DeployRecord, TransformResult |
| trends | Trend signals, topic aggregation | TrendSignal, TrendTopic |

### Key Protocols (Ports)

| Category | Protocol | Purpose |
|---|---|---|
| Repository | PipelineRepository | Pipeline and run persistence |
| Repository | StyleProfileRepository | Style profile storage |
| Repository | TrendRepository | Trend signal and topic storage |
| AI Provider | LLMProvider | Text generation — scripts, ideas, analysis |
| AI Provider | Transcriber | Audio/video → timestamped text |
| AI Provider | VisionProvider | Image/video understanding |
| AI Provider | FaceDetector | Face detection and tracking |
| AI Provider | SceneDetector | Visual scene/cut detection |
| AI Provider | DiarizationProvider | Speaker identification |
| AI Provider | TTSProvider | Text → speech audio |
| AI Provider | ImageGenerator | Text → image (thumbnails) |
| AI Provider | EmbeddingProvider | Text → vector embeddings |
| AI Provider | VideoManipulator | Video ops (cut, crop, caption) |
| Provider | StorageProvider | File storage (S3-compatible) |
| Provider | ReferenceFetcher | Content retrieval from URLs/files |
| Target | DeployTarget | Content publishing to platforms |
| Target | ContentTransformer | Format conversion (long → thread, etc.) |
| Collector | TrendCollector | External trend data fetching |
| Step | PipelineStep | Pipeline step execution contract |

### Pipeline Execution Model

Each step runs as a separate Cloud Run request triggered by Cloud Tasks. Steps are stateless — all state in Neon DB.

**Trigger modes:** One-time (user clicks Run) or Scheduled (Cloud Scheduler cron). Scheduled pipelines require saved style profile + configured niche.

**Run states:** pending → running → waiting_for_approval → completed | partially_completed | failed | cancelled

**Human gates:** Pipeline pauses (no active request), user reviews via API, approval enqueues next step. Scheduled runs support full autopilot, review-before-publish, or per-platform approval.

**Fan-out:** Parallel transforms via Cloud Tasks/Pub/Sub. Branches tracked by `branch_index`. Failures don't block siblings.

**Progress:** Steps report to DB. Frontend receives SSE updates (polling DB every 2s, streaming to client).

### Folder Structure (`server/src/`)
```
app/
  main.py                          # Bootstrap ONLY — no framework imports
  application.py                   # App orchestrator
  config.py                        # pydantic-settings

domain/                            # ━━ NEVER imports from inbound/ or outbound/ ━━
  pipeline/                        # models.py, errors.py, ports.py, service.py
  steps/                           # models.py, errors.py, ports.py, registry.py
  style/                           # models.py, errors.py, ports.py, service.py
  content/                         # models.py, errors.py, ports.py, service.py
  trends/                          # models.py, errors.py, ports.py, service.py

inbound/                           # ━━ Drives the domain ━━
  http/
    shell.py                       # Shell class wrapping FastAPI + uvicorn
    errors.py                      # Exception handlers → RFC 9457 ProblemDetails
    dependencies.py                # DI via lifespan state + request.state
    response.py                    # ApiSuccess, Created, Ok, NoContent
    pipeline/                      # router.py, request.py, response.py
    style/                         # router.py, request.py, response.py
    platform/                      # router.py, request.py, response.py
  tasks/
    handler.py                     # Cloud Tasks step execution
    webhook.py                     # External service webhooks

outbound/                          # ━━ Implements domain Protocols ━━
  postgres/                        # repositories, ORM models (ONLY here), mappers
  llm/                             # claude.py, openai.py (impl LLMProvider)
  storage/                         # r2.py, local.py (impl StorageProvider)
  deploy/                          # x_twitter.py, youtube.py, instagram.py, export.py (impl DeployTarget)
  transcription/                   # faster_whisper.py (impl Transcriber)
  tts/                             # kokoro.py (impl TTSProvider)
  image_gen/                       # pollinations.py (impl ImageGenerator)
  video/                           # ffmpeg.py (impl VideoManipulator)
  face_detection/                  # mediapipe.py (impl FaceDetector)
  scene_detection/                 # pyscenedetect.py (impl SceneDetector)
  diarization/                     # pyannote.py (impl DiarizationProvider)
  embeddings/                      # minilm.py (impl EmbeddingProvider)
  fetcher/                         # web.py, youtube_transcript.py, file.py (impl ReferenceFetcher)
  trends/                          # reddit.py, youtube.py, google_trends.py (impl TrendCollector)
```

### Conventions
- **Models**: `@dataclass(frozen=True)`, no ORM coupling
- **Errors**: exhaustive hierarchy per domain, never `HTTPException`
- **Ports**: `typing.Protocol` classes in `ports.py` (structural subtyping)
- **Services**: orchestrate repos + providers, called by inbound handlers
- **Shell**: FastAPI wrapped in Shell class (`Shell.build_test_app()` for testing)
- **DI**: lifespan state + `request.state` (no framework DI container)
- **Request schemas**: `try_into_domain()` to convert to domain types
- **Response schemas**: `from_domain()` classmethod from domain models
- **Adapters**: each implements a domain Protocol
- **Transactions**: encapsulated, invisible to callers. No external calls inside DB transactions.
- **ORM models**: ONLY in `outbound/postgres/models.py`
- **Mappers**: explicit `to_domain()` / `from_domain()`
- **Infra errors**: caught → re-raised as domain errors

### Async Safety
- All I/O must be async in async routes
- SQLAlchemy: `expire_on_commit=False`, `selectinload()`, per-request session
- Pool: `pool_size=10`, `pool_timeout=3`, `pool_pre_ping=True`
- LLM/storage/deploy via `httpx.AsyncClient`

## Web

### Workflow
1. **nextjs** (implementation)
2. **vercel-react-best-practices** (review)

### Folder Structure (Feature-Sliced Design)
```
app/                 # Next.js App Router (file-based routing)
├── layout.tsx       # Root layout
├── page.tsx         # Home (/)
└── some-page/
    └── page.tsx     # /some-page (routing + page composition)
src/
├── app/             # App-wide settings, providers, global styles
│   └── providers/
├── widgets/         # Large composite blocks (Header, Sidebar, Feed)
├── features/        # User interactions (auth, send-comment, add-to-cart)
│   └── auth/
│       ├── ui/
│       ├── model/
│       ├── api/
│       └── actions/   # Server Actions
├── entities/        # Business entities (user, product, order)
│   └── user/
│       ├── ui/
│       ├── model/
│       └── api/
└── shared/          # Reusable infrastructure
    ├── ui/          # Design system
    ├── lib/         # Utilities, helpers
    ├── api/         # API client
    └── config/      # Environment, constants
```

### FSD Import Rules
app → widgets → features → entities → shared (never import upward)

## Core Tech stacks
- **Next.js**: React framework for server-rendered applications.
- **TypeScript**: Static type checker for JavaScript.
- **Tailwind CSS**: Utility-first CSS framework.
- **Tanstack Query**: Data fetching and caching library for client components.
- **Zod**: TypeScript-first schema validation library.
- **Shadcn-ui**: Design system.

### Conventions
- **i18n**: all texts should be in English and Korean, and should be consistent across the app.
