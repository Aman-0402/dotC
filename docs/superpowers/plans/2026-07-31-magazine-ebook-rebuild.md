# Magazine-Style Ebook Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the skeleton of a static, magazine-style C programming ebook site — landing page, table of contents, reusable lesson template, sidebar/navbar, light/dark theme toggle, prev/next nav — with no real lesson content yet.

**Architecture:** Plain HTML/CSS/vanilla JS, no build tool. Static multi-page site (one HTML file per lesson). `data/toc.json` is the single source of truth for chapter/lesson structure; `js/sidebar.js` and `js/nav.js` read it at page-load time to build the sidebar and wire prev/next links. Theme state lives in `localStorage`, applied via a `data-theme` attribute on `<html>`.

**Tech Stack:** HTML5, CSS3 (custom properties for theming), vanilla JS (ES modules not needed — plain scripts), Prism.js via CDN for code syntax highlighting.

---

This is a static-markup/CSS/JS project — no automated test runner. "Testing" steps mean: open the page in a browser (or via a local static server) and visually/functionally verify the described behavior. Every task ends with a manual verification step before commit.

### Task 1: Theme tokens and base styles

**Files:**
- Create: `css/variables.css`
- Create: `css/base.css`

- [ ] **Step 1: Write `css/variables.css`**

```css
:root {
  --color-bg: #faf8f5;
  --color-bg-elevated: #ffffff;
  --color-text: #1a1a1a;
  --color-text-muted: #5a5a5a;
  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
  --color-border: #e2ddd4;
  --color-code-bg: #f2f0eb;

  --font-heading: Georgia, "Times New Roman", serif;
  --font-body: -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-mono: "Fira Code", Consolas, monospace;

  --sidebar-width: 260px;
  --navbar-height: 56px;
}

:root[data-theme="dark"] {
  --color-bg: #0d1117;
  --color-bg-elevated: #161b22;
  --color-text: #e6edf3;
  --color-text-muted: #9198a1;
  --color-accent: #58a6ff;
  --color-accent-hover: #79c0ff;
  --color-border: #30363d;
  --color-code-bg: #161b22;
}
```

- [ ] **Step 2: Write `css/base.css`**

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  color-scheme: light dark;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  line-height: 1.6;
  transition: background-color 0.2s ease, color 0.2s ease;
}

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  line-height: 1.25;
}

a {
  color: var(--color-accent);
  text-decoration: none;
}

a:hover {
  color: var(--color-accent-hover);
  text-decoration: underline;
}

img {
  max-width: 100%;
  display: block;
}

button {
  font-family: inherit;
  cursor: pointer;
}
```

- [ ] **Step 3: Verify**

No page consumes these yet — visually verify by opening `css/variables.css` and `css/base.css` in an editor, confirm no syntax errors (matching braces, no stray `;` mismatches). Full visual check happens once `index.html` exists (Task 6).

- [ ] **Step 4: Commit**

```bash
git add css/variables.css css/base.css
git commit -m "Add theme tokens and base styles"
```

---

### Task 2: Layout, component, and theme-toggle styles

**Files:**
- Create: `css/layout.css`
- Create: `css/components.css`
- Create: `css/theme.css`

- [ ] **Step 1: Write `css/layout.css`**

```css
.navbar {
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-elevated);
  position: sticky;
  top: 0;
  z-index: 10;
}

.lesson-layout {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  min-height: calc(100vh - var(--navbar-height));
}

.sidebar {
  border-right: 1px solid var(--color-border);
  padding: 1.5rem 1rem;
  overflow-y: auto;
}

.lesson-main {
  padding: 2.5rem 3rem;
  max-width: 760px;
}

@media (max-width: 768px) {
  .lesson-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }

  .sidebar.open {
    display: block;
  }

  .lesson-main {
    padding: 1.5rem;
  }
}
```

- [ ] **Step 2: Write `css/components.css`**

```css
.btn {
  display: inline-block;
  padding: 0.65rem 1.5rem;
  border-radius: 6px;
  border: none;
  background: var(--color-accent);
  color: #fff;
  font-weight: 600;
}

.btn:hover {
  background: var(--color-accent-hover);
  color: #fff;
  text-decoration: none;
}

