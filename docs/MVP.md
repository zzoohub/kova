# Kova — MVP PRD

**Minimum Viable Product: Full Pipeline, Minimal Dependencies**

| | |
|---|---|
| **Version** | 2.0 |
| **Date** | February 2025 |
| **Status** | Draft |
| **Type** | MVP Requirements |
| **Parent Docs** | Product PRD, Technical PRD |

---

## Table of Contents

1. [MVP Philosophy](#1-mvp-philosophy)
2. [What MVP Includes vs Excludes](#2-what-mvp-includes-vs-excludes)
3. [AI Model Decisions](#3-ai-model-decisions)
4. [Feature Scope by Area](#4-feature-scope-by-area)
5. [Infrastructure and Cost](#5-infrastructure-and-cost)
6. [MVP Timeline](#6-mvp-timeline)
7. [Post-MVP: Adapter Additions Only](#7-post-mvp-adapter-additions-only)

---

## 1. MVP Philosophy

### Core Principle

**All features. Simplest implementation.**

The MVP must prove that Kova's full pipeline works end-to-end — from idea generation to content deployment across multiple formats and platforms. But behind every Protocol, we use the cheapest, simplest adapter that gets the job done.

### Why This Approach

The domain layer and Protocols are the hardest part to change later — they define the shape of the entire system. Implementation adapters are the easiest part to swap. So:

- **Domain layer:** 100% complete. All Protocols defined. All step types registered. All domain models finalized.
- **Pipeline orchestration:** Full flow works. Fan-out, human gates, multi-choice — everything.
- **Implementation (outbound):** Minimal. Free/self-hosted where possible. One LLM provider (not five). One deploy target (not eight).

If the domain and pipeline are right, upgrading adapters is just writing new files. If the domain is wrong, everything must change.

### Decision Framework

For every adapter decision: (1) what quality bar does this task need? (2) which models reliably meet that bar? (3) among those, which is most cost-effective?

**"Cost-effective" ≠ "cheapest."** A free model that produces bad output kills user trust. The goal is reliable production quality at reasonable cost.

**No mock adapters.** Every feature produces real, dynamic output.

---

## 2. What MVP Includes vs Excludes

### ALL Features Included

Every feature listed in the Product PRD is fully functional in MVP. The "upgrade later" column only refers to swapping in higher-quality adapters — not missing features:

| Feature | MVP (Complete) | Upgrade Later (adapter swap only) |
|---|---|---|
| **Pipeline Builder** | Full step selection, ordering, save as template, form-based UI | Drag-and-drop UI, version history |
| **Pipeline Execution** | Full orchestration, real-time progress (SSE), sequential fan-out | Parallel fan-out (Pub/Sub), retry strategies |
| **Human Gates** | Approve, edit, reject with inline editing | Bulk approve, multi-choice comparison view |
| **Idea Generator** | LLM + trend data from all collected sources | Fine-tuned niche-specific prompts |
| **Research Agent** | LLM analyzes provided context and sources | Auto web search (add WebSearchProvider adapter) |
| **Reference Analyzer** | Style extraction from prompt, URL, article, image, video, audio | File upload parsing (.pdf, .docx) |
| **Script Writer** | Full longform generation with style profile | A/B variation generation |
| **Content Editor** | LLM-based editing pass | Multi-pass editing chains |
| **Visual Agent** | LLM generates prompt → real image generated | Higher quality image models (SDXL, DALL-E) |
| **SEO Optimizer** | LLM-based keyword/meta optimization | Search volume data integration |
| **Hashtag Generator** | LLM-based tag generation per platform | Trending hashtag data |
| **Style Profiles** | Save, load, apply, edit, single reference | Multi-reference compositing, style preview |
| **Multi-Format Transform** | ALL 9 formats (thread, post, newsletter, video script, carousel, podcast, reddit, short video, video shorts) | Quality refinement per format |
| **Video Clipping** | Full pipeline: transcribe → diarize → select moments → cut → caption → reframe → voiceover | Creative effects (Shotstack/Creatomate adapter) |
| **Deployment** | X/Twitter (text) + YouTube (video) + Instagram (image) + Export/Download | Add more deployers (LinkedIn, WordPress, TikTok) |
| **Trend Intelligence** | Reddit, YouTube, Google Trends (free sources) | Add more collectors (X/Twitter, HackerNews) |
| **Frontend** | Functional UI for all workflows | Polish, animations, mobile optimization |

### Post-MVP = Add Adapters Only

After MVP, all processes and features are complete. Post-MVP work is exclusively:

1. Copy existing adapter file
2. Modify for new provider (API calls, auth, format)
3. Add to config
4. Done

**The domain layer, pipeline engine, step registry, and all Protocols are frozen after MVP.** No structural changes. No new abstractions. Just more implementations of existing interfaces.

---

## 3. AI Model Decisions

### Principle

Each AI task has a different quality bar. The model for each task is chosen based on what that task actually demands — not by price alone.

### MVP AI Stack

| Task | MVP Choice | Why | Cost |
|---|---|---|---|
| **Text Generation** | Claude Sonnet / GPT-4o (config-driven) | Core product output — users publish under their name. Quality must be high. Self-hosted 7-8B models still noticeably weaker for creative writing. | ~$0.01-0.05/req |
| **Transcription** | faster-whisper large-v3 (self-hosted) | Best open-source ASR. 95%+ accuracy, 70x realtime. Competitive with paid APIs — chosen for quality, not just cost. | $0 |
| **Vision** | Reuse LLMProvider (multimodal) | Most commercial LLMs already support image input. No separate model needed. | Included in LLM cost |
| **Embeddings** | all-MiniLM-L6-v2 (self-hosted) | Standard for similarity tasks. 80MB, CPU, milliseconds. | $0 |
| **Face Detection** | MediaPipe (self-hosted) | Google's production face detection. Used in Meet, YouTube. Fast, reliable, CPU. | $0 |
| **Scene Detection** | PySceneDetect (self-hosted) | Industry standard. OpenCV-based, no ML needed. | $0 |
| **TTS** | Kokoro 82M (self-hosted) | Rated comparable to models 10x its size. Sub-0.3s on CPU. Apache 2.0. | $0 |
| **Diarization** | pyannote-audio 3.1 (self-hosted) | Standard open-source. 17MB, MIT licensed. | $0 |
| **Image Generation** | Pollinations / Replicate SDXL (config) | Free for drafts, $0.003/image for production quality. | $0-0.003/img |
| **Video Editing** | FFmpeg (self-hosted) | Industry standard. Deterministic, reliable. | $0 |

LLM is swappable via env var even in MVP (`LLM_PROVIDER=claude|openai|gemini|grok|deepseek|openai-compatible`).

---

## 4. Feature Scope by Area

### 4.0 Input Types

All input types from the Product PRD are functional in MVP. Every input serves dual purpose — style reference OR source content (or both):

| Input Type | MVP Status | Processing |
|---|---|---|
| **Prompt** | ✅ Full | Direct — user types topic or instruction |
| **URL** | ✅ Full | Platform-aware fetch: YouTube → transcript, Twitter → thread text, web → article extraction |
| **Article / Text** | ✅ Full | Pasted text analyzed directly |
| **Image** | ✅ Full | Vision LLM (multimodal, reuses existing LLM) describes content + OCR |
| **Video** | ✅ Full | Extract audio (FFmpeg) → transcribe (faster-whisper) → optional keyframe analysis |
| **Audio** | ✅ Full | Transcribe (faster-whisper) → text |
| **Document upload** (.pdf, .docx) | ⚠️ Text paste only | Add document parser adapter later |

No new infrastructure needed for image/video/audio inputs — all adapters (FFmpeg, faster-whisper, multimodal LLM) already exist in MVP for the video clipping feature.

### 4.1 Pipeline Steps

All steps from Product PRD are registered and functional:

| Step | Protocols Used | MVP Status |
|---|---|---|
| IdeaGeneratorStep | LLMProvider, TrendRepository | Real — LLM + local trend data |
| ResearchAgentStep | LLMProvider | Real — LLM analyzes provided context |
| ReferenceAnalyzerStep | LLMProvider, ReferenceFetcher | Real — handles all input types above |
| ScriptWriterStep | LLMProvider, StorageProvider | Real — LLM writes, stores output |
| ContentEditorStep | LLMProvider | Real — LLM editing pass |
| VisualAgentStep | LLMProvider, ImageGenerator | Real — LLM prompt → real image |
| SEOOptimizerStep | LLMProvider | Real — LLM-based optimization |
| HashtagGeneratorStep | LLMProvider | Real — LLM-based generation |
| VideoClipperStep | Transcriber, LLMProvider, SceneDetector, VideoManipulator | Real — full clip pipeline |
| TransformStep | LLMProvider, ContentTransformer | Real — all 9 formats |
| DeployStep | DeployTarget | Real — X/Twitter, YouTube, Instagram + Export fallback |
| HumanGateStep | None | Real — full approve/edit/reject |

### 4.2 Style Reference System

| Feature | MVP Status |
|---|---|
| Create style from prompt, URL, article, image, video, audio | ✅ Full — all input types supported |
| Style profile extraction (tone, voice, structure) | ✅ Full — LLM analysis |
| Save/load/edit style profiles | ✅ Full — PostgreSQL CRUD |
| Apply style to pipeline | ✅ Full — injected into LLM prompts |
| Style preview | ✅ LLM generates sample paragraph |
| Document upload (.pdf, .docx) | ⚠️ Text paste only — add document parser adapter later |
| Multi-reference compositing | ⚠️ Single reference per profile — weighted blending prompt later |

### 4.3 Multi-Format Transformation

All 9 transformers included. Each is an LLM prompt template + format validation — no new infrastructure needed:

| Transformer | Output |
|---|---|
| LongToThreadTransformer | X/Twitter thread (5-20 posts, each <280 chars) |
| LongToPostTransformer | LinkedIn/Instagram post |
| LongToNewsletterTransformer | Email newsletter section |
| LongToVideoScriptTransformer | YouTube video script with chapters |
| LongToCarouselTransformer | Instagram carousel (5-10 slides) |
| LongToPodcastTransformer | Conversational podcast script |
| LongToRedditTransformer | Reddit post (subreddit-aware) |
| LongToShortVideoTransformer | TikTok/Reels script (<60s) |
| VideoToShortsTransformer | Short-form clips with captions |

MVP supports sequential fan-out. Parallel fan-out (Pub/Sub) is a performance upgrade later — identical results either way.

### 4.4 Video Processing

All video features use adapters already in MVP:

| Feature | MVP Status | Upgrade Later |
|---|---|---|
| Transcription | ✅ faster-whisper, word timestamps | Deepgram for streaming |
| Scene detection | ✅ PySceneDetect | + LLM visual analysis |
| Moment selection | ✅ LLM reads transcript + scenes + speakers | + VisionProvider analysis |
| Video cutting | ✅ FFmpeg | Same |
| Auto-captions | ✅ Whisper → SRT → FFmpeg burn-in | Styled captions |
| Reframe 16:9→9:16 | ✅ Smart crop with MediaPipe face tracking | Production-tuned parameters |
| Silence removal | ✅ Whisper VAD → FFmpeg | Same |
| Speaker diarization | ✅ pyannote-audio | Enhanced multi-speaker labeling |
| TTS voiceover | ✅ Kokoro 82M | ElevenLabs adapter (voice cloning) |
| Thumbnail generation | ✅ Pollinations / Replicate | SDXL self-hosted / DALL-E |
| Creative effects | ⚠️ Basic (cuts, captions, crop) | Transitions, zoom, B-roll (Shotstack adapter) |

Video processing cost: near $0 per video (all self-hosted except ~$0.02 LLM call for moment selection).


### 4.5 Deployment

MVP deploys one platform per content type to prove the full pipeline works:

| Content Type | MVP Platform | Why This First |
|---|---|---|
| **Text** | X/Twitter | Simplest API, thread format exercises fan-out, free tier available |
| **Video** | YouTube | Most common video platform for creators, Data API v3 is well-documented |
| **Image** | Instagram | Primary image/carousel platform, Graph API via Facebook OAuth |
| **All formats** | Export/Download | Universal fallback — download any content as files |

Export means every format is usable from day one. Auto-publishing to more platforms is a convenience upgrade, not a feature gap.

Adding more deploy targets post-MVP: 1-3 days each, copy-paste adapter pattern, zero domain changes.

### 4.6 Trend Intelligence

| Source | Collection Rate | Cost |
|---|---|---|
| Reddit | Every 4 hours | $0 |
| YouTube | Every 4 hours | $0 |
| Google Trends | Every 4 hours | $0 |

Background collection via Cloud Scheduler. Raw signals stored with 30-day retention. Aggregation produces scored topics with lifecycle detection (emerging → rising → peak → declining). IdeaGeneratorStep queries local data — zero external API calls at runtime.

Fits within Neon Free tier (~100 MB).

### 4.7 Frontend

| Screen | MVP Implementation |
|---|---|
| Pipeline Builder | Form-based step selection and ordering |
| Pipeline Dashboard | List of runs with status, SSE real-time progress |
| Human Review | Single-output review with inline text editing, approve/reject |
| Style Library | CRUD: list, create from text/URL, edit, delete |
| Platform Settings | X/Twitter OAuth connection |

Simplified: form-based builder (not drag-and-drop), text-based progress (not visual), responsive but basic mobile, system default theme only.

---

## 5. Infrastructure and Cost

### 5.1 MVP Stack

| Component | Choice | Cost |
|---|---|---|
| Backend Runtime | Cloud Run (serverless) | $0 (free tier) |
| Database | Neon PostgreSQL | $0 (free tier) |
| File Storage | Cloudflare R2 | $0 (10 GB free) |
| Frontend Hosting | Cloudflare Workers/Pages | $0 (free tier) |
| Task Queue | Cloud Tasks | $0 (1M tasks free) |
| Scheduler | Cloud Scheduler | $0 (3 jobs free) |
| GPU (video) | Cloud Run GPU / Modal.com | ~$0.50-1.00/video |
| LLM API | Claude Sonnet (or configured) | ~$0.01-0.05/request |

**External services requiring accounts:** 4 infrastructure (GCP, Neon, Cloudflare, LLM provider) + 1 social platform (X/Twitter). Everything else is self-hosted.

### 5.2 Monthly Cost by Usage

| Usage Level | Pipelines | Videos | LLM Calls | Monthly Cost |
|---|---|---|---|---|
| Solo creator (light) | 20 | 2 | 200 | $5-10 |
| Solo creator (active) | 50 | 5 | 500 | $10-25 |
| Small team | 100 | 10 | 1,000 | $20-50 |
| Power user | 200 | 20 | 2,000 | $40-100 |

### 5.3 Scale Path

At 1,000+ pipelines/month, self-hosting the LLM becomes cost-effective. Protocol architecture makes this seamless — change env var from `LLM_PROVIDER=claude` to `LLM_PROVIDER=openai-compatible` pointing at a local vLLM server.

---

## 6. MVP Timeline

### Total: 8 Weeks

**Week 1-2: Foundation**
- All domain models and Protocol definitions across all domains
- PostgreSQL repositories, config system, bootstrap wiring
- DB schema, basic Shell with health check

→ *Deliverable: Project runs, connects to DB, all domain models compile.*

**Week 3-4: Pipeline Engine + Core Steps**
- PipelineService with full orchestration
- StepRegistry, Cloud Tasks step-per-request execution
- LLM adapter (one provider), core steps (Idea, Script, Editor, HumanGate)
- R2 storage adapter, pipeline CRUD endpoints, SSE progress

→ *Deliverable: Create and run a pipeline via API: idea → script → edit → approve.*

**Week 5-6: Style + Transform + Video**
- Style domain: ReferenceAnalyzer, StyleService, style CRUD
- WebFetcher for URL-based references
- All 9 transformers with sequential fan-out
- Video pipeline: faster-whisper + PySceneDetect + LLM moment selection + FFmpeg

→ *Deliverable: Full pipeline: idea → script → transform to all formats → video clips.*

**Week 7: Deployment + Trends**
- XTwitterDeployer with OAuth, ExportDeployer fallback
- Trend collection workers (Reddit, YouTube, Google Trends)
- Aggregation with dedup, Cloud Scheduler setup

→ *Deliverable: End-to-end: trend-informed idea → content → published to X/Twitter.*

**Week 8: Frontend + Polish**
- Next.js on Cloudflare Workers/Pages
- All screens: pipeline builder, dashboard, human review, style library, settings
- Error handling, loading states, basic responsive design

→ *Deliverable: Complete MVP. User can build pipelines, run them, review outputs, publish.*

---

## 7. Post-MVP: Adapter Additions Only

After MVP ships, the only work is adding more adapters to existing Protocols. No domain changes, no pipeline changes, no Protocol changes.

### Priority

| Adapter | Protocol | Effort | Priority |
|---|---|---|---|
| LinkedInDeployer | DeployTarget | 1-2 days | P0 |
| TikTokDeployer | DeployTarget | 2-3 days | P0 |
| OpenAI LLM Provider | LLMProvider | 1-2 days | P1 |
| Gemini LLM Provider | LLMProvider | 1-2 days | P1 |
| WordPressDeployer | DeployTarget | 1-2 days | P1 |
| HackerNews Collector | TrendCollector | 1 day | P2 |
| X/Twitter Collector | TrendCollector | 1 day | P2 |
| SDXL Image Generator | ImageGenerator | 2-3 days | P2 |
| ElevenLabs TTS | TTSProvider | 1-2 days | P2 |
| Shotstack Effects | VideoEffects | 3-5 days | P3 |
| Newsletter Deployer | DeployTarget | 1-2 days | P3 |

### The Key Insight

```
MVP:       Domain (100%, frozen) + Adapters (minimal) = All features work
Post-MVP:  Domain (frozen)       + More Adapters      = More platforms, higher quality
Scale:     Domain (frozen)       + Even More Adapters  = Full platform coverage
```

---

*This document defines MVP scope and decisions. For product vision and features, see the Product PRD. For architecture and technical strategy, see the Technical PRD.*
