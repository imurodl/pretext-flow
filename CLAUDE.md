# CLAUDE.md

## Project Overview

Pretext Flow is an interactive typographic art generator. Users draw shapes on a canvas and text reflows around them in real-time using the [Pretext](https://github.com/chenglou/pretext) library's `layoutNextLine()` API.

## Tech Stack

- Vanilla TypeScript (strict mode, ES2023) — no framework
- Vite 8 for dev server and bundling
- `@chenglou/pretext` for DOM-free text measurement and layout
- Canvas 2D API for all rendering
- Google Fonts: Inter, Playfair Display, Space Mono

## Commands

- `npm run dev` — Start dev server (http://localhost:5173)
- `npm run build` — Type-check with `tsc` then bundle with Vite
- `npm run preview` — Preview production build
- `npx tsc --noEmit` — Type-check only (no tests in this project)

## Architecture

Data flow: `user input → state mutation → scheduleReflow() → reflow() → render()`

- **`state.ts`** — Single mutable state object, `requestAnimationFrame`-based render scheduling via `scheduleReflow()`
- **`text-flow.ts`** — Core engine. Queries obstacle mask for blocked intervals per line band, carves available slots, fills each with `layoutNextLine()`. This is the most important file.
- **`obstacle-mask.ts`** — Offscreen canvas bitmap. Shapes are drawn as white-on-black. `getBlockedIntervalsForBand()` scans pixel rows to extract horizontal blocked intervals. Adds 6px padding around obstacles.
- **`drawing.ts`** — Pointer event handlers. Creates obstacle shapes (freehand, circle, rect, eraser) and commits them to `state.obstacles` on pointer up.
- **`renderer.ts`** — Reads `state.lines` and draws background, obstacle overlays, and text via `fillText()`.
- **`canvas-manager.ts`** — Handles canvas sizing with `devicePixelRatio` scaling and window resize.
- **`toolbar.ts`** — Binds toolbar HTML controls to state mutations.

## Key Pretext API Usage

```ts
// One-time text preparation (expensive, ~19ms per 500 texts)
prepareWithSegments(text, font) → PreparedTextWithSegments

// Per-line layout with variable width (cheap, ~0.09ms per 500 texts)
layoutNextLine(prepared, cursor, maxWidth) → LayoutLine | null
```

The `preparedKey` field in state caches the prepare result and only re-runs when text or font changes.

## Conventions

- No frameworks or UI libraries — keep it vanilla TypeScript
- All visual output goes through `renderer.ts` onto the canvas
- All shared state lives in `state.ts` — never store state in modules
- Call `scheduleReflow()` after any state mutation that affects rendering
- Obstacle shapes are stored as typed discriminated unions (`ObstacleShape`)
- Minimum text slot width is 24px (filters out tiny gaps between obstacles)
