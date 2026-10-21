# Surface brief: LNYQ landing page (src/LandingPage.tsx)

Scope: the public landing site, one page. Visitor mode: Persuade.
Audience: experienced NFT traders and collection creators evaluating a new venue for price discovery, order book depth, fees and launch mechanics. Job: judge whether LNYQ is real and live, then open the app or request an access code.
Action: Launch app (the working terminal) and Request access (new wallets). Proof: live devnet market data read from the gateway (markets, order books, candles), the product's own facts (USDC settlement, whole-NFT quantities, 1% taker / 0.5% maker), and two live products with one announced.
Constraints: no mock market data ever; no video; locked language rules (order book, bid, ask, best bid, spread, maker, taker; never floor price, listing, marketplace, buy now, em dashes, emoji); testnet honesty; name, logo and contact addresses preserved.
Chosen direction: The Dojima Ledger (user's choice from the direction round).
Memorable moment: the live candle chart drawn as the Osaka rice ledger that candlesticks were invented for, in sumi ink with vermilion closes, on one tall ledger sheet.
Unresolved: whether perpetuals and the fee table belong on the page (PRODUCT.md open decision); candles exist only once devnet fills happen, until then the chart draws the live resting bid ladder as depth and says so.

## Direction contract

THESIS: The candle chart goes home. LNYQ's page is one ledger sheet from the Dojima rice exchange, where price was first drawn as candles, and the live devnet market is written into it in ink. It refuses the dark split hero with a screenshot on the right and a row of equal cards.

OWN-WORLD: Rice-paper ground (#f1e7cf) with a visible laid texture from the world (ruled ledger columns, not grain filters), sumi ink (#1a1612) for every line and letter, vermilion (#b7262c) for seals, closes and the one primary action, pine (#3b5e4e) for bids and settlement. Columns are ruled with thin ink lines; numerals are tabular and sit on the rules. Display face Shippori Mincho; ledger and body face Zen Kaku Gothic New. Controls are seals (square, vermilion, stamped) and ink-ruled rows; nothing is glass, nothing glows.

STORY: A trader sees a working ledger of real markets with real bids and understands in seconds that this is an order book venue on Solana, in testnet, settling in USDC, with launches that hand into the book. They press the vermilion seal to open the app, or the smaller seal to ask for a code.

FIRST VIEWPORT: One tall sheet filling the viewport, ruled into a wide left column and a narrower right column. Top rule: LNYQ brand mark and name at left, the four navigation entries written along the rule, the vermilion Launch app seal at the far right. Left column: the headline in Mincho at display scale (Liquidity, engineered for digital assets) over one line of subcopy, then the live candle chart drawn in ink filling the column's lower two thirds, with its market name, interval and last price written in the chart's top margin. Right column: the markets ledger, every devnet market as a ruled line (symbol, best bid, resting depth, state), updating live. The primary action also sits at the foot of the left column as a second vermilion seal next to Request access.

FORM: The Dojima Ledger, position 1 on the ordered grounded list, chosen as IMPECCABLE'S PICK over the assigned Pit Board. seed: none (unavailable)

Signature interaction: the chart redraws in ink as new candles or bids arrive (polled every 60 seconds), the newest candle drawn with a brief ink-bleed; hover on a ledger row reveals its full book.
Motion grammar: ink appears, it does not slide; opacity and stroke-dashoffset only; no parallax, no blur.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
