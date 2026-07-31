# dotC — Learn C Programming

A free, static, magazine-style ebook teaching C programming from the ground up — programming fundamentals through sorting algorithms, recursion, and linked lists.

**Live site:** [https://aman-0402.github.io/dotC/](https://aman-0402.github.io/dotC/)

## What's inside

8 units, 75+ lessons, covering:

- Programming fundamentals, algorithms, pseudocode, flowcharts
- C language basics — tokens, data types, operators, I/O
- Control structures and arrays (1D & 2D)
- Strings, functions, and pointers
- Structures, file handling, and dynamic memory allocation
- Algorithm analysis and searching
- Sorting algorithms (Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, Radix) and recursion — with interactive step-through visualizers
- Linked lists — with interactive pointer visualizers

## Tech stack

Plain HTML5, CSS3, and vanilla JavaScript. No build step, no framework, no npm dependencies.

- `data/toc.json` — table of contents driving site navigation
- `lessons/` — one HTML file per lesson
- `css/` — theming (light/dark), layout, shared components
- `js/` — sidebar navigation, prev/next links, theme toggle

## Running locally

```bash
npx serve .
```

Then open the printed local URL. A local static server is required (not `file://`) since navigation loads `data/toc.json` via `fetch()`.

## Contributing

This is a personal learning project. See [AGENTS.md](AGENTS.md) for the site's structure and content workflow.
