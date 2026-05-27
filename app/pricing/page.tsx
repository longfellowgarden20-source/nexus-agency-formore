import type { Metadata } from 'next'
import { Navigation } from '../components/Navigation'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Transparent website design and development pricing. Browse Fast Websites packages and find the right plan for your business.',
  alternates: { canonical: 'https://fastwebsites.agency/pricing' },
}
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
