import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

function isAdminAuthed(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value === 'true'
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('client_id')

  let query = getSupabaseAdmin()
    .from('conversations')
    .select('*, clients(business_name)')
    .order('created_at', { ascending: false })
    .limit(100)

  if (clientId) query = query.eq('client_id', clientId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
