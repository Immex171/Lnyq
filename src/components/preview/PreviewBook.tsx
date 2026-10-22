import { nf, px, terminal } from '../../content'
import { liveFills, liveLevels, type Level } from './book'

export default function PreviewBook({ tick }: { tick: number }) {
  const asks = liveLevels(terminal.asks, tick, 101)
  const bids = liveLevels(terminal.bids, tick, 202)
  const fills = liveFills(tick)
  const maxSize = Math.max(...asks.map(l => l.size), ...bids.map(l => l.size))
  const row = (side: 'ask' | 'bid', level: Level) => (
    <li key={`${side}-${level.price}`} className={`pv-book-row ${side}`}>
      <span className="pv-book-depth" style={{ width: `${(level.size / maxSize) * 100}%` }} aria-hidden="true" />
      <span className="pv-book-price">{px(level.price)}</span>
      <span>{nf.format(level.size)}</span>
      <span className="pv-book-total">{nf.format(Math.round(level.size * level.price))}</span>
    </li>
  )
  return (
    <div className="pv-book" role="group" aria-label="Order book">
      <div className="pv-book-cols" aria-hidden="true"><span>Price</span><span>Size</span><span>Total USDC</span></div>
      <ol className="pv-book-side asks" aria-label="Asks">{asks.map(level => row('ask', level))}</ol>
      <div className="pv-book-spread" aria-live="off">
        <strong>{px(terminal.asks[terminal.asks.length - 1]!.price)}</strong>
        <span>best ask</span>
        <span>spread {px(terminal.spread)}</span>
      </div>
      <ol className="pv-book-side bids" aria-label="Bids">{bids.map(level => row('bid', level))}</ol>
      <div className="pv-tape" aria-label="Recent fills">
        <span className="pv-tape-head">Recent fills</span>
        <ol>
          {fills.map((fill, index) => <li key={`${tick}-${index}`} className={index === 0 && tick > 0 ? 'new' : undefined}><span>{nf.format(fill.size)}</span><span>at {px(fill.price)}</span></li>)}
        </ol>
      </div>
    </div>
  )
}
