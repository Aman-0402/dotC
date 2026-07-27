# Phase 2 Batch 1 Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Sidebar (accordion), Top Navbar (breadcrumb), Progress Card, and Lesson Card components, wire them into a real Home page using temporary dummy lesson data.

**Architecture:** Vanilla ESM modules under `js/components/`, one file per component, each exporting a render/mount function. Styles in new `css/components.css`. No build step, no test framework exists in this repo — verification is manual via local static server + browser devtools console, per project convention (static site, no package.json).

**Tech Stack:** Vanilla JS (ESM), CSS (custom properties from `css/variables.css`), existing `progress.js` / `router.js` / `theme.js` modules from Phase 1.

---

### Task 1: Temporary dummy lesson data

**Files:**
- Modify: `data/nav.json`

- [ ] **Step 1: Replace empty nav.json with temp dummy content**

```json
{
  "_temp": true,
  "topics": [
    {
      "id": "javascript",
      "title": "JavaScript",
      "lessons": [
        { "id": "js-variables", "title": "Variables and Data Types", "level": "Beginner" },
        { "id": "js-functions", "title": "Functions", "level": "Beginner" },
        { "id": "js-arrays", "title": "Arrays", "level": "Intermediate" }
      ]
    },
    {
      "id": "python",
      "title": "Python",
      "lessons": [
        { "id": "py-basics", "title": "Python Basics", "level": "Beginner" },
        { "id": "py-loops", "title": "Loops", "level": "Beginner" }
      ]
    },
    {
      "id": "sql",
      "title": "SQL",
      "lessons": [
        { "id": "sql-select", "title": "SELECT Statements", "level": "Beginner" }
      ]
    }
  ]
}
```

- [ ] **Step 2: Manual verify**

Run: `curl -s http://localhost:8080/data/nav.json` (dev server from Phase 1 already running on 8080; if not, run `python -m http.server 8080` from repo root)
Expected: valid JSON printed, `_temp: true`, 3 topics.

- [ ] **Step 3: Commit**

```bash
git add data/nav.json
git commit -m "Add temp dummy lesson data for Phase 2 component verification"
git push
```

---

### Task 2: components.css foundation

**Files:**
- Create: `css/components.css`
- Modify: `index.html:16` (add stylesheet link after theme.css)

- [ ] **Step 1: Create css/components.css with shared card base**

```css
.card {
  background: var(--color-sidebar);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: 24px;
  box-shadow: var(--shadow-card);
}
```

- [ ] **Step 2: Link it in index.html**

Modify `index.html`, after the existing `<link rel="stylesheet" href="./css/theme.css" />` line, add:

```html
  <link rel="stylesheet" href="./css/components.css" />
```

- [ ] **Step 3: Manual verify**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/css/components.css`
Expected: `200`

- [ ] **Step 4: Commit**

```bash
git add css/components.css index.html
git commit -m "Add components.css foundation with shared card style"
git push
```

---

### Task 3: Progress Card component

**Files:**
- Create: `js/components/progress-card.js`

- [ ] **Step 1: Write the component**

```javascript
import { getProgress } from '../progress.js';

export function renderProgressCard(allLessons) {
  const progress = getProgress();
  const completed = allLessons.filter(l => progress[l.id]).length;
  const total = allLessons.length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return `
    <div class="card progress-card">
      <div class="progress-card-title">Your Progress</div>
      <div class="progress-card-track">
        <div class="progress-card-fill" style="width: ${pct}%"></div>
      </div>
      <div class="progress-card-caption">${completed} of ${total} lessons complete</div>
    </div>
  `;
}
```

- [ ] **Step 2: Add its styles to css/components.css**

Append to `css/components.css`:

```css
.progress-card {
  margin-bottom: 16px;
}

.progress-card-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.progress-card-track {
  height: 8px;
  background: var(--color-border);
  border-radius: 4px;
  overflow: hidden;
}

.progress-card-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width var(--anim-duration) var(--anim-ease);
}

.progress-card-caption {
  font-size: 12px;
  color: var(--color-border);
  margin-top: 6px;
}
```

- [ ] **Step 3: Manual verify in browser console**

Open `http://localhost:8080`, open devtools console, run:

```javascript
import('./js/components/progress-card.js').then(m => {
  document.getElementById('main-content').innerHTML = m.renderProgressCard([
    {id:'a'},{id:'b'},{id:'c'}
  ]);
});
```

Expected: card renders "0 of 3 lessons complete", bar at 0% width.

- [ ] **Step 4: Commit**

```bash
git add js/components/progress-card.js css/components.css
git commit -m "Add Progress Card component"
git push
```

---

### Task 4: Lesson Card component

**Files:**
- Create: `js/components/lesson-card.js`

- [ ] **Step 1: Write the component**

