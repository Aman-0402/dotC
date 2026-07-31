# AGENTS.md — dotC (C Programming Ebook)

## What this is

A static, magazine-style ebook teaching C programming. Plain HTML/CSS/vanilla
JS — no build tool, no framework, no bundler. Hostable as-is from the
repo root.

## Tech stack

- HTML5, CSS3 (custom properties for theming), vanilla ES5-style JS (no
  modules, no `let`/`const` in shared scripts — matches existing style)
- Prism.js via CDN for C/SQL/Bash/Python syntax highlighting, theme-swapped
  between `prism.min.css` (light) and `prism-tomorrow.min.css` (dark)
- No package.json, no npm dependencies. `npx serve .` used only for local
  manual verification, never committed as a dependency.

## File structure

```
dotC/
├── index.html              # Landing page (hero image + "Start Reading" CTA)
├── toc.html                 # Table of contents — one column per Unit, collapsible chapters
├── lessons/
│   ├── lesson-template.html # Skeleton used as the starting point for new lessons
│   └── unitN-<slug>.html    # One file per lesson
├── css/
│   ├── variables.css        # Light + dark theme tokens
│   ├── base.css
│   ├── layout.css           # Sidebar + navbar grid, sticky sidebar
│   ├── components.css       # Code blocks, tables, TOC, sidebar list, .viz visualizer styles
│   └── theme.css            # Theme-toggle button styling
├── js/
│   ├── theme.js              # Light/dark toggle, persists via localStorage, swaps Prism stylesheet
│   ├── sidebar.js             # Builds sidebar nav from data/toc.json, collapsible per-unit <details>
│   └── nav.js                 # Prev/next lesson links, computed from data/toc.json order
├── data/
│   └── toc.json              # Single source of truth: chapters (Units) → lessons (title, path)
├── assets/
│   └── landing page.png
└── docs/superpowers/
    ├── specs/                 # Design specs (brainstorming skill output)
    └── plans/                 # Implementation plans (writing-plans skill output)
```

## Content workflow (per lesson)

User delivers lesson content unit-wise (topic-by-topic, pasted directly).
For each new lesson:

1. Create `lessons/unitN-<slug>.html` from the existing template pattern —
   navbar breadcrumb, `<aside class="sidebar">`, `<main class="lesson-main">`
   with the content, `<nav class="lesson-nav">` placeholder, then the
   standard 5 `<script>` tags (Prism core + language components, theme.js,
   sidebar.js, nav.js).
2. Escape `<`, `>`, `&` inside `<pre><code>` blocks (C code with
   `#include <stdio.h>`, `&`, generics, etc. — must be HTML-escaped or the
   browser mis-parses the page).
3. Add an entry to `data/toc.json` under the correct Unit chapter
   (`{"title": ..., "path": "lessons/unitN-<slug>.html"}`). Sidebar and
   prev/next links update automatically — no other file needs touching.
4. Validate `data/toc.json` with `node -e "JSON.parse(...)"`.
5. Serve locally (`npx --yes serve . -l 5500`) and curl/verify the new page
   and its linked assets return 200.
6. Commit and push directly to `main` (established convention for this
   repo — no feature branches, no worktrees).

## Design/plan docs

Non-trivial structural changes (e.g. the initial magazine-style rebuild,
the sorting-algorithm visualizer) go through the brainstorming →
writing-plans → execution flow, with specs saved to
`docs/superpowers/specs/` and plans to `docs/superpowers/plans/`. Individual
lesson content drops do not need a spec/plan — they follow the content
workflow above directly.

## Progress so far

**Site scaffold:** landing page, TOC (multi-column, collapsible per-unit),
lesson template, sidebar/nav/theme scripts, dark-mode-aware Prism syntax
highlighting. See `docs/superpowers/specs/2026-07-31-magazine-ebook-rebuild-design.md`.

**Interactive sorting visualizer:** inline bar-chart step-through widget
(Shuffle/Play/Step/Reset/slider) embedded in sorting-algorithm lessons,
one self-contained script per lesson (no shared JS engine, by design). See
`docs/superpowers/specs/2026-08-01-sorting-visualizer-design.md`.

**Interactive linked-list pointer visualizer:** node/pointer step-through
widget (flexbox node boxes + CSS-drawn arrows, no SVG) embedded in
linked-list lessons, page-local `<style>` block + self-contained script per
lesson (same no-shared-engine philosophy as the sorting visualizer). The
Introduction lesson uses Insert/Delete mode tabs; the Traversal lesson
reuses the same `.ll-node`/`.ll-arrow` visual pattern for a single moving
`temp` pointer instead. See
`docs/superpowers/specs/2026-08-01-linked-list-visualizer-design.md`.

**Lesson content — 75 lessons across 8 units:**

| Unit | Topic | Lessons |
| --- | --- | --- |
| 1 | Programming Fundamentals & C Basics | 14 |
| 2 | C Language Deep Dive (tokens, types, operators, storage classes, I/O) | 19 |
| 3 | Control Structures & Arrays | 5 |
| 4 | Strings, Functions & Pointers | 4 |
| 5 | Structures, File Handling & Advanced Concepts | 8 |
| 6 | Algorithm Analysis & Arrays (Part 2) | 4 |
| 7 | Sorting & Recursion | 16 |
| 8 | Linked Lists (in progress) | 5 |

Unit 7 is complete: all 8 sorting algorithms (Introduction, Bubble,
Selection, Insertion, Merge, Quick, Heap, Counting, Radix) plus all 7
recursion topics (Introduction, Recursive Functions, Recursion Tree, Tail
Recursion, Head Recursion, Indirect Recursion, Applications of Recursion).

Unit 8 is the current unit being written — Introduction to Linked Lists
(with Insert/Delete visualizer), Dynamic Memory Concept, Advantages and
Disadvantages of Linked Lists, Singly Linked List – Creation, and Singly
Linked List – Traversal (with pointer-walk visualizer) are done. Remaining
topics (Insertion, Deletion, Searching, Doubly/Circular variants, etc.)
are still to come.

## Testing

No automated test suite — this is static markup/CSS/JS. "Testing" means:
open the page via a local static server (not `file://`, since `fetch()`
calls for `toc.json` need HTTP) and manually verify rendering, navigation,
and (for interactive widgets) button behavior.
