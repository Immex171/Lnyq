import { describe, expect, it } from 'vitest'
import { launch, perps, terminal, vision } from '../content'

describe('landing content', () => {
  it('keeps the terminal preview internally consistent', () => {
    // Totals in the book are size times price; the ticket totals are the stated ones.
    for (const level of [...terminal.asks, ...terminal.bids]) expect(Number.isInteger(level.size)).toBe(true)
    expect(terminal.asks.map(l => l.price)).toEqual([...terminal.asks.map(l => l.price)].sort((a, b) => b - a))
    expect(terminal.bids.map(l => l.price)).toEqual([...terminal.bids.map(l => l.price)].sort((a, b) => b - a))
    expect(Math.round((terminal.asks[terminal.asks.length - 1]!.price - terminal.bids[0]!.price) * 100) / 100).toBe(terminal.spread)
    expect(terminal.ticket.buy.total).toBe(100_615)
    expect(terminal.ticket.sell.total).toBe(80_190)
    expect(terminal.circulating).toBeLessThan(terminal.total)
    expect(terminal.markets).toEqual(['LNYQNFT / USDC', 'THEGOOMAN / USDC'])
  })

  it('states the perps card the way the page shows it', () => {
    expect(perps.pair).toBe('LNYQNFT - USDC')
    expect(perps.leverage).toBe('5x')
    expect(perps.margin).toBe(20_123)
    expect(perps.mark).toBe(terminal.last)
  })

  it('keeps the launch card at scale and against total supply', () => {
    expect(launch.card.allocation).toBe(200_000)
    expect(launch.card.total).toBe(1_000_000)
    expect(launch.card.raised).toBe(launch.card.allocation * launch.card.presalePrice)
    expect(launch.lanes.map(lane => lane.title)).toEqual(['Presale', 'Straight to market'])
    expect(launch.steps).toEqual(['Create', 'Launch', 'Market opens', 'Trade'])
  })

  it('carries the five vision paragraphs in order, unnumbered', () => {
    expect(vision).toHaveLength(5)
    expect(vision[0]).toMatch(/^LNYQ's vision/)
    expect(vision[4]).toMatch(/^Every onchain asset/)
    for (const paragraph of vision) expect(paragraph).not.toMatch(/^\d/)
  })
})
