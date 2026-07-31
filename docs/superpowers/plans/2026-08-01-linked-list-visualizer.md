# Linked-List Pointer Visualizer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `lessons/unit8-introduction-to-linked-lists.html` — the first Unit 8 lesson — with the linked-list content already provided by the user, replacing its `genui{SINGLY_LINKED_LIST_POINTERS}` placeholder with an interactive Insert/Delete pointer-visualizer widget (`ll-viz`), then wire it into site navigation.

**Architecture:** Single static HTML file following the existing `unitN-<slug>.html` lesson template (navbar, sidebar, `<main class="lesson-main">`, standard script tags). The visualizer is a page-local `<style>` block (flexbox node/arrow rendering, no SVG) plus a self-contained inline `<script>` at the end of the body that precomputes two step arrays (`insertSteps`, `deleteSteps`) and walks an index through them on Step/Reset/slider input — mirroring the sorting-lesson visualizer pattern but fully independent (no shared CSS/JS module), per `docs/superpowers/specs/2026-08-01-linked-list-visualizer-design.md`.

**Tech Stack:** Plain HTML5/CSS3/vanilla ES5-style JS. No build step. `data/toc.json` gets a new `Unit 8` chapter entry.

---

### Task 1: Build the lesson HTML — content sections + viz container markup

**Files:**
- Create: `lessons/unit8-introduction-to-linked-lists.html`

- [ ] **Step 1: Write the full file**

Create `lessons/unit8-introduction-to-linked-lists.html` with this exact content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Introduction to Linked Lists — C Programming</title>
  <link rel="stylesheet" href="../css/variables.css" />
  <link rel="stylesheet" href="../css/base.css" />
  <link rel="stylesheet" href="../css/layout.css" />
  <link rel="stylesheet" href="../css/components.css" />
  <link rel="stylesheet" href="../css/theme.css" />
  <link id="prism-theme" rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1/themes/prism.min.css" />
  <style>
    .ll-viz {
      border: 1px solid var(--color-border);
      border-radius: 8px;
      background: var(--color-bg-elevated);
      padding: 1.5rem 1rem;
      margin: 1.5rem 0;
    }
    .ll-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .ll-tab {
      flex: 1;
      padding: 0.5rem 1rem;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      background: var(--color-bg);
      color: var(--color-text);
      font-family: var(--font-mono);
      font-size: 0.95rem;
      cursor: pointer;
    }
    .ll-tab--active {
      background: var(--color-accent);
      color: #fff;
      border-color: var(--color-accent);
    }
    .ll-row,
    .ll-detached-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0;
      min-height: 70px;
    }
    .ll-detached-row {
      min-height: 60px;
      margin-top: 0.5rem;
    }
    .ll-node {
      display: flex;
      flex-direction: column;
      border: 2px solid var(--color-border);
      border-radius: 4px;
      overflow: hidden;
      font-family: var(--font-mono);
      min-width: 64px;
    }
    .ll-node--highlight {
      border-color: var(--color-accent);
    }
    .ll-node--detached {
      border-style: dashed;
      opacity: 0.85;
    }
    .ll-node-data {
      padding: 0.5rem 0.75rem;
      text-align: center;
      font-weight: 700;
      background: var(--color-bg);
      color: var(--color-text);
    }
    .ll-node-next {
      padding: 0.3rem 0.75rem;
      text-align: center;
      font-size: 0.75rem;
      background: var(--color-bg-elevated);
      color: var(--color-text);
      border-top: 1px solid var(--color-border);
    }
    .ll-arrow {
      display: flex;
      align-items: center;
      width: 40px;
      height: 2px;
      background: var(--color-border);
      position: relative;
      margin: 0 4px;
    }
    .ll-arrow::after {
      content: '';
      position: absolute;
      right: 0;
      top: -4px;
      border-left: 8px solid var(--color-border);
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
    }
    .ll-arrow--highlight {
      background: var(--color-accent);
    }
    .ll-arrow--highlight::after {
      border-left-color: var(--color-accent);
    }
    .ll-arrow--null {
      width: 30px;
    }
    .ll-arrow--null::after {
      border-left: none;
      border-right: 2px solid var(--color-border);
      right: 2px;
      top: -6px;
      height: 12px;
      border-top: none;
      border-bottom: none;
    }
    .ll-null-label {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--color-text);
      margin-left: 4px;
    }
    .ll-detached-label {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--color-text);
      margin-left: 0.5rem;
      opacity: 0.7;
    }
    .ll-caption {
      font-family: var(--font-mono);
      margin-top: 1rem;
      color: var(--color-text);
    }
    .ll-slider {
      width: 100%;
      margin-top: 0.5rem;
    }
    .ll-controls {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }
    .ll-controls button {
      padding: 0.4rem 1rem;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      background: var(--color-bg);
      color: var(--color-text);
      cursor: pointer;
    }
  </style>
