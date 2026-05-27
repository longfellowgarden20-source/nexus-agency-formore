import type { Metadata } from 'next'
import { Navigation } from '../components/Navigation'

export const metadata: Metadata = {
  title: 'Why Fast Websites',
  description: 'See why Fast Websites outperforms generic website builders. Real performance, real results — not a Squarespace template.',
  alternates: { canonical: 'https://fastwebsites.agency/why-us' },
}
import { WhyUsSection } from '../components/WhyUsSection'
import { CTASection } from '../components/CTASection'
import { Footer } from '../components/Footer'

export default function WhyUsPage() {
  return (
    <main className="min-h-screen bg-base">
      <Navigation />
      <WhyUsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
