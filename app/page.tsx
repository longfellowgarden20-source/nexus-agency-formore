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
import ChatWidget from './components/ChatWidget'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <ClientLogoConveyor />

      {/* AI Chat callout section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left — explanation */}
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">24/7 AI Assistant</p>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-950 leading-tight mb-6">
                Questions at midnight?<br />
                <span className="text-accent">We&apos;re always here.</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                The chat bubble in the corner is a real AI assistant that knows everything about Fast Websites — our pricing, process, turnaround times, and what to expect. Ask it anything, any time.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { q: '"How much does a website cost?"', a: 'Gets you real pricing, not a "contact us for a quote" runaround.' },
                  { q: '"How long does it take?"', a: 'Explains our 48-hour preview → live site timeline.' },
                  { q: '"What if I don\'t like it?"', a: 'Walks you through our revision policy and guarantees.' },
                  { q: '"Do you work with [my industry]?"', a: 'Confirms yes and gives relevant examples.' },
                ].map(({ q, a }, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-sm font-bold">?</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{q}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — fake chat preview */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl" style={{ background: '#0a0f1a' }}>
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10" style={{ background: '#0f172a' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="text-sm font-semibold text-white">Fast Websites AI</span>
                <span className="ml-auto text-xs text-slate-500">Always online</span>
              </div>
              {/* Messages */}
              <div className="p-5 flex flex-col gap-4">
                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">AI</div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-white max-w-[80%]">
                    Hey! I&apos;m here to help. Ask me anything about our services, pricing, or how to get started. ✌️
                  </div>
                </div>
                <div className="flex gap-3 items-start flex-row-reverse">
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-300">You</div>
                  <div className="rounded-2xl rounded-tr-none px-4 py-3 text-sm text-white max-w-[80%]" style={{ background: '#0ea5e9' }}>
                    How quickly can you build my site?
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">AI</div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-white max-w-[80%]">
                    Fast! We send you a full working preview within <span className="text-accent font-semibold">48 hours</span> — no payment needed upfront. If you like it, we go live on your domain within the week. 🚀
                  </div>
                </div>
                <div className="flex gap-3 items-start flex-row-reverse">
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-300">You</div>
                  <div className="rounded-2xl rounded-tr-none px-4 py-3 text-sm text-white max-w-[80%]" style={{ background: '#0ea5e9' }}>
                    What does it cost?
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">AI</div>
                  <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-white max-w-[80%]">
                    Our plans start at <span className="text-accent font-semibold">$97/mo</span> — includes hosting, updates, and support. No big upfront fee. Want me to walk you through what&apos;s included?
                  </div>
                </div>
                {/* Input bar */}
                <div className="flex items-center gap-2 mt-2 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                  <span className="text-sm text-slate-500 flex-1">Ask anything…</span>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0ea5e9' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
      <ChatWidget />
    </main>
  )
}
