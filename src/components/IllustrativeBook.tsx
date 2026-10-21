import { useEffect, useState } from 'react'

/**
 * An authored order book that behaves like a live one: orders land and pull,
 * fills cross at the spread, the last price moves, and the pointer reads
 * cumulative depth. Values come from a fixed seed, so it is an illustration
 * of how an LNYQ book works, never a market.
 */
interface Level { price: number; size: number }

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const random = mulberry32(20260115)
const TICK = 0.05
const LEVELS = 11
const STEP_MS = 650
const r2 = (value: number) => Math.round(value * 100) / 100
const size = () => 1 + Math.floor(random() * 9)

function ladder(start: number, direction: 1 | -1): Level[] {
  return Array.from({ length: LEVELS }, (_, index) => ({ price: r2(start + direction * TICK * (index + 1)), size: size() + (index < 2 ? 2 : 0) }))
}

interface BookState { bids: Level[]; asks: Level[]; last: { price: number; side: 'buy' | 'sell' } | null; sessionOpen: number; volume: number; fillSeq: number }

function initial(): BookState {
  const mid = 38.1
  return { bids: ladder(mid, -1), asks: ladder(mid, 1), last: null, sessionOpen: 38.12, volume: 0, fillSeq: 0 }
}

function step(state: BookState): BookState {
  const roll = random()
  const bids = state.bids.map(level => ({ ...level }))
  const asks = state.asks.map(level => ({ ...level }))
  let { last, volume, fillSeq } = state
  if (roll < 0.28) {
    // A taker crosses the spread: buys from the best ask or sells into the best bid.
    const buy = random() < 0.5
    const takerSide: 'buy' | 'sell' = buy ? 'buy' : 'sell'
    const side = buy ? asks : bids
    const top = side[0]!
    const qty = Math.max(1, Math.min(top.size, 1 + Math.floor(random() * 3)))
    top.size -= qty
    last = { price: top.price, side: takerSide }
    volume += qty
    fillSeq += 1
    if (top.size <= 0) {
      side.shift()
      const far = side[side.length - 1]!
      side.push({ price: r2(far.price + (buy ? TICK : -TICK)), size: size() })
    }
  } else if (roll < 0.62) {
    // A maker adds to a resting level.
    const side = random() < 0.5 ? bids : asks
    const level = side[Math.floor(random() * Math.min(6, side.length))]!
    level.size = Math.min(24, level.size + 1 + Math.floor(random() * 3))
  } else if (roll < 0.84) {
    // A maker pulls part of a level, never the whole top of book.
    const side = random() < 0.5 ? bids : asks
    const index = 1 + Math.floor(random() * Math.min(5, side.length - 1))
    const level = side[index]!
    level.size = Math.max(1, level.size - (1 + Math.floor(random() * 2)))
  } else {
    // A new order improves the top of book by one tick, inside the spread, when there is room.
    const spreadTicks = Math.round((asks[0]!.price - bids[0]!.price) / TICK)
    if (spreadTicks > 2) {
      if (random() < 0.5) bids.unshift({ price: r2(bids[0]!.price + TICK), size: 1 + Math.floor(random() * 3) })
      else asks.unshift({ price: r2(asks[0]!.price - TICK), size: 1 + Math.floor(random() * 3) })
      if (bids.length > LEVELS) bids.pop()
      if (asks.length > LEVELS) asks.pop()
    }
  }
  return { ...state, bids, asks, last, volume, fillSeq }
}

const fmt = (value: number) => value.toFixed(2)

