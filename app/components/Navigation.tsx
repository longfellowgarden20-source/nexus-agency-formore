'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-base/95 border-b border-slate-800 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-black font-bold text-lg">
                ✦
              </div>
              <span className="hidden sm:inline font-display text-xl font-bold text-white">
                Fast Websites
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-slate-400 hover:text-white" style={{ transition: 'color 200ms' }}>Home</Link>
            <Link href="/about" className="text-sm text-slate-400 hover:text-white" style={{ transition: 'color 200ms' }}>About</Link>
            <Link href="/services" className="text-sm text-slate-400 hover:text-white" style={{ transition: 'color 200ms' }}>Services</Link>
            <Link href="/pricing" className="text-sm text-slate-400 hover:text-white" style={{ transition: 'color 200ms' }}>Pricing</Link>
            <Link href="/why-us" className="text-sm text-slate-400 hover:text-white" style={{ transition: 'color 200ms' }}>Why Us</Link>
            <Link
              href="/contact"
              className="px-4 py-2 bg-accent text-black text-sm font-semibold rounded-lg hover:bg-accent-dark"
              style={{ transition: 'background-color 200ms' }}
            >
              Get in Touch
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-slate-800 py-4 space-y-1">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/services', label: 'Services' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/why-us', label: 'Why Us' },
              { href: '/contact', label: 'Contact' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-surface rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
