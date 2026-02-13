# Kova — Technical PRD

| | |
|---|---|
| **Version** | 4.1 |
| **Date** | February 2025 |
| **Status** | Draft |
| **Companion** | Product PRD v2.1, MVP PRD |

---

## Changelog (v4.1)

| Change | Section | Rationale |
|---|---|---|
| Removed `POST /styles/composite` endpoint | §8.6 | Multi-reference compositing removed from product scope. Manual attribute editing covers power-user needs. |
| Removed composite-related data flows | §15.3 | Style reference flow simplified to single-reference extraction only. |
| Added style preview validation to data flow | §15.3 | Extraction now includes mandatory preview generation before save. |
| Updated Style domain description | §2.1 | Removed composite references from bounded context. |
| Updated Protocol Catalog | §2.2 | No protocol changes needed — `StyleProfileRepository` and `LLMProvider` already support single-reference workflow. |

---

## 1. Architecture

Hexagonal Architecture (Ports & Adapters). Dependencies point inward. Domain never imports infrastructure.

```
Inbound (FastAPI, Cloud Tasks, Webhooks)
  → Domain (Models, Protocols, Services)
    → Outbound (Postgres, LLM APIs, R2, Deployers)
```

**Key decisions:**

- Python + FastAPI — day-1 SDK support for new AI tools, async I/O for LLM-bound workloads.
- Protocol-based ports (`typing.Protocol`, structural subtyping) — swap any adapter without touching domain.
- Pipeline steps as stateless, individually-executed units via Cloud Tasks.
- All state in PostgreSQL, never in memory across requests.
- API-first for all ML inference. CPU-only tools (FFmpeg, MediaPipe, PySceneDetect) run in Cloud Run container.
- Single Cloud Run service (modular code, monolithic deployment) until concrete reason to split.

### Why Hexagonal

| Concern | Advantage |
|---|---|
| New AI model released | Write one adapter file implementing LLMProvider Protocol |
| Platform API changes | Update one deployer adapter, domain untouched |
| Switch storage provider | New adapter implementing StorageProvider Protocol |
| Replace database | New repository adapter, same Protocol interface |
| Change web framework | Replace inbound layer, domain untouched |
| Add new content format | One transformer + one deployer, plug into existing pipeline |

### Why Python + FastAPI

The bottleneck is LLM API latency (2–30s), not server processing speed. New AI tools release Python SDKs on day 1 — Rust/Go support comes months later or never. FastAPI async handles I/O-bound workload efficiently.

---

## 2. Domain Design

### 2.1 Bounded Contexts

| Domain | Responsibility | Key Models |
|---|---|---|
| org | Organization, membership, roles | Organization, OrgMembership |
| brand | Brand identity, voice, platform accounts | Brand, BrandSettings, PlatformAccount |
| pipeline | Orchestration, run state, step execution, templates | Pipeline, PipelineRun, PipelineTemplate, PipelineVersion, StepConfig, PipelineContext |
| steps | Step execution contracts and registry | StepInput, StepOutput, StepProgress |
| style | Reference analysis, profile management, preview validation | StyleProfile, StyleAttribute, ReferenceSource |
| content | Assets, transformations, deployment | ContentAsset, DeployRecord, TransformResult |
| trends | Trend signals, topic aggregation | TrendSignal, TrendTopic |
| notifications | In-app notification delivery | Notification, NotificationPreference |

Cross-domain operations use service calls, never shared transactions.

### 2.2 Protocol Catalog

| Category | Protocol | Purpose |
|---|---|---|
| Repository | OrgRepository | Organization and membership persistence |
| Repository | BrandRepository | Brand and platform account storage |
| Repository | PipelineRepository | Pipeline, template, and run persistence |
| Repository | StyleProfileRepository | Style profile storage |
| Repository | TrendRepository | Trend signal and topic storage |
| Repository | ContentRepository | Content assets and deploy records |
| Repository | NotificationRepository | Notification persistence and queries |
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
| Provider | LLMProviderRegistry | Resolves provider by name for per-step model selection |
| Target | DeployTarget | Content publishing to platforms (supports `scheduled_at`) |
| Target | ContentTransformer | Format conversion (long → thread, etc.) |
| Step | PipelineStep | Pipeline step execution contract |

### 2.3 Domain Rules

- Models use `@dataclass(frozen=True)` for immutability.
- No ORM in domain layer — ORM lives in outbound only.
- Exhaustive error hierarchy per domain (one class per business rule violation).
- Never raise HTTP exceptions in domain — that leaks transport concerns.
- Each domain has a Service Protocol (interface) and ServiceImpl. Inbound calls Services, never Repositories or Providers directly.
- All resources scoped by `org_id`. `user_id` tracked as `created_by` for audit.

