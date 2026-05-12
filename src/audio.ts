let ctx: AudioContext | null = null

export function unlockAudio(): void {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
}

function beep(freq: number, dur: number, vol = 0.3, delay = 0): void {
  if (!ctx) return
  const t = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'square'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(vol, t + 0.005)
  gain.gain.setValueAtTime(vol, t + dur - 0.005)
  gain.gain.linearRampToValueAtTime(0, t + dur)
  osc.start(t)
  osc.stop(t + dur)
}

export function playHop(): void {
  beep(440, 0.06)
}

export function playSquash(): void {
  if (!ctx) return
  // Quick descending noise-like squash
  for (let i = 0; i < 6; i++) {
    const freq = 200 - i * 25 + Math.random() * 50
    beep(freq, 0.05, 0.4, i * 0.04)
  }
}

export function playSplash(): void {
  if (!ctx) return
  // Rising then falling — bubble effect
  beep(300, 0.08)
  beep(500, 0.06, 0.25, 0.08)
  beep(200, 0.1, 0.2, 0.14)
}

export function playGoal(): void {
  // Short ascending fanfare
  const notes = [523, 659, 784, 1047]
  notes.forEach((f, i) => beep(f, 0.1, 0.35, i * 0.1))
}

export function playLevelComplete(): void {
  const notes = [523, 659, 784, 1047, 1319]
  notes.forEach((f, i) => beep(f, 0.12, 0.4, i * 0.12))
}

export function playGameOver(): void {
  const notes = [440, 415, 392, 370, 349]
  notes.forEach((f, i) => beep(f, 0.2, 0.4, i * 0.22))
}
