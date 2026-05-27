'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Loader2, Plus, Power, Trash2, ExternalLink } from 'lucide-react'

type Client = {
  id: string
  business_name: string
  city: string | null
  phone: string | null
  email: string | null
  active: boolean
  created_at: string
  bot_name: string | null
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)

  const login = async () => {
    setAuthLoading(true)
    setAuthError('')
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      setAuthed(true)
      loadClients()
    } else {
      setAuthError('Wrong password')
    }
    setAuthLoading(false)
  }

  const loadClients = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/clients')
    if (res.ok) {
      const data = await res.json()
      setClients(Array.isArray(data) ? data : [])
    }
    setLoading(false)
  }

  const toggleActive = async (client: Client) => {
    await fetch('/api/admin/clients', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: client.id, active: !client.active }),
    })
    setClients(c => c.map(x => x.id === client.id ? { ...x, active: !x.active } : x))
  }

  const deleteClient = async (id: string) => {
    if (!confirm('Delete this client? This cannot be undone.')) return
    await fetch('/api/admin/clients', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setClients(c => c.filter(x => x.id !== id))
  }

  useEffect(() => {
    fetch('/api/admin/clients').then(r => {
      if (r.ok) { setAuthed(true); loadClients() }
    })
  }, [])

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060b14' }}>
        <div className="w-full max-w-sm p-8 rounded-2xl border border-white/10" style={{ background: '#0f172a' }}>
          <h1 className="text-xl font-bold text-white mb-1">Admin Panel</h1>
          <p className="text-sm text-slate-500 mb-6">Fast Websites — internal access only</p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Admin password"
            className="w-full px-3 py-2 text-sm rounded-lg text-white border border-white/10 focus:outline-none focus:border-[#0ea5e9]/60 mb-3"
            style={{ background: '#0a0f1a' }}
          />
          {authError && <p className="text-red-400 text-xs mb-3">{authError}</p>}
          <button
            onClick={login}
            disabled={authLoading}
            className="w-full py-2 text-sm font-bold text-black rounded-lg disabled:opacity-50"
            style={{ background: '#0ea5e9' }}
          >
            {authLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Sign In'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8" style={{ background: '#060b14' }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-sm text-slate-500 mt-0.5">{clients.length} clients</p>
          </div>
          <Link
            href="/admin/clients/new"
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-black rounded-xl"
            style={{ background: '#0ea5e9' }}
          >
            <Plus className="w-4 h-4" /> New Client
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: '#0f172a' }}>
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-500 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading...
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-sm">No clients yet. Add your first one.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Business</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">City</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Bot Name</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Added</th>
                  <th className="px-5 py-3 w-28"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {clients.map(client => (
                  <tr key={client.id} className="hover:bg-white/3" style={{ transition: 'background 0.1s' }}>
                    <td className="px-5 py-3 font-medium text-white">{client.business_name}</td>
                    <td className="px-5 py-3 text-slate-400">{client.city || '—'}</td>
                    <td className="px-5 py-3 text-slate-400">{client.bot_name || 'Assistant'}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${client.active ? 'bg-green-500/15 text-green-400' : 'bg-slate-500/15 text-slate-400'}`}>
                        {client.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{new Date(client.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/clients/${client.id}`} className="p-1.5 text-slate-400 hover:text-white border border-white/10 rounded-lg" style={{ transition: 'color 0.15s' }} title="Edit">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => toggleActive(client)} className={`p-1.5 border border-white/10 rounded-lg ${client.active ? 'text-green-400 hover:text-slate-400' : 'text-slate-400 hover:text-green-400'}`} style={{ transition: 'color 0.15s' }} title={client.active ? 'Deactivate' : 'Activate'}>
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteClient(client.id)} className="p-1.5 text-slate-600 hover:text-red-400 border border-white/10 rounded-lg" style={{ transition: 'color 0.15s' }} title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