</head>
<body>
  <nav class="navbar">
    <span><a href="../toc.html">C Programming</a> / Unit 8 / Introduction to Linked Lists</span>
    <button class="theme-toggle" aria-label="Toggle theme">🌙</button>
  </nav>

  <div class="lesson-layout">
    <aside class="sidebar"></aside>

    <main class="lesson-main">
      <h1>Introduction to Linked Lists</h1>

      <h2>What is a Linked List?</h2>
      <p>A <strong>Linked List</strong> is a <strong>linear data structure</strong> in which elements (called <strong>nodes</strong>) are stored <strong>non-contiguously</strong> in memory. Each node contains:</p>
      <ol>
        <li><strong>Data</strong> – the actual value.</li>
        <li><strong>Pointer (Link)</strong> – the address of the next node.</li>
      </ol>
      <p>Unlike arrays, linked lists do <strong>not</strong> require contiguous memory locations.</p>

      <h2>Visual Representation</h2>
      <pre><code class="language-none">Head
 ↓
+------+------+
| 10   |  •------+
+------+------+
              |
              v
        +------+------+
        | 20   |  •------+
        +------+------+
                      |
                      v
                +------+------+
                | 30   | NULL |
                +------+------+</code></pre>
      <p>Each node stores:</p>
      <pre><code class="language-none">+------+------+
| Data | Next |
+------+------+</code></pre>
      <p>Where:</p>
      <ul>
        <li><strong>Data</strong> = Information stored</li>
        <li><strong>Next</strong> = Address of the next node</li>
      </ul>

      <h2>Try It Yourself</h2>
      <p>This visualizer shows a singly linked list <code>10 → 20 → 30</code>. Switch between <strong>Insert</strong> (adding node 25 after node 20) and <strong>Delete</strong> (removing node 20) to see how pointers change.</p>
      <div class="ll-viz">
        <div class="ll-tabs">
          <button class="ll-tab ll-tab--active" id="ll-tab-insert" type="button">Insert</button>
          <button class="ll-tab" id="ll-tab-delete" type="button">Delete</button>
        </div>
        <div class="ll-row" id="ll-row"></div>
        <div class="ll-detached-row" id="ll-detached-row"></div>
        <p class="ll-caption" id="ll-caption">Ready — press Step to begin.</p>
        <input type="range" class="ll-slider" id="ll-slider" min="0" value="0" step="1" />
        <div class="ll-controls">
          <button id="ll-step" type="button">Step</button>
          <button id="ll-reset" type="button">Reset</button>
        </div>
      </div>

      <h2>Real Memory Representation</h2>
      <p>Suppose memory looks like this:</p>
      <table>
        <thead>
          <tr>
            <th>Address</th>
            <th>Data</th>
            <th>Next</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>500</td><td>10</td><td>1200</td></tr>
          <tr><td>1200</td><td>20</td><td>750</td></tr>
          <tr><td>750</td><td>30</td><td>NULL</td></tr>
        </tbody>
      </table>
      <p>Notice:</p>
      <ul>
        <li>Nodes are <strong>not stored together</strong>.</li>
        <li>They are connected using <strong>addresses (pointers)</strong>.</li>
        <li>The <strong>Head pointer</strong> stores the address of the first node (500).</li>
      </ul>

      <h2>Why Do We Need Linked Lists?</h2>
      <p>Consider an array:</p>
      <pre><code class="language-none">10 20 30 40 50</code></pre>
      <p>If you want to insert <strong>25</strong> between 20 and 30:</p>
      <pre><code class="language-none">10 20 25 30 40 50</code></pre>
      <p>In an array:</p>
      <ul>
        <li>Elements must be shifted.</li>
        <li>Time complexity = <strong>O(n)</strong>.</li>
      </ul>
      <p>In a linked list:</p>
      <ul>
        <li>Just change a few pointers.</li>
        <li>No shifting of elements is required.</li>
      </ul>

      <h2>Linked List vs Array</h2>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Array</th>
            <th>Linked List</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Memory</td><td>Contiguous</td><td>Non-contiguous</td></tr>
          <tr><td>Size</td><td>Fixed</td><td>Dynamic</td></tr>
          <tr><td>Insertion</td><td>Slow</td><td>Fast (at known position)</td></tr>
          <tr><td>Deletion</td><td>Slow</td><td>Fast (at known position)</td></tr>
          <tr><td>Random Access</td><td>Yes (O(1))</td><td>No (O(n))</td></tr>
          <tr><td>Memory Usage</td><td>No pointer overhead</td><td>Extra memory for pointers</td></tr>
        </tbody>
      </table>

      <h2>Basic Terminology</h2>

      <h3>Node</h3>
      <p>The basic building block.</p>
      <pre><code class="language-none">+------+------+