---

## 3. Layer Rules

**Inbound:**
- FastAPI wrapped in Shell class — bootstrap never imports FastAPI directly.
- Shell exposes `build_test_app()` for testing.
- Services injected via FastAPI lifespan state — no framework-specific DI container.
- HTTP request/response schemas separate from domain models.
- Handlers only: parse input → call service → map response. No SQL, no business logic.
- Domain errors mapped to HTTP via exception handlers (RFC 9457 ProblemDetails).

**Domain:**
- Never imports from inbound or outbound.
- Defines all external contracts as Protocol classes.
- Models are frozen dataclasses with self-validating value objects.
- Services orchestrate: repository → provider → return result.

**Outbound:**
- Each adapter implements a domain Protocol.
- Transactions encapsulated in adapter, invisible to callers.
- No external calls (HTTP, queues) inside database transactions.
- ORM models only here. Explicit mappers to/from domain models.
- Infrastructure errors caught and re-raised as domain error types.
- All I/O must be async.

**Bootstrap:**
- `main.py` has zero framework imports. Constructs adapters, wires services, starts app.
- AI model selection driven by configuration (env vars).
- All Protocol dependencies injected via constructor at startup.
- Swapping any adapter = change config, restart.

---

## 4. Pipeline Execution Engine

### 4.1 Execution Model

Each step runs as a separate Cloud Run request triggered by Cloud Tasks. Steps are stateless — all state in DB between executions. Long-running operations (video, transcription) use webhook callbacks.

```
User triggers pipeline → PipelineRun created (pending)
  → Enqueue step → Cloud Tasks → Cloud Run
    → Load context from DB → Check run status (if paused/cancelled, stop)
    → Resolve AI provider (step config → pipeline config → global default)
    → Execute step (with brand + style context)
    → Save results to DB
    → Next step? Enqueue. Human gate? Pause. Fan-out? Enqueue N. Done? Complete.
```

### 4.2 Run States

| State | Description |
|---|---|
| pending | Created, first step not yet started |
| running | One or more steps actively executing |
| waiting_for_approval | Paused at human gate |
| paused | User manually paused — resumes on user action |
| completed | All steps finished successfully |
| partially_completed | Some fan-out branches succeeded, others failed |
| failed | Critical step failed after retries |
| cancelled | User manually stopped |

**Pause/Resume:** Between steps, the executor checks run status. If `paused`, it does not enqueue the next step. When user resumes, status set to `running` and next pending step is enqueued. A currently executing step finishes normally — pause takes effect after it completes.

**Cancel:** Sets status to `cancelled`. Any in-flight step completes but no further steps are enqueued. Idempotency check prevents re-processing.

### 4.3 Human Gates

Pipeline pauses with `waiting_for_approval`. No active compute. User approves/edits/rejects via frontend. Approval enqueues next step. Rejection retries previous step with user feedback injected, or halts pipeline.

**Triggers notification:** When a pipeline reaches a human gate, an in-app notification is created for the pipeline owner.

### 4.4 Multi-Choice Variations

Steps can generate multiple variations for user selection. Configured per-step via `variations` field in step config (default: 1).

When `variations > 1`:
1. Step executor runs the LLM N times with slight prompt variation (temperature adjustments, alternate framing).
2. All N outputs saved as `ContentAsset` entries linked to the same step result, tagged with `variation_index`.
3. Pipeline enters `waiting_for_approval` with a comparison view.
4. User selects one variation (or edits one). Selected variation becomes the canonical output for downstream steps.

When `variations = 1`: behaves as normal — single output, standard approve/edit/reject.

### 4.5 Fan-Out

Multi-format: orchestrator enqueues N transform steps via Cloud Tasks. Sequential in MVP (enqueue one at a time), parallel later (enqueue all N at once — Cloud Run handles concurrency natively). Branches are independent — failures don't block siblings. Deploy steps work the same way.

### 4.6 Idempotency

Cloud Tasks guarantees at-least-once delivery — steps can execute more than once. Every step execution carries an idempotency key (`{run_id}:{step_index}:{attempt}`). Before executing, the step checks if a result already exists for that key. If yes, skip and enqueue next. Prevents duplicate content generation and duplicate deploys.

### 4.7 Error Recovery