```javascript
import { isLessonComplete } from '../progress.js';

export function renderLessonCard(lesson, topicTitle) {
  const initials = topicTitle.slice(0, 2).toUpperCase();
  const done = isLessonComplete(lesson.id);

  return `
    <a class="card lesson-card" href="#/lesson/${lesson.id}">
      <div class="lesson-card-icon">
        ${initials}
        ${done ? '<span class="lesson-card-badge">✓</span>' : ''}
      </div>
      <div class="lesson-card-title">${lesson.title}</div>
      <div class="lesson-card-subtitle">${topicTitle} · ${lesson.level}</div>
    </a>
  `;
}

export function renderLessonGrid(topics) {
  const cards = topics.flatMap(topic =>
    topic.lessons.map(lesson => renderLessonCard(lesson, topic.title))
  );
  return `<div class="lesson-grid">${cards.join('')}</div>`;
}
```

- [ ] **Step 2: Add its styles to css/components.css**

Append to `css/components.css`:

```css
.lesson-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

@media (max-width: 768px) {
  .lesson-grid {
    grid-template-columns: 1fr;
  }
}

.lesson-card {
  display: block;
  color: var(--color-text);
  transition: transform var(--anim-duration) var(--anim-ease);
}

.lesson-card:hover {
  transform: translateY(-2px);
  color: var(--color-text);
}

.lesson-card-icon {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-bottom: 12px;
}

.lesson-card-badge {
  position: absolute;
  bottom: -6px;
  right: -6px;
  background: var(--color-success);
  color: #fff;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-sidebar);
}

.lesson-card-title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 6px;
}

.lesson-card-subtitle {
  font-size: 12px;
  color: var(--color-border);
}
```

- [ ] **Step 3: Manual verify in browser console**

```javascript
import('./js/components/lesson-card.js').then(m => {
  document.getElementById('main-content').innerHTML = m.renderLessonGrid([
    { title: 'JavaScript', lessons: [{ id: 'js-variables', title: 'Variables and Data Types', level: 'Beginner' }] }
  ]);
});
```

Expected: one card, "JS" icon block, title, "JavaScript · Beginner" subtitle, no badge (not completed).

- [ ] **Step 4: Commit**

```bash
git add js/components/lesson-card.js css/components.css
git commit -m "Add Lesson Card component"
git push
```

---

### Task 5: Sidebar accordion component (replaces Phase 1 stub)

**Files:**
- Create: `js/components/sidebar.js`
- Delete: `js/sidebar.js`
- Modify: `js/main.js:4` (import path)

- [ ] **Step 1: Write the new sidebar component**

```javascript
import { isLessonComplete } from '../progress.js';

const EXPANDED_KEY = 'sidebar-expanded';

export async function initSidebar() {
  const container = document.getElementById('sidebar-nav');
  if (!container) return;

  const res = await fetch('./data/nav.json');
  const nav = await res.json();
  const expanded = new Set(JSON.parse(localStorage.getItem(EXPANDED_KEY) || '[]'));

  renderAndBind(container, nav, expanded);
}

function renderAndBind(container, nav, expanded) {
  container.innerHTML = nav.topics.map(topic => renderTopic(topic, expanded)).join('');

  container.querySelectorAll('.sidebar-topic-title').forEach(header => {
    header.addEventListener('click', () => {
      const topicId = header.dataset.topicId;
      if (expanded.has(topicId)) {
        expanded.delete(topicId);
      } else {
        expanded.add(topicId);
      }
      localStorage.setItem(EXPANDED_KEY, JSON.stringify([...expanded]));
      renderAndBind(container, nav, expanded);
    });
  });
}

function renderTopic(topic, expanded) {
  const isOpen = expanded.has(topic.id);
  return `
    <div class="sidebar-topic">
      <div class="sidebar-topic-title" data-topic-id="${topic.id}">
        ${topic.title} <span class="sidebar-topic-arrow">${isOpen ? '▾' : '▸'}</span>
      </div>
      ${isOpen ? `<ul class="sidebar-lesson-list">${topic.lessons.map(renderLesson).join('')}</ul>` : ''}
    </div>
  `;
}

function renderLesson(lesson) {
  const done = isLessonComplete(lesson.id);
  const cls = done ? 'sidebar-lesson-done' : '';
  const check = done ? ' ✓' : '';
  return `<li><a class="${cls}" href="#/lesson/${lesson.id}">${lesson.title}${check}</a></li>`;
}
```

- [ ] **Step 2: Add sidebar accordion styles to css/components.css**

Append to `css/components.css`:

```css
.sidebar-topic-title {
  padding: 12px 16px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  user-select: none;
}

.sidebar-topic-title:hover {
  background: var(--color-bg);
}

.sidebar-lesson-list {
  list-style: none;
  margin: 0;
  padding: 0 16px 8px 16px;
}

.sidebar-lesson-list li {
  padding: 6px 0;
}

.sidebar-lesson-done {
  color: var(--color-success) !important;
}
```

- [ ] **Step 3: Delete old stub and update import**

Run: `rm js/sidebar.js`

Modify `js/main.js`, change:
```javascript
import { initSidebar } from './sidebar.js';
```
to:
```javascript
import { initSidebar } from './components/sidebar.js';
```

