'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Loader2, Check } from 'lucide-react'

const inputCls = 'w-full px-3 py-2 text-sm rounded-lg text-white border border-white/10 focus:outline-none focus:border-[#0ea5e9]/60 placeholder:text-slate-600'
const textareaCls = `${inputCls} resize-none`
const labelCls = 'block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5'
const section = 'flex flex-col gap-4 p-6 rounded-2xl border border-white/10'

type Client = {
  id: string
  business_name: string
  tagline: string | null
  city: string | null
  phone: string | null
  email: string | null
  hours: string | null
  bot_name: string | null
  services: string | null
  faqs: string | null
  tone: string
  lead_capture: string
  off_limits: string | null
}

export default function ClientDashboard() {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    business_name: '', tagline: '', city: '', phone: '', email: '',
    hours: '', bot_name: '', services: '', faqs: '', tone: 'friendly',
    lead_capture: 'name and email', off_limits: '',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    fetch(`/api/client/${id}`).then(r => r.json()).then((data: Client) => {
      if (data.id) {
        setForm({
          business_name: data.business_name ?? '',
          tagline: data.tagline ?? '',
          city: data.city ?? '',
          phone: data.phone ?? '',
          email: data.email ?? '',
          hours: data.hours ?? '',
          bot_name: data.bot_name ?? '',
          services: data.services ?? '',
          faqs: data.faqs ?? '',
          tone: data.tone ?? 'friendly',
          lead_capture: data.lead_capture ?? 'name and email',
          off_limits: data.off_limits ?? '',
        })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const save = async () => {
    setSaving(true)
    setError('')
    const res = await fetch(`/api/client/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      const data = await res.json()
      setError(data.error ?? 'Failed to save')
    }
    setSaving(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#060b14' }}>
      <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
    </div>
  )

  return (
    <div className="min-h-screen p-8" style={{ background: '#060b14' }}>
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{form.business_name}</h1>
          <p className="text-sm text-slate-500 mt-0.5">Your AI chat bot settings</p>
        </div>

        {/* Business Info */}
        <div className={section} style={{ background: '#0f172a' }}>
          <p className="text-sm font-bold text-white">Your Business Info</p>
          <p className="text-xs text-slate-500 -mt-2">This is what your bot knows about your business. Keep it up to date.</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>Tagline</label>
              <input value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="e.g. Fast, reliable plumbing in Houston" className={inputCls} style={{ background: '#0a0f1a' }} />
            </div>
            <div>
              <label className={labelCls}>Phone Number</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(713) 555-1234" className={inputCls} style={{ background: '#0a0f1a' }} />
            </div>
            <div>
              <label className={labelCls}>Business Hours</label>
              <input value={form.hours} onChange={e => set('hours', e.target.value)} placeholder="Mon-Fri 8am-6pm" className={inputCls} style={{ background: '#0a0f1a' }} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Email</label>
              <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="contact@yourbusiness.com" className={inputCls} style={{ background: '#0a0f1a' }} />
            </div>
          </div>
        </div>

        {/* Services */}
        <div className={section} style={{ background: '#0f172a' }}>
          <p className="text-sm font-bold text-white">Services You Offer</p>
          <p className="text-xs text-slate-500 -mt-2">Your bot will only tell customers about services listed here.</p>
          <textarea
            value={form.services}
            onChange={e => set('services', e.target.value)}
            rows={4}
            placeholder="List your services here, e.g.&#10;- Pipe repair and replacement&#10;- Drain cleaning&#10;- Water heater installation&#10;- Emergency plumbing (24/7)"
            className={textareaCls}
            style={{ background: '#0a0f1a' }}
          />
        </div>

        {/* FAQs */}
        <div className={section} style={{ background: '#0f172a' }}>
          <p className="text-sm font-bold text-white">Common Questions</p>
          <p className="text-xs text-slate-500 -mt-2">Write the questions customers ask most and the exact answers you want your bot to give.</p>
          <textarea
            value={form.faqs}
            onChange={e => set('faqs', e.target.value)}
            rows={6}
            placeholder="Q: Do you offer emergency service?&#10;A: Yes, we're available 24/7 for emergencies. Call (713) 555-1234.&#10;&#10;Q: What areas do you serve?&#10;A: We serve all of Houston and surrounding areas within 30 miles."
            className={textareaCls}
            style={{ background: '#0a0f1a' }}
          />
        </div>

        {/* Bot personality */}
        <div className={section} style={{ background: '#0f172a' }}>
          <p className="text-sm font-bold text-white">Bot Personality</p>
          <div>
            <label className={labelCls}>Bot Name</label>
            <input value={form.bot_name} onChange={e => set('bot_name', e.target.value)} placeholder="e.g. Maya, Alex, or just leave blank for 'Assistant'" className={inputCls} style={{ background: '#0a0f1a' }} />
          </div>
          <div>
            <label className={labelCls}>Tone</label>
            <select value={form.tone} onChange={e => set('tone', e.target.value)} className={inputCls} style={{ background: '#0a0f1a' }}>
              <option value="friendly">Friendly & casual — like talking to a helpful neighbor</option>
              <option value="professional">Professional & formal — like a trained receptionist</option>
              <option value="enthusiastic">Enthusiastic & energetic — upbeat and positive</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>What should the bot ask visitors for?</label>
            <select value={form.lead_capture} onChange={e => set('lead_capture', e.target.value)} className={inputCls} style={{ background: '#0a0f1a' }}>
              <option value="name and email">Name and email</option>
              <option value="name, email, and phone number">Name, email, and phone number</option>
              <option value="name and phone number">Name and phone number only</option>
            </select>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={save}
          disabled={saving}
          className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-black rounded-xl disabled:opacity-50"
          style={{ background: '#0ea5e9' }}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>

        <p className="text-xs text-slate-600 text-center">Changes take effect immediately on your website.</p>
      </div>
    </div>
  )
}
