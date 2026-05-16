'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 backdrop-blur-sm bg-white/95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-lg">
              ✦
            </div>
            <span className="hidden sm:inline font-display text-xl font-bold text-slate-900">
              Nexus
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </a>
            <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Docs
            </a>
            <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Blog
            </a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="px-4 py-2 text-sm text-slate-700 hover:text-slate-900 font-medium transition-colors">
              Sign In
            </button>
            <button className="px-4 py-2.5 text-sm bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors font-medium">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-5 h-5 text-slate-900" />
            ) : (
              <Menu className="w-5 h-5 text-slate-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200">
            <div className="flex flex-col gap-3 pt-4">
              <a href="#features" className="block px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors">
                Features
              </a>
              <a href="#pricing" className="block px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors">
                Pricing
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors">
                Docs
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors">
                Blog
              </a>
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                <button className="w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded transition-colors font-medium">
                  Sign In
                </button>
                <button className="w-full px-4 py-2.5 text-sm bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors font-medium">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
