import { Link } from 'react-router-dom'
import Reveal from '../../reveal'
import { build } from '../../content'

/** Build on LNYQ: who is welcome and the way in. The Ecosystem page lists who is already here. */
export default function BuildSection() {
  return (
    <section className="site-section" id="build" aria-labelledby="build-title">
      <div className="site-section-intro">
        <Reveal as="h2" id="build-title">{build.title}</Reveal>
        <Reveal as="p" delay={80}>{build.copy}</Reveal>
      </div>
      <div className="site-cards three tiles">
        {build.tiles.map((tile, index) => (
          <Reveal className="site-tile" delay={100 + index * 70} key={tile.title}>
            <h3>{tile.title}</h3>
            <p>{tile.text}</p>
          </Reveal>
        ))}
      </div>
      <Reveal className="site-center-actions" delay={300}>
        <Link className="site-btn primary" to="/ecosystem#submit">{build.button}</Link>
      </Reveal>
    </section>
  )
}
