'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-base">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] items-center">
          <div className="text-center lg:text-left space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-xs sm:text-sm font-medium border border-accent/20">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              Creative Web Solutions Since 2018
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
              Stunning websites that
              <br className="hidden sm:block" />
              <span className="text-accent">convert visitors into customers</span>
            </h1>

            <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-slate-400 leading-relaxed">
              We design and build beautiful, high-performance websites that capture attention and drive real business results. From concept to launch, we're with you every step.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-accent text-base font-semibold text-black rounded-lg hover:bg-accent-dark flex items-center justify-center gap-2 text-sm sm:text-base"
                style={{ transition: 'transform 200ms, background-color 200ms' }}
              >
                Start Your Project
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border border-slate-600 text-slate-200 rounded-lg font-medium hover:border-accent/50 hover:text-accent text-sm sm:text-base"
                style={{ transition: 'border-color 200ms, color 200ms' }}
              >
                View Our Services
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 pt-4 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span>⭐ 4.9/5 from 50+ clients</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-700"></div>
              <span>Trusted by brands like Nike, Airbnb, Tesla</span>
            </div>
          </div>

          <div className="mx-auto w-full max-w-3xl rounded-[2rem] border border-slate-700 bg-surface shadow-[0_40px_120px_-40px_rgba(163,230,53,0.15)] overflow-hidden">
            <Image
              priority
              src="/hero-lcp.svg"
              alt="Modern website design preview on a laptop screen"
              width={1200}
              height={720}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