pre[class*="language-"] {
  background: var(--color-code-bg) !important;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 1rem !important;
  font-family: var(--font-mono);
  overflow-x: auto;
}

.toc-chapter {
  margin-bottom: 0.75rem;
}

.toc-chapter summary {
  cursor: pointer;
  font-weight: 600;
  padding: 0.5rem 0;
}

.toc-lesson-list {
  list-style: none;
  padding-left: 1rem;
}

.toc-lesson-list li {
  padding: 0.35rem 0;
}

.sidebar-lesson-list {
  list-style: none;
}

.sidebar-lesson-list li a {
  display: block;
  padding: 0.4rem 0.5rem;
  border-radius: 4px;
  color: var(--color-text);
}

.sidebar-lesson-list li a.active {
  background: var(--color-accent);
  color: #fff;
}

.lesson-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.lesson-nav a:only-child {
  margin-left: auto;
}
```

- [ ] **Step 3: Write `css/theme.css`**

```css
.theme-toggle {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.4rem 0.6rem;
  font-size: 1rem;
  color: var(--color-text);
}

.theme-toggle:hover {
  border-color: var(--color-accent);
}
```

- [ ] **Step 4: Verify**

Check files parse (balanced braces, no typos) by reading them back. Full visual check happens once pages exist (Task 6+).

- [ ] **Step 5: Commit**

```bash
git add css/layout.css css/components.css css/theme.css
git commit -m "Add layout, component, and theme-toggle styles"
```

---

### Task 3: Table of contents data

**Files:**
- Create: `data/toc.json`

- [ ] **Step 1: Write `data/toc.json`**

One placeholder chapter with one placeholder lesson, pointing at the lesson template itself so nav/sidebar logic has something real to walk.

```json
{
  "chapters": [
    {
      "title": "Chapter 1: Getting Started",
      "lessons": [
        {
          "title": "Lesson 1: Placeholder",
          "path": "lessons/lesson-template.html"
        }
      ]
    }
  ]
}
```

- [ ] **Step 2: Verify**

Run a JSON validity check:

```bash
node -e "JSON.parse(require('fs').readFileSync('data/toc.json', 'utf8')); console.log('valid')"
```

Expected output: `valid`

- [ ] **Step 3: Commit**

```bash
git add data/toc.json
git commit -m "Add placeholder table-of-contents data"
```

---

### Task 4: Theme toggle script

**Files:**
- Create: `js/theme.js`

- [ ] **Step 1: Write `js/theme.js`**

```js
(function () {
  var STORAGE_KEY = "dotc-theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.textContent = theme === "dark" ? "☀️" : "🌙";
    }
  }

  function currentTheme() {
    return localStorage.getItem(STORAGE_KEY) || "light";
  }

  function initTheme() {
    applyTheme(currentTheme());
    var toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
    });
  }

  document.addEventListener("DOMContentLoaded", initTheme);
})();
```

- [ ] **Step 2: Verify**

Deferred to Task 6 (needs a page with a `.theme-toggle` button in the DOM to click).

- [ ] **Step 3: Commit**

```bash
git add js/theme.js
git commit -m "Add theme toggle script"
```

---

### Task 5: Sidebar and prev/next nav scripts

**Files:**
- Create: `js/sidebar.js`
- Create: `js/nav.js`

- [ ] **Step 1: Write `js/sidebar.js`**

Builds the sidebar tree from `data/toc.json` and highlights the current page. Assumes lesson pages live at a fixed depth so `../data/toc.json` and `../` prefixes resolve; the template's own path is `lessons/lesson-template.html`, one level deep, matching this.

```js
(function () {
  function currentPath() {
    return window.location.pathname.split("/").slice(-2).join("/");
  }

  function buildSidebar(toc) {
    var sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;

    var here = currentPath();
    var container = document.createElement("div");

    toc.chapters.forEach(function (chapter) {
      var heading = document.createElement("h3");
      heading.textContent = chapter.title;
      container.appendChild(heading);

      var list = document.createElement("ul");
      list.className = "sidebar-lesson-list";

      chapter.lessons.forEach(function (lesson) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "../" + lesson.path;
        a.textContent = lesson.title;
        if (lesson.path === here) {
          a.classList.add("active");
        }
        li.appendChild(a);
        list.appendChild(li);
      });

      container.appendChild(list);
    });

    sidebar.appendChild(container);
  }

  function initSidebar() {
    fetch("../data/toc.json")
      .then(function (res) {
        return res.json();
      })
      .then(buildSidebar);
  }

  document.addEventListener("DOMContentLoaded", initSidebar);
})();
```

- [ ] **Step 2: Write `js/nav.js`**

Flattens `toc.json` into an ordered lesson list and wires prev/next links for the current page.

```js
(function () {
  function currentPath() {
    return window.location.pathname.split("/").slice(-2).join("/");
  }

  function flattenLessons(toc) {
    var lessons = [];
    toc.chapters.forEach(function (chapter) {
      chapter.lessons.forEach(function (lesson) {
        lessons.push(lesson);
      });
    });
    return lessons;
  }

  function wireNav(toc) {
    var lessons = flattenLessons(toc);
    var here = currentPath();
    var index = lessons.findIndex(function (l) {
      return l.path === here;
    });
    if (index === -1) return;

    var navEl = document.querySelector(".lesson-nav");
    if (!navEl) return;

    if (index > 0) {
      var prev = lessons[index - 1];
      var prevLink = document.createElement("a");
      prevLink.href = "../" + prev.path;
      prevLink.textContent = "← " + prev.title;
      navEl.appendChild(prevLink);
    }

    if (index < lessons.length - 1) {
      var next = lessons[index + 1];
      var nextLink = document.createElement("a");
      nextLink.href = "../" + next.path;
      nextLink.textContent = next.title + " →";
      navEl.appendChild(nextLink);
    }
  }

  function initNav() {
    fetch("../data/toc.json")
      .then(function (res) {
        return res.json();
      })
      .then(wireNav);
  }

  document.addEventListener("DOMContentLoaded", initNav);
})();
```

- [ ] **Step 3: Verify**

Deferred to Task 6 (needs `lessons/lesson-template.html` in the DOM to test against).

- [ ] **Step 4: Commit**

```bash
git add js/sidebar.js js/nav.js
git commit -m "Add sidebar and prev/next nav scripts"
```

---

### Task 6: Lesson template page

**Files:**
- Create: `lessons/lesson-template.html`

- [ ] **Step 1: Write `lessons/lesson-template.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lesson Title — C Programming</title>
  <link rel="stylesheet" href="../css/variables.css" />
  <link rel="stylesheet" href="../css/base.css" />
  <link rel="stylesheet" href="../css/layout.css" />
  <link rel="stylesheet" href="../css/components.css" />
  <link rel="stylesheet" href="../css/theme.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1/themes/prism.min.css" />