| Scenario | Behavior |
|---|---|
| LLM returns malformed output | Retry up to 2x with stricter prompt. Then fail step. |
| LLM returns low-quality output | Human gate catches. User rejects with feedback. |
| External API timeout | Retry with exponential backoff (Cloud Tasks built-in). Max 3 retries. |
| Fan-out branch fails | Other branches continue. Run marked `partially_completed`. User can retry failed branches. |
| Deploy fails | Content saved locally. User can retry deploy or export manually. |
| Step crashes mid-execution | Cloud Tasks retries. Idempotency key prevents duplicate work. |

### 4.8 Backpressure

- Cloud Tasks concurrency capped per queue (e.g., 10 concurrent step executions).
- LLM API calls rate-limited at adapter level (token bucket, matches provider limits).
- Scheduled pipeline bursts staggered: Cloud Scheduler adds jitter (±5 min) to avoid thundering herd.
- If queue depth exceeds threshold, new scheduled runs deferred. User-triggered runs always proceed.

### 4.9 Progress Reporting

Steps write progress to DB via callback. Frontend polls `GET /runs/:id` every 3–5 seconds. Stops polling when status is `completed`, `failed`, or `waiting_for_approval`. Upgrade to SSE if polling load becomes a concern at 100+ concurrent users.

---

## 5. Organization & Team Model

### 5.1 Structure

Every user belongs to one Organization. Solo users get a default org (auto-created at registration) with just themselves.

```
Organization
  └── OrgMembership (user_id, org_id, role)
        └── role: owner | admin | member
```

### 5.2 Resource Scoping

All resources are scoped by `org_id`, not `user_id`:

- Pipelines, Templates, Brands, Styles, Content Assets, Deploy Records, Platform Accounts, Notifications — all have `org_id`.
- `created_by` (user_id) tracked for audit on every resource.
- Access query: `WHERE org_id = ?` — everyone in the org sees everything.

### 5.3 Roles

| Role | Permissions |
|---|---|
| owner | Everything. Manage members, billing, delete org. One per org. |
| admin | Create/edit/delete all resources. Invite/remove members. Cannot delete org. |
| member | Create/edit own resources. Run pipelines. Cannot manage members or org settings. |

### 5.4 Future: Fine-Grained Permissions

Current design: org-wide access. Future: per-Brand access control (agency assigns team members to specific client Brands), per-Pipeline permissions, viewer role.

Not built now but the `org_id` scoping pattern does not block this — it's additive.

---

## 6. Brand Domain

### 6.1 Purpose

Brand defines **who is speaking** — voice, tone, vocabulary, identity. Separate from Style (which defines how content is structured). Pipeline run = Brand + Style + Pipeline steps.

### 6.2 Brand Model

Each Brand contains:
- Name and description
- Voice and tone settings (JSONB)
- Vocabulary preferences — words to use, words to avoid
- Perspective (first person, second person, etc.)
- Emoji/symbol usage preferences
- Target audience description
- Content guidelines and guardrails
- Connected platform accounts (one-to-many relationship)

### 6.3 Platform Accounts

Platform accounts belong to a Brand, not a user or org directly. This supports the agency use case: Client A's Brand connects to Client A's X account. Client B's Brand connects to Client B's X account.

```
Brand → PlatformAccount (platform, credentials, settings)
```

Each PlatformAccount stores:
- Platform type (twitter, youtube, instagram, linkedin, etc.)
- OAuth tokens (encrypted, AES-256, key in GCP Secret Manager)
- Platform-specific settings (default hashtags, posting schedule, tone adjustments, draft vs auto-publish)
- Token refresh logic — auto-rotate on use, prompt re-auth on failure

### 6.4 Brand Selection

- Each org has a default Brand for quick pipeline runs.
- User selects Brand when creating or running a pipeline.
- Brand settings injected into LLM prompts alongside Style profile at each generation step.

---

## 7. Authentication & Security

### 7.1 User Authentication

JWT-based auth. Short-lived access tokens (15 min) + long-lived refresh tokens (7 days). Tokens issued on login, validated on every API request via middleware.

MVP: email + password. Post-MVP: OAuth (Google, GitHub).

### 7.2 Platform Credentials

See §6.3 — OAuth tokens stored per Brand, encrypted at rest.

### 7.3 Authorization

Every API request extracts `user_id` from JWT → looks up `org_id` via OrgMembership → scopes all queries by `org_id`. Role checked for write/admin operations.

### 7.4 API Security

- Rate limiting: 100 req/min per user (Cloud Run + middleware).
- Input validation: Pydantic schemas on all endpoints.
- File upload limits: 500MB video, 100MB audio, 20MB image.
- Temp files auto-deleted after 24h.

---

## 8. API Surface

### 8.1 Auth

| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/register` | Create account (auto-creates default org) |
| POST | `/auth/login` | Get tokens |
| POST | `/auth/refresh` | Refresh access token |

### 8.2 Organization

| Method | Path | Purpose |
|---|---|---|
| GET | `/org` | Get current org details |
| PUT | `/org` | Update org settings |
| GET | `/org/members` | List members |
| POST | `/org/members` | Invite member |
| PUT | `/org/members/:id` | Change member role |
| DELETE | `/org/members/:id` | Remove member |

### 8.3 Brands

| Method | Path | Purpose |
|---|---|---|
| GET | `/brands` | List brands in org |
| POST | `/brands` | Create brand |
| GET | `/brands/:id` | Get brand details |
| PUT | `/brands/:id` | Update brand |
| DELETE | `/brands/:id` | Delete brand |
| PUT | `/brands/:id/default` | Set as org default brand |
| POST | `/brands/:id/platforms` | Connect platform account |
| DELETE | `/brands/:id/platforms/:pid` | Disconnect platform account |

### 8.4 Pipelines & Templates

| Method | Path | Purpose |
|---|---|---|
| GET | `/pipelines` | List user's pipelines |
| POST | `/pipelines` | Create pipeline |
| GET | `/pipelines/:id` | Get pipeline with current config |
| PUT | `/pipelines/:id` | Update pipeline (creates new version) |
| DELETE | `/pipelines/:id` | Delete pipeline |
| GET | `/pipelines/:id/versions` | List version history |
| GET | `/pipelines/:id/versions/:v` | Get specific version |
| POST | `/pipelines/:id/clone` | Clone pipeline |
| GET | `/templates` | List templates (pre-built + user-saved) |
| POST | `/templates` | Save pipeline as template |
| POST | `/templates/:id/create-pipeline` | Create pipeline from template |

### 8.5 Pipeline Runs

| Method | Path | Purpose |
|---|---|---|
| POST | `/pipelines/:id/run` | Trigger pipeline run |
| GET | `/pipelines/:id/runs` | List runs for pipeline |
| GET | `/runs/:id` | Get run status + step results |
| GET | `/runs/:id/poll` | Poll for progress (frontend polling) |
| POST | `/runs/:id/pause` | Pause running pipeline |
| POST | `/runs/:id/resume` | Resume paused pipeline |
| POST | `/runs/:id/cancel` | Cancel pipeline |
| POST | `/runs/:id/steps/:idx/approve` | Approve human gate (select variation if multi-choice) |
| POST | `/runs/:id/steps/:idx/reject` | Reject with feedback |
| POST | `/runs/:id/steps/:idx/retry` | Retry failed step |

### 8.6 Styles

| Method | Path | Purpose |
|---|---|---|
| GET | `/styles` | List style profiles |
| POST | `/styles` | Create style profile (from reference analysis) |
| GET | `/styles/:id` | Get style profile |
| PUT | `/styles/:id` | Update style profile (manual attribute editing) |
| DELETE | `/styles/:id` | Delete style profile |
| POST | `/styles/:id/clone` | Duplicate style profile |
| POST | `/styles/preview` | Generate sample content using style (for validation) |

### 8.7 Content & Publishing

| Method | Path | Purpose |
|---|---|---|
| GET | `/runs/:id/outputs` | List all content assets for a run |
| GET | `/content/:id` | Get specific content asset |
| GET | `/content/:id/download` | Download content as file |
| GET | `/deploys` | Publishing history (filterable by platform, date, brand) |
| GET | `/deploys/:id` | Get specific deploy record |
| POST | `/deploys/:id/retry` | Retry failed deployment |

### 8.8 Trends

| Method | Path | Purpose |
|---|---|---|
| GET | `/trends/topics` | Get current trend topics (filterable by niche, lifecycle) |

### 8.9 Notifications

| Method | Path | Purpose |
|---|---|---|
| GET | `/notifications` | List notifications (unread first) |
| POST | `/notifications/:id/read` | Mark as read |
| POST | `/notifications/read-all` | Mark all as read |
| GET | `/notifications/unread-count` | Badge count for UI |

All responses follow RFC 9457 ProblemDetails on error. Versioning via URL prefix (`/v1/`) when breaking changes occur.

---

## 9. AI Model Strategy

### 9.1 Core Principle

Every AI model is a swappable adapter behind a domain Protocol. The domain never knows which model or provider is running. **API-first:** all ML inference via commercial APIs. No self-hosted models, no GPU infrastructure. CPU-only tools (FFmpeg, MediaPipe, PySceneDetect) run as libraries inside the Cloud Run container.

Self-hosting becomes cost-effective when API spend exceeds ~$500/month. Protocol architecture makes the switch seamless — write a new adapter, change env var.

### 9.2 AI Task → Protocol Map

| AI Task | Protocol | MVP (API) | Self-Host Later |
|---|---|---|---|
| Text Generation | `LLMProvider` | Claude, GPT, Gemini, Grok, DeepSeek | Llama, Qwen, Mistral |
| Transcription + Diarization | `Transcriber`, `DiarizationProvider` | Deepgram (both in one call) | faster-whisper + pyannote |
| Vision | `VisionProvider` | Reuse LLM (multimodal) | Qwen-VL |
| Text-to-Speech | `TTSProvider` | OpenAI TTS / ElevenLabs | Kokoro |
| Image Generation | `ImageGenerator` | Replicate / DALL-E | Stable Diffusion XL |
| Embeddings | `EmbeddingProvider` | OpenAI Embeddings | all-MiniLM-L6-v2 |
| Face Detection | `FaceDetector` | MediaPipe (CPU library, pip install) | — |
| Scene Detection | `SceneDetector` | PySceneDetect (CPU library, pip install) | — |
| Video Editing | `VideoManipulator` | FFmpeg (CPU, system package) | — |

### 9.3 Per-Step Model Configuration

AI provider selection follows a config hierarchy: **step config → pipeline config → global default**.

```
Global default (env var):     LLM_PROVIDER=claude, LLM_MODEL=sonnet
Pipeline config (JSONB):      { "llm_provider": "openai", "llm_model": "gpt-4o" }
Step config (JSONB):          { "llm_provider": "deepseek" }
```

At execution time, step config takes precedence over pipeline config, which takes precedence over global env var.

**LLMProviderRegistry:** Bootstrap creates adapter instances for all configured providers. At runtime, the `LLMProviderRegistry` resolves the correct provider by name. Steps call `registry.get("claude")` or `registry.get("deepseek")` based on resolved config.

```env
# Global defaults
LLM_PROVIDER=claude
LLM_MODEL=claude-sonnet-4-20250514
TRANSCRIBER_PROVIDER=deepgram
TTS_PROVIDER=openai
IMAGE_PROVIDER=replicate
EMBEDDING_PROVIDER=openai

