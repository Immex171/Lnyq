function configuredUrl(name: string, fallback: string) {
  return (import.meta.env[name] as string | undefined)?.trim() || fallback
}

/* Every outbound destination lives here and nowhere else. */
export const DEX_APP_URL = configuredUrl('VITE_LNYQ_APP_URL', 'http://localhost:5173/trade')
export const LAUNCHPAD_URL = configuredUrl('VITE_LNYQ_LAUNCHPAD_URL', 'http://localhost:5173/launchpad')
export const CREATOR_APP_URL = configuredUrl('VITE_LNYQ_CREATOR_URL', 'http://localhost:5173/create')
export const AUTH_APP_URL = configuredUrl('VITE_LNYQ_AUTH_URL', 'http://localhost:5173/auth')
/** Where the access-code and project-submission forms are delivered. Empty means not connected yet. */
export const FORMS_URL = configuredUrl('VITE_LNYQ_FORMS_URL', '')
/** Docs, terms and privacy live outside this site. Until they exist the site serves a holding page at each path. */
export const DOCS_URL = configuredUrl('VITE_LNYQ_DOCS_URL', '/docs')
export const TERMS_URL = configuredUrl('VITE_LNYQ_TERMS_URL', '/terms')
export const PRIVACY_URL = configuredUrl('VITE_LNYQ_PRIVACY_URL', '/privacy')

export const SUPPORT_EMAIL = 'support@lnyq.xyz'
export const ECOSYSTEM_EMAIL = 'ecosystem@lnyq.xyz'
export const TWITTER_URL = 'https://x.com/LnyqProtocol'

export const meta = {
  title: 'LNYQ | Infrastructure for All NFT Finance',
  description: 'Create, launch, and trade NFTs on spot and perpetuals, 24/7, with real price discovery.',
  ecosystemTitle: 'LNYQ | Ecosystem',
}

export const hero = {
  title: 'Infrastructure for All NFT Finance',
  copy: 'Create, launch, and trade NFTs on spot and perpetuals, from collectibles and in-game assets to tokenized real-world assets, 24/7, with real price discovery.',
  primary: 'Launch app',
  secondary: 'Request access',
}

/* ── The spot terminal preview. Every number here is the one the page shows. ── */
export const terminal = {
  title: 'One market for every NFT asset.',
  copy: 'Place orders, see depth, and trade at the price the market sets. Spot and perpetuals, whole NFTs, settled in USDC.',
  markets: ['LNYQNFT / USDC', 'THEGOOMAN / USDC'],
  last: 40.2,
  session: '+2.8%',
  circulating: 240_000,
  total: 1_000_000,
  fdv: 40_200_000,
  chart: { low: 38.2, high: 41.0, close: 40.2, candles: 40 },
  /** Highest price first, as the book shows them. */
  asks: [
    { price: 40.7, size: 2150 },
    { price: 40.6, size: 3400 },
    { price: 40.5, size: 1800 },
    { price: 40.4, size: 4200 },
    { price: 40.3, size: 2600 },
    { price: 40.2, size: 1350 },
  ],
  bids: [
    { price: 40.1, size: 1900 },
    { price: 40.0, size: 5200 },
    { price: 39.9, size: 3100 },
    { price: 39.8, size: 2450 },
    { price: 39.7, size: 6800 },
    { price: 39.6, size: 3750 },
  ],
  spread: 0.1,
  fills: [
    { size: 1200, price: 40.2 },
    { size: 640, price: 40.1 },
    { size: 2300, price: 40.2 },
    { size: 900, price: 40.0 },
  ],
  ticket: {
    buy: { quantity: 2500, total: 100_615, label: 'You pay' },
    sell: { quantity: 2000, total: 80_190, label: 'You receive' },
  },
}

export const perps = {
  title: 'Trade NFT perps.',
  copy: 'Go long or short on any collection with up to 5x leverage, priced from the LNYQ order book, not from listings.',
  pair: 'LNYQNFT - USDC',
  mark: 40.2,
  session: '+2.8%',
  size: 2500,
  leverage: '5x',
  margin: 20_123,
}

export const launch = {
  title: 'Launch into a market.',
  copy: 'Every collection leaves launch with an order book, a price, and liquidity already open.',
  lanes: [
    { title: 'Presale', text: 'Raise from your community first. When it closes, the market opens to market makers, then to everyone.' },
    { title: 'Straight to market', text: 'Skip the presale. Bring your own liquidity and open trading on day one.' },
  ],
  card: {
    collection: 'LNYQNFT',
    stages: [
      { name: 'Presale', state: 'done' },
      { name: 'Pre-market', state: 'done' },
      { name: 'Live market', state: 'current' },
    ] as const,
    allocation: 200_000,
    total: 1_000_000,
    raised: 7_200_000,
    presalePrice: 36,
    bestBid: { price: 40.1, size: 1900 },
    bestAsk: { price: 40.2, size: 1350 },
    spread: 0.1,
  },
}

/** Five paragraphs, shown in this order, never numbered or labelled on the page. */
export const vision = [
  "LNYQ's vision is to give every NFT asset a real market: one open order book where price is discovered, not listed.",
  'NFTs have always carried far more than collectibles: in-game assets, memberships, tokenized real-world assets. What never worked is how they trade. Every piece is listed on its own at whatever its owner asks, and the lowest listing becomes the price everyone sees. Buyers cannot see real demand. Sellers cannot see real depth. A holder of any size cannot sell without breaking the price. Supply in the hundreds of thousands cannot trade one listing at a time.',
  'LNYQ replaces listings with an order book. Buyers and sellers place bids and offers in the open, orders meet at the best price, and the whole collection trades at one price formed by real demand. Large orders fill against real depth, 24/7, in whole NFTs and USDC. The same price powers perpetual markets, so traders can go long or short on any collection.',
  'With a real price, the NFT ecosystem changes. Holders can see what their assets are worth and sell in size. Creators launch into a live market instead of a one-time sale. Game studios can issue millions of in-game assets that trade from day one. Tokenized real-world assets trade around the clock at a price anyone can see. Market makers and builders get a venue to quote and build on. And because the price is real, treasuries and new products can be built on top of it. NFTs stop being things you list and wait on and become assets that are traded and financed.',
  'Every onchain asset deserves a market open to everyone who creates, trades, and builds on it.',
]

export const build = {
  title: 'Build on LNYQ.',
  copy: 'Launch your collection, run a market maker, or build tools on live prices and trade execution. Apply to be part of the LNYQ ecosystem.',
  tiles: [
    { title: 'Creators and collections', text: 'Launch an NFT collection into a live market.' },
    { title: 'Market makers', text: "A dedicated API to quote on LNYQ's order books." },
    { title: 'Builders', text: 'Live price feeds and trade execution.' },
  ],
  button: 'Join the ecosystem',
}

export const access = {
  title: 'Get early access.',
  copy: 'Request your access code and be among the first to trade and launch on LNYQ.',
  button: 'Request access',
  helper: 'We will send your access code to this email.',
  signIn: 'Already have a code? Sign in.',
}

export const closing = {
  title: 'Your next market starts here.',
  copy: 'Trade spot and perps on LNYQ, or launch your collection into a live market.',
}

export const footer = {
  copyright: '© 2026 LNYQ',
}

/* Number formatting shared by the previews. */
export const nf = new Intl.NumberFormat('en-US')
export const money = (value: number) => value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const px = (value: number) => value.toFixed(2)
