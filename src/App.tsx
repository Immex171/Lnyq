import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SiteHeader from './components/site/SiteHeader'
import ParticleWave from './components/site/ParticleWave'
import SiteClosing from './components/site/SiteClosing'
import HomePageV2 from './pages/HomePageV2'
import EcosystemPage from './pages/EcosystemPage'
import { SUPPORT_EMAIL, meta } from './content'
import './site.css'

const TITLES: Record<string, string> = {
  '/': meta.title,
  '/ecosystem': meta.ecosystemTitle,
  '/docs': 'LNYQ | Docs',
  '/terms': 'LNYQ | Terms',
  '/privacy': 'LNYQ | Privacy',
}

/** The landing page's shared background: one wave layer behind header, sections, closing panel and footer. */
function Background() {
  return useLocation().pathname === '/' ? <ParticleWave /> : null
}

/** Route changes land at the top, or at the hash the link named; the title follows the route. */
function RouteEffects() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    document.title = TITLES[pathname] ?? TITLES['/']!
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) { target.scrollIntoView({ block: 'start' }); return }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}

/** Docs, terms and privacy are written elsewhere; until their real destinations are configured these paths hold the place. */
function Holding({ title }: { title: string }) {
  return (
    <main className="site-main">
      <section className="site-hero compact"><h1>{title}</h1><p className="site-hero-copy">This page is being prepared. For anything you need now, write to <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p><div className="site-hero-actions"><a className="site-btn ghost" href="/">Back to the front page</a></div></section>
    </main>
  )
}

function NotFound() {
  return (
    <main className="site-main">
      <section className="site-hero compact"><h1>Nothing here.</h1><p className="site-hero-copy">That address is not part of the site.</p><div className="site-hero-actions"><a className="site-btn ghost" href="/">Back to the front page</a></div></section>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="site" id="top">
        <RouteEffects />
        <Background />
        <SiteHeader />
        <Routes>
          <Route path="/" element={<HomePageV2 />} />
          <Route path="/about" element={<Navigate to="/#about" replace />} />
          <Route path="/ecosystem" element={<EcosystemPage />} />
          <Route path="/docs" element={<Holding title="Docs" />} />
          <Route path="/terms" element={<Holding title="Terms" />} />
          <Route path="/privacy" element={<Holding title="Privacy" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <SiteClosing />
      </div>
    </BrowserRouter>
  )
}
