'use client'

import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Website Refresh',
    price: '2,500',
    description: 'Perfect for businesses that need a modern online presence.',
    features: [
      '5-8 page website',
      'Mobile-optimized design',
      'Basic SEO setup',
      'Contact forms',
      '1 round of revisions',
      'Email support',
      '3 months free updates',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Custom Website',
    price: '8,500',
    description: 'For growing businesses that want conversion-focused design.',
    features: [
      'Unlimited pages',
      'Advanced design & UX',
      'CMS integration',
      'E-commerce ready',
      'Analytics setup',
      'Unlimited revisions',
      '6 months free support',
      'Performance optimization',
    ],
    cta: 'Start Project',
    featured: true,
  },
  {
    name: 'Enterprise Solution',
    price: 'Custom',
    description: 'For large organizations with complex needs and scale.',
    features: [
      'Fully custom platform',
      'Advanced integrations',
      'Dedicated account manager',
      'Ongoing maintenance plan',
      'Priority support',
      'Training & documentation',
      'Performance guarantee',
      'Monthly optimization reports',
    ],
    cta: 'Schedule Consultation',
    featured: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="w-full py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-950">
            Our Packages
          </h2>
          <p className="max-w-2xl mx-auto text-slate-600 text-base sm:text-lg">
            Transparent pricing for every stage of your digital journey. All packages include free consultation.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl transition-all duration-300 ${
                plan.featured
                  ? 'border-2 border-accent bg-white shadow-xl scale-100 md:scale-105'
                  : 'border border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {/* Featured badge */}
              {plan.featured && (
                <div className="px-4 sm:px-6 py-2 bg-accent text-white text-xs sm:text-sm font-semibold text-center">
                  Most Popular
                </div>
              )}

              {/* Card content */}
              <div className="p-6 sm:p-8 flex flex-col h-full">
                {/* Plan name and description */}
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-950 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-bold text-slate-950">
                      {plan.price === 'Custom' ? 'Custom' : `$${plan.price}`}
                    </span>
                    {plan.price !== 'Custom' && (
                      <span className="text-sm sm:text-base text-slate-600">/month</span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 sm:py-3.5 rounded-lg font-medium mb-8 transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm sm:text-base ${
                    plan.featured
                      ? 'bg-accent text-white hover:bg-accent-dark'
                      : 'border border-slate-300 text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {plan.cta}
                </button>

                {/* Features list */}
                <div className="space-y-3 sm:space-y-4 flex-1">
                  {plan.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-3 sm:gap-4">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base text-slate-700">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-slate-600 text-sm sm:text-base">
            Not sure which package is right? <span className="font-semibold">Schedule a free 30-min consultation</span> to discuss your needs.
          </p>
        </div>
      </div>
    </section>
  )
}
