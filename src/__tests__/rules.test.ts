import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * The content rules, enforced: none of these strings may appear in the
 * site's source or in the page shell. Each one is something the landing
 * page must not say.
 */
const FORBIDDEN = [
  'EXAMPLE DATA', 'Example data', 'Demo market', 'Demo ticket', 'Demo collection', 'demo data',
  'Cobalt Owls', 'Vault balance',
  'Est. fee', 'Taker fee', 'taker fee', 'maker fee', 'Maker rebates', '1% taker', '0.5% maker',
  'Private testnet', 'Solana devnet', 'devnet', 'testnet', 'no real assets',
  'Bubblegum', 'Built on the book', 'How LNYQ is different', 'Terms of the book', 'Read the protocol docs',
  'Where this goes', 'Phase 1', 'Phase 2', 'Phase 3', 'Cross-chain USDC', 'POMM',
  'AMM', 'Coming soon', 'coming soon', 'Not a marketplace', 'marketplace', 'floor price', 'primary sale',
  'No projects listed', '4jB3', 'github.com/Lnyqprotocol',
  'Funding rate', 'Liquidation', 'swap', 'Swap',
  '—',
]

function sources(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (name === '__tests__' || name === 'node_modules') continue
    if (statSync(path).isDirectory()) sources(path, out)
    else if (/\.(tsx?|css|html)$/.test(name)) out.push(path)
  }
  return out
}

describe('content rules', () => {
  const root = join(__dirname, '..')
  const files = [...sources(root), join(root, '..', 'index.html')]

  it('never says what the landing page must not say', () => {
    const offences: string[] = []
    for (const file of files) {
      const text = readFileSync(file, 'utf8')
      for (const needle of FORBIDDEN) if (text.includes(needle)) offences.push(`${file.replace(root, 'src')}: "${needle === '—' ? 'em dash' : needle}"`)
    }
    expect(offences).toEqual([])
  })

  it('uses no purple anywhere', () => {
    const css = readFileSync(join(root, 'site.css'), 'utf8') + readFileSync(join(root, 'base.css'), 'utf8')
    expect(css).not.toMatch(/purple|violet|indigo|#a051fc|#c48afd|#5b4cff/i)
  })
})
