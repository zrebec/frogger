import {
  drawSprite, drawText,
  createCamera, setCameraTarget, tickCamera, worldToScreen,
  createBlinker, tickBlinker,
  tickMovement,
  type Scene, type SceneManager, replaceScene,
} from 'zx-kit'
import {
  C, CELL, COLS,
  WORLD_W, WORLD_H, VIEW_H, CANVAS_W, STATUS_ROWS,
  FROG_START_ROW, FROG_START_COL,
  GOAL_COLS, GOAL_ROW,
  INITIAL_LIVES,
} from '../constants.ts'
import {
  FROG_UP, FROG_DOWN, FROG_LEFT, FROG_RIGHT, FROG_DEAD,
  FROG_UP_JUMP, FROG_DOWN_JUMP, FROG_LEFT_JUMP, FROG_RIGHT_JUMP,
  CAR_BODY, TRUCK_LEFT, TRUCK_MID, TRUCK_RIGHT,
  LOG_LEFT, LOG_MID, LOG_RIGHT,
  TURTLE,
  LILY_PAD, LILY_FILLED,
  WATER_A, WATER_B, ROAD_TILE, GRASS_TILE, HEART,
} from '../sprites.ts'
import {
  buildWorld, updateWorld, laneAt, getOverlappingObject,
  type WorldObject,
} from '../world.ts'
import {
  unlockAudio, playHop, playSquash, playSplash, playGoal, playLevelComplete, playGameOver,
} from '../audio.ts'
import { createGameOverScene } from './gameover.ts'

interface Frog {
  col: number
  row: number
  x: number   // pixel x (can drift while riding)
  facing: 'up' | 'down' | 'left' | 'right'
  dead: boolean
  deathTimer: number
  hopTimer: number   // >0 = mid-jump sprite shown
  riding: WorldObject | null
}

function makeFrog(): Frog {
  return {
    col: FROG_START_COL,
    row: FROG_START_ROW,
    x: FROG_START_COL * CELL,
    facing: 'up',
    dead: false,
    deathTimer: 0,
    hopTimer: 0,
    riding: null,
  }
}

