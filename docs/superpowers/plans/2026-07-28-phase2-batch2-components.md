# Phase 2 Batch 2 Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Code Block (read-only, Prism.js/C), Monaco Editor wrapper, Practice Box (UI shell), Quiz Card (full multi-question flow), Table (sortable, minimal style), Accordion primitive (multi-open), and Modal — the "content/interactive" Phase 2 components.

**Architecture:** Vanilla ESM modules under `js/components/`, CSS appended to `css/components.css`. Prism.js and Monaco loaded via CDN. No test framework in this repo — verification is manual (implementer does static checks; human does the real browser check after each task, per established project convention).

**Tech Stack:** Vanilla JS (ESM), Prism.js (CDN, C grammar only), Monaco Editor (CDN, loader already stubbed in `index.html` from Phase 1 as `window.MONACO_CDN_BASE`).

---

### Task 1: CDN dependencies + modal root in index.html

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add Prism.js CDN tags**

In `index.html`, inside `<head>`, after the existing `<link rel="stylesheet" href="./css/components.css" />` line, add:

```html
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" />
```

Then, right before the closing `</body>` tag, before the existing `<script type="module" src="./js/main.js"></script>` line, add:

```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-clike.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-c.min.js"></script>
```

- [ ] **Step 2: Add #modal-root container**

In `index.html`, immediately after the closing `</div>` of `.app-shell` (and before the Prism/Monaco script tags added above), add:

```html
  <div id="modal-root"></div>
```

- [ ] **Step 3: Manual verify**

Run: `curl -s -o /dev/null -w "%{http_code}\n" https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-c.min.js`
Expected: `200`

Run: `grep -c "modal-root" index.html`
Expected: `1`

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Add Prism.js CDN deps and modal-root container to index.html"
git push
```

---

### Task 2: Code Block component

**Files:**
- Create: `js/components/code-block.js`

- [ ] **Step 1: Write the component**

```javascript
export function renderCodeBlock(code) {
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `
    <div class="code-block">
      <button class="code-block-copy" type="button">📋</button>
      <pre><code class="language-c">${escaped}</code></pre>
    </div>
  `;
}

export function initCodeBlocks(container) {
  container.querySelectorAll('.code-block-copy').forEach(button => {
    button.addEventListener('click', () => {
      const code = button.parentElement.querySelector('code').textContent;
      navigator.clipboard.writeText(code);
      const original = button.textContent;
      button.textContent = 'Copied';
      setTimeout(() => {
        button.textContent = original;
      }, 1500);
    });
  });

  if (window.Prism) {
    window.Prism.highlightAllUnder(container);
  }
}
```

- [ ] **Step 2: Add CSS to css/components.css**

Append to `css/components.css`:

```css
.code-block {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: 13px;
}

.code-block pre {
  margin: 0;
  padding: 14px;
  overflow-x: auto;
}

.code-block-copy {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--color-sidebar);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 11px;
  cursor: pointer;
  color: var(--color-text);
}
```

- [ ] **Step 3: Manual verify**

Run: `node --check js/components/code-block.js`
Expected: no output (valid syntax)

Note: `window.Prism` is a CDN global not available under `node --check`'s module resolution context, but this file doesn't `import` Prism (it's referenced defensively via `window.Prism`), so syntax check alone is sufficient here.

- [ ] **Step 4: Commit**

```bash
git add js/components/code-block.js css/components.css
git commit -m "Add Code Block component with Prism highlighting and copy button"
git push
```

---

### Task 3: Monaco Editor wrapper

**Files:**
- Create: `js/components/monaco-editor.js`

- [ ] **Step 1: Write the component**

```javascript
let loaderPromise = null;

