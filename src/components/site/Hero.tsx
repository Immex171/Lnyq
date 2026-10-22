import Reveal from '../../reveal'
import { DEX_APP_URL, hero } from '../../content'

/** Centred hero: the headline, one line of copy, two actions. Nothing else sits between it and the terminal. */
export default function Hero() {
  return (
    <section className="site-hero" aria-labelledby="hero-title">
      <div className="site-hero-field" aria-hidden="true" />
      <Reveal as="h1" id="hero-title">{hero.title}</Reveal>
      <Reveal as="p" className="site-hero-copy" delay={100}>{hero.copy}</Reveal>
      <Reveal className="site-hero-actions" delay={200}>
        <a className="site-btn primary" href={DEX_APP_URL}>{hero.primary}</a>
        <a className="site-btn ghost" href="#access">{hero.secondary}</a>
      </Reveal>
    </section>
  )
}
