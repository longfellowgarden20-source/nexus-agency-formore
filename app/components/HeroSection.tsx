'use client'

import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-white via-slate-50 to-white">
      {/* Decorative background element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-xs sm:text-sm font-medium">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
            Creative Web Solutions Since 2018
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-950 leading-tight">
            Stunning websites that
            <br className="hidden sm:block" />
            <span className="text-accent">convert visitors into customers</span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            We design and build beautiful, high-performance websites that capture attention and drive real business results. From concept to launch, we're with you every step.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base">
              Start Your Project
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border border-slate-300 text-slate-900 rounded-lg font-medium hover:bg-slate-50 transition-all duration-200 text-sm sm:text-base">
              View Our Work
            </button>
          </div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-4 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span>⭐ 4.9/5 from 50+ clients</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-300"></div>
            <span>Trusted by brands like Nike, Airbnb, Tesla</span>
          </div>
        </div>
      </div>
    </section>
  )
}
