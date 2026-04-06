import './style.css'
import { onReflow, scheduleReflow } from './state'
import { initCanvas } from './canvas-manager'
import { initToolbar } from './toolbar'
import { initDrawing } from './drawing'
import { reflow } from './text-flow'
import { render } from './renderer'

async function init() {
  await document.fonts.ready

  initCanvas()
  initToolbar()
  initDrawing()

  onReflow(() => {
    reflow()
    render()
  })

  scheduleReflow()
}

init()
