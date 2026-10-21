import { useRef } from 'react'
import { IconCheck } from '@tabler/icons-react'
import { useDemoPlayback } from './useDemoPlayback'

/** One example market order, from the ticket to on-chain settlement. */
const STAGES = [
  { key: 'submitted', label: 'Submitted', detail: 'Buy 2 NFTs, market order, 76.30 USDC reserved from the vault balance.' },
  { key: 'matched', label: 'Matched', detail: '2 of 2 filled at 38.15 against the best ask. Taker fee 1%: 0.76 USDC.' },
  { key: 'filled', label: 'Filled', detail: 'Order complete. Fill published to the book and the chart.' },
  { key: 'settled', label: 'Settled on Solana', detail: 'Settlement program moved 2 NFTs and 76.30 USDC atomically. Signature 4jB3…YRHz (example).' },
]

export default function TradeDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const { frame, reduceMotion } = useDemoPlayback(ref, STAGES.length, 1150, 2800)
  return (
    <div ref={ref} className="demo-card" aria-label="Trade lifecycle demo with example data">
      <div className="demo-card-head"><strong>A trade, end to end</strong><span className="demo-tag">Example data</span></div>
      <p className="demo-card-copy">From the ticket to the chain. Nothing moves until the fill settles.</p>
      <div className="demo-ticket" aria-hidden="true">
        <span className="demo-ticket-side">Buy</span>
        <span className="demo-ticket-qty">2 <small>NFTs</small></span>
        <span className="demo-ticket-type">Market</span>
        <span className="demo-ticket-total">≈ 76.30 <small>USDC</small></span>
      </div>
      <ol className="demo-stages">
        {STAGES.map((stage, index) => {
          const state = frame > index ? 'done' : frame === index ? 'active' : 'pending'
          return (
            <li key={stage.key} className={`demo-stage ${state}`}>
              <span className="demo-stage-mark" aria-hidden="true">{state === 'done' ? <IconCheck size={12} stroke={3} /> : <i />}</span>
              <div><strong>{stage.label}</strong>{state !== 'pending' && <p>{stage.detail}</p>}</div>
            </li>
          )
        })}
      </ol>
      {reduceMotion && <p className="demo-static-note">Final state shown.</p>}
    </div>
  )
}
