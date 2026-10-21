import { Link } from 'react-router-dom'
import Reveal from '../../reveal'
import AccessForm from '../AccessForm'
import { ECOSYSTEM_EMAIL } from '../../content'

export default function AccessSection() {
  return (
    <section className="site-section" id="access" aria-labelledby="access-title">
      <div className="site-two-col narrow">
        <div className="site-two-col-copy">
          <Reveal as="span" className="site-pill">Private testnet</Reveal>
          <Reveal as="h2" id="access-title" delay={80}>Get early access to the market.</Reveal>
          <Reveal as="p" className="site-lead" delay={160}>LNYQ is in private testnet on Solana devnet. A wallet that has signed in before enters directly. A new wallet needs an access code.</Reveal>
          <Reveal as="p" className="site-note" delay={220}>Building a tool, an aggregator or a market maker on LNYQ? <Link to="/ecosystem#submit">Submit your project</Link> or write to <a href={`mailto:${ECOSYSTEM_EMAIL}`}>{ECOSYSTEM_EMAIL}</a>.</Reveal>
        </div>
        <Reveal className="site-card site-access-card" delay={160}><AccessForm /></Reveal>
      </div>
    </section>
  )
}
