'use client'

import { useState, useRef, useEffect } from 'react'

type Message = { role: 'user' | 'assistant'; content: string }

const ACCENT = '#0ea5e9'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [labelVisible, setLabelVisible] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hey! I'm here to help. Ask me anything about our services, pricing, or how to get started." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (open) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 300)
  }, [open])

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
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      if (data.reply) setMessages(m => [...m, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Sorry, something went wrong. Try again in a moment.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', zIndex: 50,
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 88px)',
          right: 16,
          width: 'min(calc(100vw - 32px), 380px)',
          maxHeight: 'min(520px, calc(100dvh - 140px))',
          background: '#0a0f1a',
          borderRadius: 16, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px ${ACCENT}22`,
          display: 'flex', flexDirection: 'column',
          animation: 'chatIn 0.2s ease-out',
        }}>
          {/* Header */}
          <div style={{
            background: '#0f172a', padding: '14px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: ACCENT,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0, letterSpacing: '-0.5px',
              }}>FW</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>Fast Websites</div>
                <div style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                  Online now
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%', padding: '9px 13px', borderRadius: 12,
                  fontSize: 13, lineHeight: 1.5,
                  background: m.role === 'user' ? ACCENT : 'rgba(255,255,255,0.07)',
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
                  <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, animation: `bounce 1s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8, background: '#0a0f1a', flexShrink: 0 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask anything…"
              style={{
                flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, padding: '8px 12px', fontSize: 16, color: '#f1f5f9', outline: 'none', minHeight: 44,
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{
                width: 44, height: 44, borderRadius: 8, border: 'none', cursor: 'pointer', flexShrink: 0,
                background: input.trim() && !loading ? ACCENT : 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Launcher row */}
      <div style={{
        position: 'fixed', zIndex: 50,
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
        right: 24,
        display: 'flex', alignItems: 'center', gap: 10,
        flexDirection: 'row-reverse',
      }}>
        {/* Neon ring wrapper */}
        <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
          {!open && (
            <svg
              width="72" height="72" viewBox="0 0 72 72"
              style={{
                position: 'absolute', top: -8, left: -8,
                pointerEvents: 'none',
                animation: 'neonSpin 2.8s linear infinite',
                filter: `drop-shadow(0 0 4px ${ACCENT}) drop-shadow(0 0 10px ${ACCENT})`,
              }}
            >
              <circle
                cx="36" cy="36" r="32"
                fill="none" stroke={ACCENT} strokeWidth="2.5"
                strokeLinecap="round" strokeDasharray="48 154"
              />
            </svg>
          )}
          <button
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close chat' : 'Chat with Fast Websites'}
            style={{
              position: 'relative', zIndex: 1,
              width: 56, height: 56, borderRadius: '50%',
              background: '#0a0f1a',
              border: `1.5px solid ${ACCENT}66`,
              cursor: 'pointer',
              boxShadow: `0 0 16px ${ACCENT}55, 0 0 32px ${ACCENT}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round"/></svg>
            ) : (
              <>
                {/* Filled bubble with three dots */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H7l-4 4V5z" fill={ACCENT} fillOpacity="0.2" stroke={ACCENT} strokeWidth="1.8" strokeLinejoin="round"/>
                  <circle cx="8" cy="11" r="1.2" fill={ACCENT}/>
                  <circle cx="12" cy="11" r="1.2" fill={ACCENT}/>
                  <circle cx="16" cy="11" r="1.2" fill={ACCENT}/>
                </svg>
                {/* AI badge — top-right corner */}
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  background: '#0a0f1a', border: `1px solid ${ACCENT}`,
                  borderRadius: 6, padding: '1px 4px',
                  fontSize: 8, fontWeight: 800, color: ACCENT,
                  lineHeight: 1.4, letterSpacing: '0.5px',
                }}>AI</div>
              </>
            )}
          </button>
        </div>

        {/* Tooltip label */}
        <div style={{
          position: 'relative',
          background: '#0f172a',
          border: `1px solid ${ACCENT}44`,
          borderRadius: 10,
          padding: '8px 12px 8px 14px',
          boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px ${ACCENT}22`,
          pointerEvents: labelVisible ? 'auto' : 'none',
          opacity: labelVisible ? 1 : 0,
          transform: labelVisible ? 'translateX(0)' : 'translateX(12px)',
          transition: 'opacity 0.3s, transform 0.3s',
          display: 'flex', alignItems: 'center', gap: 10,
          maxWidth: 'calc(100vw - 100px)',
        }}>
          <div style={{ cursor: 'pointer', minWidth: 0 }} onClick={() => setOpen(true)}>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 1 }}>Chat with</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap' }}>Fast Websites</div>
          </div>
          <button
            onClick={e => { e.stopPropagation(); setLabelVisible(false) }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0,
              color: '#475569', lineHeight: 1, fontSize: 16,
            }}
            aria-label="Dismiss"
          >×</button>
          <div style={{
            position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%) rotate(45deg)',
            width: 10, height: 10, background: '#0f172a',
            border: `1px solid ${ACCENT}44`, borderLeft: 'none', borderBottom: 'none',
          }} />
        </div>
      </div>

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
