'use client'

import { Check, X, Minus } from 'lucide-react'

const rows = [
  { feature: 'Custom design (not a template)', us: 'full', squarespace: 'none', diy: 'partial' },
  { feature: 'Performance optimized (Core Web Vitals)', us: 'full', squarespace: 'partial', diy: 'none' },
  { feature: 'SEO built in from day one', us: 'full', squarespace: 'partial', diy: 'none' },
  { feature: 'Mobile-first responsive', us: 'full', squarespace: 'partial', diy: 'none' },
  { feature: 'Custom integrations (CRM, booking, etc.)', us: 'full', squarespace: 'none', diy: 'partial' },
  { feature: 'Ongoing strategy & support', us: 'full', squarespace: 'none', diy: 'none' },
  { feature: 'Scales with your business', us: 'full', squarespace: 'none', diy: 'partial' },
  { feature: 'No platform lock-in', us: 'full', squarespace: 'none', diy: 'full' },
]

type Status = 'full' | 'partial' | 'none'

function Cell({ status }: { status: Status }) {
  if (status === 'full') return (
    <div className="flex justify-center">
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent/15 text-accent">
        <Check className="w-4 h-4" strokeWidth={2.5} />
      </span>
    </div>
  )
  if (status === 'partial') return (
    <div className="flex justify-center">
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-400">
        <Minus className="w-4 h-4" strokeWidth={2.5} />
      </span>
    </div>
  )
  return (
    <div className="flex justify-center">
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-50 text-red-400">
        <X className="w-4 h-4" strokeWidth={2.5} />
      </span>
    </div>
  )
}

export function WhyUsSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white">
      <div className="text-center mx-auto max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">Why Choose Fast Websites</p>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-950 mb-6">
          Better than a template platform like Squarespace
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Our websites are built around your brand, performance goals, and growth plan—not a prebuilt layout. Here's why smart businesses choose a dedicated digital partner.
        </p>
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        {[
          {
            title: 'Custom experiences, not templates',
            description:
              'We create websites that reflect your brand voice, user journey, and conversion goals. Squarespace offers editable templates, but not a truly bespoke experience.',
          },
          {
            title: 'Speed and SEO built in',
            description:
              'Every page is optimized for fast loading, accessibility, and search visibility. Templates often include extra code and features you never need.',
          },
          {
            title: 'Scalable systems and integrations',
            description:
              'From booking flows to CRM, e-commerce, and analytics, we connect the tools you need. A template platform can limit how far your business can grow.',
          },
          {
            title: 'Ongoing support and strategy',
            description:
              'You get a team that helps refine messaging, track results, and iterate. A generic website builder does not offer a dedicated growth partner.',
          },
        ].map((item) => (
          <div key={item.title} className="rounded-3xl border border-slate-200 p-8 shadow-sm bg-slate-50">
            <h2 className="text-2xl font-semibold text-slate-950 mb-3">{item.title}</h2>
            <p className="text-slate-600 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="mt-20">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-950 text-center mb-10">
          How we stack up
        </h2>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left px-6 py-5 text-slate-500 font-medium w-1/2">Feature</th>
                <th className="px-6 py-5 text-center w-[16%]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-white font-bold text-base">✦</span>
                    <span className="font-semibold text-slate-950 text-xs sm:text-sm">Fast Websites</span>
                  </div>
                </th>
                <th className="px-6 py-5 text-center w-[16%]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-200 text-slate-500 font-bold text-xs">SQ</span>
                    <span className="font-medium text-slate-500 text-xs sm:text-sm">Squarespace</span>
                  </div>
                </th>
                <th className="px-6 py-5 text-center w-[16%]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-200 text-slate-500 font-bold text-xs">DIY</span>
                    <span className="font-medium text-slate-500 text-xs sm:text-sm">DIY Build</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-slate-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
                >
                  <td className="px-6 py-4 text-slate-700 font-medium">{row.feature}</td>
                  <td className="px-6 py-4"><Cell status={row.us as Status} /></td>
                  <td className="px-6 py-4"><Cell status={row.squarespace as Status} /></td>
                  <td className="px-6 py-4"><Cell status={row.diy as Status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center gap-6 mt-5 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-accent" /> Included</span>
          <span className="flex items-center gap-1.5"><Minus className="w-3.5 h-3.5 text-slate-400" /> Partial</span>
          <span className="flex items-center gap-1.5"><X className="w-3.5 h-3.5 text-red-400" /> Not available</span>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
          When you choose Fast Websites, you get a website designed to grow with your business—not just a polished landing page. That means higher conversions, better flexibility, and a stronger digital foundation.
        </p>
      </div>
    </section>
  )
}
