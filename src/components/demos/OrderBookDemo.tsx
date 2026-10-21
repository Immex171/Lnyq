import { useRef } from 'react'
import { useDemoPlayback } from './useDemoPlayback'

/** Example book, authored: 5 asks over 5 bids, then 10 scripted events. */
const ASKS0 = [[38.35, 4], [38.30, 7], [38.25, 3], [38.20, 6], [38.15, 9]] as const
const BIDS0 = [[38.05, 8], [38.00, 12], [37.95, 5], [37.90, 2], [37.85, 6]] as const
type Row = { price: number; size: number; flash?: 'fill' | 'add' }
type Event = { side: 'ask' | 'bid'; index: number; size: number; flash: 'fill' | 'add'; last?: number }
const EVENTS: Event[] = [
  { side: 'bid', index: 1, size: 14, flash: 'add' },
  { side: 'ask', index: 4, size: 6, flash: 'fill', last: 38.15 },
  { side: 'ask', index: 4, size: 2, flash: 'fill', last: 38.15 },
  { side: 'bid', index: 0, size: 11, flash: 'add' },
  { side: 'ask', index: 4, size: 0, flash: 'fill', last: 38.15 },
  { side: 'ask', index: 3, size: 9, flash: 'add' },
  { side: 'bid', index: 0, size: 6, flash: 'fill', last: 38.05 },
  { side: 'bid', index: 2, size: 9, flash: 'add' },
  { side: 'bid', index: 0, size: 2, flash: 'fill', last: 38.05 },
  { side: 'ask', index: 2, size: 7, flash: 'add' },
]

function apply(frame: number) {
  const asks: Row[] = ASKS0.map(([price, size]) => ({ price, size }))
  const bids: Row[] = BIDS0.map(([price, size]) => ({ price, size }))
  let last = 38.10, lastSide: 'ask' | 'bid' | null = null
  for (let i = 0; i < Math.min(frame, EVENTS.length); i += 1) {
    const e = EVENTS[i]!
    const rows = e.side === 'ask' ? asks : bids
    rows[e.index]!.size = e.size
    rows.forEach(r => { r.flash = undefined })
    rows[e.index]!.flash = i === frame - 1 ? e.flash : undefined
    if (e.last !== undefined) { last = e.last; lastSide = e.side }
  }
  return { asks, bids, last, lastSide }
}

export default function OrderBookDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const { frame, reduceMotion } = useDemoPlayback(ref, EVENTS.length, 700)
  const { asks, bids, last, lastSide } = apply(frame)
  const max = 16
  const row = (r: Row, side: 'ask' | 'bid') => (
    <li key={`${side}-${r.price}`} className={`demo-book-row ${side}${r.flash ? ` ${r.flash}` : ''}${r.size === 0 ? ' gone' : ''}`}>
      <span className="demo-book-depth" style={{ width: `${(r.size / max) * 100}%` }} aria-hidden="true" />
      <span>{r.price.toFixed(2)}</span><span>{r.size}</span>
    </li>
  )
  return (
    <div ref={ref} className="demo-card" aria-label="Order book demo with example data">
      <div className="demo-card-head"><strong>Order book</strong><span className="demo-tag">Example data</span></div>
      <p className="demo-card-copy">Orders rest on the book. A taker crossing the spread fills the best level and sets the last price.</p>
      <div className="demo-book">
        <div className="demo-book-cols" aria-hidden="true"><span>Price</span><span>Size</span></div>
        <ol className="demo-book-side">{asks.map(r => row(r, 'ask'))}</ol>
        <div className={`demo-book-last${lastSide ? ` ${lastSide}` : ''}`}><span>Last</span><strong>{last.toFixed(2)}</strong><span>{frame >= EVENTS.length ? `${EVENTS.filter(e => e.flash === 'fill').length} fills` : frame === 0 ? 'waiting' : `${EVENTS.slice(0, frame).filter(e => e.flash === 'fill').length} fills`}</span></div>
        <ol className="demo-book-side">{bids.map(r => row(r, 'bid'))}</ol>
      </div>
      {reduceMotion && <p className="demo-static-note">Final state shown.</p>}
    </div>
  )
}
