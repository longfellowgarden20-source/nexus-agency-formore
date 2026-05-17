import { Navigation } from '../components/Navigation'
import { PricingSection } from '../components/PricingSection'
import { CTASection } from '../components/CTASection'
import { Footer } from '../components/Footer'

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  )
}
