import { describe, expect, it } from 'vitest'
import { surfaceHeight } from '../wave'

describe('particle wave surface', () => {
  it('stays within one unit and moves smoothly and without resets over time', () => {
    for (let t = 0; t < 600; t += 0.37) for (let x = -1; x <= 1; x += 0.25) for (let z = 0; z <= 3; z += 0.5) expect(Math.abs(surfaceHeight(x, z, t))).toBeLessThanOrEqual(1)
    // A small step in time moves every point only a little: no jumps anywhere in the field.
    for (let t = 0; t < 120; t += 1.3) for (let x = -1; x <= 1; x += 0.2) expect(Math.abs(surfaceHeight(x, 1, t + 0.016) - surfaceHeight(x, 1, t))).toBeLessThan(0.03)
  })
  it('varies across the field, so the dots form a surface rather than rising together', () => {
    const heights = Array.from({ length: 20 }, (_, i) => surfaceHeight(-1 + i / 10, 1, 5))
    expect(Math.max(...heights) - Math.min(...heights)).toBeGreaterThan(0.5)
  })
})