export function createGameplayScene(mgr: SceneManager): Scene {
  const cam = createCamera({
    viewW: CANVAS_W, viewH: VIEW_H,
    worldW: WORLD_W, worldH: WORLD_H,
    lerp: 0.12,
    deadzoneW: WORLD_W,  // no horizontal scrolling
    deadzoneH: 48,
  })

  let lanes = buildWorld()
  let frog = makeFrog()
  let lives = INITIAL_LIVES
  let score = 0
  let level = 1
  let speedMult = 1.0
  const goalsReached = new Set<number>()
  const waterBlinker = createBlinker(800)

  function resetFrog(): void {
    frog = makeFrog()
  }

  function killFrog(type: 'squash' | 'splash'): void {
    if (frog.dead) return
    frog.dead = true
    frog.deathTimer = 1200
    frog.riding = null
    if (type === 'squash') playSquash()
    else playSplash()
  }

  function reachGoal(goalIndex: number): void {
    goalsReached.add(goalIndex)
    score += 50 + Math.max(0, 5 - level) * 10
    playGoal()

    if (goalsReached.size === GOAL_COLS.length) {
      // Level complete — rebuild world, speed up
      level++
      speedMult += 0.25
      goalsReached.clear()
      lanes = buildWorld()
      playLevelComplete()
    }

    resetFrog()
  }

  function checkCollisions(): void {
    const lane = laneAt(lanes, frog.row)
    if (!lane) return

    const frogLeft = frog.x
    const frogRight = frog.x + CELL

    if (lane.type === 'water') {
      const obj = getOverlappingObject(lane, frogLeft, frogRight)
      if (!obj) {
        killFrog('splash')
        return
      }
      frog.riding = obj
    } else if (lane.type === 'road') {
      const obj = getOverlappingObject(lane, frogLeft, frogRight)
      if (obj) killFrog('squash')
    } else if (lane.type === 'goal') {
      // Check if landed on a lily pad column
      const goalIdx = GOAL_COLS.findIndex(gc => Math.abs(frog.col - gc) <= 0)
      if (goalIdx !== -1 && !goalsReached.has(goalIdx)) {
        reachGoal(goalIdx)
      } else if (goalIdx === -1) {
        // Landed in water between lily pads
        killFrog('splash')
      }
    } else {
      frog.riding = null
    }
  }

  return {
    name: 'gameplay',

    onEnter() {
      unlockAudio()
    },

    update(dt) {
      tickBlinker(waterBlinker, dt)

      if (frog.dead) {
        frog.deathTimer -= dt
        if (frog.deathTimer <= 0) {
          lives--
          if (lives <= 0) {
            playGameOver()
            replaceScene(mgr, createGameOverScene(mgr, score, level))
            return
          }
          resetFrog()
        }
        // Advance world even during death
        updateWorld(lanes, dt, speedMult)
        return
      }

      // ── Frog riding a log/turtle ──────────────────────────────────────
      if (frog.riding) {
        frog.x += frog.riding.speed * speedMult * (dt / 1000)
        frog.col = Math.floor(frog.x / CELL)

        // Off-screen on water → drown
        if (frog.x < 0 || frog.x + CELL > WORLD_W) {
          killFrog('splash')
        }
      }

      // ── Hop timer ─────────────────────────────────────────────────────
      frog.hopTimer = Math.max(0, frog.hopTimer - dt)

      // ── Input ─────────────────────────────────────────────────────────
      const dir = tickMovement(dt)
      if (dir) {
        const prevRow = frog.row
        let newCol = frog.col
        let newRow = frog.row

        if (dir === 'up')    newRow--
        if (dir === 'down')  newRow++
        if (dir === 'left')  newCol--
        if (dir === 'right') newCol++

        frog.facing = dir
        frog.hopTimer = 180  // show jump sprite for 180ms

        // Clamp to world bounds
        newCol = Math.max(0, Math.min(COLS - 1, newCol))
        newRow = Math.max(0, Math.min(lanes.length - 1, newRow))

        frog.col = newCol
        frog.row = newRow
        frog.x = newCol * CELL
        frog.riding = null

        playHop()
        score += newRow < prevRow ? 1 : 0  // 1 pt per step forward

        checkCollisions()
      }

      // ── World tick ────────────────────────────────────────────────────
      updateWorld(lanes, dt, speedMult)

      // ── Continuous collision on water/road ────────────────────────────
      if (!frog.dead) {
        const lane = laneAt(lanes, frog.row)
        if (lane) {
          if (lane.type === 'water' && frog.riding) {
            // Verify we're still on the same object (it might have moved away)
            const onStill = getOverlappingObject(lane, frog.x, frog.x + CELL)
            if (!onStill) killFrog('splash')
            else frog.riding = onStill
          } else if (lane.type === 'road') {
            const hit = getOverlappingObject(lane, frog.x, frog.x + CELL)
            if (hit) killFrog('squash')
          }
        }
      }

      // ── Camera follow ─────────────────────────────────────────────────
      const frogWorldY = frog.row * CELL + CELL / 2
      setCameraTarget(cam, WORLD_W / 2, frogWorldY)
      tickCamera(cam, dt)
    },

    render(ctx) {
      // ── Game world ────────────────────────────────────────────────────
      ctx.fillStyle = C.BLACK
      ctx.fillRect(0, 0, CANVAS_W, VIEW_H)

      for (const lane of lanes) {
        const wy = lane.row * CELL
        const s = worldToScreen(cam, 0, wy)
        const sy = s.y

        // Skip off-screen rows
        if (sy + CELL < 0 || sy > VIEW_H) continue

        // Draw lane background
        ctx.fillStyle = lane.bg
        ctx.fillRect(0, sy, CANVAS_W, CELL)

        // Draw lane texture tiles
        for (let col = 0; col < COLS; col++) {
          const sx = col * CELL
          if (lane.type === 'water') {
            const tile = waterBlinker.state ? WATER_A : WATER_B
            drawSprite(ctx, tile, sx, sy, C.B_CYAN, C.BLUE)
          } else if (lane.type === 'road') {
            drawSprite(ctx, ROAD_TILE, sx, sy, C.WHITE, C.BLACK)
          } else if (lane.type === 'safe') {
            drawSprite(ctx, GRASS_TILE, sx, sy,
              lane.bg === C.YELLOW ? C.B_YELLOW : C.B_GREEN,
              lane.bg === C.YELLOW ? C.YELLOW : C.GREEN)
          }
        }

        // Draw lane objects
        for (const obj of lane.objects) {
          const ox = worldToScreen(cam, obj.x, wy).x
          // Car color varies by lane row for variety
          const carInk = lane.row % 3 === 0 ? C.B_RED : lane.row % 3 === 1 ? C.B_WHITE : C.B_CYAN

          if (obj.type === 'car') {
            drawSprite(ctx, CAR_BODY, ox,        sy, carInk, C.BLACK)
            drawSprite(ctx, CAR_BODY, ox + CELL, sy, carInk, C.BLACK)
          } else if (obj.type === 'truck') {
            drawSprite(ctx, TRUCK_LEFT,  ox,            sy, C.B_MAGENTA, C.BLACK)
            drawSprite(ctx, TRUCK_MID,   ox + CELL,     sy, C.B_MAGENTA, C.BLACK)
            drawSprite(ctx, TRUCK_RIGHT, ox + CELL * 2, sy, C.B_MAGENTA, C.BLACK)
          } else if (obj.type === 'log') {
            const cells = obj.width / CELL
            drawSprite(ctx, LOG_LEFT, ox, sy, C.YELLOW, C.B_BLUE)
            for (let i = 1; i < cells - 1; i++) {
              drawSprite(ctx, LOG_MID, ox + i * CELL, sy, C.YELLOW, C.B_BLUE)
            }
            drawSprite(ctx, LOG_RIGHT, ox + (cells - 1) * CELL, sy, C.YELLOW, C.B_BLUE)
          } else if (obj.type === 'turtle') {
            const cells = obj.width / CELL
            for (let i = 0; i < cells; i++) {
              drawSprite(ctx, TURTLE, ox + i * CELL, sy, C.B_GREEN, C.BLUE)
            }
          }
        }
      }

      // ── Goal row: lily pads ───────────────────────────────────────────
      {
        const goalLane = laneAt(lanes, GOAL_ROW)
        if (goalLane) {
          const sy = worldToScreen(cam, 0, GOAL_ROW * CELL).y
          if (sy >= -CELL && sy <= VIEW_H) {
            GOAL_COLS.forEach((gc, i) => {
              const sprite = goalsReached.has(i) ? LILY_FILLED : LILY_PAD
              const ink = goalsReached.has(i) ? C.B_GREEN : C.GREEN
              drawSprite(ctx, sprite, gc * CELL, sy, ink, C.BLUE)
            })
          }
        }
      }

      // ── Frog ──────────────────────────────────────────────────────────
      {
        const frogSY = worldToScreen(cam, frog.x, frog.row * CELL).y
        if (!frog.dead) {
          const jumping = frog.hopTimer > 0
          const sprite =
            frog.facing === 'up'    ? (jumping ? FROG_UP_JUMP    : FROG_UP)    :
            frog.facing === 'down'  ? (jumping ? FROG_DOWN_JUMP  : FROG_DOWN)  :
            frog.facing === 'left'  ? (jumping ? FROG_LEFT_JUMP  : FROG_LEFT)  :
                                      (jumping ? FROG_RIGHT_JUMP : FROG_RIGHT)
          // Flash white mid-jump, yellow when landed
          const ink = jumping ? C.B_WHITE : C.B_YELLOW
          drawSprite(ctx, sprite, frog.x, frogSY, ink, C.BLACK)
        } else {
          // Flashing death: blink between dead sprite and blank
          if (Math.floor(frog.deathTimer / 150) % 2 === 0) {
            drawSprite(ctx, FROG_DEAD, frog.x, frogSY, C.B_RED, C.BLACK)
          }
        }
      }

      // ── Status bar (fixed, below game area) ───────────────────────────
      const barY = VIEW_H
      ctx.fillStyle = C.BLACK
      ctx.fillRect(0, barY, CANVAS_W, STATUS_ROWS * CELL)

      // Lives as hearts
      for (let i = 0; i < lives; i++) {
        drawSprite(ctx, HEART, i * CELL * 2 + CELL, barY + 4, C.B_RED, C.BLACK)
      }

      const scoreStr = `SCORE:${String(score).padStart(5, '0')}`
      drawText(ctx, scoreStr, CELL * 8, barY + 4, C.B_YELLOW, C.BLACK)

      const levelStr = `LV:${level}`
      drawText(ctx, levelStr, CELL * 22, barY + 4, C.CYAN, C.BLACK)

      const goalsStr = `GOALS:${goalsReached.size}/${GOAL_COLS.length}`
      drawText(ctx, goalsStr, CELL * 26, barY + 4, C.B_GREEN, C.BLACK)
    },
  }
}