- [ ] **Step 4: Manual verify**

Open `http://localhost:8080`, confirm:
- Sidebar shows 3 topics, all collapsed initially
- Click a topic title → expands, arrow flips to ▾
- Refresh page → same topic still expanded (localStorage persisted)

- [ ] **Step 5: Commit**

```bash
git add js/components/sidebar.js js/main.js css/components.css
git rm js/sidebar.js
git commit -m "Replace sidebar stub with accordion component"
git push
```

---

### Task 6: Navbar breadcrumb

**Files:**
- Create: `js/components/navbar.js`
- Modify: `index.html` (add breadcrumb slot to navbar markup)
- Modify: `js/main.js` (call breadcrumb update on route change)

- [ ] **Step 1: Add breadcrumb slot to index.html**

Modify `index.html`, inside `<header class="app-navbar">`, after the `sidebar-toggle` button, add:

```html
      <div id="breadcrumb" class="breadcrumb">Home</div>
```

- [ ] **Step 2: Write js/components/navbar.js**

```javascript
export function setBreadcrumb(text) {
  const el = document.getElementById('breadcrumb');
  if (el) el.textContent = text;
}

export function breadcrumbForRoute(path, nav) {
  if (path === '/' || path === '') return 'Home';

  const match = path.match(/^\/lesson\/(.+)$/);
  if (!match) return 'Home';

  const lessonId = match[1];
  for (const topic of nav.topics) {
    const lesson = topic.lessons.find(l => l.id === lessonId);
    if (lesson) return `${topic.title} / ${lesson.title}`;
  }
  return 'Home';
}
```

- [ ] **Step 3: Add breadcrumb CSS to css/components.css**

Append to `css/components.css`:

```css
.breadcrumb {
  font-size: 14px;
  color: var(--color-text);
  font-weight: 500;
}
```

- [ ] **Step 4: Wire into main.js**

Modify `js/main.js`: add import at top:
```javascript
import { setBreadcrumb, breadcrumbForRoute } from './components/navbar.js';
```

Modify the `bootstrap()` function — after `initRouter()` is called, add a hashchange listener that also updates the breadcrumb (router.js only exposes route handlers per exact path, so breadcrumb needs its own listener for the general case):

```javascript
window.addEventListener('hashchange', () => {
  const path = window.location.hash.slice(1) || '/';
  setBreadcrumb(breadcrumbForRoute(path, nav));
});
setBreadcrumb(breadcrumbForRoute(window.location.hash.slice(1) || '/', nav));
```

(`nav` is already in scope in `bootstrap()` from the existing `fetch('./data/nav.json')` call used for search.)

- [ ] **Step 5: Manual verify**

Open `http://localhost:8080`, confirm breadcrumb shows "Home". Manually navigate to `http://localhost:8080/#/lesson/js-variables`, confirm breadcrumb updates to "JavaScript / Variables and Data Types".

- [ ] **Step 6: Commit**

```bash
git add js/components/navbar.js js/main.js index.html css/components.css
git commit -m "Add navbar breadcrumb component"
git push
```

---

### Task 7: Wire Home page (Progress Card + Lesson Grid)

**Files:**
- Modify: `js/main.js` (home route handler)

- [ ] **Step 1: Update main.js imports and home route**

Modify `js/main.js`: add imports:
```javascript
import { renderProgressCard } from './components/progress-card.js';
import { renderLessonGrid } from './components/lesson-card.js';
```

Replace the existing:
```javascript
  registerRoute('/', () => renderPlaceholder('Home'));
```
with:
```javascript
  registerRoute('/', () => renderHome(nav, allLessons));
```

Add new function (near `renderPlaceholder`):
```javascript
function renderHome(nav, allLessons) {
  const main = document.getElementById('main-content');
  if (!main) return;
  main.innerHTML = renderProgressCard(allLessons) + renderLessonGrid(nav.topics);
}
```

- [ ] **Step 2: Manual verify**

Open `http://localhost:8080`, confirm:
- Progress Card shows "0 of 6 lessons complete" (3 JS + 2 Python + 1 SQL = 6), 0% bar
- Below it, 3-column grid of 6 lesson cards, icon-led style, no checkmarks yet
- Resize to <768px: grid becomes 1 column

- [ ] **Step 3: Test completion flow end-to-end**

In devtools console:
```javascript
import('./js/progress.js').then(m => {
  m.markLessonComplete('js-variables');
  location.reload();
});
```

Expected after reload: Progress Card shows "1 of 6 lessons complete", ~17% bar. Sidebar "Variables and Data Types" shows green text + ✓. Matching Lesson Card shows green checkmark badge on icon.

- [ ] **Step 4: Commit**

```bash
git add js/main.js
git commit -m "Wire Home page with Progress Card and Lesson Card grid"
git push
```

---

## Post-Plan Note

`data/nav.json` still has `"_temp": true` dummy content — must be replaced with real lesson data before Phase 4 begins (per spec's Out of Scope section).
