import { describe, expect, it } from 'vitest'
import { infrastructure, principles, products } from '../content'

describe('public landing content', () => {
  it('presents the three LNYQ products in the required order', () => {
    expect(products.map(product => product.title)).toEqual(['LNYQ DEX', 'LNYQ Launchpad', 'LNYQ AMM'])
    expect(products[2].status).toBe('Coming soon')
    expect(products.slice(0, 2).every(product => product.status === 'Live on Solana devnet')).toBe(true)
  })

  it('keeps the market story concise and complete', () => {
    expect(infrastructure).toHaveLength(4)
    expect(principles).toHaveLength(3)
    expect(infrastructure.map(item => item.value)).toContain('Onchain settlement')
  })
})
