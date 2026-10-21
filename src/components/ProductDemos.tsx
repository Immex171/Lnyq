import Reveal from '../reveal'
import OrderBookDemo from './demos/OrderBookDemo'
import ChartDemo from './demos/ChartDemo'
import TradeDemo from './demos/TradeDemo'

/** Three small working demos of the product, each playing when it comes into view. */
export default function ProductDemos() {
  return (
    <section className="ledger-section ledger-demos" id="how-lnyq-works" aria-labelledby="demos-title">
      <div className="ledger-demos-head">
        <Reveal as="h2" id="demos-title">See the book work.</Reveal>
        <Reveal as="p" delay={90}>Three pieces of LNYQ in motion, with example data. Each one plays when it comes into view.</Reveal>
      </div>
      <div className="ledger-demos-grid">
        <Reveal delay={120}><OrderBookDemo /></Reveal>
        <Reveal delay={220}><ChartDemo /></Reveal>
        <Reveal delay={320}><TradeDemo /></Reveal>
      </div>
    </section>
  )
}
