import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

function isAdminAuthed(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value === 'true'
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [clientsRes, convsRes, projectsRes, invoicesRes] = await Promise.all([
    getSupabaseAdmin().from('clients').select('id, business_name, active, bot_name, city'),
    getSupabaseAdmin().from('conversations').select('id, client_id, created_at').gte('created_at', since7d),
    getSupabaseAdmin().from('projects').select('id, client_name, status, price, paid, deadline'),
    getSupabaseAdmin().from('invoices').select('id, client_name, amount, paid, due_date'),
  ])

  const clients = clientsRes.data ?? []
  const convs = convsRes.data ?? []
  const projects = projectsRes.data ?? []
  const invoices = invoicesRes.data ?? []

  const clientStats = clients.map(c => ({
    ...c,
    chats_this_week: convs.filter(cv => cv.client_id === c.id).length,
  }))

  const totalRevenue = invoices.filter(i => i.paid).reduce((s, i) => s + (i.amount ?? 0), 0)
  const unpaidRevenue = invoices.filter(i => !i.paid).reduce((s, i) => s + (i.amount ?? 0), 0)
  const activeProjects = projects.filter(p => p.status === 'in_progress').length

  return NextResponse.json({ clientStats, totalRevenue, unpaidRevenue, activeProjects, totalChatsThisWeek: convs.length })
}
