import { useEffect, useRef, useState } from 'react'
import Reveal from '../../reveal'
import PreviewChart from '../preview/PreviewChart'
import PreviewBook from '../preview/PreviewBook'
import { liveFills } from '../preview/book'
import { useTicker } from '../preview/useTicker'
import { money, nf, px, terminal } from '../../content'

/** The width the terminal is laid out at. Below the desktop breakpoint the whole panel is scaled to fit, so it keeps this composition everywhere. */
const BASE_WIDTH = 1040
const DESKTOP = 1100

/**
 * The spot terminal, shown as a product screen. On desktop it starts tilted
 * back and straightens as the visitor scrolls; the angle follows the scroll
 * position so it reverses on the way up. On smaller screens it is laid out
 * at its desktop width and scaled down to the available width, so chart,
 * book and ticket stay side by side exactly as on desktop. Flat under
 * reduced motion.
 */
export default function TerminalSection() {
  const stage = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [angle, setAngle] = useState(0)
  const [fit, setFit] = useState<{ scale: number; height: number } | null>(null)
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const { tick } = useTicker(stage, 1400)
  const last = liveFills(tick)[0]!.price
  const ticket = terminal.ticket[side]

  useEffect(() => {
    const element = stage.current, box = panel.current
    if (!element || !box) return
    const measure = () => {
      if (window.innerWidth >= DESKTOP) { setFit(null); return }
      const scale = element.getBoundingClientRect().width / BASE_WIDTH
      setFit({ scale, height: box.offsetHeight * scale })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element); observer.observe(box)
    window.addEventListener('resize', measure)
    return () => { observer.disconnect(); window.removeEventListener('resize', measure) }
  }, [])

  useEffect(() => {
    const element = stage.current
    if (!element) return
    const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < DESKTOP
    const update = () => {
      if (still()) { setAngle(0); return }
      const rect = element.getBoundingClientRect()
      const vh = window.innerHeight
      const t = Math.min(1, Math.max(0, (rect.top - vh * 0.1) / (vh * 0.85)))
      setAngle(Math.round(12 * t * 100) / 100)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])

  return (
    <section className="site-section terminal" id="products" aria-labelledby="terminal-title">
      <div className="site-section-intro">
        <Reveal as="h2" id="terminal-title">{terminal.title}</Reveal>
        <Reveal as="p" delay={80}>{terminal.copy}</Reveal>
      </div>
      <div className="site-showcase">
        <div className="site-showcase-glow" aria-hidden="true" />
        <div ref={stage} className="site-showcase-stage" style={fit ? { height: fit.height } : undefined}>
          <div ref={panel} className={`pv-panel${fit ? ' scaled' : ''}`} style={fit ? { width: BASE_WIDTH, transform: `scale(${fit.scale})` } : { transform: `perspective(1600px) rotateX(${angle}deg)` }} aria-label="LNYQ spot terminal">
            <div className="pv-top">
              <div className="pv-markets" role="tablist" aria-label="Market">
                {terminal.markets.map((market, index) => <span key={market} role="tab" aria-selected={index === 0} className={index === 0 ? 'active' : undefined}>{market}</span>)}
              </div>
              <dl className="pv-strip">
                <div><dt>Last</dt><dd className="up">{px(last)}</dd></div>
                <div><dt>Session</dt><dd className="up">{terminal.session}</dd></div>
                <div><dt>Circulating supply</dt><dd>{nf.format(terminal.circulating)}</dd></div>
                <div><dt>Total supply</dt><dd>{nf.format(terminal.total)}</dd></div>
                <div><dt>FDV</dt><dd>{nf.format(terminal.fdv)} <small>USDC</small></dd></div>
              </dl>
            </div>
            <div className="pv-grid">
              <div className="pv-chart-cell">
                <PreviewChart height={300} tick={tick} candles={terminal.chart.candles} low={terminal.chart.low} high={terminal.chart.high} close={terminal.chart.close} label={`${terminal.markets[0]} price chart`} />
              </div>
              <div className="pv-book-cell"><PreviewBook tick={tick} /></div>
              <form className="pv-ticket" onSubmit={e => e.preventDefault()} aria-label="Order ticket">
                <div className="pv-ticket-side" role="group" aria-label="Side">
                  <button type="button" className={side === 'buy' ? 'active buy' : ''} onClick={() => setSide('buy')}>Buy</button>
                  <button type="button" className={side === 'sell' ? 'active sell' : ''} onClick={() => setSide('sell')}>Sell</button>
                </div>
                <label>Order type<span className="pv-ticket-value">Market</span></label>
                <label>Quantity<span className="pv-ticket-value">{nf.format(ticket.quantity)} <small>NFTs</small></span></label>
                <div className="pv-ticket-total"><span>{ticket.label}</span><strong>{money(ticket.total)} USDC</strong></div>
                <button type="submit" className={`site-btn full ${side === 'buy' ? 'green' : 'red'}`}>{side === 'buy' ? 'Buy' : 'Sell'} {nf.format(ticket.quantity)} NFTs</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
