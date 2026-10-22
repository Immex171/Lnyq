import Reveal from '../../reveal'
import AccessForm from '../AccessForm'
import { access } from '../../content'

export default function AccessSection() {
  return (
    <section className="site-section" id="access" aria-labelledby="access-title">
      <div className="site-two-col narrow">
        <div className="site-two-col-copy">
          <Reveal as="h2" id="access-title">{access.title}</Reveal>
          <Reveal as="p" className="site-lead" delay={80}>{access.copy}</Reveal>
        </div>
        <Reveal className="site-card site-access-card" delay={120}><AccessForm /></Reveal>
      </div>
    </section>
  )
}
