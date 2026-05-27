'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hey! I\'m here to help. Ask me anything about our services, pricing, or how to get started.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMessage: Message = { role: 'user', content: text }
    const next = [...messages, userMessage]
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
      if (data.reply) {
        setMessages(m => [...m, { role: 'assistant', content: data.reply }])
      }
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
        <div className="fixed bottom-24 right-6 z-50 w-[340px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10" style={{ background: '#0a0f1a' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10" style={{ background: '#0f172a' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm font-semibold text-white">Fast Websites</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white" style={{ transition: 'color 0.15s' }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-3 p-4 overflow-y-auto" style={{ maxHeight: 320 }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="px-3 py-2 rounded-xl text-sm max-w-[80%] leading-relaxed"
                  style={{
                    background: m.role === 'user' ? '#0ea5e9' : '#1e293b',
                    color: m.role === 'user' ? '#000' : '#e2e8f0',
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-xl" style={{ background: '#1e293b' }}>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 border-t border-white/10" style={{ background: '#0f172a' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask anything..."
              className="flex-1 px-3 py-2 text-sm rounded-lg text-white placeholder:text-slate-600 focus:outline-none border border-white/10 focus:border-[#0ea5e9]/60"
              style={{ background: '#0a0f1a' }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="p-2 rounded-lg disabled:opacity-40 text-black font-bold"
              style={{ background: '#0ea5e9', transition: 'opacity 0.15s' }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bubble button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg text-black"
        style={{ background: '#0ea5e9', transition: 'transform 0.15s', transform: open ? 'scale(0.9)' : 'scale(1)' }}
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  )
}
