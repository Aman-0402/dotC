# Phase 2 — Batch 3 Components Design

**Date:** 2026-07-28
**Scope:** Notes Panel, Bookmark Panel, Search Result (upgrade), Timeline, Memory Diagram, Alert Box. This is the final batch of Phase 2 (UI Components) — after this, Phase 3 (Lesson Engine) begins.

## Goals

Build the remaining "supporting" Phase 2 components. Two of these (Notes Panel, Bookmark Panel) intentionally stay UI-shell-only, consistent with Batch 2's Practice Box precedent — real persistence/wiring logic is Phase 5's job.

## Components

### Notes Panel (`js/components/notes-panel.js`)

- `mountNotesPanel(container)` — renders a `.card` containing a `<textarea>` and a small status line ("Saved" / "Saving...").
- No actual save logic — the status line is static placeholder text for now. Phase 5 (Notes, Autosave) wires real localStorage persistence and the Saving/Saved state transitions.

### Bookmark Panel (`js/components/bookmark-panel.js`)

- `renderBookmarkPanel(bookmarkedLessons)` — renders a `.card` with a stacked list (⭐ + lesson title, per approved mockup) of already-bookmarked lessons. Takes the list as a plain argument — doesn't read localStorage itself, keeping it a pure render function (consistent with `renderProgressCard`'s style from Batch 1, despite that one's later-noted impurity — this one takes data as input explicitly).
- `toggleBookmark(lessonId)` — a separate utility function that reads/writes a `bookmarks` localStorage key (array of lesson ids). Exported for Phase 3/4 to wire to an actual star button on a real lesson page — no such button exists yet in this batch.
- `getBookmarks()` — reads the `bookmarks` localStorage key, returns the array (empty array if unset).

### Search Result (upgrade to existing `js/search.js`)

- Modifies the existing Phase 1 file (not a new component file) — the `initSearch` function's result-rendering changes from a plain `<li><a>` to a richer markup: lesson title + a small topic-breadcrumb label above/beside it (per approved mockup), reusing the flattened lesson list already passed into `initSearch`. Requires passing topic titles alongside lessons (currently `initSearch` only receives flattened `lessons`, not their parent topic) — the call site in `main.js` needs a small adjustment to pass topic-annotated lesson data.
- Flagged as a deviation from "batch = new files" since it touches existing Phase 1 code — necessary because Search Result isn't a standalone component, it's a rendering upgrade to search.

### Timeline (`js/components/timeline.js`)

- `renderTimeline(steps)` — `steps` is `{title, description}[]`. Renders numbered circular dots connected by a vertical line (per approved mockup), last step has no trailing line segment.

### Memory Diagram (`js/components/memory-diagram.js`)

- `renderMemoryDiagram(entries)` — `entries` is `{name, value, address}[]`. Thin wrapper: calls Batch 2's `renderTable({headers: ['Name', 'Value', 'Address'], rows: entries.map(e => [e.name, e.value, e.address])})` — reuses the existing Table component rather than duplicating table markup, per approved "table-row style" mockup decision. No sort wiring needed for typical small memory-diagram use, but nothing prevents a caller from also calling `initTable` on it if useful later.

### Alert Box (`js/components/alert-box.js`)

- `renderAlertBox({ variant, message })` — `variant` is one of `'info' | 'warning' | 'success' | 'danger'`. Left accent bar + tinted background (per approved mockup), each variant mapped to its design-system color and a fixed emoji icon (ℹ️/⚠️/✅/🚫).

## Out of Scope (this spec)

- Real Notes/Bookmark persistence and Saving/Saved state transitions (Phase 5)
- Wiring any of these components into an actual lesson page (Phase 3/4 job, except the Search Result upgrade which does touch `main.js`'s existing search wiring)
- A UI trigger (star button) for `toggleBookmark` — no lesson page exists yet to place one on

## Verification Plan

Same as prior batches: no browser available to implementer subagents — static verification (file reads, `node --check`, export/import consistency checks). Human does the real browser check after. This is the last Phase 2 batch, so after this the human should do a full pass over all Phase 2 components before Phase 3 starts.
