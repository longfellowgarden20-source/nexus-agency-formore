import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

const ALLOWED_FIELDS = ['tagline', 'phone', 'email', 'hours', 'bot_name', 'services', 'faqs', 'tone', 'lead_capture', 'off_limits']

function isClientAuthed(req: NextRequest, id: string) {
  return req.cookies.get('client_id')?.value === id
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isClientAuthed(req, id)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await getSupabaseAdmin()
    .from('clients')
    .select('id, business_name, tagline, city, phone, email, hours, bot_name, services, faqs, tone, lead_capture, off_limits, active')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!data.active) return NextResponse.json({ error: 'Account inactive' }, { status: 403 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isClientAuthed(req, id)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const updates = Object.fromEntries(Object.entries(body).filter(([k]) => ALLOWED_FIELDS.includes(k)))

  const { data, error } = await getSupabaseAdmin()
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
