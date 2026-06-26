import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_auth', 'true', { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('admin_auth')
  return res
}
