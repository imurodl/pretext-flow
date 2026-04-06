import { state } from './state'
import { getCtx } from './canvas-manager'

export function render() {
  const ctx = getCtx()
  const w = state.canvasWidth
  const h = state.canvasHeight
  const lineHeight = Math.round(state.fontSize * 1.5)

  // Background
  ctx.fillStyle = state.bgColor
  ctx.fillRect(0, 0, w, h)

  // Draw obstacle shapes as subtle overlays
  for (const shape of state.obstacles) {
    drawObstacleOverlay(ctx, shape)
  }
  if (state.activeShape) {
    drawObstacleOverlay(ctx, state.activeShape)
  }

  // Draw text
  ctx.fillStyle = state.textColor
  ctx.font = `${state.fontSize}px "${state.fontFamily}"`
  ctx.textBaseline = 'top'

  for (const line of state.lines) {
    ctx.fillText(line.text, line.x, line.y + (lineHeight - state.fontSize) / 2)
  }
}

function drawObstacleOverlay(ctx: CanvasRenderingContext2D, shape: typeof state.obstacles[0]) {
  ctx.save()
  switch (shape.kind) {
    case 'freehand': {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)'
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = shape.size
      if (shape.points.length === 1) {
        ctx.beginPath()
        ctx.arc(shape.points[0].x, shape.points[0].y, shape.size / 2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)'
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
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)'
      ctx.beginPath()
      ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'rect': {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)'
      ctx.fillRect(shape.x, shape.y, shape.w, shape.h)
      break
    }
    case 'eraser': {
      // Eraser doesn't draw an overlay
      break
    }
  }
  ctx.restore()
}
