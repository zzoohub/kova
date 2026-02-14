# Kova UX Strategy

**Version:** 1.0
**Date:** February 2026
**Scope:** Complete UX strategy, feature specifications, and page layouts for the Kova content creation platform.

---

## Table of Contents

- [Part 1: UX Strategy](#part-1-ux-strategy)
  - [1. Design Principles](#1-design-principles)
  - [2. Information Architecture](#2-information-architecture)
  - [3. Navigation Model](#3-navigation-model)
  - [4. User Mental Models](#4-user-mental-models)
  - [5. Progressive Disclosure Strategy](#5-progressive-disclosure-strategy)
  - [6. Key Interaction Patterns](#6-key-interaction-patterns)
  - [7. Accessibility Considerations](#7-accessibility-considerations)
  - [8. i18n Considerations](#8-i18n-considerations)
- [Part 2: Feature UX Specs](#part-2-feature-ux-specs)
  - [F1. Dashboard](#f1-dashboard)
  - [F2. Pipeline Builder](#f2-pipeline-builder)
  - [F3. Pipeline Execution Dashboard](#f3-pipeline-execution-dashboard)
  - [F4. Human Review Screen](#f4-human-review-screen)
  - [F5. Style Library + Style Profile Creator](#f5-style-library--style-profile-creator)
  - [F6. Brand Library + Brand Editor](#f6-brand-library--brand-editor)
  - [F7. Content Library](#f7-content-library)
  - [F8. Trends Dashboard](#f8-trends-dashboard)
  - [F9. Settings](#f9-settings)
- [Part 3: Page Layouts](#part-3-page-layouts)
  - [P1. `/` Dashboard](#p1--dashboard)
  - [P2. `/pipelines` Pipeline List](#p2-pipelines-pipeline-list)
  - [P3. `/pipelines/new` Pipeline Builder](#p3-pipelinesnew-pipeline-builder)
  - [P4. `/pipelines/[id]` Pipeline Detail](#p4-pipelinesid-pipeline-detail)
  - [P5. `/pipelines/[id]/runs/[runId]` Run Detail](#p5-pipelinesidrunsrunid-run-detail)
  - [P6. `/review` Review Queue](#p6-review-review-queue)
  - [P7. `/review/[runId]/[stepId]` Review Detail](#p7-reviewrunidstepid-review-detail)
  - [P8. `/styles` Style Library](#p8-styles-style-library)
  - [P9. `/styles/new` Create Style Profile](#p9-stylesnew-create-style-profile)
  - [P10. `/styles/[id]` Style Detail](#p10-stylesid-style-detail)
  - [P11. `/brands` Brand Library](#p11-brands-brand-library)
  - [P12. `/brands/new` Create Brand](#p12-brandsnew-create-brand)
  - [P13. `/brands/[id]` Brand Detail](#p13-brandsid-brand-detail)
  - [P14. `/content` Content Library](#p14-content-content-library)
  - [P15. `/trends` Trends Dashboard](#p15-trends-trends-dashboard)
  - [P16. `/settings/*` Settings](#p16-settings-settings)

---

# Part 1: UX Strategy

## 1. Design Principles

These principles are derived directly from the PRD's core value propositions and user needs. Every design decision must satisfy at least one of these.

### 1.1 Control Spectrum

Users operate on a continuum from full autopilot to granular manual control. The interface must never force a user to one end. Every automated action must be overridable. Every manual action must be automatable.

**Implementation rule:** Every screen that triggers an automated process must expose a "configure" affordance. Every manual step must have a "skip and automate" option.

### 1.2 Pipeline Primacy

The pipeline is the central object of the product. All other entities (brands, styles, content, trends) exist to serve pipeline execution. The interface must make pipelines feel like the primary workspace, not a feature buried behind menus.

**Implementation rule:** The "New Pipeline" action must be reachable in one tap from any screen. Pipeline status must be visible without navigating away from the current task.

### 1.3 Style and Brand Are Separate Concepts

The product's key differentiator is the separation of Style (how content is composed and structured) from Brand (who is speaking and how they sound). The UI must reinforce this distinction at every touchpoint. Conflating them in the interface would undermine the product's conceptual model.

**Implementation rule:** Style and Brand are never combined into a single configuration panel. They occupy separate sidebar sections, separate library pages, and separate selectors in the pipeline builder.

### 1.4 Show, Don't Configure

Users should understand what a style or brand does by seeing its output, not by reading a list of parameters. Previews, sample outputs, and visual indicators replace long configuration forms wherever possible.

**Implementation rule:** Every style profile and brand must have a "Generate Preview" action that produces a sample output. Extracted attributes are displayed as readable summaries, not as raw key-value pairs.

### 1.5 Progressive Complexity

The interface must be immediately usable by a solo entrepreneur who wants "set it and forget it" and simultaneously powerful enough for an agency managing 10 client accounts. The mechanism is progressive disclosure: simple surfaces with depth underneath.

**Implementation rule:** Default templates, pre-configured pipelines, and one-click actions serve beginners. Expandable config panels, per-step model selection, and custom pipeline building serve power users. No feature requires understanding the full system to use.

---

## 2. Information Architecture

### 2.1 IA Map

The information architecture follows a task-oriented structure organized around the content creation lifecycle. Objects are grouped by what the user is doing, not by data type.

```
Kova
|
+-- Dashboard (/)
|   Home. Aggregated view of what needs attention.
|   Surfaces: pending reviews, recent runs, trending topics, quick actions.
|
+-- Pipelines (/pipelines)
|   |   Build, configure, and monitor content workflows.
|   |
|   +-- Pipeline List (/pipelines)
|   |   All saved pipelines with status, search, and filters.
|   |
|   +-- Pipeline Builder (/pipelines/new)
|   |   Multi-step form: template > steps > settings > review.
|   |
|   +-- Pipeline Detail (/pipelines/[id])
|   |   View config, run history, edit pipeline.
|   |
|   +-- Run Detail (/pipelines/[id]/runs/[runId])
|       Live step-by-step progress, outputs, errors, fan-out branches.
|
+-- Review (/review)
|   |   Queue of pipeline outputs awaiting human approval.
|   |
|   +-- Review Queue (/review)
|   |   Filterable list of pending items. Supports bulk actions.
|   |
|   +-- Review Detail (/review/[runId]/[stepId])
|       Side-by-side: context panel + editable output. Approve/reject/skip.
|
+-- Styles (/styles)
|   |   Library of extracted content composition patterns.
|   |
|   +-- Style Library (/styles)
|   |   Card grid of saved profiles with key attributes visible.
|   |
|   +-- Create Style (/styles/new)
|   |   Three-phase flow: input > analyzing > result (with preview).
|   |
|   +-- Style Detail (/styles/[id])
|       View/edit extracted attributes, preview, usage in pipelines.
|
+-- Brands (/brands)
|   |   Library of brand identities (voice, tone, vocabulary).
|   |
|   +-- Brand Library (/brands)
|   |   Card grid of saved brands with platform connections visible.
|   |
|   +-- Create Brand (/brands/new)
|   |   Single-page form: identity, vocabulary, connected platforms.
|   |
|   +-- Brand Detail (/brands/[id])
|       Edit form (same layout as create, pre-populated).
|
+-- Content (/content)
|   Published and draft content. Filter by format, platform, status.
|   Links to platform-native analytics.
|
+-- Trends (/trends)
|   Trending topics ranked by score, filterable by niche and time range.
|   Each topic has a direct "Create Content" action.
|
+-- Settings (/settings)
    |
    +-- Platforms (/settings/platforms)
    |   Connect/disconnect platform accounts via OAuth.
    |
    +-- AI Models (/settings/models)
    |   Select AI provider per task (writing, transcription, voice, image).
    |
    +-- Defaults (/settings/defaults)
        Default brand, style, approval mode, output formats, notifications.
```

### 2.2 Object Relationships

```
Brand (identity, voice)
  |
  +-- has many: Platform Accounts (OAuth connections)
  +-- used by: Pipeline Runs

Style Profile (composition patterns)
  |
  +-- extracted from: Reference Source (URL, text, file)
  +-- has many: Style Attributes (hook, structure, pacing, etc.)
  +-- used by: Pipeline Runs

Pipeline (workflow definition)
  |
  +-- has many: Steps (ordered sequence)
  +-- has one: Template (origin)
  +-- has many: Pipeline Runs (execution instances)

Pipeline Run (single execution)
  |
  +-- uses: Brand + Style Profile
  +-- has many: Run Steps (with status, progress, output)
  +-- may have: Fan-out Branches (parallel transforms)
  +-- may produce: Review Items (at human gates)

Content Asset (generated output)
  |
  +-- produced by: Pipeline Run
  +-- belongs to: Format (thread, post, script, etc.)
  +-- deployed to: Platform (X, YouTube, LinkedIn, etc.)
  +-- has one: Deploy Record (published URL, timestamp)

Trend Topic (external signal)
  |
  +-- belongs to: Niche
  +-- has one: Lifecycle stage (emerging, rising, peak, declining)
  +-- sourced from: Trend Source (Reddit, YouTube, Google Trends, etc.)
```

---

## 3. Navigation Model

### 3.1 Sidebar Structure (Desktop: md and above)

The sidebar uses a two-tier hierarchy with primary nav (core workflows) and secondary nav (supporting tools). The existing implementation in `Sidebar` (`/web/src/widgets/layout/ui/sidebar.tsx`) follows this structure.

**Primary Navigation (top section):**

| Order | Label | Label (ko) | Icon | Route | Purpose |
|-------|-------|------------|------|-------|---------|
| 1 | Dashboard | 대시보드 | `LayoutDashboard` | `/` | Home: what needs attention |
| 2 | Pipelines | 파이프라인 | `GitBranch` | `/pipelines` | Build and run workflows |
| 3 | Review | 리뷰 | `CheckSquare` | `/review` | Approve pending outputs |
| 4 | Styles | 스타일 | `Palette` | `/styles` | Composition pattern library |
| 5 | Brands | 브랜드 | `UserCircle` | `/brands` | Voice and identity library |
| 6 | Content | 콘텐츠 | `FileText` | `/content` | Published content archive |

**Secondary Navigation (below separator):**

| Order | Label | Label (ko) | Icon | Route | Purpose |
|-------|-------|------------|------|-------|---------|
| 1 | Trends | 트렌드 | `TrendingUp` | `/trends` | Topic discovery |
| 2 | Settings | 설정 | `Settings` | `/settings` | Configuration |

**Sidebar behavior:**
- Collapsible to icon-only rail (existing: `useSidebar` store with `collapsed` state).
- Collapsed state shows tooltips on hover for each item.
- "New" button sits above nav items for pipeline creation (one-tap access from anywhere).
- Active route highlighted with `bg-accent` background and `text-accent-foreground` text color.
- Logo area at top: full "Kova" wordmark when expanded, "K" badge when collapsed.

### 3.2 Mobile Navigation (below md)

The bottom bar (`MobileBottomBar` at `/web/src/widgets/layout/ui/mobile-bottom-bar.tsx`) shows five slots with the center slot elevated.

| Slot | Label | Icon | Route |
|------|-------|------|-------|
| 1 | Dashboard | `LayoutDashboard` | `/` |
| 2 | Pipelines | `GitBranch` | `/pipelines` |
| 3 (center, raised) | New | `Plus` | `/pipelines/new` |
| 4 | Review | `CheckSquare` | `/review` |
| 5 | More | `MoreHorizontal` | `/settings` |

**Design rationale:** The five most frequent actions occupy the bottom bar. Styles, Brands, Content, and Trends are accessed via the hamburger menu (top-left `PanelLeft` button on `TopBar`) or through the "More" slot leading to a full-screen menu overlay.

### 3.3 Top Bar

The `TopBar` (`/web/src/widgets/layout/ui/top-bar.tsx`) is a fixed header with:
- **Left:** Mobile hamburger menu + mobile logo
- **Right:** Search trigger (`SearchTrigger`), theme toggle (`ThemeToggle`), notification bell (`NotificationBell`), user avatar

**Notification bell behavior:** Badge count shows pending review items. Clicking opens a dropdown listing recent notifications (pipeline complete, review needed, daily digest). Each notification links to the relevant page.

### 3.4 Breadcrumb Pattern

Detail pages use a back-link pattern rather than full breadcrumb trails. This is simpler, uses less space, and addresses the most common navigation need (going back one level).

**Pattern:** An `ArrowLeft` icon + parent label, positioned above the page title. Example: "< Pipelines" on the pipeline detail page.

---

## 4. User Mental Models

Understanding how each persona thinks about the product shapes which surfaces they see first and which features they discover later.

### 4.1 Content Creator (Sarah)

**Mental model:** "I have ideas. I want them published everywhere without spending hours on formatting."

**Primary workflow:** Dashboard > Quick Run (topic) > Monitor > Review > Published.

**Key surfaces:** Dashboard (what happened today), Pipeline runs (is it done yet), Review (approve and move on).

**What they ignore initially:** Style Library (uses defaults), Settings (uses defaults), Trends (has their own ideas).

**Progressive path:** After initial runs, they discover Style extraction ("Why does this content look different from my usual posts?") and begin building a style library. They graduate from templates to custom pipelines after 5-10 runs.

### 4.2 Marketing Team (Marcus)

**Mental model:** "I manage multiple client identities. Each client has different platforms, different voices, different approval flows."

**Primary workflow:** Switch brand > Select pipeline > Paste source > Review at gates > Approve per client.

**Key surfaces:** Brand Library (switching between clients), Pipeline Detail (per-client templates), Review Queue (bulk approval across clients).

**What they need early:** Multiple brands, human gates at key checkpoints, per-platform approval settings.

**Progressive path:** They build client-specific pipeline templates and style profiles. They use scheduled pipelines for high-volume clients.

### 4.3 Agency (Priya)

**Mental model:** "I want to capture what makes successful content work and reuse those patterns."

**Primary workflow:** Find winning content > Extract style > Apply to pipeline > Generate new content using that structure.

**Key surfaces:** Style Library (the core value prop for this persona), Style Creator (extraction flow), Pipeline Builder (applying styles to workflows).

**What they need early:** Style extraction with preview validation, manual attribute editing, clear separation of style vs. brand.

**Progressive path:** They build large style libraries organized by content format and platform. They share styles across team members.

### 4.4 Solo Entrepreneur (Alex)

**Mental model:** "I want to set up once and let it run. Content should appear on my platforms without me thinking about it."

**Primary workflow:** Pick template > Connect platforms > Set schedule > Walk away > Check daily digest.

**Key surfaces:** Pipeline Builder (one-time setup), Dashboard (daily digest), Settings (platform connections).

**What they need early:** Pre-built templates that "just work," simple scheduling, full autopilot mode.

**Progressive path:** They add more platforms, try different templates, and eventually customize pipeline steps. They may never touch the Style Library unless content quality drops.

---

## 5. Progressive Disclosure Strategy

### 5.1 Layer Model

The interface uses three disclosure layers. Each layer is self-contained -- a user can operate entirely within Layer 1 and still get full value.

| Layer | Who | What they see | What is hidden |
|-------|-----|---------------|----------------|
| **L1: Templates** | New users, solo entrepreneurs | Pre-built pipeline templates, one-click "Quick Run," default brand/style, auto-selected platforms | Custom step ordering, per-step model selection, manual style extraction, scheduling, approval modes |
| **L2: Configuration** | Active creators, marketing teams | Pipeline builder with step editing, brand/style selectors, schedule settings, human gates, filter/sort on all lists | Per-step AI model override, custom approval rules, API-level settings |
| **L3: Power** | Agencies, power users | Per-step model selection, custom pipeline templates, manual attribute editing on styles, per-platform approval, version history | (Nothing hidden -- full access) |

### 5.2 Disclosure Mechanisms

**Templates as starting points:** The Pipeline Builder opens to a template grid (Layer 1). Selecting a template pre-fills steps and settings. Clicking "Customize" or editing any step transitions to Layer 2.

**Collapsible step configs:** Each step in the pipeline builder has a collapsed state showing name and category (Layer 1/2). Expanding reveals per-step configuration: model selection, parameters, etc. (Layer 3).

**"Advanced" sections in settings:** Settings pages show the most common options at the top (default brand, style, approval mode). Advanced options like notification preferences, timezone, and output format defaults appear below, visible but not competing for attention.

**Progressive form fields:** The Brand Editor shows Identity fields first (name, voice, audience). Vocabulary and Platform sections appear below. Users filling out only name and voice get a functional brand.

### 5.3 Disclosure Triggers

| Trigger | Where | Effect |
|---------|-------|--------|
| First pipeline run completes | Dashboard | Show "Tip: Create a style profile to make future content more consistent" in the quick-start card |
| User edits AI output during review | Review Detail | Show "Tip: Adjust your style profile to avoid this edit next time" as inline hint |
| Third brand created | Brand Library | Show prompt to set a default brand |
| Pipeline fails | Run Detail | Expand the failed step automatically, show retry/skip options |
| User hovers a collapsed section | Pipeline Builder | Show a brief description of what this section configures |

---

## 6. Key Interaction Patterns

These patterns repeat across the application. Defining them once ensures consistency and reduces engineering effort.

### 6.1 Library Pattern (Styles, Brands, Content, Pipelines)

Used by: `/styles`, `/brands`, `/content`, `/pipelines`

**Structure:**
1. `PageHeader` with title, Korean subtitle, and primary "Create New" action button
2. Filter bar: search input (with `Search` icon prefix), category/type/status `Select` dropdowns, sort `Select`
3. Card grid: responsive `grid-cols-1 md:grid-cols-2 xl:grid-cols-3` with entity cards
4. Empty state: `EmptyState` component when no items exist at all
5. No-results state: simplified empty view when filters produce zero results

**Interactions:**
- Search is instant (client-side filter over loaded data)
- Filters compose (AND logic): search + status + type
- Cards are clickable links to detail pages
- Card actions (edit, duplicate, delete) accessible via overflow menu (`DropdownMenu`)

### 6.2 Detail Page Pattern (Pipeline Detail, Style Detail, Brand Detail)

Used by: `/pipelines/[id]`, `/styles/[id]`, `/brands/[id]`

**Structure:**
1. Back-link to parent library (ArrowLeft + parent name)
2. Page title with status badge and action buttons (Edit, Run, Delete, Duplicate)
3. Summary card with key metadata in a responsive grid
4. Detail sections below (steps, attributes, usage history)

**Interactions:**
- Back-link navigates to parent library preserving filter state (via URL params using `nuqs`)
- Destructive actions (Delete) require confirmation dialog
- Edit actions either navigate to an edit page (brands) or enable inline editing (styles)

### 6.3 Multi-Step Form Pattern (Pipeline Builder, Style Creator)

Used by: `/pipelines/new`, `/styles/new`

**Structure:**
1. Back-link to parent library
2. Step progress indicator (`BuilderProgress` at `/web/src/widgets/pipeline-builder/ui/builder-progress.tsx`)
3. Current step content area
4. Bottom navigation: Back + Next/Submit buttons

**Interactions:**
- Steps are navigable forward and backward
- Each step validates before allowing forward navigation
- Form state persists in a Zustand store (e.g., `useBuilderForm`)
- Final step shows a summary with "Save" and "Save & Run" actions
- Browser back button navigates to the previous step, not the previous page

### 6.4 Status Timeline Pattern (Pipeline Run)

Used by: `/pipelines/[id]/runs/[runId]`

**Structure:**
1. Vertical timeline with icon + connector line
2. Each step shows: icon (status-colored), name, duration, output preview
3. Running step shows progress bar (`Progress` component)
4. Failed step shows error message with retry/skip actions
5. Fan-out branches shown as indented sub-items under the parent step

**Interactions:**
- Timeline auto-scrolls to the currently running step (via SSE updates)
- Completed step output is expandable (click to see full output)
- Review-waiting steps show a "Review" link that navigates to the review detail page
- Pause and Cancel buttons in the header when a run is active

### 6.5 Review Pattern (Review Detail)

Used by: `/review/[runId]/[stepId]`

**Structure:**
1. Two-column layout: Context panel (35% width) + Output panel (65% width)
2. Context panel: source info, style profile summary, previous step output (collapsible)
3. Output panel: editable content organized by format (e.g., posts in a thread, each with character count)
4. Sticky bottom action bar: Reject (left) + Skip (center) + Approve (right)

**Interactions:**
- Output text is directly editable via `Textarea` components
- Character counts update live and show red when over platform limits
- Approve: submits the (potentially edited) content and advances the pipeline
- Reject: opens a feedback textarea, then retries the step with feedback
- Skip: marks this step as skipped, continues pipeline without this output
- Mobile: columns stack vertically, context panel becomes a collapsible section

### 6.6 Card Pattern (Entity Cards)

Used by: `PipelineCard`, `StyleCard`, `BrandCard`, `ReviewCard`, `ContentCard`

**Structure:**
- Shadcn `Card` with `CardHeader` (title + action/badge), `CardContent` (details), `CardFooter` (actions)
- Fixed height within grid (use `h-full` on card, `line-clamp-2` on descriptions)
- Hover: subtle shadow elevation (`hover:shadow-md`)
- Focus: visible ring (`focus-visible:outline-2 focus-visible:outline-ring`)

**Content density rules:**
- Title: 1 line, font-medium text-base
- Description: max 2 lines via `line-clamp-2`
- Metadata: small text (`text-xs`), muted color, icon-prefixed
- Actions: 1-2 buttons in footer, compact sizes (`size="sm"` or `size="xs"`)

---

## 7. Accessibility Considerations

### 7.1 WCAG 2.1 AA Compliance

All interfaces must meet WCAG 2.1 AA. This is implemented through the following specific requirements:

**Color and contrast:**
- Text contrast: minimum 4.5:1 against background (enforced by the existing Tailwind color tokens: `foreground`, `muted-foreground`, `primary`, etc.)
- UI component contrast: minimum 3:1 for borders, icons, and interactive elements
- Color is never the sole indicator of status. Every status uses icon + label + color (see `StatusIndicator`, `RunStatusBadge`, `LifecycleBadge`)

**Interactive targets:**
- Minimum 44x44px touch targets on all interactive elements (existing: sidebar nav items, bottom bar tabs, card action buttons)
- 48x48px preferred for primary actions (existing: "New Pipeline" button, "Approve" button)
- Adequate spacing between adjacent interactive elements (minimum 8px gap)

**Keyboard navigation:**
- All interactive elements are focusable via Tab key
- Focus order follows visual order (left-to-right, top-to-bottom)
- `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring` applied consistently
- `Escape` closes modals, dropdowns, and popovers
- `Enter` or `Space` activates buttons and links
- Arrow keys navigate within radio groups, tab lists, and dropdown menus
- Skip-to-content link at the top of the page (add to `AppLayout`)

**Screen reader support:**
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, `<footer>` used appropriately
- `aria-label` on navigation regions (existing: `aria-label="Main navigation"`, `aria-label="Mobile navigation"`)
- `aria-current="page"` on active nav items (existing in `MobileBottomBar`)
- `role="navigation"` on nav elements (existing)
- `aria-hidden="true"` on decorative icons (existing on all Lucide icons)
- `sr-only` text for icon-only buttons (existing: `<span className="sr-only">Actions</span>`)
- `aria-pressed` on toggle buttons (existing in template selection)
- Live regions (`aria-live="polite"`) for dynamic content updates: pipeline step completion, progress changes, notification counts
- `role="alert"` on error banners (pipeline failures, validation errors)

**Motion and animation:**
- Respect `prefers-reduced-motion` media query
- Loading spinners (`animate-spin`) should use `motion-safe:animate-spin`
- Sidebar collapse transition (`duration-200`) should be disabled under reduced-motion

### 7.2 Component-Specific Accessibility

| Component | Requirements |
|-----------|-------------|
| `Sidebar` | `role="navigation"`, `aria-label`, collapse/expand toggle has `aria-label` |
| `MobileBottomBar` | `role="navigation"`, `aria-label`, `aria-current` on active tab |
| `SearchTrigger` | Opens command palette, keyboard shortcut (`Cmd+K`), `role="searchbox"` |
| `NotificationBell` | `aria-label` includes count ("3 notifications"), dropdown has `role="menu"` |
| Pipeline step list | Ordered list `<ol>`, move buttons have `aria-label` ("Move Script Writer up") |
| Review card checkboxes | `aria-label` per checkbox ("Select Script Writer step"), bulk actions announce count |
| Style attribute editing | Textarea has associated label, Save/Cancel are keyboard-accessible |
| Status badges | Include text label alongside icon, not icon-only |
| Progress bars | `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"` |
| Dialogs | Focus trap, `Escape` to close, focus returns to trigger on close |

---

## 8. i18n Considerations

### 8.1 Bilingual Display Pattern

As specified in `CLAUDE.md`, all pages support English and Korean. The existing codebase follows a consistent bilingual pattern:

**Page-level titles:** `PageHeader` takes `title` (English) and `titleKo` (Korean). Korean subtitle is displayed below the English title in `text-sm text-muted-foreground` with `lang="ko"`.

**Section headers:** `SectionHeader` takes `title` (English) and `titleKo` (Korean). Same display pattern.

**Empty states:** `EmptyState` takes both English and Korean versions of title and description.

**Form labels:** Brand form uses `FormField` with `label` + `labelKo`. Korean appears inline as `/ labelKo` in `text-xs text-muted-foreground`.

**Settings toggles:** Each toggle/radio shows `label` + `labelKo` inline.

### 8.2 Text Direction and Spacing

- Korean text does not require RTL support
- Korean characters are wider than Latin characters; ensure `min-w-0` and `truncate` on containers to prevent layout overflow
- Line heights: Korean text may need slightly more line-height than English; use `leading-relaxed` for Korean body text
- Character counts (e.g., tweet character limits) apply to the output language, not the interface language

### 8.3 Content That Must Not Be Translated

- Pipeline step names (these are product-specific terms: "Idea Generator," "Script Writer")
- Style attribute labels ("Hook Pattern," "Content Structure")
- Platform names ("X / Twitter," "YouTube," "LinkedIn")
- AI model names ("Claude Sonnet," "GPT-4o")
- Technical metadata (URLs, timestamps, IDs)

### 8.4 Implementation Notes

- All user-facing strings exist as inline props (not an i18n key system). This matches the current codebase pattern and avoids introducing an i18n framework for two languages.
- If a third language is added, migrate to `next-intl` or `next-i18next` and extract strings to JSON files.
- Date formatting uses `toLocaleDateString("en-US", ...)` for English and should add Korean formatting when full locale switching is implemented.

---

# Part 2: Feature UX Specs

## F1. Dashboard

### Purpose

Surface the most important information and actions so the user can immediately understand what needs attention and take the next step. The dashboard answers three questions: "What needs my review?", "What is running?", and "What topics should I create content about?"

### User Stories

- As a content creator, I want to see pending reviews as soon as I open the app, so that I can approve content quickly.
- As a solo entrepreneur, I want to see if my scheduled pipelines ran successfully today, so that I know my content is being published.
- As a marketing team member, I want quick-start actions, so that I can create a new pipeline or run without navigating through menus.
- As any user, I want to see trending topics in my niche, so that I can create timely content.

### Key Interactions

1. **Page load:** Dashboard loads with greeting, stat cards, pending reviews, quick-start, recent runs, and trending topics.
2. **Stat card tap:** Each stat card is a link to the relevant page (Review, Pipelines, Content).
3. **Pending review tap:** Opens the review detail page for that item.
4. **Quick-start actions:** "New Pipeline" navigates to builder. "Quick Run" opens a minimal dialog (topic input + template select + run). "New Style" navigates to style creator.
5. **Recent run tap:** Opens the run detail page.
6. **Trending topic tap:** Opens the pipeline builder pre-filled with that topic.

### States

| State | Condition | Display |
|-------|-----------|---------|
| **Empty (first use)** | No pipelines, no runs, no reviews | `EmptyDashboard` component: welcome message, single "Create Your First Pipeline" CTA, brief explanation of what Kova does |
| **Loading** | Data fetching in progress | `DashboardSkeleton`: skeleton cards matching the layout of stat cards, review cards, run cards |
| **Populated** | Has data | Full dashboard with all sections |
| **Partial** | Some sections empty | Each section handles its own empty state: "No pending reviews" inline message, "No recent runs" inline message, trending topics always show (from background collection) |
| **Error** | API failure | Inline error banner at the top of the affected section with retry button. Other sections render normally. |

### Micro-interactions

- **Stat card hover:** Subtle shadow elevation (`hover:shadow-md`)
- **Greeting:** Time-of-day-aware greeting ("Good morning," "Good afternoon," "Good evening")
- **Pending review count:** Badge with count on the Review nav item syncs with the stat card count
- **Trending topic pills:** Lifecycle dot pulses gently on "Emerging" topics to draw attention

### Accessibility

- `<section aria-label="Dashboard greeting and stats">` for the greeting section
- `<section aria-label="Pending reviews">` for reviews section
- `<section aria-label="Quick start actions">` for quick-start
- `<section aria-label="Recent pipeline runs">` for recent runs
- `<section aria-label="Trending topics">` for trends
- Stat cards: link role, focus-visible outline, descriptive text
- Screen reader: stat values read as "{count} {label}" (e.g., "3 Items to review")

---

## F2. Pipeline Builder

### Purpose

Enable users to create and configure content workflows by selecting a template, adding/removing/reordering steps, configuring brand/style/schedule, and reviewing before saving or running.

### User Stories

- As a new user, I want to select a pre-built template, so that I can start creating content without understanding every step.
- As a power user, I want to add, remove, and reorder steps, so that I can build a custom workflow for my needs.
- As a scheduled content creator, I want to set a recurring schedule and approval mode, so that content generates automatically.
- As an agency user, I want to select a specific brand and style profile for this pipeline, so that the output matches my client's identity.

### Key Interactions

1. **Step 1 - Basics:** Enter pipeline name, select template (6 options in card grid), choose source type (topic/URL/file/text), enter source input.
2. **Step 2 - Steps:** View pre-filled steps from template (or empty if blank). Reorder via up/down buttons. Expand to configure per-step settings. Add new steps from categorized popover. Remove steps.
3. **Step 3 - Settings:** Select brand (dropdown), select style profile (dropdown), choose trigger (once vs. schedule with radio cards), if scheduled: set frequency + time + approval mode.
4. **Step 4 - Review:** Summary card showing all configured values. Two CTAs: "Save as Draft" and "Save & Run."

### States

| State | Display |
|-------|---------|
| **Initial** | Template grid visible, no template selected, "Next" disabled until name is entered |
| **Template selected** | Steps pre-filled, source type auto-suggested based on template |
| **Steps empty (blank template)** | Empty state with Layers icon + "Add your first step" + Add Step button |
| **Steps populated** | Ordered list with drag handles (visual only currently), expand/collapse, reorder buttons |
| **Schedule selected** | Frequency + time inputs appear. Approval mode radio group appears below. |
| **Review** | Read-only summary. All configured values displayed. Edit links per section to jump back. |

### Micro-interactions

- **Template card selection:** Ring highlight (`ring-2 ring-primary`) with smooth transition
- **Source type selection:** Card highlight with icon color change
- **Step expand:** Smooth height transition revealing config fields
- **Step reorder:** Buttons swap positions instantly (no drag animation currently)
- **Add step popover:** Categorized list (Generate, Refine, Transform, Review, Publish) with category icons
- **Progress indicator:** Step dots fill as user progresses. Current step is highlighted. Completed steps are checkmarked.

### Accessibility

- Template grid: `aria-pressed` on selected template card
- Source type grid: `aria-pressed` on selected source type
- Step list: `<ol>` semantics, move buttons with `aria-label` ("Move {stepName} up/down")
- Schedule radio group: `<fieldset>` + `<legend>`, `role="radiogroup"`
- Approval mode: Same fieldset/legend pattern
- Progress indicator: `aria-label="Step {n} of 4: {stepName}"`
- All form inputs have associated `<label>` elements

---

## F3. Pipeline Execution Dashboard

### Purpose

Provide real-time visibility into pipeline execution so users can monitor progress, identify failures, and take action (pause, cancel, retry).

### User Stories

- As a content creator, I want to see which step is currently running, so that I know how long until completion.
- As a user whose pipeline failed, I want to see exactly which step failed and why, so that I can retry or skip.
- As a user with fan-out transforms, I want to see the status of each branch, so that I know which formats succeeded.
- As a user waiting for review, I want to be notified when the pipeline reaches a human gate, so that I can approve promptly.

### Key Interactions

1. **View run:** Navigate from pipeline detail or notification. See header with pipeline name, run status badge, step count.
2. **Monitor progress:** Vertical timeline shows each step with status icon, name, and progress bar (if running).
3. **View outputs:** Completed steps show a one-line output preview. Click to expand full output.
4. **Handle failure:** Failed step shows error message in red. "Retry this step" and "Skip and continue" buttons appear inline.
5. **Pause/Cancel:** Header buttons for running pipelines.
6. **View branches:** Fan-out steps show indented sub-items with branch icon + status for each format.

### States

| State | Display |
|-------|---------|
| **Running** | Timeline with active step showing spinner + progress bar. Pause/Cancel buttons in header. |
| **Waiting for review** | Timeline shows review icon (User) on the waiting step. "Review" link navigates to review detail. |
| **Completed** | Green success banner with "All content generated" + link to Content Library. All steps show checkmarks. |
| **Failed** | Red error banner with failed step name + error message. Retry/Skip buttons. |
| **Cancelled** | Grey cancelled banner. Timeline shows completed steps + cancelled remaining steps. |
| **Not found** | "Run not found" message with back-link to pipeline detail. |

### Micro-interactions

- **Running step spinner:** Loader2 icon with `animate-spin` in brand color
- **Progress bar:** Smooth fill animation via `Progress` component
- **Step completion:** Icon transitions from spinner to checkmark
- **Error appearance:** Red border on failed step card, error text fades in
- **SSE updates:** Steps update in real-time without page refresh (polling DB every 2s via SSE)

### Accessibility

- Timeline uses semantic list (`<div>` with step items, each with status role)
- Status icons have `aria-hidden="true"`, status is communicated via text
- Progress bar: `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Live updates: `aria-live="polite"` on the timeline container so screen readers announce step completions
- Action buttons: clear labels ("Retry this step", "Skip and continue", "Pause pipeline", "Cancel pipeline")

---

## F4. Human Review Screen

### Purpose

Present pipeline outputs that require human approval in a format that enables efficient evaluation and inline editing before approving, rejecting, or skipping.

### User Stories

- As a content creator reviewing a thread, I want to see the source context alongside the generated output, so that I can evaluate quality.
- As a reviewer, I want to edit individual posts inline before approving, so that I can fix small issues without rejecting.
- As an agency user with multiple pending reviews, I want to bulk-approve items that look good, so that I can process reviews quickly.
- As a reviewer rejecting content, I want to provide feedback, so that the retry generates better output.

### Key Interactions

**Review Queue (`/review`):**
1. View all pending review items as a filterable list
2. Filter by status (All, Pending, Approved, Rejected) via tabs
3. Sort by oldest/newest
4. Enter selection mode for bulk approve/reject
5. Click individual item to open review detail

**Review Detail (`/review/[runId]/[stepId]`):**
1. See two-column layout: context (left, 35%) + output (right, 65%)
2. Read context: source info, style profile attributes, previous step output (expandable)
3. Edit output: each content unit (post in a thread, section in an article) is an editable textarea
4. See character counts per post (red when over platform limit)
5. Take action: Approve & Continue / Skip / Reject with Feedback

### States

**Review Queue:**

| State | Display |
|-------|---------|
| **Empty** | `EmptyState` with CheckSquare icon: "No items to review" |
| **Populated** | List of `ReviewCard` components with warning left-border |
| **Selection mode** | Checkboxes appear on each card. Bulk action toolbar slides in. |
| **Filtered empty** | "No items match your filters" with suggestion to adjust |

**Review Detail:**

| State | Display |
|-------|---------|
| **Loaded** | Two-column layout with context + editable output |
| **Editing** | Textarea content differs from original. Character count updates. |
| **Over limit** | Character count turns red. Approve button still available (warning, not block). |
| **Approving** | "Approve" button shows loading state. Content is submitted. |
| **Rejecting** | Feedback textarea appears below the output panel. Submit sends feedback. |

### Micro-interactions

- **Selection mode enter:** Checkboxes fade in on each card. Toolbar slides down from top of list.
- **Bulk action:** Approve/Reject affects all selected items. Progress indicator during batch operation.
- **Character count:** Live update as user types. Color transition from muted to red at limit.
- **Approve success:** Brief green flash on the action bar. Auto-navigate to next pending review or back to queue.
- **Reject:** Feedback textarea expands smoothly below the output panel.
- **Previous step output:** Expand/collapse with ChevronDown/ChevronUp toggle.

### Accessibility

- Review cards: `role="button"` when selectable, keyboard-activatable (Enter/Space)
- Checkboxes: `aria-label="Select {stepName}"` per card
- Bulk action toolbar: `aria-live="polite"` to announce selection count changes
- Textarea editing: standard form semantics, character count is `aria-describedby` on the textarea
- Action bar: sticky bottom, keyboard-accessible, clear button labels
- Two-column layout: on screen readers, context is announced before output (natural reading order)

---

## F5. Style Library + Style Profile Creator

### Purpose

Enable users to build a personal library of content composition patterns by extracting structural attributes from reference content. This is the product's primary differentiator.

### User Stories

- As a content creator, I want to provide a URL to a viral thread and extract its structure, so that I can apply that pattern to future content.
- As a power user, I want to edit extracted attributes manually, so that I can fine-tune the composition pattern.
- As a pipeline user, I want to apply a saved style profile with one click, so that my content follows a consistent structure.
- As a user validating a style, I want to preview a sample output before saving, so that I can confirm the extraction is accurate.

### Key Interactions

**Style Library (`/styles`):**
1. View all saved styles in a card grid
2. Search by name, filter by source type, sort by recent/most-used/alphabetical
3. Each card shows: name, source type badge, top 3 extracted attributes, usage count
4. Card actions: "Apply" (to a pipeline) and "Edit" (open detail page)

**Style Creator (`/styles/new`) -- Three-phase flow:**

Phase 1 - Input:
1. Select input type via tabs: URL / Text / File
2. Enter/paste/upload content
3. Click "Analyze Style"

Phase 2 - Analyzing:
1. See progress with step indicators (Fetching content... done. Extracting patterns... 72%)
2. Progress bar fills
3. Duration estimate shown ("This usually takes 10-30 seconds")

Phase 3 - Result:
1. See source info card (URL, content type detected)
2. See all extracted attributes with labels and values
3. Enter a name for the profile
4. Click "Generate Preview" to see sample content using this style
5. Review preview. If unsatisfactory, edit attributes and regenerate.
6. Click "Save Profile"

**Style Detail (`/styles/[id]`):**
1. View all extracted attributes
2. Edit any attribute inline (click Edit, modify textarea, save)
3. Generate preview with current attributes
4. See which pipelines use this style
5. Duplicate or delete the profile

### States

**Style Library:**

| State | Display |
|-------|---------|
| **Empty (no styles)** | `EmptyState` explaining what styles are and how they differ from brands. CTA: "Create Your First Style" |
| **Populated** | Card grid with search + filters |
| **No search results** | Search icon + "No styles found" + "Try adjusting your search or filters" |
| **Loading** | `StyleLibrarySkeleton` |

**Style Creator:**

| State | Display |
|-------|---------|
| **Input phase** | Tab selector + input field + "Analyze Style" button (disabled until input provided) |
| **Analyzing** | Centered loader with step-by-step progress |
| **Result** | Two-column layout: source info + extracted attributes. Preview section below. |
| **Preview loading** | Sparkles icon with spinner in preview area |
| **Preview loaded** | Sample content displayed in bordered area |

### Micro-interactions

- **Tab switch:** Input field clears and changes to the appropriate input type
- **Analyze button:** Transitions to analyzing phase with smooth fade
- **Analysis progress:** Steps complete one by one with checkmarks
- **Preview generation:** Sparkles/RefreshCw icon with loading state
- **Attribute edit:** Click "Edit" reveals textarea inline. Save/Cancel buttons appear below.
- **Save profile:** Success notification. Redirect to style library.

### Accessibility

- Tabs: standard Radix UI tabs with keyboard navigation (Arrow keys)
- File upload: `aria-label="Upload file"` on the hidden input
- Analysis progress: `aria-live="polite"` container, each completed step announced
- Extracted attributes: semantic heading structure (attribute label as term, value as definition)
- Preview area: `aria-label="Style preview output"`
- Edit mode: textarea has label association, save/cancel keyboard-accessible

---

## F6. Brand Library + Brand Editor

### Purpose

Manage multiple brand identities that define voice, tone, vocabulary, and platform connections. Brands determine who is speaking; styles determine how the content is structured.

### User Stories

- As a solo creator, I want to create a brand with my voice and tone, so that all generated content sounds like me.
- As an agency user, I want to manage multiple client brands, so that I can switch between them per pipeline.
- As a brand owner, I want to connect my platform accounts to a brand, so that content publishes to the right accounts.
- As a user with multiple brands, I want to set a default brand, so that I do not have to select it every time.

### Key Interactions

**Brand Library (`/brands`):**
1. View all brands in a card grid
2. Search by name, sort by recent/most-used/alphabetical
3. Each card shows: name, default badge (if applicable), description, connected platform icons, pipeline count
4. Card overflow menu: Edit, Duplicate, Set as Default, Delete

**Brand Editor (`/brands/new` and `/brands/[id]`):**
1. **Identity section:** Brand name, description, voice and tone, target audience, perspective (select dropdown)
2. **Vocabulary section:** Words to use (textarea), words to avoid (textarea), emoji usage (radio pill group), content guidelines (textarea)
3. **Connected platforms section:** List of connected accounts with platform icon. "Link Platform Account" button.
4. **Bottom action bar:** Cancel (back to library) + Save

### States

**Brand Library:**

| State | Display |
|-------|---------|
| **Empty** | `EmptyState` explaining what brands are. CTA: "Create Your First Brand" |
| **Populated** | Card grid with search + sort |
| **No search results** | "No brands found" with search icon |
| **Loading** | `BrandLibrarySkeleton` |

**Brand Editor:**

| State | Display |
|-------|---------|
| **Create mode** | Empty form, title "Create New Brand" |
| **Edit mode** | Pre-populated form, title is brand name, overflow menu with Duplicate/Set as Default/Delete |
| **Saving** | Save button shows loading state |
| **Validation error** | Inline error messages below invalid fields |

### Micro-interactions

- **Emoji usage pills:** Pill-shaped radio buttons with ring highlight on selection
- **Platform connection:** "Link Platform Account" opens an OAuth flow in a new window. On return, the platform appears in the connected list.
- **Delete confirmation:** Dialog with brand name, warning about affected pipelines, confirm/cancel
- **Set as Default:** Current default loses badge, new default gains badge. Optimistic update.

### Accessibility

- Form fields: all inputs have associated `<label>` via `FormField` component with `useId()`
- Emoji usage: `role="radiogroup"` with `aria-label="Emoji usage"`, each option is a radio input
- Platform list: semantic list items with platform icon having `aria-hidden="true"`
- Overflow menu: `DropdownMenu` with standard Radix keyboard navigation
- Delete dialog: focus trap, `role="alertdialog"`, `aria-describedby` for the warning text

---

## F7. Content Library

### Purpose

Provide a browsable archive of all content generated by pipelines, with filters for format, platform, and status. Content items link to platform-native analytics for performance tracking.

### User Stories

- As a content creator, I want to see all my published content in one place, so that I can track what has been deployed.
- As a user, I want to filter content by format and platform, so that I can find specific pieces.
- As a publisher, I want to export draft content, so that I can post it manually on platforms not yet connected.
- As a reviewer, I want to see content linked to platform analytics, so that I can check performance.

### Key Interactions

1. View all content in a card grid
2. Search by title
3. Filter by format (Thread, Post, Newsletter, Video Script, Carousel)
4. Filter by platform (X, LinkedIn, YouTube, Instagram, Newsletter)
5. Filter by status (Published, Draft, Scheduled)
6. Each card shows: format icon, title, platform badge, status, published date, pipeline name
7. Card actions: View (external link), Export (download), Analytics (link to platform-native dashboard)

### States

| State | Display |
|-------|---------|
| **Empty** | `EmptyState`: "No content yet. Content appears here after your pipelines generate it." CTA: "Go to Pipelines" |
| **Populated** | Card grid with search + filters |
| **No results** | "No content found" with filter adjustment suggestion |
| **Loading** | Skeleton cards matching content card layout |

### Micro-interactions

- **Filter change:** Grid re-renders immediately (client-side filtering)
- **Analytics button:** Opens platform-native analytics in a new tab (safe URL validation via `isSafeUrl()`)
- **Export button:** Downloads content as a text file
- **Status color:** Published (green/success), Draft (muted), Scheduled (blue/info)

### Accessibility

- Filter selects: standard Radix `Select` with keyboard navigation
- Content cards: not linkable (no detail page); actions are explicit buttons
- External links: `target="_blank"` with `rel="noopener noreferrer"` and "opens in new tab" sr-only text
- Format icons: `aria-hidden="true"` with format label as visible text beside them

---

## F8. Trends Dashboard

### Purpose

Surface trending topics ranked by relevance score, filtered by niche and time range, with a direct action to create content from any topic.

### User Stories

- As a content creator, I want to see what topics are trending in my niche, so that I can create timely content.
- As a scheduled pipeline user, I want the system to use trends automatically, so that my daily content is relevant.
- As a user evaluating a topic, I want to understand its lifecycle stage, so that I know if it is too early, ideal, or too late to create content.
- As a user, I want to save interesting topics for later, so that I can batch my content creation.

### Key Interactions

1. View ranked list of trending topics (numbered 1 through N)
2. Filter by niche (All, SaaS, AI/ML, Dev Tools, Content Marketing)
3. Filter by time range (24h, 3 days, 1 week)
4. Each topic row shows: rank, topic name, lifecycle badge (Emerging/Rising/Peak/Declining), source badge (Reddit/YouTube/Google Trends), score bar, actions
5. Actions per topic: "Create Content" (navigate to pipeline builder with topic pre-filled), "Save" (bookmark)
6. Lifecycle legend at bottom explains what each stage means

### States

| State | Display |
|-------|---------|
| **Populated** | Ranked list with all topics |
| **Filtered empty** | "No trending topics found for this niche" with suggestion to adjust filters |
| **Loading** | Skeleton rows matching the topic card layout |
| **Error** | Inline error: "Unable to fetch trend data. Retry." |

### Micro-interactions

- **Score bar:** Filled proportional to score (0-100) using `Progress` component
- **Lifecycle badge:** Colored dot + label. Emerging = green, Rising = blue, Peak = amber, Declining = grey.
- **Create Content button:** Navigates to `/pipelines/new` with topic name as source input via URL query parameter
- **Save button:** Bookmark icon toggles filled/outline state. Saved topics persist.

### Accessibility

- Topic list: uses `Card` per topic for clear boundaries
- Score bar: `role="progressbar"` with `aria-valuenow`
- Lifecycle badge: text label included alongside colored dot
- Action buttons: clear labels, minimum 44px touch targets
- Lifecycle legend: uses semantic structure with descriptive text

---

## F9. Settings

### Purpose

Configure platform connections, AI model preferences, and default pipeline settings in a single organized location.

### User Stories

- As a new user, I want to connect my social media accounts, so that Kova can publish content to them.
- As a user optimizing costs, I want to choose which AI models to use for each task, so that I can balance quality and expense.
- As a frequent user, I want to set default brand, style, and approval mode, so that new pipelines start with my preferences.
- As a user managing notifications, I want to control which events notify me, so that I am not overwhelmed.

### Key Interactions

**Settings shell (`/settings`):**
- Two-column layout on desktop: left sidebar nav (Platforms, AI Models, Defaults) + right content area
- Mobile: horizontal scrollable tab bar above content

**Platforms (`/settings/platforms`):**
1. Connected platforms section: list of connected accounts with platform icon, name, account handle, connection date, permissions, "Disconnect" button
2. Available platforms section: list of unconnected platforms with description and "Connect" button (or "Coming Soon" badge)

**AI Models (`/settings/models`):**
1. Per-task model selector: Writing AI, Transcription, Voice Generation, Image Generation
2. Each row: task icon + label + select dropdown + cost badge

**Defaults (`/settings/defaults`):**
1. Default brand selector
2. Default style profile selector
3. Default approval mode (radio group: autopilot, review before publish, per-platform)
4. Default output formats (checkbox group: Thread, LinkedIn Post, Newsletter, Video Script, Carousel, Short Video)
5. Timezone selector
6. Notification preferences (toggle switches: Pipeline complete, Review needed, Daily digest)

### States

| State | Display |
|-------|---------|
| **No platforms connected** | All platforms in "Available" section, no "Connected" section |
| **Some connected** | Split into Connected + Available sections with separator |
| **Model selector loading** | Skeleton select triggers |
| **Defaults saved** | Optimistic update, no explicit save button (auto-save on change). Brief success toast. |

### Micro-interactions

- **Connect button:** Opens OAuth flow in popup. On success, platform moves from Available to Connected with brief fade transition.
- **Disconnect button:** Confirmation dialog listing affected brands and pipelines before disconnection.
- **Model select change:** Cost badge updates immediately to reflect the selected model's cost tier.
- **Toggle switch:** Smooth slide animation with color change.
- **Auto-save:** Settings persist on each change. Debounced by 500ms to avoid excessive API calls.

### Accessibility

- Settings nav: `role="navigation"`, `aria-label="Settings navigation"`, `aria-current="page"` on active item
- Platform cards: semantic structure with platform name as the primary label
- Model selectors: label + select association
- Toggle switches: `role="switch"`, `aria-checked`, keyboard-toggleable
- Radio groups: `role="radiogroup"`, `aria-label` on the fieldset
- Checkbox groups: standard checkbox semantics

---

# Part 3: Page Layouts

Each layout references existing component names from the codebase. Responsive breakpoints follow Tailwind defaults: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px).

---

## P1. `/` Dashboard

### Layout Description

Full-width single-column layout within the `AppLayout` content area (max-width 1200px, centered).

**Regions (top to bottom):**
1. **Greeting + Stats** -- `GreetingSection`: time-of-day greeting + 3 stat cards in a responsive row
2. **Reviews + Quick Start** -- Two-column on `lg`+, single column below. Left: `PendingReviews` (expandable list). Right: `QuickStart` (action card, fixed 320px width on desktop).
3. **Recent Runs** -- `RecentRuns`: horizontal scrollable card row or vertical list
4. **Trending Topics** -- `TrendingTopics`: pill-shaped topic badges, horizontally scrollable

### Component Hierarchy

```
DashboardPage (view: /web/src/views/dashboard/ui/dashboard-page.tsx)
+-- GreetingSection (widget: /web/src/widgets/dashboard/ui/greeting-section.tsx)
|   +-- Card (shared/ui)
|   +-- CardContent (shared/ui)
|   +-- stat links to ROUTES.REVIEW, ROUTES.PIPELINES, ROUTES.CONTENT
|
+-- PendingReviews (widget: /web/src/widgets/dashboard/ui/pending-reviews.tsx)
|   +-- SectionHeader (shared/ui)
|   +-- ReviewCard (entity: /web/src/entities/review/ui/review-card.tsx)
|       +-- FormatIcon (entity: /web/src/entities/review/ui/format-icon.tsx)
|       +-- Card, CardHeader, CardContent, CardFooter (shared/ui)
|
+-- QuickStart (widget: /web/src/widgets/dashboard/ui/quick-start.tsx)
|   +-- Card, CardHeader, CardTitle, CardContent (shared/ui)
|   +-- Button (shared/ui) x3
|
+-- RecentRuns (widget: /web/src/widgets/dashboard/ui/recent-runs.tsx)
|   +-- SectionHeader (shared/ui)
|   +-- RunStatusBadge (entity: /web/src/entities/pipeline/ui/run-status-badge.tsx)
|
+-- TrendingTopics (widget: /web/src/widgets/dashboard/ui/trending-topics.tsx)
    +-- SectionHeader (shared/ui)
    +-- TrendTopicPill (entity: /web/src/entities/trend/ui/trend-topic-pill.tsx)
        +-- LifecycleBadge (entity: /web/src/entities/trend/ui/lifecycle-badge.tsx)
```

### Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| **Desktop (lg+)** | Stats: 3-column grid. Reviews + QuickStart: side-by-side (flex-row). Recent Runs: card row. Trends: horizontal scroll. |
| **Tablet (md-lg)** | Stats: 3-column grid. Reviews + QuickStart: stack vertically. Recent Runs: 2 cards per row. Trends: same. |
| **Mobile (<md)** | Stats: single column. All sections stack. QuickStart: full width. |

### Key States

| State | Visual |
|-------|--------|
| **First use (empty)** | `EmptyDashboard` replacing all sections: welcome message + single CTA |
| **Loading** | `DashboardSkeleton`: 3 skeleton stat cards + skeleton review cards + skeleton run cards |
| **Populated** | All sections rendered with data |
| **Error** | Inline error per section. Other sections render normally. |

---

## P2. `/pipelines` Pipeline List

### Layout Description

Standard Library Pattern page: PageHeader + filter bar + card grid.

**Regions:**
1. **Header** -- `PageHeader` with "Pipelines" title and "New Pipeline" button
2. **Filter bar** -- Search input + status Select + sort Select
3. **Card grid** -- Responsive grid of `PipelineCard` components
4. **Empty state** -- `EmptyState` when no pipelines exist

### Component Hierarchy

```
PipelinesPage (view: /web/src/views/pipelines/ui/pipelines-page.tsx)
+-- PageHeader (shared/ui)
|   +-- Button > Link to ROUTES.PIPELINE_NEW
|
+-- Filter bar (inline)
|   +-- Input with Search icon prefix (shared/ui)
|   +-- Select for status filter (shared/ui)
|   +-- Select for sort (shared/ui)
|
+-- Card grid
|   +-- PipelineCard (entity: /web/src/entities/pipeline/ui/pipeline-card.tsx) x N
|       +-- Card, CardHeader, CardTitle, CardAction, CardContent, CardFooter (shared/ui)
|       +-- PipelineStatusBadge (entity)
|
+-- EmptyState (shared/ui) -- when no results
    +-- Button > Link to ROUTES.PIPELINE_NEW
```

### Responsive Behavior

| Breakpoint | Grid Columns | Filter Layout |
|------------|-------------|---------------|
| **xl+** | 3 columns | Search fills, selects fixed width inline |
| **md-xl** | 2 columns | Same filter layout |
| **<md** | 1 column | Search on top, selects on row below (flex-col then flex-row) |

### Key States

| State | Visual |
|-------|--------|
| **Empty** | `EmptyState` centered: GitBranch icon + "No pipelines found" + CTA |
| **Loading** | `PipelineListSkeleton` (widget) |
| **Populated** | Grid of pipeline cards |
| **Filtered empty** | Simplified empty: "No pipelines match your filters" |

---

## P3. `/pipelines/new` Pipeline Builder

### Layout Description

Multi-step form with progress indicator. Full-width within content area.

**Regions:**
1. **Back-link** -- ArrowLeft + "Pipelines"
2. **Progress indicator** -- `BuilderProgress`: 4-step horizontal stepper (Basics, Steps, Settings, Review)
3. **Step content area** -- Current step component (changes per step)
4. **Step navigation** -- Bottom-aligned Back/Next buttons

### Component Hierarchy

```
PipelineNewPage (view: /web/src/views/pipeline-new/ui/pipeline-new-page.tsx)
+-- Back-link to ROUTES.PIPELINES
+-- BuilderProgress (widget: /web/src/widgets/pipeline-builder/ui/builder-progress.tsx)
|
+-- Step content (conditionally rendered):
|   +-- StepBasics (widget: /web/src/widgets/pipeline-builder/ui/step-basics.tsx)
|   |   +-- Input for pipeline name
|   |   +-- Template card grid (6 templates)
|   |   +-- Source type card grid (4 types)
|   |   +-- Source input field (Input/Textarea/file upload per type)
|   |
|   +-- StepSteps (widget: /web/src/widgets/pipeline-builder/ui/step-steps.tsx)
|   |   +-- Ordered step list with GripVertical + number + category icon + name + reorder/expand/remove buttons
|   |   +-- StepConfigFields (inline, per step)
|   |   +-- Popover with categorized step menu (Add Step)
|   |
|   +-- StepSettings (widget: /web/src/widgets/pipeline-builder/ui/step-settings.tsx)
|   |   +-- Brand Select
|   |   +-- Style Profile Select
|   |   +-- Trigger radio cards (once/schedule)
|   |   +-- Schedule config (frequency Select + time Input)
|   |   +-- Approval mode radio cards
|   |
|   +-- StepReview (widget: /web/src/widgets/pipeline-builder/ui/step-review.tsx)
|       +-- Summary Card with all configured values
|       +-- Action buttons: "Save as Draft" + "Save & Run"
|
+-- Bottom navigation buttons (Back / Next)
```

### Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| **lg+** | Template grid: 3 columns. Source types: 4 columns. Steps: full width. Settings: comfortable spacing. |
| **md-lg** | Template grid: 2 columns. Source types: 4 columns. |
| **<md** | Template grid: 2 columns. Source types: 2 columns. Steps: full width, slightly tighter. |

### Key States

| State | Visual |
|-------|--------|
| **Step 1 initial** | Template grid unselected, name empty, Next disabled |
| **Step 2 empty (blank template)** | Layers icon + "No steps yet" + Add Step button |
| **Step 2 populated** | Ordered list of steps |
| **Step 3 schedule mode** | Additional schedule/approval fields visible |
| **Step 4 review** | Read-only summary + action buttons |

---

## P4. `/pipelines/[id]` Pipeline Detail

### Layout Description

Detail page with back-link, header with actions, info card, and run history section.

**Regions:**
1. **Back-link** -- ArrowLeft + "Pipelines"
2. **Header** -- Pipeline name + `PipelineStatusBadge` + Edit and Run buttons
3. **Info card** -- Description, template badge, schedule info, created date, steps list
4. **Run History** -- `SectionHeader` + list of run cards (or empty state)

### Component Hierarchy

```
PipelineDetailPage (view: /web/src/views/pipeline-detail/ui/pipeline-detail-page.tsx)
+-- Back-link to ROUTES.PIPELINES
+-- Header
|   +-- h1 pipeline name
|   +-- PipelineStatusBadge (entity)
|   +-- Button "Edit" > Link to pipeline detail
|   +-- Button "Run"
|
+-- Info Card
|   +-- Card, CardContent (shared/ui)
|   +-- Description paragraph
|   +-- Separator
|   +-- Metadata grid (template Badge, schedule, created date)
|   +-- Separator
|   +-- Steps ordered list
|
+-- Run History section
    +-- SectionHeader (shared/ui)
    +-- Run cards (each links to ROUTES.PIPELINE_RUN)
    |   +-- Card, CardContent (shared/ui)
    |   +-- RunStatusBadge (entity)
    |   +-- Run ID, timestamp, trigger type, step count, duration
    +-- Empty state if no runs
```

### Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| **lg+** | Metadata grid: 3 columns. Run cards: full width horizontal. |
| **sm-lg** | Metadata grid: 2 columns. |
| **<sm** | Metadata: single column. Header: title above, buttons below. |

### Key States

| State | Visual |
|-------|--------|
| **Not found** | "Pipeline not found" centered + back button |
| **No runs** | Play icon + "No runs yet" inline empty state |
| **With runs** | List of run cards sorted by most recent |
| **Loading** | Skeleton for info card + skeleton run list |

---

## P5. `/pipelines/[id]/runs/[runId]` Run Detail

### Layout Description

Status Timeline Pattern page with header, status banners, and vertical timeline.

**Regions:**
1. **Back-link** -- ArrowLeft + pipeline name
2. **Header** -- "Run: {pipelineName}" + `RunStatusBadge` + step counter + action buttons (Pause/Cancel/Retry)
3. **Status banner** -- Conditional: completed (green), failed (red), or absent
4. **Timeline card** -- Vertical timeline of steps with status icons, progress bars, outputs, branches

### Component Hierarchy

```
PipelineRunPage (view: /web/src/views/pipeline-run/ui/pipeline-run-page.tsx)
+-- Back-link to ROUTES.PIPELINE_DETAIL
+-- Header
|   +-- h1 "Run: {pipelineName}"
|   +-- RunStatusBadge (entity)
|   +-- Step counter "Step N of M"
|   +-- Action buttons (Pause, Cancel, Retry)
|
+-- Status banner (conditional)
|   +-- Completed: Card with success bg, CheckCircle2, "All content generated", link to Content Library
|   +-- Failed: Card with error bg, XCircle, failed step name + error, Retry/Skip buttons
|
+-- Timeline Card
    +-- Card, CardContent (shared/ui)
    +-- Steps: vertical timeline
        +-- Per step: status icon + connector line + step name + duration/progress/output
        +-- Per branch (fan-out): indented GitBranch icon + status icon + branch name
```

### Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| **sm+** | Header: title left, buttons right. Status banner: horizontal layout. |
| **<sm** | Header: stack vertically. Status banner: stack vertically. Timeline: same (inherently single-column). |

### Key States

| State | Visual |
|-------|--------|
| **Running** | Spinner on active step, progress bar visible. Pause/Cancel in header. |
| **Waiting for review** | User icon on waiting step. |
| **Completed** | Green banner. All checkmarks. No action buttons. |
| **Failed** | Red banner with error details. Retry/Skip buttons. |
| **Not found** | "Run not found" + back button |

---

## P6. `/review` Review Queue

### Layout Description

Filterable list with status tabs, sort control, optional selection mode, and bulk action toolbar.

**Regions:**
1. **Header** -- `PageHeader` with "Review Queue" title (no primary action button)
2. **Controls** -- Status tabs (All, Pending, Approved, Rejected) + Select mode button + sort dropdown
3. **Bulk action toolbar** -- Conditional: appears when selection mode is active
4. **Item count** -- "{N} items" text
5. **Review list** -- Vertical stack of `ReviewCard` components

### Component Hierarchy

```
ReviewPage (view: /web/src/views/review/ui/review-page.tsx)
+-- PageHeader (shared/ui) -- title only, no action
|
+-- Controls row
|   +-- Tabs > TabsList > TabsTrigger x4 (shared/ui)
|   +-- Button "Select" (enters selection mode)
|   +-- Select for sort order (shared/ui)
|
+-- Bulk action toolbar (conditional)
|   +-- "{N} selected" counter
|   +-- Button "Select All Pending"
|   +-- Button "Approve Selected"
|   +-- Button "Reject Selected"
|   +-- Button "Cancel" (exit selection mode)
|
+-- Item count paragraph
|
+-- Review list
|   +-- ReviewCard (entity: /web/src/entities/review/ui/review-card.tsx) x N
|       +-- Checkbox (when selectable)
|       +-- FormatIcon (entity)
|       +-- Card with warning left-border
|
+-- EmptyState (shared/ui) -- when no items
```

### Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| **sm+** | Controls: tabs left, buttons right (same row). Bulk toolbar: single row. |
| **<sm** | Controls: tabs on top row, buttons below. Bulk toolbar: wraps to two rows. |

### Key States

| State | Visual |
|-------|--------|
| **Empty** | `EmptyState` with CheckSquare icon: "No items to review" |
| **Populated** | List of review cards with warning border |
| **Selection mode** | Checkboxes on each card. Toolbar visible at top of list. |
| **Filtered empty** | "No items match your filters" |

---

## P7. `/review/[runId]/[stepId]` Review Detail

### Layout Description

Two-column layout with context panel (left) and output panel (right). Sticky action bar at bottom.

**Regions:**
1. **Header** -- Pipeline name + status badge + step name
2. **Two-column body** -- Context panel (35% on lg, full-width on mobile) + Output panel (65% on lg, full-width on mobile)
3. **Sticky action bar** -- Fixed to bottom: Reject / Skip / Approve buttons

### Component Hierarchy

```
ReviewDetailPage (view: /web/src/views/review-detail/ui/review-detail-page.tsx)
+-- Header
|   +-- h1 pipeline name
|   +-- Badge status
|   +-- Step name subtitle
|
+-- Two-column layout (flex-col lg:flex-row)
|   +-- Context Panel (lg:w-[35%])
|   |   +-- Card "Context"
|   |       +-- Source info (type badge + content preview)
|   |       +-- Style Profile summary (name, tone, hook pattern, rhythm)
|   |       +-- Previous Step Output (expandable with ChevronDown/Up)
|   |
|   +-- Output Panel (flex-1 lg:w-[65%])
|       +-- Section header "Generated Thread" + post count
|       +-- Post cards x N
|           +-- Card (shared/ui)
|           +-- Post number label
|           +-- Textarea (editable)
|           +-- Character count (red when over 280)
|
+-- Sticky action bar
    +-- Button "Reject with Feedback" (destructive outline)
    +-- Button "Skip" (ghost)
    +-- Button "Approve & Continue" (default/primary)
```

### Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| **lg+** | Two columns side-by-side. Context: 35% width. Output: 65% width. |
| **<lg** | Single column. Context panel on top (collapsible). Output below. Action bar full-width. |

### Key States

| State | Visual |
|-------|--------|
| **Loaded** | Full two-column layout with editable output |
| **Editing** | Character counts update live |
| **Over limit** | Character count in red (`text-destructive`) |
| **Approving** | Approve button shows loading spinner |
| **Rejecting** | Feedback textarea expands below output |

---

## P8. `/styles` Style Library

### Layout Description

Standard Library Pattern: PageHeader + filter bar + card grid.

**Regions:**
1. **Header** -- `PageHeader` with "Style Library" + "Create New Style" button
2. **Filter bar** -- Search input + source type Select + sort Select
3. **Card grid** -- Responsive grid of `StyleCard` components
4. **Empty state** -- `EmptyState` for zero styles, or no-results state for empty filter

### Component Hierarchy

```
StylesPage (view: /web/src/views/styles/ui/styles-page.tsx)
+-- PageHeader (shared/ui)
|   +-- Button > Link to ROUTES.STYLE_NEW
|
+-- Filter bar
|   +-- Input with Search prefix
|   +-- Select source type (All, URL, Text, Audio, Video, Image)
|   +-- Select sort (Recent, Most Used, Alphabetical)
|
+-- Card grid
|   +-- StyleCard (entity: /web/src/entities/style/ui/style-card.tsx) x N
|       +-- Card (shared/ui)
|       +-- Source type Badge
|       +-- StyleAttributeBadge (entity) x3
|       +-- Usage count
|       +-- Apply + Edit buttons in footer
|
+-- EmptyState (shared/ui) or no-results state
```

### Responsive Behavior

Same as Pipeline List: 3 columns (xl), 2 columns (md), 1 column (mobile).

### Key States

Same as Pipeline List with style-specific empty state messaging.

---

## P9. `/styles/new` Create Style Profile

### Layout Description

Three-phase flow: Input > Analyzing > Result. Each phase replaces the previous entirely.

**Phase 1 - Input:**
1. Back-link to Styles
2. Title: "Create Style Profile"
3. Tab selector (URL / Text / File)
4. Input area (varies by tab)
5. "Analyze Style" button

**Phase 2 - Analyzing:**
1. Back-link
2. Centered loading state with step progress

**Phase 3 - Result:**
1. Back-link
2. Header with "Style Extracted" + Save button
3. Two-column: Source Info card (left, narrow) + Extracted Attributes card (right, wide)
4. Style Preview card (full width)
5. Bottom Save button

### Component Hierarchy

```
StyleNewPage (view: /web/src/views/style-new/ui/style-new-page.tsx)
+-- Back-link to ROUTES.STYLES
|
+-- Phase 1: Input
|   +-- h1 "Create Style Profile"
|   +-- Tabs > TabsList > TabsTrigger x3 (URL, Text, File)
|   +-- TabsContent per tab
|   |   +-- Input (URL) / Textarea (Text) / File drop zone (File)
|   +-- Button "Analyze Style"
|
+-- Phase 2: Analyzing
|   +-- Loader2 spinner
|   +-- Progress steps (Fetching done, Extracting in progress)
|   +-- Progress bar
|
+-- Phase 3: Result
    +-- Header + Save button
    +-- Grid (1fr 2fr on lg)
    |   +-- Card "Source Info" (URL, content type, name input)
    |   +-- Card "Extracted Attributes" (list of attribute label-value pairs)
    +-- Card "Style Preview"
    |   +-- Preview text area
    |   +-- Button "Generate Preview" / "Regenerate Preview"
    +-- Bottom Save button
```

### Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| **lg+** | Result phase: two-column grid (source info narrow, attributes wide) |
| **<lg** | Result phase: single column, source info card on top |

---

## P10. `/styles/[id]` Style Detail

### Layout Description

Detail page with back-link, header with actions, profile summary card, editable attribute cards, preview card, and usage section.

**Regions:**
1. **Back-link** -- ArrowLeft + "Back to Styles"
2. **Header** -- Style name + Duplicate/Delete buttons
3. **Profile Summary** -- Card with source URL, created date, usage count
4. **Attributes** -- Two-column grid of attribute cards with inline edit capability
5. **Style Preview** -- Preview generation card
6. **Usage** -- "Used in Pipelines" list

### Component Hierarchy

```
StyleDetailPage (view: /web/src/views/style-detail/ui/style-detail-page.tsx)
+-- Back-link to ROUTES.STYLES
+-- Header (name + action buttons)
+-- Card "Profile Summary" (3-col grid: source, created, usage count)
+-- Attributes section
|   +-- h2 "Style Attributes"
|   +-- Grid (1 col mobile, 2 col lg)
|       +-- Card per attribute
|           +-- Attribute label + Edit button
|           +-- Attribute value text (or Textarea when editing)
|           +-- Save/Cancel buttons (when editing)
+-- Card "Style Preview"
|   +-- Preview text or placeholder
|   +-- Button "Generate Preview"
+-- Usage section
    +-- h2 "Used in Pipelines"
    +-- List of pipeline rows (name + last run time)
    +-- Or: empty state "Not used in any pipelines"
```

### Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| **lg+** | Profile summary: 3-column grid. Attributes: 2-column grid. |
| **<lg** | Profile summary: single column. Attributes: single column. |

---

## P11. `/brands` Brand Library

### Layout Description

Standard Library Pattern: PageHeader + filter bar + card grid.

Identical structure to Style Library but with brand-specific cards and filter options (no source type filter, just search + sort).

### Component Hierarchy

```
BrandsPage (view: /web/src/views/brands/ui/brands-page.tsx)
+-- PageHeader (shared/ui) with "Brand Library" + "Create New Brand" button
+-- Filter bar (search + sort)
+-- Card grid
|   +-- BrandCard (entity: /web/src/entities/brand/ui/brand-card.tsx) x N
|       +-- Default badge (conditional)
|       +-- Name, description, platform icons, pipeline count
|       +-- DropdownMenu (Edit, Duplicate, Set as Default, Delete)
|       +-- Edit button in footer
+-- EmptyState or no-results
```

### Responsive Behavior

Same as Pipeline List / Style Library.

---

## P12. `/brands/new` Create Brand

### Layout Description

Single-page form with sectioned layout, centered at max-width 672px (`max-w-2xl`).

**Regions:**
1. **Back-link** + Title
2. **Identity section** -- Name, description, voice/tone, target audience, perspective
3. **Vocabulary section** -- Words to use, words to avoid, emoji usage, content guidelines
4. **Connected platforms section** -- List of connected accounts + "Link Platform Account" button
5. **Bottom action bar** -- Cancel + Save buttons

### Component Hierarchy

```
BrandFormPage (view: /web/src/views/brand-form/ui/brand-form-page.tsx)
+-- Back-link to ROUTES.BRANDS
+-- Header (title + subtitle)
+-- Identity section
|   +-- SectionHeader "Identity"
|   +-- FormField x5 (Input, Textarea, Textarea, Textarea, Select)
+-- Vocabulary section
|   +-- SectionHeader "Vocabulary"
|   +-- FormField x2 (Textarea for words to use/avoid)
|   +-- Emoji usage radio pill group
|   +-- FormField (Textarea for guidelines)
+-- Connected Platforms section
|   +-- SectionHeader "Connected Platforms"
|   +-- Platform rows (icon + account name)
|   +-- Button "Link Platform Account"
+-- Bottom action bar (Cancel + Save)
```

### Responsive Behavior

Form is always single-column at max-w-2xl. Responsive adjustments are minimal:
- Emoji pills wrap naturally with `flex-wrap`
- Bottom action bar stays right-aligned

---

## P13. `/brands/[id]` Brand Detail

### Layout Description

Same layout as Create Brand (`BrandFormPage`), with the `id` prop triggering edit mode. Pre-populated form fields. Overflow menu in header with Duplicate/Set as Default/Delete actions.

### Component Hierarchy

Same as P12 but with `isEdit = true`, populating fields from existing brand data. Title changes from "Create New Brand" to the brand's name.

---

## P14. `/content` Content Library

### Layout Description

Standard Library Pattern with richer filter bar (format, platform, status).

**Regions:**
1. **Header** -- `PageHeader` with "Content Library" (no create action -- content comes from pipelines)
2. **Filter bar** -- Search + format Select + platform Select + status Select
3. **Card grid** -- Responsive grid of `ContentCard` components
4. **Empty state** -- Directs user to Pipelines to generate content

### Component Hierarchy

```
ContentPage (view: /web/src/views/content/ui/content-page.tsx)
+-- PageHeader (shared/ui) -- title only, no action
+-- Filter bar
|   +-- Input with Search prefix
|   +-- Select format (All, Thread, Post, Newsletter, Video Script, Carousel)
|   +-- Select platform (All, X, LinkedIn, YouTube, Instagram, Newsletter)
|   +-- Select status (All, Published, Draft, Scheduled)
+-- Card grid
|   +-- ContentCard (widget: /web/src/widgets/content-library/ui/content-card.tsx) x N
|       +-- Format icon + label
|       +-- Title
|       +-- Platform Badge + status text
|       +-- Published date
|       +-- Pipeline name
|       +-- Actions: View (ExternalLink), Export (Download), Analytics (BarChart3)
+-- EmptyState directing to Pipelines
```

### Responsive Behavior

Same as Pipeline List. Filter bar wraps on mobile with each select on its own row.

---

## P15. `/trends` Trends Dashboard

### Layout Description

Ranked list layout with filter controls at top, topic rows in middle, lifecycle legend at bottom.

**Regions:**
1. **Header** -- `PageHeader` with "Trend Explorer"
2. **Filter bar** -- Niche Select + time range Select
3. **Topic list** -- Ranked card rows (each row: rank number + topic name + lifecycle badge + source badge + score bar + action buttons)
4. **Lifecycle legend** -- Explanatory card at the bottom

### Component Hierarchy

```
TrendsPage (view: /web/src/views/trends/ui/trends-page.tsx)
+-- PageHeader (shared/ui)
+-- Filter bar
|   +-- Select niche (All, SaaS, AI/ML, Dev Tools, Content Marketing)
|   +-- Select time range (24h, 3 days, 1 week)
+-- Topic list
|   +-- Card per topic
|       +-- Rank number (text-xl font-bold)
|       +-- Topic name + LifecycleBadge (entity)
|       +-- Source Badge
|       +-- Progress bar (score)
|       +-- Button "Create Content" > Link to ROUTES.PIPELINE_NEW
|       +-- Button "Save" (bookmark)
+-- Lifecycle legend Card
    +-- 4-column grid explaining Emerging, Rising, Peak, Declining
```

### Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| **sm+** | Topic rows: horizontal layout with rank, name, badges, score, actions in one row |
| **<sm** | Topic rows: stack vertically within the card. Name + badge on one row, score + actions below. |
| **lg+** | Legend: 4-column grid |
| **<lg** | Legend: 2-column grid |

---

## P16. `/settings/*` Settings

### Layout Description

Shell layout with sub-navigation + content area. Three sub-pages.

**Shell (`/settings`):**
1. **Header** -- `PageHeader` with "Settings"
2. **Two-column body (md+)** -- Left: vertical nav list (192px, `w-48`). Right: content area (flex-1).
3. **Mobile:** Horizontal scrollable tab bar replacing the left nav.

### Component Hierarchy

```
SettingsLayout (widget: /web/src/widgets/settings/ui/settings-layout.tsx)
+-- PageHeader (shared/ui)
+-- Mobile tabs (ScrollArea with nav links)
+-- Desktop two-column
    +-- Left nav (ul > li > Link per item)
    |   +-- Platforms (Link2 icon)
    |   +-- AI Models (Brain icon)
    |   +-- Defaults (SlidersHorizontal icon)
    +-- Right content area (children)
```

**Sub-page: Platforms (`/settings/platforms`):**

```
SettingsPlatformsPage (view: /web/src/views/settings-platforms/ui/settings-platforms-page.tsx)
+-- Section "Connected Platforms"
|   +-- ConnectedPlatformCard x N
|       +-- PlatformIcon (colored bg + icon)
|       +-- Account name, connected date, permissions
|       +-- Button "Disconnect" (destructive outline)
+-- Separator
+-- Section "Available Platforms"
    +-- AvailablePlatformCard x N
        +-- PlatformIcon
        +-- Platform name, description
        +-- Button "Connect" or Badge "Coming Soon"
```

**Sub-page: AI Models (`/settings/models`):**

```
SettingsModelsPage (view: /web/src/views/settings-models/ui/settings-models-page.tsx)
+-- Section header "AI Models"
+-- ModelSelectorRow x4 (Writing, Transcription, Voice, Image)
    +-- Card with icon + label + Select dropdown + CostBadge
```

**Sub-page: Defaults (`/settings/defaults`):**

```
SettingsDefaultsPage (view: /web/src/views/settings-defaults/ui/settings-defaults-page.tsx)
+-- Section header "Defaults"
+-- Card: Default Brand (Select)
+-- Card: Default Style Profile (Select)
+-- Card: Default Approval Mode (RadioOption x3)
+-- Card: Default Output Formats (CheckboxOption x6)
+-- Card: Timezone (Select)
+-- Card: Notification Preferences (ToggleSwitch x3)
```

### Responsive Behavior

| Breakpoint | Settings Shell |
|------------|----------------|
| **md+** | Two-column: 192px left nav + flex-1 content |
| **<md** | Single column: horizontal scrollable tabs above content |

Sub-page content is always single-column within the content area. Cards stack vertically. Model selector rows adapt from horizontal (sm+) to vertical (<sm).

### Key States

| State | Visual |
|-------|--------|
| **All platforms connected** | Only Connected section visible |
| **No platforms** | Only Available section visible |
| **Saving defaults** | Optimistic update on each change, no save button. Toast notification. |
| **OAuth in progress** | Connect button shows loading state. Platform moves to Connected section on success. |

---

## Appendix: Component Inventory

This is the complete list of existing components referenced in this document, organized by FSD layer.

### Shared UI (`/web/src/shared/ui/`)

| Component | File | Usage |
|-----------|------|-------|
| `Button` | `button.tsx` | Primary actions, secondary actions, ghost actions |
| `Card` | `card.tsx` | Content containers (CardHeader, CardTitle, CardAction, CardContent, CardFooter) |
| `Badge` | `badge.tsx` | Status labels, platform badges, category tags |
| `Dialog` | `dialog.tsx` | Confirmation dialogs, modal forms |
| `Tabs` | `tabs.tsx` | Status filters, input type selectors |
| `Select` | `select.tsx` | Dropdowns for filters, model selection, settings |
| `Input` | `input.tsx` | Text inputs, search bars, URL fields |
| `Textarea` | `textarea.tsx` | Multi-line text inputs, content editing |
| `Progress` | `progress.tsx` | Score bars, step progress |
| `Separator` | `separator.tsx` | Section dividers |
| `Skeleton` | `skeleton.tsx` | Loading state placeholders |
| `Tooltip` | `tooltip.tsx` | Icon-only button labels |
| `Popover` | `popover.tsx` | Step selector menu |
| `DropdownMenu` | `dropdown-menu.tsx` | Overflow action menus |
| `ScrollArea` | `scroll-area.tsx` | Mobile settings tabs |
| `Avatar` | `avatar.tsx` | User menu |
| `Checkbox` | `checkbox.tsx` | Bulk select in review queue |
| `Command` | `command.tsx` | Global search palette |
| `Sheet` | `sheet.tsx` | Mobile slide-out panels |
| `PageHeader` | `page-header.tsx` | Page title + Korean subtitle + action button |
| `EmptyState` | `empty-state.tsx` | Icon + title + description + CTA for empty pages |
| `SectionHeader` | `section-header.tsx` | Section title + "View all" link |
| `StatusIndicator` | `status-indicator.tsx` | Icon + label for entity statuses |

### Entities (`/web/src/entities/`)

| Component | File | Usage |
|-----------|------|-------|
| `PipelineCard` | `pipeline/ui/pipeline-card.tsx` | Pipeline list grid items |
| `PipelineCardSkeleton` | `pipeline/ui/pipeline-card-skeleton.tsx` | Loading state |
| `PipelineStatusBadge` | `pipeline/ui/pipeline-status-badge.tsx` | Pipeline status labels |
| `RunStatusBadge` | `pipeline/ui/run-status-badge.tsx` | Run status labels |
| `StyleCard` | `style/ui/style-card.tsx` | Style library grid items |
| `StyleCardSkeleton` | `style/ui/style-card-skeleton.tsx` | Loading state |
| `StyleAttributeBadge` | `style/ui/style-attribute-badge.tsx` | Attribute label-value pills |
| `BrandCard` | `brand/ui/brand-card.tsx` | Brand library grid items |
| `BrandCardSkeleton` | `brand/ui/brand-card-skeleton.tsx` | Loading state |
| `BrandCompactCard` | `brand/ui/brand-compact-card.tsx` | Compact brand card for inline selection |
| `ReviewCard` | `review/ui/review-card.tsx` | Review queue items |
| `FormatIcon` | `review/ui/format-icon.tsx` | Content format icons |
| `LifecycleBadge` | `trend/ui/lifecycle-badge.tsx` | Trend lifecycle stage indicator |
| `TrendTopicPill` | `trend/ui/trend-topic-pill.tsx` | Trend topic display pill |

### Widgets (`/web/src/widgets/`)

| Component | File | Usage |
|-----------|------|-------|
| `AppLayout` | `layout/ui/app-layout.tsx` | Root layout shell (TopBar + Sidebar + main + MobileBottomBar) |
| `TopBar` | `layout/ui/top-bar.tsx` | Fixed header with search, notifications, user menu |
| `Sidebar` | `layout/ui/sidebar.tsx` | Desktop left navigation |
| `SidebarNavItem` | `layout/ui/sidebar-nav-item.tsx` | Individual nav item |
| `MobileBottomBar` | `layout/ui/mobile-bottom-bar.tsx` | Mobile bottom tab bar |
| `GreetingSection` | `dashboard/ui/greeting-section.tsx` | Dashboard greeting + stat cards |
| `PendingReviews` | `dashboard/ui/pending-reviews.tsx` | Dashboard pending review list |
| `QuickStart` | `dashboard/ui/quick-start.tsx` | Dashboard action shortcuts |
| `RecentRuns` | `dashboard/ui/recent-runs.tsx` | Dashboard recent pipeline runs |
| `TrendingTopics` | `dashboard/ui/trending-topics.tsx` | Dashboard trending topic pills |
| `EmptyDashboard` | `dashboard/ui/empty-dashboard.tsx` | First-use dashboard state |
| `DashboardSkeleton` | `dashboard/ui/dashboard-skeleton.tsx` | Dashboard loading state |
| `PipelineListSkeleton` | `pipeline-list/ui/pipeline-list-skeleton.tsx` | Pipeline list loading |
| `StyleLibrarySkeleton` | `style-library/ui/style-library-skeleton.tsx` | Style library loading |
| `BrandLibrarySkeleton` | `brand-library/ui/brand-library-skeleton.tsx` | Brand library loading |
| `BuilderProgress` | `pipeline-builder/ui/builder-progress.tsx` | Pipeline builder step indicator |
| `StepBasics` | `pipeline-builder/ui/step-basics.tsx` | Builder step 1: template + source |
| `StepSteps` | `pipeline-builder/ui/step-steps.tsx` | Builder step 2: step ordering |
| `StepSettings` | `pipeline-builder/ui/step-settings.tsx` | Builder step 3: brand/style/trigger |
| `StepReview` | `pipeline-builder/ui/step-review.tsx` | Builder step 4: summary + actions |
| `ContentCard` | `content-library/ui/content-card.tsx` | Content library grid items |
| `SettingsLayout` | `settings/ui/settings-layout.tsx` | Settings shell with sub-nav |

### Features (`/web/src/features/`)

| Component | File | Usage |
|-----------|------|-------|
| `NotificationBell` | `notifications/ui/notification-bell.tsx` | TopBar notification icon with count |
| `SearchTrigger` | `search/ui/search-command.tsx` | TopBar search bar / command palette trigger |
| `ThemeToggle` | `theme-toggle/ui/theme-toggle.tsx` | TopBar dark/light mode toggle |

---

*This document is the single source of truth for Kova's UX design. All page implementations should reference the layouts, interaction patterns, and state definitions described here. When in doubt, refer back to the design principles in Part 1.*