# Enable additional providers for per-step selection
LLM_PROVIDERS_ENABLED=claude,openai,deepseek
```

---

## 10. Notifications

### 10.1 In-App Only

Notifications stored in DB, delivered via frontend polling (same polling mechanism as pipeline progress).

### 10.2 Notification Types

| Trigger | Message | Priority |
|---|---|---|
| Pipeline reaches human gate | "Pipeline '{name}' needs your review" | High |
| Pipeline completed | "Pipeline '{name}' finished — {N} pieces ready" | Normal |
| Pipeline failed | "Pipeline '{name}' failed at step '{step}'" | High |
| Scheduled pipeline published | "Published {N} pieces to {platforms}" | Normal |
| Deploy failed | "Failed to publish to {platform}" | High |
| Platform token expired | "Reconnect your {platform} account for {brand}" | High |

### 10.3 Data Model

```
Notification:
  id, org_id, user_id (recipient), type, title, body,
  reference_type (pipeline_run, deploy, platform_account),
  reference_id, is_read, created_at
```

### 10.4 Delivery

Frontend polls `GET /notifications/unread-count` every 30 seconds for badge count. Full notification list loaded on click. Notifications auto-created by services (PipelineService, DeployService) when relevant events occur — no separate event bus needed.

### 10.5 Future

Email notifications (daily digest, urgent alerts) via Resend/SendGrid. Add `NotificationChannel` Protocol when needed. Push notifications for mobile.

---

## 11. Pipeline Templates & Versioning

### 11.1 Templates

Templates are Pipelines with `is_template: true`. Two types:

- **Pre-built templates:** Seeded via database migration at deploy time. Owned by a system org. Read-only for users. Examples: "Idea to Everything," "YouTube to Social," "Blog to Thread," "Trend to Everywhere."
- **User templates:** Created when user saves a pipeline as template. Owned by user's org. Editable.

Creating a pipeline from a template = deep copy of the template's config into a new Pipeline.

### 11.2 Version History

Every `PUT /pipelines/:id` creates a new `PipelineVersion` row:

```
PipelineVersion:
  id, pipeline_id, version_number, config (JSONB),
  created_by, created_at
