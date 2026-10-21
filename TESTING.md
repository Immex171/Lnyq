# Landing site test record

Milestone 1 (Tasks 1 to 6). Re-run with `node scripts/checkPages.mjs` against a running dev or preview server; the raw output is saved at `.impeccable/review/page-check.json`.

## 2026-10-15 · Milestone 1

| # | Check | Expected | Result |
|---|---|---|---|
| 1 | Console errors on `/`, `/about` (redirects to `/#about`), `/ecosystem`, unknown route | none | 0 on every route (pass, re-run 2026-10-15 after the redesign) |
| 1 | Failed or 4xx/5xx requests while loading each route | none | 0 (pass) |
| 1 | Links with no destination or `#` only | none | 0 across 97 links (pass) |
| 1 | In-page anchors (`#products`, `#access`, `#submit`, …) resolve | all | all found (pass) |
| 1 | Unknown route | a page, not a blank | "Nothing is written here" with a way back (pass) |
| 2 | Page explains LNYQ, the three products and how it differs | on the front page and `/about` | "What LNYQ is" section on the front page, `/about` with mechanism, products, differences, roadmap (pass, copy sourced from PRODUCT_SPEC.md §1, §3, §4, §6 and AMM_SPEC.md §0.1) |
| 2 | Fees shown match the locked spec | 1% taker, 0.5% maker, no rebates | matches PRODUCT_SPEC.md §4 (pass). Launchpad protocol fee is not shown anywhere on the site (Task 10 rule) |
| 3 | Ecosystem page lists our three products first, then categories | yes | LNYQ products category leads; five more categories, each with an honest empty state (pass) |
| 3 | Adding a project or category needs no page rework | one entry in `src/ecosystem.ts` | verified by `ecosystem.test.ts` (pass) |
| 3 | Submit Project captures project basics and contact | name, website, category, description, contact name, email | all captured and validated (pass) |
| 3 | Submission actually reaches us | delivered | **blocked**: no delivery endpoint exists yet. The form POSTs JSON to `VITE_LNYQ_FORMS_URL`; with it empty the visitor is told submissions are not connected and is offered email. Needs an endpoint (gateway route or hosted form service) before the end-to-end send can be tested |
| 3 | Nav: LNYQ AMM shows "Coming soon", leads nowhere | yes | button shows the note for 3 seconds, no navigation (pass) |
| 3 | Nav: LNYQ Launchpad leads to the Launchpad on the DEX | `VITE_LNYQ_LAUNCHPAD_URL` | `http://localhost:5173/launchpad` locally (pass) |
| 4 | Create Token in the nav leads to the creator app, URL kept in one place | `VITE_LNYQ_CREATOR_URL` in `src/content.ts` | nav, journey section and footer all read the same constant (pass) |
| 5 | Access code: invalid email | clear message, nothing sent | inline error, no request (pass, `forms.test.ts`) |
| 5 | Access code: same email twice | clear message | second attempt from the same browser is told it is already submitted; a server 409 is reported the same way (pass, `forms.test.ts`) |
| 5 | Access code: failed send | clear message with a way out | network and server failures each get their own message plus an email fallback (pass, `forms.test.ts`) |
| 5 | Access code: delivery to us | arrives | **blocked**: same endpoint as Task 3 |
| 6 | Every Launch app control leads to the DEX | nav seal, hero seal, About page seal, footer link | all read `VITE_LNYQ_APP_URL` (pass; 4 places) |

Outbound destinations found on the site: the four app URLs from `.env`, the Solana explorer, the protocol docs on GitHub, @LnyqProtocol on X, and the two contact mailboxes.

## Flagged for outside the front end

1. A delivery endpoint for both forms. The site is ready to POST `{kind, email, …}` to it and treats HTTP 409 as a duplicate.
2. The production URLs for the DEX, Launchpad, creator app and auth page, to be set in `.env`.