function loadMonacoLoader() {
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${window.MONACO_CDN_BASE}/vs/loader.js`;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });

  return loaderPromise;
}

export async function mountMonacoEditor(container, { value = '', language = 'c' } = {}) {
  await loadMonacoLoader();

  return new Promise(resolve => {
    window.require.config({ paths: { vs: `${window.MONACO_CDN_BASE}/vs` } });
    window.require(['vs/editor/editor.main'], () => {
      const editor = window.monaco.editor.create(container, {
        value,
        language,
        automaticLayout: true,
      });
      resolve(editor);
    });
  });
}
```

- [ ] **Step 2: Manual verify**

Run: `node --check js/components/monaco-editor.js`
Expected: no output (valid syntax)

Run: `curl -s -o /dev/null -w "%{http_code}\n" https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/min/vs/loader.js`
Expected: `200` (confirms the `MONACO_CDN_BASE` set in `index.html` during Phase 1 actually resolves)

- [ ] **Step 3: Commit**

```bash
git add js/components/monaco-editor.js
git commit -m "Add Monaco Editor mount wrapper"
git push
```

---

### Task 4: Practice Box (UI shell only)

**Files:**
- Create: `js/components/practice-box.js`

- [ ] **Step 1: Write the component**

```javascript
import { mountMonacoEditor } from './monaco-editor.js';

export async function mountPracticeBox(container, { starterCode = '' } = {}) {
  container.innerHTML = `
    <div class="card practice-box">
      <div class="practice-box-editor"></div>
      <button class="practice-box-check" type="button">Check</button>
      <div class="practice-output"></div>
    </div>
  `;

  const editorContainer = container.querySelector('.practice-box-editor');
  const editor = await mountMonacoEditor(editorContainer, { value: starterCode, language: 'c' });

  const checkButton = container.querySelector('.practice-box-check');
  checkButton.addEventListener('click', () => {
    console.log('[practice-box] check clicked:', editor.getValue());
  });

  return editor;
}
```

- [ ] **Step 2: Add CSS to css/components.css**

Append to `css/components.css`:

```css
.practice-box-editor {
  height: 240px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
}

.practice-box-check {
  height: 40px;
  padding: 0 20px;
  border-radius: var(--radius-button);
  border: none;
  background: var(--color-primary);
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: background var(--anim-duration) var(--anim-ease);
}

.practice-box-check:hover {
  background: var(--color-primary-hover);
}

.practice-output {
  margin-top: 12px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-text);
}
```

- [ ] **Step 3: Manual verify**

Run: `node --check js/components/practice-box.js`
Expected: no output (valid syntax)

Confirm `mountMonacoEditor` import path (`./monaco-editor.js`) resolves to the file created in Task 3 (same directory).

- [ ] **Step 4: Commit**

```bash
git add js/components/practice-box.js css/components.css
git commit -m "Add Practice Box UI shell (Monaco editor + Check button, no logic yet)"
git push
```

---

### Task 5: Quiz Card (full multi-question flow)

**Files:**
- Create: `js/components/quiz-card.js`

- [ ] **Step 1: Write the component**

```javascript
export function mountQuiz(container, questions) {
  let currentIndex = 0;
  let correctCount = 0;
  let answered = false;

  renderQuestion();

  function renderQuestion() {
    const q = questions[currentIndex];
    container.innerHTML = `
      <div class="card quiz-card">
        <div class="quiz-card-question">${q.question}</div>
        <div class="quiz-card-options">
          ${q.options.map((option, i) => `
            <div class="quiz-card-option" data-index="${i}">
              <span class="quiz-card-marker"></span>
              ${option}
            </div>
          `).join('')}
        </div>
        <div class="quiz-card-explanation" hidden>${q.explanation}</div>
        <button class="quiz-card-next" hidden type="button">Next Question →</button>
      </div>
    `;

    answered = false;
    container.querySelectorAll('.quiz-card-option').forEach(optionEl => {
      optionEl.addEventListener('click', () => handleAnswer(optionEl, q));
    });

    container.querySelector('.quiz-card-next').addEventListener('click', handleNext);
  }

  function handleAnswer(optionEl, q) {
    if (answered) return;
    answered = true;

    const selectedIndex = Number(optionEl.dataset.index);
    const isCorrect = selectedIndex === q.correctIndex;
    if (isCorrect) correctCount++;

    container.querySelectorAll('.quiz-card-option').forEach(el => {
      const index = Number(el.dataset.index);
      const marker = el.querySelector('.quiz-card-marker');
      if (index === q.correctIndex) {
        el.classList.add('quiz-card-option-correct');
        marker.textContent = '✓';
      } else if (index === selectedIndex) {
        el.classList.add('quiz-card-option-incorrect');
        marker.textContent = '✗';
      }
    });

    container.querySelector('.quiz-card-explanation').hidden = false;
    container.querySelector('.quiz-card-next').hidden = false;
  }

  function handleNext() {
    currentIndex++;
    if (currentIndex < questions.length) {
      renderQuestion();
    } else {
      renderSummary();
    }
  }

  function renderSummary() {
    container.innerHTML = `
      <div class="card quiz-card">
        <div class="quiz-card-question">You scored ${correctCount} of ${questions.length}</div>
      </div>
    `;
  }
}
```

- [ ] **Step 2: Add CSS to css/components.css**

Append to `css/components.css`:

```css
.quiz-card-question {
  font-weight: 600;
  margin-bottom: 14px;
}

.quiz-card-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quiz-card-option {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
  cursor: pointer;
}

.quiz-card-marker {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  flex-shrink: 0;
  color: #fff;
}

.quiz-card-option-correct {
  background: rgba(34, 197, 94, 0.1);
  border-color: var(--color-success);
}

.quiz-card-option-correct .quiz-card-marker {
  background: var(--color-success);
}

.quiz-card-option-incorrect {
  background: rgba(239, 68, 68, 0.1);
  border-color: var(--color-danger);
}

.quiz-card-option-incorrect .quiz-card-marker {
  background: var(--color-danger);
}

.quiz-card-explanation {
  margin-top: 12px;
  font-size: 12px;
  color: var(--color-success);
  background: rgba(34, 197, 94, 0.1);
  border-radius: 8px;
  padding: 8px 10px;
}

.quiz-card-next {
  margin-top: 12px;
  width: 100%;
  height: 36px;
  border-radius: 10px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  font-size: 13px;
  cursor: pointer;
}
```

- [ ] **Step 3: Manual verify**

Run: `node --check js/components/quiz-card.js`
Expected: no output (valid syntax)

Re-read the file: confirm `handleAnswer` guards against re-answering (`if (answered) return;`), confirm `correctCount` only increments once per question, confirm `renderSummary` runs after the last question's Next click, not before.

- [ ] **Step 4: Commit**

```bash
git add js/components/quiz-card.js css/components.css
git commit -m "Add Quiz Card multi-question flow (Phase 3 lesson-engine pull-forward, user-confirmed)"
git push
```

---

### Task 6: Table component

**Files:**
- Create: `js/components/table.js`

- [ ] **Step 1: Write the component**

```javascript
export function renderTable({ headers, rows }) {
  return `
    <table class="data-table">
      <thead>
        <tr>${headers.map((h, i) => `<th data-index="${i}">${h} <span class="sort-indicator">⇅</span></th>`).join('')}</tr>
      </thead>
      <tbody>${renderRows(rows)}</tbody>
    </table>
  `;
}

export function initTable(tableEl, rows) {
  let currentRows = [...rows];
  let sortIndex = null;
  let ascending = true;

  tableEl.querySelectorAll('th').forEach(th => {
    th.addEventListener('click', () => {
      const index = Number(th.dataset.index);
      ascending = sortIndex === index ? !ascending : true;
      sortIndex = index;

      const isNumeric = currentRows.every(row => !isNaN(parseFloat(row[index])));
      currentRows = [...currentRows].sort((a, b) => {
        const valA = isNumeric ? parseFloat(a[index]) : a[index];
        const valB = isNumeric ? parseFloat(b[index]) : b[index];
        if (valA < valB) return ascending ? -1 : 1;
        if (valA > valB) return ascending ? 1 : -1;
        return 0;
      });

      tableEl.querySelectorAll('.sort-indicator').forEach(el => (el.textContent = '⇅'));
      th.querySelector('.sort-indicator').textContent = ascending ? '▲' : '▼';

      tableEl.querySelector('tbody').innerHTML = renderRows(currentRows);
    });
  });
}

function renderRows(rows) {
  return rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('');
}
```

- [ ] **Step 2: Add CSS to css/components.css**

Append to `css/components.css`:

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table th {
  text-align: left;
  padding: 8px 4px;
  border-bottom: 2px solid var(--color-text);
  cursor: pointer;
  user-select: none;
}

.data-table td {
  padding: 8px 4px;
  border-bottom: 1px solid var(--color-border);
}

.sort-indicator {
  font-size: 11px;
  color: var(--color-border);
}
```

- [ ] **Step 3: Manual verify**

Run: `node --check js/components/table.js`
Expected: no output (valid syntax)

Re-read the file: confirm `initTable` receives the same `rows` array shape that `renderTable` was given, confirm clicking the same header twice toggles `ascending`, confirm numeric-vs-string detection covers a column of all-numeric-strings correctly.

- [ ] **Step 4: Commit**

```bash
git add js/components/table.js css/components.css
git commit -m "Add sortable Table component (minimal divider-line style)"
git push
```

---

### Task 7: Accordion primitive

**Files:**
- Create: `js/components/accordion.js`

- [ ] **Step 1: Write the component**

```javascript
export function mountAccordion(container, sections) {
  container.innerHTML = sections.map((section, i) => `
    <div class="accordion-section" data-index="${i}">
      <div class="accordion-header">
        ${section.title} <span class="accordion-arrow">▸</span>
      </div>
      <div class="accordion-body" hidden>${section.content}</div>
    </div>
  `).join('');

  container.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const section = header.parentElement;
      const body = section.querySelector('.accordion-body');
      const arrow = section.querySelector('.accordion-arrow');
      const isOpen = !body.hidden;

      body.hidden = isOpen;
      arrow.textContent = isOpen ? '▸' : '▾';
    });
  });
}
```

- [ ] **Step 2: Add CSS to css/components.css**

Append to `css/components.css`:

```css
.accordion-section {
  border-bottom: 1px solid var(--color-border);
}

