export { SCALE, CELL, C, type SpectrumColor } from 'zx-kit'

export const COLS = 32

// World is taller than the viewport — camera scrolls vertically
export const WORLD_ROWS = 40
export const VIEW_ROWS = 22
export const STATUS_ROWS = 2

export const CANVAS_W = 256   // COLS * CELL
export const CANVAS_H = 192   // (VIEW_ROWS + STATUS_ROWS) * CELL
export const WORLD_W  = 256   // COLS * CELL
export const WORLD_H  = 320   // WORLD_ROWS * CELL
export const VIEW_H   = 176   // VIEW_ROWS * CELL

// Frog start position
export const FROG_START_ROW = 38
export const FROG_START_COL = 16

// Goal lily pad columns (5 targets at top)
export const GOAL_COLS = [3, 9, 15, 21, 27] as const
export const GOAL_ROW = 1

export const INITIAL_LIVES = 3
