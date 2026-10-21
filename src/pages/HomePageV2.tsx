import Hero from '../components/site/Hero'
import DashboardShowcase from '../components/site/DashboardShowcase'
import FeatureSection from '../components/site/FeatureSection'
import HowItWorks from '../components/site/HowItWorks'
import AboutSection from '../components/site/AboutSection'
import EcosystemTeaser from '../components/site/EcosystemTeaser'
import AccessSection from '../components/site/AccessSection'

export default function HomePageV2() {
  return (
    <main className="site-main">
      <Hero />
      <DashboardShowcase />
      <FeatureSection />
      <HowItWorks />
      <AboutSection />
      <EcosystemTeaser />
      <AccessSection />
    </main>
  )
}
