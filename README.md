# Pretext Flow

An interactive typographic art generator powered by [Pretext](https://github.com/chenglou/pretext) — the 15KB library that makes text layout 300x faster than the DOM.

Draw shapes on a canvas and watch text reflow around them in real-time at 120fps. Create stunning typographic posters and export them as PNG.

## Features

- **Real-time text reflow** — Text flows around obstacles instantly using Pretext's `layoutNextLine()` API
- **Drawing tools** — Freehand brush, circle, rectangle, and eraser
- **Typography controls** — Font family, size, text color, background color
- **Multiple fonts** — Inter, Playfair Display, Space Mono, Georgia, Helvetica
- **Custom text** — Paste or type any text in the bottom panel
- **PNG export** — Save your creation as an image
- **Responsive** — Adapts to any window size

## How It Works

The core engine uses Pretext's DOM-free text measurement to calculate line breaks at variable widths. For each line position:

1. An offscreen obstacle mask is scanned to find blocked horizontal regions
2. Available text slots are carved by subtracting obstacles from the full width
3. `layoutNextLine()` fills each slot, continuing the text cursor across gaps
4. Text is rendered via Canvas 2D `fillText()`

This approach avoids any DOM reflow, keeping the interaction smooth even with thousands of characters reflowing on every frame.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm, pnpm, or bun

### Installation

```bash
git clone https://github.com/imurodl/pretext-flow.git
cd pretext-flow
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
npm run preview
```

## Tech Stack

- **[Pretext](https://github.com/chenglou/pretext)** — DOM-free text measurement and layout
- **TypeScript** — Strict mode, ES2023
- **Vite** — Dev server and bundler
- **Canvas 2D** — Rendering engine
- **Google Fonts** — Inter, Playfair Display, Space Mono

## Project Structure

```
src/
  main.ts              Entry point, font loading, bootstrap
  state.ts             Central state object and render scheduling
  canvas-manager.ts    Canvas sizing, DPR handling, resize
  text-flow.ts         Core reflow engine using layoutNextLine()
  obstacle-mask.ts     Offscreen obstacle bitmap and scanline extraction
  drawing.ts           Freehand, circle, rect, eraser tools
  renderer.ts          Composites obstacles + text onto visible canvas
  toolbar.ts           Toolbar event binding and state sync
  sample-text.ts       Default text content
  style.css            Dark-themed styles
```

## License

MIT
