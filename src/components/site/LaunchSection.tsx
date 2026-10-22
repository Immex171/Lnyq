import { IconCheck } from '@tabler/icons-react'
import Reveal from '../../reveal'
import { launch, nf, px } from '../../content'

/**
 * Launch: one flow that starts at Create, splits into the two lanes, joins
 * again at Market opens and ends at Trade; beside it, the result of the
 * presale lane for one collection.
 */
export default function LaunchSection() {
  const { card } = launch
  const soldPct = 100
  return (
    <section className="site-section" id="launch" aria-labelledby="launch-title">
      <div className="site-section-intro">
        <Reveal as="h2" id="launch-title">{launch.title}</Reveal>
        <Reveal as="p" delay={80}>{launch.copy}</Reveal>
      </div>

      <Reveal className="launch-flow" delay={120} aria-label="Launch flow">
        <div className="launch-node"><strong>Create</strong><span>Define the collection and its supply.</span></div>
        <div className="launch-branch" aria-hidden="true" />
        <div className="launch-lanes">
          {launch.lanes.map(lane => <div className="launch-node lane" key={lane.title}><strong>{lane.title}</strong><span>{lane.text}</span></div>)}
        </div>
        <div className="launch-branch join" aria-hidden="true" />
        <div className="launch-node"><strong>Market opens</strong><span>An order book, a price, and liquidity from day one.</span></div>
        <div className="launch-link" aria-hidden="true" />
        <div className="launch-node"><strong>Trade</strong><span>Spot and perps, whole NFTs, settled in USDC.</span></div>
      </Reveal>
      <Reveal as="p" className="launch-steps" delay={160}>{launch.steps.join('. ')}.</Reveal>

      <Reveal className="launch-card" delay={200} aria-label={`${card.collection} launch`}>
        <div className="launch-card-top">
          <div><span className="launch-card-eyebrow">Launchpad</span><strong>{card.collection}</strong></div>
          <ol className="launch-stages">
            {card.stages.map(stage => <li key={stage.name} className={stage.state}><span>{stage.state === 'done' ? <IconCheck size={11} stroke={3} /> : <i />}</span>{stage.name}</li>)}
          </ol>
        </div>
        <div className="launch-card-stats">
          <div><span>Presale allocation</span><strong>{nf.format(card.allocation)} <small>of {nf.format(card.total)} total supply</small></strong></div>
          <div><span>Raised</span><strong>{nf.format(card.raised)} <small>USDC at {px(card.presalePrice)} USDC</small></strong></div>
        </div>
        <div className="launch-bar" aria-hidden="true"><span style={{ width: `${soldPct}%` }} /></div>
        <div className="launch-open">
          <strong>Market open</strong>
          <div className="launch-open-book">
            <span className="bid">best bid {px(card.bestBid.price)} <small>for {nf.format(card.bestBid.size)}</small></span>
            <span className="mid">spread {px(card.spread)}</span>
            <span className="ask">best ask {px(card.bestAsk.price)} <small>for {nf.format(card.bestAsk.size)}</small></span>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
