# LNYQ Landing

A standalone, independently installable landing-site repository for LNYQ. It does not import source files or dependencies from the DEX frontend or `LnyqProtocol`.

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

The site runs at `http://localhost:4173` by default. Its CTA destinations are configured through `.env.local`:

- `VITE_LNYQ_APP_URL` — trading terminal
- `VITE_LNYQ_LAUNCHPAD_URL` — launch discovery
- `VITE_LNYQ_CREATOR_URL` — token creator
- `VITE_LNYQ_AUTH_URL` — access-code/sign-in page
- `VITE_LNYQ_FORMS_URL` — delivery endpoint for the access-code and project forms (empty until one exists)

## Commands

```bash
npm run dev          # standalone Vite development server
npm run build        # type-check and production build
npm test             # landing tests
npm run lint         # source lint
node scripts/checkPages.mjs   # console errors, failed requests and dead links on every route
npm run video:trade      # regenerate the legacy terminal recording (unused by the page)
npm run video:trade:mp4  # same, as H.264 MP4
```

## Structure

- `src/App.tsx` — routes: `/` (front page, with About as sections), `/ecosystem`; `/about` redirects to `/#about`
- `src/components/site/` — the site shell and sections: pill header, hero, dashboard showcase with the scroll tilt, feature section, how it works with the launch visual, about, ecosystem teaser, access, closing panel and footer
- `src/components/demos/` — the working demo cards (order book, chart, trade lifecycle) and the visibility-driven playback hook
- `src/components/IllustrativeBook.tsx` — the live-behaving order book used inside the dashboard
- `src/reveal.tsx` — the one-shot scroll entrance used by headings, cards and steps
- `src/ecosystem.ts` — the ecosystem registry; add a project or a category here
- `src/forms.ts` — form delivery with duplicate, failure and not-connected handling
- `src/site.css` — the visual system (tokens, header, hero, dashboard, sections, cards, forms, closing); `src/landing.css` keeps the demo and book component styles
- `scripts/checkPages.mjs` and `TESTING.md` — the page check and its record
- `public/media/` and `scripts/generateTradeVideo.mjs` — an earlier terminal recording and its generator; unused by the page

Type is Space Grotesk, semibold headings and regular body, self-hosted through Fontsource. The dotted field, the glow, the dashboard tilt and the demos all stand still under `prefers-reduced-motion`.
