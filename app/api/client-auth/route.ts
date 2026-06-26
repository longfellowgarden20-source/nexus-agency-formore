import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import bcrypt from 'bcryptjs'

export const runtime = 'edge'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { business_name, password } = await req.json()

  if (!business_name || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { data: client, error } = await getSupabaseAdmin()
    .from('clients')
    .select('id, password_hash, active')
    .ilike('business_name', business_name.trim())
    .single()

  if (error || !client) return NextResponse.json({ error: 'Business not found' }, { status: 401 })
  if (!client.active) return NextResponse.json({ error: 'Account inactive' }, { status: 401 })

  const valid = await bcrypt.compare(password, client.password_hash)
  if (!valid) return NextResponse.json({ error: 'Wrong password' }, { status: 401 })

  const res = NextResponse.json({ ok: true, id: client.id })
  res.cookies.set('client_id', client.id, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('client_id')
  return res
}
