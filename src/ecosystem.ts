import { CREATOR_APP_URL, DEX_APP_URL, LAUNCHPAD_URL, TWITTER_URL } from './content'

/**
 * The ecosystem directory. Categories are fixed; a filter tab appears the
 * moment its category has an entry and never shows an empty state. Adding
 * a project is one entry in `entries`, after its application is approved.
 */
export const categories = [
  { id: 'collectibles', name: 'Collectibles' },
  { id: 'exchange', name: 'Exchange' },
  { id: 'rwa', name: 'RWA' },
  { id: 'aggregator', name: 'Aggregator' },
  { id: 'wallets', name: 'Wallets' },
  { id: 'launchpad', name: 'Launchpad' },
  { id: 'market-makers', name: 'Market makers' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'data-api', name: 'Data and API' },
  { id: 'builder-tools', name: 'Builder tools' },
] as const

export type CategoryId = (typeof categories)[number]['id']

export interface EcosystemEntry {
  name: string
  category: CategoryId
  about: string
  /** Project logo, served from /public. */
  logo: string
  website?: string
  x?: string
  app?: string
  /** True for LNYQ's own products, which are pinned above the directory. */
  own?: boolean
  /** A label shown instead of the category name, for entries that are integrations rather than projects. */
  tag?: string
}

export const entries: EcosystemEntry[] = [
  { name: 'LNYQ Exchange', category: 'exchange', about: 'Spot and perpetual order books for NFT collections.', logo: '/Lnyq.png', app: DEX_APP_URL, x: TWITTER_URL, own: true },
  { name: 'LNYQ Launchpad', category: 'launchpad', about: 'Launch a collection into a live market.', logo: '/Lnyq.png', app: LAUNCHPAD_URL, x: TWITTER_URL, own: true },
  { name: 'LNYQ Creator', category: 'collectibles', about: 'Create and configure a collection.', logo: '/Lnyq.png', app: CREATOR_APP_URL, x: TWITTER_URL, own: true },
]

export const ownProducts = () => entries.filter(entry => entry.own)

export const categoryName = (id: CategoryId) => categories.find(category => category.id === id)!.name

/** Only the categories that have at least one entry, in the fixed order. */
export const activeCategories = () => categories.filter(category => entries.some(entry => entry.category === category.id))

export const entriesIn = (id: CategoryId | 'all') => (id === 'all' ? entries : entries.filter(entry => entry.category === id))

/** The categories a submission can choose from: every fixed category, then Other. */
export const submissionCategories = [...categories.map(category => ({ id: category.id as string, name: category.name })), { id: 'other', name: 'Other' }]
