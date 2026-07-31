# Linked-List Pointer Visualizer — Design

**Status:** Approved
**First use case:** `lessons/unit8-introduction-to-linked-lists.html` (Unit 8, Topic 1)

## Problem

Unit 8 (Linked Lists) lesson content includes a `genui{SINGLY_LINKED_LIST_POINTERS}` placeholder and a reference screenshot showing an interactive Insert/Delete step-through visualizer: node boxes with `data`/`next` fields, pointer arrows, mode tabs, a step slider, and step captions.

This mirrors the Unit 7 sorting-algorithm "Try It Yourself" visualizer in spirit (self-contained per-lesson JS, step-array-driven playback) but the domain is different: nodes and pointers instead of an array of bars.

## Decisions

- **Scope:** Both **Insert** and **Delete** operations, each as its own mode tab with an independent step sequence, on the same starting list.
- **Rendering:** Flexbox row of node boxes + CSS-drawn arrow connectors. No SVG, no absolute positioning, no coordinate math. A "detached" node (new node before insertion, or removed node after deletion) renders in a row below the main list when relevant — matches the screenshot's "Outside the list" treatment without needing free positioning.
- **Reuse:** Fully independent per lesson — CSS is inlined via a page-local `<style>` block, JS is a self-contained inline `<script>`. No shared `.ll-viz` classes added to `css/components.css`. Each future linked-list lesson that wants this widget copies and adapts the pattern, consistent with the "no shared engine" philosophy already used for sorting visualizers.
- **Data:** Starting list `10 → 20 → 30`, matching the lesson's own memory-address worked example (addresses 500/1200/750 store values 10/20/30). Insert demonstrates adding `25` after node `20`. Delete demonstrates removing node `20`.

## Structure

### HTML

```html
<div class="ll-viz">
  <div class="ll-tabs">
    <button class="ll-tab ll-tab--active" data-mode="insert" type="button">Insert</button>
    <button class="ll-tab" data-mode="delete" type="button">Delete</button>
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
```

### CSS (page-local `<style>` block in the lesson `<head>`)

Node box: bordered rectangle, two stacked fields (`data` value on top, `next` label + value below), fixed width, monospace font — reuses the site's existing color tokens (`--color-border`, `--color-bg-elevated`, `--color-accent`, `--color-text`, `--font-mono`) from `css/variables.css` so it stays theme-aware without new tokens.

Arrow between adjacent nodes: a short horizontal line (`::after` on the node box or a dedicated `.ll-arrow` flex item) with a CSS-triangle arrowhead, colored `--color-accent`. A `null` terminator renders as a short line ending in a vertical tick (┤-style), after the last node.

Detached node: same node-box styling, rendered in `.ll-detached-row` below the main row with a dashed border and a small "Outside the list" label under it — only visible when the current step has a detached node.

Highlighted arrow/node (the pointer being changed this step): `--color-accent` background tint or thicker border on the box, and the affected arrow drawn in a different color (e.g. green, reusing `--viz-color-candidate` if that token exists from the sorting visualizer, else a new inline color matching that intent).

### JS (self-contained inline `<script>` at the end of the lesson body)

```js
function generateInsertSteps() {
  // returns [{list:[{id,value}], detached:{id,value}|null, highlightArrowFrom:id|null, caption}, ...]
}
function generateDeleteSteps() {
  // same shape
}
```

Each step is a full snapshot (list array + detached node + what to highlight + caption) — same "precompute all steps up front, then walk an index" approach as the sorting visualizer's `generateSteps()`/`goToStep()`.

Tab click: swap `currentSteps` between `insertSteps`/`deleteSteps`, reset `stepIndex` to 0, re-render.

`render()`: clears `#ll-row` and `#ll-detached-row`, rebuilds node boxes + arrows from the current step's `list`/`detached`, applies highlight classes, updates caption + slider position.

No Play/Shuffle controls — this is a fixed, deterministic demonstration (not a randomized dataset like the sorting bars), so Step/Reset + the slider are sufficient.

## Step sequences

### Insert (X=25 after node 20)

1. "Create new node X with data 25." — list unchanged, detached `{value:25, next:null}` appears.
2. "Point X's next to node 30 (the node after 20)." — detached node's next arrow now points at node 30; highlight that link.
3. "Point node 20's next to X." — main list's `20.next` arrow now targets X; highlight that link.
4. "X is now linked into the list between 20 and 30." — list becomes `10 → 20 → 25 → 30`, detached row empty, no highlight.

### Delete (remove node 20)

1. "Locate node 20 and its predecessor, node 10." — list unchanged, highlight node 20 and node 10.
2. "Point node 10's next to node 30, bypassing node 20." — `10.next` arrow now targets 30; highlight that link. Node 20 visually detaches to the row below (still showing its own stale `next → 30` pointer, dashed border, "Outside the list" label).
3. "Node 20 is now removed from the list." — list is `10 → 30`, detached row shows node 20 fading/dashed, caption confirms removal.

(3 steps for delete, 4 for insert — asymmetric step counts are fine since each tab tracks its own `steps.length` independently for the slider `max`.)

## Non-goals

- No Play/Shuffle/randomize — fixed deterministic demo only.
- No shared CSS/JS module across lessons (explicit user decision — full per-lesson independence).
- No SVG, no free/absolute positioning, no doubly-linked or circular variants in this first widget (those are separate future lessons if visualized at all).

## Testing

Same convention as sorting lessons: `node -e` syntax-check the extracted inline `<script>`, serve locally, curl-verify the page returns 200 and contains the expected `ll-viz`/`ll-row` markup, then commit + push. No headless browser available — visual/interactive correctness is verified by code review of the step-generation logic, not by rendering in a real browser.
