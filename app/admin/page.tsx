'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Loader2, Plus, Power, Trash2, ExternalLink, MessageSquare, FolderOpen, DollarSign, Users, TrendingUp, AlertCircle, Check, X } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────
type Client = {
  id: string; business_name: string; city: string | null; active: boolean
  created_at: string; bot_name: string | null; chats_this_week?: number
}
type Conversation = {
  id: string; created_at: string; visitor_message: string; bot_reply: string
  clients?: { business_name: string }
}
type Project = {
  id: string; client_name: string; client_email: string | null; project_type: string | null
  status: string; price: number | null; paid: boolean; deadline: string | null; notes: string | null; live_url: string | null
}
type Invoice = {
  id: string; client_name: string; client_email: string | null; amount: number
  paid: boolean; due_date: string | null; notes: string | null
}
type Stats = {
  clientStats: Client[]; totalRevenue: number; unpaidRevenue: number
  activeProjects: number; totalChatsThisWeek: number
}

// ── Styles ────────────────────────────────────────────────────────────────────
const card = 'bg-white/5 border border-white/10 rounded-2xl'
const inputCls = 'w-full px-3 py-2 text-sm rounded-lg text-white border border-white/10 focus:outline-none focus:border-[#0ea5e9]/60 placeholder:text-slate-600'
const labelCls = 'block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1'

