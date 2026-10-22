import { describe, expect, it } from 'vitest'
import { session } from '../components/preview/candles'
import { liveFills, liveLevels } from '../components/preview/book'
import { terminal } from '../content'

describe('spot preview', () => {
  it('authors a session inside the stated range that ends on the stated close', () => {
    const candles = session(terminal.chart.candles, terminal.chart.low, terminal.chart.high, terminal.chart.close)
    expect(candles).toHaveLength(40)
    expect(Math.min(...candles.map(c => c.low))).toBeGreaterThanOrEqual(terminal.chart.low)
    expect(Math.max(...candles.map(c => c.high))).toBeLessThanOrEqual(terminal.chart.high)
    expect(candles[candles.length - 1]!.close).toBe(terminal.chart.close)
    for (const c of candles) { expect(c.high).toBeGreaterThanOrEqual(Math.max(c.open, c.close)); expect(c.low).toBeLessThanOrEqual(Math.min(c.open, c.close)) }
  })

  it('shows the authored book at rest and only drifts a few percent while live', () => {
    expect(liveLevels(terminal.asks, 0, 101).map(l => l.size)).toEqual(terminal.asks.map(l => l.size))
    expect(liveLevels(terminal.bids, 0, 202).map(l => l.size)).toEqual(terminal.bids.map(l => l.size))
    for (let tick = 1; tick < 200; tick += 1) {
      const live = liveLevels(terminal.bids, tick, 202)
      live.forEach((level, i) => expect(Math.abs(level.size / terminal.bids[i]!.size - 1)).toBeLessThan(0.06))
    }
  })

  it('keeps the tape to the four stated fills, rotating a new one to the top', () => {
    expect(liveFills(0)).toEqual(terminal.fills)
    expect(liveFills(3)[0]).toEqual(terminal.fills[3])
    expect(liveFills(6)[0]).toEqual(terminal.fills[2])
  })
})
