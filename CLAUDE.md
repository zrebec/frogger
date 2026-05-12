# CLAUDE.md — Frogger (ZX Spectrum Style)

## Project

ZX Spectrum-style Frogger clone. Guide the frog across road and river to reach
the lily pad goals at the top. Uses **zx-kit** (local file: dependency) for
rendering, font, audio, input, camera, and scene management.

**Stack**: Vanilla TypeScript + Vite + HTML5 Canvas  
**ZX resolution**: 256×192 px, scaled 4× → 1024×768 px physical  
**Dependency**: `zx-kit` from `file:../zx-kit`

---

## ZX Spectrum constraints (same as all zx-kit projects)

- 256×192 internal resolution, SCALE=4, `imageSmoothingEnabled = false`
- Spectrum palette **only** — no other hex values
- All coordinates multiples of 8 (character grid)
- Sprites: `Uint8Array[8]`, one byte per row, bit 7 = leftmost pixel
- Font: ZX ROM font via `drawText` / `drawTextCentered` from zx-kit

---

## Architecture

```
src/
├── main.ts         — canvas setup, RAF loop, scene manager init
├── constants.ts    — dimensions, SCALE/CELL/C re-exported from zx-kit
├── sprites.ts      — all sprite bitmaps (Uint8Array)
├── audio.ts        — AudioContext, square-wave beeps
├── world.ts        — Lane definitions, object movement, collision helpers
└── scenes/
    ├── intro.ts    — title screen (blinker, consumeAnyKey)
    ├── gameplay.ts — camera follow, world/frog update, collision, render
    └── gameover.ts — score display, restart
```

## World layout (32×40 cells = 256×320 px)

| Rows    | Type  | Content                       |
|---------|-------|-------------------------------|
| 0       | safe  | top border (black)            |
| 1       | goal  | lily pads at cols 3,9,15,21,27|
| 2–7     | water | River A (logs + turtles)      |
| 8       | safe  | green bank                    |
| 9–14    | water | River B (faster)              |
| 15      | safe  | road median (yellow)          |
| 16–21   | road  | Road A (cars)                 |
| 22      | safe  | road median (yellow)          |
| 23–28   | road  | Road B (trucks)               |
| 29      | safe  | grass strip                   |
| 30–35   | water | River C                       |
| 36      | safe  | bank                          |
| 37–39   | safe  | starting zone (frog starts 38)|

## Camera

- worldW=256, worldH=320 — same width as viewport, taller
- viewW=256, viewH=176 (22 rows game area; 2 rows status bar below)
- lerp=0.12, deadzoneW=256 (no horizontal scroll), deadzoneH=48
- Target: frog's world pixel center

## Scene flow

```
IntroScene → (any key) → GameplayScene → (0 lives) → GameOverScene → (any key) → GameplayScene
```

## Dev commands

```bash
npm run dev    # localhost:5175
npm run build  # dist/
npx tsc --noEmit  # type check
```
