import { prepareWithSegments, layoutNextLine } from '@chenglou/pretext'
import { state } from './state'
import type { PositionedLine } from './state'
import { getBlockedIntervalsForBand } from './obstacle-mask'

interface Interval {
  left: number
  right: number
}

function carveSlots(full: Interval, blocked: Interval[]): Interval[] {
  const slots: Interval[] = []
  let cursor = full.left

  for (const b of blocked) {
    if (b.left > cursor) {
      slots.push({ left: cursor, right: b.left })
    }
    cursor = Math.max(cursor, b.right)
  }

  if (cursor < full.right) {
    slots.push({ left: cursor, right: full.right })
  }

  // Filter out slots too narrow for meaningful text
  return slots.filter(s => (s.right - s.left) >= 24)
}

export function reflow() {
  const font = `${state.fontSize}px "${state.fontFamily}"`
  const lineHeight = Math.round(state.fontSize * 1.5)
  const padding = 16

  // Re-prepare text if font or text changed
  const key = `${state.inputText}::${font}`
  if (state.preparedKey !== key) {
    if (state.inputText.trim().length === 0) {
      state.prepared = null
      state.preparedKey = key
      state.lines = []
      return
    }
    state.prepared = prepareWithSegments(state.inputText, font)
    state.preparedKey = key
  }

  if (!state.prepared) {
    state.lines = []
    return
  }

  const lines: PositionedLine[] = []
  let cursor = { segmentIndex: 0, graphemeIndex: 0 }
  let y = padding
  let done = false

  while (y + lineHeight <= state.canvasHeight - padding && !done) {
    const blocked = getBlockedIntervalsForBand(y, y + lineHeight)
    const slots = carveSlots(
      { left: padding, right: state.canvasWidth - padding },
      blocked
    )

    if (slots.length === 0) {
      y += lineHeight
      continue
    }

    for (const slot of slots) {
      const width = slot.right - slot.left
      const line = layoutNextLine(state.prepared!, cursor, width)
      if (line === null) {
        done = true
        break
      }
      lines.push({
        x: slot.left,
        y,
        text: line.text,
        width: line.width,
      })
      cursor = line.end
    }

    y += lineHeight
  }

  state.lines = lines
}