</head>
<body>
  <nav class="navbar">
    <span><a href="../toc.html">C Programming</a> / Chapter 1 / Lesson 1</span>
    <button class="theme-toggle" aria-label="Toggle theme">🌙</button>
  </nav>

  <div class="lesson-layout">
    <aside class="sidebar"></aside>

    <main class="lesson-main">
      <h1>Lesson Title</h1>
      <p>Lesson content goes here.</p>

      <pre><code class="language-c">#include &lt;stdio.h&gt;

int main() {
    printf("Hello, World!\n");
    return 0;
}</code></pre>

      <nav class="lesson-nav"></nav>
    </main>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/prismjs@1/prism.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-c.min.js"></script>
  <script src="../js/theme.js"></script>
  <script src="../js/sidebar.js"></script>
  <script src="../js/nav.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify**

Start a local static server from the project root and open the lesson page:

```bash
npx --yes serve . -l 5500
```

Open `http://localhost:5500/lessons/lesson-template.html` in a browser. Confirm:
- Sidebar shows "Chapter 1: Getting Started" → "Lesson 1: Placeholder" (highlighted as active)
- Code block is syntax-highlighted
- Clicking the theme toggle switches to dark background/text and the icon flips to ☀️
- Reloading the page keeps the dark theme (persisted via localStorage)
- Since this is the only lesson, no prev/next links render (expected — list only has one entry)

Stop the server (`Ctrl+C`) once confirmed.

- [ ] **Step 3: Commit**

```bash
git add lessons/lesson-template.html
git commit -m "Add lesson template page"
```

