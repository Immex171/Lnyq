# LNYQ Landing

A standalone, independently installable landing site for LNYQ. It does not import source files or dependencies from the DEX frontend or `LnyqProtocol`.

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

The site runs at `http://localhost:4173` by default. Its destinations are configured through `.env.local`:

- `VITE_LNYQ_APP_URL`: trading app
- `VITE_LNYQ_LAUNCHPAD_URL`: launchpad
- `VITE_LNYQ_CREATOR_URL`: creator app
- `VITE_LNYQ_AUTH_URL`: access-code sign-in
- `VITE_LNYQ_DOCS_URL`, `VITE_LNYQ_TERMS_URL`, `VITE_LNYQ_PRIVACY_URL`: footer destinations; while empty the site serves a holding page at `/docs`, `/terms` and `/privacy`
- `VITE_LNYQ_FORMS_URL`: delivery endpoint for the access-code and project forms (empty until one exists)

## Commands

```bash
npm run dev          # Vite development server
npm run build        # type-check and production build
npm test             # content, ecosystem, preview and content-rule tests
npm run lint         # source lint
node scripts/checkPages.mjs   # console errors, failed requests and dead links on every route
```

## Structure

- `src/App.tsx`: routes: `/` (the front page, About is the vision section), `/ecosystem`, holding pages for `/docs`, `/terms`, `/privacy`; `/about` redirects to `/#about`
- `src/content.ts`: every line of copy, every preview number and every outbound destination
- `src/components/site/`: the page in order: header, hero, spot terminal, perps, launch, vision, build on LNYQ, early access, closing panel and footer
- `src/components/preview/`: the spot chart, the order book and tape, and the ticker that lets them move gently while on screen
- `src/ecosystem.ts`: the ecosystem directory; categories are fixed and a tab appears when its category has an entry
- `src/forms.ts`: form delivery with duplicate, failure and not-connected handling
- `src/site.css`: the visual system: black, white and grey, with green and red only inside the book, chart, tickets and the Long and Short tabs
- `src/__tests__/rules.test.ts`: the content rules, enforced against the source
- `public/media/` and `scripts/generateTradeVideo.mjs`: an earlier terminal recording and its generator; unused by the page

Type is Space Grotesk throughout, self-hosted through Fontsource. The grid, the glow, the terminal tilt and the previews all stand still under `prefers-reduced-motion`.
