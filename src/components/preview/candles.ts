import { noise } from './useTicker'

export type Candle = { open: number; high: number; low: number; close: number }

/**
 * An authored session: the price walks through fixed waypoints with a little
 * seeded noise, stays inside the stated range and ends exactly on the stated
 * close. Pure, so a test can pin the range and the ending.
 */
export function session(count: number, low: number, high: number, close: number): Candle[] {
  const waypoints = [38.45, 38.32, 38.95, 39.55, 39.25, 40.35, 40.88, 40.45, close]
  const out: Candle[] = []
  let previous = waypoints[0]!
  for (let i = 0; i < count; i += 1) {
    const t = (i / (count - 1)) * (waypoints.length - 1)
    const a = Math.floor(t), b = Math.min(waypoints.length - 1, a + 1)
    const target = waypoints[a]! + (waypoints[b]! - waypoints[a]!) * (t - a)
    const wobble = (noise(7, i) - 0.5) * 0.28
    let next = i === count - 1 ? close : Math.min(high - 0.08, Math.max(low + 0.08, target + wobble))
    next = Math.round(next * 100) / 100
    const open = previous
    const span = Math.abs(next - open)
    const top = Math.min(high, Math.max(open, next) + 0.04 + noise(11, i) * (0.12 + span * 0.3))
    const bottom = Math.max(low, Math.min(open, next) - 0.04 - noise(13, i) * (0.12 + span * 0.3))
    out.push({ open, high: Math.round(top * 100) / 100, low: Math.round(bottom * 100) / 100, close: next })
    previous = next
  }
  return out
}
