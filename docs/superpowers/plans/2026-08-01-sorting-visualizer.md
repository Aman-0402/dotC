# Inline Sorting Algorithm Visualizer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an interactive, embedded bar-chart step-through visualizer (Shuffle/Play/Step/Reset/slider) to the Bubble Sort and Selection Sort lessons, using each lesson's own worked-example array.

**Architecture:** Shared presentational CSS added once to `css/components.css`. Each lesson gets its own self-contained inline `<script>` (no shared JS engine, per design decision) that precomputes a full list of step objects for that specific algorithm, then a small renderer walks an index through those steps on Play/Step/slider input.

**Tech Stack:** Plain HTML/CSS/vanilla JS — same stack as the rest of the site. No build step, no test runner; verification is manual via a local static server, per this project's established convention (see `docs/superpowers/plans/2026-07-31-magazine-ebook-rebuild.md`).

---

This is a static-markup/CSS/JS project — no automated test runner. "Testing" steps mean: open the page in a browser (or via a local static server) and visually/functionally verify the described behavior. Every task ends with a manual verification step before commit.

### Task 1: Shared visualizer CSS

**Files:**
- Modify: `d:\code\GITHUB\dotC\css\components.css`

- [ ] **Step 1: Append the visualizer styles**

Add this block to the end of `css/components.css`:

```css
.viz {
  margin: 1.5rem 0 2rem;
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-elevated);
}

.viz-bars {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  height: 220px;
  padding: 0 0.5rem;
}

.viz-bar {
  flex: 1 1 0;
  max-width: 60px;
  background: var(--color-accent);
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0.35rem;
  transition: height 0.2s ease, background-color 0.2s ease;
  color: #fff;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
}

.viz-bar--comparing {
  background: #f59e0b;
}

.viz-bar--candidate {
  background: #ef4444;
}

.viz-bar--sorted {
  background: #22c55e;
}

.viz-caption {
  margin-top: 1rem;
  text-align: center;
  font-weight: 600;
  min-height: 1.5em;
}

.viz-slider {
  width: 100%;
  margin-top: 0.75rem;
}

.viz-controls {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.viz-controls button {
  padding: 0.5rem 1.1rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  font-weight: 600;
}

.viz-controls button:hover {
  border-color: var(--color-accent);
}

.viz-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

- [ ] **Step 2: Verify**

Read the file back and confirm braces are balanced and the block was appended without disturbing existing rules.

- [ ] **Step 3: Commit**

```bash
git add css/components.css
git commit -m "Add shared CSS for inline sorting visualizer"
```

---

### Task 2: Selection Sort visualizer

**Files:**
- Modify: `d:\code\GITHUB\dotC\lessons\unit7-selection-sort.html`

- [ ] **Step 1: Insert the visualizer markup after the Pass Summary section**

Find this exact text in the file:

```html
      <p>Notice that after <strong>each pass</strong>, the <strong>smallest unsorted element</strong> is placed in its correct position.</p>

      <h2>Selection Sort Algorithm</h2>
```

Replace it with:

```html
      <p>Notice that after <strong>each pass</strong>, the <strong>smallest unsorted element</strong> is placed in its correct position.</p>

      <h2>Try It Yourself</h2>
      <div class="viz">
        <div class="viz-bars" id="viz-bars"></div>
        <p class="viz-caption" id="viz-caption">Ready — press Play or Step to begin.</p>
        <input type="range" class="viz-slider" id="viz-slider" min="0" value="0" step="1" />
        <div class="viz-controls">
          <button id="viz-shuffle" type="button">Shuffle</button>
          <button id="viz-play" type="button">Play</button>
          <button id="viz-step" type="button">Step</button>
          <button id="viz-reset" type="button">Reset</button>
        </div>
      </div>

      <h2>Selection Sort Algorithm</h2>
```

- [ ] **Step 2: Insert the visualizer script before `</body>`**

Find this exact text (the last two lines of the file's script block):

```html
  <script src="../js/theme.js"></script>
  <script src="../js/sidebar.js"></script>
  <script src="../js/nav.js"></script>
