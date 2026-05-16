'use client'

import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accent via-accent to-accent-dark">
      <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
          Ready to launch your dream website?
        </h2>
        <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto">
          Let's talk about your project and how we can help your business grow online.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2">
          <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-accent rounded-lg font-medium hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base">
            Request a Proposal
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-all duration-200 text-sm sm:text-base">
            View Case Studies
          </button>
        </div>
      </div>
    </section>
  )
}
