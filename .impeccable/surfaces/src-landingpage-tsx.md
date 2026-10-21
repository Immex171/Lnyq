---
version: 1
slug: "src-landingpage-tsx"
primary_target: "src/LandingPage.tsx"
related_targets: ["src/landing.css","src/components/LandingHeader.tsx"]
---

# Surface brief: LNYQ landing page (src/LandingPage.tsx)

Scope: the public landing site: the front page (`src/pages/HomePage.tsx`), `/about` and `/ecosystem`, all on the same sheet. Visitor mode: Persuade.
Audience: experienced NFT traders and collection creators evaluating a new venue for price discovery, order book depth, fees and launch mechanics. Job: judge whether LNYQ is real and live, then open the app or request an access code.
Action: Launch app (the working terminal) and Request access (new wallets). Proof: the product's own facts (USDC settlement, whole-NFT quantities, 1% taker / 0.5% maker), and two live products with one announced.
Constraints: the hero chart is an authored illustration, labelled as such on the page (user decision 2026-10-15); no video; locked language rules (order book, bid, ask, best bid, spread, maker, taker; never floor price, listing, marketplace, buy now, em dashes, emoji); testnet honesty; name, logo and contact addresses preserved.
Chosen direction: The Dojima Ledger (user's choice from the direction round).
Memorable moment: the order book written as a ledger, live, in the opening.
Unresolved: whether perpetuals belong on the page (PRODUCT.md open decision).

## Direction round 2 (user spec, 2026-10-15, pinned)

The user pinned a replacement world for the front page after a new reference recording (quants.bid): near-black ground, white headings, muted-gray descriptions, controlled purple/indigo glows, a faint drifting dotted field behind content sections, spacious sections on one content width, rounded dark cards with thin borders, pill section labels, Space Grotesk semibold headings with regular body. Header: logo left, pill navigation centre, Launch app right. Centred hero with the existing message, two actions and badges stating real deployment facts. A wide dashboard showcase below the hero with a purple-blue glow that starts tilted back 14° and straightens with scroll position (flat under 760px and under reduced motion). Sections: centred intro, a small group of feature cards carrying the product demos, a two-column how-it-works with a large visual beside the steps, then benefits or ecosystem. Closing: a wide rounded purple-gradient panel (Your next market starts here) with Launch app and Create token, then a simple footer with logo, links, social links and back to top; the curtain reveal stays. Applied across the site on 2026-10-15 after approval: the curtain reveal was removed at the user's request, About lives on the front page as sections, how it works is two-column with the launch visual, ecosystem and access follow, the Ecosystem page is restyled, and the old ledger components are gone. The ledger contract below is historical.

## Direction contract

THESIS: The candle chart goes home. LNYQ's page is one ledger sheet from the Dojima rice exchange, where price was first drawn as candles, and the live devnet market is written into it in ink. It refuses the dark split hero with a screenshot on the right and a row of equal cards.

OWN-WORLD: The ledger translated into LNYQ's pinned palette (user decision, 2026-10-15): the dark ground (#050507) is the sheet, light ink (#f4f2f8, #b3adbd, #8f8999) for every line and letter, the DEX purple tokens (#A051FC seals and primary action, #C48AFD links and emphasis, #35184E washes), mint (#63e6cf) for bids and rising candles, coral (#f7839a) for asks and falling candles. Rules are thin light lines. Columns are ruled with thin ink lines; numerals are tabular and sit on the rules. Display face Shippori Mincho; ledger and body face Zen Kaku Gothic New. Controls are seals (square, vermilion, stamped) and ink-ruled rows; nothing is glass, nothing glows.

STORY: A trader sees a working ledger of real markets with real bids and understands in seconds that this is an order book venue on Solana, in testnet, settling in USDC, with launches that hand into the book. They press the vermilion seal to open the app, or the smaller seal to ask for a code.

FIRST VIEWPORT: One tall sheet filling the viewport, ruled into a narrower left column and a wider right column. Top rule: LNYQ brand mark and name at left, the four navigation entries written along the rule, the violet Launch app seal at the far right. Left column: the headline in Mincho at display scale (Liquidity, engineered for digital assets) over one line of subcopy, the two seals (Launch app, Request access), and three ruled marks at the foot (order book, whole NFTs, USDC settlement). Right column: the authored order book (user decision, 2026-10-15): eleven asks over eleven bids with depth bars, a spread row carrying the last price.

FORM: The Dojima Ledger, position 1 on the ordered grounded list, chosen as IMPECCABLE'S PICK over the assigned Pit Board. seed: none (unavailable)

Signature interaction: the book behaves like a live one. Every 0.65s an order lands, pulls, improves the top of book or a taker crosses the spread; the last price takes the taker's colour, and hovering a level reads cumulative depth in NFTs and USDC. Under reduced motion it stands still.
Motion grammar: ink appears, it does not slide; opacity, transforms and stroke offsets only; no parallax, no blur. Overdrive (user choice, 2026-10-15): the order-flow field, a Canvas 2D layer behind the opening where particles are orders, bids rising in mint and asks falling in coral to a spread line that tracks the book's spread row; each fill in the book bursts on the line and the pointer pushes the flow. Paused offscreen and when hidden; a still frame under reduced motion.

Closing (user spec, 2026-10-15, after the xo.market reference): above the colophon, the closing call to action: a very large centred two-line headline in the display face, white with the second line in the accent purple, a smaller line beneath that types and deletes Launch your token / Discover your market / Trade digital assets, then the two seals, then a thin rule and the footer links. The call to action and footer sit beneath the page body as a curtain: on viewports at least 900px wide and 680px tall the curtain fills the space under the header and sticks to the bottom, so the body slides up and uncovers it in step with the scroll, reversing on the way back; smaller screens and reduced motion get a normal static footer with static text.

Product demos (user spec, 2026-10-15): a See the book work section with three fixed-size demo cards, each labelled Example data, that play when at least 40% visible, hold at the end, repeat gently and pause offscreen: an order book whose levels fill and refill and whose last price moves, a chart that adds candles one at a time, and a trade walking Submitted, Matched, Filled, Settled on Solana. Major sections render as rounded panels that settle in as they enter (scroll-driven where supported); headings, descriptions, entries and cards enter with a 14px rise and fade over 600ms, staggered about 100ms apart, once, on intersection. Under reduced motion every demo shows its final state and nothing moves.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