</body>
</html>
```

Replace it with:

```html
  <script src="../js/theme.js"></script>
  <script src="../js/sidebar.js"></script>
  <script src="../js/nav.js"></script>
  <script>
    (function () {
      var initialArray = [64, 25, 12, 22, 11];

      function generateSteps(startArray) {
        var a = startArray.slice();
        var steps = [];
        var n = a.length;

        for (var i = 0; i < n - 1; i++) {
          var minIndex = i;

          for (var j = i + 1; j < n; j++) {
            steps.push({
              type: 'compare',
              indices: [minIndex, j],
              caption: 'Compare ' + a[minIndex] + ' and ' + a[j],
              array: a.slice()
            });

            if (a[j] < a[minIndex]) {
              minIndex = j;
              steps.push({
                type: 'newCandidate',
                indices: [minIndex],
                caption: a[minIndex] + ' is smaller — new candidate minimum',
                array: a.slice()
              });
            }
          }

          if (minIndex !== i) {
            var valI = a[i];
            var valMin = a[minIndex];
            var temp = a[i];
            a[i] = a[minIndex];
            a[minIndex] = temp;
            steps.push({
              type: 'swap',
              indices: [i, minIndex],
              caption: 'Swap ' + valI + ' and ' + valMin,
              array: a.slice()
            });
          }

          steps.push({
            type: 'markSorted',
            indices: [i],
            caption: 'Index ' + i + ' is now sorted',
            array: a.slice()
          });
        }

        steps.push({
          type: 'markSorted',
          indices: [n - 1],
          caption: 'Index ' + (n - 1) + ' is now sorted',
          array: a.slice()
        });

        return steps;
      }

      function shuffleArray(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
        return arr;
      }

      var container = document.getElementById('viz-bars');
      var caption = document.getElementById('viz-caption');
      var slider = document.getElementById('viz-slider');
      var shuffleBtn = document.getElementById('viz-shuffle');
      var playBtn = document.getElementById('viz-play');
      var stepBtn = document.getElementById('viz-step');
      var resetBtn = document.getElementById('viz-reset');

      if (!container) return;

      var currentArray = initialArray.slice();
      var steps = generateSteps(currentArray);
      var stepIndex = 0;
      var playing = false;
      var playTimer = null;

      function maxValue(arr) {
        var m = arr[0];
        for (var i = 1; i < arr.length; i++) {
          if (arr[i] > m) m = arr[i];
        }
        return m;
      }

      function sortedIndicesUpTo(idx) {
        var sorted = {};
        for (var i = 0; i <= idx; i++) {
          if (steps[i].type === 'markSorted') {
            steps[i].indices.forEach(function (n) {
              sorted[n] = true;
            });
          }
        }
        return sorted;
      }

      function render() {
        container.innerHTML = '';
        var step = steps[stepIndex];
        var arr = step ? step.array : currentArray;
        var max = maxValue(arr);
        var sorted = sortedIndicesUpTo(stepIndex);

        arr.forEach(function (value, idx) {
          var bar = document.createElement('div');
          bar.className = 'viz-bar';
          bar.style.height = (value / max * 100) + '%';

          if (step && step.indices.indexOf(idx) !== -1) {
            if (step.type === 'compare' || step.type === 'swap') {
              bar.classList.add('viz-bar--comparing');
            } else if (step.type === 'newCandidate') {
              bar.classList.add('viz-bar--candidate');
            }
          }

          if (sorted[idx]) {
            bar.classList.add('viz-bar--sorted');
          }

          var label = document.createElement('span');
          label.textContent = value;
          bar.appendChild(label);

          container.appendChild(bar);
        });

        caption.textContent = step ? step.caption : 'Ready — press Play or Step to begin.';
        slider.value = stepIndex;
        stepBtn.disabled = stepIndex >= steps.length - 1;

        if (stepIndex >= steps.length - 1) {
          pause();
        }
      }

      function goToStep(idx) {
        stepIndex = Math.max(0, Math.min(idx, steps.length - 1));
        render();
      }

      function play() {
        if (playing) return;
        playing = true;
        playBtn.textContent = 'Pause';
        playTimer = setInterval(function () {
          if (stepIndex >= steps.length - 1) {
            pause();
            return;
          }
          goToStep(stepIndex + 1);
        }, 700);
      }

      function pause() {
        playing = false;
        playBtn.textContent = 'Play';
        if (playTimer) {
          clearInterval(playTimer);
          playTimer = null;
        }
      }

      shuffleBtn.addEventListener('click', function () {
        pause();
        currentArray = shuffleArray(initialArray.slice());
        steps = generateSteps(currentArray);
        slider.max = steps.length - 1;
        goToStep(0);
      });

      playBtn.addEventListener('click', function () {
        if (playing) {
          pause();
        } else {
          play();
        }
      });

      stepBtn.addEventListener('click', function () {
        pause();
        goToStep(stepIndex + 1);
      });

      resetBtn.addEventListener('click', function () {
        pause();
        goToStep(0);
      });

      slider.addEventListener('input', function () {
        pause();
        goToStep(parseInt(slider.value, 10));
      });

      slider.max = steps.length - 1;
      render();
    })();
  </script>
