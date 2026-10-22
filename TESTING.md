# Landing site test record

Re-run with `npm test`, `npm run lint`, `npm run build`, and `node scripts/checkPages.mjs` against a running dev or preview server.

## 2026-10-22 · Redesign to the final spec

| Check | Expected | Result |
|---|---|---|
| Type-check and production build | clean | pass (`tsc -b`, `vite build`) |
| Unit tests: content numbers, ecosystem directory, preview session and book, content rules | all pass | 20 of 20 pass |
| Content rules (`src/__tests__/rules.test.ts`): no demo labels, fees, testnet or devnet wording, AMM, roadmap, custody wording, competitor names, GitHub docs link, em dashes, purple tokens anywhere in `src/` or `index.html` | none found | pass |
| Console errors, failed requests and 4xx/5xx on `/`, `/about`, `/ecosystem`, `/docs`, `/terms`, `/privacy`, unknown route | none | 0 on every route (pass) |
| Links with no destination; in-page anchors (`#products`, `#about`, `#launch`, `#build`, `#access`, `#submit`) resolve | none dead, all found | pass |
| Phone width (390px): no horizontal scroll; terminal stacks chart, book, ticket; perps card stacks under its heading | yes | pass (screenshots) |
| Ecosystem filter tabs appear only for categories with entries | Collectibles, Exchange, Launchpad | pass |
| Page-wide particle wave: one sticky canvas at the page root behind header, sections, closing panel and footer; pointer-events none; About reveal unchanged (probe: 1.000, 0.979, 0.25, 0.25, 0.25 at the About anchor); page check clean on every route | yes | pass (2026-10-22, screenshots at 1440 and 390 px) |
| Form delivery | delivered | still blocked on an endpoint: `VITE_LNYQ_FORMS_URL` is empty, so both forms say so and offer email |

Open items from the spec that need a product decision before they can be built: supported wallets on the Ecosystem page, the destination behind the Straight to market lane, the creator "apply" state, real Docs, Terms and Privacy destinations.
