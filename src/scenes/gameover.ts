import {
  drawTextCentered, drawText,
  createBlinker, tickBlinker,
  consumeAnyKey,
  type Scene, type SceneManager, replaceScene,
} from 'zx-kit'
import { C, CANVAS_W, CANVAS_H, CELL, COLS } from '../constants.ts'
import { createGameplayScene } from './gameplay.ts'

export function createGameOverScene(mgr: SceneManager, score: number, level: number): Scene {
  const blinker = createBlinker(500)

  return {
    name: 'gameover',

    update(dt) {
      tickBlinker(blinker, dt)
      if (consumeAnyKey()) {
        replaceScene(mgr, createGameplayScene(mgr))
      }
    },

    render(ctx) {
      ctx.fillStyle = C.BLACK
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Border
      ctx.fillStyle = C.B_RED
      ctx.fillRect(0, 0, CANVAS_W, 2)
      ctx.fillRect(0, CANVAS_H - 2, CANVAS_W, 2)
      ctx.fillRect(0, 0, 2, CANVAS_H)
      ctx.fillRect(CANVAS_W - 2, 0, 2, CANVAS_H)

      drawTextCentered(ctx, 'G A M E  O V E R', CELL * 5, COLS, C.B_RED, C.BLACK)

      ctx.fillStyle = C.WHITE
      ctx.fillRect(CELL * 4, CELL * 7, CANVAS_W - CELL * 8, 1)

      drawText(ctx, 'FINAL SCORE', CELL * 9, CELL * 9, C.YELLOW, C.BLACK)
      const scoreStr = String(score).padStart(6, '0')
      drawTextCentered(ctx, scoreStr, CELL * 11, COLS, C.B_YELLOW, C.BLACK)

      drawText(ctx, `LEVEL REACHED: ${level}`, CELL * 7, CELL * 13, C.WHITE, C.BLACK)

      ctx.fillStyle = C.WHITE
      ctx.fillRect(CELL * 4, CELL * 15, CANVAS_W - CELL * 8, 1)

      if (blinker.state) {
        drawTextCentered(ctx, 'PRESS ANY KEY', CELL * 17, COLS, C.B_WHITE, C.BLACK)
      }

      drawTextCentered(ctx, 'TO PLAY AGAIN', CELL * 19, COLS, C.CYAN, C.BLACK)
    },
  }
}
