import { state, scheduleReflow } from './state'

let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D

export function getCanvas() {
  return canvas
}

export function getCtx() {
  return ctx
}

function resize() {
  const toolbar = document.getElementById('toolbar')!
  const textarea = document.getElementById('text-input')!
  const toolbarH = toolbar.offsetHeight
  const textareaH = textarea.offsetHeight
  const dpr = window.devicePixelRatio || 1

  const cssW = window.innerWidth
  const cssH = window.innerHeight - toolbarH - textareaH

  canvas.style.width = cssW + 'px'
  canvas.style.height = cssH + 'px'
  canvas.width = Math.round(cssW * dpr)
  canvas.height = Math.round(cssH * dpr)

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  state.canvasWidth = cssW
  state.canvasHeight = cssH
  scheduleReflow()
}

export function initCanvas() {
  canvas = document.getElementById('canvas') as HTMLCanvasElement
  ctx = canvas.getContext('2d')!

  resize()
  window.addEventListener('resize', resize)
}