</body>
</html>
```

- [ ] **Step 3: Verify JS syntax**

```bash
node -e "
var fs = require('fs');
var html = fs.readFileSync('lessons/unit7-selection-sort.html', 'utf8');
var match = html.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/);
new Function(match[1]);
console.log('syntax ok');
"
```

Expected output: `syntax ok`

- [ ] **Step 4: Manual browser verification**

Start a local static server from the project root:

```bash
npx --yes serve . -l 5500
```

Open `http://localhost:5500/lessons/unit7-selection-sort.html`. Confirm:
- A "Try It Yourself" section with 5 bars (values 64, 25, 12, 22, 11) appears between the Pass Summary and the "Selection Sort Algorithm" heading.
- Clicking **Step** advances one comparison/candidate/swap/sorted event at a time, with the caption text changing each click, until all 5 bars turn green (sorted) and **Step** becomes disabled.
- Clicking **Play** auto-advances every ~0.7s and the button label changes to "Pause"; clicking it again pauses.
- Dragging the slider jumps directly to that step and updates the bars/caption to match.
- **Shuffle** produces a new random 5-bar arrangement and resets to step 0; stepping through it still ends with all bars sorted ascending.
- **Reset** returns to step 0 of the current (possibly shuffled) array without reshuffling.
- Toggle dark/light theme — bars, caption, and buttons remain legible in both.

Stop the server once confirmed.

- [ ] **Step 5: Commit**

```bash
git add lessons/unit7-selection-sort.html
git commit -m "Add interactive step-through visualizer to Selection Sort lesson"
```

---

### Task 3: Bubble Sort visualizer

**Files:**
- Modify: `d:\code\GITHUB\dotC\lessons\unit7-bubble-sort.html`

- [ ] **Step 1: Insert the visualizer markup after the Pass Summary section**

Find this exact text in the file:

```html
      <p>Notice that after each pass, <strong>one largest unsorted element reaches its final position</strong>.</p>

      <h2>Bubble Sort Algorithm</h2>
```

Replace it with:

```html
      <p>Notice that after each pass, <strong>one largest unsorted element reaches its final position</strong>.</p>

      <h2>Try It Yourself</h2>
      <div class="viz">
        <div class="viz-bars" id="viz-bars"></div>
        <p class="viz-caption" id="viz-caption">Ready — press Play or Step to begin.</p>
        <input type="range" class="viz-slider" id="viz-slider" min="0" value="0" step="1" />
        <div class="viz-controls">
          <button id="viz-shuffle" type="button">Shuffle</button>
          <button id="viz-play" type="button">Play</button>
          <button id="viz-step" type="button">Step</button>
          <button id="viz-reset" type="button">Reset</button>
        </div>
      </div>

      <h2>Bubble Sort Algorithm</h2>
```

- [ ] **Step 2: Insert the visualizer script before `</body>`**

