# Phase 2 — Batch 1 Components Design

**Date:** 2026-07-28
**Scope:** Sidebar, Top Navbar, Progress Card, Lesson Card (core shell components). Batches 2 and 3 (content/interactive, supporting components) are separate future specs.

## Goals

Build the four Phase 2 "core shell" components that every later page depends on: Sidebar navigation, Top Navbar, a Progress Card, and a Lesson Card. Wire them into a real Home page so they're visually verifiable, using temporary dummy lesson data (Phase 1 rule: no real lesson content yet — that's Phase 4).

## Architecture

- New `js/components/` folder — one file per component, each exporting a pure render function that returns an HTML string (or mounts into a container). No framework, matches existing vanilla ESM module style from Phase 1.
- New `css/components.css` — all Phase 2 component styles, linked from `index.html` after `theme.css`.
- `js/components/sidebar.js` replaces the current inline render in `js/sidebar.js` (Phase 1 stub). `js/sidebar.js` is removed once the new component is wired in.
- Home route (`#/` in `main.js`) rewired to render Progress Card + Lesson Card grid instead of the Phase 1 placeholder text.

## Components

### Sidebar (`js/components/sidebar.js`)

- Renders topics as an accordion: each topic header toggles its lesson list open/closed.
- Expand state persisted to `localStorage` key `sidebar-expanded` — array of open topic ids, restored on load.
- Completed lessons (per `progress.js` → `isLessonComplete(lessonId)`): link text renders in `--color-success` (#22C55E) and gets a trailing ✓ character.
- Still fetches `data/nav.json` the same way the Phase 1 stub did.

### Top Navbar (`js/components/navbar.js`)

- Extends the existing navbar markup (sidebar toggle, search, theme toggle stay as-is, untouched).
- Adds a breadcrumb slot between the sidebar toggle and search: `Topic Name / Lesson Title`.
- Breadcrumb updates via a router callback — router announces current route, navbar looks up topic/lesson title from nav data and re-renders the breadcrumb text.
- On the home route, breadcrumb shows just `Home` (no topic/lesson).

### Progress Card (`js/components/progress-card.js`)

- Card container: 18px radius, soft shadow, 24px padding (per design system).
- Title "Your Progress", thin 8px progress bar (track `--color-border`, fill `--color-primary`), caption text "X of Y lessons complete".
- X = count of completed lessons from `progress.js`. Y = total lesson count flattened from `nav.json` topics.

### Lesson Card (`js/components/lesson-card.js`)

- Icon-led layout: 36×36 rounded-10px icon block showing topic initials (e.g. "JS"), background `--color-primary`, white text.
- Below icon: lesson title (16px, 600 weight), then subtitle "Topic · Level" (12px, muted).
- Completed state: small green (`--color-success`) checkmark badge overlapping the icon block's bottom-right corner. Icon block background stays primary blue — only the badge is added, no recolor of the block itself.
- Clicking a card navigates to `#/lesson/:id` via `navigateTo()` from `router.js`.

## Home Page Wiring

- `main.js` home route handler:
  1. Fetch `nav.json`, flatten lessons.
  2. Render Progress Card into `#main-content`.
  3. Render a 3-column grid (12px gap) of Lesson Cards below it — layout "A" (stacked: progress card on top, grid below), confirmed via visual mockup.
- Grid collapses responsively at the existing `768px` breakpoint already defined in `layout.css` (single column).

## Data

- `data/nav.json` gets temporary dummy content: 2–3 topics, 2–3 lessons each, placeholder titles (e.g. "Variables and Data Types"), a `level` field per lesson (e.g. "Beginner"). Marked with a `"_temp": true` key at the root so it's easy to find and strip before Phase 4 real content work begins.

## Out of Scope (this spec)

- Batch 2 components (Code Block, Monaco Editor, Practice Box, Quiz Card, Table, Accordion primitive, Modal)
- Batch 3 components (Notes Panel, Bookmark Panel, Search Result, Timeline, Memory Diagram, Alert Box)
- Real lesson content (Phase 4)
- Topic detail page / routing beyond `/` and `/lesson/:id` placeholder

## Verification Plan

- Reload local dev server, confirm:
  - Sidebar accordion expands/collapses, state survives page refresh
  - Calling `markLessonComplete('some-id')` in devtools console reflects green+✓ in sidebar and checkmark badge on matching Lesson Card
  - Progress Card percentage/count matches manually-completed lessons
  - Breadcrumb shows "Home" on `/`, updates when navigating (once lesson route exists)
  - Resize below 768px: grid goes single-column, sidebar becomes overlay (existing Phase 1 behavior)