// ── Login screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async () => {
    setLoading(true); setError('')
    const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
    if (res.ok) onLogin()
    else setError('Wrong password')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#060b14' }}>
      <div className="w-full max-w-sm p-8 rounded-2xl border border-white/10" style={{ background: '#0f172a' }}>
        <p className="text-[#0ea5e9] font-bold text-sm mb-1">Fast Websites</p>
        <h1 className="text-xl font-bold text-white mb-1">Admin Panel</h1>
        <p className="text-sm text-slate-500 mb-6">Internal access only</p>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} placeholder="Admin password" className={inputCls} style={{ background: '#0a0f1a' }} />
        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        <button onClick={login} disabled={loading} className="w-full py-2 text-sm font-bold text-black rounded-lg mt-3 disabled:opacity-50" style={{ background: '#0ea5e9' }}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Sign In'}
        </button>
      </div>
    </div>
  )
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<'overview' | 'clients' | 'conversations' | 'projects' | 'payments'>('overview')
  const [stats, setStats] = useState<Stats | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(false)
  const [convFilter, setConvFilter] = useState('')

  // Project form
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [projectForm, setProjectForm] = useState({ client_name: '', client_email: '', project_type: 'website', status: 'in_progress', price: '', paid: false, deadline: '', notes: '', live_url: '' })

  // Invoice form
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [invoiceForm, setInvoiceForm] = useState({ client_name: '', client_email: '', amount: '', due_date: '', notes: '' })

  const loadAll = useCallback(async () => {
    setLoading(true)
    const [statsRes, convsRes, projectsRes, invoicesRes] = await Promise.all([
      fetch('/api/admin/stats').then(r => r.ok ? r.json() : null),
      fetch('/api/admin/conversations').then(r => r.ok ? r.json() : []),
      fetch('/api/admin/projects').then(r => r.ok ? r.json() : []),
      fetch('/api/admin/invoices').then(r => r.ok ? r.json() : []),
    ])
    if (statsRes) { setStats(statsRes); setClients(statsRes.clientStats ?? []) }
    setConversations(Array.isArray(convsRes) ? convsRes : [])
    setProjects(Array.isArray(projectsRes) ? projectsRes : [])
    setInvoices(Array.isArray(invoicesRes) ? invoicesRes : [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetch('/api/admin/stats').then(r => { if (r.ok) { setAuthed(true); loadAll() } })
  }, [loadAll])

  const toggleClientActive = async (client: Client) => {
    await fetch('/api/admin/clients', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: client.id, active: !client.active }) })
    setClients(c => c.map(x => x.id === client.id ? { ...x, active: !x.active } : x))
  }

  const deleteClient = async (id: string) => {
    if (!confirm('Delete this client?')) return
    await fetch('/api/admin/clients', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setClients(c => c.filter(x => x.id !== id))
  }

  const updateProjectStatus = async (id: string, status: string) => {
    await fetch('/api/admin/projects', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    setProjects(p => p.map(x => x.id === id ? { ...x, status } : x))
  }

  const markInvoicePaid = async (id: string, paid: boolean) => {
    await fetch('/api/admin/invoices', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, paid, paid_at: paid ? new Date().toISOString() : null }) })
    setInvoices(i => i.map(x => x.id === id ? { ...x, paid } : x))
  }

  const saveProject = async () => {
    const body = { ...projectForm, price: projectForm.price ? parseFloat(projectForm.price) : null }
    const res = await fetch('/api/admin/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) { const data = await res.json(); setProjects(p => [data, ...p]); setShowProjectForm(false); setProjectForm({ client_name: '', client_email: '', project_type: 'website', status: 'in_progress', price: '', paid: false, deadline: '', notes: '', live_url: '' }) }
  }

  const saveInvoice = async () => {
    const body = { ...invoiceForm, amount: parseFloat(invoiceForm.amount) }
    const res = await fetch('/api/admin/invoices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) { const data = await res.json(); setInvoices(i => [data, ...i]); setShowInvoiceForm(false); setInvoiceForm({ client_name: '', client_email: '', amount: '', due_date: '', notes: '' }) }
  }

  if (!authed) return <LoginScreen onLogin={() => { setAuthed(true); loadAll() }} />

  const TABS = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'payments', label: 'Payments', icon: DollarSign },
  ] as const

  const filteredConvs = convFilter
    ? conversations.filter(c => c.clients?.business_name.toLowerCase().includes(convFilter.toLowerCase()) || c.visitor_message.toLowerCase().includes(convFilter.toLowerCase()))
    : conversations

  const unpaidInvoices = invoices.filter(i => !i.paid)
  const overdueInvoices = unpaidInvoices.filter(i => i.due_date && i.due_date < new Date().toISOString().split('T')[0])

  return (
    <div className="min-h-screen" style={{ background: '#060b14' }}>
      {/* Header */}
      <div className="border-b border-white/10 px-8 py-4" style={{ background: '#0f172a' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-[#0ea5e9] text-xs font-bold">FAST WEBSITES</p>
            <h1 className="text-lg font-bold text-white">Admin Panel</h1>
          </div>
          <Link href="/admin/clients/new" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-black rounded-xl" style={{ background: '#0ea5e9' }}>
            <Plus className="w-4 h-4" /> New Client
          </Link>
        </div>
        {/* Tabs */}
        <div className="max-w-6xl mx-auto flex gap-1 mt-4">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg ${tab === t.id ? 'bg-[#0ea5e9]/15 text-[#0ea5e9]' : 'text-slate-500 hover:text-white'}`} style={{ transition: 'color 0.15s' }}>
              <t.icon className="w-3.5 h-3.5" />{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        {loading && <div className="flex items-center justify-center py-20 text-slate-500 gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>}

        {/* ── Overview ── */}
        {!loading && tab === 'overview' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Active Clients', value: clients.filter(c => c.active).length, color: 'text-[#0ea5e9]' },
                { label: 'Chats This Week', value: stats?.totalChatsThisWeek ?? 0, color: 'text-purple-400' },
                { label: 'Active Projects', value: stats?.activeProjects ?? 0, color: 'text-yellow-400' },
                { label: 'Unpaid Revenue', value: `$${(stats?.unpaidRevenue ?? 0).toLocaleString()}`, color: 'text-red-400' },
              ].map(s => (
                <div key={s.label} className={`${card} p-5`}>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className={`text-3xl font-bold mt-1 tabular-nums ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {overdueInvoices.length > 0 && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-400">Overdue invoices</p>
                  <p className="text-xs text-slate-400 mt-0.5">{overdueInvoices.length} invoice{overdueInvoices.length > 1 ? 's' : ''} past due — ${overdueInvoices.reduce((s, i) => s + i.amount, 0).toLocaleString()} outstanding</p>
                </div>
                <button onClick={() => setTab('payments')} className="ml-auto text-xs text-red-400 hover:text-white shrink-0" style={{ transition: 'color 0.15s' }}>View →</button>
              </div>
            )}

            {/* Client health */}
            <div className={`${card} overflow-hidden`}>
              <div className="px-5 py-4 border-b border-white/10">
                <p className="text-sm font-bold text-white">Client Bot Health</p>
                <p className="text-xs text-slate-500 mt-0.5">Chat activity in the last 7 days</p>
              </div>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/5">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Client</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Bot Name</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Chats / 7d</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                </tr></thead>
                <tbody className="divide-y divide-white/5">
                  {clients.map(c => (
                    <tr key={c.id} className="hover:bg-white/3" style={{ transition: 'background 0.1s' }}>
                      <td className="px-5 py-3 font-medium text-white">{c.business_name}</td>
                      <td className="px-5 py-3 text-slate-400">{c.bot_name || 'Assistant'}</td>
                      <td className="px-5 py-3">
                        <span className={`text-sm font-bold tabular-nums ${(c.chats_this_week ?? 0) > 0 ? 'text-green-400' : 'text-slate-600'}`}>{c.chats_this_week ?? 0}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.active ? 'bg-green-500/15 text-green-400' : 'bg-slate-500/15 text-slate-400'}`}>{c.active ? 'Active' : 'Inactive'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Clients ── */}
        {!loading && tab === 'clients' && (
          <div className={`${card} overflow-hidden`}>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/10">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Business</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">City</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Chats / 7d</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 w-32"></th>
              </tr></thead>
              <tbody className="divide-y divide-white/5">
                {clients.map(c => (
                  <tr key={c.id} className="hover:bg-white/3" style={{ transition: 'background 0.1s' }}>
                    <td className="px-5 py-3 font-medium text-white">{c.business_name}</td>
                    <td className="px-5 py-3 text-slate-400">{c.city || '—'}</td>
                    <td className="px-5 py-3 text-sm font-bold tabular-nums text-green-400">{c.chats_this_week ?? 0}</td>
                    <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.active ? 'bg-green-500/15 text-green-400' : 'bg-slate-500/15 text-slate-400'}`}>{c.active ? 'Active' : 'Inactive'}</span></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/clients/${c.id}`} className="p-1.5 text-slate-400 hover:text-white border border-white/10 rounded-lg" title="Edit"><ExternalLink className="w-3.5 h-3.5" /></Link>
                        <button onClick={() => toggleClientActive(c)} className={`p-1.5 border border-white/10 rounded-lg ${c.active ? 'text-green-400 hover:text-slate-400' : 'text-slate-400 hover:text-green-400'}`} title={c.active ? 'Deactivate' : 'Activate'}><Power className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deleteClient(c.id)} className="p-1.5 text-slate-600 hover:text-red-400 border border-white/10 rounded-lg" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {clients.length === 0 && <div className="text-center py-16 text-slate-500 text-sm">No clients yet.</div>}
          </div>
        )}

        {/* ── Conversations ── */}
        {!loading && tab === 'conversations' && (
          <div className="flex flex-col gap-4">
            <input value={convFilter} onChange={e => setConvFilter(e.target.value)} placeholder="Filter by client or message..." className={`${inputCls} max-w-sm`} style={{ background: '#0f172a' }} />
            <div className={`${card} overflow-hidden`}>
              {filteredConvs.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-sm">No conversations yet.</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredConvs.map(c => (
                    <div key={c.id} className="px-5 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-[#0ea5e9]">{c.clients?.business_name ?? 'Unknown'}</span>
                        <span className="text-xs text-slate-600">{new Date(c.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-white mb-1"><span className="text-slate-500">Visitor:</span> {c.visitor_message}</p>
                      <p className="text-sm text-slate-400"><span className="text-slate-500">Bot:</span> {c.bot_reply}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Projects ── */}
        {!loading && tab === 'projects' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <button onClick={() => setShowProjectForm(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-black rounded-xl" style={{ background: '#0ea5e9' }}>
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>

            {showProjectForm && (
              <div className={`${card} p-6 flex flex-col gap-4`}>
                <p className="text-sm font-bold text-white">New Project</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Client Name</label><input value={projectForm.client_name} onChange={e => setProjectForm(f => ({ ...f, client_name: e.target.value }))} className={inputCls} style={{ background: '#0a0f1a' }} /></div>
                  <div><label className={labelCls}>Client Email</label><input value={projectForm.client_email} onChange={e => setProjectForm(f => ({ ...f, client_email: e.target.value }))} className={inputCls} style={{ background: '#0a0f1a' }} /></div>
                  <div><label className={labelCls}>Project Type</label>
                    <select value={projectForm.project_type} onChange={e => setProjectForm(f => ({ ...f, project_type: e.target.value }))} className={inputCls} style={{ background: '#0a0f1a' }}>
                      <option value="website">Website</option><option value="chat_widget">Chat Widget</option><option value="estimate_tool">Estimate Tool</option>
                    </select>
                  </div>
                  <div><label className={labelCls}>Price ($)</label><input type="number" value={projectForm.price} onChange={e => setProjectForm(f => ({ ...f, price: e.target.value }))} className={inputCls} style={{ background: '#0a0f1a' }} /></div>
                  <div><label className={labelCls}>Deadline</label><input type="date" value={projectForm.deadline} onChange={e => setProjectForm(f => ({ ...f, deadline: e.target.value }))} className={inputCls} style={{ background: '#0a0f1a' }} /></div>
                  <div><label className={labelCls}>Live URL</label><input value={projectForm.live_url} onChange={e => setProjectForm(f => ({ ...f, live_url: e.target.value }))} className={inputCls} style={{ background: '#0a0f1a' }} /></div>
                  <div className="col-span-2"><label className={labelCls}>Notes</label><input value={projectForm.notes} onChange={e => setProjectForm(f => ({ ...f, notes: e.target.value }))} className={inputCls} style={{ background: '#0a0f1a' }} /></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveProject} className="px-4 py-2 text-sm font-bold text-black rounded-lg" style={{ background: '#0ea5e9' }}>Save</button>
                  <button onClick={() => setShowProjectForm(false)} className="px-4 py-2 text-sm text-slate-400 border border-white/10 rounded-lg">Cancel</button>
                </div>
              </div>
            )}

            <div className={`${card} overflow-hidden`}>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/10">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Client</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Deadline</th>
                  <th className="px-5 py-3 w-32"></th>
                </tr></thead>
                <tbody className="divide-y divide-white/5">
                  {projects.map(p => (
                    <tr key={p.id} className="hover:bg-white/3" style={{ transition: 'background 0.1s' }}>
                      <td className="px-5 py-3 font-medium text-white">{p.client_name}</td>
                      <td className="px-5 py-3 text-slate-400 capitalize">{p.project_type?.replace('_', ' ') ?? '—'}</td>
                      <td className="px-5 py-3">
                        <select value={p.status} onChange={e => updateProjectStatus(p.id, e.target.value)} className="bg-transparent text-xs font-semibold border-none outline-none cursor-pointer text-white">
                          {['in_progress', 'review', 'completed', 'paused'].map(s => <option key={s} value={s} className="bg-[#0a0f1a]">{s.replace('_', ' ')}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-3 text-white tabular-nums">{p.price ? `$${p.price.toLocaleString()}` : '—'}</td>
                      <td className="px-5 py-3 text-slate-400 text-xs">{p.deadline ? new Date(p.deadline).toLocaleDateString() : '—'}</td>
                      <td className="px-5 py-3">
                        {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="text-[#0ea5e9] hover:underline text-xs">View live</a>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {projects.length === 0 && <div className="text-center py-16 text-slate-500 text-sm">No projects yet.</div>}
            </div>
          </div>
        )}

        {/* ── Payments ── */}
        {!loading && tab === 'payments' && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div className={`${card} p-5`}><p className="text-xs text-slate-500">Total Earned</p><p className="text-3xl font-bold text-green-400 mt-1">${(stats?.totalRevenue ?? 0).toLocaleString()}</p></div>
              <div className={`${card} p-5`}><p className="text-xs text-slate-500">Outstanding</p><p className="text-3xl font-bold text-red-400 mt-1">${(stats?.unpaidRevenue ?? 0).toLocaleString()}</p></div>
              <div className={`${card} p-5`}><p className="text-xs text-slate-500">Overdue</p><p className="text-3xl font-bold text-yellow-400 mt-1">{overdueInvoices.length}</p></div>
            </div>

            <div className="flex justify-end">
              <button onClick={() => setShowInvoiceForm(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-black rounded-xl" style={{ background: '#0ea5e9' }}>
                <Plus className="w-4 h-4" /> Add Invoice
              </button>
            </div>

            {showInvoiceForm && (
              <div className={`${card} p-6 flex flex-col gap-4`}>
                <p className="text-sm font-bold text-white">New Invoice</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Client Name</label><input value={invoiceForm.client_name} onChange={e => setInvoiceForm(f => ({ ...f, client_name: e.target.value }))} className={inputCls} style={{ background: '#0a0f1a' }} /></div>
                  <div><label className={labelCls}>Client Email</label><input value={invoiceForm.client_email} onChange={e => setInvoiceForm(f => ({ ...f, client_email: e.target.value }))} className={inputCls} style={{ background: '#0a0f1a' }} /></div>
                  <div><label className={labelCls}>Amount ($)</label><input type="number" value={invoiceForm.amount} onChange={e => setInvoiceForm(f => ({ ...f, amount: e.target.value }))} className={inputCls} style={{ background: '#0a0f1a' }} /></div>
                  <div><label className={labelCls}>Due Date</label><input type="date" value={invoiceForm.due_date} onChange={e => setInvoiceForm(f => ({ ...f, due_date: e.target.value }))} className={inputCls} style={{ background: '#0a0f1a' }} /></div>
                  <div className="col-span-2"><label className={labelCls}>Notes</label><input value={invoiceForm.notes} onChange={e => setInvoiceForm(f => ({ ...f, notes: e.target.value }))} className={inputCls} style={{ background: '#0a0f1a' }} /></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveInvoice} className="px-4 py-2 text-sm font-bold text-black rounded-lg" style={{ background: '#0ea5e9' }}>Save</button>
                  <button onClick={() => setShowInvoiceForm(false)} className="px-4 py-2 text-sm text-slate-400 border border-white/10 rounded-lg">Cancel</button>
                </div>
              </div>
            )}

            <div className={`${card} overflow-hidden`}>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/10">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Client</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Due</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3 w-24"></th>
                </tr></thead>
                <tbody className="divide-y divide-white/5">
                  {invoices.map(i => (
                    <tr key={i.id} className="hover:bg-white/3" style={{ transition: 'background 0.1s' }}>
                      <td className="px-5 py-3 font-medium text-white">{i.client_name}</td>
                      <td className="px-5 py-3 text-white font-bold tabular-nums">${i.amount.toLocaleString()}</td>
                      <td className="px-5 py-3 text-xs text-slate-400">{i.due_date ? new Date(i.due_date).toLocaleDateString() : '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${i.paid ? 'bg-green-500/15 text-green-400' : i.due_date && i.due_date < new Date().toISOString().split('T')[0] ? 'bg-red-500/15 text-red-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                          {i.paid ? 'Paid' : i.due_date && i.due_date < new Date().toISOString().split('T')[0] ? 'Overdue' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => markInvoicePaid(i.id, !i.paid)} className={`p-1.5 rounded-lg border border-white/10 ${i.paid ? 'text-green-400 hover:text-slate-400' : 'text-slate-400 hover:text-green-400'}`} style={{ transition: 'color 0.15s' }} title={i.paid ? 'Mark unpaid' : 'Mark paid'}>
                          {i.paid ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {invoices.length === 0 && <div className="text-center py-16 text-slate-500 text-sm">No invoices yet.</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