export default function IllustrativeBook() {
  const [book, setBook] = useState<BookState>(initial)
  const [hover, setHover] = useState<{ side: 'bid' | 'ask'; index: number } | null>(null)
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (reduceMotion) return
    const timer = window.setInterval(() => setBook(previous => step(previous)), STEP_MS)
    const mark = window.setTimeout(() => setEntered(true), 1600)
    return () => { window.clearInterval(timer); window.clearTimeout(mark) }
  }, [reduceMotion])

  useEffect(() => {
    if (book.fillSeq > 0 && book.last) window.dispatchEvent(new CustomEvent('lnyq:fill', { detail: { side: book.last.side, price: book.last.price } }))
  }, [book.fillSeq]) // eslint-disable-line react-hooks/exhaustive-deps

  const bestBid = book.bids[0]!, bestAsk = book.asks[0]!
  const spread = r2(bestAsk.price - bestBid.price)
  const mid = (bestAsk.price + bestBid.price) / 2
  const maxSize = Math.max(...book.bids.map(l => l.size), ...book.asks.map(l => l.size))
  const bidTotal = book.bids.reduce((sum, l) => sum + l.size, 0), askTotal = book.asks.reduce((sum, l) => sum + l.size, 0)
  const lastPrice = book.last?.price ?? book.sessionOpen
  const change = ((lastPrice - book.sessionOpen) / book.sessionOpen) * 100

  // Cumulative depth from the top of book down to the hovered level.
  const cumulative = (side: 'bid' | 'ask', index: number) => {
    const levels = (side === 'bid' ? book.bids : book.asks).slice(0, index + 1)
    const nfts = levels.reduce((sum, l) => sum + l.size, 0)
    const usdc = levels.reduce((sum, l) => sum + l.size * l.price, 0)
    return { nfts, usdc, to: levels[levels.length - 1]!.price }
  }
  const depth = hover ? cumulative(hover.side, hover.index) : null

  const row = (side: 'bid' | 'ask', level: Level, index: number) => {
    const lit = hover && hover.side === side && index <= hover.index
    return (
      <li key={`${side}-${level.price}`} className={`ledger-book-row ${side}${lit ? ' lit' : ''}${index === 0 ? ' top' : ''}`} style={!entered ? { animationDelay: `${500 + index * 45}ms` } : undefined} onPointerEnter={() => setHover({ side, index })} onPointerLeave={() => setHover(null)}>
        <span className="ledger-book-depth" style={{ width: `${(level.size / maxSize) * 100}%` }} aria-hidden="true" />
        <span className="ledger-book-price">{fmt(level.price)}</span>
        <span className="ledger-book-size">{level.size}</span>
        <span className="ledger-book-total">{fmt(level.size * level.price)}</span>
      </li>
    )
  }

  return (
    <figure className="ledger-sheet-chart ledger-sheet-book">
      <figcaption className="ledger-chart-head">
        <div>
          <span className="ledger-chart-market">COLLECTION / USDC</span>
          <span className="ledger-chart-title">{depth ? `${hover!.side === 'bid' ? 'Bids' : 'Asks'} down to ${fmt(depth.to)}: ${depth.nfts} NFTs, ${fmt(depth.usdc)} USDC` : 'Order book, whole NFTs, USDC settlement'}</span>
        </div>
        <dl className="ledger-chart-readout" aria-live="off">
          <div><dt>Last</dt><dd className={book.last ? book.last.side === 'buy' ? 'up' : 'down' : undefined}>{fmt(lastPrice)}</dd></div>
          <div><dt>Session</dt><dd className={change >= 0 ? 'up' : 'down'}>{change >= 0 ? '+' : ''}{change.toFixed(1)}%</dd></div>
          <div><dt>Spread</dt><dd>{fmt(spread)} <small>({((spread / mid) * 100).toFixed(2)}%)</small></dd></div>
          <div><dt>Volume</dt><dd>{book.volume} <small>NFTs</small></dd></div>
        </dl>
      </figcaption>

      <div className="ledger-book" role="group" aria-label="Order book">
        <div className="ledger-book-cols" aria-hidden="true"><span>Price</span><span>Size</span><span>Total USDC</span></div>
        <ol className="ledger-book-side asks" aria-label={`Asks, ${askTotal} NFTs resting`}>
          {[...book.asks.slice(0, LEVELS)].reverse().map((level, i, arr) => row('ask', level, arr.length - 1 - i))}
        </ol>
        <div className={`ledger-book-spread${book.last ? ` ${book.last.side}` : ''}`} aria-live="polite">
          <span className="ledger-book-last">{fmt(lastPrice)}</span>
          <span className="ledger-book-spread-label">spread {fmt(spread)}</span>
          <span className="ledger-book-mid">mid {fmt(mid)}</span>
        </div>
        <ol className="ledger-book-side bids" aria-label={`Bids, ${bidTotal} NFTs resting`}>
          {book.bids.slice(0, LEVELS).map((level, index) => row('bid', level, index))}
        </ol>
      </div>

    </figure>
  )
}
