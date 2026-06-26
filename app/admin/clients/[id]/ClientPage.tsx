'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

const inputCls = 'w-full px-3 py-2 text-sm rounded-lg text-white border border-white/10 focus:outline-none focus:border-[#0ea5e9]/60 placeholder:text-slate-600'
const textareaCls = `${inputCls} resize-none`
const label = 'block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5'
const section = 'flex flex-col gap-4 p-6 rounded-2xl border border-white/10'

export default function EditClientPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    business_name: '', tagline: '', city: '', phone: '', email: '',
    hours: '', bot_name: '', services: '', faqs: '', tone: 'friendly',
    lead_capture: 'name and email', off_limits: '', password: '',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    fetch('/api/admin/clients').then(r => r.json()).then(data => {
      const client = Array.isArray(data) ? data.find((c: { id: string }) => c.id === id) : null
      if (client) {
        setForm({
          business_name: client.business_name ?? '',
          tagline: client.tagline ?? '',
          city: client.city ?? '',
          phone: client.phone ?? '',
          email: client.email ?? '',
          hours: client.hours ?? '',
          bot_name: client.bot_name ?? '',
          services: client.services ?? '',
          faqs: client.faqs ?? '',
          tone: client.tone ?? 'friendly',
          lead_capture: client.lead_capture ?? 'name and email',
          off_limits: client.off_limits ?? '',
          password: '',
        })
      }
      setLoading(false)
    })
  }, [id])

  const save = async () => {
    setSaving(true)
    setError('')
    const body: Record<string, string> = { id, ...form }
    if (!form.password) delete body.password
    const res = await fetch('/api/admin/clients', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) router.push('/admin')
    else {
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
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-1.5 rounded-lg text-slate-400 hover:text-white border border-white/10" style={{ transition: 'color 0.15s' }}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-bold text-white">Edit Client</h1>
        </div>

        <div className={section} style={{ background: '#0f172a' }}>
          <p className="text-sm font-bold text-white">Business Info</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={label}>Business Name</label>
              <input value={form.business_name} onChange={e => set('business_name', e.target.value)} className={inputCls} style={{ background: '#0a0f1a' }} />
            </div>
            <div className="col-span-2">
              <label className={label}>Tagline</label>
              <input value={form.tagline} onChange={e => set('tagline', e.target.value)} className={inputCls} style={{ background: '#0a0f1a' }} />
            </div>
            <div>
              <label className={label}>City</label>
              <input value={form.city} onChange={e => set('city', e.target.value)} className={inputCls} style={{ background: '#0a0f1a' }} />
            </div>
            <div>
              <label className={label}>Phone</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} className={inputCls} style={{ background: '#0a0f1a' }} />
            </div>
            <div>
              <label className={label}>Email</label>
              <input value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} style={{ background: '#0a0f1a' }} />
            </div>
            <div>
              <label className={label}>Hours</label>
              <input value={form.hours} onChange={e => set('hours', e.target.value)} className={inputCls} style={{ background: '#0a0f1a' }} />
            </div>
          </div>
        </div>

        <div className={section} style={{ background: '#0f172a' }}>
          <p className="text-sm font-bold text-white">Bot Configuration</p>
          <div>
            <label className={label}>Bot Name</label>
            <input value={form.bot_name} onChange={e => set('bot_name', e.target.value)} placeholder="Maya" className={inputCls} style={{ background: '#0a0f1a' }} />
          </div>
          <div>
            <label className={label}>Services Offered</label>
            <textarea value={form.services} onChange={e => set('services', e.target.value)} rows={3} className={textareaCls} style={{ background: '#0a0f1a' }} />
          </div>
          <div>
            <label className={label}>Common Questions & Answers</label>
            <textarea value={form.faqs} onChange={e => set('faqs', e.target.value)} rows={4} className={textareaCls} style={{ background: '#0a0f1a' }} />
          </div>
          <div>
            <label className={label}>Tone</label>
            <select value={form.tone} onChange={e => set('tone', e.target.value)} className={inputCls} style={{ background: '#0a0f1a' }}>
              <option value="friendly">Friendly & casual</option>
              <option value="professional">Professional & formal</option>
              <option value="enthusiastic">Enthusiastic & energetic</option>
            </select>
          </div>
          <div>
            <label className={label}>What info to collect from visitors</label>
            <select value={form.lead_capture} onChange={e => set('lead_capture', e.target.value)} className={inputCls} style={{ background: '#0a0f1a' }}>
              <option value="name and email">Name and email</option>
              <option value="name, email, and phone number">Name, email, and phone</option>
              <option value="name and phone number">Name and phone only</option>
            </select>
          </div>
          <div>
            <label className={label}>Topics to avoid</label>
            <input value={form.off_limits} onChange={e => set('off_limits', e.target.value)} className={inputCls} style={{ background: '#0a0f1a' }} />
          </div>
        </div>

        <div className={section} style={{ background: '#0f172a' }}>
          <p className="text-sm font-bold text-white">Reset Password</p>
          <div>
            <label className={label}>New Password</label>
            <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Leave blank to keep current password" className={inputCls} style={{ background: '#0a0f1a' }} />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-black rounded-xl disabled:opacity-50" style={{ background: '#0ea5e9' }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/admin" className="px-6 py-2.5 text-sm font-semibold text-slate-400 border border-white/10 rounded-xl hover:text-white" style={{ transition: 'color 0.15s' }}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  )
}