Find this exact text (the last two lines of the file's script block):

```html
  <script src="../js/theme.js"></script>
  <script src="../js/sidebar.js"></script>
  <script src="../js/nav.js"></script>
</body>
</html>
```

Replace it with:

```html
  <script src="../js/theme.js"></script>
  <script src="../js/sidebar.js"></script>
  <script src="../js/nav.js"></script>
  <script>
    (function () {
      var initialArray = [5, 3, 8, 4, 2];

      function generateSteps(startArray) {
        var a = startArray.slice();
        var steps = [];
        var n = a.length;

        for (var i = 0; i < n - 1; i++) {
          for (var j = 0; j < n - i - 1; j++) {
            steps.push({
              type: 'compare',
              indices: [j, j + 1],
              caption: 'Compare ' + a[j] + ' and ' + a[j + 1],
              array: a.slice()
            });

            if (a[j] > a[j + 1]) {
              var valJ = a[j];
              var valJ1 = a[j + 1];
              var temp = a[j];
              a[j] = a[j + 1];
              a[j + 1] = temp;
              steps.push({
                type: 'swap',
                indices: [j, j + 1],
                caption: 'Swap ' + valJ + ' and ' + valJ1,
                array: a.slice()
              });
            }
          }

          steps.push({
            type: 'markSorted',
            indices: [n - 1 - i],
            caption: 'Index ' + (n - 1 - i) + ' is now sorted',
            array: a.slice()
          });
        }

        steps.push({
          type: 'markSorted',
          indices: [0],
          caption: 'Index 0 is now sorted',
          array: a.slice()
        });

        return steps;
      }

      function shuffleArray(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
        return arr;
      }

      var container = document.getElementById('viz-bars');
      var caption = document.getElementById('viz-caption');
      var slider = document.getElementById('viz-slider');
      var shuffleBtn = document.getElementById('viz-shuffle');
      var playBtn = document.getElementById('viz-play');
      var stepBtn = document.getElementById('viz-step');
      var resetBtn = document.getElementById('viz-reset');

      if (!container) return;

      var currentArray = initialArray.slice();
      var steps = generateSteps(currentArray);
      var stepIndex = 0;
      var playing = false;
      var playTimer = null;

      function maxValue(arr) {
        var m = arr[0];
        for (var i = 1; i < arr.length; i++) {
          if (arr[i] > m) m = arr[i];
        }
        return m;
      }

      function sortedIndicesUpTo(idx) {
        var sorted = {};
        for (var i = 0; i <= idx; i++) {
          if (steps[i].type === 'markSorted') {
            steps[i].indices.forEach(function (n) {
              sorted[n] = true;
            });
          }
        }
        return sorted;
      }

      function render() {
        container.innerHTML = '';
        var step = steps[stepIndex];
        var arr = step ? step.array : currentArray;
        var max = maxValue(arr);
        var sorted = sortedIndicesUpTo(stepIndex);

        arr.forEach(function (value, idx) {
          var bar = document.createElement('div');
          bar.className = 'viz-bar';
          bar.style.height = (value / max * 100) + '%';

          if (step && step.indices.indexOf(idx) !== -1) {
            bar.classList.add('viz-bar--comparing');
          }

          if (sorted[idx]) {
            bar.classList.add('viz-bar--sorted');
          }

          var label = document.createElement('span');
          label.textContent = value;
          bar.appendChild(label);

          container.appendChild(bar);
        });

        caption.textContent = step ? step.caption : 'Ready — press Play or Step to begin.';
        slider.value = stepIndex;
        stepBtn.disabled = stepIndex >= steps.length - 1;

        if (stepIndex >= steps.length - 1) {
          pause();
        }
      }

      function goToStep(idx) {
        stepIndex = Math.max(0, Math.min(idx, steps.length - 1));
        render();
      }

      function play() {
        if (playing) return;
        playing = true;
        playBtn.textContent = 'Pause';
        playTimer = setInterval(function () {
          if (stepIndex >= steps.length - 1) {
            pause();
            return;
          }
          goToStep(stepIndex + 1);
        }, 700);
      }

      function pause() {
        playing = false;
        playBtn.textContent = 'Play';
        if (playTimer) {
          clearInterval(playTimer);
          playTimer = null;
        }
      }

      shuffleBtn.addEventListener('click', function () {
        pause();
        currentArray = shuffleArray(initialArray.slice());
        steps = generateSteps(currentArray);
        slider.max = steps.length - 1;
        goToStep(0);
      });

      playBtn.addEventListener('click', function () {
        if (playing) {
          pause();
        } else {
          play();
        }
      });

      stepBtn.addEventListener('click', function () {
        pause();
        goToStep(stepIndex + 1);
      });

      resetBtn.addEventListener('click', function () {
        pause();
        goToStep(0);
      });

      slider.addEventListener('input', function () {
        pause();
        goToStep(parseInt(slider.value, 10));
      });

      slider.max = steps.length - 1;
      render();
    })();
  </script>
</body>
</html>
```

- [ ] **Step 3: Verify JS syntax**

```bash
node -e "
var fs = require('fs');
var html = fs.readFileSync('lessons/unit7-bubble-sort.html', 'utf8');
var match = html.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/);
new Function(match[1]);
console.log('syntax ok');
"
```

Expected output: `syntax ok`

- [ ] **Step 4: Manual browser verification**

Start a local static server from the project root:

```bash
npx --yes serve . -l 5500
```

Open `http://localhost:5500/lessons/unit7-bubble-sort.html`. Confirm:
- A "Try It Yourself" section with 5 bars (values 5, 3, 8, 4, 2) appears between the Pass Summary and the "Bubble Sort Algorithm" heading.
- Clicking **Step** advances one comparison/swap/sorted event at a time, with the caption changing each click, until all 5 bars turn green and **Step** becomes disabled.
- Clicking **Play** auto-advances and toggles to "Pause"; clicking again pauses.
- Dragging the slider jumps directly to that step.
- **Shuffle** produces a new random 5-bar arrangement, steps through correctly to fully sorted ascending order.
- **Reset** returns to step 0 without reshuffling.
- Dark/light theme both render legibly.

Stop the server once confirmed.

- [ ] **Step 5: Commit**

```bash
git add lessons/unit7-bubble-sort.html
git commit -m "Add interactive step-through visualizer to Bubble Sort lesson"
```

---

### Task 4: Push

- [ ] **Step 1: Push all commits**

```bash
git push
```

Expected: all three commits (CSS, Selection Sort, Bubble Sort) pushed to `origin/main` with no errors.
