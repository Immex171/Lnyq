import { describe, expect, it } from 'vitest'
import { activeCategories, categories, entries, entriesIn, ownProducts, submissionCategories } from '../ecosystem'

describe('ecosystem directory', () => {
  it('pins the three LNYQ products first, in order', () => {
    expect(ownProducts().map(entry => entry.name)).toEqual(['LNYQ Exchange', 'LNYQ Launchpad', 'LNYQ Creator'])
    expect(ownProducts().map(entry => entry.category)).toEqual(['exchange', 'launchpad', 'collectibles'])
  })

  it('shows a filter tab only for a category that has an entry', () => {
    const active = activeCategories().map(category => category.id)
    for (const id of active) expect(entriesIn(id).length).toBeGreaterThan(0)
    for (const category of categories) if (!active.includes(category.id)) expect(entriesIn(category.id)).toHaveLength(0)
    expect(entriesIn('all')).toHaveLength(entries.length)
  })

  it('keeps every entry in a fixed category, with a logo and at least one link', () => {
    const ids = categories.map(category => category.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const entry of entries) {
      expect(ids).toContain(entry.category)
      expect(entry.logo).toMatch(/^\//)
      expect(entry.website || entry.x || entry.app).toBeTruthy()
    }
  })

  it('offers every category plus Other to a submission', () => {
    expect(submissionCategories.map(category => category.name)).toEqual(['Collectibles', 'Exchange', 'RWA', 'Aggregator', 'Wallets', 'Launchpad', 'Market makers', 'Gaming', 'Data and API', 'Builder tools', 'Other'])
  })
})
