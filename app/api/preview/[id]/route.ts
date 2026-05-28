import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data, error } = await getSupabaseAdmin()
    .from('previews')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Preview not found' }, { status: 404 })

  // Mark as viewed
  if (!data.viewed) {
    await getSupabaseAdmin()
      .from('previews')
      .update({ viewed: true, viewed_at: new Date().toISOString() })
      .eq('id', id)
  }

  return NextResponse.json(data)
}
