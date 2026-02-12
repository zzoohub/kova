# Kova — Technical PRD

**Architecture, Infrastructure, and Implementation Guide**

| | |
|---|---|
| **Version** | 1.0 |
| **Date** | February 2025 |
| **Status** | Draft |
| **Type** | Technical Requirements |
| **Audience** | Engineering, DevOps, Architecture |
| **Companion** | Product PRD (features, user journeys, product roadmap) |

---

## Table of Contents

1. [Technical Summary](#1-technical-summary)
2. [Architecture](#2-architecture)
3. [Domain Design](#3-domain-design)
4. [Inbound Layer](#4-inbound-layer)
5. [Outbound Layer](#5-outbound-layer)
6. [Pipeline Execution Engine](#6-pipeline-execution-engine)
7. [Infrastructure](#7-infrastructure)
8. [Data Model](#8-data-model)
9. [API Design](#9-api-design)
10. [Project Structure](#10-project-structure)
11. [Bootstrap and Dependency Injection](#11-bootstrap-and-dependency-injection)
12. [Engineering Roadmap](#12-engineering-roadmap)
13. [Design Principles](#13-design-principles)
14. [Technical Risks and Mitigations](#14-technical-risks-and-mitigations)
15. [Architecture Compliance Checklist](#15-architecture-compliance-checklist)

---

## 1. Technical Summary

The backend follows a strict Hexagonal Architecture (Ports & Adapters) pattern. The domain layer defines business logic through Protocol-based ports and frozen dataclass models. All external dependencies — AI models, databases, storage, deployment platforms — are outbound adapters that implement domain-defined protocols.

This architecture is chosen for one reason above all others: **changeability**. The AI content industry changes faster than any other. Models, APIs, platforms, and tools shift monthly. Every external dependency must be replaceable by writing a single new adapter file without touching business logic.

**Key architectural decisions:**

- Python + FastAPI for AI SDK ecosystem advantage (day-1 SDK support for new AI tools).
- Hexagonal architecture with Protocol-based ports for maximum swappability.
- Pipeline steps as stateless, individually-executed units triggered by Cloud Tasks.
- All state in the database, never in memory across requests.
- Single Cloud Run service (modular code, monolithic deployment) until concrete reason to split.

---

## 2. Architecture

### 2.1 Hexagonal Architecture Overview

Dependencies always point inward. Domain code never imports FastAPI, SQLAlchemy, or any infrastructure package.

```
┌──────────────────────────────────────────────────────────────┐
│  INBOUND ADAPTERS                                            │
│  FastAPI Routes │ Cloud Tasks Handler │ Webhook Receiver      │
│  (Parse input → call service → map response)                 │
└──────────────────────┬───────────────────────────────────────┘
                       │ calls Service Protocol
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  DOMAIN                                                      │
│  Models (frozen dataclass) │ Errors │ Ports (Protocol)       │
│  Services │ StepRegistry                                     │
│  ──── NEVER imports from inbound/ or outbound/ ────          │
└──────────────────────┬───────────────────────────────────────┘
                       │ calls Repository/Provider Protocol
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  OUTBOUND ADAPTERS                                           │
│  Postgres │ Claude/OpenAI │ R2 Storage │ YouTube/X Deployer  │
│  (Implements domain Protocols)                               │
└──────────────────────────────────────────────────────────────┘
```

| Layer | Responsibility | Key Rule |
|---|---|---|
| Domain | Business logic, models, errors, ports (Protocols), services | Never imports from inbound/ or outbound/. No FastAPI, no SQLAlchemy, no SDKs. |
| Inbound | HTTP routes, Cloud Tasks handlers, webhooks | Parse input → call service → map response. No SQL. No business logic. |
| Outbound | Implementations of domain protocols | Implements domain Protocols. Owns transactions. Maps infrastructure errors to domain errors. |
| App (Bootstrap) | Constructs adapters, wires services, starts application | No FastAPI/SQLAlchemy imports in main.py. Pure assembly. |

### 2.2 Why Hexagonal

The decision matrix came down to changeability:

| Concern | Hexagonal Advantage |
|---|---|
| New AI model released | Write one adapter file implementing LLMProvider Protocol |
| Platform API changes | Update one deployer adapter, domain untouched |
| Switch storage provider | New adapter implementing StorageProvider Protocol |
| Replace database | New repository adapter, same Protocol interface |
| Change web framework | Replace Shell class and routers, domain untouched |
| Add new content format | One transformer + one deployer, plug into existing pipeline |

### 2.3 Why Python + FastAPI (Not Rust/Axum)

The bottleneck in this system is LLM API latency (2-30 seconds), not server processing speed. Python wins on changeability in the AI ecosystem:

- New AI tools release Python SDKs on day 1. Rust support comes months later or never.
- Switching between AI providers (Claude, OpenAI, Gemini, local models) requires only importing a different Python SDK and writing a thin adapter.
- With Rust/Axum, every new AI tool would require writing raw HTTP clients, handling auth, parsing responses — work the Python SDK already does.
- FastAPI's async support handles the I/O-bound workload efficiently.
- The developer pool for Python in AI is vastly larger than Rust.

---

## 3. Domain Design

### 3.1 Domain Boundaries

The domain is organized into bounded contexts. Each has its own models, errors, ports, and services. Entities that change atomically belong in the same domain. Cross-domain operations use service calls, never shared transactions.

| Domain | Responsibility | Key Models |
|---|---|---|
| pipeline | Orchestration, run state, step execution | Pipeline, PipelineRun, StepConfig, PipelineContext |
| steps | Step execution contracts and registry | StepInput, StepOutput, StepProgress |
| style | Reference analysis, profile management | StyleProfile, StyleAttribute, ReferenceSource |
| content | Assets, transformations, deployment | ContentAsset, DeployRecord, TransformResult |

### 3.2 Ports (Protocol Classes)

All external dependencies are defined as `typing.Protocol` classes in `domain/*/ports.py`. Structural subtyping — implementors match method signatures without inheriting from the protocol.

| Category | Protocol | Purpose | Example Adapters |
|---|---|---|---|
| Repository | PipelineRepository | Pipeline and run persistence | PostgresPipelineRepository |
| Repository | StyleProfileRepository | Style profile storage | PostgresStyleRepository |
| Provider | LLMProvider | AI text generation | ClaudeProvider, OpenAIProvider |
| Provider | StorageProvider | File storage (S3-compatible) | R2StorageAdapter, LocalStorageAdapter |
| Provider | MediaGenerator | Audio/video/image generation | RunwayAdapter, ElevenLabsAdapter |
| Provider | ReferenceFetcher | Content retrieval from URLs/files | WebFetcher, YouTubeTranscriptFetcher |
| Provider | TranscriptionProvider | Audio/video to text | WhisperAdapter, AssemblyAIAdapter |
| Target | DeployTarget | Content publishing | XTwitterDeployer, YouTubeDeployer |
| Target | ContentTransformer | Format conversion | LongToThreadTransformer |
| Step | PipelineStep | Pipeline step execution | IdeaGeneratorStep, HumanGateStep |

### 3.3 Models

- Domain models use `@dataclass(frozen=True)` for immutability.
- No ORM models in the domain layer — SQLAlchemy models live exclusively in `outbound/postgres/models.py`.
- Separate request models from entity models — they will diverge.
- Value objects (`StyleAttribute`, `StepConfig`) validate their own invariants on construction.

### 3.4 Errors

- Exhaustive error hierarchy per domain: one class per business rule violation.
- Never raise `HTTPException` in domain — that leaks transport concerns.
- Inbound layer maps domain errors to HTTP responses via `@app.exception_handler`.
- Outbound adapters catch infrastructure errors and re-raise as domain error types.

### 3.5 Services

Each domain has a Service Protocol (interface) and ServiceImpl (implementation). Services orchestrate: repository operations, provider calls, and return domain results. Inbound handlers call Services, never Repositories or Providers directly.

---

## 4. Inbound Layer

### 4.1 Shell Pattern

FastAPI is wrapped in a Shell class so `main.py` never imports FastAPI directly. Shell exposes `build_test_app()` for testing with `httpx.AsyncClient`.

```python
# inbound/http/shell.py
class Shell:
    def __init__(self, services: dict):
        self._app = FastAPI()
        self._register_middleware()
        self._mount_routers()
        self._register_error_handlers()
        self._services = services

    def build_test_app(self) -> ASGIApp:
        return self._app

    def run(self, host="0.0.0.0", port=8000):
        uvicorn.run(self._app, host=host, port=port)
```

- Shell class owns FastAPI instance, middleware registration, and router mounting.
- CORS middleware added before routers (order matters in FastAPI).
- Lifespan context manager (not deprecated `@app.on_event`) manages startup/shutdown.

### 4.2 Dependency Injection

Services are injected via FastAPI lifespan state. The lifespan yields a dict of services, available through `request.state`. This uses the ASGI spec directly — no framework-specific DI container.

```python
# Lifespan yields:
{"pipeline_service": svc, "style_service": svc, "content_service": svc}

# Dependency function:
def with_pipeline_service(request: Request) -> PipelineService:
    return request.state.pipeline_service
```

Steps receive Protocol dependencies via constructor injection at bootstrap time (not at request time).

### 4.3 Request/Response Separation

- HTTP request schemas (`CreatePipelineHttpRequest`) are separate from domain models.
- Request schemas provide `try_into_domain()` to validate and convert to domain types.
- Response schemas provide `from_domain()` classmethod to build response from domain models.
- Domain models are never exposed directly to API consumers.

### 4.4 Error Mapping

Domain errors are mapped to HTTP responses via `@app.exception_handler` in `inbound/http/errors.py`. All error responses follow RFC 9457 ProblemDetails format:

```json
{
  "type": "urn:kova:pipeline:not-found",
  "title": "Pipeline Not Found",
  "status": 404,
  "detail": "Pipeline with id 'abc-123' does not exist."
}
```

Unknown errors are logged server-side with full context; client receives generic 500.

---

## 5. Outbound Layer

### 5.1 Adapter Rules

- Each adapter implements a domain Protocol. It handles all infrastructure-specific concerns.
- Transactions encapsulated in the adapter, invisible to callers. Keep transactions short.
- No external calls (HTTP, queues) inside database transactions.
- ORM models live in `outbound/postgres/models.py` only.
- Explicit mapper (`PipelineMapper.to_domain()` / `.from_domain()`) translates between ORM and domain models.
- Infrastructure errors (`IntegrityError`, `ConnectionError`, API rate limits) caught and re-raised as domain errors.

### 5.2 Async Safety

All I/O must be async in async routes. Blocking calls will block the entire event loop.

- SQLAlchemy async: `expire_on_commit=False`, `selectinload()` for relationships, per-request session.
- Connection pool: `pool_size=10`, `pool_timeout=3`, `pool_pre_ping=True`.
- All LLM, storage, and deploy operations use `httpx.AsyncClient`.
- For unavoidably sync libraries, use synchronous `def` handlers (run in thread pool).

### 5.3 Adapter Examples

```python
# outbound/llm/claude.py — implements LLMProvider Protocol
class ClaudeProvider:
    def __init__(self, api_key: str):
        self._client = AsyncAnthropic(api_key=api_key)

    async def generate(self, prompt: str, context: dict) -> str:
        response = await self._client.messages.create(...)
        return response.content[0].text

# outbound/storage/r2.py — implements StorageProvider Protocol
class R2StorageAdapter:
    def __init__(self, account_id: str, access_key: str, secret_key: str):
        self._session = aioboto3.Session()
        self._endpoint = f"https://{account_id}.r2.cloudflarestorage.com"

    async def upload(self, key: str, data: bytes, content_type: str) -> str:
        async with self._session.client("s3", endpoint_url=self._endpoint) as s3:
            await s3.put_object(Bucket=self._bucket, Key=key, Body=data)
        return key
```

Swapping Claude for OpenAI: write `outbound/llm/openai.py` implementing the same Protocol. Change one line in bootstrap. Domain and inbound untouched.

---

## 6. Pipeline Execution Engine

### 6.1 Execution Model

Pipelines follow an async, event-driven, step-per-request model:

- Each step runs as a separate Cloud Run request, triggered by Cloud Tasks.
- Steps are stateless. All state persists in Neon DB between step executions.
- Long-running external operations (video gen, transcription) use webhook callbacks.
- No Cloud Run request is active during human gate waits.

### 6.2 Execution Flow

```
User triggers pipeline
  │
  ▼
PipelineService creates PipelineRun (status: pending)
  │
  ▼
Enqueue first step → Cloud Tasks
  │
  ▼
Cloud Tasks → Cloud Run request
  │
  ├─ Retrieve PipelineRun from DB
  ├─ Resolve step from StepRegistry
  ├─ Execute step (with style context if present)
  ├─ Save results to DB
  │
  ├─ Next step is regular? → Enqueue next step → Cloud Tasks
  ├─ Next step is human gate? → Set status: waiting_for_approval → STOP
  ├─ Next step is fan-out? → Enqueue N steps in parallel → Cloud Tasks/Pub/Sub
  ├─ No more steps? → Set status: completed → DONE
  │
  ▼
(repeat for each step)
```

### 6.3 Progress Reporting

During execution, steps call a `progress_callback` that writes to the `step_progress` table:

```python
await progress_callback(StepProgress(
    status="running",
    detail="Generating 5 content ideas...",
    percent=40
))
```

The frontend polls via SSE endpoint (`/api/runs/{id}/stream`), which queries the DB every 2 seconds and streams updates.

### 6.4 Human Gates

When the pipeline reaches a human gate step:

1. Pipeline status → `waiting_for_approval`. No active Cloud Run request.
2. Frontend shows the review screen with previous step's output.
3. User approves → API call → enqueue next step to Cloud Tasks.
4. User rejects → API call → retry previous step with feedback, or halt pipeline.
5. User edits → modified output replaces original, then enqueue next step.

### 6.5 Fan-Out (Multi-Format)

For multi-format output from a single source:

1. Orchestrator identifies fan-out point in pipeline config.
2. Enqueues N transform steps simultaneously (Cloud Tasks / Pub/Sub).
3. Each branch runs independently, tracked by `step_progress` with branch index.
4. Branches that fail do not block others.
5. When all branches complete (or fail), orchestrator collects results.
6. Deploy steps can run in parallel for each target platform.

### 6.6 Step Registry

Steps are registered at bootstrap with their Protocol dependencies:

```python
registry = StepRegistry()
registry.register("idea_generator", IdeaGeneratorStep(llm=claude_provider))
registry.register("script_writer", ScriptWriterStep(llm=claude_provider, storage=r2_adapter))
registry.register("human_gate", HumanGateStep())
registry.register("reference_analyzer", ReferenceAnalyzerStep(llm=claude_provider, fetcher=web_fetcher))
```

Pipeline config references steps by type name. The registry resolves them at execution time.

---

## 7. Infrastructure

### 7.1 Technology Stack

| Component | Technology | Rationale |
|---|---|---|
| Frontend | Next.js on Cloudflare Workers/Pages | Edge-deployed, React ecosystem |
| Backend API | FastAPI (Python) on Google Cloud Run | Python-first AI SDKs, async, serverless |
| Database | Neon DB (Serverless PostgreSQL) | Serverless scaling, JSONB, connection pooling |
| Job Queue | Google Cloud Tasks | Native Cloud Run integration, retries, timeouts |
| Event Bus | Google Pub/Sub | Fan-out for parallel transforms/deploys |
| File Storage | Cloudflare R2 | S3-compatible, zero egress fees |
| Real-time | SSE (Server-Sent Events) | Simple, one-directional, works through CDN |
| Edge Cache | Cloudflare KV | Templates, profiles, static assets |
| Package Mgmt | uv | Fast, lockfile committed (uv.lock) |

### 7.2 Cloudflare R2 Storage

All generated content (scripts, images, video, audio) stored in R2.

- S3-compatible API via `aioboto3` or `httpx` with S3 signing.
- Zero egress fees — critical for a content platform serving files to multiple deploy targets.
- Accessed through `StorageProvider` Protocol. Domain has no R2-specific code.
- `R2StorageAdapter` in `outbound/storage/r2.py`. Switching to S3/GCS = new adapter only.
- Pairs with Cloudflare Workers frontend for direct edge access.

### 7.3 Deployment Architecture

- Single Cloud Run service for all API + step execution (monolithic deploy, modular code).
- Cloudflare Workers/Pages for frontend (global edge).
- Neon DB with serverless scaling and auto connection pooling.
- All services scale to zero when idle.
- Future: GPU-requiring steps (video/audio gen) → separate Cloud Run service.

### 7.4 Timeouts and Long Operations

- Each pipeline step = one Cloud Run request (well under 30-min timeout).
- Long external operations (video generation) use webhook pattern: start job → return → webhook receives result → enqueue next step.
- Human gates: no active request during wait. User approval triggers next step.

---

## 8. Data Model

ORM models in `outbound/postgres/models.py` only. Domain models are frozen dataclasses. Explicit mappers handle translation.

### 8.1 Core Tables

```sql
-- Users and configuration
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    persona_config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Style profiles from reference analysis
CREATE TABLE style_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    source_url TEXT,
    profile_data JSONB NOT NULL,  -- StyleAttribute[]
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Reusable pipeline configurations
CREATE TABLE pipeline_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    name TEXT NOT NULL,
    config JSONB NOT NULL,  -- StepConfig[]
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Individual pipeline executions
CREATE TABLE pipeline_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES pipeline_templates(id),
    user_id UUID REFERENCES users(id) NOT NULL,
    state TEXT NOT NULL DEFAULT 'pending',
    context JSONB DEFAULT '{}',   -- PipelineContext
    style_profile_id UUID REFERENCES style_profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- Per-step execution tracking
CREATE TABLE step_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID REFERENCES pipeline_runs(id) NOT NULL,
    step_index INTEGER NOT NULL,
    branch_index INTEGER DEFAULT 0,
    step_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    detail TEXT,
    percent INTEGER DEFAULT 0,
    result JSONB,
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ
);

-- Generated content files and text
CREATE TABLE content_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID REFERENCES pipeline_runs(id) NOT NULL,
    step_index INTEGER NOT NULL,
    format_type TEXT NOT NULL,
    r2_key TEXT,
    content_text TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Publishing history
CREATE TABLE deploy_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID REFERENCES pipeline_runs(id) NOT NULL,
    asset_id UUID REFERENCES content_assets(id),
    platform TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    platform_url TEXT,
    error_detail TEXT,
    published_at TIMESTAMPTZ
);

-- Connected platform credentials
CREATE TABLE platform_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    platform TEXT NOT NULL,
    credentials BYTEA NOT NULL,  -- encrypted
    settings JSONB DEFAULT '{}',
    connected_at TIMESTAMPTZ DEFAULT now()
);
```

### 8.2 Pipeline Run States

| State | Description |
|---|---|
| pending | Run created, first step not yet started |
| running | One or more steps actively executing |
| waiting_for_approval | Paused at human gate |
| completed | All steps and deploys finished successfully |
| partially_completed | Some fan-out branches succeeded, others failed |
| failed | Critical step failed after retries |
| cancelled | User manually stopped the pipeline |

### 8.3 JSONB Usage

JSONB columns provide schema flexibility for rapidly evolving configs:

- `pipeline_templates.config`: array of StepConfig objects (step type, parameters, position).
- `style_profiles.profile_data`: array of StyleAttribute objects (attribute name, value, source reference).
- `pipeline_runs.context`: runtime context passed between steps (current content, accumulated results).
- `step_progress.result`: step-specific output data (generated ideas, script content, deploy URLs).
- `users.persona_config`: brand voice, tone, vocabulary, audience defaults.

---

## 9. API Design

All endpoints follow: parse input → call service → map response. No SQL, no business logic in handlers. RFC 9457 ProblemDetails for all errors.

### 9.1 Pipeline Management

```
GET    /api/pipelines              List user pipeline templates
POST   /api/pipelines              Create pipeline template
PUT    /api/pipelines/{id}         Update pipeline template
DELETE /api/pipelines/{id}         Delete pipeline template
```

### 9.2 Pipeline Execution

```
POST   /api/runs                   Start pipeline run
GET    /api/runs/{id}              Get run status + all step progress
GET    /api/runs/{id}/stream       SSE real-time progress stream
POST   /api/runs/{id}/approve      Approve human gate, continue pipeline
POST   /api/runs/{id}/reject       Reject step output (retry or halt)
POST   /api/runs/{id}/cancel       Cancel running pipeline
```

### 9.3 Style Profiles

```
GET    /api/styles                 List saved style profiles
POST   /api/styles                 Create style profile from reference
GET    /api/styles/{id}            Get full style profile
PUT    /api/styles/{id}            Update profile name/description/attributes
DELETE /api/styles/{id}            Delete style profile
POST   /api/styles/analyze         Analyze reference, return profile (no save)
```

### 9.4 Platform Accounts

```
GET    /api/platforms              List connected platforms
POST   /api/platforms/connect      Initiate OAuth flow
POST   /api/platforms/{id}/disconnect  Disconnect platform
PUT    /api/platforms/{id}/settings     Update platform settings
```

### 9.5 Internal Endpoints

```
POST   /api/internal/execute-step        Cloud Tasks step execution
POST   /api/internal/webhook/{provider}  External service callbacks
```

---

## 10. Project Structure

```
kova/
  backend/
    src/
      app/
        main.py                          # Bootstrap ONLY — no FastAPI/SQLAlchemy imports
        application.py                   # App orchestrator
        config.py                        # pydantic-settings (env vars, secrets)

      domain/                            # ━━ NEVER imports from inbound/ or outbound/ ━━
        pipeline/
          models.py                      # Pipeline, PipelineRun, StepConfig (frozen dataclass)
          errors.py                      # PipelineNotFoundError, StepExecutionError, etc.
          ports.py                       # PipelineRepository, PipelineRunner (Protocol)
          service.py                     # PipelineServiceImpl

        steps/
          models.py                      # StepInput, StepOutput, StepProgress
          errors.py                      # StepFailedError, StepTimeoutError
          ports.py                       # PipelineStep, LLMProvider, MediaGenerator (Protocol)
          registry.py                    # StepRegistry

        style/
          models.py                      # StyleProfile, StyleAttribute (frozen dataclass)
          errors.py                      # StyleAnalysisError, ReferenceNotFoundError
          ports.py                       # ReferenceFetcher, TranscriptionProvider (Protocol)
          service.py                     # StyleServiceImpl

        content/
          models.py                      # ContentAsset, DeployRecord, TransformResult
          errors.py                      # DeployFailedError, TransformError
          ports.py                       # ContentTransformer, DeployTarget, StorageProvider (Protocol)
          service.py                     # ContentServiceImpl

      inbound/                           # ━━ Drives the domain ━━
        http/
          shell.py                       # Shell class — wraps FastAPI + uvicorn
          errors.py                      # Exception handlers → RFC 9457 ProblemDetails
          dependencies.py                # with_pipeline_service, with_style_service
          response.py                    # ApiSuccess, Created, Ok, NoContent wrappers
          pipeline/
            router.py                    # Parse → PipelineService → response
            request.py                   # CreatePipelineHttpRequest (try_into_domain())
            response.py                  # PipelineRunResponse (from_domain())
          style/
            router.py, request.py, response.py
          platform/
            router.py, request.py, response.py
        tasks/
          handler.py                     # Cloud Tasks step execution handler
          webhook.py                     # External service webhook handler

      outbound/                          # ━━ Implements domain Protocols ━━
        postgres/
          pipeline_repository.py         # impl PipelineRepository
          style_repository.py            # impl StyleProfileRepository
          models.py                      # SQLAlchemy ORM models (ONLY here)
          mapper.py                      # ORM ↔ domain translation
        llm/
          claude.py                      # impl LLMProvider
          openai.py                      # impl LLMProvider
        storage/
          r2.py                          # impl StorageProvider (Cloudflare R2)
          local.py                       # impl StorageProvider (dev/test)
        deploy/
          x_twitter.py                   # impl DeployTarget
          youtube.py                     # impl DeployTarget
          linkedin.py                    # impl DeployTarget
          wordpress.py                   # impl DeployTarget
          newsletter.py                  # impl DeployTarget
        media/
          runway.py                      # impl MediaGenerator
          elevenlabs.py                  # impl MediaGenerator
        fetcher/
          web.py                         # impl ReferenceFetcher
          youtube_transcript.py          # impl ReferenceFetcher
          file.py                        # impl ReferenceFetcher
        transcription/
          whisper.py                     # impl TranscriptionProvider

  frontend/                              # Next.js on Cloudflare Workers/Pages
    app/
      dashboard/                         # Pipeline runs overview + real-time progress
      pipeline-builder/                  # Drag-and-drop pipeline editor
      review/                            # Human gate approval screens
      style-library/                     # Style profile management
      platforms/                         # Connected platform accounts

  uv.lock                               # Committed lockfile
  docker-compose.yml
```

---

## 11. Bootstrap and Dependency Injection

### 11.1 Bootstrap Flow

`main.py` contains no FastAPI or SQLAlchemy imports. It constructs, wires, and starts.

```python
# app/main.py — simplified
from app.config import Settings

def main():
    settings = Settings()

    # 1. Construct outbound adapters
    engine = create_async_engine(settings.database_url)
    pipeline_repo = PostgresPipelineRepository(engine)
    style_repo = PostgresStyleRepository(engine)
    claude = ClaudeProvider(settings.claude_api_key)
    r2 = R2StorageAdapter(settings.r2_account_id, settings.r2_access_key, settings.r2_secret_key)
    web_fetcher = WebFetcher()

    # 2. Register steps
    registry = StepRegistry()
    registry.register("idea_generator", IdeaGeneratorStep(llm=claude))
    registry.register("script_writer", ScriptWriterStep(llm=claude, storage=r2))
    registry.register("reference_analyzer", ReferenceAnalyzerStep(llm=claude, fetcher=web_fetcher))
    registry.register("human_gate", HumanGateStep())

    # 3. Assemble domain services
    pipeline_service = PipelineServiceImpl(repo=pipeline_repo, registry=registry)
    style_service = StyleServiceImpl(repo=style_repo, fetchers=[web_fetcher])
    content_service = ContentServiceImpl(storage=r2)

    # 4. Create Shell and run
    services = {
        "pipeline_service": pipeline_service,
        "style_service": style_service,
        "content_service": content_service,
    }
    shell = Shell(services)
    shell.run()
```

### 11.2 Testing

- `Shell.build_test_app()` → ASGI app for `httpx.AsyncClient` testing.
- Domain services testable with mock Protocol implementations (no real DB/API).
- Steps independently testable with mock LLMProvider, mock StorageProvider.
- Outbound adapters tested against real or test infrastructure.
- Integration tests wire real adapters against test databases and R2 buckets.

---

## 12. Engineering Roadmap

### Phase 1: Foundation (Weeks 1–3)

- Project structure: `domain/`, `inbound/`, `outbound/`, `app/`.
- All domain models (frozen dataclasses): Pipeline, PipelineRun, StepConfig, StepInput, StepOutput, StepProgress.
- All core Protocols: PipelineStep, LLMProvider, StorageProvider, PipelineRepository.
- PipelineServiceImpl with run orchestration.
- Pipeline Runner with Cloud Tasks step-per-request execution.
- StepRegistry for dynamic step lookup.
- Basic steps: IdeaGeneratorStep, ScriptWriterStep, HumanGateStep.
- Outbound: PostgresPipelineRepository, ClaudeProvider, R2StorageAdapter.
- Inbound: Shell, pipeline routes, error handling (RFC 9457).
- Bootstrap: main.py wiring. uv.lock committed.
- Neon DB schema (all core tables).

### Phase 2: Frontend + Real-Time (Weeks 4–6)

- Next.js on Cloudflare Workers/Pages.
- Dashboard: pipeline runs with SSE real-time progress.
- Human review screen: approve, edit, reject.
- Pipeline builder: step selection, ordering, save as template.
- API integration: all Phase 1 endpoints.

### Phase 3: Style Domain (Weeks 7–9)

- Style domain: models, errors, ports, StyleServiceImpl.
- Protocols: ReferenceFetcher, TranscriptionProvider.
- Outbound: WebFetcher, YouTubeTranscriptFetcher, FileFetcher, WhisperAdapter.
- ReferenceAnalyzerStep with style-only extraction.
- Style CRUD endpoints and routes.
- Style library UI.
- Multi-reference compositing logic.

### Phase 4: Transformation Engine (Weeks 10–12)

- ContentTransformer Protocol and base transformer step.
- Core transformers: LongToThread, LongToShortVideo, LongToPost, LongToNewsletter.
- Fan-out via Pub/Sub: parallel transforms from single source.
- Branch tracking in step_progress (branch_index).
- Multi-choice generation (N variations per transform).

### Phase 5: Deploy Adapters (Weeks 13–15)

- DeployTarget Protocol and deployment step.
- Adapters: XTwitterDeployer, YouTubeDeployer, LinkedInDeployer, WordPressDeployer.
- Newsletter adapters: Mailchimp, ConvertKit.
- OAuth flows for platform account connection.
- Platform settings UI.
- End-to-end: idea → multi-platform publish.

### Phase 6: Growth (Weeks 16+)

- Additional LLM adapters (OpenAI, local models).
- MediaGenerator adapters (Runway, ElevenLabs, Stability).
- More deployers: Instagram, TikTok, Reddit, Discord, podcast.
- Conditional branching and retry strategies in pipeline runner.
- Analytics, team collaboration, rate limiting.

---

## 13. Design Principles

1. **Changeability Above All.** Every external dependency replaceable by one adapter file. If it can't be swapped easily, the architecture is wrong.

2. **Dependencies Point Inward.** Domain never imports from `inbound/` or `outbound/`. Domain defines Protocols; adapters implement them.

3. **Pipeline as Data.** JSON config in DB, not code. Add/remove/reorder steps without deployment.

4. **Media Agnostic.** All formats behind the same Protocol. New format = one transformer + one deployer.

5. **Ports and Adapters.** Every external system via Protocol port. Outbound adapter is the only file that knows specifics.

6. **Steps Dumb, Orchestration Smart.** Steps do one thing. Runner handles sequencing, fan-out, error recovery, human gates.

7. **Modular Code, Monolithic Deployment.** Split only when concrete reason exists.

8. **State in Database.** No in-memory state across requests. Serverless, crash-recoverable, horizontally scalable.

9. **Bootstrap Assembles, Domain Decides.** `main.py` constructs. Domain contains logic. Handlers parse, call, respond.

10. **Style, Not Information.** Reference system extracts how, not what. Pure patterns applicable to any topic.

---

## 14. Technical Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| AI model API changes/deprecation | High | LLMProvider Protocol; new adapter only |
| Platform API changes (X, LinkedIn, TikTok) | High | DeployTarget Protocol; independent adapters |
| Platform rate limits/access restrictions | Medium | Queue-based deploys; rate limiting; draft/export fallback |
| Video/audio tool landscape shifts | High | MediaGenerator Protocol; swap adapter |
| Cloud Run cold start latency | Low | Minimum instances; optimized container |
| R2 compatibility edge cases | Low | S3-compatible; StorageProvider Protocol enables S3/GCS switch |
| Fan-out complexity at scale | Medium | Start simple; add DAG support incrementally |
| SQLAlchemy async footguns | Medium | Strict rules: expire_on_commit=False, selectinload(), pool config |
| Cloud Tasks ordering/dedup | Low | Idempotent step execution; state-based progress |
| Cost management at scale | High | Per-step cost tracking; usage quotas; provider rate limiting |

---

## 15. Architecture Compliance Checklist

### Domain Layer

- [ ] Models are `@dataclass(frozen=True)`, no ORM coupling
- [ ] Errors are exhaustive (one class per business rule violation)
- [ ] No `HTTPException` anywhere in `domain/`
- [ ] All external deps defined as Protocol classes in `ports.py`
- [ ] Services orchestrate: repo → provider → return result
- [ ] Zero imports from `inbound/` or `outbound/`

### Inbound Layer

- [ ] FastAPI wrapped in Shell class
- [ ] `Shell.build_test_app()` exposed for tests
- [ ] Lifespan context manager (not `@app.on_event`)
- [ ] DI via lifespan state + `request.state`
- [ ] Handlers: parse → service → response (no SQL, no logic)
- [ ] HTTP schemas separate from domain (`try_into_domain` / `from_domain`)
- [ ] Errors via `@app.exception_handler` with RFC 9457
- [ ] CORS middleware before routers

### Outbound Layer

- [ ] Each adapter implements a domain Protocol
- [ ] Transactions encapsulated, invisible to callers
- [ ] No external calls inside DB transactions
- [ ] ORM only in `outbound/postgres/models.py`
- [ ] Explicit mapper (`to_domain` / `from_domain`)
- [ ] Infrastructure errors → domain errors
- [ ] `expire_on_commit=False` for async sessions
- [ ] `selectinload()` for relationships

### Bootstrap

- [ ] `main.py` has zero framework imports
- [ ] Adapters constructed → services assembled → app started
- [ ] `uv.lock` committed
- [ ] All Protocol deps injected via constructor

### Async Safety

- [ ] No blocking calls in async routes
- [ ] All I/O async (`httpx`, `aiofiles`, async SQLAlchemy)
- [ ] `pool_timeout` and `pool_pre_ping=True` set

---

*This document defines how Kova is built. For product vision, features, user journeys, and product roadmap, see the Product PRD.*
