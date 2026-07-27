# Phase 2 — Batch 2 Components Design

**Date:** 2026-07-28
**Scope:** Code Block, Monaco Editor wrapper, Practice Box, Quiz Card, Table, Accordion primitive, Modal. Batch 3 (Notes Panel, Bookmark Panel, Search Result, Timeline, Memory Diagram, Alert Box) is a separate future spec.

## Goals

Build the remaining "content/interactive" Phase 2 components. Content on this platform is C Programming only (single-topic ebook, confirmed 2026-07-28) — Code Block syntax highlighting only needs to support C.

## Architecture

- One new file per component under `js/components/`, consistent with Batch 1's pattern.
- CSS appended to the existing `css/components.css`.
- Two CDN dependencies added to `index.html`: Prism.js (syntax highlighting, C grammar only) and Monaco's loader (base URL already stubbed in Phase 1 as `window.MONACO_CDN_BASE`).
- A `#modal-root` container div added to `index.html` for the Modal component to mount into.

## Components

### Code Block (`js/components/code-block.js`)

- Read-only display of a C code snippet. Not editable — Monaco is the separate editable component.
- `renderCodeBlock(code)` returns an HTML string: a `<pre><code class="language-c">` block (escaped) plus a floating copy button (📋 icon, top-right, no header bar).
- After insertion into the DOM, caller must invoke `Prism.highlightAllUnder(container)` (Prism's own API) to tokenize — this component exposes a second export `highlightCodeBlocks(container)` that does this, since `Prism` is a global loaded via CDN script tag, not an ES import.
- Copy button: on click, copies the raw (un-highlighted) code text via `navigator.clipboard.writeText`, briefly swaps button text to "Copied" for 1.5s, then reverts.

### Monaco Editor wrapper (`js/components/monaco-editor.js`)

- `mountMonacoEditor(container, { value, language = 'c' })` — loads the AMD loader script from `window.MONACO_CDN_BASE + '/vs/loader.js'` (once, cached via a module-level promise so repeated calls don't re-inject the script tag), then creates a Monaco editor instance in `container` with the given value/language.
- Returns the Monaco editor instance so callers (Practice Box) can call `.getValue()` later.
- No practice-check/diff logic lives here — pure mount utility.

### Practice Box (`js/components/practice-box.js`)

- UI shell only, per plan: `mountPracticeBox(container, { starterCode })` renders a `.card` containing: a mounted Monaco editor (via `mountMonacoEditor`), a "Check" button below it, and an empty `.practice-output` div below that.
- Check button click handler currently just logs the editor's current value to console (`console.log('[practice-box] check clicked:', editor.getValue())`) — explicitly a placeholder. Phase 5 (Practice System: Retype Practice, Progress Checker, Autosave) replaces this with real logic.

### Quiz Card (`js/components/quiz-card.js`) — full multi-question flow (intentional Phase 3 pull-forward)

- `mountQuiz(container, questions)` where `questions` is `{ question: string, options: string[], correctIndex: number, explanation: string }[]`.
- Renders one question at a time. Clicking an option: locks in that answer, marks the clicked option and the correct option with green ✓ / red ✗ circular icon markers (per approved mockup), reveals the explanation caption, reveals a "Next Question →" button.
- Internal state: current question index, running correct-count. After the last question's "Next Question" click, replaces the rendered question with a summary card: "You scored X of Y".
- This component owns real state/sequencing logic — explicitly different from Practice Box's shell-only scope. Recorded as an intentional deviation from strict phase separation (user-confirmed 2026-07-28): Phase 3's Lesson Engine will later just invoke `mountQuiz` rather than re-building this logic.

### Table (`js/components/table.js`)

- `renderTable({ headers, rows })` → returns an HTML string. `headers` is `string[]`, `rows` is `string[][]`.
- Minimal style (divider lines only, no bordered box/zebra, per approved mockup).
- Each header cell is clickable: toggles ascending/descending sort on that column (auto-detects numeric vs string comparison per column by checking if all cell values in that column parse as numbers), shows a ⇅/▲/▼ indicator. Sorting re-renders the `<tbody>` in place (event delegation on the table element, not a full component re-mount).

### Accordion primitive (`js/components/accordion.js`)

- `mountAccordion(container, sections)` where `sections` is `{ title: string, content: string }[]` (content is raw HTML string, caller's responsibility to have it be safe/trusted).
- Each section's header toggles independently — multiple sections can be open simultaneously (per approved mockup), unlike Sidebar's own bespoke single-topic-list accordion (Batch 1) which stays as-is, unrelated to this generic primitive.
- Intended future use: Phase 3/4 lesson content sections like "Common Mistakes", FAQ-style blocks — not wired to anything yet in this batch.

### Modal (`js/components/modal.js`)

- `openModal({ title, body, onConfirm })` — `body` is a raw HTML string (or a DOM node), `onConfirm` optional callback wired to a "Confirm" button.
- Renders into `#modal-root` (new div added to `index.html`, sibling of `.app-shell`).
- Centered card, dark semi-transparent backdrop (per approved mockup).
- Closes via: Esc keydown (removed on close), backdrop click, or ✕ button click. `closeModal()` is also exported directly for programmatic close.
- Not wired to any trigger yet in this batch — this batch only builds the reusable primitive.

## Out of Scope (this spec)

- Batch 3 components (Notes Panel, Bookmark Panel, Search Result, Timeline, Memory Diagram, Alert Box)
- Real Phase 5 Practice Box logic (retype-check, autosave, progress)
- Wiring Quiz Card / Accordion / Modal into actual lesson pages (Phase 3/4 job) — this batch builds and statically demos each component, doesn't integrate them into the Home page or a real lesson yet
- Table row-add/edit, pagination

## Verification Plan

No browser available to implementer subagents in this environment — verification is static (file reads, `curl` against CDN URLs to confirm they resolve, export-name checks). Human (you) does the actual visual/interactive browser check after each task, same as Batch 1.
