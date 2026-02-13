# Kova -- Multi-Brand Management UX Specification

**Feature Design Specification for Implementation**

| | |
|---|---|
| **Version** | 1.0 |
| **Date** | February 2026 |
| **Status** | Draft |
| **Type** | UX Feature Specification |
| **Audience** | Design, Frontend Engineering, Product |
| **Dependencies** | UX_STRATEGY.md, PRD |

---

## Table of Contents

1. [First Principles Analysis](#1-first-principles-analysis)
2. [Information Architecture Decision](#2-information-architecture-decision)
3. [Data Model & Types](#3-data-model--types)
4. [Brand Library View](#4-brand-library-view)
5. [Brand Create/Edit View](#5-brand-createedit-view)
6. [Brand Card Design](#6-brand-card-design)
7. [Brand Selection in Pipelines](#7-brand-selection-in-pipelines)
8. [Empty State & Onboarding](#8-empty-state--onboarding)
9. [Interaction Flows](#9-interaction-flows)
10. [Mobile Considerations](#10-mobile-considerations)
11. [Accessibility](#11-accessibility)
12. [File Structure & Implementation Plan](#12-file-structure--implementation-plan)

---

## 1. First Principles Analysis

### What is the user's ONE goal?

**Manage distinct identities so that each pipeline produces content that sounds like the right brand.**

This is not a settings page. Settings are things you configure once and forget. Brands are entities you actively create, curate, compare, and apply across workflows. The user thinks: "I need to set up my client's brand" or "Which brand should this pipeline use?" -- these are active management tasks, not configuration tasks.

### What is the absolute minimum needed?

- A list of brands the user owns
- A way to create/edit a brand
- A way to select a brand when building or running a pipeline
- A way to know which brand is the default

### What can be removed?

- Brand analytics/usage charts -- not needed for MVP; a simple usage count suffices
- Brand templates/presets -- adds complexity without clear user demand
- Brand collaboration/sharing -- future feature, not MVP
- Brand versioning/history -- premature optimization

---

## 2. Information Architecture Decision

### Recommendation: Promote Brand to Top-Level Navigation

**Decision: Move Brand from `/settings/brand` to `/brands` as a top-level primary navigation item.**

**Rationale:**

| Factor | Settings Sub-Page | Top-Level Nav Item |
|---|---|---|
| Mental model | "Configure once" | "Manage actively" |
| Frequency of use | Low | High (every pipeline run) |
| Entity count | 1 | 1 to many |
| Actions | Edit fields | Browse, create, edit, duplicate, delete, set default |
| Parallel in the app | N/A | Styles (`/styles`), Pipelines (`/pipelines`) |

Brand is now a **collection entity** -- identical in nature to Styles and Pipelines. Users create multiple brands, browse them, select them in pipelines, and manage them over time. This maps to the existing pattern of top-level collection pages.

### Updated Navigation Structure

**Sidebar (PRIMARY_NAV):**

```
Dashboard    /               대시보드
Pipelines    /pipelines      파이프라인
Review       /review         리뷰
Styles       /styles         스타일
Brands       /brands         브랜드        <-- NEW (moved from Settings)
Content      /content        콘텐츠
```

**Sidebar (SECONDARY_NAV):**

```
Trends       /trends         트렌드
Settings     /settings       설정
```

**Settings sub-nav (updated -- Brand removed):**

```
Platforms    /settings/platforms    플랫폼
AI Models    /settings/models      AI 모델
Defaults     /settings/defaults    기본 설정
```

**Mobile bottom bar (updated):**

```
[Dashboard] [Pipelines] [+New] [Review] [More]
```

No change to the mobile bottom bar. Brands is accessible via the "More" menu on mobile, same as Styles and Content. This avoids overcrowding the 5-slot bottom bar.

### Updated Routes

```typescript
// New routes to add to ROUTES in shared/config/routes.ts
BRANDS: "/brands",
BRAND_NEW: "/brands/new",
BRAND_DETAIL: (id: string) => `/brands/${id}`,

// Remove from ROUTES:
SETTINGS_BRAND: "/settings/brand",  // deprecated
```

### Redirect Strategy

`/settings/brand` should 301-redirect to `/brands` to avoid broken bookmarks.

---

## 3. Data Model & Types

### Brand Entity Type

```typescript
// entities/brand/model/types.ts

export type Brand = {
  id: string;
  name: string;
  description: string;
  voiceTone: string;
  targetAudience: string;
  perspective: string;           // e.g., "first person plural (we)"
  wordsToUse: string[];
  wordsToAvoid: string[];
  emojiUsage: EmojiUsage;
  guidelines: string;
  connectedPlatforms: BrandPlatform[];
  isDefault: boolean;
  pipelineCount: number;         // how many pipelines use this brand
  createdAt: Date;
  updatedAt: Date;
};

export type EmojiUsage = "none" | "minimal" | "moderate" | "frequent";

export type BrandPlatform = {
  platformId: string;            // e.g., "twitter", "youtube"
  accountName: string;           // e.g., "@sarahcreates"
  accountId: string;             // platform-specific ID
  connectedAt: Date;
};
```

### Label Translations

| English | Korean |
|---|---|
| Brands | 브랜드 |
| Brand Library | 브랜드 라이브러리 |
| Create New Brand | 새 브랜드 만들기 |
| Edit Brand | 브랜드 수정 |
| Duplicate Brand | 브랜드 복제 |
| Delete Brand | 브랜드 삭제 |
| Set as Default | 기본값으로 설정 |
| Default Brand | 기본 브랜드 |
| Brand Name | 브랜드 이름 |
| Description | 설명 |
| Voice & Tone | 음성 & 톤 |
| Target Audience | 타겟 오디언스 |
| Perspective | 관점 |
| Words to Use | 사용할 단어 |
| Words to Avoid | 피해야 할 단어 |
| Emoji Usage | 이모지 사용 |
| Content Guidelines | 콘텐츠 가이드라인 |
| Connected Platforms | 연결된 플랫폼 |
| No brands yet | 아직 브랜드가 없습니다 |
| Select Brand | 브랜드 선택 |
| Search brands... | 브랜드 검색... |
| pipelines | 파이프라인 |
| Save Brand | 브랜드 저장 |
| Cancel | 취소 |
| Are you sure? | 정말로 삭제하시겠습니까? |
| This cannot be undone. | 이 작업은 되돌릴 수 없습니다. |

---

## 4. Brand Library View

### URL: `/brands`

### User Goal

Browse existing brands and decide which one to manage, or create a new one.

### Primary Action

"Create New Brand" button (top right, matches Style Library and Pipeline List pattern).

### Layout

```
+----------------------------------------------------------+
| Brand Library                     [ + Create New Brand ]  |
| 브랜드 라이브러리                                           |
+----------------------------------------------------------+
| [Search brands...]  [Sort: Recent v]                      |
+----------------------------------------------------------+
|                                                           |
| +-- Brand Card --+  +-- Brand Card --+  +-- Brand Card -+|
| | [DEFAULT]      |  |                |  |               ||
| | Sarah Creates  |  | Agency Client  |  | Side Project  ||
| | "Tech educator |  | "B2B SaaS..."  |  | "Gaming..."   ||
| |  and content."|  |                |  |               ||
| | [@] [YT] [LI] |  | [@] [LI]      |  | [YT] [IG]    ||
| | 4 pipelines    |  | 2 pipelines    |  | 1 pipeline    ||
| |                |  |                |  |               ||
| | [Edit] [...]   |  | [Edit] [...]   |  | [Edit] [...]  ||
| +----------------+  +----------------+  +---------------+||
|                                                           |
+----------------------------------------------------------+
```

### Filter Bar

Follows the identical pattern used by Style Library and Pipeline List:

- **Search input** (left, flex-1, min-width 200px): `placeholder="Search brands..." / "브랜드 검색..."`
- **Sort select** (right, 150px width): Recent (default), Most Used, Alphabetical

No additional filter dropdown needed for MVP. Brands have no categorical taxonomy like styles have source types. If the user has 50+ brands in the future, a filter can be introduced.

### Grid Layout

Identical to Style Library and Pipeline List:

```
grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4
```

### Sort Options

| Value | Label | Logic |
|---|---|---|
| `recent` | Recent | Sort by `updatedAt` descending |
| `most_used` | Most Used | Sort by `pipelineCount` descending |
| `alphabetical` | Alphabetical | Sort by `name` ascending |

### Empty Search Results

Same pattern as Style Library:

```
+----------------------------------------------------------+
|  [Search icon, 48px, muted]                               |
|  No brands found                                          |
|  Try adjusting your search.                               |
+----------------------------------------------------------+
```

---

## 5. Brand Create/Edit View

### URL: `/brands/new` (create), `/brands/:id` (detail/edit)

### User Goal

Define or modify a brand identity.

### Layout Strategy

The brand form has 7-8 fields. This is moderate complexity -- not enough for a multi-step wizard (which the Pipeline Builder uses for 4 distinct categories), but too much to present as an undifferentiated wall of fields.

**Solution: Single-page form with grouped sections.** Two visual groups separated by whitespace and section headers:

1. **Identity** -- Name, Description, Voice & Tone, Target Audience, Perspective
2. **Vocabulary** -- Words to Use, Words to Avoid, Emoji Usage, Content Guidelines
3. **Connected Platforms** -- Which platform accounts belong to this brand

### ASCII Wireframe -- Brand Create

```
+----------------------------------------------------------+
| [< Back to Brands]                                        |
|                                                           |
| Create New Brand                    [Cancel] [Save Brand] |
| 새 브랜드 만들기                                            |
+----------------------------------------------------------+
|                                                           |
| IDENTITY / 아이덴티티                                      |
| -------------------------------------------------------- |
|                                                           |
| Brand Name / 브랜드 이름                                   |
| [Your brand or creator name________________]              |
| This name identifies your brand across Kova.              |
|                                                           |
| Description / 설명                                        |
| [Brief 1-2 sentence description__________]                |
| [_______________________________________ ]                |
|                                                           |
| Voice & Tone / 음성 & 톤                                  |
| [Describe how content should sound_______]                |
| [_______________________________________ ]                |
| [_______________________________________ ]                |
| AI will match this voice in all generated content.        |
|                                                           |
| Target Audience / 타겟 오디언스                             |
| [Who is this content for?________________]                |
| [_______________________________________ ]                |
| [_______________________________________ ]                |
| Be specific about demographics, interests, and needs.     |
|                                                           |
| Perspective / 관점                                        |
| [First person (I/me) .............. v]                    |
|                                                           |
+----------------------------------------------------------+
|                                                           |
| VOCABULARY / 어휘                                         |
| -------------------------------------------------------- |
|                                                           |
| Words to Use / 사용할 단어                                 |
| [innovative, practical, actionable_______]                |
| [_______________________________________ ]                |
| Preferred vocabulary that reflects your brand voice.       |
|                                                           |
| Words to Avoid / 피해야 할 단어                             |
| [synergy, leverage, paradigm shift_______]                |
| [_______________________________________ ]                |
| Words or phrases that don't fit your brand.               |
|                                                           |
| Emoji Usage / 이모지 사용                                  |
| ( ) None      ( ) Minimal    (o) Moderate   ( ) Frequent  |
|                                                           |
| Content Guidelines / 콘텐츠 가이드라인                      |
| [Topics to avoid, required disclaimers...]                |
| [_______________________________________ ]                |
| [_______________________________________ ]                |
|                                                           |
+----------------------------------------------------------+
|                                                           |
| CONNECTED PLATFORMS / 연결된 플랫폼                         |
| -------------------------------------------------------- |
|                                                           |
| Assign platform accounts to this brand.                   |
| 이 브랜드에 플랫폼 계정을 연결합니다.                         |
|                                                           |
| +-- X/Twitter ---------+  +-- YouTube ----------+        |
| | [@] @sarahcreates    |  | [YT] Sarah Creates  |        |
| |   [Remove]           |  |   [Remove]           |        |
| +----------------------+  +----------------------+        |
|                                                           |
| [ + Link Platform Account ]                               |
|                                                           |
+----------------------------------------------------------+
|                                                           |
|                              [Cancel]     [Save Brand]    |
+----------------------------------------------------------+
```

### ASCII Wireframe -- Brand Edit (Detail)

Identical layout to Create, but:
- Page title shows the brand name: "Sarah Creates" instead of "Create New Brand"
- Subtitle: "브랜드 수정" instead of "새 브랜드 만들기"
- Save button label: "Save Changes" / "변경사항 저장"
- A "..." dropdown menu in the header with: "Duplicate Brand", "Set as Default", "Delete Brand"

```
+----------------------------------------------------------+
| [< Back to Brands]                                        |
|                                                           |
| Sarah Creates              [...] [Cancel] [Save Changes]  |
| 브랜드 수정                                                |
+----------------------------------------------------------+
| (same form layout as Create)                              |
+----------------------------------------------------------+
```

### Form Field Specifications

| Field | Component | Rows | Placeholder (EN) | Helper Text (EN) |
|---|---|---|---|---|
| Brand Name | `Input` | 1 | "Your brand or creator name" | "This name identifies your brand across Kova." |
| Description | `Textarea` | 2 | "Brief description (1-2 sentences)" | "A concise summary of what this brand represents." |
| Voice & Tone | `Textarea` | 3 | "e.g., Professional but approachable, uses analogies" | "AI will match this voice in all generated content." |
| Target Audience | `Textarea` | 3 | "e.g., Tech professionals aged 25-45" | "Be specific about demographics, interests, and needs." |
| Perspective | `Select` | - | - | - |
| Words to Use | `Textarea` | 2 | "e.g., innovative, practical, actionable" | "Preferred vocabulary that reflects your brand voice." |
| Words to Avoid | `Textarea` | 2 | "e.g., synergy, leverage, paradigm shift" | "Words or phrases that don't fit your brand." |
| Emoji Usage | Radio group (inline) | - | - | - |
| Content Guidelines | `Textarea` | 3 | "Topics to avoid, required disclaimers..." | "Rules and boundaries for content generated under this brand." |

### Perspective Select Options

| Value | Label EN | Label KO |
|---|---|---|
| `first_singular` | First person (I/me) | 1인칭 단수 (나/저) |
| `first_plural` | First person plural (we/us) | 1인칭 복수 (우리) |
| `second` | Second person (you) | 2인칭 (당신/너) |
| `third` | Third person (they/one) | 3인칭 (그들) |
| `mixed` | Mixed / varies by context | 혼합 / 상황에 따라 |

### Emoji Usage Radio Options

| Value | Label EN | Label KO |
|---|---|---|
| `none` | None -- No emojis | 없음 |
| `minimal` | Minimal -- Rare, strategic use | 최소 |
| `moderate` | Moderate -- Regular use | 보통 |
| `frequent` | Frequent -- Heavy emoji use | 자주 |

### Connected Platforms Section

This section shows platform accounts that are globally connected (in Settings > Platforms) and lets the user assign them to this specific brand.

**How it works:**
1. The user connects platform accounts globally in Settings > Platforms (unchanged)
2. In the Brand form, the "Connected Platforms" section shows which of those accounts are assigned to this brand
3. "Link Platform Account" opens a dropdown/popover showing unassigned connected accounts
4. Each assigned account shows a "Remove" button (removes the assignment, not the connection)

If no platforms are connected globally, show:

```
No platform accounts connected yet.
Connect accounts in Settings > Platforms to assign them to brands.
[Go to Platforms]
```

### Save/Cancel Behavior

- **Save**: Validates required fields (name is the only required field), persists, redirects to `/brands`
- **Cancel**: If form is dirty, show a confirmation dialog: "Discard unsaved changes?" / "저장하지 않은 변경사항을 취소하시겠습니까?" with "Keep editing" / "Discard" buttons
- **Cancel on clean form**: Navigate back to `/brands` immediately

### Form Width

`max-w-2xl mx-auto` -- consistent with Pipeline Builder's step content width.

---

## 6. Brand Card Design

### Structure

Follows the same Card component pattern as StyleCard and PipelineCard.

```
+----------------------------------------------+
| [DEFAULT badge]                               |  <-- only if isDefault
|                                               |
| Brand Name                          [... v]   |
| "Description snippet that may wrap             |
|  to two lines maximum..."                     |
|                                               |
| [@] [YT] [LI] [IG]    4 pipelines            |
|                                               |
| [Edit]                                        |
+----------------------------------------------+
```

### Card Component Specification

```
<Card className="h-full">
  <CardHeader>
    {isDefault && <Badge variant="secondary">Default / 기본</Badge>}
    <CardTitle>{brand.name}</CardTitle>
    <CardAction>
      <DropdownMenu>  <!-- "..." overflow menu -->
        <DropdownMenuItem>Edit / 수정</DropdownMenuItem>
        <DropdownMenuItem>Duplicate / 복제</DropdownMenuItem>
        <DropdownMenuItem>Set as Default / 기본값으로 설정</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive>Delete / 삭제</DropdownMenuItem>
      </DropdownMenu>
    </CardAction>
  </CardHeader>

  <CardContent>
    <p line-clamp-2>{brand.description}</p>

    <div className="flex items-center justify-between">
      <div className="flex gap-1.5">
        <!-- Platform icons, 20px, using platform colors -->
        {connectedPlatforms.map(p => <PlatformIcon />)}
      </div>
      <span className="text-xs text-muted-foreground">
        {pipelineCount} pipelines
      </span>
    </div>
  </CardContent>

  <CardFooter>
    <Button variant="outline" size="sm" asChild>
      <Link href={ROUTES.BRAND_DETAIL(brand.id)}>Edit</Link>
    </Button>
  </CardFooter>
</Card>
```

### Overflow Menu Actions

| Action | Behavior |
|---|---|
| **Edit** | Navigate to `/brands/:id` |
| **Duplicate** | Create a copy named "Brand Name (copy)", navigate to the new brand's edit page |
| **Set as Default** | Mark this brand as default (un-marks the previous default). Show toast: "Sarah Creates set as default brand." / "Sarah Creates가 기본 브랜드로 설정되었습니다." |
| **Delete** | Show destructive confirmation dialog (see Interaction Flows below) |

### Default Badge

When a brand is the default, a `<Badge variant="secondary">` appears above the brand name inside the CardHeader. Text: "Default" / "기본". This badge uses the `secondary` variant (muted background) to be visible without being loud.

### Platform Icons Row

Shows small (16px) icons for each connected platform using the platform's brand color (same colors as in `platforms-content.tsx`). Maximum 5 icons shown; if more, show "+N" as a small badge.

### Pipeline Count

Shows how many pipelines currently reference this brand. Format: `N pipelines` / `N 파이프라인`. If 0: "No pipelines" / "파이프라인 없음".

---

## 7. Brand Selection in Pipelines

### Where Brand Appears

Brand must be selectable in the **Pipeline Builder** (Step 3: Settings) alongside the existing Style Profile selector.

### Current State of Step 3: Settings

Currently, Step 3 contains:
1. Style Profile (Select dropdown)
2. Trigger (radio: run once / schedule)
3. Schedule options (conditional)
4. Approval mode (conditional)

### Updated Step 3: Settings

Add Brand selector immediately before Style Profile, because Brand defines *who is speaking* (the identity context for everything), while Style defines *how content is structured* (formatting and pacing). Brand is logically first.

```
+----------------------------------------------------------+
| STEP 3: SETTINGS                                          |
+----------------------------------------------------------+
|                                                           |
| Brand                                                     |
| Select which brand identity to use for this pipeline      |
|                                                           |
| +-- Selected Brand Card (compact) ---------------------+ |
| | [x] Sarah Creates                    [DEFAULT]        | |
| |     "Tech educator and content creator..."            | |
| |     [@] [YT] [LI]                                    | |
| |                                      [Change]         | |
| +----------------------------------------------------- + |
|                                                           |
| Style profile                                             |
| Apply a style profile to maintain a consistent voice      |
| [Sarah's Tech Voice ..................... v]              |
|                                                           |
| Trigger                                                   |
| (same as current)                                         |
|                                                           |
+----------------------------------------------------------+
```

### Brand Selector Interaction

1. **Default state**: If a default brand exists, it is pre-selected and shown as a compact card
2. **Change button**: Opens a popover/dropdown listing all brands as compact rows (name + description snippet + platform icons)
3. **No brands state**: Shows "No brands configured. Create one to define your content identity." with a link to `/brands/new`
4. **Single brand**: Auto-selected, no change button needed (but still show the brand for transparency)

### Brand Selector Compact Card

```
+----------------------------------------------------------+
| [Radio selected] Brand Name              [DEFAULT badge]  |
|                  "Description snippet..."                 |
|                  [@] [YT] [LI]                            |
+----------------------------------------------------------+
```

### Brand Picker Popover/Dropdown

When the user clicks "Change", a popover appears:

```
+--------------------------------------+
| Select Brand / 브랜드 선택            |
| [Search brands...]                   |
| ------------------------------------ |
| (o) Sarah Creates     [DEFAULT]      |
|     "Tech educator..."               |
|     [@] [YT] [LI]                    |
| ------------------------------------ |
| ( ) Agency Client                    |
|     "B2B SaaS marketing..."          |
|     [@] [LI]                         |
| ------------------------------------ |
| ( ) Side Project                     |
|     "Gaming content..."              |
|     [YT] [IG]                        |
| ------------------------------------ |
| [+ Create New Brand]                 |
+--------------------------------------+
```

The search input only appears if the user has 5+ brands (progressive disclosure -- most users will have 1-3 brands).

### Pipeline Review Step (Step 4)

The review summary must include the selected brand:

```
Pipeline Summary:
  Name:           My Weekly Thread Pipeline
  Template:       Topic to Everything
  Source:         Topic / Idea: "AI in education"
  Steps (6):     1. Idea Generator  2. Research Agent  ...
  Brand:          Sarah Creates          <-- NEW
  Style profile:  Sarah's Tech Voice
  Trigger:        Run once
```

### Builder Form Store Update

```typescript
// Add to BuilderFormState in use-builder-form.ts:
brandId: string;
setBrandId: (id: string) => void;

// Initial state:
brandId: "",  // empty means "use default brand" at runtime
```

---

## 8. Empty State & Onboarding

### Empty Brand Library (No Brands Yet)

```
+----------------------------------------------------------+
| Brand Library                     [ + Create New Brand ]  |
| 브랜드 라이브러리                                           |
+----------------------------------------------------------+
|                                                           |
|              [UserCircle icon, 48px, muted]               |
|                                                           |
|              No brands yet                                |
|              아직 브랜드가 없습니다                          |
|                                                           |
|     Brands define who is speaking -- the voice,           |
|     identity, and audience for your content.              |
|     Create a brand to personalize your pipelines.         |
|                                                           |
|     브랜드는 콘텐츠의 음성, 정체성, 오디언스를 정의합니다.      |
|     파이프라인을 개인화하려면 브랜드를 만드세요.               |
|                                                           |
|            [ Create Your First Brand ]                    |
|                                                           |
+----------------------------------------------------------+
```

Uses the existing `EmptyState` component with:
- `icon`: `UserCircle` (from lucide-react -- matches the current Brand icon in settings nav)
- `title`: "No brands yet"
- `titleKo`: "아직 브랜드가 없습니다"
- `description`: "Brands define who is speaking -- the voice, identity, and audience for your content. Create a brand to personalize your pipelines."
- `descriptionKo`: "브랜드는 콘텐츠의 음성, 정체성, 오디언스를 정의합니다. 파이프라인을 개인화하려면 브랜드를 만드세요."
- `action`: Button linking to `/brands/new`

### Migration from Single-Brand Settings

For existing users who had brand data in the old `/settings/brand` form:
- Automatically create a Brand entity from their existing data on first visit
- Mark it as default
- Show a one-time toast notification: "Your brand settings have been migrated to the Brand Library." / "브랜드 설정이 브랜드 라이브러리로 마이그레이션되었습니다."

---

## 9. Interaction Flows

### 9.1 Create Brand

```
User clicks "Create New Brand" on /brands
  --> Navigate to /brands/new
  --> Empty form with grouped sections
  --> User fills in at minimum: Brand Name
  --> User optionally links platform accounts
  --> User clicks "Save Brand"
    --> Validate (name required)
    --> POST /api/brands
    --> Navigate to /brands
    --> Toast: "Brand created." / "브랜드가 생성되었습니다."
```

If it is the user's first brand, automatically set it as default.

### 9.2 Edit Brand

```
User clicks "Edit" on a brand card (or navigates to /brands/:id)
  --> Navigate to /brands/:id
  --> Form pre-filled with existing data
  --> User modifies fields
  --> User clicks "Save Changes"
    --> PATCH /api/brands/:id
    --> Navigate to /brands
    --> Toast: "Brand updated." / "브랜드가 수정되었습니다."
```

### 9.3 Set as Default

```
User opens overflow menu on a brand card
  --> Clicks "Set as Default"
  --> PATCH /api/brands/:id { isDefault: true }
  --> Previous default brand loses its default status
  --> Card updates: [DEFAULT] badge appears
  --> Toast: "{Brand name} set as default brand."
```

No confirmation dialog needed -- this is a non-destructive, easily reversible action.

### 9.4 Duplicate Brand

```
User opens overflow menu on a brand card
  --> Clicks "Duplicate"
  --> POST /api/brands (copy of current brand, name: "{original} (copy)")
  --> Navigate to /brands/:newId (edit page for the copy)
  --> Toast: "Brand duplicated." / "브랜드가 복제되었습니다."
```

The user lands on the edit page of the copy so they can immediately rename and customize it. This is more efficient than creating the copy and sending the user back to the list.

### 9.5 Delete Brand

This is a destructive action and requires confirmation.

**Confirmation dialog:**

```
+----------------------------------------------+
| Delete Brand / 브랜드 삭제                    |
| -------------------------------------------- |
|                                               |
| Are you sure you want to delete               |
| "Sarah Creates"?                              |
|                                               |
| 정말로 "Sarah Creates"를 삭제하시겠습니까?       |
|                                               |
| This brand is used by 4 pipelines.            |
| Those pipelines will lose their brand          |
| assignment.                                   |
|                                               |
| This action cannot be undone.                 |
| 이 작업은 되돌릴 수 없습니다.                    |
|                                               |
|                [Cancel]  [Delete Brand]        |
+----------------------------------------------+
```

**Rules:**
- Cannot delete the default brand if it is the only brand. Show disabled state with tooltip: "Cannot delete the only brand. Create another brand first." / "유일한 브랜드는 삭제할 수 없습니다."
- If deleting the default brand (and others exist), the next most recently used brand becomes default
- Delete button uses `variant="destructive"`
- On confirm: DELETE /api/brands/:id, navigate to /brands, toast: "Brand deleted." / "브랜드가 삭제되었습니다."

### 9.6 Brand Selection in Pipeline Builder

```
User reaches Step 3 (Settings) in Pipeline Builder
  --> Default brand is pre-selected (shown as compact card)
  --> User clicks "Change"
    --> Popover opens with brand list
    --> User selects a brand (radio)
    --> Popover closes
    --> Selected brand shown in compact card
  --> User continues to Step 4 (Review)
  --> Brand name appears in review summary
  --> User clicks "Save & Run"
    --> Pipeline saved with brandId reference
```

---

## 10. Mobile Considerations

### Brand Library (Mobile)

- Grid collapses to single column: `grid-cols-1`
- Search input takes full width
- Sort dropdown moves below search on a new row
- Brand cards stack vertically with full width
- "Create New Brand" button remains in PageHeader (shrinks to icon-only if needed)

```
Mobile Brand Library:
+---------------------------+
| Brand Library    [+]      |
| 브랜드 라이브러리           |
+---------------------------+
| [Search brands........]   |
| [Sort: Recent v]          |
+---------------------------+
| +-- Brand Card ---------+ |
| | [DEFAULT]             | |
| | Sarah Creates    [...] | |
| | "Tech educator..."   | |
| | [@] [YT] [LI]        | |
| | 4 pipelines           | |
| | [Edit]                | |
| +-----------------------+ |
|                           |
| +-- Brand Card ---------+ |
| | Agency Client    [...] | |
| | "B2B SaaS..."        | |
| | [@] [LI]             | |
| | 2 pipelines           | |
| | [Edit]                | |
| +-----------------------+ |
+---------------------------+
```

### Brand Create/Edit (Mobile)

- Form sections stack vertically with same field order
- Connected Platforms cards stack to single column
- Save/Cancel buttons stack: Save full-width on top, Cancel below
- Sticky bottom bar for Save/Cancel on mobile (prevents scroll-to-save):

```
Mobile Brand Edit (bottom bar):
+---------------------------+
| [Save Brand         ]     |  (full width, primary)
| [Cancel             ]     |  (full width, outline)
+---------------------------+
```

### Brand Picker in Pipeline Builder (Mobile)

On mobile, the brand picker popover converts to a bottom sheet (consistent with mobile select patterns):

```
+---------------------------+
| Select Brand              |
| 브랜드 선택                |
+---------------------------+
| [Search brands...]        |
| (o) Sarah Creates [DEF]   |
|     "Tech educator..."    |
| ( ) Agency Client         |
|     "B2B SaaS..."         |
| ( ) Side Project          |
|     "Gaming content..."   |
+---------------------------+
| [+ Create New Brand]      |
+---------------------------+
```

### Touch Targets

All interactive elements maintain minimum 44x44pt touch targets:
- Card overflow menu button: 44x44pt
- Radio buttons in brand picker: Full row is tappable (44pt height minimum)
- Platform icon links: Not interactive on cards (display only)
- Edit button: Standard `size="sm"` button (meets 44pt with padding)

---

## 11. Accessibility

### Keyboard Navigation

| Context | Key | Action |
|---|---|---|
| Brand Library | `Tab` | Move between cards, search, sort, create button |
| Brand Card | `Enter` | Open the brand (navigate to edit) |
| Brand Card | `Tab` to overflow, `Enter` | Open overflow menu |
| Overflow menu | Arrow keys | Navigate menu items |
| Overflow menu | `Escape` | Close menu |
| Brand Picker | Arrow keys | Navigate brand options |
| Brand Picker | `Enter`/`Space` | Select brand |
| Brand Picker | `Escape` | Close picker |
| Delete dialog | `Tab` | Move between Cancel and Delete |
| Delete dialog | `Escape` | Cancel (close dialog) |

### ARIA Labels

```html
<!-- Brand Library -->
<main aria-label="Brand Library">

<!-- Brand Card -->
<article aria-label="Brand: Sarah Creates">
  <span aria-label="Default brand" class="...">Default</span>

<!-- Overflow menu -->
<button aria-label="Brand actions for Sarah Creates" aria-haspopup="menu">

<!-- Brand Picker in Pipeline Builder -->
<div role="radiogroup" aria-label="Select brand">
  <div role="radio" aria-checked="true" aria-label="Sarah Creates (default)">
  <div role="radio" aria-checked="false" aria-label="Agency Client">

<!-- Delete confirmation -->
<div role="alertdialog" aria-labelledby="delete-title" aria-describedby="delete-desc">
```

### Color Contrast

All text meets WCAG 2.1 AA:
- Default badge text against badge background: 4.5:1 minimum
- Platform icons: Always paired with structural context (card layout), never color-only
- Muted foreground text (descriptions, helper text): Verified 4.5:1 against both light and dark backgrounds

### Screen Reader Announcements

- Creating brand: "Brand created successfully" (live region)
- Setting default: "{Name} is now the default brand" (live region)
- Deleting brand: "Brand deleted" (live region)
- Brand picker selection: "{Name} selected as brand" (aria-live)

---

## 12. File Structure & Implementation Plan

### New Files (FSD Architecture)

```
src/
  entities/
    brand/
      model/
        types.ts              # Brand, BrandPlatform, EmojiUsage types
      ui/
        brand-card.tsx         # BrandCard component
        brand-card-skeleton.tsx # Loading skeleton
        brand-compact-card.tsx # Compact card for pipeline builder selector
      index.ts                # Public exports

  widgets/
    brand-library/
      ui/
        brand-library-content.tsx  # Full brand library view (list + filter)
        brand-library-skeleton.tsx # Loading skeleton
      index.ts

    brand-form/
      ui/
        brand-form-content.tsx   # Create/edit form
      store/
        use-brand-form.ts        # Zustand store for form state
      index.ts

  app/
    brands/
      page.tsx                   # /brands route
      new/
        page.tsx                 # /brands/new route
      [id]/
        page.tsx                 # /brands/:id route
```

### Modified Files

| File | Change |
|---|---|
| `src/shared/config/routes.ts` | Add BRANDS, BRAND_NEW, BRAND_DETAIL routes; remove SETTINGS_BRAND |
| `src/shared/config/navigation.ts` | Add Brands to PRIMARY_NAV with `UserCircle` icon; remove from settings |
| `src/widgets/layout/ui/sidebar.tsx` | No change (reads from navigation config) |
| `src/widgets/layout/ui/mobile-bottom-bar.tsx` | No change (Brands accessible via "More") |
| `src/widgets/settings/ui/settings-layout.tsx` | Remove Brand from NAV_ITEMS |
| `src/widgets/settings/index.ts` | Remove BrandContent export |
| `src/widgets/settings/ui/brand-content.tsx` | Delete file (replaced by brand-form) |
| `src/app/settings/brand/page.tsx` | Replace with redirect to /brands |
| `src/widgets/pipeline-builder/store/use-builder-form.ts` | Add `brandId` and `setBrandId` |
| `src/widgets/pipeline-builder/ui/step-settings.tsx` | Add Brand selector before Style Profile |
| `src/widgets/pipeline-builder/ui/step-review.tsx` | Add Brand to summary |
| `src/widgets/settings/ui/defaults-content.tsx` | Add "Default Brand" selector (select dropdown) |

### Implementation Order

1. **Types & Routes** -- Define Brand types, add routes, update navigation config
2. **Entity Layer** -- Build BrandCard, BrandCompactCard, skeleton components
3. **Brand Library Widget** -- Build the list view with search, sort, empty state
4. **Brand Form Widget** -- Build create/edit form with grouped sections
5. **App Routes** -- Wire up `/brands`, `/brands/new`, `/brands/:id` pages
6. **Pipeline Builder Integration** -- Add brand selector to Step 3, update store, update review
7. **Settings Cleanup** -- Remove old brand settings page, add redirect, update defaults
8. **Navigation Update** -- Add Brands to PRIMARY_NAV, remove from settings sub-nav

---

## Appendix A: Design Decisions Log

| Decision | Chosen | Rejected Alternative | Rationale |
|---|---|---|---|
| Navigation placement | Top-level `/brands` | Keep in Settings | Brand is a collection entity, not a one-time config |
| Create/Edit layout | Single page with sections | Multi-step wizard | 8 fields is moderate; wizard is overkill; sections provide enough grouping |
| Platform connection | Assign from global connections | Per-brand OAuth | Simpler UX; avoids duplicate OAuth flows; global connection with per-brand assignment |
| Brand picker in builder | Popover with radio list | Modal or full page | Lightweight selection; user picks from a short list; consistent with style selector |
| Default brand behavior | One default, auto-selected in builder | No default concept | Reduces friction for the common case (most users use one brand most of the time) |
| Delete confirmation | Dialog with pipeline impact warning | No confirmation | Destructive action with downstream effects warrants confirmation |
| Emoji usage field | Radio group (4 options) | Free text | Structured input is easier for AI to interpret consistently |
| Perspective field | Select dropdown (5 options) | Free text | Constrained options ensure consistent AI behavior |

## Appendix B: Future Considerations (Not in MVP)

- **Brand analytics**: Usage over time, content performance per brand
- **Brand templates**: Pre-built brand profiles for common archetypes (e.g., "Tech Educator", "E-commerce Brand")
- **Brand AI assistant**: "Describe your brand in a few sentences and we'll fill in the fields"
- **Brand collaboration**: Share brands with team members, role-based editing
- **Brand versioning**: Track changes over time, revert to previous versions
- **Brand cloning across accounts**: Export/import brand configurations
