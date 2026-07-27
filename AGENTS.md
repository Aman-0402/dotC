# dotC — Agent Instructions

## What this project is

A single-topic interactive C Programming ebook/learning platform. Not a multi-language course catalog — all content, examples, and the future DSA/LeetCode section are C only.

## Tech stack

- Vanilla HTML/CSS/JS (ESM, `type="module"`), no build step, no framework, no bundler.
- Monaco Editor and Prism.js loaded via CDN `<script>` tags in `index.html`.
- No test framework in this repo. Verification is manual: `node --check` for syntax, a local static server (`python -m http.server 8080`) + browser for behavior.

## Folder structure

```
css/
  variables.css     # design tokens (colors, fonts, radius, shadow)
  base.css          # reset + typography
  layout.css        # app shell grid (sidebar/navbar/main), responsive breakpoint 768px
  theme.css         # light/dark via [data-theme] attribute + CSS vars
  components.css    # all component styles, appended to (never reordered) as components are added
js/
  main.js           # entry point, bootstrap()
  router.js         # hash-based router (registerRoute/registerNotFound/initRouter/navigateTo)
  theme.js          # theme toggle, persists to localStorage key "theme"
  progress.js        # lesson completion tracking, localStorage key "progress"
  search.js         # search-as-you-type over lesson titles
  components/       # one file per UI component (render*/mount*/init* functions)
data/
  nav.json          # sidebar topic/lesson structure (currently _temp placeholder data)
docs/superpowers/
  specs/            # design specs (one per brainstorming session)
  plans/            # implementation plans (one per batch/feature)
```

## Development process (mandatory — do not skip)

This project is built phase-by-phase. Do not jump ahead or build a later phase's work early without the user explicitly confirming the deviation.

1. Project Foundation (done)
2. UI Components (done — ~20 components across 3 batches)
3. Lesson Engine (renderer that turns lesson JSON into a page)
4. Lesson Content (one lesson at a time, written only after the engine exists)
5. Practice System
6. LeetCode System (DSA problems, solved in C)
7. Polish

For any new feature: brainstorm (clarifying questions, propose options, present design) → write a spec doc → write an implementation plan → execute (subagent-driven or inline) with spec + code-quality review per task.

## Workflow rules

- **Every completed task/batch gets committed AND pushed to `origin/main` directly** — no feature branches, no waiting for extra confirmation each time. Work happens straight on `main`.
- **No `Co-Authored-By` trailer in commit messages**, ever, for this repo.
- Don't guess on ambiguous requirements — ask.

## Known tech debt (as of Phase 2 completion, 2026-07-28)

Fix these as part of Phase 3, don't silently carry them forward:

1. **No shared HTML-escaping utility.** Every component interpolates content strings raw into template literals. Fine while content is static/trusted; becomes a real risk once real lesson data flows through in volume.
2. **Idempotency-guard convention (`dataset.bound` before `addEventListener`) is only applied to `code-block.js`, `table.js`, `accordion.js`.** Other components with DOM-scoped listeners don't have it — be careful about calling `mount*`/`init*` functions more than once on the same DOM.
3. **Alert Box's variant colors are hardcoded `rgba()` strings in JS**, bypassing the dark-mode CSS-variable system in `theme.css`. Will likely look wrong in dark mode until refactored into CSS classes.

## Design system

Primary `#2563EB` / hover `#1D4ED8` · Success `#22C55E` · Warning `#F59E0B` · Danger `#EF4444` · Background `#F8FAFC` (dark `#0F172A`) · Sidebar `#FFFFFF` (dark `#1E293B`) · Border `#E5E7EB` (dark `#334155`). Fonts: Inter (sans), JetBrains Mono (code). Cards: 18px radius, soft shadow, 24px padding. Buttons: 12px radius, 48px height. Animations: 200ms ease, translateY(-2px), opacity fade, scale(1.02). Inspired by GitHub/Linear/Vercel/Raycast/VS Code — no glassmorphism, neon, heavy gradients, or Bootstrap-default look.