| Data | Next |
+------+------+</code></pre>

      <h3>Head</h3>
      <p>The pointer that stores the address of the first node.</p>
      <pre><code class="language-none">Head
 ↓
10 → 20 → 30 → NULL</code></pre>

      <h3>Tail</h3>
      <p>The last node.</p>
      <pre><code class="language-none">10 → 20 → 30
            ↑
          Tail</code></pre>
      <p>Its next pointer is:</p>
      <pre><code class="language-none">NULL</code></pre>

      <h3>NULL</h3>
      <p>Marks the end of the linked list.</p>
      <pre><code class="language-none">10 → 20 → 30 → NULL</code></pre>

      <h2>Types of Linked Lists</h2>

      <h3>1. Singly Linked List</h3>
      <pre><code class="language-none">10 → 20 → 30 → NULL</code></pre>
      <p>Each node points only to the next node.</p>

      <h3>2. Doubly Linked List</h3>
      <pre><code class="language-none">NULL ← 10 ⇄ 20 ⇄ 30 → NULL</code></pre>
      <p>Each node has both <strong>previous</strong> and <strong>next</strong> pointers.</p>

      <h3>3. Circular Singly Linked List</h3>
      <pre><code class="language-none">10 → 20 → 30
↑          ↓
└──────────┘</code></pre>
      <p>The last node points back to the first node.</p>

      <h3>4. Circular Doubly Linked List</h3>
      <pre><code class="language-none">      ⇄
10 ⇄ 20 ⇄ 30
↑          ↓
└──────────┘</code></pre>
      <p>Both previous and next links form a circle.</p>

      <h2>Where Are Linked Lists Used?</h2>
      <ul>
        <li>Implementing stacks</li>
        <li>Implementing queues</li>
        <li>Graphs (Adjacency Lists)</li>
        <li>Hash Tables (Separate Chaining)</li>
        <li>Music playlists</li>
        <li>Browser history</li>
        <li>Undo/Redo functionality</li>
        <li>Memory management</li>
        <li>Polynomial representation</li>
        <li>Dynamic memory allocation</li>
      </ul>

      <h2>Time Complexity Overview</h2>
      <table>
        <thead>
          <tr>
            <th>Operation</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Access</td><td>O(n)</td></tr>
          <tr><td>Search</td><td>O(n)</td></tr>
          <tr><td>Insert at Beginning</td><td>O(1)</td></tr>
          <tr><td>Insert at End (with tail)</td><td>O(1)</td></tr>
          <tr><td>Insert at End (without tail)</td><td>O(n)</td></tr>
          <tr><td>Delete at Beginning</td><td>O(1)</td></tr>
          <tr><td>Delete at End</td><td>O(n)</td></tr>
        </tbody>
      </table>

      <h2>Key Takeaways</h2>
      <ul>
        <li>A linked list is a <strong>dynamic linear data structure</strong> made up of nodes.</li>
        <li>Each node contains <strong>data</strong> and a <strong>pointer to the next node</strong>.</li>
        <li>Nodes can be stored anywhere in memory.</li>
        <li>Linked lists allow efficient insertion and deletion without shifting elements.</li>
        <li>The trade-off is that random access is not possible, so searching takes <strong>O(n)</strong> time.</li>
      </ul>

      <nav class="lesson-nav"></nav>
    </main>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/prismjs@1/prism.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-c.min.js"></script>
  <script src="../js/theme.js"></script>
  <script src="../js/sidebar.js"></script>
  <script src="../js/nav.js"></script>
  <script>
  <!-- ll-viz script body added in Task 2 -->
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify the file was created**

