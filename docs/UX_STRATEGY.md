# Kova -- UX Strategy & UI Layout Plan

**Comprehensive Design Specification for Implementation**

| | |
|---|---|
| **Version** | 1.0 |
| **Date** | February 2025 |
| **Status** | Draft |
| **Type** | UX Strategy & UI Specification |
| **Audience** | Design, Frontend Engineering, Product |
| **Dependencies** | Product PRD, MVP PRD, Technical PRD |

---

## Table of Contents

1. [Guiding UX Principles](#1-guiding-ux-principles)
2. [Information Architecture](#2-information-architecture)
3. [Navigation & Layout System](#3-navigation--layout-system)
4. [Design System Foundation](#4-design-system-foundation)
5. [Core Screen Layouts](#5-core-screen-layouts)
6. [Interaction Flows](#6-interaction-flows)
7. [Design Patterns & Components](#7-design-patterns--components)
8. [Progressive Disclosure Strategy](#8-progressive-disclosure-strategy)
9. [Mobile Strategy](#9-mobile-strategy)
10. [Accessibility](#10-accessibility)

---

## 1. Guiding UX Principles

These five principles govern every design decision. When in doubt, apply them in order.

### Principle 1: One Goal Per Screen

Every screen has exactly one primary action. If a user cannot identify what to do within 3 seconds, the screen has failed. Secondary actions exist but never compete visually with the primary action.

**Application:** The Pipeline Builder's primary action is "Run" or "Save." The Style Library's primary action is "Create New Style." The Dashboard's primary action is "Start a new pipeline" (for new users) or "Review pending items" (for active users).

### Principle 2: Complexity Is Earned, Not Given

New users see the simplest possible version of every feature. Advanced options reveal themselves as the user demonstrates readiness through usage, not through toggle switches or "Advanced Mode" buttons. The system starts simple and grows with the user.

**Application:** A first-time pipeline builder sees 3 templates and a "Quick Start" flow. After 5 successful runs, they see the full step editor. AI model selection is hidden until a user explicitly seeks it out in Settings.

### Principle 3: Show Progress, Not Process

Users care about outcomes, not internal mechanics. Show what has been accomplished and what remains -- not how the system is accomplishing it. Pipeline execution shows "Script written" and "Thread ready for review," not "Step 3 of 7: LLMProvider.generate() executing."

**Application:** Pipeline run views show content previews as they become available, not a technical log. Error states describe what the user can do, not what went wrong internally.

### Principle 4: Never Leave the User Stranded

Every state has a clear next action. Empty states tell the user what to do. Error states offer a path forward. Loading states set expectations. Dead ends do not exist.

**Application:** An empty Style Library shows "Create your first style profile -- paste a URL to content you admire." A failed pipeline step shows "This step encountered an issue. Retry with different settings, or skip to continue."

### Principle 5: Respect Existing Mental Models

Users already understand feeds, cards, folders, and timelines. Kova does not invent new interaction paradigms. Pipelines look like step-by-step forms. Style profiles look like profile cards. Content outputs look like social media previews. The interface feels familiar even on the first visit.

**Application:** The thread preview looks like an actual X/Twitter thread. The LinkedIn post preview looks like a LinkedIn post. Content is previewed in the format it will be published, not in a generic text editor.

---

## 2. Information Architecture

### 2.1 Site Map

```
Kova
|
+-- Dashboard (/)
|   Home screen. Activity feed, pending reviews, quick actions.
|
+-- Pipelines (/pipelines)
|   +-- Pipeline List (/pipelines)
|   |   All saved pipelines with run history summary.
|   +-- Pipeline Builder (/pipelines/new, /pipelines/:id/edit)
|   |   Create or edit a pipeline configuration.
|   +-- Pipeline Run View (/pipelines/:id/runs/:runId)
|       Live execution progress and step outputs.
|
+-- Review (/review)
|   +-- Review Queue (/review)
|   |   All items awaiting human approval, across all pipelines.
|   +-- Review Detail (/review/:runId/:stepId)
|       Single review item with editing, approve/reject.
|
+-- Styles (/styles)
|   +-- Style Library (/styles)
|   |   Browse and manage all style profiles.
|   +-- Style Profile Detail (/styles/:id)
|   |   View/edit a single profile's attributes.
|   +-- Create Style (/styles/new)
|       Input reference content, see extracted style.
|
+-- Content (/content)
|   +-- Content Library (/content)
|       All generated content across all runs, filterable by format/platform/date.
|
+-- Trends (/trends)
|   +-- Trend Explorer (/trends)
|       Browse trending topics in configured niches.
|
+-- Settings (/settings)
    +-- Platforms (/settings/platforms)
    |   OAuth connections for X, YouTube, Instagram, etc.
    +-- Brand (/settings/brand)
    |   Brand name, voice, tone, audience, guidelines.
    +-- AI Models (/settings/models)
    |   Select which AI model powers each task.
    +-- Defaults (/settings/defaults)
        Default pipeline settings, approval preferences, scheduling.
```

### 2.2 Feature Grouping Logic

Features are grouped by user intent, not by technical domain:

| Group | User Intent | Contains |
|---|---|---|
| **Dashboard** | "What needs my attention?" | Activity feed, pending reviews, recent runs, quick actions |
| **Pipelines** | "I want to create or run content" | Builder, templates, run history, live execution |
| **Review** | "I need to approve or edit something" | Review queue, inline editing, approve/reject |
| **Styles** | "I want to define how my content is structured" | Style library, profile creation, reference analysis |
| **Content** | "I want to see what was created" | All generated content, export, republish |
| **Trends** | "I want to know what's trending" | Trend topics, lifecycle stages, niche signals |
| **Settings** | "I want to configure my account" | Platforms, brand, AI models, defaults |

### 2.3 Navigation Priority

**Primary navigation** (always visible): Dashboard, Pipelines, Review, Styles, Content

**Secondary navigation** (accessible but not prominent): Trends, Settings

**Tertiary** (contextual, appears within primary screens): Pipeline Builder sub-steps, Style Profile tabs, Settings sub-pages

### 2.4 Information Density Tiers

| Tier | Screens | Density | Rationale |
|---|---|---|---|
| **Scan** | Dashboard, Pipeline List, Review Queue | Low -- cards, summaries, status badges | Users are browsing, deciding what to engage with |
| **Focus** | Pipeline Run, Review Detail, Style Profile | Medium -- panels, previews, inline actions | Users are working on a specific item |
| **Configure** | Pipeline Builder, Settings, Create Style | Medium-high -- forms, options, toggles | Users are making decisions about how things work |

---

## 3. Navigation & Layout System

### 3.1 Global Layout Structure

The application uses a **sidebar + main content** layout on desktop and a **bottom tab bar + full-screen content** layout on mobile.

```
Desktop (1024px+):
+--------------------------------------------------+
| Top Bar (48px)                                   |
| [Logo] .............. [Search] [Notifications] [Avatar] |
+--------+-----------------------------------------+
| Side   |                                         |
| bar    |  Main Content Area                      |
| (220px)|                                         |
|        |                                         |
| [Dash] |                                         |
| [Pipe] |                                         |
| [Rev]  |                                         |
| [Style]|                                         |
| [Cont] |                                         |
|        |                                         |
| ----   |                                         |
| [Trend]|                                         |
| [Set]  |                                         |
+--------+-----------------------------------------+

Mobile (<768px):
+--------------------------------------------------+
| Top Bar (48px)                                   |
| [Back/Menu] [Page Title] [Actions]               |
+--------------------------------------------------+
|                                                  |
|  Full-Screen Content Area                        |
|                                                  |
|                                                  |
+--------------------------------------------------+
| Bottom Tab Bar (56px)                            |
| [Dash] [Pipes] [+New] [Review] [More]           |
+--------------------------------------------------+
```

### 3.2 Sidebar Design (Desktop)

**Width:** 220px collapsed to 64px (icon-only). User preference persists.

**Structure:**
- Top: Kova logo (links to Dashboard)
- Primary section: Dashboard, Pipelines, Review (with unread badge), Styles, Content
- Divider line
- Secondary section: Trends, Settings
- Bottom: User avatar with dropdown (profile, logout)

**Active state:** Background highlight + left border accent. Icon and label both change color.

**Collapsed state:** Icons only. Hover reveals tooltip with label. Expanding is a smooth 200ms slide animation.

### 3.3 Top Bar Design

**Height:** 48px fixed.

**Contents:**
- Left: Logo (desktop) or back arrow / hamburger (mobile)
- Center: Page title (mobile only)
- Right: Global search (desktop), Notification bell with unread count, User avatar

**Notifications dropdown:** Lists recent events -- "Pipeline completed," "Content ready for review," "Style profile created." Each links to the relevant screen. Unread items marked with a dot. "Mark all read" action at top.

### 3.4 Breadcrumb Strategy

Breadcrumbs appear on all pages deeper than the top-level navigation items. They sit directly below the top bar, above the page content.

**Format:** `Pipelines > My Weekly Thread Pipeline > Run #47`

**Rules:**
- Maximum 3 levels displayed. Deeper nesting truncates the middle with "..."
- Each segment is a clickable link except the current page
- On mobile, breadcrumbs collapse to a single "Back" arrow that returns to the parent

### 3.5 Quick Actions

A floating action button (FAB) on the Dashboard provides the three most common starting points:

1. **New Pipeline** -- opens Pipeline Builder with template selection
2. **Quick Run** -- opens a minimal dialog: topic + style + "Run" (creates and runs a default pipeline)
3. **New Style** -- opens the Create Style flow

On desktop, the FAB is replaced by a prominent "New" button in the top-right of the sidebar, which opens the same three options as a dropdown.

### 3.6 Global Search

Desktop only. Activated by clicking the search icon or pressing `/` (keyboard shortcut).

**Searches across:** Pipeline names, style profile names, content titles, trend topics.

**Results grouped by type:** Pipelines, Styles, Content, Trends. Each result shows a brief excerpt and links to the relevant detail page.

**Empty state:** "No results found. Try a different search term."

---

## 4. Design System Foundation

### 4.1 Grid System

**Base unit:** 4px. All spacing, sizing, and positioning use multiples of 4px.

**Layout grid:**
- Desktop (1024px+): 12-column grid, 24px gutters, 32px margins
- Tablet (768px-1023px): 8-column grid, 20px gutters, 24px margins
- Mobile (<768px): 4-column grid, 16px gutters, 16px margins

**Content max-width:** 1200px (centered within the main content area beyond the sidebar).

### 4.2 Spacing Scale

| Token | Value | Usage |
|---|---|---|
| `space-xs` | 4px | Inline spacing between icon and label |
| `space-sm` | 8px | Spacing within compact components (badge padding) |
| `space-md` | 12px | Default intra-component spacing (form field gap) |
| `space-lg` | 16px | Spacing between related components |
| `space-xl` | 24px | Spacing between sections |
| `space-2xl` | 32px | Page section dividers |
| `space-3xl` | 48px | Major page sections |

### 4.3 Typography Scale

Based on a 1.25 ratio scale from a 16px base. Font family: Inter (body), JetBrains Mono (code/data).

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `text-xs` | 12px | 400 | 16px | Captions, timestamps, tertiary labels |
| `text-sm` | 14px | 400 | 20px | Secondary text, descriptions, form hints |
| `text-base` | 16px | 400 | 24px | Body text, form inputs, list items |
| `text-lg` | 20px | 500 | 28px | Card titles, section headers |
| `text-xl` | 24px | 600 | 32px | Page titles |
| `text-2xl` | 30px | 700 | 36px | Dashboard headline numbers |
| `text-3xl` | 36px | 700 | 40px | Hero/onboarding headings |

### 4.4 Color System

**Neutral palette** (light mode baseline, dark mode inverts):

| Token | Light | Dark | Usage |
|---|---|---|---|
| `bg-primary` | white (#FFFFFF) | gray-950 (#0A0A0F) | Page background |
| `bg-secondary` | gray-50 (#F8F9FA) | gray-900 (#111118) | Card backgrounds, sidebar |
| `bg-tertiary` | gray-100 (#F1F3F5) | gray-800 (#1C1C27) | Hover states, wells |
| `text-primary` | gray-900 (#111118) | gray-50 (#F8F9FA) | Headings, primary text |
| `text-secondary` | gray-600 (#5C5F66) | gray-400 (#9CA3AF) | Descriptions, secondary text |
| `text-tertiary` | gray-400 (#9CA3AF) | gray-600 (#5C5F66) | Captions, placeholders |
| `border-default` | gray-200 (#E5E7EB) | gray-700 (#2D2D3A) | Card borders, dividers |
| `border-subtle` | gray-100 (#F1F3F5) | gray-800 (#1C1C27) | Subtle separators |

**Brand color:**

| Token | Value | Usage |
|---|---|---|
| `brand-500` | #6366F1 (Indigo) | Primary buttons, active states, links |
| `brand-600` | #4F46E5 | Button hover |
| `brand-700` | #4338CA | Button active/pressed |
| `brand-100` | #E0E7FF | Brand tinted backgrounds |
| `brand-50` | #EEF2FF | Lightest brand tint |

**Semantic colors:**

| Token | Value | Usage |
|---|---|---|
| `success` | #10B981 (Emerald-500) | Completed states, approvals, connected |
| `warning` | #F59E0B (Amber-500) | Waiting states, caution |
| `error` | #EF4444 (Red-500) | Failed states, rejections, destructive actions |
| `info` | #3B82F6 (Blue-500) | Informational badges, tips |

**Platform colors** (used only for platform icons and connection badges):

| Platform | Color | Usage |
|---|---|---|
| X / Twitter | #000000 | Platform icon, connection status |
| YouTube | #FF0000 | Platform icon, connection status |
| Instagram | #E4405F | Platform icon, connection status |
| LinkedIn | #0A66C2 | Platform icon, connection status |
| Reddit | #FF4500 | Platform icon, connection status |
| WordPress | #21759B | Platform icon, connection status |

### 4.5 Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 4px | Badges, small elements |
| `radius-md` | 8px | Cards, inputs, buttons |
| `radius-lg` | 12px | Modals, popovers |
| `radius-xl` | 16px | Large cards, panels |
| `radius-full` | 9999px | Avatars, pills, circular buttons |

### 4.6 Shadows

| Token | Value | Usage |
|---|---|---|
| `shadow-sm` | 0 1px 2px rgba(0,0,0,0.05) | Subtle lift (cards at rest) |
| `shadow-md` | 0 4px 6px rgba(0,0,0,0.07) | Elevated elements (dropdowns) |
| `shadow-lg` | 0 10px 15px rgba(0,0,0,0.1) | Floating elements (modals, popovers) |
| `shadow-xl` | 0 20px 25px rgba(0,0,0,0.12) | Overlay panels |

### 4.7 Iconography

Use Lucide icons (open-source, consistent, pairs well with shadcn-ui). All icons are 20px by default, 16px in compact contexts, 24px for emphasis.

**Icon usage rules:**
- Navigation items: icon + label (expanded sidebar), icon only (collapsed sidebar)
- Buttons: icon-only for familiar actions (close, edit, delete), icon + label for less obvious actions
- Status indicators: icon + text label for accessibility; never color alone

### 4.8 Motion and Animation

**Principles:**
- Motion communicates, never decorates. Every animation answers "What changed?"
- Duration: 150ms for micro-interactions (hover, toggle), 200ms for reveals (dropdown, expand), 300ms for transitions (page, modal).
- Easing: `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for position changes.
- Reduced motion: respect `prefers-reduced-motion`. Replace animations with instant state changes.

**Standard transitions:**
- Sidebar expand/collapse: 200ms width slide
- Modal open: 200ms fade + scale from 95%
- Dropdown: 150ms fade + 4px slide down
- Page transition: 150ms fade (content area only, navigation stays)
- Card hover lift: 150ms translateY(-2px) + shadow-md
- Notification toast: 300ms slide in from right, auto-dismiss after 5s

---

## 5. Core Screen Layouts

### 5.1 Dashboard / Home

**URL:** `/`

**User goal:** Understand current state at a glance and decide what to do next.

**Layout:**

```
+----------------------------------------------------------+
| Greeting Section (full width)                            |
| "Good morning, Sarah" + quick summary stats              |
+----------------------------------------------------------+
|                                                          |
| +-- Pending Reviews (left 60%) --+  +-- Quick Start --+ |
| | Card: "Thread draft ready"     |  | [New Pipeline]  | |
| | Card: "LinkedIn post waiting"  |  | [Quick Run]     | |
| | Card: "Script needs approval"  |  | [New Style]     | |
| | [View all N items]             |  |                 | |
| +--------------------------------+  +-----------------+ |
|                                                          |
| +-- Recent Pipeline Runs (full width) ----------------+ |
| | Run card | Run card | Run card | Run card           | |
| | [View all]                                          | |
| +-----------------------------------------------------+ |
|                                                          |
| +-- Trending in Your Niche (full width) --------------+ |
| | Topic pill | Topic pill | Topic pill | [Explore]    | |
| +-----------------------------------------------------+ |
+----------------------------------------------------------+
```

**Sections (top to bottom):**

1. **Greeting bar** -- Personalized greeting with time-of-day awareness. Displays 3 summary stats: "N items to review," "N pipelines ran today," "N pieces published this week." Each stat is clickable, linking to the relevant list view.

2. **Pending Reviews** -- The most urgent section. Shows cards for each pipeline output awaiting human approval. Each card shows: format icon (thread, post, video), content preview (first 100 characters), pipeline name, time waiting. Clicking opens the Review Detail screen. If no pending reviews, this section shows a calm "All caught up" state with a subtle checkmark.

3. **Quick Start** -- Three large buttons stacked vertically (on the right side of pending reviews, or full width on mobile). "New Pipeline" (brand color, primary), "Quick Run" (secondary), "New Style" (secondary). Each opens its respective flow.

4. **Recent Pipeline Runs** -- Horizontal scrollable row of run cards. Each card shows: pipeline name, status badge (running/completed/failed), format icons for outputs, timestamp. Clicking opens the Pipeline Run View.

5. **Trending Topics** -- A row of topic pills from Trend Intelligence. Each pill shows the topic name and a lifecycle badge (emerging, rising, peak). Clicking a pill opens a "Quick Run" dialog pre-filled with that topic. "Explore" link opens the full Trend Explorer.

**Empty state (new user, no activity):**

The entire dashboard simplifies to a single onboarding card:
```
+----------------------------------------------------------+
| Welcome to Kova                                          |
|                                                          |
| Create content that sounds like you,                     |
| published everywhere, automatically.                     |
|                                                          |
| Step 1: Create your voice     [ Start ]                  |
|   Paste a link to content you admire.                    |
|   Kova learns how it sounds.                             |
|                                                          |
| Step 2: Build a pipeline      [ Browse Templates ]       |
|   Choose a workflow template.                            |
|   Customize the steps.                                   |
|                                                          |
| Step 3: Run it                [ Skip to Quick Run ]      |
|   Type a topic and go.                                   |
+----------------------------------------------------------+
```

**Loading state:** Skeleton cards in each section -- gray rectangles pulsing where content will appear. Stats show "--" placeholders.

**Error state:** If API fails, show a subtle inline error within the affected section (not a full-page error). "Could not load recent runs. [Retry]" Other sections remain functional.

**Mobile:** Sections stack vertically. Pending Reviews becomes a compact list (no grid). Quick Start moves to a floating action button. Trending Topics becomes a horizontally scrollable chip row.

---

### 5.2 Pipeline Builder

**URL:** `/pipelines/new` (create), `/pipelines/:id/edit` (edit)

**User goal:** Configure a content workflow and either run it immediately or save it for later use.

**Layout:**

```
+----------------------------------------------------------+
| Header                                                   |
| [Back] Pipeline Builder          [Save Draft] [Run]      |
+----------------------------------------------------------+
| Progress Indicator                                       |
| (1) Basics --- (2) Steps --- (3) Settings --- (4) Review |
+----------------------------------------------------------+
|                                                          |
|  Current Step Content (single-column, max-width 680px)   |
|                                                          |
|  [Form fields for current step]                          |
|                                                          |
|                                                          |
|                            [Back]  [Continue]            |
+----------------------------------------------------------+
```

The builder is a **multi-step form**, not a single-page configuration. This reduces cognitive load by presenting one category of decisions at a time.

**Step 1: Basics**

Purpose: Name the pipeline, choose a starting point.

Fields:
- **Pipeline name** -- text input, placeholder "My content pipeline," auto-generated if left empty
- **Template** -- card grid showing 4-6 templates. Each template card shows: icon, name, description (1 line), list of steps included. Templates:
  - "Topic to Everything" -- Idea > Research > Script > Transform (all formats) > Deploy
  - "URL to Everything" -- Reference analysis > Script > Transform > Deploy
  - "YouTube to Clips + Social" -- Transcribe > Video Clip > Transform > Deploy
  - "Blog to Social" -- Analyze source > Transform (thread + post) > Deploy
  - "Trend-Powered Daily" -- Trend analysis > Idea > Script > Transform > Deploy
  - "Blank" -- Start with no steps
- **Source type** (shown after template selection) -- radio group: "Topic/Idea," "URL," "Uploaded file," "Pasted text"
- **Source input** -- context-dependent field: text input for topic, URL input for URL, file dropzone for upload, textarea for pasted text

Selecting a template pre-fills Steps 2 and 3 with sensible defaults. User can modify.

**Step 2: Steps**

Purpose: Configure which pipeline steps run and in what order.

Layout: An ordered list of step cards. Each card shows:
- Step icon + name (e.g., "Idea Generator," "Script Writer")
- Brief description of what it does
- Expand/collapse toggle for step-specific settings
- Drag handle (post-MVP; for MVP, up/down arrow buttons)
- Remove button (X)

Below the list:
- "Add Step" button opens a dropdown of available steps grouped by category:
  - **Generate:** Idea Generator, Research Agent, Script Writer
  - **Refine:** Content Editor, SEO Optimizer, Hashtag Generator, Visual Agent
  - **Transform:** Multi-Format Transform (then select which formats)
  - **Review:** Human Review Gate
  - **Publish:** Deploy to Platforms

When expanded, each step shows its configuration:
- **Idea Generator:** Number of ideas (1-5), creativity level (slider: conservative to experimental)
- **Script Writer:** Target length (short/medium/long), structure preference (freeform, numbered, sectioned)
- **Content Editor:** Edit intensity (light/moderate/thorough), focus (clarity, engagement, SEO, all)
- **Multi-Format Transform:** Checkboxes for each format (Thread, Post, Newsletter, Video Script, Carousel, Podcast, Reddit, Short Video, Video Shorts). Selecting multiple creates fan-out branches.
- **Human Review Gate:** Position label ("Review before publishing," "Review after writing")
- **Deploy:** Platform checkboxes (only connected platforms shown; unconnected platforms show "Connect in Settings" link)

**Default for templates:** Steps are pre-configured. User sees them listed and can expand to modify, remove, or reorder.

**Step 3: Settings**

Purpose: Configure how the pipeline behaves.

Fields:
- **Style Profile** -- dropdown of saved styles + "None" + "Create new" link. Shows a mini-preview of the selected profile (3 key attributes: hook pattern, content structure, section pacing).
- **Trigger** -- radio group:
  - "Run once" (default) -- execute immediately or on demand
  - "Schedule" -- reveals cron configuration:
    - Frequency: Daily, Weekdays, Weekly, Custom
    - Time picker (with timezone)
    - Start date (defaults to today)
- **Approval mode** (visible when schedule is selected) -- radio group:
  - "Full autopilot" -- no human review
  - "Review before publish" -- queue for review, then deploy
  - "Per-platform" -- reveals per-platform toggle (auto/review)
- **AI Model** (collapsed by default, "Advanced" section) -- dropdown per task type. Defaults shown. Only appears if user has expanded it before or has more than 10 pipeline runs.

**Step 4: Review**

Purpose: Confirm everything before running.

Layout: A summary card showing:
- Pipeline name
- Source type and input preview
- Steps listed in order (with brief config summary per step)
- Style profile name (or "None")
- Trigger type (once or scheduled with cron)
- Approval mode
- Target platforms

Two primary actions: **"Save & Run"** (brand color, prominent) and **"Save as Template"** (secondary). If scheduled, primary button reads **"Save & Activate Schedule."**

**Empty state:** Only relevant for Step 2 when using the "Blank" template. Shows: "Your pipeline has no steps yet. Add your first step to get started. [Add Step]"

**Loading state:** Template cards show skeleton. After template selection, step list pre-fills with a brief loading shimmer.

**Error state:** Inline validation on each step. If a required field is missing, the progress indicator marks that step with a warning dot. Attempting to proceed shows the specific field error inline below the field.

**Mobile:** The multi-step form works naturally on mobile. Each step is full-screen. Progress indicator becomes a compact "Step 2 of 4" label. Cards stack vertically. Step configuration uses full-width selectors.

---

### 5.3 Pipeline Run View

**URL:** `/pipelines/:id/runs/:runId`

**User goal:** Monitor a running pipeline's progress and access outputs as they become available.

**Layout:**

```
+----------------------------------------------------------+
| Header                                                   |
| [Back] Run: "My Weekly Thread"       [Pause] [Cancel]    |
| Status: Running -- Step 3 of 6                           |
+----------------------------------------------------------+
|                                                          |
| Progress Timeline (vertical, left-aligned)               |
|                                                          |
| [done] Idea Generation ............. 12s                 |
|        "Why most developers waste time on..."            |
|                                                          |
| [done] Research ...................  28s                  |
|        3 key points identified                           |
|                                                          |
| [>>>]  Script Writing .............. ~45s remaining      |
|        ||||||||||||||||||........... 62%                  |
|                                                          |
| [wait] Multi-Format Transform                            |
|        Thread + LinkedIn + Newsletter                    |
|                                                          |
| [wait] Human Review                                      |
|                                                          |
| [wait] Deploy to X, LinkedIn                             |
|                                                          |
+----------------------------------------------------------+
| Output Preview (appears as steps complete)               |
| +------------------------------------------------------+ |
| | Tab: Script | Tab: Thread | Tab: LinkedIn | Tab: ... | |
| |                                                      | |
| | [Content preview of selected tab]                    | |
| |                                                      | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
```

**Sections:**

1. **Header bar** -- Pipeline name, overall status badge (pending/running/waiting/completed/failed), current step indicator ("Step 3 of 6"). Actions: Pause (if running), Cancel (always available during execution), Retry (if failed).

2. **Progress timeline** -- Vertical step list, each step showing:
   - Status icon: checkmark (done), animated spinner (running), clock (waiting), warning triangle (failed), user icon (human gate)
   - Step name
   - Duration (completed) or estimated time remaining (running) or blank (waiting)
   - One-line summary of output (completed) or progress bar with percentage (running)
   - Steps in "done" state are collapsible. Clicking expands to show the full output preview inline.

3. **Output preview panel** -- Appears below the timeline once at least one generation step completes. Uses tabs for different output formats. Each tab shows the content in a format-appropriate preview:
   - **Script/Article:** Rendered text with headings, paragraphs
   - **Thread:** Stacked post cards, each showing character count
   - **LinkedIn post:** Single card with LinkedIn-style formatting
   - **Newsletter:** Email-style layout with sections
   - **Video script:** Scene-by-scene with visual cues highlighted
   - **Carousel:** Slide-by-slide horizontal scroll

**Real-time updates (SSE):**
- Progress bar animates smoothly as percentage updates arrive (every 2 seconds)
- Completed steps slide into "done" state with a brief checkmark animation (200ms)
- New output tabs appear with a subtle highlight to draw attention
- Status badge in header updates in real-time

**Human gate state:**
When pipeline reaches a human gate, the timeline step becomes prominent:
```
| [user] Human Review -- Your input needed              |
|        [Review & Approve]                             |
```
The "Review & Approve" button navigates to the Review Detail screen. A notification is also sent.

**Fan-out visualization:**
When a transform step fans out, the timeline shows branching:
```
| [done] Multi-Format Transform                         |
|   +-- [done] Thread (12 posts)                        |
|   +-- [done] LinkedIn post                            |
|   +-- [>>>]  Newsletter (writing...)                  |
|   +-- [done] Video script                             |
```
Each branch shows its own status independently.

**Completed state:** All steps show checkmarks. Header status reads "Completed." A success banner appears: "All content generated. [View in Content Library]" or, if deployment was included: "Published to X and LinkedIn. [View published content]"

**Failed state:** The failed step shows a red warning icon with the error summary (user-friendly language, not stack traces). Actions: "Retry this step," "Skip and continue," "Edit step settings and retry." Other completed steps remain accessible.

**Loading state:** Initial load shows the timeline with all steps in "waiting" state, then the first step transitions to "running" as the SSE connection establishes.

**Mobile:** Timeline becomes a compact vertical list. Output preview moves to a bottom sheet or full-screen view triggered by tapping a completed step. Pause/Cancel actions move to a "..." overflow menu.

---

### 5.4 Human Review Screen

**URL:** `/review/:runId/:stepId`

**User goal:** Evaluate AI-generated content, optionally edit it, then approve or reject.

**Layout:**

```
+----------------------------------------------------------+
| Header                                                   |
| [Back to Queue] Review: Thread Draft    [Reject] [Approve]|
| Pipeline: "My Weekly Thread" -- Step 4 of 6               |
+----------------------------------------------------------+
|                                                          |
| +-- Context Panel (left 35%) --+ +-- Output Panel (65%) |
| |                              | |                      |
| | Source / Previous Step       | | Generated Content    |
| |                              | |                      |
| | "Original topic:            | | [Format selector]    |
| |  Why most developers..."    | | Thread | Post | ...   |
| |                              | |                      |
| | Style Profile Applied:      | | [Editable content]   |
| |  "Sarah's Tech Voice"       | |                      |
| | Tone: Casual authority       | | Post 1/12:           |
| | Hook: Personal story         | | "I wasted 3 months   |
| |                              | | on premature..."     |
| |                              | |                      |
| | Pipeline Context:           | | Post 2/12:           |
| | Step 3 output (script)      | | "Here's what nobody  |
| | [Expand to view]            | | tells you about..."  |
| |                              | |                      |
| +------------------------------+ +----------------------+|
|                                                          |
| +-- Actions Bar (full width, sticky bottom) ------------+|
| | [Reject with Feedback]    [Skip]    [Approve & Continue]|
| +--------------------------------------------------------+|
+----------------------------------------------------------+
```

**Sections:**

1. **Context panel (left, 35% width):** Read-only reference information.
   - Source content: the original topic, URL, or pasted text that started the pipeline
   - Style profile summary: name + 3 key attributes (hook pattern, structure, pacing)
   - Previous step output: collapsible section showing the script/draft that was transformed
   - This panel scrolls independently from the output panel

2. **Output panel (right, 65% width):** The AI-generated content, editable.
   - **Format selector tabs** at the top if the review covers multiple formats (thread + post + newsletter). Each tab shows its format.
   - **Content area:** The generated content rendered in a format-appropriate way:
     - **Thread:** Each post in its own editable card with character counter (turns red above 280). Posts are numbered. User can edit text inline, reorder posts (up/down arrows), delete individual posts, or add a new post.
     - **Post (LinkedIn/Instagram):** Single editable text area with character count and formatting toolbar (bold, italic, line breaks).
     - **Newsletter:** Editable sections with headings. WYSIWYG-lite (headers, bold, italic, links).
     - **Video script:** Scene blocks with "Visual" and "Audio/Narration" columns, each editable.
     - **Carousel:** Slide cards in a horizontal arrangement. Each slide's text is editable.
   - Edits are auto-saved locally (not persisted to server until approve).

3. **Actions bar (sticky bottom):**
   - **Reject with Feedback** (left, red outline) -- opens a text field for feedback. The feedback is sent to the AI for retry. After reject, pipeline re-runs the previous generation step with the feedback injected.
   - **Skip** (center, neutral) -- skips this format/output without approving or rejecting. Pipeline continues. Content is not deployed.
   - **Approve & Continue** (right, brand color, primary) -- accepts the content (including any edits). Pipeline proceeds to the next step.

**Bulk review mode:** When reviewing fan-out outputs (multiple formats), a "Bulk Actions" bar appears above the format tabs: "Approve All" and "Select formats to approve" (checkboxes per format).

**Comparison view (post-MVP):** When the step generated multiple variations, a toggle switches to side-by-side comparison: "Option A | Option B | Option C" with a "Select" button under each.

**Empty state:** Not applicable -- this screen always has content to review.

**Loading state:** Context panel loads instantly (data from DB). Output panel shows a skeleton of the expected format (e.g., 12 skeleton post cards for a thread) while content loads.

**Error state:** If the generation step failed, this screen shows the error message in the output panel with a "Retry Generation" button. Context panel still shows the source and style info.

**Mobile:** Context panel collapses into an expandable drawer at the top (tap "View context" to expand). Output panel takes full width. Actions bar stays sticky at the bottom. Thread posts stack vertically in full-width cards. Editing uses native textarea behavior.

---

### 5.5 Style Library

**URL:** `/styles`

**User goal:** Browse saved style profiles and decide which to use, edit, or create new.

**Layout:**

```
+----------------------------------------------------------+
| Header                                                   |
| Style Library                        [+ Create New Style]|
+----------------------------------------------------------+
| Filter Bar                                               |
| [Search...] [Source Type v] [Sort: Recent v]             |
+----------------------------------------------------------+
|                                                          |
| +-- Style Card --+  +-- Style Card --+  +-- Style --+   |
| |                |  |                |  |            |   |
| | "Sarah's Tech  |  | "Viral Thread  |  | "Newsletter|   |
| |  Voice"        |  |  Voice"        |  |  Formal"   |   |
| |                |  |                |  |            |   |
| | Tone: Casual   |  | Tone: Bold     |  | Tone: Prof |   |
| | Hook: Story    |  | Hook: Contrarian|  | Hook: Data |   |
| | Rhythm: Punchy |  | Rhythm: Mixed  |  | Rhythm: Med|   |
| |                |  |                |  |            |   |
| | Source: URL    |  | Source: URL    |  | Source:Text|   |
| | Used 47 times  |  | Used 12 times  |  | Used 3x    |   |
| |                |  |                |  |            |   |
| | [Apply] [Edit] |  | [Apply] [Edit] |  | [Apply][Ed]|   |
| +----------------+  +----------------+  +------------+   |
|                                                          |
| +-- Style Card --+  +-- Style Card --+                   |
| | ...            |  | ...            |                   |
| +----------------+  +----------------+                   |
+----------------------------------------------------------+
```

**Style card contents:**
- **Name** (text-lg, bold) -- user-defined name
- **Top 3 attributes** -- the most defining composition attributes of this style, shown as label:value pairs (Hook Pattern, Content Structure, Section Pacing are default; user can pin others)
- **Source badge** -- icon indicating how this profile was created (URL, text, audio, video, image)
- **Usage count** -- "Used N times" in pipelines
- **Actions:** "Apply" (opens a pipeline selector or copies to clipboard for use), "Edit" (opens Style Profile Detail), overflow menu ("Duplicate," "Delete")

**Filter bar:**
- Search: filters by name and attribute content
- Source Type dropdown: All, URL, Text, Audio, Video, Image
- Sort: Recent (default), Most Used, Alphabetical

**Empty state:**
```
+----------------------------------------------------------+
| No style profiles yet                                    |
|                                                          |
| Style profiles capture how content is composed --        |
| the hooks, structure, pacing, and formatting.            |
|                                                          |
| Paste a URL to successful content, and Kova              |
| will extract the composition pattern automatically.      |
|                                                          |
|              [Create Your First Style]                   |
+----------------------------------------------------------+
```

**Loading state:** Grid of skeleton cards (gray rectangles with pulsing animation).

**Error state:** Inline error banner above the grid: "Could not load style profiles. [Retry]"

**Mobile:** Cards stack in a single column. Filter bar collapses: search field visible, filters behind a "Filter" button that opens a bottom sheet. Cards show only name + top 2 attributes to save space; full details on tap.

---

### 5.6 Style Profile Detail

**URL:** `/styles/:id`

**User goal:** View and understand a style profile's attributes, and optionally edit them.

**Layout:**

```
+----------------------------------------------------------+
| Header                                                   |
| [Back] "Sarah's Tech Voice"         [Duplicate] [Delete] |
+----------------------------------------------------------+
|                                                          |
| +-- Profile Summary (full width) ----------------------+ |
| | Source: https://x.com/sarah/status/12345...           | |
| | Created: Jan 15, 2025 -- Used in 47 pipeline runs    | |
| +------------------------------------------------------+ |
|                                                          |
| +-- Attributes (full width) --------------------------+  |
| |                                                      | |
| | Hook Pattern                              [Edit]     | |
| | "Personal story + bold contrarian claim:             | |
| |  'I did X. Here's what nobody tells you.'"          | |
| |                                                      | |
| | Tone                                      [Edit]     | |
| | "Casual authority -- conversational but confident.   | |
| |  Uses 'you' frequently. Avoids jargon."             | |
| |                                                      | |
| | Rhythm                                    [Edit]     | |
| | "Short. Punchy. Then a longer sentence for context.  | |
| |  Average sentence: 8-12 words."                      | |
| |                                                      | |
| | Structure                                 [Edit]     | |
| | "8-12 posts per thread. Clear narrative arc.         | |
| |  Hook in post 1, insight per post, CTA at end."     | |
| |                                                      | |
| | Emoji Usage                               [Edit]     | |
| | "Strategic: one per post opening, never mid-sentence"| |
| |                                                      | |
| | Engagement Techniques                     [Edit]     | |
| | "Cliffhanger at post 3, question at post 7,         | |
| |  CTA at end"                                         | |
| |                                                      | |
| | Formatting                                [Edit]     | |
| | "Numbered (1/, 2/), line break between ideas,        | |
| |  bold for emphasis"                                   | |
| |                                                      | |
| | Vocabulary Level                          [Edit]     | |
| | "Simple words, no jargon, daily life analogies"      | |
| |                                                      | |
| | Perspective                               [Edit]     | |
| | "First person storytelling with direct reader address"| |
| |                                                      | |
| | Platform Conventions                      [Edit]     | |
| | "'/' numbering, ends with 'Follow for more'"        | |
| +------------------------------------------------------+ |
|                                                          |
| +-- Preview (full width) ----------------------------+   |
| | "Generate a sample paragraph in this style"         |   |
| | [Generate Preview]                                  |   |
| |                                                      |  |
| | (Generated preview text appears here)               |   |
| +-----------------------------------------------------+  |
|                                                          |
| +-- Usage (full width) ------------------------------+   |
| | Pipelines using this style:                         |   |
| | - My Weekly Thread Pipeline (last run: 2h ago)      |   |
| | - Blog to Social (last run: 3 days ago)             |   |
| +-----------------------------------------------------+  |
+----------------------------------------------------------+
```

**Sections:**

1. **Profile summary** -- Source URL/text snippet, creation date, usage count. Non-editable metadata.

2. **Attributes list** -- Each of the 10 composition attributes (from PRD section 7.2) displayed as a labeled block with the extracted value. Each has an "Edit" button that converts the block to an editable textarea. Changes are saved on blur or via a "Save" button that appears during editing.

3. **Preview** -- A "Generate Preview" button asks the AI to write a short sample paragraph using this style profile. Shows the user what content composed in this style would look like structurally. Result is cached and shown on subsequent visits until the profile is edited.

4. **Usage** -- List of pipelines that reference this style profile, with last run dates. Clicking a pipeline name navigates to its builder.

**Edit behavior:** Clicking "Edit" on any attribute transitions that block into edit mode (textarea with the current value). A "Save" and "Cancel" button pair appears. Only one attribute edits at a time. Saving triggers a brief success toast: "Attribute updated."

**Loading state:** Attribute values show skeleton text. Summary loads first, then attributes.

**Error state:** If profile not found, show "This style profile could not be found. It may have been deleted. [Back to Style Library]"

**Mobile:** Full-width single column. Attributes stack with full-width edit areas. Preview section at the bottom.

---

### 5.7 Create Style from Reference

**URL:** `/styles/new`

**User goal:** Provide reference content and see the extracted style profile.

**Layout (two-phase screen):**

**Phase 1: Input**

```
+----------------------------------------------------------+
| Header                                                   |
| [Back] Create Style Profile                              |
+----------------------------------------------------------+
|                                                          |
|  How would you like to provide a reference?              |
|                                                          |
|  [URL]  [Text]  [File]                                   |
|                                                          |
|  +-- Input Area (centered, max-width 600px) -----------+ |
|  |                                                      | |
|  |  Paste a URL to content you admire                   | |
|  |  +----------------------------------------------+   | |
|  |  | https://                                     |   | |
|  |  +----------------------------------------------+   | |
|  |                                                      | |
|  |  Examples: an X/Twitter thread, a YouTube video,     | |
|  |  a blog post, a LinkedIn post                        | |
|  |                                                      | |
|  |                            [Analyze Style]           | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+
```

Input types (tab selector at top):
- **URL:** Single URL input field. Helper text shows supported platforms.
- **Text:** Large textarea. Placeholder: "Paste the content you want to analyze..."
- **File:** Drag-and-drop zone. Accepts video, audio, image files. Shows accepted formats and size limits.

**Phase 2: Extraction (loading)**

After clicking "Analyze Style," the input area transitions to a loading state:

```
+----------------------------------------------------------+
| Analyzing style...                                       |
|                                                          |
| [Fetching content]     ............ done                 |
| [Extracting patterns]  ||||||||.... 72%                  |
|                                                          |
| This usually takes 10-30 seconds.                        |
+----------------------------------------------------------+
```

Shows real progress for multi-step extraction: fetching content, processing (transcription for video/audio), extracting attributes.

**Phase 3: Result**

```
+----------------------------------------------------------+
| Header                                                   |
| [Back] Style Extracted                   [Save Profile]  |
+----------------------------------------------------------+
|                                                          |
| +-- Source Info ---+  +-- Extracted Attributes ---------+ |
| |                  |  |                                 | |
| | Source: x.com/...|  | Hook Pattern          [Edit]   | |
| | Type: Thread     |  | "Personal story + ..."         | |
| | Author: @sarah   |  |                                | |
| | 12 posts         |  | Tone                  [Edit]   | |
| |                  |  | "Casual authority..."          | |
| | [View source]    |  |                                | |
| |                  |  | Rhythm                [Edit]   | |
| |                  |  | "Short. Punchy..."             | |
| |                  |  |                                | |
| |                  |  | [... all 10 attributes ...]    | |
| +------------------+  |                                | |
|                       | +-- Name This Profile --------+| |
|                       | | [My new style profile     ] || |
|                       | +-----------------------------+| |
|                       |                                | |
|                       |           [Save Profile]       | |
|                       +--------------------------------+ |
+----------------------------------------------------------+
```

**Result sections:**
- **Source info (left, 30%):** What was analyzed -- URL, content type detected, author if available, content length.
- **Extracted attributes (right, 70%):** All 10 attributes extracted by the AI, each editable (same edit pattern as Style Profile Detail). The user can review and tweak any attribute before saving.
- **Name input:** Text field for naming the profile. Auto-suggested based on source (e.g., "@sarah's Thread Style").
- **Save Profile** button: Saves to the Style Library and navigates to the Style Profile Detail view.

**Error states:**
- URL not accessible: "Could not fetch this URL. Check that it's a public link, or try pasting the content directly." + switch to Text tab.
- Content too short: "The provided content is too short for style analysis (minimum ~100 words). Try a longer piece of content."
- Processing failed: "Style extraction encountered an issue. [Retry] or try a different reference."

**Mobile:** Phase 1 is full-width. Phase 2 loading is full-screen. Phase 3: source info collapses to a summary bar, extracted attributes take full width in a scrollable list.

---

### 5.8 Content Library

**URL:** `/content`

**User goal:** Browse all generated content, find specific pieces, and take action (export, republish, edit).

**Layout:**

```
+----------------------------------------------------------+
| Header                                                   |
| Content Library                                          |
+----------------------------------------------------------+
| Filter Bar                                               |
| [Search...] [Format v] [Platform v] [Date v] [Status v] |
+----------------------------------------------------------+
|                                                          |
| +-- Content Card --+  +-- Content Card --+  +-- Card --+|
| |                  |  |                  |  |           ||
| | [Thread icon]    |  | [Post icon]      |  | [Script] ||
| | "Why devs waste  |  | "Key insights    |  | "Full    ||
| |  time on..."     |  |  from our..."    |  |  script"  ||
| |                  |  |                  |  |           ||
| | 12 posts         |  | LinkedIn         |  | 2,400 w  ||
| | Published to X   |  | Draft            |  | Published||
| | 2 hours ago      |  | Yesterday        |  | to YT    ||
| |                  |  |                  |  |           ||
| | From: "Weekly    |  | From: "Blog to   |  | From: ...||
| |  Thread Pipeline"|  |  Social"         |  |           ||
| |                  |  |                  |  |           ||
| | [View] [Export]  |  | [View] [Publish] |  | [View]   ||
| +------------------+  +------------------+  +----------+||
+----------------------------------------------------------+
```

**Content card contents:**
- **Format icon + type label** -- Thread, Post, Script, Newsletter, Carousel, etc.
- **Content preview** -- First 80 characters of the content
- **Metadata** -- Format-specific: post count for threads, word count for articles, slide count for carousels
- **Deployment status** -- "Published to [Platform]" with timestamp, "Draft," or "Exported"
- **Source pipeline** -- Which pipeline generated this content
- **Actions:** "View" (opens full preview), "Export" (download as text/markdown), "Publish" (for unpublished content, opens platform selector), overflow menu ("Delete," "Re-run pipeline")

**Filter bar:**
- Search: full-text search across content
- Format: All, Thread, Post, Article, Newsletter, Carousel, Video Script, Podcast, Reddit, Short Video
- Platform: All, X/Twitter, YouTube, Instagram, LinkedIn, Export
- Date: Today, This Week, This Month, All Time
- Status: All, Published, Draft, Pending Review

**View modes:** Grid (default, as shown) or List (compact table with columns: Title, Format, Platform, Status, Date, Actions).

**Empty state:**
```
No content yet.

Content appears here after your pipelines generate it.
Run your first pipeline to see results.

[Go to Pipelines]
```

**Loading state:** Skeleton card grid.

**Error state:** Inline banner: "Could not load content. [Retry]"

**Mobile:** Single-column card list. Filter bar collapses to a "Filter" button opening a bottom sheet. Cards show compact info: format icon, title, status badge, date.

---

### 5.9 Platform Connections (Settings)

**URL:** `/settings/platforms`

**User goal:** Connect social media accounts for automated publishing.

**Layout:**

```
+----------------------------------------------------------+
| Header                                                   |
| Settings > Platform Connections                          |
+----------------------------------------------------------+
|                                                          |
| Connected Platforms                                      |
|                                                          |
| +-- Platform Card (connected) ------------------------+  |
| | [X logo]  X / Twitter                               |  |
| | @sarahcreates -- Connected Jan 10, 2025             |  |
| | Permissions: Post threads, upload media              |  |
| |                                     [Disconnect]    |  |
| +-----------------------------------------------------+  |
|                                                          |
| +-- Platform Card (connected) ------------------------+  |
| | [YT logo]  YouTube                                  |  |
| | Sarah's Tech Channel -- Connected Jan 12, 2025      |  |
| | Permissions: Upload videos, manage metadata          |  |
| |                                     [Disconnect]    |  |
| +-----------------------------------------------------+  |
|                                                          |
| Available Platforms                                      |
|                                                          |
| +-- Platform Card (not connected) --------------------+  |
| | [IG logo]  Instagram                                |  |
| | Connect your Instagram Business or Creator account  |  |
| | to publish carousels and reels.                     |  |
| |                                      [Connect]      |  |
| +-----------------------------------------------------+  |
|                                                          |
| +-- Platform Card (not connected) --------------------+  |
| | [LI logo]  LinkedIn                                 |  |
| | Connect to publish posts and articles.              |  |
| | Coming soon                                         |  |
| +-----------------------------------------------------+  |
|                                                          |
| +-- Platform Card (not connected) --------------------+  |
| | [WP logo]  WordPress                                |  |
| | Connect to publish blog articles.                   |  |
| | Coming soon                                         |  |
| +-----------------------------------------------------+  |
+----------------------------------------------------------+
```

**Connected platform card:**
- Platform logo (in platform color) + name
- Account identifier (username, channel name)
- Connection date
- Permissions summary
- "Disconnect" button (destructive, requires confirmation: "Disconnect @sarahcreates from Kova? Scheduled pipelines that deploy to X will be paused.")

**Available platform card:**
- Platform logo (muted color) + name
- One-line description of what connecting enables
- "Connect" button (brand color) -- initiates OAuth flow
- "Coming soon" label for post-MVP platforms (no button, muted text)

**OAuth flow:**
1. User clicks "Connect"
2. New window/tab opens with platform OAuth consent screen
3. User authorizes
4. Window closes, platform card transitions from "Available" to "Connected" with a success animation (green checkmark flash)

**Error states:**
- OAuth failed: "Connection failed. This can happen if you denied permissions or the session expired. [Try Again]"
- OAuth timeout: "Connection timed out. [Try Again]"
- Token expired (detected on pipeline run): The connected card shows a warning badge: "Reconnection needed. Your token has expired. [Reconnect]"

**Mobile:** Cards stack full-width. Same layout, just single column.

---

### 5.10 Settings

**URL:** `/settings`

**User goal:** Configure account-wide preferences that affect how pipelines and content behave.

**Layout:**

Settings uses a left-nav sub-navigation within the main content area (on desktop) or a list menu (on mobile).

```
+----------------------------------------------------------+
| Header                                                   |
| Settings                                                 |
+----------------------------------------------------------+
| +-- Sub-nav (left, 200px) --+  +-- Content (right) ---+ |
| |                            |  |                      | |
| | [*] Platforms              |  | (Selected section    | |
| | [ ] Brand                 |  |  content here)       | |
| | [ ] AI Models              |  |                      | |
| | [ ] Defaults               |  |                      | |
| |                            |  |                      | |
| +----------------------------+  +----------------------+ |
+----------------------------------------------------------+
```

**Sub-pages:**

**Brand (`/settings/brand`):**

| Field | Type | Description |
|---|---|---|
| Brand/Creator name | Text input | Displayed in generated content where applicable |
| Description | Textarea | Brief description of brand/creator (1-2 sentences) |
| Default voice & tone | Textarea | E.g., "Professional but approachable, uses analogies" |
| Target audience | Textarea | E.g., "Tech professionals aged 25-45, interested in productivity" |
| Vocabulary preferences | Two text areas | "Words to use" and "Words to avoid" |
| Content guidelines | Textarea | Guardrails: topics to avoid, required disclaimers, etc. |

All fields auto-save on blur with a subtle "Saved" confirmation.

**AI Models (`/settings/models`):**

| Task | Field | Default |
|---|---|---|
| Writing AI | Dropdown: Claude, GPT-4o, Gemini | Claude Sonnet (recommended) |
| Transcription | Dropdown: faster-whisper, OpenAI Whisper | faster-whisper (free) |
| Voice Generation | Dropdown: Kokoro, ElevenLabs | Kokoro (free) |
| Image Generation | Dropdown: Pollinations, DALL-E | Pollinations (free) |

Each dropdown shows model name + cost indicator (Free, $, $$, $$$).

"Recommended" badge on the default selection. Changes apply to all future pipeline runs.

**Defaults (`/settings/defaults`):**

| Field | Type | Description |
|---|---|---|
| Default style profile | Dropdown of saved styles | Applied when no style explicitly selected |
| Default approval mode | Radio: Full autopilot, Review before publish, Per-platform | Controls scheduled pipelines |
| Default output formats | Checkboxes per format | Which formats to generate by default |
| Timezone | Timezone picker | For scheduling and timestamps |
| Notification preferences | Toggle per type | Email/push for: Pipeline complete, Review needed, Daily digest |

**Mobile:** Sub-nav becomes a list menu. Tapping an item navigates to the full-screen settings page with a back arrow.

---

### 5.11 Trend Explorer

**URL:** `/trends`

**User goal:** Discover trending topics in their niche and use them as pipeline input.

**Layout:**

```
+----------------------------------------------------------+
| Header                                                   |
| Trend Explorer                                           |
+----------------------------------------------------------+
| Niche Selector                                           |
| [Your niche: SaaS & Startups v]  [Last 24h v]           |
+----------------------------------------------------------+
|                                                          |
| +-- Trending Topics List (full width) ----------------+  |
| |                                                      | |
| | 1. "AI-powered developer tools"       [Rising]       | |
| |    Reddit (r/startups) + YouTube + Google Trends     | |
| |    Score: 87/100                                     | |
| |    [Create Content]  [Save Topic]                    | |
| |                                                      | |
| | 2. "Bootstrapping vs VC in 2025"      [Emerging]     | |
| |    Reddit (r/SaaS) + HackerNews                      | |
| |    Score: 72/100                                     | |
| |    [Create Content]  [Save Topic]                    | |
| |                                                      | |
| | 3. "Remote team culture"              [Peak]         | |
| |    Google Trends + LinkedIn                          | |
| |    Score: 91/100                                     | |
| |    [Create Content]  [Save Topic]                    | |
| |                                                      | |
| | ...                                                  | |
| +------------------------------------------------------+ |
|                                                          |
| +-- Lifecycle Legend ----------------------------------+  |
| | [green] Emerging: Early signal, 1-2 platforms        | |
| | [blue]  Rising: Growing on 3+ platforms              | |
| | [amber] Peak: High engagement, growth flattening     | |
| | [gray]  Declining: Engagement decreasing             | |
| +------------------------------------------------------+ |
+----------------------------------------------------------+
```

**Topic row contents:**
- **Rank number** (based on composite score)
- **Topic title** (bold)
- **Lifecycle badge:** Emerging (green), Rising (blue), Peak (amber), Declining (gray)
- **Source platforms:** Icons for each platform where this topic was detected
- **Score:** Composite relevance score (0-100)
- **Actions:**
  - "Create Content" -- opens a Quick Run dialog pre-filled with this topic
  - "Save Topic" -- saves to a personal list for later use

**Niche selector:** Dropdown matching user's configured niches. "Add niche" option opens a simple text input to define a new niche keyword set.

**Time range:** Last 24h (default), Last 3 days, Last week.

**Empty state:** "No trending topics found for this niche in the selected time range. Try expanding the time range or adjusting your niche keywords. Trend data updates every 4 hours."

**Loading state:** Skeleton list rows.

**Mobile:** Same layout, single column. Lifecycle legend collapses into a tooltip on the lifecycle badges.

---

### 5.12 Onboarding Flow

**Trigger:** First visit after account creation.

**User goal:** Create their first style profile and run their first pipeline within 5 minutes.

**Design philosophy:** The onboarding IS the product. Users don't "learn" the app then "use" it -- they use it from the first screen and learn by doing.

**Flow (3 steps, each is a real action that produces a real result):**

**Step 1: "Tell Kova your voice" (Style Creation)**

```
+----------------------------------------------------------+
| Step 1 of 3                                              |
|                                                          |
| First, let's capture your voice.                         |
|                                                          |
| Paste a link to content you've created                   |
| or content whose style you admire.                       |
|                                                          |
| +----------------------------------------------+        |
| | https://                                     |        |
| +----------------------------------------------+        |
|                                                          |
| Or describe your style in words:                         |
| +----------------------------------------------+        |
| | Casual, conversational, uses analogies...    |        |
| +----------------------------------------------+        |
|                                                          |
|                          [Skip for now]  [Continue]      |
+----------------------------------------------------------+
```

If user provides a URL, the system extracts a style profile (with a loading state). If they describe in words, a profile is created from that description. If they skip, no style is applied (the default Brand settings are used).

The result is a saved style profile. The user sees a brief summary: "Got it. This content's composition pattern: [hook pattern], [structure], [pacing]."

**Step 2: "Choose your workflow" (Template Selection)**

```
+----------------------------------------------------------+
| Step 2 of 3                                              |
|                                                          |
| What kind of content do you want to create?              |
|                                                          |
| +-- Template Card --+  +-- Template Card --+             |
| | Topic to          |  | Turn a URL into   |             |
| | Everything         |  | Social Posts       |             |
| |                    |  |                    |             |
| | Type a topic,     |  | Paste a link to    |             |
| | get content for   |  | your blog/video,   |             |
| | every platform.   |  | get threads and    |             |
| |                    |  | posts.             |             |
| | [Select]           |  | [Select]           |             |
| +--------------------+  +--------------------+             |
|                                                          |
| +-- Template Card --+  +-- Template Card --+             |
| | Daily Trending    |  | YouTube to         |             |
| | Content           |  | Everything         |             |
| | ...               |  | ...                |             |
| | [Select]          |  | [Select]           |             |
| +-------------------+  +--------------------+             |
|                                                          |
|                          [Skip for now]  [Continue]      |
+----------------------------------------------------------+
```

Only 4 templates shown (the most common starting points). Selecting one pre-configures a pipeline.

**Step 3: "Run your first pipeline" (Immediate Execution)**

```
+----------------------------------------------------------+
| Step 3 of 3                                              |
|                                                          |
| Almost there. Give Kova something to work with.          |
|                                                          |
| [Context-dependent input based on Step 2 selection]      |
|                                                          |
| Topic: (if "Topic to Everything")                        |
| +----------------------------------------------+        |
| | Why most developers waste time on...         |        |
| +----------------------------------------------+        |
|                                                          |
| URL: (if "Turn a URL into Social Posts")                 |
| +----------------------------------------------+        |
| | https://                                     |        |
| +----------------------------------------------+        |
|                                                          |
| Style: [Style from Step 1 (pre-selected)]               |
| Formats: [Thread] [LinkedIn Post] [Newsletter]           |
| (pre-checked based on template defaults)                 |
|                                                          |
|                                    [Run Pipeline]        |
+----------------------------------------------------------+
```

Clicking "Run Pipeline" creates and runs the pipeline, then navigates to the Pipeline Run View. The user watches their first content being generated in real-time.

**After onboarding:** The Dashboard shows the running pipeline. No separate "tutorial" screen. The user is now using the product.

**Skip behavior:** "Skip for now" on any step advances to the next. If all steps are skipped, the user lands on the Dashboard with the empty state (which provides the same three starting points in a less guided format).

---

## 6. Interaction Flows

### 6.1 First-Time Onboarding (New User to First Pipeline Run)

```
1. User signs up / logs in for the first time
2. System detects no prior activity
3. --> Onboarding Step 1: "Tell Kova your voice"
   a. User pastes URL (or describes style, or skips)
   b. If URL: loading state (10-30s), then style summary
   c. Style profile saved automatically
4. --> Onboarding Step 2: "Choose your workflow"
   a. User selects a template card (or skips)
   b. Pipeline template loaded
5. --> Onboarding Step 3: "Run your first pipeline"
   a. User enters topic or URL (or skips)
   b. User clicks "Run Pipeline"
6. --> Pipeline Run View
   a. Real-time progress via SSE
   b. Steps complete one by one with previews
7. --> Human Review (if pipeline includes review gate)
   a. User sees generated content in review screen
   b. User edits (optional) and approves
8. --> Pipeline completes
   a. Content appears in Content Library
   b. If deploy step included and platform connected: content published
   c. If no platform connected: content available for export
9. --> Dashboard (on next visit)
   a. Shows recent run, pending reviews, and quick start options
```

**Time from sign-up to first content generated:** Under 3 minutes (excluding style extraction wait time).

### 6.2 Creating a Pipeline from Template

```
1. User clicks "New Pipeline" (from Dashboard, sidebar, or FAB)
2. --> Pipeline Builder, Step 1: Basics
   a. User enters pipeline name (optional, auto-generated if skipped)
   b. User selects a template from the card grid
   c. Source type auto-selected based on template
   d. User enters source input (topic, URL, etc.)
   e. User clicks "Continue"
3. --> Pipeline Builder, Step 2: Steps
   a. Steps pre-filled from template
   b. User reviews step list (can expand, edit, remove, reorder, add)
   c. User clicks "Continue"
4. --> Pipeline Builder, Step 3: Settings
   a. User selects style profile from dropdown
   b. User chooses trigger: Run once (default) or Schedule
   c. If schedule: configure frequency and time
   d. Approval mode defaults to "Review before publish"
   e. User clicks "Continue"
5. --> Pipeline Builder, Step 4: Review
   a. User reviews summary of all configuration
   b. User clicks "Save & Run" (or "Save as Template" to save without running)
6. --> Pipeline Run View (automatic navigation)
```

### 6.3 Running a Pipeline and Reviewing Outputs

```
1. Pipeline starts (from builder, dashboard quick action, or schedule trigger)
2. --> Pipeline Run View
   a. Progress timeline shows all steps
   b. Steps execute sequentially
   c. Each completed step reveals its output in the preview panel
3. When pipeline reaches Human Review Gate:
   a. Pipeline status changes to "Waiting for approval"
   b. Notification sent (in-app + email if configured)
   c. Run view shows prominent "Review & Approve" button on the gate step
4. User clicks "Review & Approve"
5. --> Human Review Screen
   a. Context panel shows source and style info
   b. Output panel shows generated content in format tabs
   c. User reviews each format:
      - Reads through the content
      - Optionally edits inline (text changes, reorder thread posts, etc.)
      - Switches between format tabs
   d. User clicks "Approve & Continue"
6. --> Pipeline resumes
   a. Run view shows remaining steps executing
   b. Deploy steps publish to connected platforms
7. Pipeline completes
   a. Success banner in Run View
   b. Content Library updated
   c. Dashboard updated
```

### 6.4 Creating a Style Profile from a URL

```
1. User clicks "Create New Style" (from Style Library, onboarding, or quick action)
2. --> Create Style Screen, Phase 1: Input
   a. URL tab selected by default
   b. User pastes URL (e.g., https://x.com/creator/status/123456)
   c. User clicks "Analyze Style"
3. --> Phase 2: Extraction (loading)
   a. Progress shows: "Fetching content... Extracting patterns..."
   b. Duration: 10-30 seconds
4. --> Phase 3: Result
   a. Left panel: source info (URL, content type, author, length)
   b. Right panel: 10 extracted attributes with values
   c. User reviews each attribute
   d. User optionally edits attributes (click "Edit" on any attribute)
   e. User enters profile name (auto-suggested)
   f. User clicks "Save Profile"
5. --> Style Profile Detail (automatic navigation)
   a. Full profile view with all attributes
   b. "Generate Preview" button available
6. Profile now available in all pipeline style dropdowns
```

### 6.5 Scheduling a Recurring Pipeline

```
1. User creates or edits a pipeline (Pipeline Builder)
2. In Step 3 (Settings):
   a. User selects "Schedule" under Trigger
   b. Frequency options appear: Daily, Weekdays, Weekly, Custom
   c. User selects frequency (e.g., "Weekdays")
   d. User sets time (e.g., "10:00 AM")
   e. Timezone auto-detected, editable
   f. Start date defaults to today
3. Approval mode options appear:
   a. "Full autopilot" -- generate and publish automatically
   b. "Review before publish" -- generate, queue for review
   c. "Per-platform" -- configure per platform
   d. User selects preferred mode
4. User must have:
   a. A style profile selected (required for scheduled pipelines -- the AI needs to know the voice)
   b. A niche configured (for trend-powered pipelines)
   c. At least one platform connected (for deploy steps)
   System shows inline warnings if any are missing.
5. User completes builder and clicks "Save & Activate Schedule"
6. --> Pipeline detail view shows:
   a. Schedule badge: "Runs weekdays at 10:00 AM"
   b. Next run time
   c. "Pause Schedule" / "Edit Schedule" actions
7. Pipeline triggers automatically on schedule
   a. If approval mode is "Review before publish":
      - Content generated
      - Notification sent: "Your daily content is ready for review"
      - Items appear in Review Queue on Dashboard
   b. If "Full autopilot":
      - Content generated and published
      - Daily digest notification: "Published 3 pieces today. View performance."
```

### 6.6 Connecting a Platform (OAuth Flow)

```
1. User navigates to Settings > Platforms
   (or encounters a "Connect platform" prompt in Pipeline Builder)
2. User finds the platform card (e.g., "X / Twitter")
3. User clicks "Connect"
4. New browser tab/popup opens:
   a. Platform's OAuth consent page
   b. Shows permissions Kova is requesting
   c. User clicks "Authorize" on the platform's page
5. OAuth callback:
   a. Platform redirects back to Kova
   b. Kova exchanges auth code for access token
   c. Token stored securely (encrypted in DB)
6. Tab/popup closes
7. Platform card updates:
   a. Smooth transition from "Available" to "Connected"
   b. Shows account info (@username, channel name)
   c. Success toast: "X / Twitter connected successfully"
8. Platform now available in Pipeline Builder deploy step
```

### 6.7 Reviewing and Publishing Multi-Format Content

```
1. Pipeline generates multiple formats (fan-out):
   Thread + LinkedIn post + Newsletter + Video script
2. Pipeline pauses at Human Review gate
3. User opens Review screen
4. Format tabs at top: [Thread] [LinkedIn] [Newsletter] [Video Script]
5. User reviews Thread tab:
   a. 12 post cards displayed
   b. User reads through, edits post 3 (adjusts wording)
   c. Character counter stays green (under 280)
6. User switches to LinkedIn tab:
   a. Single post with professional formatting
   b. User approves as-is (no edits)
7. User switches to Newsletter tab:
   a. Email-formatted content with sections
   b. User edits the subject line
8. User switches to Video Script tab:
   a. Scene-by-scene layout
   b. User approves as-is
9. Bulk action: User clicks "Approve All"
   (or individually approves each tab)
10. Pipeline resumes:
    a. Thread deploys to X
    b. LinkedIn post deploys to LinkedIn (if connected)
    c. Newsletter queued for email send (if connected)
    d. Video script saved to Content Library for manual use
11. Confirmation: "4 pieces of content approved. Publishing to 2 platforms."
```

---

## 7. Design Patterns & Components

### 7.1 Card Patterns

**Pipeline Card (used in Pipeline List, Dashboard)**

```
+-------------------------------------------+
| [Icon] Pipeline Name          [Status dot] |
| Template: Topic to Everything              |
| Last run: 2 hours ago -- Completed         |
| Style: "Sarah's Tech Voice"               |
|                                            |
| [5 format icons]  [3 platform icons]       |
|                          [Run] [Edit] [...] |
+-------------------------------------------+
```

- Fixed height: 180px
- Status dot: green (active/completed), amber (scheduled), gray (draft)
- Format icons: small (16px) icons for each output format
- Platform icons: small (16px) logos for each deploy target
- Actions: "Run" (primary), "Edit" (secondary), overflow menu (Duplicate, Delete, View Runs)

**Content Card (used in Content Library)**

```
+-------------------------------------------+
| [Format icon]  Thread -- 12 posts          |
| "Why most developers waste time on         |
|  premature optimization..."                |
|                                            |
| Published to X -- 2 hours ago              |
| From: "My Weekly Thread Pipeline"          |
|                          [View] [Export]    |
+-------------------------------------------+
```

- Fixed height: 160px
- Format icon: 24px, colored by format type
- Content preview: 2 lines, truncated with ellipsis
- Status line: deployment status + timestamp
- Source: which pipeline generated this

**Style Card (used in Style Library)**

```
+-------------------------------------------+
| "Sarah's Tech Voice"                       |
|                                            |
| Tone: Casual authority                     |
| Hook: Personal story + bold claim          |
| Rhythm: Short, punchy, then longer         |
|                                            |
| [URL icon] -- Used 47 times               |
|                          [Apply] [Edit]    |
+-------------------------------------------+
```

- Fixed height: 180px
- Name: text-lg, bold
- Top 3 attributes: text-sm, secondary color
- Source icon + usage count: text-xs, tertiary color

**Trend Topic Card (used in Trend Explorer)**

```
+-------------------------------------------+
| 1. "AI-powered developer tools"  [Rising]  |
|    Reddit + YouTube + Google Trends         |
|    Score: 87/100                            |
|              [Create Content] [Save Topic]  |
+-------------------------------------------+
```

- List item style (no card border, horizontal dividers)
- Rank number: text-lg, bold, brand color
- Topic: text-base, bold
- Lifecycle badge: colored pill
- Sources: small platform icons
- Actions: text buttons

### 7.2 Status Indicators

**Pipeline Run States:**

| State | Color | Icon | Badge Text |
|---|---|---|---|
| Pending | Gray | Clock | Pending |
| Running | Blue | Animated spinner | Running |
| Waiting for Approval | Amber | User + clock | Needs Review |
| Completed | Green | Checkmark | Completed |
| Partially Completed | Amber | Warning triangle | Partial |
| Failed | Red | X circle | Failed |
| Cancelled | Gray | Slash circle | Cancelled |

**Step States (within a pipeline run):**

| State | Icon | Style |
|---|---|---|
| Waiting | Hollow circle | Gray, text-tertiary |
| Running | Filled spinner (animated) | Blue, text-primary |
| Completed | Filled checkmark | Green, text-primary |
| Failed | Filled X | Red, text-primary |
| Skipped | Dash | Gray, text-tertiary |
| Human gate (waiting) | User icon (animated pulse) | Amber, text-primary |

**Platform Connection States:**

| State | Visual |
|---|---|
| Connected | Green dot + "Connected" label |
| Not connected | Gray outline + "Connect" button |
| Token expired | Amber warning + "Reconnect" button |
| Connecting (OAuth in progress) | Spinner + "Connecting..." label |

### 7.3 Progress Visualization

**Step progress bar:**
- Thin (4px height) horizontal bar inside the step card
- Fills left to right with brand color
- Percentage label to the right: "62%"
- Estimated time remaining below: "~45s remaining"
- Indeterminate state: animated shimmer effect (for steps where progress percentage is unknown)

**Pipeline overall progress:**
- In the Run View header: "Step 3 of 6"
- Segmented progress bar: 6 segments, first 2 filled (green), third partially filled (blue, animated), remaining empty (gray)
- On Dashboard run cards: single progress bar showing overall percentage

### 7.4 Review / Approval Patterns

**Review item card:**
```
+-------------------------------------------+
| [Thread icon]  Thread Draft                |
| "Why most developers waste time..."        |
| Pipeline: My Weekly Thread -- Waiting 2h   |
|                          [Review]          |
+-------------------------------------------+
```

**Approval actions (sticky bar at bottom of review screen):**
```
+-----------------------------------------------------------+
| [Reject with Feedback]     [Skip]     [Approve & Continue] |
+-----------------------------------------------------------+
```

- Reject: Red outline button, left-aligned. Opens feedback textarea inline.
- Skip: Neutral button, center. No confirmation needed.
- Approve: Brand color filled button, right-aligned. Primary action, largest.

**Bulk approval (when reviewing multiple formats):**
```
+-----------------------------------------------------------+
| Selected: 3 of 4 formats     [Approve Selected] [Approve All] |
+-----------------------------------------------------------+
```

### 7.5 Multi-Format Preview Patterns

Each content format has a dedicated preview component that visually resembles the target platform:

**Thread preview:**
- Vertical stack of post cards
- Each card shows: post number, text content, character count
- Visual style mimics X/Twitter: rounded avatar placeholder, @username, post text
- Edit mode: text becomes an editable textarea within each card

**LinkedIn post preview:**
- Single card with LinkedIn-style layout: avatar, name, headline, post text
- Shows character count
- Edit mode: textarea replaces text

**Newsletter preview:**
- Email-style layout: header, sections with headings, body text, CTA buttons
- Shows approximate email width (600px max)
- Edit mode: each section becomes editable

**Video script preview:**
- Two-column table layout: "Visual / On Screen" left, "Audio / Narration" right
- Scene dividers between sections
- Includes chapter markers
- Edit mode: each cell becomes editable

**Carousel preview:**
- Horizontal scroll of slide cards
- Each slide shows text content in a visual frame
- Slide counter: "Slide 3 of 8"
- Edit mode: each slide's text is editable

### 7.6 Style Profile Visualization

**Compact view (in dropdowns, pipeline settings):**
```
"Sarah's Top Thread Structure"
Hook: Personal story + bold claim | Structure: 12-post arc | Pacing: One idea per post
```

**Card view (in Style Library):** See Section 7.1 Style Card.

**Full view (in Style Profile Detail):** See Section 5.6.

**Attribute badge:**
```
+-- Tone ---------------------------+
| Casual authority -- conversational |
| but confident                      |
+------------------------------------+
```
- Label: text-xs, uppercase, secondary color, top of block
- Value: text-sm, primary color, below label
- Edit button: icon-only, positioned at top-right of block

### 7.7 Platform Connection Cards

See Section 5.9 for full layout. Summary pattern:

**Connected:** Platform logo (color) + account info + "Connected" badge + "Disconnect" action
**Available:** Platform logo (muted) + description + "Connect" button
**Coming soon:** Platform logo (muted) + "Coming soon" label, no action

### 7.8 Notification Patterns

**In-app notification bell:**
- Icon with red unread count badge (number)
- Dropdown list of recent notifications
- Each notification: icon + message + timestamp + link
- "Mark all read" action
- Max 20 items in dropdown, "View all" link for full page

**Notification types:**

| Type | Icon | Example Message | Link Target |
|---|---|---|---|
| Review needed | User icon | "Thread draft ready for review" | Review Detail |
| Pipeline completed | Checkmark | "Pipeline 'Weekly Thread' completed" | Pipeline Run View |
| Pipeline failed | Warning | "Pipeline 'Blog to Social' failed at Script Writing" | Pipeline Run View |
| Content published | Rocket | "Thread published to X" | Content Library |
| Scheduled run complete | Calendar + check | "Daily content: 3 pieces generated" | Dashboard |
| Platform disconnected | Warning | "X/Twitter connection expired" | Settings > Platforms |

**Toast notifications:**
- Appear bottom-right (desktop) or top-center (mobile)
- Auto-dismiss after 5 seconds
- Manual dismiss via X button
- Types: success (green left border), error (red), info (blue), warning (amber)
- Max 3 visible simultaneously; older toasts push up

---

## 8. Progressive Disclosure Strategy

### 8.1 User Maturity Model

The interface adapts based on usage metrics tracked in the background. These are not "levels" shown to the user -- the interface simply reveals more as the user demonstrates familiarity.

| Maturity | Criteria | What Changes |
|---|---|---|
| **New** | 0 pipeline runs | Onboarding flow, simplified Dashboard, template-first pipeline builder |
| **Beginner** | 1-5 pipeline runs | Full Dashboard sections visible, all pipeline builder steps available, basic settings |
| **Intermediate** | 6-20 pipeline runs | AI model settings visible, advanced step configuration expanded by default, pipeline history |
| **Advanced** | 20+ pipeline runs, or user opens advanced settings | Full configuration exposed, keyboard shortcuts mentioned, bulk operations available |

### 8.2 Specific Disclosure Mechanics

**Pipeline Builder:**
- New users: Step 2 (Steps) shows a simplified view -- step names with brief descriptions, no expanded configuration.
- After 5 runs: Step configuration expands by default, showing all options.
- AI Model dropdown: hidden until user visits Settings > AI Models or has 10+ runs.

**Dashboard:**
- New users: Single onboarding card.
- After first run: Pending Reviews + Recent Runs + Quick Start.
- After 5 runs: Full dashboard with Trending Topics section.

**Settings:**
- New users: Only Platforms and Brand visible.
- After 3 runs: AI Models and Defaults sections appear.
- AI Models: Simple dropdown with "(Recommended)" labels. No technical details unless user clicks "Learn more."

**Style Library:**
- New users: Prominent "Create Your First Style" CTA.
- After first style: Normal library view with "Create New" button (standard sizing).
- Multi-reference compositing: post-MVP. For MVP, each profile has one source.

### 8.3 "Show More" Patterns

Used within screens to hide secondary options:

- **Pipeline Builder, Step Configuration:** Each step shows 2-3 key settings by default. "More options" link reveals additional settings (AI model for this step, advanced parameters).
- **Style Profile Detail:** First 5 attributes (Hook, Tone, Rhythm, Structure, Formatting) shown expanded. Remaining 5 collapsed under "Show all attributes."
- **Content Card in Library:** Shows preview + status. "Show details" expands to show full metadata (pipeline, style used, all platform deployments).
- **Settings pages:** Each section shows essential fields. "Advanced" toggle reveals additional options within that section.

### 8.4 Smart Defaults

Every configurable option has a sensible default so that users can complete any flow by making zero choices beyond the minimum required input:

| Configuration | Default | Why |
|---|---|---|
| Pipeline template | "Topic to Everything" (first template) | Most common starting workflow |
| Output formats | Thread + LinkedIn Post + Newsletter | Three most popular formats |
| Approval mode | Review before publish | Safe default for new users |
| Style profile | None (uses Brand settings) | Style is optional, not required |
| AI model | Claude Sonnet | Best quality for creative writing |
| Schedule | Run once (no schedule) | Manual control until user opts into automation |
| Deploy platforms | Export only (no auto-publish) | Safe until user explicitly connects and enables |

---

## 9. Mobile Strategy

### 9.1 Priority Tiers

| Tier | Screens | Mobile Experience | Rationale |
|---|---|---|---|
| **Must work well** | Dashboard, Review Queue, Review Detail, Notifications | Fully optimized, native-feeling | Users check reviews and approve on mobile frequently |
| **Should work** | Pipeline Run View, Content Library, Style Library, Trend Explorer | Functional, readable, key actions available | Users monitor runs and browse content on mobile |
| **Desktop-preferred** | Pipeline Builder, Settings, Style Creation | Functional but simplified; may redirect to desktop for complex tasks | Configuration tasks benefit from larger screens |

### 9.2 Mobile-Specific Adaptations

**Bottom Tab Bar:**
5 tabs: Dashboard, Pipelines, [+] (new/quick actions), Review (with badge), More (opens Styles, Content, Trends, Settings)

**Swipe gestures:**
- Review cards: swipe right to approve, swipe left to reject (with haptic feedback)
- Content cards: swipe left to reveal "Export" and "Delete" actions

**Bottom sheets (instead of dropdowns on mobile):**
- Filter options
- Style profile selector
- Format selector
- Platform selector

**Pull-to-refresh:**
- Dashboard, Pipeline List, Review Queue, Content Library

### 9.3 Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|---|---|---|
| Mobile | < 768px | Bottom tab bar, single column, full-screen panels, bottom sheets |
| Tablet | 768px - 1023px | Sidebar collapses by default, 2-column grids, modals instead of side panels |
| Desktop | 1024px - 1439px | Full sidebar, 3-column grids, side-by-side panels |
| Wide | 1440px+ | Content area max-width 1200px, centered with increased margins |

### 9.4 Touch Targets

All interactive elements: minimum 44x44pt tap target. Spacing between adjacent targets: minimum 8px. Primary action buttons: minimum 48x48pt.

---

## 10. Accessibility

### 10.1 Compliance Target

WCAG 2.1 Level AA compliance across all screens. This is a baseline, not a ceiling.

### 10.2 Color Contrast

| Element | Minimum Ratio | Standard |
|---|---|---|
| Body text on background | 4.5:1 | WCAG AA |
| Large text (18px+ or 14px+ bold) on background | 3:1 | WCAG AA |
| UI components (buttons, inputs, icons) against adjacent colors | 3:1 | WCAG AA |
| Status indicators | Must not rely on color alone | WCAG 1.4.1 |

**Status indicators always include:**
- Color (green/red/amber/blue)
- Icon (checkmark, X, warning, spinner)
- Text label ("Completed," "Failed," "Running")

Never use color as the sole differentiator.

### 10.3 Keyboard Navigation

**All interactive elements** are reachable via Tab key in a logical order (top-to-bottom, left-to-right).

**Focus indicators:** Visible 2px outline in brand color around focused elements. Never suppressed.

**Keyboard shortcuts (desktop):**

| Shortcut | Action |
|---|---|
| `/` | Open global search |
| `n` | New pipeline (from Dashboard) |
| `r` | Quick run (from Dashboard) |
| `Esc` | Close modal, dismiss dropdown, cancel edit |
| `Enter` | Confirm primary action in modals and forms |
| `Tab` / `Shift+Tab` | Navigate between form fields |
| Arrow keys | Navigate within lists, dropdowns, step order |

Shortcuts are documented in a "Keyboard Shortcuts" section accessible via `?` key press.

### 10.4 Screen Reader Support

**Semantic HTML:** Use proper heading hierarchy (h1 for page title, h2 for sections, h3 for sub-sections). Use `<nav>` for navigation, `<main>` for content, `<aside>` for sidebar.

**ARIA labels:**
- All icon-only buttons have `aria-label` (e.g., "Edit style profile," "Delete pipeline")
- Status badges have `aria-label` describing the state (e.g., "Pipeline status: running, step 3 of 6")
- Progress bars have `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Tab panels use `role="tablist"`, `role="tab"`, `role="tabpanel"`
- Live regions (`aria-live="polite"`) for real-time updates (pipeline progress, notifications)

**Form accessibility:**
- All inputs have associated `<label>` elements
- Error messages linked via `aria-describedby`
- Required fields marked with `aria-required="true"`
- Form validation errors announced via `aria-live` region

### 10.5 Motion Sensitivity

- All animations respect `prefers-reduced-motion` media query
- When reduced motion is preferred: animations replaced with instant state changes, no parallax, no auto-playing animations
- SSE progress updates still function; visual transition is simply instant rather than animated

### 10.6 Content Accessibility

- All images (platform logos, format icons) have descriptive `alt` text
- Generated content previews maintain heading structure for screen readers
- Carousel previews include "Slide X of Y" announcements
- Thread previews include "Post X of Y" announcements

---

## Appendix A: Screen Inventory Summary

| # | Screen | URL | Primary Action | MVP Priority |
|---|---|---|---|---|
| 1 | Dashboard | `/` | Review pending items / Start new pipeline | P0 |
| 2 | Pipeline List | `/pipelines` | Select a pipeline to run or edit | P0 |
| 3 | Pipeline Builder | `/pipelines/new`, `/pipelines/:id/edit` | Configure and run a pipeline | P0 |
| 4 | Pipeline Run View | `/pipelines/:id/runs/:runId` | Monitor progress, access outputs | P0 |
| 5 | Review Queue | `/review` | Select an item to review | P0 |
| 6 | Review Detail | `/review/:runId/:stepId` | Approve or reject content | P0 |
| 7 | Style Library | `/styles` | Browse and manage styles | P0 |
| 8 | Style Profile Detail | `/styles/:id` | View/edit style attributes | P0 |
| 9 | Create Style | `/styles/new` | Extract style from reference | P0 |
| 10 | Content Library | `/content` | Browse and export content | P0 |
| 11 | Platform Connections | `/settings/platforms` | Connect platform accounts | P0 |
| 12 | Settings: Brand | `/settings/brand` | Configure brand/voice | P1 |
| 13 | Settings: AI Models | `/settings/models` | Select AI providers | P2 |
| 14 | Settings: Defaults | `/settings/defaults` | Configure default behaviors | P1 |
| 15 | Trend Explorer | `/trends` | Discover trending topics | P1 |
| 16 | Onboarding Flow | `/onboarding` (steps 1-3) | First-time setup and first run | P0 |

---

## Appendix B: State Matrix

Every screen has these states defined. This matrix ensures no state is forgotten during implementation.

| Screen | Empty | Loading | Loaded | Error | Partial |
|---|---|---|---|---|---|
| Dashboard | Onboarding card | Skeleton sections | Full dashboard | Per-section inline error | Some sections loaded, others error |
| Pipeline List | "Create your first pipeline" | Skeleton cards | Card grid | Inline error + retry | N/A |
| Pipeline Builder | Step 2 blank template, "Add first step" | Template card skeletons | Form with data | Inline field validation | Partially filled form (save draft) |
| Pipeline Run View | N/A (always has step data) | Steps in "waiting" state | Live progress | Failed step with retry | Some steps done, others failed |
| Review Queue | "All caught up" checkmark | Skeleton list | Review item cards | Inline error + retry | N/A |
| Review Detail | N/A (always has content) | Skeleton format previews | Editable content | Generation failed, retry button | Some formats loaded, others loading |
| Style Library | "Create your first style" | Skeleton cards | Card grid | Inline error + retry | N/A |
| Style Detail | N/A (always has data) | Skeleton attribute blocks | Full attribute view | Profile not found, back link | N/A |
| Create Style | Clean input form | Extraction progress bar | Extracted attributes | Extraction failed, retry/alt input | N/A |
| Content Library | "No content yet, run a pipeline" | Skeleton cards | Card grid/list | Inline error + retry | N/A |
| Platform Connections | All platforms in "Available" state | N/A (static cards) | Mixed connected/available | OAuth failure message | Some connected, some failed |
| Settings | Default values in all fields | N/A (instant load from cache) | Fields with saved values | Save failed, retry | N/A |
| Trend Explorer | "No trends for this niche" | Skeleton list | Topic list | Inline error + retry | N/A |
| Onboarding | Clean input (step 1 default) | Style extraction loading | Step result summary | Extraction error, retry/skip | N/A |

---

## Appendix C: Notification Inventory

| Event | In-App | Email | Push (Future) | Urgency |
|---|---|---|---|---|
| Pipeline completed | Yes | Optional | Optional | Low |
| Pipeline failed | Yes | Yes | Yes | High |
| Content ready for review | Yes | Yes | Yes | High |
| Content published | Yes | Optional | No | Low |
| Scheduled run completed | Yes | Yes (digest) | No | Low |
| Scheduled run failed | Yes | Yes | Yes | High |
| Platform token expired | Yes | Yes | No | Medium |
| Style profile created | Yes (toast) | No | No | Low |

---

## Appendix D: i18n Considerations

All user-facing text must be externalized for internationalization. The MVP supports English and Korean.

**Text categories requiring translation:**
- Navigation labels
- Button labels and CTAs
- Form field labels and placeholders
- Empty state messages
- Error messages
- Notification messages
- Onboarding copy
- Status labels
- Tooltip text

**Text that is NOT translated:**
- User-generated content (pipeline names, style profile names, content)
- Platform names (X/Twitter, YouTube, Instagram)
- AI model names (Claude, GPT-4o)
- Technical identifiers (URLs, IDs)

**RTL support:** Not required for MVP (English and Korean are both LTR). Architecture should not preclude future RTL support.

---

*This document defines the complete UX strategy for Kova. For product features and user journeys, see the Product PRD. For technical architecture, see the Technical PRD. For MVP scope, see the MVP PRD.*
