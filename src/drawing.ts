import { state, scheduleReflow } from './state'
import { rebuildMask } from './obstacle-mask'
import { getCanvas } from './canvas-manager'

let isDrawing = false
let startX = 0
let startY = 0

function getPos(e: PointerEvent): { x: number; y: number } {
  const canvas = getCanvas()
  const rect = canvas.getBoundingClientRect()
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
}

function onPointerDown(e: PointerEvent) {
  const canvas = getCanvas()
  canvas.setPointerCapture(e.pointerId)
  isDrawing = true
  const pos = getPos(e)
  startX = pos.x
  startY = pos.y

  switch (state.activeTool) {
    case 'draw':
      state.activeShape = {
        kind: 'freehand',
        points: [pos],
        size: state.brushSize,
      }
      break
    case 'eraser':
      state.activeShape = {
        kind: 'eraser',
        points: [pos],
        size: state.brushSize,
      }
      break
    case 'circle':
      state.activeShape = {
        kind: 'circle',
        cx: pos.x,
        cy: pos.y,
        r: 0,
      }
      break
    case 'rect':
      state.activeShape = {
        kind: 'rect',
        x: pos.x,
        y: pos.y,
        w: 0,
        h: 0,
      }
      break
  }

  rebuildMask()
  scheduleReflow()
}

function onPointerMove(e: PointerEvent) {
  if (!isDrawing || !state.activeShape) return
  const pos = getPos(e)

  switch (state.activeShape.kind) {
    case 'freehand':
    case 'eraser':
      (state.activeShape as { points: { x: number; y: number }[] }).points.push(pos)
      break
    case 'circle': {
      const dx = pos.x - startX
      const dy = pos.y - startY
      state.activeShape.r = Math.sqrt(dx * dx + dy * dy)
      break
    }
    case 'rect': {
      state.activeShape.x = Math.min(startX, pos.x)
      state.activeShape.y = Math.min(startY, pos.y)
      state.activeShape.w = Math.abs(pos.x - startX)
      state.activeShape.h = Math.abs(pos.y - startY)
      break
    }
  }

  rebuildMask()
  scheduleReflow()
}

function onPointerUp() {
  if (!isDrawing) return
  isDrawing = false

  if (state.activeShape) {
    // Only commit shapes with meaningful size
    let commit = true
    if (state.activeShape.kind === 'circle' && state.activeShape.r < 2) commit = false
    if (state.activeShape.kind === 'rect' && (state.activeShape.w < 2 || state.activeShape.h < 2)) commit = false

    if (commit) {
      state.obstacles.push(state.activeShape)
    }
    state.activeShape = null
    rebuildMask()
    scheduleReflow()
  }
}

export function initDrawing() {
  const canvas = getCanvas()
  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointercancel', onPointerUp)
}
