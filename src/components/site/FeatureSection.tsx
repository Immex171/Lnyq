import Reveal from '../../reveal'
import OrderBookDemo from '../demos/OrderBookDemo'
import ChartDemo from '../demos/ChartDemo'
import TradeDemo from '../demos/TradeDemo'

/** Centred introduction, then three feature cards; each card is a working demo of the product. */
export default function FeatureSection() {
  return (
    <section className="site-section" id="products" aria-labelledby="features-title">
      <div className="site-section-intro">
        <Reveal as="span" className="site-pill">How the book works</Reveal>
        <Reveal as="h2" id="features-title" delay={80}>One price per collection.<br />Formed in public.</Reveal>
        <Reveal as="p" delay={160}>Orders rest on a central limit order book with price-time priority. Fills become candles. Every fill settles on Solana in USDC, in whole NFTs.</Reveal>
      </div>
      <div className="site-cards three">
        <Reveal delay={120}><OrderBookDemo /></Reveal>
        <Reveal delay={220}><ChartDemo /></Reveal>
        <Reveal delay={320}><TradeDemo /></Reveal>
      </div>
    </section>
  )
}
