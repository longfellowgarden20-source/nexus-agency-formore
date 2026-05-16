'use client'

import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
                ✦
              </div>
              <span className="font-display text-white font-bold">Nexus</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Award-winning web design & development for ambitious brands.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3 sm:mb-4">Services</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Web Design</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Development</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Strategy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3 sm:mb-4">Company</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3 sm:mb-4">Legal</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sitemap</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8 sm:pt-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8">
            {/* Copyright */}
            <p className="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
              © {currentYear} Velocity. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 sm:gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors p-2" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors p-2" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors p-2" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors p-2" aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
