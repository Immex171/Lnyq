import { useRef, useState } from 'react'
import Reveal from '../../reveal'
import PreviewChart from '../preview/PreviewChart'
import { useTicker } from '../preview/useTicker'
import { money, nf, perps, px, terminal } from '../../content'

/** The perps card beside its heading: long or short, priced from the order book. */
export default function PerpsSection() {
  const card = useRef<HTMLDivElement>(null)
  const { tick } = useTicker(card, 1600)
  const [side, setSide] = useState<'long' | 'short'>('long')
  const mark = Math.round((perps.mark + Math.sin(tick / 2.1) * 0.05 + Math.sin(tick / 5.3) * 0.03) * 100) / 100
  return (
    <section className="site-section perps" id="perps" aria-labelledby="perps-title">
      <div className="site-two-col">
        <div className="site-two-col-copy">
          <Reveal as="h2" id="perps-title">{perps.title}</Reveal>
          <Reveal as="p" className="site-lead" delay={80}>{perps.copy}</Reveal>
        </div>
        <Reveal delay={120}>
          <div ref={card} className={`pv-panel pv-perps ${side}`} aria-label="Perps ticket">
            <div className="pv-top">
              <div className="pv-markets"><span className="active">{perps.pair}</span></div>
              <dl className="pv-strip">
                <div><dt>Mark price</dt><dd className="up">{px(mark)}</dd></div>
                <div><dt>Session</dt><dd className="up">{perps.session}</dd></div>
              </dl>
            </div>
            <div className="pv-perps-chart">
              <PreviewChart height={150} tick={tick} mode="line" candles={terminal.chart.candles} low={terminal.chart.low} high={terminal.chart.high} close={terminal.chart.close} label={`${perps.pair} mark price`} />
            </div>
            <form className="pv-ticket" onSubmit={e => e.preventDefault()}>
              <div className="pv-ticket-side large" role="group" aria-label="Direction">
                <button type="button" className={side === 'long' ? 'active buy' : ''} onClick={() => setSide('long')}>Long</button>
                <button type="button" className={side === 'short' ? 'active sell' : ''} onClick={() => setSide('short')}>Short</button>
              </div>
              <label>Order type<span className="pv-ticket-value">Market</span></label>
              <label>Size<span className="pv-ticket-value">{nf.format(perps.size)} <small>NFTs</small></span></label>
              <label>Leverage<span className="pv-ticket-value">{perps.leverage}</span></label>
              <div className="pv-ticket-total"><span>Margin required</span><strong>{money(perps.margin)} USDC</strong></div>
              <button type="submit" className={`site-btn full ${side === 'long' ? 'green' : 'red'}`}>{side === 'long' ? 'Long' : 'Short'} {nf.format(perps.size)} NFTs</button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
