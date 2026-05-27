import type { Metadata } from 'next'
import Link from 'next/link'
import { Navigation } from './components/Navigation'

export const metadata: Metadata = {
  title: 'Fast Websites — Award-Winning Web Agency',
  description: 'We build beautiful, high-performance websites that drive results. Digital design & development for ambitious brands.',
  alternates: { canonical: 'https://fastwebsites.agency' },
}
import { HeroSection } from './components/HeroSection'
import { ClientLogoConveyor } from './components/ClientLogoConveyor'
import { Footer } from './components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <ClientLogoConveyor />

      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">Explore Fast Websites</p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-950">
              Choose the page that matches your next step.
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
              Learn about our process, review pricing, and get in touch with the team on dedicated pages built for each part of your journey.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/about" className="group block rounded-3xl border border-slate-200 bg-white p-8 hover:border-accent/50 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-slate-950 mb-3">About Fast Websites</h3>
              <p className="text-slate-600">Discover who we are, our approach to digital design, and why clients trust us.</p>
            </Link>
            <Link href="/services" className="group block rounded-3xl border border-slate-200 bg-white p-8 hover:border-accent/50 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-slate-950 mb-3">Services</h3>
              <p className="text-slate-600">See the full suite of web design, development, analytics, and support services we offer.</p>
            </Link>
            <Link href="/pricing" className="group block rounded-3xl border border-slate-200 bg-white p-8 hover:border-accent/50 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-slate-950 mb-3">Pricing</h3>
              <p className="text-slate-600">Browse our transparent packages and find the right option for your business.</p>
            </Link>
            <Link href="/why-us" className="group block rounded-3xl border border-slate-200 bg-white p-8 hover:border-accent/50 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-slate-950 mb-3">Why Us</h3>
              <p className="text-slate-600">See why Fast Websites delivers stronger results than a generic Squarespace site.</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
