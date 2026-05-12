import type { SpectrumColor } from 'zx-kit'
import { C, WORLD_W, CELL } from './constants.ts'

export type LaneType = 'safe' | 'road' | 'water' | 'goal'
export type ObjectType = 'car' | 'truck' | 'log' | 'turtle'

export interface WorldObject {
  type: ObjectType
  x: number      // left edge in world pixels
  width: number  // in pixels
  speed: number  // px/s — negative = right-to-left
}

export interface Lane {
  row: number
  type: LaneType
  bg: SpectrumColor
  objects: WorldObject[]
}

// Produce evenly-spaced objects for a lane
function spawnObjects(
  type: ObjectType,
  count: number,
  width: number,
  speed: number,
): WorldObject[] {
  const spacing = Math.floor(WORLD_W / count)
  return Array.from({ length: count }, (_, i) => ({
    type,
    x: i * spacing,
    width,
    speed,
  }))
}

export function buildWorld(): Lane[] {
  const lanes: Lane[] = []

  // ── Row 0: top border (safe) ───────────────────────────────────────────
  lanes.push({ row: 0, type: 'safe', bg: C.BLACK, objects: [] })

  // ── Row 1: Goal row (lily pads handled by renderer separately) ─────────
  lanes.push({ row: 1, type: 'goal', bg: C.BLUE, objects: [] })

  // ── Rows 2-7: River A ──────────────────────────────────────────────────
  // logs right (+), turtles left (-)
  lanes.push({ row: 2, type: 'water', bg: C.BLUE, objects: spawnObjects('log',    3, CELL * 4, +45) })
  lanes.push({ row: 3, type: 'water', bg: C.BLUE, objects: spawnObjects('turtle', 4, CELL * 2, -40) })
  lanes.push({ row: 4, type: 'water', bg: C.BLUE, objects: spawnObjects('log',    2, CELL * 5, +55) })
  lanes.push({ row: 5, type: 'water', bg: C.BLUE, objects: spawnObjects('turtle', 3, CELL * 2, -35) })
  lanes.push({ row: 6, type: 'water', bg: C.BLUE, objects: spawnObjects('log',    3, CELL * 3, +50) })
  lanes.push({ row: 7, type: 'water', bg: C.BLUE, objects: spawnObjects('turtle', 4, CELL * 2, -45) })

  // ── Row 8: Safe bank ───────────────────────────────────────────────────
  lanes.push({ row: 8, type: 'safe', bg: C.GREEN, objects: [] })

  // ── Rows 9-14: River B (faster) ───────────────────────────────────────
  lanes.push({ row: 9,  type: 'water', bg: C.BLUE, objects: spawnObjects('log',    2, CELL * 5, +70) })
  lanes.push({ row: 10, type: 'water', bg: C.BLUE, objects: spawnObjects('turtle', 4, CELL * 2, -60) })
  lanes.push({ row: 11, type: 'water', bg: C.BLUE, objects: spawnObjects('log',    3, CELL * 3, +65) })
  lanes.push({ row: 12, type: 'water', bg: C.BLUE, objects: spawnObjects('turtle', 3, CELL * 2, -55) })
  lanes.push({ row: 13, type: 'water', bg: C.BLUE, objects: spawnObjects('log',    2, CELL * 4, +75) })
  lanes.push({ row: 14, type: 'water', bg: C.BLUE, objects: spawnObjects('turtle', 4, CELL * 2, -65) })

  // ── Row 15: Road median ────────────────────────────────────────────────
  lanes.push({ row: 15, type: 'safe', bg: C.YELLOW, objects: [] })

  // ── Rows 16-21: Road A (cars) ─────────────────────────────────────────
  lanes.push({ row: 16, type: 'road', bg: C.BLACK, objects: spawnObjects('car', 4, CELL * 2, +80) })
  lanes.push({ row: 17, type: 'road', bg: C.BLACK, objects: spawnObjects('car', 3, CELL * 2, -90) })
  lanes.push({ row: 18, type: 'road', bg: C.BLACK, objects: spawnObjects('car', 4, CELL * 2, +70) })
  lanes.push({ row: 19, type: 'road', bg: C.BLACK, objects: spawnObjects('car', 3, CELL * 2, -80) })
  lanes.push({ row: 20, type: 'road', bg: C.BLACK, objects: spawnObjects('car', 4, CELL * 2, +100) })
  lanes.push({ row: 21, type: 'road', bg: C.BLACK, objects: spawnObjects('car', 3, CELL * 2, -70) })

  // ── Row 22: Road median ────────────────────────────────────────────────
  lanes.push({ row: 22, type: 'safe', bg: C.YELLOW, objects: [] })

  // ── Rows 23-28: Road B (trucks) ───────────────────────────────────────
  lanes.push({ row: 23, type: 'road', bg: C.BLACK, objects: spawnObjects('truck', 2, CELL * 3, +40) })
  lanes.push({ row: 24, type: 'road', bg: C.BLACK, objects: spawnObjects('truck', 2, CELL * 3, -50) })
  lanes.push({ row: 25, type: 'road', bg: C.BLACK, objects: spawnObjects('truck', 2, CELL * 3, +35) })
  lanes.push({ row: 26, type: 'road', bg: C.BLACK, objects: spawnObjects('truck', 2, CELL * 3, -45) })
  lanes.push({ row: 27, type: 'road', bg: C.BLACK, objects: spawnObjects('car',   3, CELL * 2, +60) })
  lanes.push({ row: 28, type: 'road', bg: C.BLACK, objects: spawnObjects('car',   3, CELL * 2, -65) })

  // ── Row 29: Grass strip ────────────────────────────────────────────────
  lanes.push({ row: 29, type: 'safe', bg: C.GREEN, objects: [] })

  // ── Rows 30-35: River C ───────────────────────────────────────────────
  lanes.push({ row: 30, type: 'water', bg: C.BLUE, objects: spawnObjects('log',    3, CELL * 4, +50) })
  lanes.push({ row: 31, type: 'water', bg: C.BLUE, objects: spawnObjects('turtle', 4, CELL * 2, -45) })
  lanes.push({ row: 32, type: 'water', bg: C.BLUE, objects: spawnObjects('log',    2, CELL * 5, +60) })
  lanes.push({ row: 33, type: 'water', bg: C.BLUE, objects: spawnObjects('turtle', 3, CELL * 2, -55) })
  lanes.push({ row: 34, type: 'water', bg: C.BLUE, objects: spawnObjects('log',    3, CELL * 3, +55) })
  lanes.push({ row: 35, type: 'water', bg: C.BLUE, objects: spawnObjects('turtle', 4, CELL * 2, -40) })

  // ── Row 36: Safe bank ─────────────────────────────────────────────────
  lanes.push({ row: 36, type: 'safe', bg: C.GREEN, objects: [] })

  // ── Rows 37-39: Starting zone (safe) ──────────────────────────────────
  lanes.push({ row: 37, type: 'safe', bg: C.GREEN, objects: [] })
  lanes.push({ row: 38, type: 'safe', bg: C.GREEN, objects: [] })
  lanes.push({ row: 39, type: 'safe', bg: C.GREEN, objects: [] })

  return lanes
}

