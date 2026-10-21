import { IconArrowUpRight } from '@tabler/icons-react'
import Reveal from '../../reveal'
import { DOCS_URL, about, facts } from '../../content'

/** About LNYQ, on the front page: what it is, what is being built, how it differs, where it goes, and the terms of the book. */
export default function AboutSection() {
  return (
    <section className="site-section" id="about" aria-labelledby="about-title">
      <div className="site-section-intro">
        <Reveal as="span" className="site-pill">About LNYQ</Reveal>
        <Reveal as="h2" id="about-title" delay={80}>What LNYQ is.</Reveal>
        <Reveal as="p" delay={160}>{about.definition}</Reveal>
      </div>

      <div className="site-cards two">
        {about.mechanism.map((item, index) => (
          <Reveal className="site-card" delay={120 + index * 80} key={item.title}>
            <span className="site-card-index">{String(index + 1).padStart(2, '0')}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </Reveal>
        ))}
      </div>

      <div className="site-subhead">
        <Reveal as="span" className="site-pill">What we are building</Reveal>
        <Reveal as="h3" className="site-h3" delay={80}>Three products, one book.</Reveal>
      </div>
      <ul className="site-products">
        {about.building.map((item, index) => (
          <Reveal as="li" className="site-product" delay={100 + index * 80} key={item.title}>
            <div className="site-product-head">
              <h3>{item.href ? <a href={item.href}>{item.title} <IconArrowUpRight size={15} aria-hidden="true" /></a> : item.title}</h3>
              <span className={`site-status${item.status === 'Coming soon' ? ' soon' : ''}`}><i />{item.status}</span>
            </div>
            <p>{item.text}</p>
          </Reveal>
        ))}
      </ul>

      <div className="site-two-col narrow">
        <div className="site-two-col-copy">
          <Reveal as="span" className="site-pill">How LNYQ is different</Reveal>
          <Reveal as="h3" className="site-h3" delay={80}>Stated as what LNYQ is and does.</Reveal>
          <ul className="site-points">
            {about.different.map((point, index) => <Reveal as="li" delay={120 + index * 80} key={point}>{point}</Reveal>)}
          </ul>
        </div>
        <Reveal className="site-card site-facts" delay={160}>
          <h3>Terms of the book</h3>
          <dl>{facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
          <a className="site-link" href={DOCS_URL} target="_blank" rel="noreferrer">Read the protocol docs <IconArrowUpRight size={13} aria-hidden="true" /></a>
        </Reveal>
      </div>

      <div className="site-subhead">
        <Reveal as="span" className="site-pill">Where this goes</Reveal>
      </div>
      <ol className="site-cards three roadmap">
        {about.roadmap.map((item, index) => (
          <Reveal as="li" className="site-card" delay={100 + index * 90} key={item.phase}>
            <span className={`site-status${item.state === 'Now' ? '' : ' soon'}`}><i />{item.phase} · {item.state}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </Reveal>
        ))}
      </ol>
      <Reveal as="p" className="site-note" delay={200}>No mainnet date, token or chain timeline is announced. Everything marked Now runs on Solana devnet today.</Reveal>
    </section>
  )
}
