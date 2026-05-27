'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-surface border-t border-slate-800">
      <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
          Ready to launch your dream website?
        </h2>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
          Let's talk about your project and how we can help your business grow online.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2">
          <Link
            href="/contact"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-accent text-black rounded-lg font-semibold hover:bg-accent-dark flex items-center justify-center gap-2 text-sm sm:text-base"
            style={{ transition: 'background-color 200ms' }}
          >
            Request a Proposal
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/services"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border border-slate-600 text-slate-200 rounded-lg font-medium hover:border-accent/50 hover:text-accent text-sm sm:text-base"
            style={{ transition: 'border-color 200ms, color 200ms' }}
          >
            View Services
          </Link>
        </div>
      </div>
    </section>
  )
}
