# Product

<!-- impeccable:product-schema 1 -->

Scope: the public landing site for LNYQ (`LnyqLanding/`): the front page (About included as sections) and `/ecosystem`. The trading terminal, launchpad and creator app are separate surfaces in the parent repository. Facts marked *(inferred)* were taken from the codebase and the project's saved notes because the user asked for this record to be written without an interview; confirm or correct them.

## Platform

web

## Users

- **Traders** who want transparent price discovery for NFT collections: people who already trade on order books and want the same discipline applied to NFT-backed markets. Situation: evaluating whether LNYQ is real, live and worth a wallet connection. Job: get to the trading terminal.
- **Creators** of NFT collections who want a launch that hands off into a liquid market instead of ending at distribution. Job: understand the launch path and reach the creator app.
- **Ecosystem builders** *(inferred)*: trading tools, aggregators, market makers. Job: find the contact for submitting a project.
- Everyone arrives during a **private testnet** on Solana devnet, so the landing page's practical conversion is "request an access code" or "sign in with the code I have".

## Product Purpose

LNYQ is a central limit order book (CLOB) decentralized exchange for NFTs, positioned as market infrastructure for illiquid and speculative onchain assets. Both framings are true at once and neither is dropped. Collections trade at one collection-level price from the live order book; quantities are whole numbers; USDC is the only settlement asset. Success for the landing page is a visitor who understands this in one viewport and continues into the app or the access request.

## Positioning

Price discovery for NFTs happens in public, on an order book, with onchain settlement, and the same stack covers the whole lifecycle: create, launch, discover, trade. Neighbouring products stop at distribution or at fixed-price sales. LNYQ's launchpad runs fixed-price and uniform-price bid presales that hand off into the order book.

## Operating Context

- The stack is live on **Solana devnet** as a private testnet. No mainnet date, governance token, chain timeline, partnerships or incorporation are confirmed. None of these may be implied.
- Access is gated by one-time access codes. A returning wallet signs in directly; a new wallet needs a code.
- Products: LNYQ DEX (live on devnet), LNYQ Launchpad (live on devnet), LNYQ AMM (announced, not built). Perpetuals exist in the protocol roadmap but are not presented on the landing page *(inferred)*.
- CTA destinations are environment-configured (`VITE_LNYQ_APP_URL`, `_LAUNCHPAD_URL`, `_CREATOR_URL`, `_AUTH_URL`) and default to the local DEX on port 5173.
- The landing site is a standalone Vite app and imports nothing from the DEX or protocol code.

## Capabilities and Constraints

- Settlement: USDC only. Quantities: whole NFTs only. These are non-negotiable product facts.
- Fees: 1% taker, 0.5% maker, 10 to 20% of launchpad presale proceeds, no maker rebates. Not currently shown on the landing page.
- Language rules (locked): use order book, trading pair, limit order, market order, bid, ask, spread, maker, taker, partial fill, best bid, best ask. Never use "floor price", "listing", "rarity", "traits", "marketplace", "buy now", escrow-platform language, em dashes or emoji. Public copy states what LNYQ is and does; it never explains what it is not and never compares defensively.
- Open decision: whether perpetuals and fee structure belong on the landing page.

## Brand Commitments

- Name: LNYQ. Site: lnyq.xyz. Twitter: @LnyqProtocol. Logo mark: `public/Lnyq.png`.
- Voice: direct, declarative, PM-grade. No fluff, no hedging, no category explanations.
- Palette commitment (user, 2026-10-15): the landing page keeps LNYQ's near-black ground (#050507) with the DEX purple tokens (primary #A051FC, light accent #C48AFD, dark #35184E) plus indigo glows as the accent, and mint (#63e6cf) and coral (#f7839a) as the market colours. Typography for the landing page: Space Grotesk, semibold headings and regular body (user, 2026-10-15).
- Contact addresses used on the page: support@lnyq.xyz for access requests, ecosystem@lnyq.xyz for project submissions.

## Evidence on Hand

- The landing hero (`src/components/IllustrativeBook.tsx`) is an authored, seeded order book that moves like a live one. It is a demonstration, not a market; the user chose not to caption it (2026-10-15). `public/media/` still holds the earlier canvas-rendered terminal recording and its generator; the page no longer uses them.
- No testimonials, customer names, volumes, trader counts or benchmarks exist. Do not fabricate any.

## Product Principles

1. Say what is live and what is coming, exactly. Availability is product truth, never a label.
2. Lead with the mechanism: order book, public price discovery, onchain settlement.
3. One continuous journey from creation to trade; never present the products as unrelated.
4. Self-custody and explicit signatures stay visible; nothing is hidden behind "magic".
5. Testnet honesty: the page never implies real assets or a mainnet.

## Accessibility & Inclusion

WCAG 2.2 AA is the working standard for the landing page: 4.5:1 text contrast, a 12px minimum type size, keyboard-operable menu and dialog, reduced-motion respected for ambient animation only.
