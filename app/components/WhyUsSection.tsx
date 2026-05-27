'use client'

export function WhyUsSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white">
      <div className="text-center mx-auto max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">Why Choose Fast Websites</p>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-950 mb-6">
          Better than a template platform like Squarespace
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Our websites are built around your brand, performance goals, and growth plan—not a prebuilt layout. Here’s why smart businesses choose a dedicated digital partner.
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

      <div className="mt-16 text-center">
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
          When you choose Fast Websites, you get a website designed to grow with your business—not just a polished landing page. That means higher conversions, better flexibility, and a stronger digital foundation.
        </p>
      </div>
    </section>
  )
}
