import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SiteHeader from './components/site/SiteHeader'
import SiteClosing from './components/site/SiteClosing'
import HomePageV2 from './pages/HomePageV2'
import EcosystemPage from './pages/EcosystemPage'
import './landing.css'
import './site.css'

const TITLES: Record<string, string> = {
  '/': 'LNYQ · Order book for NFT collections',
  '/ecosystem': 'LNYQ ecosystem · Projects building on the order book',
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
        <SiteHeader />
        <Routes>
          <Route path="/" element={<HomePageV2 />} />
          <Route path="/about" element={<Navigate to="/#about" replace />} />
          <Route path="/ecosystem" element={<EcosystemPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <SiteClosing />
      </div>
    </BrowserRouter>
  )
}
