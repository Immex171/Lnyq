import Reveal from '../../reveal'
import LaunchVisual from './LaunchVisual'
import { CREATOR_APP_URL, journey } from '../../content'

/** Two columns: the launch visual beside the four steps. */
export default function HowItWorks() {
  return (
    <section className="site-section" id="how-it-works" aria-labelledby="how-title">
      <div className="site-two-col">
        <Reveal className="site-two-col-visual"><LaunchVisual /></Reveal>
        <div className="site-two-col-copy">
          <Reveal as="span" className="site-pill">How it works</Reveal>
          <Reveal as="h2" id="how-title" delay={80}>From idea to active order book.</Reveal>
          <Reveal as="p" className="site-lead" delay={160}>A creator defines a collection, runs its presale, and the successful launch is written into the order book where price forms in public.</Reveal>
          <ol className="site-steps">
            {journey.map((item, index) => (
              <Reveal as="li" delay={200 + index * 90} key={item.step}>
                <span className="site-step-no" aria-hidden="true">{index + 1}</span>
                <div><span className="site-step-label">Step {index + 1} · {item.step}</span><h3>{item.title}</h3><p>{item.text}</p></div>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={600}><a className="site-btn ghost" href={CREATOR_APP_URL}>Create token</a></Reveal>
        </div>
      </div>
    </section>
  )
}