Run: `node -e "console.log(require('fs').existsSync('lessons/unit8-introduction-to-linked-lists.html'))"`
Expected: `true`

---

### Task 2: Implement the `ll-viz` step generation + renderer script

**Files:**
- Modify: `lessons/unit8-introduction-to-linked-lists.html` (replace the placeholder `<script>` block from Task 1)

- [ ] **Step 1: Replace the placeholder script block**

Find this block at the end of the file (from Task 1):

```html
  <script>
  <!-- ll-viz script body added in Task 2 -->
  </script>
```

Replace it with:

```html
  <script>
    (function () {
      var initialList = [
        { id: 'n10', value: 10 },
        { id: 'n20', value: 20 },
        { id: 'n30', value: 30 }
      ];

      function cloneList(list) {
        return list.map(function (node) {
          return { id: node.id, value: node.value };
        });
      }

      function generateInsertSteps() {
        var steps = [];
        var list = cloneList(initialList);
        var newNode = { id: 'n25', value: 25 };

        steps.push({
          list: cloneList(list),
          detached: { id: newNode.id, value: newNode.value, nextTarget: null },
          highlightNodeIds: [],
          highlightArrowFrom: null,
          caption: 'Create new node X with data 25.'
        });

        steps.push({
          list: cloneList(list),
          detached: { id: newNode.id, value: newNode.value, nextTarget: 'n30' },
          highlightNodeIds: [newNode.id],
          highlightArrowFrom: 'detached',
          caption: "Point X's next to node 30 (the node after 20)."
        });

        steps.push({
          list: cloneList(list),
          detached: { id: newNode.id, value: newNode.value, nextTarget: 'n30' },
          highlightNodeIds: ['n20'],
          highlightArrowFrom: 'n20',
          caption: "Point node 20's next to X."
        });

        var finalList = [list[0], list[1], newNode, list[2]];
        steps.push({
          list: cloneList(finalList),
          detached: null,
          highlightNodeIds: [],
          highlightArrowFrom: null,
          caption: 'X is now linked into the list between 20 and 30.'
        });

        return steps;
      }

      function generateDeleteSteps() {
        var steps = [];
        var list = cloneList(initialList);

        steps.push({
          list: cloneList(list),
          detached: null,
          highlightNodeIds: ['n10', 'n20'],
          highlightArrowFrom: null,
          caption: 'Locate node 20 and its predecessor, node 10.'
        });

        steps.push({
          list: [list[0], list[2]],
          detached: { id: 'n20', value: 20, nextTarget: 'n30' },
          highlightNodeIds: ['n10'],
          highlightArrowFrom: 'n10',
          caption: "Point node 10's next to node 30, bypassing node 20."
        });

        steps.push({
          list: [list[0], list[2]],
          detached: { id: 'n20', value: 20, nextTarget: 'n30' },
          highlightNodeIds: [],
          highlightArrowFrom: null,
          caption: 'Node 20 is now removed from the list.'
        });

        return steps;
      }

      var insertSteps = generateInsertSteps();
      var deleteSteps = generateDeleteSteps();

      var row = document.getElementById('ll-row');
      var detachedRow = document.getElementById('ll-detached-row');
      var caption = document.getElementById('ll-caption');
      var slider = document.getElementById('ll-slider');
      var stepBtn = document.getElementById('ll-step');
      var resetBtn = document.getElementById('ll-reset');
      var tabInsert = document.getElementById('ll-tab-insert');
      var tabDelete = document.getElementById('ll-tab-delete');

      if (!row) return;

      var currentSteps = insertSteps;
      var stepIndex = 0;

      function findNodeById(list, id) {
        for (var i = 0; i < list.length; i++) {
          if (list[i].id === id) return list[i];
        }
        return null;
      }

      function buildNodeEl(node, nextLabel, highlighted, detached) {
        var el = document.createElement('div');
        el.className = 'll-node';
        if (highlighted) el.classList.add('ll-node--highlight');
        if (detached) el.classList.add('ll-node--detached');

        var dataEl = document.createElement('div');
        dataEl.className = 'll-node-data';
        dataEl.textContent = node.value;

        var nextEl = document.createElement('div');
        nextEl.className = 'll-node-next';
        nextEl.textContent = 'next: ' + nextLabel;

        el.appendChild(dataEl);
        el.appendChild(nextEl);
        return el;
      }

      function buildArrow(highlighted, isNull) {
        var arrow = document.createElement('div');
        arrow.className = 'll-arrow';
        if (isNull) arrow.classList.add('ll-arrow--null');
        if (highlighted) arrow.classList.add('ll-arrow--highlight');
        return arrow;
      }

      function render() {
        var step = currentSteps[stepIndex];
        row.innerHTML = '';
        detachedRow.innerHTML = '';

        step.list.forEach(function (node, idx) {
          var isLast = idx === step.list.length - 1;
          var nextLabel = isLast ? 'NULL' : '•';
          var highlighted = step.highlightNodeIds.indexOf(node.id) !== -1;
          row.appendChild(buildNodeEl(node, nextLabel, highlighted, false));

          var arrowHighlighted = step.highlightArrowFrom === node.id;
          row.appendChild(buildArrow(arrowHighlighted, isLast));

          if (isLast) {
            var nullLabel = document.createElement('span');
            nullLabel.className = 'll-null-label';
            nullLabel.textContent = 'null';
            row.appendChild(nullLabel);
          }
        });

        if (step.detached) {
          var nextLabel = step.detached.nextTarget
            ? findNodeIdLabel(step.detached.nextTarget)
            : 'null';
          var detachedEl = buildNodeEl(
            { value: step.detached.value },
            step.detached.nextTarget ? '•' : 'null',
            false,
            true
          );
          detachedRow.appendChild(detachedEl);

          if (step.detached.nextTarget) {
            var arrowHighlighted = step.highlightArrowFrom === 'detached';
            detachedRow.appendChild(buildArrow(arrowHighlighted, false));
            var targetLabel = document.createElement('span');
            targetLabel.className = 'll-null-label';
            targetLabel.textContent = '→ node ' + nextLabel;
            detachedRow.appendChild(targetLabel);
          }

          var label = document.createElement('span');
          label.className = 'll-detached-label';
          label.textContent = 'Outside the list';
          detachedRow.appendChild(label);
        }

        caption.textContent = step.caption;
        slider.max = currentSteps.length - 1;
        slider.value = stepIndex;
        stepBtn.disabled = stepIndex >= currentSteps.length - 1;
      }

      function findNodeIdLabel(id) {
        var found = findNodeById(currentSteps[stepIndex].list, id);
        return found ? found.value : id;
      }

      function goToStep(idx) {
        stepIndex = Math.max(0, Math.min(idx, currentSteps.length - 1));
        render();
      }

      function switchMode(mode) {
        currentSteps = mode === 'delete' ? deleteSteps : insertSteps;
        tabInsert.classList.toggle('ll-tab--active', mode === 'insert');
        tabDelete.classList.toggle('ll-tab--active', mode === 'delete');
        goToStep(0);
      }

      tabInsert.addEventListener('click', function () {
        switchMode('insert');
      });

      tabDelete.addEventListener('click', function () {
        switchMode('delete');
      });

      stepBtn.addEventListener('click', function () {
        goToStep(stepIndex + 1);
      });

      resetBtn.addEventListener('click', function () {
        goToStep(0);
      });

      slider.addEventListener('input', function () {
        goToStep(parseInt(slider.value, 10));
      });

      slider.max = currentSteps.length - 1;
      render();
    })();
  </script>
```

