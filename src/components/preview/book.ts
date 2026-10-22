import { terminal } from '../../content'
import { noise } from './useTicker'

export type Level = { price: number; size: number }

/**
 * The authored levels at rest; while live, each size drifts a few percent
 * around its authored value so the depth bars breathe. Rounded to tens, so
 * the book never shows an odd-looking size.
 */
export function liveLevels(levels: Level[], tick: number, seed: number): Level[] {
  if (tick === 0) return levels
  return levels.map((level, index) => {
    const wave = Math.sin(tick / (3 + index * 0.7) + index) * 0.03 + (noise(seed + index, Math.floor(tick / 4)) - 0.5) * 0.02
    return { price: level.price, size: Math.round(level.size * (1 + wave) / 10) * 10 }
  })
}

/** A new fill reaches the top of the tape every third beat; the tape always shows the four authored fills. */
export function liveFills(tick: number) {
  const advanced = Math.floor(tick / 3)
  const fills = terminal.fills
  return Array.from({ length: fills.length }, (_, i) => fills[((i - advanced) % fills.length + fills.length) % fills.length]!)
}
