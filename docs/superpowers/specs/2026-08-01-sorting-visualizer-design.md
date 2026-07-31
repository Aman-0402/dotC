# Inline Sorting Algorithm Visualizer — Design

Date: 2026-08-01

## Context

Sorting lessons (Unit 7: Bubble Sort, Selection Sort, and future algorithms)
currently explain each algorithm via a hand-traced pass-by-pass text
walkthrough plus a static "Pass Summary" table. This spec adds an
interactive, embedded bar-chart visualizer so readers can step through or
play the algorithm themselves, using the same array as the lesson's worked
example.

## Scope

- Every sorting-algorithm lesson going forward gets its own visualizer:
  Bubble Sort, Selection Sort (retrofit both existing lessons), and future
  ones (Insertion, Merge, Quick, Heap, Counting, Radix, etc.) as they are
  written.
- Non-sorting lessons (searching, arrays, etc.) are out of scope for this
  spec.
- Not a shared/reusable engine — each lesson has its own self-contained
  script, per user's explicit choice (isolation over reuse; a bug or change
  in one lesson's visualizer cannot affect another).

## Placement

Inline panel embedded directly in the lesson page flow — not a modal, not
click-to-open. Positioned immediately after the "How X Sort Works"
pass-by-pass narrative section and before the "Algorithm" (pseudocode)
section. The reader reads the manual trace, then sees the same array live
and interactive right below it.

## Rendering

Plain HTML/CSS, no `<canvas>`:

- A flex row of `<div class="viz-bar">` elements inside a
  `<div class="viz-bars">` container.
- Each bar's height is set via inline `style.height` (proportional to its
  value, e.g. `value / maxValue * 100%` of a fixed-height container).
- Bar states are expressed as CSS classes toggled by JS:
  - `.viz-bar` — default (unsorted, not currently touched)
  - `.viz-bar--comparing` — actively being compared this step
  - `.viz-bar--candidate` — current running minimum (Selection Sort) or
    swap target
  - `.viz-bar--sorted` — locked into its final sorted position
- Height/color changes animate via CSS `transition: height 0.2s, background
  0.2s` — no manual animation loop.
- Each bar shows its value as a text label (matches the reference
  screenshot).
- Styling reuses the existing theme CSS custom properties (`--color-accent`,
  `--color-border`, etc.) from `css/variables.css` so it themes correctly in
  light/dark mode automatically.

## Data

- On page load, the visualizer initializes with the **exact array already
  used in that lesson's worked example** (e.g. Selection Sort:
  `[64, 25, 12, 22, 11]`; Bubble Sort: `[5, 3, 8, 4, 2]`).
- The **Shuffle** button generates a new random permutation of `1..n`
  (n = same length as the original array) and recomputes steps for it.

## Step Model

Each lesson's script precomputes the **entire step sequence** up front
(before any playback), as a plain JS array of step objects. Playback (Step /
Play / slider) never re-runs algorithm logic — it only walks an index
through this precomputed array and re-renders the bars + step caption for
that index.

Step object shape (per-algorithm, but consistent structure):

```js
{
  type: 'compare' | 'swap' | 'markSorted' | 'newCandidate',
  indices: [i, j],       // the bar index/indices this step highlights
  caption: 'string',     // one-line human-readable description shown under the bars
  array: [...]            // full array snapshot AFTER this step is applied
}
```

Example for Selection Sort (`[64, 25, 12, 22, 11]`), first few steps:

```js
[
  { type: 'compare', indices: [0, 1], caption: 'Compare 64 and 25', array: [64,25,12,22,11] },
  { type: 'newCandidate', indices: [1], caption: '25 is smaller — new candidate minimum', array: [64,25,12,22,11] },
  { type: 'compare', indices: [1, 2], caption: 'Compare 25 and 12', array: [64,25,12,22,11] },
  { type: 'newCandidate', indices: [2], caption: '12 is smaller — new candidate minimum', array: [64,25,12,22,11] },
  { type: 'compare', indices: [2, 3], caption: 'Compare 12 and 22', array: [64,25,12,22,11] },
  { type: 'compare', indices: [2, 4], caption: 'Compare 12 and 11', array: [64,25,12,22,11] },
  { type: 'newCandidate', indices: [4], caption: '11 is smaller — new candidate minimum', array: [64,25,12,22,11] },
  { type: 'swap', indices: [0, 4], caption: 'Swap 64 and 11', array: [11,25,12,22,64] },
  { type: 'markSorted', indices: [0], caption: 'Index 0 is now sorted', array: [11,25,12,22,64] }
]
```

Rendering a step: read `array` from that step to set bar heights/order,
apply `.viz-bar--comparing`/`--candidate` classes to `indices`, apply
`.viz-bar--sorted` to all indices marked sorted so far (tracked by scanning
prior `markSorted` steps up to the current index), show `caption` in a text
element below the bars.

## Controls

- **Shuffle** — generates new random array, recomputes steps, resets to
  step 0.
- **Play / Pause** — auto-advances one step every ~700ms; button toggles
  label between "Play" and "Pause".
- **Step** — advances exactly one step; disabled when already at the last
  step.
- **Reset** — returns to step 0 of the current array (does not reshuffle).
- **Slider** — a `<input type="range">` spanning `0..(steps.length - 1)`;
  dragging it scrubs directly to that step. Playback pauses if the user
  drags the slider while Play is active.

No Finish-pass button, no undo, no download/share icon in this version.

## File Organization

Each lesson gets its own inline `<script>` block at the bottom of that
lesson's HTML file (alongside the existing `theme.js`/`sidebar.js`/`nav.js`
`<script src>` tags), containing:

1. The hard-coded initial array for that lesson.
2. A `generateSteps(array)` function implementing that specific algorithm's
   step-by-step trace.
3. Rendering + control-wiring logic (bar creation, class toggling, button
   handlers, slider handling, play/pause interval).

Rationale: each visualizer is small (~80–120 lines) and one-off; per user's
explicit choice, isolation between lessons is preferred over extracting a
shared `js/visualizers/*.js` engine. If duplication becomes painful after
several more algorithms are added, extracting shared pieces can be revisited
then — not preemptively.

## Markup Skeleton (per lesson)

```html
<div class="viz">
  <div class="viz-bars" id="viz-bars"><!-- bars injected by JS --></div>
  <p class="viz-caption" id="viz-caption">Ready — press Play or Step to begin.</p>
  <input type="range" id="viz-slider" min="0" value="0" step="1" />
  <div class="viz-controls">
    <button id="viz-shuffle" type="button">Shuffle</button>
    <button id="viz-play" type="button">Play</button>
    <button id="viz-step" type="button">Step</button>
    <button id="viz-reset" type="button">Reset</button>
  </div>
</div>
```

Shared CSS for `.viz`, `.viz-bars`, `.viz-bar` (+ state modifiers),
`.viz-caption`, `.viz-controls` is added once to `css/components.css` (this
part IS shared, since it's pure presentation with no algorithm logic) so
every lesson's visualizer looks consistent without duplicating CSS per
lesson.

## Out of Scope

- Shared/reusable JS engine across lessons.
- Modal/dialog presentation.
- Finish-pass, undo, download/share controls.
- Non-sorting algorithm visualizations (deferred; may be proposed later as
  its own spec if wanted).

## Testing

Manual, per lesson: open the page, confirm bars render matching the
lesson's example array, Step advances one comparison/swap at a time with a
correct caption, Play auto-advances and can be paused, Shuffle produces a
new random array and resets playback, Reset returns to step 0, slider
scrubbing jumps correctly, and dark/light theme both render bars legibly.