```

Pipeline always runs the latest version. User can view and restore any previous version.

---

## 12. Content Scheduling & Deployment

### 12.1 Scheduling

Content scheduling uses **platform-native scheduling**. The `DeployTarget` Protocol accepts an optional `scheduled_at` parameter. Deployer adapters pass this to the platform API (YouTube, X, LinkedIn all support scheduled publishing natively).

No custom scheduling infrastructure needed — platforms handle the timing.

### 12.2 Cross-Platform Staggering

When deploying to multiple platforms, the orchestrator staggers deploy times automatically: first platform deploys at requested time, each subsequent platform offset by a configurable interval (default: 30 min). User can override per-platform in Brand settings.

### 12.3 Draft Mode

Every deploy has a `mode` option: `publish`, `schedule`, or `draft`. Draft mode saves content as an export file (R2) without hitting any platform API. Universal fallback for platforms without API access.

---

## 13. Data Collection Strategy

### 13.1 Fetcher Architecture

All external content fetching goes through `ReferenceFetcher` Protocol. Fetchers registered in priority order:

1. **URL pattern match** → platform-specific fetcher (YouTube, Twitter, etc.)
2. **File type match** → media processor (video, audio, image uploads)
3. **Generic web URL** → web article fetcher
4. **Raw text** → paste fallback (always works, zero cost)

If a platform-specific fetcher fails, fall through to next option.

### 13.2 Platform Strategy

| Platform | Fetch Method | Cost | Fallback |
|---|---|---|---|
| YouTube | Free transcript library + Data API metadata | $0 | User pastes transcript |
| Blogs / Websites | Direct web fetch + HTML-to-text extraction | $0 | User pastes text |
| X / Twitter | 3rd-party data provider | $49–100/mo | User pastes text |
| Instagram | Graph API (own content only) | $0 | User pastes caption |
| TikTok | Display API (own content only) | $0 | User pastes text |
| Podcast | RSS feed parsing + transcription | $0–low | User uploads audio |

Design principle: paste-first always. Auto-fetch is a convenience layer.

### 13.3 Media File Processing

- **Video** → extract audio (FFmpeg) → transcribe → optional frame analysis
- **Audio** → transcribe
- **Image** → Vision LLM description + OCR

File limits: 500MB video, 100MB audio, 20MB image. Max 180 min. Temp storage auto-deleted after 24h.

### 13.4 Deploy Targets

All deployers implement `DeployTarget` Protocol. Each platform uses official API with OAuth or API key auth. Supported: YouTube, X/Twitter, Instagram, TikTok, LinkedIn, WordPress/Ghost, Mailchimp/ConvertKit, Reddit, Discord.

### 13.5 Platform API Risk Mitigation

- Adapter-based: each fetcher/deployer is a single swappable file.
- Paste-first fallback: every platform supports manual text input.
- Multi-source redundancy: critical platforms maintain 2–3 provider adapters.
- Cost monitoring: per-platform API cost tracking with budget alerts.

---

## 14. Trend Intelligence Engine

### 14.1 Why Continuous Collection

Trend data is ephemeral — a Reddit discussion from 3 days ago can't be fetched retroactively. Without pre-collection, every "Generate Ideas" call hits live APIs (slow, expensive, rate-limited, current snapshot only).

With continuous collection: queries local DB instantly (sub-second), historical data enables velocity and lifecycle detection, cross-platform correlation detects emerging trends before peak, collection cost amortized across all users.

### 14.2 Architecture

```
Cloud Scheduler (cron) → Collectors fetch & normalize
  → Raw signals stored in DB
    → Aggregation job deduplicates & scores
      → Processed topics stored
        → IdeaGeneratorStep reads at runtime (zero external API calls)
