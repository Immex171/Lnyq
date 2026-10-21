import { useEffect, useRef, useState } from 'react'
import IllustrativeBook from '../IllustrativeBook'
import ChartDemo from '../demos/ChartDemo'

/**
 * The trading interface below the hero, spanning the content width. It starts
 * tilted back and straightens as the visitor scrolls; the angle follows the
 * scroll position, so it reverses on the way up. Flat on small screens and
 * under reduced motion. Everything inside is a labelled demo.
 */
export default function DashboardShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const [angle, setAngle] = useState(0)
  const [side, setSide] = useState<'buy' | 'sell'>('buy')

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 760
    const update = () => {
      if (still()) { setAngle(0); return }
      const rect = element.getBoundingClientRect()
      // 14° while the top of the panel sits at the bottom of the viewport, straightening steadily to 0° as it rises to the top tenth.
      const vh = window.innerHeight
      const t = Math.min(1, Math.max(0, (rect.top - vh * 0.1) / (vh * 0.85)))
      setAngle(Math.round(14 * t * 100) / 100)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])

  return (
    <div className="site-showcase">
      <div className="site-showcase-glow" aria-hidden="true" />
      <div ref={ref} className="site-showcase-stage">
        <div className="site-dashboard" style={{ transform: `perspective(1600px) rotateX(${angle}deg)` }} aria-label="LNYQ trading terminal, demo data">
          <div className="site-dashboard-top">
            <div className="site-dashboard-tabs"><span className="active">Trade</span><span>Portfolio</span><span>Launchpad</span></div>
            <div className="site-dashboard-market"><strong>COLLECTION / USDC</strong><span>Demo market</span></div>
            <div className="site-dashboard-balance"><span>Vault balance</span><strong>12,480.00 USDC</strong></div>
          </div>
          <div className="site-dashboard-grid">
            <div className="site-dashboard-chart"><ChartDemo height={330} /></div>
            <div className="site-dashboard-book"><IllustrativeBook /></div>
            <form className="site-dashboard-ticket" onSubmit={e => e.preventDefault()} aria-label="Order ticket, demo">
              <div className="site-ticket-side" role="group" aria-label="Side">
                <button type="button" className={side === 'buy' ? 'active buy' : ''} onClick={() => setSide('buy')}>Buy</button>
                <button type="button" className={side === 'sell' ? 'active sell' : ''} onClick={() => setSide('sell')}>Sell</button>
              </div>
              <label>Order type<span className="site-ticket-value">Limit</span></label>
              <label>Quantity<span className="site-ticket-value">2 <small>NFTs</small></span></label>
              <label>Price<span className="site-ticket-value">38.15 <small>USDC</small></span></label>
              <div className="site-ticket-row"><span>Total</span><strong>76.30 USDC</strong></div>
              <div className="site-ticket-row"><span>Est. fee (1% taker)</span><strong>0.76 USDC</strong></div>
              <button type="submit" className={`site-btn ${side === 'buy' ? 'mint' : 'coral'} full`} disabled>{side === 'buy' ? 'Buy 2 NFTs' : 'Sell 2 NFTs'}</button>
              <p className="site-ticket-note">Demo ticket. Orders are placed in the app.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
