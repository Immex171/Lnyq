import { IconChartCandle, IconCirclesRelation, IconRocket, type Icon } from '@tabler/icons-react'

function configuredUrl(name: string, fallback: string) {
  return (import.meta.env[name] as string | undefined)?.trim() || fallback
}

/* Every outbound destination lives here and nowhere else (Task 4: one place to update). */
export const DEX_APP_URL = configuredUrl('VITE_LNYQ_APP_URL', 'http://localhost:5173/trade')
export const LAUNCHPAD_URL = configuredUrl('VITE_LNYQ_LAUNCHPAD_URL', 'http://localhost:5173/launchpad')
export const CREATOR_APP_URL = configuredUrl('VITE_LNYQ_CREATOR_URL', 'http://localhost:5173/create')
export const AUTH_APP_URL = configuredUrl('VITE_LNYQ_AUTH_URL', 'http://localhost:5173/auth')
/** Where the access-code and project-submission forms are delivered. Empty means not connected yet. */
export const FORMS_URL = configuredUrl('VITE_LNYQ_FORMS_URL', '')

export const SUPPORT_EMAIL = 'support@lnyq.xyz'
export const ECOSYSTEM_EMAIL = 'ecosystem@lnyq.xyz'
export const TWITTER_URL = 'https://x.com/LnyqProtocol'
export const DOCS_URL = 'https://github.com/Lnyqprotocol/LnyqProtocol/tree/staging/docs'

export interface LandingFeature {
  icon: Icon
  /** Availability, stated plainly: this is product truth, not a label. */
  status: 'Live on Solana devnet' | 'Coming soon'
  title: string
  description: string
  accent: 'violet' | 'mint' | 'coral'
}

export const products: LandingFeature[] = [
  {
    icon: IconChartCandle,
    status: 'Live on Solana devnet',
    title: 'LNYQ DEX',
    description: 'A central limit order book for NFT collections. One collection-level price, transparent bids and asks, whole-NFT quantities, USDC settlement.',
    accent: 'mint',
  },
  {
    icon: IconRocket,
    status: 'Live on Solana devnet',
    title: 'LNYQ Launchpad',
    description: 'Fixed-price and uniform-price bid presales with public phases, then a handoff into the order book. Collections can also skip the presale and seed the book directly.',
    accent: 'violet',
  },
  {
    icon: IconCirclesRelation,
    status: 'Coming soon',
    title: 'LNYQ AMM',
    description: 'A non-custodial swap venue beside the order book: trade USDC for NFTs straight from a wallet, with the book keeping it priced.',
    accent: 'coral',
  },
]

/** The four entries of a launch, in the order the protocol runs them. */
export const journey = [
  { step: 'Create', title: 'Define the collection.', text: 'Identity, supply, distribution and permanent metadata through the creator workflow.' },
  { step: 'Launch', title: 'Run the presale.', text: 'Fixed-price or bid mode, public phases, settlement and refunds on-chain.' },
  { step: 'Discover', title: 'Let price form in public.', text: 'Bids and asks on the order book turn intent into a visible price.' },
  { step: 'Trade', title: 'Operate in real time.', text: 'Orders, fills, vault balances and market activity in one terminal.' },
]

/** Product facts, in the product's own terms, from PRODUCT_SPEC.md §3 and §4. Nothing here is a projection. */
export const facts = [
  { label: 'Market model', value: 'Central limit order book' },
  { label: 'Matching', value: 'Price-time priority, FIFO' },
  { label: 'Price', value: 'One per collection, from the book' },
  { label: 'Quantity', value: 'Whole NFTs only' },
  { label: 'Order types', value: 'GTC, IOC, FOK, GTD' },
  { label: 'Partial fills', value: 'Allowed' },
  { label: 'Settlement', value: 'USDC, on-chain, Solana' },
  { label: 'Taker fee', value: '1% of notional' },
  { label: 'Maker fee', value: '0.5% of notional' },
  { label: 'Maker rebates', value: 'None' },
  { label: 'Network', value: 'Solana devnet, private testnet' },
  { label: 'Custody', value: 'Your wallet signs every move' },
]

