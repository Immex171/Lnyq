import Reveal from '../../reveal'
import { CREATOR_APP_URL, DEX_APP_URL } from '../../content'

/** Centred hero: the existing message, a description, two actions, and badges that state real deployment facts. */
export default function Hero() {
  return (
    <section className="site-hero" aria-labelledby="hero-title">
      <Reveal as="span" className="site-pill">Private testnet on Solana devnet</Reveal>
      <Reveal as="h1" id="hero-title" delay={80}>Liquidity, engineered<br />for digital assets.</Reveal>
      <Reveal as="p" className="site-hero-copy" delay={160}>LNYQ is a central limit order book for NFT collections. One price per collection, formed in public from bids and asks, settled on-chain in USDC.</Reveal>
      <Reveal className="site-hero-actions" delay={240}>
        <a className="site-btn primary" href={DEX_APP_URL}>Launch app</a>
        <a className="site-btn ghost" href={CREATOR_APP_URL}>Create token</a>
      </Reveal>
      <Reveal className="site-hero-badges" delay={320} aria-label="Deployment">
        <span className="site-hero-badges-label">Running on</span>
        <span className="site-badge"><i className="site-badge-dot" />Solana devnet</span>
        <span className="site-badge">USDC settlement</span>
        <span className="site-badge">Compressed NFTs via Bubblegum</span>
      </Reveal>
    </section>
  )
}
