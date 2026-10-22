import ParticleWave from '../components/site/ParticleWave'
import Hero from '../components/site/Hero'
import TerminalSection from '../components/site/TerminalSection'
import PerpsSection from '../components/site/PerpsSection'
import LaunchSection from '../components/site/LaunchSection'
import VisionSection from '../components/site/VisionSection'
import BuildSection from '../components/site/BuildSection'
import AccessSection from '../components/site/AccessSection'

export default function HomePageV2() {
  return (
    <main className="site-main">
      <ParticleWave />
      <Hero />
      <TerminalSection />
      <PerpsSection />
      <LaunchSection />
      <VisionSection />
      <BuildSection />
      <AccessSection />
    </main>
  )
}