- [ ] **Step 2: Syntax-check the inline script**

Run:
```bash
cd "d:/code/GITHUB/dotC" && node -e "
var fs = require('fs');
var html = fs.readFileSync('lessons/unit8-introduction-to-linked-lists.html', 'utf8');
var m = html.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/);
new Function(m[1]);
console.log('script syntax ok');
"
```
Expected: `script syntax ok`

- [ ] **Step 3: Commit**

```bash
git add lessons/unit8-introduction-to-linked-lists.html
git commit -m "Build Introduction to Linked Lists lesson with pointer visualizer"
```

---

### Task 3: Wire into site navigation (new Unit 8 chapter)

**Files:**
- Modify: `data/toc.json`

- [ ] **Step 1: Add the Unit 8 chapter**

Open `data/toc.json`. It currently ends with the `Unit 7` chapter's closing `]` then `}` then the closing `]` of the `chapters` array, e.g.:

```json
        {
          "title": "Applications of Recursion",
          "path": "lessons/unit7-applications-of-recursion.html"
        }
      ]
    }
  ]
}
```

Change the `Unit 7` chapter's closing to add a comma, then append a new `Unit 8` chapter, so the file ends with:

```json
        {
          "title": "Applications of Recursion",
          "path": "lessons/unit7-applications-of-recursion.html"
        }
      ]
    },
    {
      "title": "Unit 8",
      "lessons": [
        {
          "title": "Introduction to Linked Lists",
          "path": "lessons/unit8-introduction-to-linked-lists.html"
        }
      ]
    }
  ]
}
```

