# Phase 2 Batch 3 Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Notes Panel (UI shell), Bookmark Panel (UI shell + toggle utility), upgrade Search Result rendering, Timeline, Memory Diagram (reuses Table), and Alert Box — the final batch of Phase 2 (UI Components).

**Architecture:** Vanilla ESM modules under `js/components/`, CSS appended to `css/components.css`. One task (Search Result) modifies existing Phase 1 files (`js/search.js`, `js/main.js`) rather than adding a new file, since it's an upgrade to existing search rendering, not a standalone component.

**Tech Stack:** Vanilla JS (ESM). No test framework in this repo — verification is manual (implementer does static checks; human does the real browser check after, per established project convention).

---

### Task 1: Notes Panel (UI shell)

**Files:**
- Create: `js/components/notes-panel.js`

- [ ] **Step 1: Write the component**

```javascript
export function mountNotesPanel(container) {
  container.innerHTML = `
    <div class="card notes-panel">
      <div class="notes-panel-title">Notes</div>
      <textarea class="notes-panel-textarea" placeholder="Write your notes here..."></textarea>
      <div class="notes-panel-status">Saved</div>
    </div>
  `;
}
```

- [ ] **Step 2: Add CSS to css/components.css**

Append to `css/components.css`:

```css
.notes-panel-title {
  font-weight: 600;
  margin-bottom: 10px;
}

.notes-panel-textarea {
  width: 100%;
  min-height: 140px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 10px 12px;
  font-family: var(--font-sans);
  font-size: 13px;
  resize: vertical;
  background: var(--color-bg);
  color: var(--color-text);
}

.notes-panel-status {
  margin-top: 8px;
  font-size: 12px;
  color: var(--color-border);
}
```

- [ ] **Step 3: Manual verify**

Run: `node --check js/components/notes-panel.js`
Expected: no output (valid syntax)

- [ ] **Step 4: Commit**

```bash
git add js/components/notes-panel.js css/components.css
git commit -m "Add Notes Panel UI shell (no persistence yet, Phase 5 job)"
git push
```

---

### Task 2: Bookmark Panel (UI shell + toggle utility)

**Files:**
- Create: `js/components/bookmark-panel.js`

- [ ] **Step 1: Write the component**

```javascript
const STORAGE_KEY = 'bookmarks';

export function getBookmarks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

export function toggleBookmark(lessonId) {
  const bookmarks = getBookmarks();
  const index = bookmarks.indexOf(lessonId);
  if (index === -1) {
    bookmarks.push(lessonId);
  } else {
    bookmarks.splice(index, 1);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function renderBookmarkPanel(bookmarkedLessons) {
  const items = bookmarkedLessons.map(lesson => `
    <div class="bookmark-panel-item">⭐ <a href="#/lesson/${lesson.id}">${lesson.title}</a></div>
  `).join('');

  return `
    <div class="card bookmark-panel">
      <div class="bookmark-panel-title">Bookmarks</div>
      <div class="bookmark-panel-list">${items}</div>
    </div>
  `;
}
```

- [ ] **Step 2: Add CSS to css/components.css**

Append to `css/components.css`:

```css
.bookmark-panel-title {
  font-weight: 600;
  margin-bottom: 12px;
}

.bookmark-panel-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bookmark-panel-item {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}
```

- [ ] **Step 3: Manual verify**

Run: `node --check js/components/bookmark-panel.js`
Expected: no output (valid syntax)

Re-read the file: confirm `toggleBookmark` correctly adds when absent and removes when present (toggle, not just add), confirm `getBookmarks` returns `[]` (not `null`/throws) when the key has never been set.

- [ ] **Step 4: Commit**

```bash
git add js/components/bookmark-panel.js css/components.css
git commit -m "Add Bookmark Panel UI shell and toggleBookmark utility"
git push
```

---

### Task 3: Search Result upgrade (modifies existing Phase 1 files)

**Files:**
- Modify: `js/search.js`
- Modify: `js/main.js`

- [ ] **Step 1: Update js/search.js's result rendering**

In `js/search.js`, replace the line:

```javascript
    results.innerHTML = matches.map(l => `<li><a href="#/lesson/${l.id}">${l.title}</a></li>`).join('');
```

with:

```javascript
    results.innerHTML = matches.map(l => `
      <li>
        <a href="#/lesson/${l.id}">
          <span class="search-result-topic">${l.topicTitle}</span>
          ${l.title}
        </a>
      </li>
    `).join('');
```

- [ ] **Step 2: Update js/main.js to pass topic-annotated lessons**

In `js/main.js`, replace this line inside `bootstrap()`:

```javascript
  const allLessons = nav.topics.flatMap(t => t.lessons);
```

with:

```javascript
  const allLessons = nav.topics.flatMap(t => t.lessons.map(l => ({ ...l, topicTitle: t.title })));
```

This is safe for existing callers: `renderProgressCard(allLessons)` only reads `.id` from each lesson (still present), `initSearch(allLessons)` now has `.topicTitle` available on each lesson as needed by Step 1. `renderHome(nav, allLessons)` passes `nav.topics` (unchanged) to `renderLessonGrid`, and `allLessons` to `renderProgressCard` — neither breaks from the added `.topicTitle` field.

- [ ] **Step 3: Add CSS for the topic label**

Append to `css/components.css`:

```css
.search-result-topic {
  display: block;
  font-size: 11px;
  color: var(--color-primary);
  font-weight: 600;
}
```

- [ ] **Step 4: Manual verify**

Run: `node --check js/search.js` and `node --check js/main.js`
Expected: no output (valid syntax) for both

