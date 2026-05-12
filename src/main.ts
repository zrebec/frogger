import {
  setupCanvas,
  createSceneManager, pushScene, updateScenes, renderScenes,
  initInput,
} from 'zx-kit'
import { SCALE } from './constants.ts'
import { createIntroScene } from './scenes/intro.ts'

const canvas = document.getElementById('game') as HTMLCanvasElement
const ctx = setupCanvas(canvas, SCALE)  // defaults: 256×192

initInput()

const mgr = createSceneManager()
pushScene(mgr, createIntroScene(mgr))

let last = performance.now()

function loop(now: number): void {
  const dt = Math.min(now - last, 100)
  last = now

  updateScenes(mgr, dt)
  renderScenes(mgr, ctx)

  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