.accordion-header {
  padding: 12px 0;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  user-select: none;
}

.accordion-body {
  padding: 0 0 12px 0;
  font-size: 14px;
  color: var(--color-text);
}
```

- [ ] **Step 3: Manual verify**

Run: `node --check js/components/accordion.js`
Expected: no output (valid syntax)

Re-read the file: confirm each section's open/close state is independent (toggling one section's `hidden` attribute does not touch any other section's `.accordion-body`), matching the approved "multiple open at once" design decision.

- [ ] **Step 4: Commit**

```bash
git add js/components/accordion.js css/components.css
git commit -m "Add generic Accordion primitive (multi-open, independent from Sidebar's accordion)"
git push
```

---

### Task 8: Modal

**Files:**
- Create: `js/components/modal.js`

- [ ] **Step 1: Write the component**

```javascript
let escapeHandler = null;

export function openModal({ title, body, onConfirm }) {
  const root = document.getElementById('modal-root');

  root.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">${title}</div>
          <span class="modal-close" role="button">✕</span>
        </div>
        <div class="modal-body">${typeof body === 'string' ? body : ''}</div>
        ${onConfirm ? '<button class="modal-confirm" type="button">Confirm</button>' : ''}
      </div>
    </div>
  `;

  if (typeof body !== 'string') {
    root.querySelector('.modal-body').appendChild(body);
  }

  root.querySelector('.modal-backdrop').addEventListener('click', event => {
    if (event.target.classList.contains('modal-backdrop')) closeModal();
  });

  root.querySelector('.modal-close').addEventListener('click', closeModal);

  if (onConfirm) {
    root.querySelector('.modal-confirm').addEventListener('click', () => {
      onConfirm();
      closeModal();
    });
  }

  escapeHandler = event => {
    if (event.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', escapeHandler);
}

export function closeModal() {
  const root = document.getElementById('modal-root');
  root.innerHTML = '';

  if (escapeHandler) {
    document.removeEventListener('keydown', escapeHandler);
    escapeHandler = null;
  }
}
```

- [ ] **Step 2: Add CSS to css/components.css**

Append to `css/components.css`:

```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-card {
  background: var(--color-sidebar);
  border-radius: var(--radius-card);
  padding: 24px;
  box-shadow: var(--shadow-card);
  width: 320px;
  max-width: calc(100vw - 32px);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.modal-title {
  font-weight: 600;
}

.modal-close {
  cursor: pointer;
  color: var(--color-border);
}

.modal-body {
  font-size: 13px;
  color: var(--color-text);
  margin-bottom: 16px;
}

.modal-confirm {
  width: 100%;
  height: 36px;
  border-radius: var(--radius-button);
  background: var(--color-primary);
  color: #fff;
  border: none;
  font-size: 13px;
  cursor: pointer;
}
```

- [ ] **Step 3: Manual verify**

Run: `node --check js/components/modal.js`
Expected: no output (valid syntax)

Re-read the file: confirm `closeModal` removes the `keydown` listener (no leak across repeated open/close cycles), confirm backdrop-click check uses `event.target` (only fires when clicking the backdrop itself, not bubbled clicks from inside `.modal-card`), confirm `#modal-root` (added in Task 1) is what this mounts into.

- [ ] **Step 4: Commit**

```bash
git add js/components/modal.js css/components.css
git commit -m "Add Modal component (centered card, esc/backdrop/close-button dismissal)"
git push
```

---

## Post-Plan Note

None of these components are wired into any real page yet (Practice Box, Quiz Card, Table, Accordion, Modal all exist as standalone modules). Wiring them into actual lesson content is Phase 3 (Lesson Engine) / Phase 4 (Lesson Content) work, except Quiz Card's internal flow logic which was intentionally built now per user's Batch 2 scope decision.
