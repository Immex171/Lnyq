import { describe, expect, it } from 'vitest'
import { MIN_OPACITY, revealOpacity, revealProgress } from '../vision'

describe('vision reveal', () => {
  const vh = 1000
  it('is muted in the lower part of the viewport and bright by the middle', () => {
    expect(revealProgress(950, vh)).toBe(0)
    expect(revealProgress(820, vh)).toBe(0)
    expect(revealProgress(550, vh)).toBe(1)
    expect(revealProgress(100, vh)).toBe(1)
    expect(revealProgress(-400, vh)).toBe(1)
  })
  it('moves in a straight line between the two, so scrolling back reverses it', () => {
    expect(revealProgress(685, vh)).toBeCloseTo(0.5, 2)
    expect(revealProgress(752.5, vh)).toBeCloseTo(0.25, 2)
    expect(revealProgress(617.5, vh)).toBeCloseTo(0.75, 2)
  })
  it('maps progress onto 25% to 100% opacity', () => {
    expect(revealOpacity(0)).toBe(MIN_OPACITY)
    expect(revealOpacity(1)).toBe(1)
    expect(revealOpacity(0.5)).toBeCloseTo(0.625, 3)
  })
})
