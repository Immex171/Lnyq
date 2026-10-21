import { describe, expect, it } from 'vitest'
import { categories, projects, projectsIn } from '../ecosystem'

describe('ecosystem registry', () => {
  it('leads with the protocol products in order', () => {
    expect(projectsIn('protocol').slice(0, 3).map(project => project.name)).toEqual(['LNYQ DEX', 'LNYQ Launchpad', 'LNYQ AMM'])
    expect(projectsIn('protocol').every(project => project.own)).toBe(true)
  })

  it('keeps every project in a known category and every category id unique', () => {
    const ids = categories.map(category => category.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const project of projects) expect(ids).toContain(project.category)
  })

  it('states availability plainly and never links a coming-soon product', () => {
    for (const project of projects) if (project.status === 'coming-soon') expect(project.url).toBeNull()
  })
})