```

### 14.3 Trend Sources

Each collector implements `TrendCollector` Protocol.

| Source | Interval | Cost | Signal Type |
|---|---|---|---|
| Reddit | Every 1–4h | Free | Real problems, discussions |
| YouTube | Every 1–4h | Free | What people want to watch |
| Google Trends | Every 4–6h | Free | Search demand signals |
| X / Twitter | Every 1–4h | Shared with fetch cost | Real-time conversation |
| HackerNews | Every 6h | Free | Tech/startup early signals |
| Exploding Topics | Daily | $39/mo | Curated growth forecasts |
| Wikipedia | Daily | Free | Public interest proxy |

### 14.4 Storage Design

Two tables: raw signals (append-only, auto-deleted per retention policy) and processed topics (updated in place, kept long-term). ~20 MB/day at full collection, ~1.8 GB for 90-day retention.

### 14.5 Aggregation

Raw signals normalized (0–100), deduplicated via embedding-based topic matching, scored by cross-platform presence, classified into lifecycle stages: emerging → rising → peak → declining.

### 14.6 Tiered Collection by Phase

| Phase | Sources | Frequency | API Cost |
|---|---|---|---|
| MVP | Reddit, YouTube, Google Trends (free only) | Every 4h | $0 |
| Launch | All 7 sources | Full rate | $49–139/mo |
| Scale | All + niche-specific | Peak-hour boosted | $49–139/mo |

Configuration is env-var driven. Switching phases = change config, no code changes.

---

## 15. Data Design

### 15.1 Key Entities

| Entity | Storage | Notes |
|---|---|---|
| Organizations | DB | Org settings, billing |
| Users | DB | Auth credentials, org membership |
| Org memberships | DB | user_id + org_id + role |
| Brands | DB (JSONB settings) | Voice, tone, vocabulary, guidelines |
| Platform accounts | DB (encrypted) | OAuth tokens per Brand |
| Pipelines | DB (JSONB config) | Step configs, schedule |
| Pipeline versions | DB (JSONB config) | Version history per pipeline |
| Pipeline templates | DB (JSONB config) | Pre-built + user-saved, `is_template` flag |
| Pipeline runs | DB | State, context, results |
| Style profiles | DB (JSONB attributes) | Extracted patterns from single reference, manually editable |
| Content assets | DB (text) + R2 (files) | Generated content, variation_index for multi-choice |
| Deploy records | DB | What published where/when, scheduled_at |
| Notifications | DB | In-app notifications with read status |
| Trend signals | DB | Raw data, 30-day retention |
| Trend topics | DB | Scored, lifecycle-classified |

### 15.2 JSONB Strategy

JSONB used for: pipeline configs, brand settings, style attributes, step results, notification metadata.

**Schema versioning:** Every JSONB column includes `_schema_version` integer. Application code checks version on read.

**Migration strategy:** Lazy backfill — old rows upgraded on read, written back with new version. Bulk backfill script available for major version changes.

**Validation:** Domain dataclasses validate JSONB shape on deserialization. Invalid data raises domain error, never silently ignored.

### 15.3 Data Flows

**Pipeline:**
```
User selects Brand + Style + Pipeline → creates PipelineRun
  → Steps execute via Cloud Tasks
  → Each step resolves AI provider (step → pipeline → global config)
  → Each step injects Brand voice + Style structure into LLM prompts
  → Generation → ContentAsset (with variations if configured)
  → Transform → fan-out
  → Human gate → pause + notification
  → Deploy → DeployRecord (immediate, scheduled, or draft)
```

**Style Reference:**
```
User provides single reference (URL, text, upload)
  → ReferenceFetcher resolves to text
  → LLM extracts style attributes (composition patterns only, not voice)
  → System generates preview sample using extracted attributes
  → User validates preview (adjust attributes and re-preview if needed)
  → StyleProfile saved (JSONB, manually editable post-save)
  → Applied to future runs via prompt injection
  → Users can edit individual attributes and re-preview at any time
```

**Trend:**
```
Cloud Scheduler → Collectors → Raw signals in DB
  → Aggregation: normalize, deduplicate, score, lifecycle classify
  → IdeaGeneratorStep queries local topics (zero external calls)
