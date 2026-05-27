import type { Metadata } from 'next'
import { Navigation } from '../components/Navigation'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Fast Websites. Tell us about your project and we will respond with a custom plan.',
  alternates: { canonical: 'https://fastwebsites.agency/contact' },
  robots: { index: true, follow: true },
}
import { Footer } from '../components/Footer'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-accent font-semibold mb-4">Get in touch</p>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-950 mb-6">
              Let’s build something exceptional together
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Whether you need a new website, redesign, or strategy refresh, our team is ready to help.
              Share the details of your project and we’ll respond with a custom plan.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <form className="space-y-6">
              <label className="block">
                <span className="text-sm font-medium text-slate-800">Name</span>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-800">Email</span>
                <input
                  type="email"
                  placeholder="jane@example.com"
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-800">Phone <span className="text-slate-400 font-normal">(optional)</span></span>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-800">Message</span>
                <textarea
                  rows={6}
                  placeholder="Tell us about your project"
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-dark transition"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
