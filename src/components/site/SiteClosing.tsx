import { Link } from 'react-router-dom'
import { IconArrowUp, IconArrowUpRight } from '@tabler/icons-react'
import { CREATOR_APP_URL, DEX_APP_URL, DOCS_URL, ECOSYSTEM_EMAIL, LAUNCHPAD_URL, SUPPORT_EMAIL, TWITTER_URL } from '../../content'

/** The wide gradient panel above the footer, then a simple footer with a back-to-top action. */
export default function SiteClosing() {
  return (
    <div className="site-closing">
      <section className="site-cta-panel" aria-labelledby="cta-title">
        <span className="site-pill on-gradient">Get started</span>
        <h2 id="cta-title">Your next market starts here.</h2>
        <p>Open the order book, or launch a collection into one.</p>
        <div className="site-cta-actions">
          <a className="site-btn light" href={DEX_APP_URL}>Launch app</a>
          <a className="site-btn outline-light" href={CREATOR_APP_URL}>Create token</a>
        </div>
      </section>
      <footer className="site-footer">
        <div className="site-footer-row">
          <Link className="site-brand" to="/"><img src="/Lnyq.png" alt="" width={24} height={24} /><span>LNYQ</span></Link>
          <nav className="site-footer-links" aria-label="Footer">
            <a href={DEX_APP_URL}>Launch app</a><a href={LAUNCHPAD_URL}>Launchpad</a><a href={CREATOR_APP_URL}>Create token</a><a href="/#about">About</a><Link to="/ecosystem">Ecosystem</Link><a href={DOCS_URL} target="_blank" rel="noreferrer">Docs</a>
          </nav>
          <div className="site-footer-social">
            <a href={TWITTER_URL} target="_blank" rel="noreferrer">@LnyqProtocol <IconArrowUpRight size={12} aria-hidden="true" /></a>
            <a href={`mailto:${ECOSYSTEM_EMAIL}`}>Ecosystem</a>
            <a href={`mailto:${SUPPORT_EMAIL}`}>Support</a>
          </div>
        </div>
        <div className="site-footer-foot">
          <span>© 2026 LNYQ · Solana devnet · Testnet, no real assets</span>
          <a className="site-top" href="#top" aria-label="Back to top"><IconArrowUp size={14} /> Top</a>
        </div>
      </footer>
    </div>
  )
}
