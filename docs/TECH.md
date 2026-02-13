# Kova — Technical PRD

**Architecture Decisions and Technical Strategy**

| | |
|---|---|
| **Version** | 2.0 |
| **Date** | February 2025 |
| **Status** | Draft |
| **Type** | Technical Requirements |
| **Audience** | Engineering, DevOps, Architecture |
| **Companion** | Product PRD (features, user journeys, product roadmap), MVP PRD (scope, timeline, costs) |

---

## Table of Contents

1. [Technical Summary](#1-technical-summary)
2. [Architecture](#2-architecture)
3. [Domain Design](#3-domain-design)
4. [Layer Rules](#4-layer-rules)
5. [Pipeline Execution Engine](#5-pipeline-execution-engine)
6. [AI Model Strategy](#6-ai-model-strategy)
7. [Data Collection Strategy](#7-data-collection-strategy)
8. [Trend Intelligence Engine](#8-trend-intelligence-engine)
9. [Infrastructure](#9-infrastructure)
10. [Data Flow](#10-data-flow)
11. [Design Principles](#11-design-principles)
12. [Technical Risks and Mitigations](#12-technical-risks-and-mitigations)

---

## 1. Technical Summary

The backend follows a strict Hexagonal Architecture (Ports & Adapters) pattern. The domain layer defines business logic through Protocol-based ports and frozen dataclass models. All external dependencies — AI models, databases, storage, deployment platforms — are outbound adapters that implement domain-defined protocols.

This architecture is chosen for one reason above all others: **changeability**. The AI content industry changes faster than any other. Models, APIs, platforms, and tools shift monthly. Every external dependency must be replaceable by writing a single new adapter file without touching business logic.

**Key decisions:**

- Python + FastAPI for AI SDK ecosystem advantage (day-1 SDK support for new AI tools).
- Hexagonal architecture with Protocol-based ports for maximum swappability.
- Pipeline steps as stateless, individually-executed units triggered by Cloud Tasks.
- All state in the database, never in memory across requests.
- Single Cloud Run service (modular code, monolithic deployment) until concrete reason to split.

---

## 2. Architecture

### 2.1 Hexagonal Architecture

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

### 2.2 Why Hexagonal

| Concern | Hexagonal Advantage |
|---|---|
| New AI model released | Write one adapter file implementing LLMProvider Protocol |
| Platform API changes | Update one deployer adapter, domain untouched |
| Switch storage provider | New adapter implementing StorageProvider Protocol |
| Replace database | New repository adapter, same Protocol interface |
| Change web framework | Replace inbound layer, domain untouched |
| Add new content format | One transformer + one deployer, plug into existing pipeline |

### 2.3 Why Python + FastAPI

The bottleneck is LLM API latency (2-30 seconds), not server processing speed. Python wins on changeability in the AI ecosystem:

- New AI tools release Python SDKs on day 1. Rust/Go support comes months later or never.
- Switching between AI providers requires only importing a different SDK and writing a thin adapter.
- FastAPI's async support handles the I/O-bound workload efficiently.
- The developer pool for Python in AI is vastly larger than alternatives.

---

## 3. Domain Design

### 3.1 Domain Boundaries

The domain is organized into bounded contexts. Each has its own models, errors, ports, and services. Cross-domain operations use service calls, never shared transactions.

| Domain | Responsibility | Key Models |
|---|---|---|
| pipeline | Orchestration, run state, step execution | Pipeline, PipelineRun, StepConfig, PipelineContext |
| steps | Step execution contracts and registry | StepInput, StepOutput, StepProgress |
| style | Reference analysis, profile management | StyleProfile, StyleAttribute, ReferenceSource |
| content | Assets, transformations, deployment | ContentAsset, DeployRecord, TransformResult |
| trends | Trend signals, topic aggregation | TrendSignal, TrendTopic |

### 3.2 Protocol Catalog

All external dependencies are defined as `typing.Protocol` classes. Structural subtyping — implementors match method signatures without inheriting from the protocol.

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
| Step | PipelineStep | Pipeline step execution contract |

### 3.3 Domain Rules

- Domain models use `@dataclass(frozen=True)` for immutability.
- No ORM models in the domain layer — ORM lives exclusively in outbound.
- Exhaustive error hierarchy per domain: one class per business rule violation.
- Never raise HTTP exceptions in domain — that leaks transport concerns.
- Each domain has a Service Protocol (interface) and ServiceImpl. Inbound handlers call Services, never Repositories or Providers directly.

---

## 4. Layer Rules

### Inbound Layer

- FastAPI is wrapped in a Shell class so bootstrap never imports FastAPI directly.
- Shell exposes `build_test_app()` for testing.
- Services injected via FastAPI lifespan state — no framework-specific DI container.
- HTTP request/response schemas are separate from domain models.
- Handlers only: parse input → call service → map response. No SQL, no business logic.
- Domain errors mapped to HTTP responses via exception handlers (RFC 9457 ProblemDetails).

### Domain Layer

- Never imports from inbound or outbound.
- Defines all external contracts as Protocol classes.
- Models are frozen dataclasses with self-validating value objects.
- Services orchestrate: repository → provider → return result.

### Outbound Layer

- Each adapter implements a domain Protocol.
- Transactions encapsulated in adapter, invisible to callers.
- No external calls (HTTP, queues) inside database transactions.
- ORM models exist only in outbound. Explicit mappers translate to/from domain models.
- Infrastructure errors caught and re-raised as domain error types.
- All I/O must be async. Blocking calls block the entire event loop.

### Bootstrap

- `main.py` has zero framework imports. It constructs adapters, wires services, starts app.
- AI model selection driven entirely by configuration (env vars).
- All Protocol dependencies injected via constructor at startup.
- Swapping any adapter = change config, restart. Zero code changes.

---

## 5. Pipeline Execution Engine

### 5.1 Execution Model

Pipelines follow an async, event-driven, step-per-request model:

- Each step runs as a separate Cloud Run request, triggered by Cloud Tasks.
- Steps are stateless. All state persists in the database between step executions.
- Long-running operations (video processing, transcription) use webhook callbacks.
- No Cloud Run request is active during human gate waits.

### 5.2 Execution Flow

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
  ├─ Next step is fan-out? → Enqueue N steps in parallel
  ├─ No more steps? → Set status: completed → DONE
  │
  ▼
(repeat for each step)
```

### 5.3 Human Gates

When the pipeline reaches a human gate, pipeline status becomes `waiting_for_approval`. No active Cloud Run request. User approves/edits/rejects via frontend. Approval enqueues the next step. Rejection retries the previous step with feedback or halts the pipeline.

### 5.4 Fan-Out

For multi-format output: orchestrator enqueues N transform steps simultaneously. Each branch runs independently. Branches that fail do not block others. Deploy steps run in parallel for each target platform.

### 5.5 Progress Reporting

Steps report progress to the database via callback. Frontend receives updates via SSE (Server-Sent Events) — polling the database every 2 seconds and streaming to the client.

### 5.6 Pipeline Run States

| State | Description |
|---|---|
| pending | Created, first step not yet started |
| running | One or more steps actively executing |
| waiting_for_approval | Paused at human gate |
| completed | All steps finished successfully |
| partially_completed | Some fan-out branches succeeded, others failed |
| failed | Critical step failed after retries |
| cancelled | User manually stopped |

---

## 6. AI Model Strategy

### 6.1 Core Principle

Every AI model — self-hosted or commercial API — is a swappable adapter behind a domain Protocol. The domain never knows which model or provider is running. Default: self-hosted when quality is sufficient, commercial APIs when the quality gap justifies cost.

### 6.2 AI Task → Protocol Map

| AI Task | Domain Protocol | Self-Hosted Options | API Options |
|---|---|---|---|
| Text Generation | `LLMProvider` | Llama, Qwen, Mistral, Gemma | Claude, GPT, Gemini, Grok, DeepSeek |
| Transcription | `Transcriber` | faster-whisper, WhisperX | OpenAI Whisper, Deepgram |
| Video Understanding | `VisionProvider` | SmolVLM2, Qwen-VL | Gemini Vision, GPT-4o Vision |
| Face Detection | `FaceDetector` | MediaPipe, RetinaFace, YOLO | AWS Rekognition |
| Scene Detection | `SceneDetector` | PySceneDetect | N/A |
| Speaker Diarization | `DiarizationProvider` | pyannote-audio | AssemblyAI, Deepgram |
| Text-to-Speech | `TTSProvider` | Kokoro, Coqui XTTS-v2 | ElevenLabs, OpenAI TTS |
| Image Generation | `ImageGenerator` | Stable Diffusion XL, Flux | DALL-E, Replicate |
| Embeddings | `EmbeddingProvider` | all-MiniLM-L6-v2, BGE-M3 | OpenAI Embeddings |
| Video Editing | `VideoManipulator` | FFmpeg | Shotstack |

### 6.3 Configuration-Driven Selection

Which model powers each task is controlled by environment variables:

```
LLM_PROVIDER=claude          # claude | openai | gemini | grok | deepseek | huggingface
LLM_MODEL=claude-sonnet-4-20250514
TRANSCRIBER_PROVIDER=faster-whisper
TTS_PROVIDER=kokoro
IMAGE_PROVIDER=pollinations
```

Bootstrap reads settings → constructs the right adapter via factory. Swapping any model = change env var, restart.

### 6.4 GPU Infrastructure

| Phase | Approach | Monthly Cost |
|---|---|---|
| MVP | Cloud Run GPU (on-demand) or Modal.com | $0.50-1.00/job |
| Launch | Dedicated T4 GPU (16GB) | $150-200/mo |
| Scale | Dedicated A100 (80GB) | $800-1,500/mo |

**Rule:** If monthly GPU usage < 100 hours → on-demand. If > 100 hours → dedicated.

---

## 7. Data Collection Strategy

### 7.1 Fetcher Architecture

All external content fetching goes through the `ReferenceFetcher` Protocol. The domain never knows whether data came from an API, a 3rd-party service, or user-pasted text. Fetchers are registered in priority order at bootstrap:

1. **URL pattern match** → platform-specific fetcher (YouTube, Twitter, etc.)
2. **File type match** → media processor (video, audio, image uploads)
3. **Generic web URL** → web article fetcher
4. **Raw text** → paste fallback (always works, zero cost)

If a platform-specific fetcher fails, fall through to the next option.

### 7.2 Platform Strategy

| Platform | Fetch Method | Cost | Fallback |
|---|---|---|---|
| YouTube | Free transcript library + Data API metadata | $0 | User pastes transcript |
| Blogs / Websites | Direct web fetch + HTML-to-text extraction | $0 | User pastes text |
| X / Twitter | 3rd-party data provider | $49–100/mo | User pastes text |
| Instagram | Graph API (own content only) | $0 | User pastes caption |
| TikTok | Display API (own content only) | $0 | User pastes text |
| Podcast | RSS feed parsing + transcription | $0–low | User uploads audio |

**Design principle:** Always offer paste-first. Auto-fetch is a convenience layer.

### 7.3 Media File Processing

Users can upload raw media. All media is processed into text before entering the pipeline:

- **Video** → extract audio (FFmpeg) → transcribe → optional frame analysis
- **Audio** → transcribe
- **Image** → Vision LLM description + OCR

File limits: 500MB video, 100MB audio, 20MB image. Max 180 min. Temp storage auto-deleted after 24h.

### 7.4 Deploy Targets

All deployers implement the `DeployTarget` Protocol. Each platform uses its official API with OAuth or API key auth. Supported: YouTube, X/Twitter, Instagram, TikTok, LinkedIn, WordPress/Ghost, Mailchimp/ConvertKit, Reddit, Discord.

### 7.5 Platform API Risk Mitigation

- **Adapter-based architecture:** Each fetcher/deployer is a single swappable file.
- **Paste-first fallback:** Every platform supports manual text input.
- **Multi-source redundancy:** Critical platforms maintain adapters for 2-3 providers.
- **Cost monitoring:** Per-platform API cost tracking with budget alerts.

---

## 8. Trend Intelligence Engine

### 8.1 Why Continuous Collection

Trend data is ephemeral — a Reddit discussion from 3 days ago can't be fetched retroactively. Without pre-collection, every "Generate Ideas" call would hit live APIs (slow, expensive, rate-limited, current snapshot only).

With continuous collection: queries local DB instantly (sub-second), historical data enables velocity and lifecycle detection, cross-platform correlation detects emerging trends before they peak, and collection cost is amortized across all users.

### 8.2 Architecture

Cloud Scheduler triggers collectors on cron → collectors fetch and normalize → raw signals stored in DB → aggregation job deduplicates and scores → processed topics stored → IdeaGeneratorStep reads topics at runtime with zero external API calls.

### 8.3 Trend Sources

Each collector implements the `TrendCollector` Protocol.

| Source | Interval | Cost | Signal Type |
|---|---|---|---|
| Reddit | Every 1-4h | Free | Real problems, discussions |
| YouTube | Every 1-4h | Free | What people want to watch |
| Google Trends | Every 4-6h | Free | Search demand signals |
| X / Twitter | Every 1-4h | Shared with fetch cost | Real-time conversation |
| HackerNews | Every 6h | Free | Tech/startup early signals |
| Exploding Topics | Daily | $39/mo | Curated growth forecasts |
| Wikipedia | Daily | Free | Public interest proxy |

### 8.4 Storage Design

Two tables: raw signals (append-only, large, auto-deleted per retention policy) and processed topics (small, updated in place, kept long-term). Raw signals kept for algorithm improvement and debugging. Each collector extracts only reprocessing-relevant fields, not full API responses.

Storage: ~20 MB/day at full collection, ~1.8 GB for 90-day retention. Negligible at any Neon plan.

### 8.5 Aggregation

Raw signals from different platforms are normalized (0-100 scale), deduplicated via embedding-based topic matching, scored by cross-platform presence, and classified into lifecycle stages: emerging → rising → peak → declining.

### 8.6 Tiered Collection by Phase

| Phase | Sources | Frequency | API Cost |
|---|---|---|---|
| MVP | Reddit, YouTube, Google Trends (free only) | Every 4h | $0 |
| Launch | All 7 sources | Full rate | $49-139/mo |
| Scale | All + niche-specific | Peak-hour boosted | $49-139/mo |

Configuration is environment-variable driven. Switching phases = change config, no code changes.

---

## 9. Infrastructure

### 9.1 Technology Stack

| Component | Technology | Rationale |
|---|---|---|
| Frontend | Next.js on Cloudflare Workers/Pages | Edge-deployed, React ecosystem |
| Backend API | FastAPI (Python) on Google Cloud Run | Python-first AI SDKs, async, serverless |
| Database | Neon DB (Serverless PostgreSQL) | Serverless scaling, JSONB, connection pooling |
| Job Queue | Google Cloud Tasks | Native Cloud Run integration, retries, timeouts |
| Event Bus | Google Pub/Sub | Fan-out for parallel transforms/deploys |
| File Storage | Cloudflare R2 | S3-compatible, zero egress fees |
| Real-time | SSE (Server-Sent Events) | Simple, one-directional, works through CDN |
| Package Mgmt | uv | Fast, lockfile committed (uv.lock) |

### 9.2 Deployment Architecture

- Single Cloud Run service for all API + step execution (monolithic deploy, modular code).
- Cloudflare Workers/Pages for frontend (global edge).
- Neon DB with serverless scaling and auto connection pooling.
- All services scale to zero when idle.
- Future: GPU-requiring steps → separate Cloud Run service.

### 9.3 Timeouts and Long Operations

- Each pipeline step = one Cloud Run request (well under 30-min timeout).
- Long external operations use webhook pattern: start job → return → webhook receives result → enqueue next step.
- Human gates: no active request during wait. User approval triggers next step.

---

## 10. Data Flow

### 10.1 Pipeline Data Flow

```
User Input (topic, style profile, pipeline config)
  │
  ▼
Pipeline created in DB (JSON config, references to style profiles)
  │
  ▼
Steps execute sequentially via Cloud Tasks
  │  Each step reads context from DB, executes, writes results back
  │  Style profile injected into LLM prompts at each generation step
  │
  ├─ Generation steps → content stored as ContentAsset (text in DB, files in R2)
  ├─ Transform steps → fan-out produces format-specific assets
  ├─ Human gates → pipeline pauses, user reviews/edits, pipeline resumes
  └─ Deploy steps → assets published to connected platforms
  │
  ▼
DeployRecords track what was published where and when
```

### 10.2 Style Reference Data Flow

```
User provides reference (URL, pasted text, uploaded file)
  │
  ▼
ReferenceFetcher chain resolves input to text
  (YouTube → transcript, web → article, media → transcribe/describe)
  │
  ▼
LLM analyzes text → extracts style attributes
  (hook pattern, tone, rhythm, formatting, engagement techniques)
  │
  ▼
StyleProfile saved to DB (JSONB attributes, editable by user)
  │
  ▼
Applied to future pipeline runs via prompt injection
```

### 10.3 Trend Data Flow

```
Cloud Scheduler triggers collectors on cron
  │
  ▼
Collectors fetch from external sources → normalize → save raw signals to DB
  │
  ▼
Aggregation job runs after collectors
  → normalize scores across platforms
  → deduplicate via embedding similarity
  → calculate velocity and lifecycle stage
  → write processed topics to DB
  │
  ▼
IdeaGeneratorStep queries processed topics at runtime
  → zero external API calls
  → feeds trend context to LLM for idea generation
```

### 10.4 Key Data Entities

| Entity | Storage | Purpose |
|---|---|---|
| Pipeline templates | DB (JSONB config) | Reusable step configurations |
| Pipeline runs | DB | Execution state and context |
| Step progress | DB | Per-step status, results |
| Style profiles | DB (JSONB attributes) | Extracted style patterns |
| Content assets | DB (text) + R2 (files) | Generated content |
| Deploy records | DB | Publishing history |
| Platform accounts | DB (encrypted credentials) | OAuth tokens, API keys |
| Trend signals | DB | Raw platform data (retention-limited) |
| Trend topics | DB | Processed, scored, lifecycle-classified |

### 10.5 JSONB Strategy

JSONB columns are used for rapidly evolving schemas: pipeline configs, style attributes, step results, user brand settings. This avoids migration churn during early development while keeping queryability.

---

## 11. Design Principles

1. **Changeability Above All.** Every external dependency replaceable by one adapter file. If it can't be swapped easily, the architecture is wrong.

2. **Dependencies Point Inward.** Domain never imports from inbound or outbound. Domain defines Protocols; adapters implement them.

3. **Pipeline as Data.** JSON config in DB, not code. Add/remove/reorder steps without deployment.

4. **Media Agnostic.** All formats behind the same Protocol. New format = one transformer + one deployer.

5. **Steps Dumb, Orchestration Smart.** Steps do one thing. Runner handles sequencing, fan-out, error recovery, human gates.

6. **Modular Code, Monolithic Deployment.** Split only when concrete reason exists.

7. **State in Database.** No in-memory state across requests. Serverless, crash-recoverable, horizontally scalable.

8. **Bootstrap Assembles, Domain Decides.** main.py constructs. Domain contains logic. Handlers parse, call, respond.

9. **Style, Not Information.** Reference system extracts how, not what. Pure patterns applicable to any topic.

---

## 12. Technical Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| AI model API changes/deprecation | High | LLMProvider Protocol; new adapter only |
| Platform API changes (X, LinkedIn, TikTok) | High | DeployTarget Protocol; independent adapters |
| Platform rate limits/access restrictions | Medium | Queue-based deploys; rate limiting; draft/export fallback |
| Video/audio tool landscape shifts | High | All media tools behind Protocols; swap adapter |
| Cloud Run cold start latency | Low | Minimum instances; optimized container |
| Fan-out complexity at scale | Medium | Start simple (sequential); add parallel when needed |
| Cost management at scale | High | Per-step cost tracking; usage quotas; self-host at volume |
| AI output quality inconsistency | High | Human gates as safety net; style profiles improve consistency |
| Content saturation | Medium | Focus on style differentiation, not volume; quality metrics |

---

*This document defines what we decided and why. For product features, user journeys, and product roadmap, see the Product PRD. For MVP scope, timeline, and costs, see the MVP PRD.*
