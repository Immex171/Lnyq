import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { IconMenu2, IconX } from '@tabler/icons-react'
import { CREATOR_APP_URL, DEX_APP_URL, LAUNCHPAD_URL } from '../../content'

/** Logo left, a compact pill navigation in the centre, Launch app on the right. */
export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [ammNote, setAmmNote] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const location = useLocation()
  const [seen, setSeen] = useState(location.pathname)
  if (seen !== location.pathname) { setSeen(location.pathname); setOpen(false); setAmmNote(false) }

  useEffect(() => {
    if (!open && !ammNote) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); setAmmNote(false) } }
    const onPointer = (e: PointerEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setAmmNote(false) } }
    document.addEventListener('keydown', onKey); document.addEventListener('pointerdown', onPointer)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onPointer) }
  }, [open, ammNote])

  const anchor = (hash: string) => (location.pathname === '/' ? hash : `/${hash}`)
  return (
    <header className="site-header">
      <nav ref={ref} className="site-nav" aria-label="Primary">
        <Link className="site-brand" to="/" aria-label="LNYQ home"><img src="/Lnyq.png" alt="" width={24} height={24} /><span>LNYQ</span></Link>
        <div id="site-nav-pill" className={`site-nav-pill${open ? ' open' : ''}`}>
          <a href={anchor('#products')}>Products</a>
          <a href={anchor('#about')}>About</a>
          <NavLink to="/ecosystem">Ecosystem</NavLink>
          <a href={LAUNCHPAD_URL}>Launchpad</a>
          <span className="site-nav-amm">
            <button type="button" aria-expanded={ammNote} aria-describedby="site-amm-note" onClick={() => { setAmmNote(true); window.setTimeout(() => setAmmNote(false), 3000) }}>AMM</button>
            <span id="site-amm-note" role="status" className={`site-nav-note${ammNote ? ' shown' : ''}`}>Coming soon</span>
          </span>
          <a className="site-nav-create" href={CREATOR_APP_URL}>Create token</a>
        </div>
        <div className="site-nav-right">
          <a className="site-btn primary small" href={DEX_APP_URL}>Launch app</a>
          <button className="site-menu-toggle" type="button" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-controls="site-nav-pill" aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <IconX size={18} /> : <IconMenu2 size={18} />}</button>
        </div>
      </nav>
    </header>
  )
}