export const infrastructure = [
  { value: 'One market stack', label: 'Launch, discover and trade without breaking the user journey.' },
  { value: 'Onchain settlement', label: 'Every action stays verifiable from wallet signature to final state.' },
  { value: 'Live market data', label: 'Order books, trades and positions update as the market moves.' },
  { value: 'Vault-aware balances', label: 'Available balances reflect deposits, withdrawals and open-order reserves.' },
]

export const principles = [
  { title: 'Self-custody first', text: 'Wallet-native authentication and explicit signatures keep control visible.' },
  { title: 'Built for speed', text: 'A focused trading surface that shortens the distance between intent and execution.' },
  { title: 'Made for culture', text: 'Infrastructure built for tokenized communities and collectible economies.' },
]

/** About LNYQ: what it is, what is being built, and how it differs. Accurate to PRODUCT_SPEC.md and PROTOCOL_OVERVIEW.md. */
export const about = {
  definition: 'LNYQ is a central limit order book exchange for NFTs, and market infrastructure for illiquid and speculative onchain assets. Both are true at once.',
  mechanism: [
    { title: 'One price per collection', text: 'Every NFT in a collection trades at the collection price formed on the order book. Individual pieces do not carry their own price, so the book stays deep instead of splitting into thousands of one-item markets.' },
    { title: 'Bids and asks, in public', text: 'Orders rest on a book with price-time priority. The best bid and best ask are visible to everyone, the spread is the honest cost of trading, and fills happen when they cross.' },
    { title: 'Whole NFTs, settled in USDC', text: 'Quantities are whole numbers, never fractions. Every fill settles on Solana through the settlement program, and the fee is taken at fill time, never at order placement.' },
    { title: 'Custody you can see', text: 'Deposits, orders and withdrawals are signed by the trader’s own wallet. The protocol’s off-chain services mirror the chain; if the two ever disagree, the chain wins.' },
  ],
  building: [
    { title: 'LNYQ DEX', status: 'Live on Solana devnet', text: 'The order book itself: markets, order entry, fills, vault balances, deposits and withdrawals of compressed NFTs.', href: DEX_APP_URL },
    { title: 'LNYQ Launchpad', status: 'Live on Solana devnet', text: 'Initial distribution and the first price anchor before a collection’s book opens. Presales run in fixed-price or uniform-price bid mode with public phases; a collection can instead seed its book directly.', href: LAUNCHPAD_URL },
    { title: 'LNYQ AMM', status: 'Coming soon', text: 'A non-custodial swap venue that sits beside the order book rather than replacing it. Traders swap USDC and NFTs straight from their wallets; the book keeps the price honest.', href: null },
    { title: 'Protocol API', status: 'Live on Solana devnet', text: 'Public market data over REST and WebSocket, trade execution against the live book, and a dedicated market-maker endpoint for quoting.', href: DOCS_URL },
  ],
  different: [
    'Not a marketplace. There are no fixed-price sales and no escrow; there is a book, and price is discovered on it.',
    'Not an AMM-first venue. Automated liquidity is being built as a complement to the order book, never as the price source.',
    'Liquidity is bootstrapped by a protocol-owned market maker at launch and handed to external market makers as they arrive.',
    'Fees are flat and public: 1% taker, 0.5% maker, no rebates, and the protocol keeps every fee.',
  ],
  roadmap: [
    { phase: 'Phase 1', title: 'CLOB on devnet', text: 'Access-code gated testnet. Spot order book, launchpad, vault custody, POMM liquidity.', state: 'Now' },
    { phase: 'Phase 2', title: 'Perpetuals', text: 'Perpetual contracts on the strongest collections, 5x maximum leverage, USDC settled, indexed to the book.', state: 'Planned' },
    { phase: 'Phase 3', title: 'Cross-chain USDC', text: 'Automatic cross-chain USDC settlement, no manual chain selection.', state: 'Planned' },
  ],
}

/** The closing line beneath the call to action, typed and deleted in a loop. */
export const closingLines = ['Launch your token.', 'Discover your market.', 'Trade digital assets.']
