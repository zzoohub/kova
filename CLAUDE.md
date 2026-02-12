# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Kova — AI-agent-powered multi-format content creation platform. Users create once, publish everywhere. Key differentiator: Style Reference System that extracts stylistic patterns from example content.

Monorepo:
- `/server` — Python / FastAPI (hexagonal architecture)
- `/web` — Next.js on Cloudflare Workers
- `/infra` — Pulumi (GCP, Cloudflare, Neon)

## Architecture — Hexagonal (Ports & Adapters)

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


## Tech Stack

| Component | Technology |
|---|---|
| Backend API | FastAPI (Python) on GCP Cloud Run |
| Web Frontend | Next.js on Cloudflare Workers |
| Database | Neon DB (Serverless PostgreSQL) |
| Job Queue | Google Cloud Tasks |
| Event Bus | Google Pub/Sub (fan-out) |
| File Storage | Cloudflare R2 |
| Real-time | SSE (Server-Sent Events) |
| Package Mgmt | uv (lockfile committed: uv.lock) |
| Error Tracking | Sentry |

## Domain Boundaries

| Domain | Responsibility | Key Models |
|---|---|---|
| pipeline | Orchestration, run state, step execution | Pipeline, PipelineRun, StepConfig, PipelineContext |
| steps | Step execution contracts and registry | StepInput, StepOutput, StepProgress |
| style | Reference analysis, profile management | StyleProfile, StyleAttribute, ReferenceSource |
| content | Assets, transformations, deployment | ContentAsset, DeployRecord, TransformResult |

## Project Structure (`server/src/`)
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
  deploy/                          # x_twitter.py, youtube.py, linkedin.py, etc.
  media/                           # runway.py, elevenlabs.py (impl MediaGenerator)
  fetcher/                         # web.py, youtube_transcript.py, file.py
  transcription/                   # whisper.py (impl TranscriptionProvider)
```

## Pipeline Execution Model

Each step runs as a separate Cloud Run request triggered by Cloud Tasks. Steps are stateless — all state in Neon DB.

**Run states:** pending → running → waiting_for_approval → completed | partially_completed | failed | cancelled

**Human gates:** Pipeline pauses (no active request), user reviews via API, approval enqueues next step.

**Fan-out:** Parallel transforms via Cloud Tasks/Pub/Sub. Branches tracked by `branch_index`. Failures don't block siblings.

## Conventions

### Domain
- Models: `@dataclass(frozen=True)`, no ORM coupling
- Errors: exhaustive hierarchy per domain, never `HTTPException`
- Ports: `typing.Protocol` classes in `ports.py` (structural subtyping)
- Services: orchestrate repos + providers, called by inbound handlers

### Inbound
- FastAPI wrapped in Shell class (`Shell.build_test_app()` for testing)
- DI via lifespan state + `request.state` (no framework DI container)
- Request schemas: `try_into_domain()` to convert to domain types
- Response schemas: `from_domain()` classmethod from domain models

### Outbound
- Each adapter implements a domain Protocol
- Transactions encapsulated, invisible to callers
- No external calls inside DB transactions
- ORM models ONLY in `outbound/postgres/models.py`
- Explicit mapper: `to_domain()` / `from_domain()`
- Infra errors caught → re-raised as domain errors

### Async Safety
- All I/O must be async in async routes
- SQLAlchemy: `expire_on_commit=False`, `selectinload()`, per-request session
- Pool: `pool_size=10`, `pool_timeout=3`, `pool_pre_ping=True`
- LLM/storage/deploy via `httpx.AsyncClient`

## Principles (MUST CONFORM TO)

1. All implementation must use skills:
   - server: Use **fastapi-hexagonal** skill + **postgresql** skill for queries
   - web: Use **nextjs** skill
2. Once the implementation is complete, run the two sub-agents below in parallel:
   - Run a **security-reviewer** sub-agent for security audit → fix
   - Run a **tester** sub-agent for testing only changed code → fix

### Server Workflow
1. **data-modeling** → **database-reviewer** (agent) → **api-design** (plan)
2. **fastapi-hexagonal** (implementation) + **postgresql** (queries)

### Web Workflow
1. **nextjs** (implementation)
2. **vercel-react-best-practices** (review)

## Key Protocols (Ports)

| Category | Protocol | Purpose |
|---|---|---|
| Repository | PipelineRepository | Pipeline and run persistence |
| Repository | StyleProfileRepository | Style profile storage |
| Provider | LLMProvider | AI text generation |
| Provider | StorageProvider | File storage (S3-compatible) |
| Provider | MediaGenerator | Audio/video/image generation |
| Provider | ReferenceFetcher | Content retrieval from URLs/files |
| Provider | TranscriptionProvider | Audio/video to text |
| Target | DeployTarget | Content publishing |
| Target | ContentTransformer | Format conversion |
| Step | PipelineStep | Pipeline step execution |