```

---

## 16. Infrastructure

### 16.1 Technology Stack

| Component | Technology | Rationale |
|---|---|---|
| Frontend | Next.js on Cloudflare Workers/Pages | Edge-deployed, React ecosystem |
| Backend API | FastAPI on Cloud Run | Python-first AI SDKs, async, serverless |
| Database | Neon DB (Serverless PostgreSQL) | Serverless scaling, JSONB, connection pooling |
| Job Queue | Cloud Tasks | Native Cloud Run integration, retries, timeouts, fan-out |
| File Storage | Cloudflare R2 | S3-compatible, zero egress fees |
| Real-time | Frontend polling (SSE upgrade later) | Simple, works everywhere, no connection management |
| Secrets | GCP Secret Manager | Encryption keys, API keys |
| Package Mgmt | uv | Fast, lockfile committed (uv.lock) |

### 16.2 Deployment

- Cloud Run service: all API + step execution (monolithic deploy, modular code).
- Cloudflare Workers/Pages: frontend (global edge).
- Neon DB: serverless scaling, auto connection pooling.
- All services scale to zero when idle.
- CPU-only tools (FFmpeg, MediaPipe, PySceneDetect) installed in Cloud Run container.
- All ML inference via external APIs — no GPU infrastructure to manage.

### 16.3 Timeouts

- Each pipeline step = one Cloud Run request (well under 30-min timeout).
- Long external operations: webhook pattern — start job → return → webhook receives result → enqueue next step.
- Human gates: no active request during wait.

---

## 17. Observability

| Concern | Tool | Cost |
|---|---|---|
| Error tracking | Sentry | Free tier |
| Distributed tracing | GCP Cloud Trace | Free tier |
| Logs | GCP Cloud Logging (auto from Cloud Run) | Free tier |
| Metrics & dashboards | GCP Cloud Monitoring | Free |
| Alerting | GCP Cloud Monitoring alerts | Free |
| Cost-per-pipeline | Custom: log token counts per step in DB | $0 |

**Correlation ID:** Every pipeline run generates a `pipeline_run_id` propagated through all Cloud Tasks requests as a header. Sentry, Cloud Trace, and Cloud Logging all tag with this ID. Filter any tool by run ID to see the full pipeline trace.

**Structured logging:** All log output is JSON with fields: `run_id`, `step_index`, `user_id`, `org_id`, `level`, `message`, `duration_ms`. Cloud Logging indexes automatically.

**Alerts:** Error rate > 5% over 5 min. Step duration > 2x p95. LLM cost per day exceeds budget threshold.

---

## 18. Testing Strategy

| Layer | Approach |
|---|---|
| Domain | Unit tests with in-memory fake adapters (implement Protocols with dicts/lists). No I/O. |
| Services | Integration tests via `build_test_app()`. Fake adapters injected at bootstrap. Full pipeline flow without external calls. |
| Outbound | Adapter-specific tests against real services (Neon, R2) in CI with test credentials. |
| LLM steps | Golden output snapshots. Assert structural correctness (valid JSON, required fields, length), not exact text. |
| Pipeline orchestration | Full step chains with fake LLM returning canned responses. Verify state transitions, fan-out, human gates, pause/resume, variations, error recovery. |
| API | HTTP tests against test app. Verify request validation, auth, org scoping, role enforcement, error mapping. |

---

## 19. Design Principles

1. **Changeability Above All.** Every external dependency replaceable by one adapter file.
2. **Dependencies Point Inward.** Domain defines Protocols; adapters implement them.
3. **Pipeline as Data.** JSON config in DB, not code. Add/remove/reorder steps without deployment.
4. **Media Agnostic.** All formats behind the same Protocol. New format = one transformer + one deployer.
5. **Steps Dumb, Orchestration Smart.** Steps do one thing. Runner handles sequencing, fan-out, error recovery, human gates, variations.
6. **Modular Code, Monolithic Deployment.** Split only when concrete reason exists.
7. **State in Database.** No in-memory state across requests. Serverless, crash-recoverable, horizontally scalable.
8. **Bootstrap Assembles, Domain Decides.** main.py constructs. Domain contains logic. Handlers parse, call, respond.
9. **Style, Not Information.** Reference system extracts how, not what. Pure patterns applicable to any topic.
10. **Brand and Style Are Separate.** Brand = who is speaking. Style = how content is composed. Selected independently per pipeline run.
11. **Org-Scoped Everything.** Resources belong to orgs, not users. Teams share by default. Fine-grained permissions are additive.
12. **Single Reference, Proven First.** Style extraction from one reference must be reliable before considering multi-reference features. Manual editing bridges the gap.

---

## 20. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| AI model API changes/deprecation | High | Protocol abstraction; new adapter only |
| Platform API changes | High | DeployTarget Protocol; independent adapters |
| Rate limits / access restrictions | Medium | Queue-based deploys; rate limiting; export fallback |
| Cloud Tasks double-delivery | Medium | Idempotency keys per step execution |
| Scheduled pipeline thundering herd | Medium | Jitter on scheduler + queue concurrency caps |
| Video/audio tool landscape shifts | High | All media tools behind Protocols; swap adapter |
| Cloud Run cold start latency | Low | Minimum instances; optimized container |
| Fan-out complexity at scale | Medium | Start sequential; add parallel when needed |
| JSONB schema drift | Medium | `_schema_version` field + lazy backfill |
| Polling load at scale | Low | Upgrade to SSE, then Redis pub/sub if needed |
| Cost management at scale | High | Per-step token logging; daily budget alerts; self-host at volume |
| AI output quality inconsistency | High | Human gates; multi-choice variations; structured validation; retry with stricter prompt |
| Content saturation | Medium | Style differentiation over volume; quality metrics |
| Multi-choice variation cost | Low | Multiplies LLM calls by N; user-configurable, default 1 |
| Platform scheduling gaps | Low | Not all platforms support native scheduling; draft/export fallback |
| Style extraction quality | High | Preview validation before save; manual attribute editing; few-shot reference inclusion in generation prompts; iterative prompt improvement |

---

*For product features see Product PRD v2.1.*
