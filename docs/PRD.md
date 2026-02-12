# AI Content Factory — Technical PRD v3.0

**Multi-Format AI-Agent Content Creation Platform**

Video • Threads • Posts • Articles • Audio • Newsletters

| | |
|---|---|
| **Version** | 3.0 |
| **Date** | February 2025 |
| **Status** | Draft |
| **Architecture** | Hexagonal (Ports & Adapters) |
| **Classification** | Internal |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision](#2-product-vision)
3. [Core Features](#3-core-features)
4. [System Architecture](#4-system-architecture)
5. [Infrastructure](#5-infrastructure)
6. [Data Model](#6-data-model)
7. [API Design](#7-api-design)
8. [Project Structure](#8-project-structure)
9. [Bootstrap and Dependency Injection](#9-bootstrap-and-dependency-injection)
10. [Development Roadmap](#10-development-roadmap)
11. [Design Principles](#11-design-principles)
12. [Risks and Mitigations](#12-risks-and-mitigations)
13. [Architecture Compliance Checklist](#13-architecture-compliance-checklist)

---

## 1. Executive Summary

AI Content Factory is a modular, AI-agent-powered content creation platform that automates the entire content lifecycle: from idea generation to multi-format, multi-platform publishing. The platform is media-agnostic, handling video, text threads, social posts, blog articles, audio/podcasts, newsletters, and image carousels through a unified pipeline architecture.

Users can operate in fully autonomous mode (delegate everything to AI agents), fully manual mode (use individual tools), or anywhere in between with human-in-the-loop controls at any step. A key differentiator is the Style Reference System, which allows users to provide example content and have the AI match the style, structure, and tone — without copying any information — when creating new content on any topic.

The backend follows a strict Hexagonal Architecture (Ports & Adapters) pattern using FastAPI and Python. The domain layer defines business logic through Protocol-based ports and frozen dataclass models. All external dependencies (AI models, storage, deployment platforms) are outbound adapters that implement domain-defined protocols. This ensures maximum changeability: any component can be replaced by writing a single new adapter file without touching business logic.

---

## 2. Product Vision

### 2.1 Problem Statement

Content creation is labor-intensive, requiring multiple tools, platforms, and specialized skills. Creators must manually adapt content for each platform: what works on YouTube doesn't work on X/Twitter, and what engages on TikTok fails on LinkedIn. Existing solutions are either fully manual or rigidly automated with no middle ground. AI models and content platforms change rapidly, making tightly-coupled systems obsolete within months.

### 2.2 Solution

- **Fully automated pipeline:** From idea generation to content deployment across multiple platforms, orchestrated entirely by AI agents.
- **Multi-format content engine:** Source content is automatically transformed into any format — video scripts, X/Twitter threads, LinkedIn posts, blog articles, podcast scripts, Instagram carousels, newsletters, and more.
- **Style Reference System:** Users provide example content (URL, file, or text) and the system extracts pure stylistic patterns (tone, structure, rhythm, hooks, formatting) without copying information, then applies that style to new content on any topic.
- **Human-in-the-loop control:** Users can intervene at any step, set persona and style, review and approve, or override AI decisions.
- **Modular pipeline builder:** Users select and configure pipeline steps, choosing from available AI agents, transformers, and deployment targets.
- **Hexagonal architecture:** Every external dependency is behind a Protocol-defined port, making any component replaceable without modifying business logic.

### 2.3 Target Users

- Content creators and influencers who want to scale output across platforms from a single source.
- Marketing teams that need consistent multi-format, multi-platform content.
- Agencies managing content for multiple clients with different styles and platform requirements.
- Solo entrepreneurs who need professional multi-platform presence without a production team.

### 2.4 Supported Content Formats

The platform is format-agnostic. Any content type can be added by implementing the ContentTransformer and DeployTarget protocols. Launch formats include:

| Category | Format | Platforms | Description |
|---|---|---|---|
| Video (Long) | 10-30 min video script | YouTube | Full video scripts with intro, chapters, outro, CTAs |
| Video (Short) | 15-60s vertical video script | TikTok, YouTube Shorts, Reels | Hook-driven short scripts with captions overlay |
| Thread | Multi-post thread (5-20 posts) | X/Twitter | Numbered thread posts, each <280 chars, with hooks |
| Social Post | Single post | X/Twitter, LinkedIn, Facebook | Platform-optimized single posts with hashtags |
| Article | Longform written content | Blog, Medium, Substack | SEO-optimized articles with headings and structure |
| Newsletter | Email content | Mailchimp, ConvertKit, Beehiiv | Formatted email with sections, links, CTAs |
| Carousel | Multi-slide visual content | Instagram, LinkedIn | Text-heavy slide decks for carousel posts |
| Audio | Podcast script / show notes | Spotify, Apple Podcasts | Conversational scripts, intro/outro, show notes |
| Community | Discussion posts | Reddit, Discord | Platform-native format with appropriate tone |

---

## 3. Core Features

### 3.1 Pipeline Orchestration Engine

The central feature of the platform. Pipelines are defined as JSON configuration, not code. The orchestration engine reads the configuration and executes steps sequentially or in parallel, with support for branching, conditional logic, and human approval gates.

#### 3.1.1 Pipeline as Data

- Pipelines stored as JSON configuration in the database (JSONB columns in Neon DB).
- Users can create, edit, clone, and share pipeline templates via the UI.
- Steps can be added, removed, or reordered without code changes.
- Pipeline configurations are versioned for rollback and auditing.
- The pipeline itself is changeable — users modify the flow, not just the parameters.

#### 3.1.2 Step Execution Model

- Each step implements the PipelineStep Protocol: receives StepInput, produces StepOutput.
- Steps are stateless; all state persists in the database between step executions.
- Each step runs as a separate Cloud Run request, triggered by Cloud Tasks.
- Steps report granular progress (status, percentage, detail message) for real-time UI updates via SSE.

#### 3.1.3 Human Gates

- Special step type that pauses pipeline execution and waits for user action.
- User can approve, edit, or reject the output from the previous step.
- Rejection can route to a retry with modified parameters or halt the pipeline.
- Configurable: users choose where to place human gates in their pipeline.

#### 3.1.4 Fan-Out (Multi-Format Output)

A single source can produce multiple output formats simultaneously. The orchestrator enqueues multiple transform steps in parallel via Cloud Tasks / Pub/Sub, then collects results when all branches complete.

- Example: One longform script simultaneously transforms into a YouTube video script, X thread, LinkedIn post, and newsletter.
- Each branch can have its own human gate and deploy target.
- Branches are independent — one failing does not block others.

### 3.2 Style Reference System

A key differentiator of the platform. Users provide example content, and the system extracts pure stylistic patterns to apply when generating new content. The system explicitly separates style from information — it learns how the reference communicates, not what it communicates.

#### 3.2.1 How It Works

1. **User provides reference:** A URL (tweet, thread, YouTube video, blog post), uploaded file, or pasted text.
2. **ReferenceAnalyzer step extracts style profile:** The AI analyzes the reference and extracts ONLY stylistic patterns — zero factual information from the source.
3. **Style profile flows to downstream steps:** Every content generation and transformation step receives the style profile as context, ensuring consistent style application.
4. **User can save and reuse profiles:** Style profiles are saved as reusable templates that can be applied to any future pipeline without re-analyzing the reference.

#### 3.2.2 Style Profile Attributes

The ReferenceAnalyzer extracts the following attributes from any reference content:

| Attribute | Description | Example |
|---|---|---|
| Hook Pattern | How the content opens to grab attention | Personal experience + bold claim: 'I did X. Here's what nobody tells you' |
| Structure | Overall organization and flow of the content | Thread: 8-12 posts, each 1-2 sentences with a clear arc |
| Tone | The voice and attitude of the content | Casual authority — conversational but confident |
| Rhythm | Sentence length patterns and pacing | Short. Punchy. Then one longer sentence for context. |
| Emoji Usage | Frequency, placement, and purpose of emojis | Strategic: one per post opening, never mid-sentence |
| Engagement Techniques | How the content maintains attention | Cliffhanger at post 3, question at post 7, CTA at end |
| Formatting Patterns | Visual structure, spacing, and markup | Numbered (1/, 2/), line break between ideas, bold for emphasis |
| Vocabulary Level | Word choice complexity and domain specificity | Simple words, avoid jargon, use analogies from daily life |
| Perspective | Point of view and narrative approach | First person storytelling with direct reader address |
| Platform Conventions | Platform-specific patterns and norms | Thread uses '/' numbering, ends with 'Follow for more' |

#### 3.2.3 Reference Input Types

| Input Type | How to Fetch | Processing |
|---|---|---|
| URL (tweet/thread) | Platform API or web scraper | Direct text analysis |
| URL (YouTube video) | YouTube transcript API | Transcribe, then analyze transcript style |
| URL (blog/article) | Web fetch and parse | Extract text, analyze writing style |
| Uploaded file (text/doc) | Direct file read | Full style analysis on text content |
| Uploaded file (video/audio) | Transcription service first | Transcribe to text, then analyze style |
| Pasted text | Direct input | Full style analysis |

#### 3.2.4 Multiple References and Compositing

Users can provide multiple references and specify which style attributes to extract from each. This enables mixing styles: the hook pattern from one creator, the tone from another, and the formatting from a brand guide.

- Each reference is tagged with which attributes to extract (hook, tone, structure, etc.).
- The system merges attributes from multiple references into a single composite style profile.
- Conflicts are resolved by priority order (user sets which reference takes precedence).

#### 3.2.5 Saved Style Library

Style profiles are first-class entities in the system. Users build a personal library of saved styles that can be applied to any pipeline.

- Profiles are stored in the database with a user-defined name and description.
- Users can browse, search, and manage their style library.
- Profiles can be shared between team members.

### 3.3 AI Agent Steps

Pre-built AI-powered steps that implement the PipelineStep Protocol. Each agent step receives its LLMProvider dependency via constructor injection, making the underlying model swappable without changing step logic.

| Agent Step | Input | Output | Description |
|---|---|---|---|
| Reference Analyzer | URL, file, or pasted text | Style profile (JSON) | Extracts pure stylistic patterns — no information copied |
| Idea Generator | Topic/niche + optional style | List of content ideas | Generates content ideas based on trends, audience, niche |
| Research Agent | Content idea/brief | Structured research notes | Gathers relevant information, statistics, and references |
| Script Writer | Research + style profile | Full script/draft | Produces longform content matching the target style |
| Content Editor | Draft content | Edited content | Reviews and improves grammar, tone, structure |
| Thumbnail/Visual Agent | Content summary + style | Image prompts or visuals | Creates visual assets for content |
| SEO Optimizer | Content + keywords | Optimized content + metadata | Optimizes for search and discovery |
| Hashtag/Tag Generator | Content + platform | Platform-specific tags | Generates optimal hashtags and tags per platform |

### 3.4 Content Transformation

Transforms source content into multiple output formats. Each transformer implements the ContentTransformer Protocol and can be chained or run in parallel (fan-out). Transformers respect the style profile if present in the pipeline context.

| Transform | From | To | Example |
|---|---|---|---|
| Long to Video (Mid) | Longform content | 10-min video script | Blog post → YouTube video |
| Long to Video (Short) | Longform content | 30-60s clip script | Article → TikTok/Reels |
| Long to Thread | Longform content | X/Twitter thread | Research → viral thread |
| Long to Social Post | Longform content | Single platform post | Article → LinkedIn update |
| Long to Newsletter | Longform content | Formatted email | Blog post → weekly newsletter |
| Long to Carousel | Longform content | Multi-slide visual text | Guide → Instagram carousel |
| Long to Audio | Longform content | Podcast script | Article → podcast episode |
| Long to Community | Longform content | Discussion post | Research → Reddit post |
| Script to Captions | Video script | SRT/VTT file | YouTube script → subtitles |
| Cross-Platform Adapt | Any single-platform | Different platform | YouTube script → TikTok script |

### 3.5 Deployment Agents

Automated publishing via outbound adapters implementing the DeployTarget Protocol. Each platform adapter handles API authentication, format requirements, and scheduling independently.

| Platform | Content Types | Capabilities |
|---|---|---|
| YouTube | Video (long), Shorts | Upload, title/description/tags, thumbnail, scheduling, chapters |
| TikTok | Short video | Upload, captions, hashtags, sounds, scheduling |
| X / Twitter | Threads, single posts | Thread posting, media attachment, hashtags, scheduling |
| LinkedIn | Posts, articles, carousels | Text posts, document carousels, article publishing |
| Instagram | Reels, carousels, stories | Media upload, captions, hashtags, carousel slides |
| Blog / CMS | Articles | WordPress, Ghost, Webflow via API, SEO metadata |
| Substack / Medium | Articles, newsletters | Article publishing with formatting |
| Newsletter | Email content | Mailchimp, ConvertKit, Beehiiv distribution |
| Reddit | Discussion posts | Subreddit posting with appropriate flair |
| Discord | Messages, embeds | Channel posting, rich embeds, thread creation |
| Podcast Platforms | Audio + show notes | RSS feed update, episode metadata |

### 3.6 User Configuration

- **Persona Settings:** Define brand voice, tone, vocabulary, and style guidelines as defaults across all AI agent steps.
- **Style Library:** Saved style profiles extracted from reference content, applicable to any pipeline.
- **Pipeline Templates:** Pre-configured pipelines for common workflows ('Blog to Everything', 'Idea to X Thread', 'YouTube Content Machine').
- **Multi-Choice Selection:** At key decision points, the system presents multiple options for user selection.
- **Approval Rules:** Configure which steps require manual approval and which run automatically.
- **Platform Preferences:** Per-platform settings: default hashtags, posting schedules, audience preferences.

---

## 4. System Architecture

### 4.1 Hexagonal Architecture Overview

The backend follows a strict Hexagonal Architecture (Ports & Adapters) pattern. The domain layer sits at the center, defining business logic through Protocol-based ports and frozen dataclass models. Inbound adapters (FastAPI routes, Cloud Tasks handlers) drive the domain. Outbound adapters (LLM providers, storage, deployers) implement domain-defined protocols. Dependencies always point inward — domain code never imports FastAPI, SQLAlchemy, or any infrastructure package.

**Dependency flow:** `[Inbound: FastAPI Router / Cloud Tasks Handler]` → `[Port: Service Protocol]` → `[Domain Logic]` → `[Port: Repository/Provider Protocol]` → `[Outbound: Postgres / Claude / R2 / YouTube]`

| Layer | Responsibility | Key Rule |
|---|---|---|
| Domain | Business logic, models, errors, ports (Protocols), services | Never imports from inbound/ or outbound/. No FastAPI, no SQLAlchemy, no SDKs. |
| Inbound | HTTP routes, Cloud Tasks handlers, webhooks, request/response schemas | Parse input → call service → map response. No SQL. No business logic. |
| Outbound | Implementations of domain protocols (DB, LLM, storage, deploy, etc.) | Implements domain Protocols. Owns transactions. Maps DB/API errors to domain errors. |
| App (Bootstrap) | Constructs adapters, wires services, starts application | No FastAPI/SQLAlchemy imports in main.py. Pure assembly. |

### 4.2 Domain Layer Design

#### 4.2.1 Domain Boundaries

The domain is organized into bounded contexts, each with its own models, errors, ports, and services. Entities that change atomically belong in the same domain. Cross-domain operations use service calls or async events, never shared transactions.

| Domain | Responsibility | Key Models |
|---|---|---|
| pipeline | Pipeline orchestration, run state, step execution | Pipeline, PipelineRun, StepConfig, PipelineContext |
| steps | Step execution contracts and registry | StepInput, StepOutput, StepProgress |
| style | Style reference analysis, profile management | StyleProfile, StyleAttribute, ReferenceSource |
| content | Content assets, transformations, deployment | ContentAsset, DeployRecord, TransformResult |

#### 4.2.2 Ports (Protocol Classes)

All external dependencies are defined as `typing.Protocol` classes in the domain layer. This provides structural subtyping — implementors don't need to inherit from the protocol, they just need to match the method signatures. Protocols are grouped into three categories:

| Category | Protocol | Purpose | Example Outbound Adapters |
|---|---|---|---|
| Repository | PipelineRepository | Pipeline and run persistence | PostgresPipelineRepository |
| Repository | StyleProfileRepository | Style profile storage | PostgresStyleRepository |
| Provider | LLMProvider | AI text generation | ClaudeProvider, OpenAIProvider, LocalLlamaProvider |
| Provider | StorageProvider | File storage (S3-compatible) | R2StorageAdapter, LocalStorageAdapter |
| Provider | MediaGenerator | Audio/video/image generation | RunwayAdapter, ElevenLabsAdapter, StabilityAdapter |
| Provider | ReferenceFetcher | Content retrieval from URLs/files | WebFetcher, YouTubeTranscriptFetcher, FileFetcher |
| Provider | TranscriptionProvider | Audio/video to text | WhisperAdapter, AssemblyAIAdapter |
| Target | DeployTarget | Content publishing | XTwitterDeployer, YouTubeDeployer, LinkedInDeployer |
| Target | ContentTransformer | Format conversion | LongToThreadTransformer, LongToShortVideoTransformer |
| Step | PipelineStep | Pipeline step execution | IdeaGeneratorStep, ScriptWriterStep, HumanGateStep |

#### 4.2.3 Models

- Domain models use `@dataclass(frozen=True)` for immutability and validation on construction.
- No ORM models in the domain layer — SQLAlchemy models live exclusively in `outbound/`.
- Separate request models (`CreatePipelineRequest`) from entity models (`Pipeline`) — they will diverge.
- Value objects (`StyleAttribute`, `StepConfig`) validate their own invariants on construction.

#### 4.2.4 Errors

- Exhaustive error hierarchy per domain: one class per business rule violation.
- Never raise `HTTPException` in domain — that leaks transport concerns.
- Inbound layer maps domain errors to HTTP responses via `@app.exception_handler` (RFC 9457 ProblemDetails).
- Outbound adapters catch infrastructure errors (`IntegrityError`, API timeouts) and raise domain errors.

#### 4.2.5 Services

Each domain has a Service Protocol declaring the business API and a ServiceImpl class implementing it. Services orchestrate: repository operations, provider calls, notifications, and return domain results. Inbound handlers call Services, never Repositories or Providers directly.

### 4.3 Inbound Layer Design

#### 4.3.1 Shell Pattern

FastAPI is wrapped in a Shell class so that `main.py` never imports FastAPI directly. The Shell exposes a `build_test_app()` method that returns an ASGI app without uvicorn, enabling direct testing with `httpx.AsyncClient`.

- Shell class owns FastAPI instance, middleware registration, and router mounting.
- CORS middleware is added before routers (order matters).
- Lifespan context manager (not deprecated `@app.on_event`) manages startup/shutdown.

#### 4.3.2 Dependency Injection

Services are injected via FastAPI lifespan state. The lifespan yields a dict of services, which becomes available through `request.state`. This uses the ASGI spec directly — no framework-specific DI.

- Lifespan yields: `{"pipeline_service": svc, "style_service": svc, "content_service": svc}`
- Dependencies: `with_pipeline_service(request)` returns `request.state.pipeline_service`
- Steps receive their Protocol dependencies (LLMProvider, StorageProvider) via constructor injection at bootstrap.

#### 4.3.3 Request/Response Separation

- HTTP request schemas (`CreatePipelineHttpRequest`) are separate from domain models.
- Request schemas provide `try_into_domain()` method to validate and convert to domain types.
- Response schemas provide `from_domain()` classmethod to build response from domain models.
- Domain models are never exposed directly to API consumers.

#### 4.3.4 Error Mapping

Domain errors are mapped to HTTP responses via `@app.exception_handler` in `inbound/http/errors.py`. All error responses follow RFC 9457 ProblemDetails format. Unknown/unexpected errors are logged server-side with full context and return a generic 500 message to the client.

### 4.4 Outbound Layer Design

#### 4.4.1 Adapter Rules

- Each adapter implements a domain Protocol. It handles all infrastructure-specific concerns.
- Transactions are encapsulated in the adapter, invisible to callers. Keep transactions short.
- No external calls (HTTP, queues) inside database transactions.
- ORM models live in `outbound/postgres/models.py`. An explicit mapper (`PipelineMapper.to_domain()`) translates ORM models to domain models.
- Infrastructure errors (`IntegrityError`, `ConnectionError`, API rate limits) are caught and re-raised as domain error types.

#### 4.4.2 Async Safety

In async routes, ALL I/O must be async. Blocking calls (`time.sleep`, `requests.get`, synchronous file I/O) will block the entire event loop. For sync libraries that cannot be avoided, use synchronous `def` handlers which run in a thread pool.

- SQLAlchemy async: use `expire_on_commit=False`, `selectinload()` for relationships, per-request session in adapter.
- Connection pool: `pool_size=10`, `pool_timeout=3`, `pool_pre_ping=True`.
- All LLM API calls, storage operations, and deploy actions use async HTTP clients (`httpx.AsyncClient`).

### 4.5 Pipeline Execution Flow

The pipeline execution follows an async, event-driven, step-per-request model designed to work within Cloud Run's request timeout constraints.

1. **Pipeline Initiated:** User triggers a pipeline via the API. The PipelineService creates a PipelineRun record in Neon DB (via PipelineRepository adapter) with status 'pending' and enqueues the first step to Cloud Tasks.
2. **Style Resolution:** If the pipeline includes references or a saved style profile, the StyleService loads the style context into the PipelineContext before step execution begins.
3. **Step Execution:** Cloud Tasks triggers a Cloud Run request. The inbound handler retrieves the PipelineRun from the repository, resolves the current step from the StepRegistry, calls `step.execute()` with context, and saves results back via the repository.
4. **Progress Reporting:** During execution, each step calls a `progress_callback` that writes to the `step_progress` table. The frontend receives updates via SSE polling the DB every 2 seconds.
5. **Human Gate:** If the next step is a human gate, the pipeline pauses (status: 'waiting_for_approval'). No Cloud Run request is active during the wait. User approval enqueues the next step.
6. **Fan-Out:** For multi-format output, the orchestrator enqueues multiple transform steps simultaneously. Each branch runs independently. Results are collected when all branches complete.
7. **Multi-Platform Deploy:** After transforms complete, deploy steps run in parallel for each target platform via their respective DeployTarget adapters.
8. **Completion:** All branches and deployments finish. Pipeline run status is set to 'completed' with links to all published content.

---

## 5. Infrastructure

### 5.1 Technology Stack

| Component | Technology | Rationale |
|---|---|---|
| Frontend | Next.js on Cloudflare Workers/Pages | Edge-deployed for low latency, React ecosystem for pipeline builder and style library UI |
| Backend API | FastAPI (Python) on Google Cloud Run | Python-first AI SDK ecosystem, async support, auto-generated API docs, serverless scaling |
| Database | Neon DB (Serverless PostgreSQL) | Serverless scaling, built-in connection pooling, JSONB for flexible configs and style profiles |
| Job Queue | Google Cloud Tasks | Native Cloud Run integration, handles retries and timeouts, generous free tier |
| Event Bus | Google Pub/Sub | Fan-out for parallel transforms and multi-platform deploys |
| File Storage | Cloudflare R2 | S3-compatible API, zero egress fees, global edge network, pairs with CF Workers frontend |
| Real-time Updates | SSE (Server-Sent Events) | Simple one-directional server-to-client, works through Cloudflare, no WebSocket complexity |
| Edge Cache | Cloudflare KV | Cache pipeline templates, style profiles, and static assets at the edge |
| Package Management | uv | Fast Python package manager, lockfile committed (uv.lock) |

### 5.2 Cloudflare R2 Storage

All generated content files (scripts, images, video, audio, carousel slides) are stored in Cloudflare R2. R2 provides an S3-compatible API with zero egress fees, making it ideal for a content platform that serves files to multiple deployment targets.

- R2 is accessed through the StorageProvider Protocol, so the domain layer has no R2-specific code.
- The `R2StorageAdapter` in `outbound/storage/r2.py` implements the StorageProvider Protocol using the S3-compatible API (boto3 or httpx with S3 signing).
- Switching to S3, GCS, or any other storage requires only a new adapter — no domain or inbound changes.
- R2 pairs naturally with Cloudflare Workers for direct edge access to stored content when needed.

### 5.3 Deployment Architecture

- Single Cloud Run service handles all API endpoints and step execution (modular code, monolithic deployment).
- Cloudflare Workers/Pages serves the frontend at the edge with global distribution.
- Cloudflare R2 stores all generated content with zero egress costs.
- Neon DB provides serverless PostgreSQL with automatic scaling and connection pooling.
- All services scale to zero when idle, minimizing costs during low-traffic periods.
- Future: GPU-requiring steps (video/audio generation) can be separated into a dedicated Cloud Run service.

### 5.4 Request Flow and Timeouts

Each pipeline step runs as a separate Cloud Run request (well under the 30-minute timeout). State lives in Neon DB, not in memory. Long-running external operations (video generation, transcription) use a webhook/callback pattern: the step starts the job and returns immediately; a webhook endpoint receives the result and enqueues the next step.

---

## 6. Data Model

ORM models live exclusively in `outbound/postgres/models.py`. Domain models are frozen dataclasses. The `PipelineMapper`/`StyleMapper` classes in `outbound/` handle translation between the two.

### 6.1 Core Tables

| Table | Purpose | Key Columns |
|---|---|---|
| users | User accounts and preferences | id, email, persona_config (JSONB), created_at |
| style_profiles | Saved style profiles from reference analysis | id, user_id, name, description, source_url, profile_data (JSONB), created_at |
| pipeline_templates | Reusable pipeline configurations | id, user_id, name, config (JSONB), version, created_at |
| pipeline_runs | Individual pipeline executions | id, template_id, user_id, state (enum), context (JSONB), style_profile_id, created_at |
| step_progress | Per-step execution tracking | run_id, step_index, status, detail, percent, result (JSONB), started_at, finished_at |
| content_assets | Generated content files and text | id, run_id, step_index, format_type, r2_key, content_text, metadata (JSONB) |
| deploy_records | Publishing history per platform | id, run_id, platform, status, platform_url, published_at |
| platform_accounts | Connected platform credentials | id, user_id, platform, credentials (encrypted), settings (JSONB) |

### 6.2 Pipeline Run States

| State | Description | Trigger |
|---|---|---|
| pending | Run created but not yet started | User initiates pipeline |
| running | One or more steps actively executing | First step begins execution |
| waiting_for_approval | Paused at a human gate step | Human gate step reached |
| completed | All steps and deploys finished successfully | Final deploy completes |
| partially_completed | Some branches succeeded, others failed | Mixed results in fan-out |
| failed | A critical step encountered an unrecoverable error | Step throws error after retries |
| cancelled | User manually stopped the pipeline | User cancels via UI/API |

---

## 7. API Design

All API endpoints follow the handler pattern: parse input → call service → map response. Handlers never contain business logic, SQL, or direct adapter calls. Error responses use RFC 9457 ProblemDetails format.

### 7.1 Pipeline Management

| Endpoint | Method | Description |
|---|---|---|
| /api/pipelines | GET | List user pipeline templates |
| /api/pipelines | POST | Create new pipeline template |
| /api/pipelines/{id} | PUT | Update pipeline template configuration |
| /api/pipelines/{id} | DELETE | Delete pipeline template |

### 7.2 Pipeline Execution

| Endpoint | Method | Description |
|---|---|---|
| /api/runs | POST | Start a new pipeline run (with optional style profile and references) |
| /api/runs/{id} | GET | Get run status, all step progress, and branch statuses |
| /api/runs/{id}/stream | GET (SSE) | Real-time progress stream via Server-Sent Events |
| /api/runs/{id}/approve | POST | Approve current human gate and continue pipeline |
| /api/runs/{id}/reject | POST | Reject current step output (retry or halt) |
| /api/runs/{id}/cancel | POST | Cancel a running pipeline |

### 7.3 Style Profiles

| Endpoint | Method | Description |
|---|---|---|
| /api/styles | GET | List user saved style profiles |
| /api/styles | POST | Create new style profile from reference content |
| /api/styles/{id} | GET | Get full style profile data |
| /api/styles/{id} | PUT | Update style profile name, description, or attributes |
| /api/styles/{id} | DELETE | Delete a saved style profile |
| /api/styles/analyze | POST | Analyze reference content and return style profile (without saving) |

### 7.4 Platform Accounts

| Endpoint | Method | Description |
|---|---|---|
| /api/platforms | GET | List connected platform accounts |
| /api/platforms/connect | POST | Initiate OAuth flow for a new platform |
| /api/platforms/{id}/disconnect | POST | Disconnect a platform account |
| /api/platforms/{id}/settings | PUT | Update platform-specific settings |

### 7.5 Internal Endpoints

| Endpoint | Method | Description |
|---|---|---|
| /api/internal/execute-step | POST | Called by Cloud Tasks to execute a specific pipeline step |
| /api/internal/webhook/{provider} | POST | Receives callbacks from external services (video gen, transcription) |

---

## 8. Project Structure

The codebase follows the Hexagonal Architecture pattern with strict layer separation. The `domain/` directory never imports from `inbound/` or `outbound/`. All external dependencies are accessed through Protocol-defined ports. The `main.py` bootstrap file constructs adapters, wires services, and starts the application without importing FastAPI or SQLAlchemy directly.

```
content-factory/
  backend/
    src/
      app/
        main.py                          # Bootstrap ONLY — no FastAPI/SQLAlchemy imports
        application.py                   # App orchestrator (TaskGroup for workers)
        config.py                        # pydantic-settings (env vars, secrets)

      domain/                            # ━━ NEVER imports from inbound/ or outbound/ ━━
        pipeline/
          models.py                      # Pipeline, PipelineRun, StepConfig (@dataclass frozen)
          errors.py                      # PipelineNotFoundError, StepExecutionError, etc.
          ports.py                       # PipelineRepository, PipelineRunner (Protocol)
          service.py                     # PipelineServiceImpl

        steps/
          models.py                      # StepInput, StepOutput, StepProgress
          errors.py                      # StepFailedError, StepTimeoutError
          ports.py                       # PipelineStep, LLMProvider, MediaGenerator (Protocol)
          registry.py                    # StepRegistry

        style/
          models.py                      # StyleProfile, StyleAttribute (@dataclass frozen)
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
          handler.py                     # Cloud Tasks step execution (inbound adapter)
          webhook.py                     # External service webhooks (inbound adapter)

      outbound/                          # ━━ Implements domain Protocols ━━
        postgres/
          pipeline_repository.py         # impl PipelineRepository Protocol
          style_repository.py            # impl StyleProfileRepository Protocol
          models.py                      # SQLAlchemy ORM models (ONLY here)
          mapper.py                      # ORM ↔ domain translation
        llm/
          claude.py                      # impl LLMProvider Protocol
          openai.py                      # impl LLMProvider Protocol
        storage/
          r2.py                          # impl StorageProvider Protocol (Cloudflare R2)
          local.py                       # impl StorageProvider Protocol (dev/test)
        deploy/
          x_twitter.py                   # impl DeployTarget Protocol
          youtube.py                     # impl DeployTarget Protocol
          linkedin.py                    # impl DeployTarget Protocol
          wordpress.py                   # impl DeployTarget Protocol
          newsletter.py                  # impl DeployTarget Protocol
        media/
          runway.py                      # impl MediaGenerator Protocol
          elevenlabs.py                  # impl MediaGenerator Protocol
        fetcher/
          web.py                         # impl ReferenceFetcher Protocol
          youtube_transcript.py          # impl ReferenceFetcher Protocol
          file.py                        # impl ReferenceFetcher Protocol
        transcription/
          whisper.py                     # impl TranscriptionProvider Protocol

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

## 9. Bootstrap and Dependency Injection

The application bootstrap (`main.py`) is responsible for constructing all adapters, wiring them into domain services, and starting the application. It contains no FastAPI or SQLAlchemy imports — those are encapsulated in Shell and repository adapters respectively.

### 9.1 Bootstrap Flow

1. **Load configuration:** Read environment variables via pydantic-settings (`config.py`).
2. **Construct outbound adapters:** `PostgresPipelineRepository(engine)`, `ClaudeProvider(api_key)`, `R2StorageAdapter(credentials)`, etc.
3. **Assemble domain services:** `PipelineServiceImpl(repo, step_registry)`, `StyleServiceImpl(repo, fetchers)`, `ContentServiceImpl(storage, transformers)`.
4. **Register steps in StepRegistry:** Each step is constructed with its Protocol dependencies and registered by type name.
5. **Create Shell with services:** Shell receives services dict, makes them available via lifespan state.
6. **Start application:** `Shell.run()` starts uvicorn. For tests, `Shell.build_test_app()` returns ASGI app without server.

### 9.2 DI Mechanism

The DI approach uses FastAPI's lifespan context manager and ASGI `request.state` — no framework-specific DI container is needed.

- Lifespan yields a dict of assembled services: `{"pipeline_service": svc, "style_service": svc, ...}`
- Dependency functions (`with_pipeline_service`) extract services from `request.state`.
- Steps receive Protocol dependencies via constructor injection at bootstrap time (not at request time).
- This approach is framework-agnostic — the same assembly works if FastAPI is ever replaced.

### 9.3 Testing Strategy

- `Shell.build_test_app()` returns ASGI app testable with `httpx.AsyncClient`.
- Domain services are testable with mock Protocol implementations (no real DB/API needed).
- Outbound adapters are independently testable against real or test infrastructure.
- Steps are independently testable with mock LLMProvider, mock StorageProvider, etc.
- Integration tests wire real adapters against test databases and R2 buckets.

---

## 10. Development Roadmap

### Phase 1: Core Pipeline Engine (Weeks 1–3)

- Set up project structure following hexagonal architecture (`domain/`, `inbound/`, `outbound/`, `app/`).
- Define all domain models as frozen dataclasses: Pipeline, PipelineRun, StepConfig, StepInput, StepOutput.
- Define all core Protocols: PipelineStep, LLMProvider, StorageProvider, PipelineRepository.
- Build PipelineServiceImpl with run orchestration logic.
- Build Pipeline Runner with Cloud Tasks step-per-request execution and state tracking.
- Implement StepRegistry for dynamic step lookup.
- Build basic steps: IdeaGeneratorStep, ScriptWriterStep, HumanGateStep.
- Outbound: PostgresPipelineRepository, ClaudeProvider, R2StorageAdapter.
- Inbound: Shell class wrapping FastAPI, pipeline routes (parse → service → response).
- Bootstrap: main.py wiring all adapters and services. uv.lock committed.
- Set up Neon DB schema (all core tables). Error handling with RFC 9457.

### Phase 2: Frontend and Real-Time Progress (Weeks 4–6)

- Dashboard showing pipeline runs with real-time status updates via SSE.
- Human review screen: approve, edit, or reject step outputs.
- Pipeline builder UI: select steps, configure each, save as template.
- User persona and style settings.

### Phase 3: Style Reference System (Weeks 7–9)

- Define style domain: StyleProfile, StyleAttribute models, StyleServiceImpl.
- Define ReferenceFetcher and TranscriptionProvider Protocols.
- Build outbound adapters: WebFetcher, YouTubeTranscriptFetcher, FileFetcher.
- Implement ReferenceAnalyzerStep with style-only extraction.
- Style profile CRUD via StyleServiceImpl and inbound routes.
- Style library UI: browse, save, apply, and manage style profiles.
- Multi-reference compositing: merge style attributes from multiple sources.

### Phase 4: Multi-Format Transformation (Weeks 10–12)

- Define ContentTransformer Protocol and base transformer step.
- Implement core transformers: LongToThread, LongToShortVideo, LongToPost, LongToNewsletter.
- Fan-out support via Pub/Sub: one source producing multiple format outputs in parallel.
- Multi-choice presentation: system generates multiple variations for user selection.
- Per-format style adaptation from the same style profile.

### Phase 5: Multi-Platform Deployment (Weeks 13–15)

- Define DeployTarget Protocol and deployment step.
- Outbound adapters: XTwitterDeployer, YouTubeDeployer, LinkedInDeployer, WordPressDeployer.
- Newsletter deployer: Mailchimp, ConvertKit adapters.
- Platform account management UI with OAuth flows.
- End-to-end testing: idea to multi-platform deployment.

### Phase 6: Scale and Polish (Weeks 16+)

- Additional LLM adapters (OpenAI, local models) for provider flexibility.
- Media generation adapters (video, audio, thumbnails) via MediaGenerator Protocol.
- Instagram, TikTok, Reddit, Discord deployers.
- Advanced pipeline features: conditional branching, loops, retry strategies.
- Analytics dashboard: content performance tracking across all platforms.
- Team collaboration: shared pipelines, shared style libraries, role-based access.
- Rate limiting, cost tracking, and usage quotas per user.

---

## 11. Design Principles

These principles guide every technical and product decision in the platform:

**1. Changeability Above All.** The AI content industry changes faster than any other. Every external dependency must be replaceable by writing one new adapter file. If something cannot be easily swapped, the architecture is wrong.

**2. Dependencies Point Inward.** Domain code never imports from `inbound/` or `outbound/`. Domain defines Protocols; adapters implement them. This is the fundamental rule of hexagonal architecture.

**3. Pipeline as Data.** Pipeline definitions are configuration, not code. Adding a step never requires a code deployment. The pipeline itself is changeable — add, remove, reorder, branch, all from config.

**4. Media Agnostic.** Video, threads, posts, articles, audio, newsletters are all outputs of transformers behind the same Protocol. Adding a new format means one transformer and one deployer, never changing the core.

**5. Style, Not Information.** The reference system extracts how content communicates, not what it communicates. Style profiles are pure patterns applicable to any topic.

**6. Ports and Adapters.** Every external system (LLM, storage, deploy target, transcription) is accessed through a Protocol port in the domain. The outbound adapter is the only file that knows the specifics. Swap the adapter, everything else is untouched.

**7. Steps are Dumb, Orchestration is Smart.** Each step does one thing and is independently testable. The pipeline runner handles sequencing, fan-out, error recovery, and human gates.

**8. Modular Code, Monolithic Deployment.** Code is organized in isolated, testable modules. Deployment is a single service. Split into microservices only when there is a concrete reason.

**9. State in the Database.** No step holds state in memory across requests. All state persists in Neon DB. This enables serverless execution, crash recovery, and horizontal scaling.

**10. Bootstrap Assembles, Domain Decides.** `main.py` constructs adapters and wires services. It imports no frameworks. Domain services contain all business logic. Handlers only parse, call, and respond.

---

## 12. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| AI model API changes or deprecation | High | LLMProvider Protocol isolates model-specific logic; new adapter only |
| Social platform API changes (X, LinkedIn, TikTok) | High | DeployTarget Protocol; each adapter is independently updatable |
| Platform API rate limits or access restrictions | Medium | Queue-based deploys with rate limiting; fallback to draft/export |
| Video/audio generation tool landscape shifts | High | MediaGenerator Protocol; swap adapter without pipeline changes |
| Style extraction quality varies across content types | Medium | Iterative prompt refinement; human gate after analysis; editable profiles |
| Reference content copyright/legal concerns | Medium | System extracts style patterns only, never reproduces content |
| Cloud Run cold start latency | Low | Minimum instances in production; optimized container image |
| R2 storage compatibility with specific tools | Low | S3-compatible API; StorageProvider Protocol enables switching to S3/GCS |
| Fan-out complexity scaling | Medium | Start simple; add DAG support incrementally in runner only |
| Cost management at scale | High | Cost tracking per step, usage quotas, provider-level rate limiting, style profile caching |

---

## 13. Architecture Compliance Checklist

Use this checklist to verify every PR and new feature adheres to the hexagonal architecture:

### Domain Layer

- [ ] Domain models are `@dataclass(frozen=True)`, no ORM coupling
- [ ] Domain errors are exhaustive (one class per business rule violation)
- [ ] No `HTTPException` raised anywhere in `domain/`
- [ ] All external dependencies defined as Protocol classes in `ports.py`
- [ ] Services orchestrate: repo → provider → return result
- [ ] `domain/` has zero imports from `inbound/` or `outbound/`

### Inbound Layer

- [ ] FastAPI wrapped in Shell class
- [ ] `Shell.build_test_app()` exposed for tests
- [ ] Lifespan context manager used (not `@app.on_event`)
- [ ] DI via lifespan state + `request.state`
- [ ] Handlers do: parse → service → response (no SQL, no business logic)
- [ ] HTTP schemas separate from domain models (`try_into_domain` / `from_domain`)
- [ ] Errors mapped via `@app.exception_handler` with RFC 9457 format
- [ ] CORS middleware added before routers

### Outbound Layer

- [ ] Each adapter implements a domain Protocol
- [ ] Transactions encapsulated in adapter, invisible to callers
- [ ] No external calls (HTTP, queues) inside DB transactions
- [ ] ORM models live in `outbound/postgres/models.py` only
- [ ] Explicit mapper (`to_domain` / `from_domain`) for ORM translation
- [ ] Infrastructure errors caught and re-raised as domain errors
- [ ] `expire_on_commit=False` for async SQLAlchemy sessions
- [ ] `selectinload()` for relationship loading

### Bootstrap

- [ ] `main.py` has no FastAPI/SQLAlchemy imports
- [ ] Adapters constructed → services assembled → app started
- [ ] `uv.lock` committed
- [ ] All Protocol dependencies injected via constructor

### Async Safety

- [ ] No blocking calls (`time.sleep`, `requests.get`) in async routes
- [ ] All I/O uses async (`httpx`, `aiofiles`, async SQLAlchemy)
- [ ] `pool_timeout` set on database engine
- [ ] `pool_pre_ping=True` for connection health checks

---

*This document serves as the technical blueprint for the AI Content Factory platform. It is designed to be a living document that evolves alongside the product. The hexagonal architecture ensures that every external dependency is isolated behind Protocol-defined ports, enabling the platform to adapt as fast as the industry it serves. The domain defines what the system does; adapters decide how.*
