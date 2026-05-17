import { Navigation } from '../components/Navigation'
import { FeaturesSection } from '../components/FeaturesSection'
import { CTASection } from '../components/CTASection'
import { Footer } from '../components/Footer'

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  )
}
