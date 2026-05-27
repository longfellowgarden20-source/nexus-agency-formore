import type { Metadata } from 'next'
import { Navigation } from '../components/Navigation'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Explore the full suite of Fast Websites services — web design, development, analytics, SEO, and ongoing support for ambitious brands.',
  alternates: { canonical: 'https://fastwebsites.agency/services' },
}
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
