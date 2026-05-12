import {
  drawText, drawTextCentered, drawSprite,
  createBlinker, tickBlinker,
  consumeAnyKey,
  type Scene, type SceneManager, replaceScene,
} from 'zx-kit'
import { C, CANVAS_W, CANVAS_H, CELL, COLS } from '../constants.ts'
import { FROG_UP, LILY_PAD, WATER_A, GRASS_TILE } from '../sprites.ts'
import { createGameplayScene } from './gameplay.ts'

export function createIntroScene(mgr: SceneManager): Scene {
  const blinker = createBlinker(500)

  return {
    name: 'intro',

    update(dt) {
      tickBlinker(blinker, dt)
      if (consumeAnyKey()) {
        replaceScene(mgr, createGameplayScene(mgr))
      }
    },

    render(ctx) {
      // Sky / background
      ctx.fillStyle = C.BLACK
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Top border line
      ctx.fillStyle = C.CYAN
      ctx.fillRect(0, 0, CANVAS_W, 1)
      ctx.fillStyle = C.CYAN
      ctx.fillRect(0, CANVAS_H - 1, CANVAS_W, 1)

      // Decorative water strip at top
      for (let col = 0; col < 32; col++) {
        drawSprite(ctx, WATER_A, col * CELL, CELL, C.B_CYAN, C.BLUE)
      }

      // Grass strip below water
      for (let col = 0; col < 32; col++) {
        drawSprite(ctx, GRASS_TILE, col * CELL, CELL * 2, C.B_GREEN, C.GREEN)
      }

      // Lily pads in water
      for (const col of [3, 9, 15, 21, 27]) {
        drawSprite(ctx, LILY_PAD, col * CELL, CELL, C.B_GREEN, C.BLUE)
      }

      // Title
      drawTextCentered(ctx, 'F R O G G E R', CELL * 4, COLS, C.B_YELLOW, C.BLACK)
      drawTextCentered(ctx, 'ZX SPECTRUM EDITION', CELL * 6, COLS, C.CYAN, C.BLACK)

      // Frog sprite in the middle
      drawSprite(ctx, FROG_UP, CANVAS_W / 2 - CELL, CELL * 8, C.B_GREEN, C.BLACK)
      drawSprite(ctx, FROG_UP, CANVAS_W / 2 + CELL, CELL * 8, C.B_GREEN, C.BLACK)

      // Instructions
      drawTextCentered(ctx, 'GUIDE THE FROG HOME', CELL * 11, COLS, C.WHITE, C.BLACK)
      drawTextCentered(ctx, 'ARROW KEYS TO MOVE', CELL * 13, COLS, C.WHITE, C.BLACK)

      // Controls
      drawText(ctx, 'LIVES:3    SCORE:0', CELL * 4, CELL * 15, C.YELLOW, C.BLACK)

      // Blinking press any key
      if (blinker.state) {
        drawTextCentered(ctx, 'PRESS ANY KEY', CELL * 17, COLS, C.B_WHITE, C.BLACK)
      }

      // Divider
      ctx.fillStyle = C.CYAN
      ctx.fillRect(0, CELL * 19, CANVAS_W, 1)

      // Version
      drawText(ctx, '(C) 2026 ZX-KIT DEMO', CELL * 3, CELL * 20, C.CYAN, C.BLACK)
    },
  }
}
