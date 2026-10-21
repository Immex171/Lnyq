import { CREATOR_APP_URL, DEX_APP_URL, LAUNCHPAD_URL } from './content'

/**
 * The ecosystem registry. Adding a project is one entry in `projects`;
 * adding a category is one entry in `categories`. The page renders both
 * from this file and nothing else needs to change.
 */
export interface EcosystemCategory {
  id: string
  name: string
  description: string
}

export interface EcosystemProject {
  name: string
  category: EcosystemCategory['id']
  description: string
  /** 'live' | 'building' | 'coming-soon'; stated plainly on the page. */
  status: 'live' | 'building' | 'coming-soon'
  url: string | null
  /** True for the protocol's own products, which lead the page. */
  own?: boolean
}

export const categories: EcosystemCategory[] = [
  { id: 'protocol', name: 'LNYQ products', description: 'The venues and tools LNYQ builds and operates.' },
  { id: 'collections', name: 'NFT collections', description: 'Collections launched on LNYQ or trading on its order books.' },
  { id: 'trading-tools', name: 'Trading tools', description: 'Terminals, bots, alerting and execution tooling built against the protocol API.' },
  { id: 'aggregators', name: 'Aggregators and data', description: 'Price feeds, indexers, analytics and aggregators reading LNYQ market data.' },
  { id: 'market-makers', name: 'Market makers', description: 'Professional and collection-owned market makers quoting on LNYQ books.' },
  { id: 'wallets-infra', name: 'Wallets and infrastructure', description: 'Wallets, RPC providers and infrastructure LNYQ integrates with.' },
]

export const projects: EcosystemProject[] = [
  { name: 'LNYQ DEX', category: 'protocol', description: 'Central limit order book for NFT collections. Whole-NFT quantities, USDC settlement on Solana.', status: 'live', url: DEX_APP_URL, own: true },
  { name: 'LNYQ Launchpad', category: 'protocol', description: 'Fixed-price and bid-mode presales with a handoff into the order book.', status: 'live', url: LAUNCHPAD_URL, own: true },
  { name: 'LNYQ AMM', category: 'protocol', description: 'Non-custodial swap venue beside the order book.', status: 'coming-soon', url: null, own: true },
  { name: 'LNYQ Creator', category: 'protocol', description: 'The creator workflow: define a collection, upload permanent metadata, configure and run its launch.', status: 'live', url: CREATOR_APP_URL, own: true },
]

export const statusLabel: Record<EcosystemProject['status'], string> = {
  live: 'Live on Solana devnet',
  building: 'Building on LNYQ',
  'coming-soon': 'Coming soon',
}

export function projectsIn(categoryId: string): EcosystemProject[] {
  return projects.filter(project => project.category === categoryId)
}
