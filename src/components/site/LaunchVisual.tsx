import { useRef } from 'react'
import { IconCheck } from '@tabler/icons-react'
import { useDemoPlayback } from '../demos/useDemoPlayback'

/** The large visual beside the steps: a launch moving from presale to an open order book. Example data. */
const PHASES = ['Allowlist phase', 'Public phase', 'Settlement', 'Market open']
export default function LaunchVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const { frame, reduceMotion } = useDemoPlayback(ref, 8, 900, 3000)
  const sold = Math.min(550, Math.round((frame / 6) * 550))
  const phase = frame < 2 ? 0 : frame < 5 ? 1 : frame < 7 ? 2 : 3
  return (
    <div ref={ref} className="site-visual" aria-label="Launch to market demo with example data">
      <div className="site-visual-top">
        <div><span className="site-visual-eyebrow">Launchpad · demo collection</span><strong>Cobalt Owls</strong></div>
        <span className="demo-tag">Example data</span>
      </div>
      <ol className="site-visual-phases">
        {PHASES.map((name, index) => <li key={name} className={index < phase ? 'done' : index === phase ? 'active' : ''}><span>{index < phase ? <IconCheck size={11} stroke={3} /> : index + 1}</span>{name}</li>)}
      </ol>
      <div className="site-visual-stat">
        <div><span>Sold</span><strong>{sold} <small>/ 550 NFTs</small></strong></div>
        <div><span>Raised</span><strong>{(sold * 38.15).toLocaleString('en-US', { maximumFractionDigits: 0 })} <small>USDC</small></strong></div>
        <div><span>Price</span><strong>38.15 <small>USDC</small></strong></div>
      </div>
      <div className="site-visual-bar" aria-hidden="true"><span style={{ width: `${(sold / 550) * 100}%` }} /></div>
      <div className={`site-visual-handoff${phase === 3 ? ' open' : ''}`}>
        {phase === 3 ? (
          <>
            <strong>Market open on the order book</strong>
            <div className="site-visual-book"><span className="ask">38.35 · 4</span><span className="ask">38.25 · 6</span><span className="mid">spread 0.10</span><span className="bid">38.15 · 9</span><span className="bid">38.05 · 12</span></div>
          </>
        ) : (
          <><strong>{phase === 2 ? 'Settling on Solana' : 'Presale running'}</strong><p>{phase === 2 ? 'Allocations and refunds are written on-chain; the collection hands off into its order book.' : 'Buyers commit USDC per phase. The successful launch opens a market where price forms in public.'}</p></>
        )}
      </div>
      {reduceMotion && <p className="demo-static-note">Final state shown.</p>}
    </div>
  )
}
