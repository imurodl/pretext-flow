import { state } from './state'
import type { ObstacleShape } from './state'

interface Interval {
  left: number
  right: number
}

let maskCanvas: OffscreenCanvas | null = null
let maskCtx: OffscreenCanvasRenderingContext2D | null = null
let maskW = 0
let maskH = 0

function ensureMask() {
  const w = state.canvasWidth
  const h = state.canvasHeight
  if (!maskCanvas || maskW !== w || maskH !== h) {
    maskCanvas = new OffscreenCanvas(w, h)
    maskCtx = maskCanvas.getContext('2d')!
    maskW = w
    maskH = h
  }
}

function drawShape(ctx: OffscreenCanvasRenderingContext2D, shape: ObstacleShape) {
  switch (shape.kind) {
    case 'freehand': {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = 'white'
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = shape.size
      if (shape.points.length === 1) {
        ctx.beginPath()
        ctx.arc(shape.points[0].x, shape.points[0].y, shape.size / 2, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.beginPath()
        ctx.moveTo(shape.points[0].x, shape.points[0].y)
        for (let i = 1; i < shape.points.length; i++) {
          ctx.lineTo(shape.points[i].x, shape.points[i].y)
        }
        ctx.stroke()
      }
      break
    }
    case 'circle': {
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'rect': {
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'white'
      ctx.fillRect(shape.x, shape.y, shape.w, shape.h)
      break
    }
    case 'eraser': {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.strokeStyle = 'white'
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = shape.size
      if (shape.points.length === 1) {
        ctx.beginPath()
        ctx.arc(shape.points[0].x, shape.points[0].y, shape.size / 2, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.beginPath()
        ctx.moveTo(shape.points[0].x, shape.points[0].y)
        for (let i = 1; i < shape.points.length; i++) {
          ctx.lineTo(shape.points[i].x, shape.points[i].y)
        }
        ctx.stroke()
      }
      break
    }
  }
}

export function rebuildMask() {
  ensureMask()
  const ctx = maskCtx!
  ctx.clearRect(0, 0, maskW, maskH)

  for (const shape of state.obstacles) {
    drawShape(ctx, shape)
  }

  if (state.activeShape) {
    drawShape(ctx, state.activeShape)
  }
}

export function appendToMask(shape: ObstacleShape) {
  ensureMask()
  drawShape(maskCtx!, shape)
}

export function getBlockedIntervalsForBand(bandTop: number, bandBottom: number): Interval[] {
  if (!maskCanvas || state.obstacles.length === 0 && !state.activeShape) {
    return []
  }

  const top = Math.max(0, Math.floor(bandTop))
  const bottom = Math.min(maskH, Math.ceil(bandBottom))
  if (top >= bottom) return []

  const width = maskW
  const height = bottom - top
  const imageData = maskCtx!.getImageData(0, top, width, height)
  const data = imageData.data

  // For each column, check if ANY row in the band has a non-zero alpha
  const columnBlocked = new Uint8Array(width)
  for (let row = 0; row < height; row++) {
    const rowOffset = row * width * 4
    for (let col = 0; col < width; col++) {
      if (data[rowOffset + col * 4 + 3] > 0) {
        columnBlocked[col] = 1
      }
    }
  }

  // Extract runs of blocked columns as intervals
  const intervals: Interval[] = []
  let inRun = false
  let runStart = 0

  for (let col = 0; col <= width; col++) {
    const blocked = col < width && columnBlocked[col] === 1
    if (blocked && !inRun) {
      runStart = col
      inRun = true
    } else if (!blocked && inRun) {
      intervals.push({ left: runStart, right: col })
      inRun = false
    }
  }

  // Add padding around obstacles so text doesn't touch them
  const pad = 6
  return intervals.map(i => ({
    left: Math.max(0, i.left - pad),
    right: Math.min(width, i.right + pad),
  }))
}
