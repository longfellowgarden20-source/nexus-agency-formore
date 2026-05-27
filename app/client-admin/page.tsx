'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function ClientLoginPage() {
  const router = useRouter()
  const [businessName, setBusinessName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async () => {
    if (!businessName || !password) { setError('Please fill in both fields'); return }
    setLoading(true)
    setError('')
    const res = await fetch('/api/client-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_name: businessName, password }),
    })
    const data = await res.json()
    if (res.ok) {
      router.push(`/client-admin/${data.id}`)
    } else {
      setError(data.error ?? 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#060b14' }}>
      <div className="w-full max-w-sm p-8 rounded-2xl border border-white/10" style={{ background: '#0f172a' }}>
        <h1 className="text-xl font-bold text-white mb-1">My Bot Dashboard</h1>
        <p className="text-sm text-slate-500 mb-6">Powered by Fast Websites</p>
        <div className="flex flex-col gap-3">
          <input
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            placeholder="Your business name"
            className="w-full px-3 py-2 text-sm rounded-lg text-white border border-white/10 focus:outline-none focus:border-[#0ea5e9]/60"
            style={{ background: '#0a0f1a' }}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Password"
            className="w-full px-3 py-2 text-sm rounded-lg text-white border border-white/10 focus:outline-none focus:border-[#0ea5e9]/60"
            style={{ background: '#0a0f1a' }}
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            onClick={login}
            disabled={loading}
            className="w-full py-2 text-sm font-bold text-black rounded-lg disabled:opacity-50"
            style={{ background: '#0ea5e9' }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}
