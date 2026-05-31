'use client'

import { useState, useRef, useEffect } from 'react'

type Message = { role: 'user' | 'assistant'; content: string }

type BusinessInfo = {
  name: string
  phone: string
  email: string
  industry: string
  services: { title: string; description: string }[]
  city: string
  state: string
  accentColor: string
}

export default function PreviewChatWidget({ biz }: { biz: BusinessInfo }) {
  const [open, setOpen] = useState(false)
  const [labelVisible, setLabelVisible] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hi! I'm the ${biz.name} assistant. Ask me about our services, pricing, or how to get started.` },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Show the label after 1.5s, hide it when chat opens
  useEffect(() => {
    const t = setTimeout(() => setLabelVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (open) setLabelVisible(false)
  }, [open])

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    const next: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next,
          businessConfig: {
            business_name: biz.name,
            phone: biz.phone,
            email: biz.email,
            city: biz.city,
            services: biz.services.map(s => s.title).join(', '),
            tone: 'friendly',
            bot_name: `${biz.name} Assistant`,
          },
        }),
      })
      const data = await res.json()
      if (data.reply) {
        setMessages(m => [...m, { role: 'assistant', content: data.reply }])
      }
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: "Sorry, I'm having trouble right now. Please call us directly!" }])
    } finally {
      setLoading(false)
    }
  }

  const accent = biz.accentColor
  // Truncate long names so the label doesn't overflow on mobile
  const shortName = biz.name.length > 28 ? biz.name.slice(0, 26) + '…' : biz.name

  return (
    <>
      {/* Launcher row — label + button side by side */}
      <div style={{
        position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999,
        display: 'flex', alignItems: 'center', gap: 10,
        flexDirection: 'row-reverse',
      }}>
        {/* Spinning neon ring wrapper */}
        <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
          {/* SVG ring — only shown when closed */}
          {!open && (
            <svg
              width="72" height="72" viewBox="0 0 72 72"
              style={{
                position: 'absolute', top: -8, left: -8,
                pointerEvents: 'none',
                animation: 'neonSpin 2.8s linear infinite',
                filter: `drop-shadow(0 0 4px ${accent}) drop-shadow(0 0 10px ${accent})`,
              }}
            >
              <circle
                cx="36" cy="36" r="32"
                fill="none"
                stroke={accent}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="48 154"
                strokeDashoffset="0"
              />
            </svg>
          )}
          {/* Button */}
          <button
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close chat' : `Chat with ${biz.name}`}
            style={{
              position: 'relative', zIndex: 1,
              width: 56, height: 56, borderRadius: '50%',
              background: '#0a0f1a',
              border: `1.5px solid ${accent}66`,
              cursor: 'pointer',
              boxShadow: `0 0 16px ${accent}55, 0 0 32px ${accent}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke={accent} strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          </button>
        </div>{/* end neon ring wrapper */}

        {/* Tooltip label — slides in from right */}
        <div style={{
          background: '#0f172a',
          border: `1px solid ${accent}44`,
          borderRadius: 10,
          padding: '8px 14px',
          boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px ${accent}22`,
          whiteSpace: 'nowrap',
          pointerEvents: labelVisible ? 'auto' : 'none',
          opacity: labelVisible ? 1 : 0,
          transform: labelVisible ? 'translateX(0)' : 'translateX(12px)',
          transition: 'opacity 0.3s, transform 0.3s',
          cursor: 'pointer',
        }}
          onClick={() => setOpen(true)}
        >
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 1 }}>Chat with</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{shortName}</div>
          {/* Arrow pointing right toward the button */}
          <div style={{
            position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)',
            width: 10, height: 10, background: '#0f172a',
            border: `1px solid ${accent}44`, borderLeft: 'none', borderBottom: 'none',
            rotate: '45deg',
          }} />
        </div>
      </div>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '5.5rem', right: '1.5rem', zIndex: 9998,
          width: 'min(360px, calc(100vw - 2rem))',
          background: '#0f172a', borderRadius: 16,
          border: `1px solid ${accent}33`,
          boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${accent}22`,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          maxHeight: 'min(480px, calc(100vh - 7rem))',
          animation: 'chatIn 0.2s ease-out',
        }}>
          {/* Header */}
          <div style={{
            background: '#0f172a', padding: '14px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 800, color: '#fff', flexShrink: 0,
            }}>
              {biz.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {shortName}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', flexShrink: 0 }} />
                Online now
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '12px 14px',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '82%', padding: '9px 13px', borderRadius: 12,
                  fontSize: 13, lineHeight: 1.5,
                  background: m.role === 'user' ? accent : 'rgba(255,255,255,0.07)',
                  color: '#f1f5f9',
                  borderBottomRightRadius: m.role === 'user' ? 4 : 12,
                  borderBottomLeftRadius: m.role === 'assistant' ? 4 : 12,
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 4, padding: '6px 2px' }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 6, height: 6, borderRadius: '50%', background: accent,
                    animation: `bounce 1s ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', gap: 8, background: '#0a0f1a',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask a question…"
              style={{
                flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#f1f5f9', outline: 'none',
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{
                width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer',
                background: input.trim() && !loading ? accent : 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes chatIn {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes neonSpin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
