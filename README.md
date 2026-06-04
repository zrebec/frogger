# Frogger — ZX Spectrum Edition

ZX Spectrum-style Frogger clone. Guide the frog across road and river to the lily
pads at the top. Built on [zx-kit](https://www.npmjs.com/package/zx-kit)
(`zx-kit@^0.28.0`) — authentic 256×192 palette, ROM font, beeper SFX, and
zx-kit's camera / collision / scene-manager modules.

> **Status: parked (study project).** This clone was built primarily as a real
> test bed for zx-kit's `camera`, `collision`, and `scene` modules — and it
> validated them (the API needed no changes). Intro / gameplay / game-over scenes,
> moving lanes, camera scroll, sprites, collisions, and audio all work. It is not
> in active development.

## Run

```bash
npm install
npm run dev      # http://localhost:5175
npm run build    # dist/
npx tsc --noEmit # type check
```

Requires Node 22+.

## Controls

| Key | Action |
|-----|--------|
| `←` `→` `↑` `↓` | Hop one cell |
| any key | Start / restart from the intro and game-over screens |

## How it's built

```
src/
├── main.ts            — canvas setup, RAF loop, scene manager init
├── constants.ts       — dimensions, SCALE/CELL/C re-exported from zx-kit
├── sprites.ts         — all sprite bitmaps (Uint8Array)
├── audio.ts           — AudioContext, square-wave beeps
├── world.ts           — lane definitions, object movement, collision helpers
└── scenes/
    ├── intro.ts       — title screen (blinker, consumeAnyKey)
    ├── gameplay.ts    — camera follow, world/frog update, collision, render
    └── gameover.ts    — score display, restart
```

The world is 32×40 cells (256×320 px) — taller than the 256×192 viewport, so the
camera scrolls vertically as the frog advances. River lanes carry logs/turtles,
road lanes carry cars/trucks, with safe banks between them.

## License

MIT.
