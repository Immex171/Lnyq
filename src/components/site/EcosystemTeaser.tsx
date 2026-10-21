import { Link } from 'react-router-dom'
import { IconArrowUpRight } from '@tabler/icons-react'
import Reveal from '../../reveal'
import { categories, projectsIn } from '../../ecosystem'

/** The ecosystem, on the front page: categories and a way in for builders. */
export default function EcosystemTeaser() {
  return (
    <section className="site-section" id="ecosystem" aria-labelledby="eco-title">
      <div className="site-section-intro">
        <Reveal as="span" className="site-pill">Ecosystem</Reveal>
        <Reveal as="h2" id="eco-title" delay={80}>Built on the book.</Reveal>
        <Reveal as="p" delay={160}>Everything that runs on, trades on, quotes on or reads from LNYQ, starting with the protocol's own products. Projects building on LNYQ are added as they ship.</Reveal>
      </div>
      <div className="site-cards three">
        {categories.map((category, index) => {
          const count = projectsIn(category.id).length
          return (
            <Reveal className="site-card compact" delay={100 + index * 70} key={category.id}>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span className="site-card-meta">{count ? `${count} listed` : 'Open for submissions'}</span>
            </Reveal>
          )
        })}
      </div>
      <Reveal className="site-center-actions" delay={300}>
        <Link className="site-btn ghost" to="/ecosystem">Explore the ecosystem <IconArrowUpRight size={15} aria-hidden="true" /></Link>
        <Link className="site-btn primary" to="/ecosystem#submit">Submit project</Link>
      </Reveal>
    </section>
  )
}
