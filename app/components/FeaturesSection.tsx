'use client'

import { Palette, Zap, BarChart3, Shield, RefreshCw, Headphones } from 'lucide-react'

const services = [
  {
    icon: Palette,
    title: 'Web Design',
    description: 'Beautiful, user-centered design that captures your brand essence and engages your audience.',
  },
  {
    icon: Zap,
    title: 'Development',
    description: 'Lightning-fast, mobile-optimized websites built with the latest technologies.',
  },
  {
    icon: BarChart3,
    title: 'Strategy & Analytics',
    description: 'Data-driven insights to maximize conversions and ROI from your digital presence.',
  },
  {
    icon: Shield,
    title: 'Security & Compliance',
    description: 'Enterprise-grade security, GDPR compliance, and ongoing protection.',
  },
  {
    icon: RefreshCw,
    title: 'Maintenance & Support',
    description: 'Continuous monitoring, updates, and support to keep your site running smoothly.',
  },
  {
    icon: Headphones,
    title: 'Training & Consulting',
    description: 'Expert guidance to help you manage and grow your digital presence.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-base border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white">
            Our Services
          </h2>
          <p className="max-w-2xl mx-auto text-slate-400 text-base sm:text-lg">
            Complete web solutions from strategy through launch and beyond. We handle every aspect of your digital presence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className="group p-6 sm:p-8 rounded-xl border border-slate-800 hover:border-accent/40 bg-surface"
                style={{ transition: 'border-color 300ms, box-shadow 300ms' }}
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:bg-accent/20" style={{ transition: 'background-color 200ms' }}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