- [ ] **Step 2: Validate JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('data/toc.json', 'utf8')); console.log('valid')"`
Expected: `valid`

- [ ] **Step 3: Commit**

```bash
git add data/toc.json
git commit -m "Add Unit 8 chapter with Introduction to Linked Lists"
```

---

### Task 4: Serve, verify, and push

**Files:** None (verification only)

- [ ] **Step 1: Serve the site locally and verify the new page + toc**

```bash
cd "d:/code/GITHUB/dotC" && npx --yes serve . -l 5500 >/tmp/serve.log 2>&1 &
sleep 2
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5500/lessons/unit8-introduction-to-linked-lists.html
curl -s http://localhost:5500/lessons/unit8-introduction-to-linked-lists.html | grep -c "ll-viz"
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5500/data/toc.json
kill %1 2>/dev/null
```
Expected: `200`, then a count `>= 1`, then `200`.

- [ ] **Step 2: Push both commits to main**

```bash
git push
```
Expected: both commits (`Build Introduction to Linked Lists lesson...` and `Add Unit 8 chapter...`) pushed to `origin/main`.

---

## Self-Review Notes

- **Spec coverage:** Insert (4 steps) and Delete (3 steps) tabs ✅, flexbox+CSS arrows (no SVG) ✅, page-local `<style>` (no shared CSS classes) ✅, self-contained inline `<script>` ✅, starting list `10→20→30` matching the lesson's memory-address table ✅, no Play/Shuffle ✅, detached-node "Outside the list" row ✅, Step/Reset/slider controls ✅.
- **Placeholder scan:** None — all code blocks are complete and runnable.
- **Type consistency:** `step` objects consistently use `{list, detached, highlightNodeIds, highlightArrowFrom, caption}` across `generateInsertSteps`, `generateDeleteSteps`, and `render()`. `detached.nextTarget` is consistently either `null` or a node `id` string, resolved via `findNodeIdLabel()`.