Re-read both files: confirm `l.topicTitle` is actually populated by the `allLessons` construction in `main.js` before `initSearch` ever runs (order of operations in `bootstrap()`), confirm no other consumer of `allLessons` breaks from the added field (check `renderProgressCard` in `js/components/progress-card.js` only destructures/uses `.id`).

- [ ] **Step 5: Commit**

```bash
git add js/search.js js/main.js css/components.css
git commit -m "Upgrade search results to show topic breadcrumb alongside lesson title"
git push
```

---

### Task 4: Timeline component

**Files:**
- Create: `js/components/timeline.js`

- [ ] **Step 1: Write the component**

```javascript
export function renderTimeline(steps) {
  const items = steps.map((step, i) => {
    const isLast = i === steps.length - 1;
    return `
      <div class="timeline-step">
        <div class="timeline-marker">
          <div class="timeline-dot">${i + 1}</div>
          ${isLast ? '' : '<div class="timeline-line"></div>'}
        </div>
        <div class="timeline-content">
          <div class="timeline-title">${step.title}</div>
          <div class="timeline-description">${step.description}</div>
        </div>
      </div>
    `;
  }).join('');

  return `<div class="timeline">${items}</div>`;
}
```

- [ ] **Step 2: Add CSS to css/components.css**

Append to `css/components.css`:

```css
.timeline-step {
  display: flex;
  gap: 12px;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.timeline-line {
  width: 2px;
  flex: 1;
  background: var(--color-border);
  min-height: 20px;
}

.timeline-content {
  padding-bottom: 16px;
}

.timeline-title {
  font-weight: 600;
  font-size: 13px;
}

.timeline-description {
  font-size: 12px;
  color: var(--color-border);
}
```

- [ ] **Step 3: Manual verify**

Run: `node --check js/components/timeline.js`
Expected: no output (valid syntax)

Re-read the file: confirm the last step in the array does NOT render a trailing `.timeline-line` (avoids a dangling line segment with nothing below it).

- [ ] **Step 4: Commit**

```bash
git add js/components/timeline.js css/components.css
git commit -m "Add Timeline component (numbered steps with connecting line)"
git push
```

---

### Task 5: Memory Diagram (reuses Table component)

**Files:**
- Create: `js/components/memory-diagram.js`

- [ ] **Step 1: Write the component**

```javascript
import { renderTable } from './table.js';

export function renderMemoryDiagram(entries) {
  return renderTable({
    headers: ['Name', 'Value', 'Address'],
    rows: entries.map(entry => [entry.name, entry.value, entry.address]),
  });
}
```

- [ ] **Step 2: Manual verify**

Run: `node --check js/components/memory-diagram.js`
Expected: no output (valid syntax)

Confirm `js/components/table.js` actually exports `renderTable` with the `{headers, rows}` shape this code assumes (check the file from Batch 2).

No new CSS needed — this reuses Table's existing `.data-table` styles.

- [ ] **Step 3: Commit**

```bash
git add js/components/memory-diagram.js
git commit -m "Add Memory Diagram component (thin wrapper over Table)"
git push
```

---

### Task 6: Alert Box component

**Files:**
- Create: `js/components/alert-box.js`

- [ ] **Step 1: Write the component**

```javascript
const VARIANTS = {
  info: { icon: 'ℹ️', color: '--color-primary', bg: 'rgba(37, 99, 235, 0.08)' },
  warning: { icon: '⚠️', color: '--color-warning', bg: 'rgba(245, 158, 11, 0.1)' },
  success: { icon: '✅', color: '--color-success', bg: 'rgba(34, 197, 94, 0.1)' },
  danger: { icon: '🚫', color: '--color-danger', bg: 'rgba(239, 68, 68, 0.1)' },
};

export function renderAlertBox({ variant, message }) {
  const config = VARIANTS[variant] || VARIANTS.info;

  return `
    <div class="alert-box" style="border-left-color: var(${config.color}); background: ${config.bg};">
      ${config.icon} ${message}
    </div>
  `;
}
```

- [ ] **Step 2: Add CSS to css/components.css**

Append to `css/components.css`:

```css
.alert-box {
  border-left: 4px solid;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 13px;
  margin-bottom: 8px;
}
```

- [ ] **Step 3: Manual verify**

Run: `node --check js/components/alert-box.js`
Expected: no output (valid syntax)

Re-read the file: confirm all 4 variants (`info`, `warning`, `success`, `danger`) map to the correct design-system CSS variable names (check `css/variables.css` for `--color-primary`, `--color-warning`, `--color-success`, `--color-danger` exact names), confirm the fallback to `VARIANTS.info` for an unrecognized variant string doesn't throw.

- [ ] **Step 4: Commit**

```bash
git add js/components/alert-box.js css/components.css
git commit -m "Add Alert Box component (info/warning/success/danger variants)"
git push
```

---

## Post-Plan Note

This is the final batch of Phase 2 (UI Components). After this batch, the human should do a full browser pass over all Phase 2 components (Batches 1-3) before Phase 3 (Lesson Engine) begins. No component built across all three batches has yet been wired into a real lesson page except: Sidebar, Navbar, Progress Card, Lesson Card (Batch 1, wired into Home page), and the Search Result upgrade (Batch 3, wired into existing search). Everything else (Code Block, Monaco Editor, Practice Box, Quiz Card, Table, Accordion, Modal, Notes Panel, Bookmark Panel, Timeline, Memory Diagram, Alert Box) exists as a standalone, demo-able-but-unwired module — Phase 3's Lesson Engine is what wires these into actual lesson content.
