import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { IconMenu2, IconX } from '@tabler/icons-react'
import { CREATOR_APP_URL, DEX_APP_URL } from '../../content'

/** Logo left, a compact pill navigation in the centre, Launch app on the right. */
export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const location = useLocation()
  const [seen, setSeen] = useState(location.pathname)
  if (seen !== location.pathname) { setSeen(location.pathname); setOpen(false) }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onPointer = (e: PointerEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('keydown', onKey); document.addEventListener('pointerdown', onPointer)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onPointer) }
  }, [open])

  const anchor = (hash: string) => (location.pathname === '/' ? hash : `/${hash}`)
  return (
    <header className="site-header">
      <nav ref={ref} className="site-nav" aria-label="Primary">
        <Link className="site-brand" to="/" aria-label="LNYQ home"><img src="/Lnyq.png" alt="" width={24} height={24} /><span>LNYQ</span></Link>
        <div id="site-nav-pill" className={`site-nav-pill${open ? ' open' : ''}`}>
          <a href={anchor('#about')} onClick={() => setOpen(false)}>About</a>
          <NavLink to="/ecosystem">Ecosystem</NavLink>
          <a href={anchor('#launch')} onClick={() => setOpen(false)}>Launchpad</a>
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
