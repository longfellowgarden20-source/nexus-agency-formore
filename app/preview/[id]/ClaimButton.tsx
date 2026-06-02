'use client'

import { useState, useEffect, useRef } from 'react'

export default function ClaimButton({
  businessName,
  agencyEmail,
  agencyPhone,
}: {
  businessName: string
  agencyEmail: string
  agencyPhone: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const phoneDigits = agencyPhone.replace(/\D/g, '')
  const emailHref = `mailto:${agencyEmail}?subject=Website for ${businessName}&body=Hi, I just saw the website you built for ${businessName} and I'm interested in getting started.`

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="demo-banner-cta"
      >
        Get This Website →
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 12, overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          minWidth: 200, zIndex: 999,
          animation: 'claimIn 0.15s ease-out',
        }}>
          {phoneDigits && (
            <>
              <a
                href={`tel:+1${phoneDigits}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 16px', textDecoration: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  color: '#f1f5f9', fontSize: 13, fontWeight: 600,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: 16 }}>📞</span>
                <div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 1 }}>Call us</div>
                  <div>{agencyPhone}</div>
                </div>
              </a>
              <a
                href={`sms:+1${phoneDigits}&body=Hi, I just viewed the website preview for ${businessName} and I'm interested!`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 16px', textDecoration: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  color: '#f1f5f9', fontSize: 13, fontWeight: 600,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: 16 }}>💬</span>
                <div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 1 }}>Text us</div>
                  <div>Send a message</div>
                </div>
              </a>
            </>
          )}
          <a
            href={emailHref}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', textDecoration: 'none',
              color: '#f1f5f9', fontSize: 13, fontWeight: 600,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ fontSize: 16 }}>✉️</span>
            <div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 1 }}>Email us</div>
              <div>Send an email</div>
            </div>
          </a>
        </div>
      )}

      <style>{`
        @keyframes claimIn {
          from { opacity: 0; transform: translateY(-4px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
