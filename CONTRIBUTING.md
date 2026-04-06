# Contributing to Pretext Flow

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. Fork and clone the repo:

```bash
git clone https://github.com/<your-username>/pretext-flow.git
cd pretext-flow
```

2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) — changes hot-reload automatically.

## Making Changes

1. Create a branch from `main`:

```bash
git checkout -b feat/your-feature
```

2. Make your changes. Run the type checker before committing:

```bash
npx tsc --noEmit
```

3. Build to verify everything compiles:

```bash
npm run build
```

4. Commit with a clear message describing _what_ and _why_.

5. Open a pull request against `main`.

## Code Style

- **TypeScript strict mode** — No `any`, no unused variables
- **No frameworks** — This is a vanilla TypeScript project; keep it that way
- **Small modules** — Each file has a single responsibility
- **Canvas rendering** — All visual output goes through `renderer.ts`
- **State management** — All shared state lives in `state.ts`; call `scheduleReflow()` after mutations

## Architecture

The data flow is straightforward:

```
User input → state mutation → scheduleReflow() → reflow() → render()
```

- **`state.ts`** — Single mutable state object, `requestAnimationFrame` scheduling
- **`obstacle-mask.ts`** — Offscreen canvas bitmap; scanline extraction converts shapes to blocked intervals
- **`text-flow.ts`** — Queries the obstacle mask, carves available slots, fills them with Pretext's `layoutNextLine()`
- **`renderer.ts`** — Reads `state.lines` and draws everything onto the visible canvas
- **`drawing.ts`** — Pointer event handlers that create obstacle shapes

## Ideas for Contributions

- Undo/redo support
- Draggable/resizable shapes after placement
- More font options or custom font upload
- Text alignment (left, center, justify)
- Multi-column layout mode
- SVG export
- Mobile touch support improvements
- Performance profiling and optimization

## Reporting Issues

Open an issue with:

- What you expected to happen
- What actually happened
- Browser and OS info
- Screenshots if it's a visual bug