---

### Task 7: Table of contents page

**Files:**
- Create: `toc.html`

- [ ] **Step 1: Write `toc.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Table of Contents — C Programming</title>
  <link rel="stylesheet" href="css/variables.css" />
  <link rel="stylesheet" href="css/base.css" />
  <link rel="stylesheet" href="css/layout.css" />
  <link rel="stylesheet" href="css/components.css" />
  <link rel="stylesheet" href="css/theme.css" />
</head>
<body>
  <nav class="navbar">
    <span><a href="index.html">C Programming</a></span>
    <button class="theme-toggle" aria-label="Toggle theme">🌙</button>
  </nav>

  <main style="max-width: 760px; margin: 2rem auto; padding: 0 1.5rem;">
    <h1>Table of Contents</h1>
    <div id="toc-root"></div>
  </main>

  <script src="js/theme.js"></script>
  <script>
    fetch("data/toc.json")
      .then(function (res) { return res.json(); })
      .then(function (toc) {
        var root = document.getElementById("toc-root");
        toc.chapters.forEach(function (chapter) {
          var details = document.createElement("details");
          details.className = "toc-chapter";
          details.open = true;

          var summary = document.createElement("summary");
          summary.textContent = chapter.title;
          details.appendChild(summary);

          var list = document.createElement("ul");
          list.className = "toc-lesson-list";

          chapter.lessons.forEach(function (lesson) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = lesson.path;
            a.textContent = lesson.title;
            li.appendChild(a);
            list.appendChild(li);
          });

          details.appendChild(list);
          root.appendChild(details);
        });
      });
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify**

With the server from Task 6 running again (`npx --yes serve . -l 5500`), open `http://localhost:5500/toc.html`. Confirm:
- "Chapter 1: Getting Started" shows expanded, listing "Lesson 1: Placeholder"
- Clicking the lesson link navigates to `lessons/lesson-template.html`
- Theme toggle works and persists

- [ ] **Step 3: Commit**

```bash
git add toc.html
git commit -m "Add table of contents page"
```

---

### Task 8: Landing page

**Files:**
- Create: `index.html`
- Move: `landing page.png` → `assets/landing page.png`

- [ ] **Step 1: Move the hero image into `assets/`**

```bash
mkdir -p assets
git mv "landing page.png" "assets/landing page.png"
```

- [ ] **Step 2: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>C Programming — Learn to Code in C</title>
  <link rel="stylesheet" href="css/variables.css" />
  <link rel="stylesheet" href="css/base.css" />
  <link rel="stylesheet" href="css/components.css" />
  <style>
    .hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      background: #000 url("assets/landing page.png") center / cover no-repeat;
      text-align: center;
      padding-bottom: 4rem;
    }

    .hero .btn {
      font-size: 1.1rem;
      padding: 0.85rem 2.25rem;
    }
  </style>
</head>
<body>
  <div class="hero">
    <a class="btn" href="toc.html">Start Reading</a>
  </div>
</body>
</html>
```

- [ ] **Step 3: Verify**

With the server running, open `http://localhost:5500/index.html`. Confirm:
- Hero image fills the viewport
- "Start Reading" button is visible near the bottom
- Clicking it navigates to `toc.html`

Stop the server once confirmed.

- [ ] **Step 4: Commit**

```bash
git add index.html assets/
git commit -m "Add landing page"
```

---

### Task 9: End-to-end walkthrough

**Files:** none (verification only)

- [ ] **Step 1: Full click-through test**

```bash
npx --yes serve . -l 5500
```

Open `http://localhost:5500/index.html` and walk the whole path:
1. Landing page loads with hero image → click "Start Reading"
2. TOC page loads, chapter expanded, one lesson listed → click it
3. Lesson page loads with sidebar (lesson highlighted), syntax-highlighted code block
4. Toggle theme to dark → background/text/code theme all switch together
5. Navigate back to `toc.html` via the breadcrumb link → theme stays dark (persisted)

Stop the server once all five checks pass.

- [ ] **Step 2: Commit (if any fixes were needed during walkthrough)**

```bash
git add -A
git commit -m "Fix issues found during end-to-end walkthrough"
```

(Skip this step if no fixes were needed.)
