import { Link } from 'react-router-dom'
import { IconArrowUp, IconArrowUpRight } from '@tabler/icons-react'
import { CREATOR_APP_URL, DEX_APP_URL, DOCS_URL, PRIVACY_URL, SUPPORT_EMAIL, TERMS_URL, TWITTER_URL, closing, footer } from '../../content'

/** The wide panel above the footer, the wordmark cut by the footer's rule, then a simple footer with a back-to-top action. */
export default function SiteClosing() {
  return (
    <div className="site-closing">
      <section className="site-cta-panel" aria-labelledby="cta-title">
        <h2 id="cta-title">{closing.title}</h2>
        <p>{closing.copy}</p>
        <div className="site-cta-actions">
          <a className="site-btn primary" href={DEX_APP_URL}>Launch app</a>
          <a className="site-btn ghost" href="/#access">Request access</a>
        </div>
      </section>
      <div className="site-wordmark" aria-hidden="true">
        <span>LNYQ</span>
      </div>
      <footer className="site-footer">
        <div className="site-footer-row">
          <Link className="site-brand" to="/"><img src="/Lnyq.png" alt="" width={24} height={24} /><span>LNYQ</span></Link>
          <nav className="site-footer-links" aria-label="Footer">
            <a href={DEX_APP_URL}>Launch app</a>
            <a href="/#launch">Launchpad</a>
            <a href={CREATOR_APP_URL}>Create token</a>
            <a href="/#about">About</a>
            <Link to="/ecosystem">Ecosystem</Link>
            <a href={DOCS_URL}>Docs</a>
            <a href={TERMS_URL}>Terms</a>
            <a href={PRIVACY_URL}>Privacy</a>
            <a href={`mailto:${SUPPORT_EMAIL}`}>Support</a>
          </nav>
          <div className="site-footer-social">
            <a href={TWITTER_URL} target="_blank" rel="noreferrer">@LnyqProtocol <IconArrowUpRight size={12} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="site-footer-foot">
          <span>{footer.copyright}</span>
          <a className="site-top" href="#top" aria-label="Back to top"><IconArrowUp size={14} /> Top</a>
        </div>
      </footer>
    </div>
  )
}
