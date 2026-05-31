'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/why-us', label: 'Why Us' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 border-b border-slate-200 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0" onClick={() => setIsOpen(false)}>
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-base">
                ✦
              </div>
              <span className="font-display text-lg font-bold text-slate-900">
                Fast Websites
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {links.map(({ href, label }) => (
                <Link key={href} href={href} className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  {label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/contact" className="px-4 py-2 text-sm text-slate-700 hover:text-slate-900 font-medium transition-colors">
                Request a Quote
              </Link>
              <Link href="/contact" className="px-4 py-2.5 text-sm bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors font-medium">
                Get Started
              </Link>
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative z-[60] p-2 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <span
                className="block transition-all duration-300"
                style={{ opacity: isOpen ? 0 : 1, transform: isOpen ? 'rotate(90deg) scale(0.5)' : 'none', position: isOpen ? 'absolute' : 'relative' }}
              >
                <Menu className="w-5 h-5 text-slate-900" />
              </span>
              <span
                className="block transition-all duration-300"
                style={{ opacity: isOpen ? 1 : 0, transform: isOpen ? 'none' : 'rotate(-90deg) scale(0.5)', position: isOpen ? 'relative' : 'absolute' }}
              >
                <X className="w-5 h-5 text-white" />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen overlay */}
      <div
        className="fixed inset-0 z-[55] md:hidden flex flex-col"
        style={{
          background: '#0f172a',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 300ms ease',
        }}
      >
        {/* Top bar inside overlay */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-base">✦</div>
            <span className="font-display text-lg font-bold text-white">Fast Websites</span>
          </Link>
        </div>

        {/* Nav links */}
        <div className="flex flex-col justify-center flex-1 px-8 gap-2">
          {links.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between py-4 border-b border-white/10 last:border-0"
              style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 350ms ease ${i * 50 + 100}ms, transform 350ms ease ${i * 50 + 100}ms`,
              }}
            >
              <span className="text-2xl font-display font-bold text-white group-hover:text-accent transition-colors duration-200">
                {label}
              </span>
              <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-accent group-hover:translate-x-1 transition-all duration-200" />
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="px-8 pb-10 pt-6 border-t border-white/10"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'translateY(0)' : 'translateY(16px)',
            transition: `opacity 350ms ease 450ms, transform 350ms ease 450ms`,
          }}
        >
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-4 bg-accent text-white font-semibold rounded-2xl hover:bg-accent-dark transition-colors text-base"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-center text-slate-500 text-xs mt-4">48-hour preview · No upfront payment</p>
        </div>
      </div>
    </>
  )
}
