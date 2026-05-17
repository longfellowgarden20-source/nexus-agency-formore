import Link from 'next/link'
import { Navigation } from '../components/Navigation'
import { Footer } from '../components/Footer'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-accent font-semibold mb-4">About Nexus</p>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-950 mb-6">
            Digital product design and development for ambitious brands
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
            Nexus helps fast-growing companies launch modern, high-converting websites.
            We combine strategic design, development, and analytics to turn traffic into loyal customers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition">
              Work with us
            </Link>
            <Link href="/" className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-slate-300 text-slate-900 text-sm font-semibold hover:bg-slate-50 transition">
              Back to homepage
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {[
            {
              title: 'Strategy first',
              body: 'We start with research and user insights so every website is designed to move your business forward.',
            },
            {
              title: 'Built for growth',
              body: 'Performance, accessibility, and conversions are baked into every project from day one.',
            },
            {
              title: 'Long-term partner',
              body: 'Ongoing support, analytics, and updates keep your website strong after launch.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-200 p-8 bg-slate-50">
              <h2 className="text-xl font-semibold text-slate-950 mb-3">{item.title}</h2>
              <p className="text-slate-600 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}
