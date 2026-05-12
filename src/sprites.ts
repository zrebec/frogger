import { mirrorSprite } from 'zx-kit'

// All sprites: 8×8 px, one byte per row, bit7 = leftmost pixel

// Frog — top-down view, landed pose
export const FROG_UP = new Uint8Array([
  0b01000010, // front feet out
  0b10111101, // front arms spread
  0b00111100, // head (wider)
  0b01111110, // body
  0b01111110, // body
  0b00111100, // waist
  0b10111101, // back legs spread
  0b01000010, // back feet
])

export const FROG_DOWN = new Uint8Array([
  0b01000010, // back feet
  0b10111101, // back legs spread
  0b00111100, // waist
  0b01111110, // body
  0b01111110, // body
  0b00111100, // head
  0b10111101, // front arms spread
  0b01000010, // front feet out
])

// Frog in mid-jump — legs pulled in, body compact
export const FROG_UP_JUMP = new Uint8Array([
  0b00000000,
  0b00100100, // feet barely out
  0b01111110, // legs
  0b00111100, // head
  0b00111100, // body compact
  0b01100110, // legs tucked
  0b00100100, // feet in
  0b00000000,
])

export const FROG_DOWN_JUMP = new Uint8Array([
  0b00000000,
  0b00100100, // feet in
  0b01100110, // legs tucked
  0b00111100, // body compact
  0b00111100, // head
  0b01111110, // legs
  0b00100100, // feet barely out
  0b00000000,
])

export const FROG_RIGHT = new Uint8Array([
  0b00001100, // front foot
  0b00011110, // front leg
  0b01111111, // body
  0b11111111, // body
  0b01111111, // body
  0b00011110, // back leg
  0b00001100, // back foot
  0b00000000,
])

export const FROG_LEFT = mirrorSprite(FROG_RIGHT)

// Frog right/left — mid-jump (body stretched forward)
export const FROG_RIGHT_JUMP = new Uint8Array([
  0b00000000,
  0b00001100, // nose
  0b00011110, // head
  0b01111110, // body stretched
  0b01111110,
  0b00011110, // tail
  0b00001100,
  0b00000000,
])

export const FROG_LEFT_JUMP = mirrorSprite(FROG_RIGHT_JUMP)

// Dead frog (flat squash)
export const FROG_DEAD = new Uint8Array([
  0b00000000,
  0b10100101, // splat
  0b11111111,
  0b01111110,
  0b11111111,
  0b10100101,
  0b00000000,
  0b00000000,
])

// Car — single cell (front/body)
export const CAR_BODY = new Uint8Array([
  0b00000000,
  0b01111110,
  0b11111111,
  0b11111111,
  0b11111111,
  0b01111110,
  0b00000000,
  0b00000000,
])

// Truck — 3 cells (left, mid, right)
export const TRUCK_LEFT = new Uint8Array([
  0b00111111,
  0b01111111,
  0b11111111,
  0b11111111,
  0b11111111,
  0b01111111,
  0b00111111,
  0b00000000,
])

export const TRUCK_MID = new Uint8Array([
  0b11111111,
  0b11111111,
  0b11111111,
  0b11111111,
  0b11111111,
  0b11111111,
  0b11111111,
  0b00000000,
])

export const TRUCK_RIGHT = mirrorSprite(TRUCK_LEFT)

// Log — 3 cells (left cap, body, right cap)
export const LOG_LEFT = new Uint8Array([
  0b00111111,
  0b01111111,
  0b11111111,
  0b11111111,
  0b11111111,
  0b01111111,
  0b00111111,
  0b00000000,
])

export const LOG_MID = new Uint8Array([
  0b11111111,
  0b11111111,
  0b10101010,
  0b11111111,
  0b01010101,
  0b11111111,
  0b11111111,
  0b00000000,
])

export const LOG_RIGHT = mirrorSprite(LOG_LEFT)

// Turtle (alive)
export const TURTLE = new Uint8Array([
  0b00111100,
  0b01111110,
  0b11011011,
  0b11111111,
  0b11011011,
  0b01111110,
  0b00111100,
  0b00000000,
])

// Turtle (sinking)
export const TURTLE_SINK = new Uint8Array([
  0b00000000,
  0b00111100,
  0b01011010,
  0b01111110,
  0b01011010,
  0b00111100,
  0b00000000,
  0b00000000,
])

// Lily pad (goal slot)
export const LILY_PAD = new Uint8Array([
  0b00011000,
  0b00111100,
  0b01111110,
  0b11111111,
  0b11111111,
  0b01111110,
  0b00111100,
  0b00011000,
])

// Lily pad filled (frog reached it)
export const LILY_FILLED = new Uint8Array([
  0b00011000,
  0b00111100,
  0b01011010,
  0b11111111,
  0b11111111,
  0b01011010,
  0b00111100,
  0b00011000,
])

// Water tile (two variants for animation)
export const WATER_A = new Uint8Array([
  0b00000000,
  0b01110111,
  0b11111111,
  0b11111111,
  0b00000000,
  0b11101110,
  0b11111111,
  0b11111111,
])

export const WATER_B = new Uint8Array([
  0b11111111,
  0b11111111,
  0b00000000,
  0b11101110,
  0b11111111,
  0b11111111,
  0b00000000,
  0b01110111,
])

// Road tile
export const ROAD_TILE = new Uint8Array([
  0b00000000,
  0b11111111,
  0b00000000,
  0b00000000,
  0b00000000,
  0b00000000,
  0b11111111,
  0b00000000,
])

// Grass tile
export const GRASS_TILE = new Uint8Array([
  0b01010101,
  0b10101010,
  0b01010101,
  0b10101010,
  0b01010101,
  0b10101010,
  0b01010101,
  0b10101010,
])

// Heart (lives display)
export const HEART = new Uint8Array([
  0b00000000,
  0b01101100,
  0b11111110,
  0b11111110,
  0b01111100,
  0b00111000,
  0b00010000,
  0b00000000,
])