export function updateWorld(lanes: Lane[], dt: number, speedMult: number): void {
  const dtS = dt / 1000
  for (const lane of lanes) {
    for (const obj of lane.objects) {
      obj.x += obj.speed * speedMult * dtS
      // Wrap around
      if (obj.speed > 0 && obj.x > WORLD_W) obj.x -= WORLD_W + obj.width
      if (obj.speed < 0 && obj.x + obj.width < 0) obj.x += WORLD_W + obj.width
    }
  }
}

export function laneAt(lanes: Lane[], row: number): Lane | undefined {
  return lanes.find(l => l.row === row)
}

// Returns the WorldObject that overlaps the given pixel x range in a lane, or null
export function getOverlappingObject(
  lane: Lane,
  frogLeft: number,
  frogRight: number,
): WorldObject | null {
  for (const obj of lane.objects) {
    const objRight = obj.x + obj.width
    // Overlap test (frog must be mostly on the object — at least 4px overlap)
    const overlapLeft = Math.max(frogLeft, obj.x)
    const overlapRight = Math.min(frogRight, objRight)
    if (overlapRight - overlapLeft >= 4) return obj
  }
  return null
}

export function isOnSafeGround(lane: Lane, frogLeft: number, frogRight: number): boolean {
  if (lane.type === 'safe' || lane.type === 'goal') return true
  if (lane.type === 'road') return false
  // water: safe only if on a log/turtle
  return getOverlappingObject(lane, frogLeft, frogRight) !== null
}
