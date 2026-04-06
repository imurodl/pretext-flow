import type { PreparedTextWithSegments } from '@chenglou/pretext'
import { SAMPLE_TEXT } from './sample-text'

export type ToolType = 'draw' | 'circle' | 'rect' | 'eraser'

export interface FreehandShape {
  kind: 'freehand'
  points: { x: number; y: number }[]
  size: number
}

export interface CircleShape {
  kind: 'circle'
  cx: number
  cy: number
  r: number
}

export interface RectShape {
  kind: 'rect'
  x: number
  y: number
  w: number
  h: number
}

export interface EraserShape {
  kind: 'eraser'
  points: { x: number; y: number }[]
  size: number
}

export type ObstacleShape = FreehandShape | CircleShape | RectShape | EraserShape

export interface PositionedLine {
  x: number
  y: number
  text: string
  width: number
}

export interface AppState {
  activeTool: ToolType
  brushSize: number
  fontFamily: string
  fontSize: number
  textColor: string
  bgColor: string
  inputText: string
  obstacles: ObstacleShape[]
  activeShape: ObstacleShape | null
  canvasWidth: number
  canvasHeight: number
  prepared: PreparedTextWithSegments | null
  preparedKey: string
  lines: PositionedLine[]
}

export const state: AppState = {
  activeTool: 'draw',
  brushSize: 40,
  fontFamily: 'Inter',
  fontSize: 16,
  textColor: '#e0e0e0',
  bgColor: '#111111',
  inputText: SAMPLE_TEXT,
  obstacles: [],
  activeShape: null,
  canvasWidth: 0,
  canvasHeight: 0,
  prepared: null,
  preparedKey: '',
  lines: [],
}

let scheduled = false
let reflowCallback: (() => void) | null = null

export function onReflow(cb: () => void) {
  reflowCallback = cb
}

export function scheduleReflow() {
  if (scheduled) return
  scheduled = true
  requestAnimationFrame(() => {
    scheduled = false
    reflowCallback?.()
  })
}
