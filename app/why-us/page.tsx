import { Navigation } from '../components/Navigation'
import { WhyUsSection } from '../components/WhyUsSection'
import { CTASection } from '../components/CTASection'
import { Footer } from '../components/Footer'

export default function WhyUsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <WhyUsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
