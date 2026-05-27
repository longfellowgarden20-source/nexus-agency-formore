'use client'

// Infinite scrolling logo/image conveyor belt.
// Drop images into the `items` array below — use client logos, portfolio screenshots, or any images.
// Adapts automatically for mobile (smaller cards, same animation).

const items = [
  { id: '1', src: 'https://placehold.co/800x520/0f172a/4f6ef7?text=Mike%27s+Plumbing', alt: "Mike's Plumbing" },
  { id: '2', src: 'https://placehold.co/800x520/1e293b/f9a8d4?text=Luxe+Hair+Salon', alt: 'Luxe Hair Salon' },
  { id: '3', src: 'https://placehold.co/800x520/1c1917/fb923c?text=Pro+Roofing+Co', alt: 'Pro Roofing Co' },
  { id: '4', src: 'https://placehold.co/800x520/052e16/4ade80?text=Green+Lawn+Care', alt: 'Green Lawn Care' },
  { id: '5', src: 'https://placehold.co/800x520/1e1e2e/c084fc?text=Bella+Nail+Studio', alt: 'Bella Nail Studio' },
  { id: '6', src: 'https://placehold.co/800x520/0c4a6e/38bdf8?text=City+HVAC+Services', alt: 'City HVAC Services' },
  { id: '7', src: 'https://placehold.co/800x520/4f6ef7/ffffff?text=Elite+Auto+Detailing', alt: 'Elite Auto Detailing' },
  { id: '8', src: 'https://placehold.co/800x520/0f172a/fcd34d?text=Sunrise+Cleaning+Co', alt: 'Sunrise Cleaning Co' },
]

export function ClientLogoConveyor() {
  if (items.length < 2) return null

  const doubled = [...items, ...items]

  const desktopCardW = 180
  const mobileCardW = 120
  const gap = 16
  const desktopTotalW = items.length * (desktopCardW + gap)
  const mobileTotalW = items.length * (mobileCardW + gap)

  return (
    <section className="w-full py-14 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-2">Who We Work With</p>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-950">
          Built for local service businesses
        </h2>
        <p className="mt-3 text-slate-500 text-sm max-w-xl mx-auto">
          Plumbers, salons, roofers, landscapers, cleaners — if you run a local service business, we build sites that get you found and get you booked.
        </p>
      </div>

      <style>{`
        @keyframes conveyor-left-desktop {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${desktopTotalW}px); }
        }
        @keyframes conveyor-left-mobile {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${mobileTotalW}px); }
        }
      `}</style>

      {/* Mobile */}
      <div
        className="sm:hidden w-full overflow-hidden"
        style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}
      >
        <div
          className="flex gap-4"
          style={{
            animation: 'conveyor-left-mobile 28s linear infinite',
            width: 'max-content',
            willChange: 'transform',
          }}
        >
          {doubled.map((item, i) => (
            <div
              key={`m-${item.id}-${i}`}
              className="relative flex-shrink-0 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center"
              style={{ width: mobileCardW, height: Math.round(mobileCardW * 0.65) }}
            >
              <img
                src={item.src}
                alt={item.alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop */}
      <div
        className="hidden sm:block w-full overflow-hidden"
        style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}
      >
        <div
          className="flex gap-4"
          style={{
            animation: 'conveyor-left-desktop 32s linear infinite',
            width: 'max-content',
            willChange: 'transform',
          }}
        >
          {doubled.map((item, i) => (
            <div
              key={`d-${item.id}-${i}`}
              className="relative flex-shrink-0 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center"
              style={{ width: desktopCardW, height: Math.round(desktopCardW * 0.65) }}
            >
              <img
                src={item.src}
                alt={item.alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
