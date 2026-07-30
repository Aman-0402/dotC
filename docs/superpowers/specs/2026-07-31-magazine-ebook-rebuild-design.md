# C Programming Ebook — Magazine-Style Rebuild

Date: 2026-07-31

## Context

Previous site (Phase 2 components, sidebar+navbar+SPA-router build) has been
wiped from disk (not committed) to start fresh. New direction: clean
docs/magazine-style static ebook, core reading experience only (no quiz,
notes, bookmarks, progress tracking, or Monaco editor in this phase).

## Tech Stack

Plain HTML/CSS/vanilla JS. No build tool, no framework. Static-file hostable.

## Content Model

Separate static HTML file per lesson (not SPA/router, not Markdown-driven).
Landing page → Table of Contents page → individual lesson pages.

## File Layout

```
dotC/
├── index.html                  # Landing page (hero image + CTA → TOC)
├── toc.html                    # Table of contents (chapters → lessons list)
├── lessons/
│   └── lesson-template.html    # Reusable skeleton, empty placeholders
├── css/
│   ├── variables.css           # Light + dark theme tokens
│   ├── base.css
│   ├── layout.css              # Sidebar + navbar grid
│   ├── components.css          # Code block, buttons, TOC list, prev/next
│   └── theme.css               # Light/dark toggle rules
├── js/
│   ├── theme.js                # Toggle + localStorage persistence
│   ├── sidebar.js              # Active-lesson highlight, builds sidebar from toc.json
│   └── nav.js                  # Prev/next wiring
├── data/
│   └── toc.json                # Chapter/lesson structure (title, path)
├── assets/
│   └── landing page.png
└── vendor/
    └── prism.js + prism.css    # Syntax highlighting (or CDN)
```

## Pages

**index.html (landing)** — hero image full-bleed, title/tagline overlay,
single CTA button "Start Reading" → toc.html. No navbar.

**toc.html** — navbar (logo, theme toggle) at top. Chapter list, each
chapter expandable via native `<details>` to show its lessons. Click lesson
→ its page.

**lesson-template.html** — three-zone layout:
- Left: persistent sidebar (chapter/lesson tree, current lesson highlighted,
  collapses to hamburger on mobile)
- Top: thin navbar (breadcrumb: Chapter > Lesson, theme toggle, link back to
  TOC)
- Main: lesson content area (title, body text, code blocks via Prism,
  prev/next buttons pinned at bottom)

## Shared JS Behaviors

- `theme.js` — reads/writes `localStorage`, toggles `data-theme` attr on
  `<html>`, defaults to light.
- `sidebar.js` — walks `data/toc.json`, builds sidebar nav on every lesson
  page, marks current page active by matching URL.
- `nav.js` — computes prev/next lesson from `toc.json` order, wires bottom
  buttons.

## Theme & Typography

**Light (default):** off-white/cream background (`#faf8f5`), near-black
text, large editorial headings (serif or humanist-sans), blue accent
(`#2563eb`-ish) for links/buttons. Code blocks: light-gray box, Prism
light-friendly theme.

**Dark:** near-black background (`#0d1117`-ish), matches landing page's
neon-blue accent, Prism dark theme (e.g. tomorrow-night). Toggle icon
(sun/moon) in navbar, persists via localStorage, defaults to light on first
visit.

## Content Workflow

User supplies lesson content (text + code). For each new lesson:
1. Create `lessons/<slug>.html` from the template.
2. Add entry to `data/toc.json`.
3. Sidebar and prev/next update automatically (read from `toc.json`) — no
   other file touched per new lesson.

## Testing

Manual: open `index.html` via local static server (or `file://`), click
through landing → TOC → lesson → prev/next → theme toggle. No automated
tests for static markup/CSS.

## Out of Scope (this phase)

Quiz cards, notes panel, bookmarks, progress tracking, Monaco code editor,
search. May return in a later phase per user request.
