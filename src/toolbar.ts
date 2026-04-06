import { state, scheduleReflow } from './state'
import type { ToolType } from './state'
import { rebuildMask } from './obstacle-mask'
import { getCanvas } from './canvas-manager'

export function initToolbar() {
  // Tool buttons
  const toolButtons = ['draw', 'circle', 'rect', 'eraser'] as const
  for (const tool of toolButtons) {
    const btn = document.getElementById(`tool-${tool}`)!
    btn.addEventListener('click', () => {
      state.activeTool = tool as ToolType
      for (const t of toolButtons) {
        document.getElementById(`tool-${t}`)!.classList.toggle('active', t === tool)
      }
    })
  }

  // Brush size
  const brushSlider = document.getElementById('brush-size') as HTMLInputElement
  brushSlider.addEventListener('input', () => {
    state.brushSize = Number(brushSlider.value)
  })

  // Font select
  const fontSelect = document.getElementById('font-select') as HTMLSelectElement
  fontSelect.addEventListener('change', () => {
    state.fontFamily = fontSelect.value
    state.preparedKey = '' // force re-prepare
    scheduleReflow()
  })

  // Font size
  const fontSizeSlider = document.getElementById('font-size') as HTMLInputElement
  const fontSizeLabel = document.getElementById('font-size-label')!
  fontSizeSlider.addEventListener('input', () => {
    state.fontSize = Number(fontSizeSlider.value)
    fontSizeLabel.textContent = state.fontSize + 'px'
    state.preparedKey = '' // force re-prepare
    scheduleReflow()
  })

  // Text color
  const textColor = document.getElementById('text-color') as HTMLInputElement
  textColor.addEventListener('input', () => {
    state.textColor = textColor.value
    scheduleReflow()
  })

  // Background color
  const bgColor = document.getElementById('bg-color') as HTMLInputElement
  bgColor.addEventListener('input', () => {
    state.bgColor = bgColor.value
    scheduleReflow()
  })

  // Text input
  const textInput = document.getElementById('text-input') as HTMLTextAreaElement
  textInput.value = state.inputText
  textInput.addEventListener('input', () => {
    state.inputText = textInput.value
    state.preparedKey = '' // force re-prepare
    scheduleReflow()
  })

  // Clear
  document.getElementById('btn-clear')!.addEventListener('click', () => {
    state.obstacles = []
    state.activeShape = null
    rebuildMask()
    scheduleReflow()
  })

  // Export PNG
  document.getElementById('btn-export')!.addEventListener('click', () => {
    const canvas = getCanvas()
    const link = document.createElement('a')
    link.download = 'pretext-flow.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  })
}
