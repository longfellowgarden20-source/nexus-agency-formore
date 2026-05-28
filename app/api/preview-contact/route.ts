import { NextRequest, NextResponse } from 'next/server'
import { transporter } from '@/lib/mailer'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.formData().catch(() => null)

  let name = '', contact = '', message = '', businessName = '', previewId = ''

  if (body) {
    name = String(body.get('name') ?? '')
    contact = String(body.get('contact') ?? '')
    message = String(body.get('message') ?? '')
    businessName = String(body.get('business_name') ?? '')
    previewId = String(body.get('preview_id') ?? '')
  } else {
    const json = await req.json().catch(() => ({}))
    name = json.name ?? ''
    contact = json.contact ?? ''
    message = json.message ?? ''
    businessName = json.business_name ?? ''
    previewId = json.preview_id ?? ''
  }

  if (!name || !contact || !message) {
    return NextResponse.redirect(new URL(`/preview/${previewId}?error=missing`, req.url))
  }

  await transporter.sendMail({
    from: `Fast Websites <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: `📩 New quote request from ${businessName} preview`,
    html: `<div style="font-family:-apple-system,Arial,sans-serif;background:#0f172a;color:#f1f5f9;padding:32px;border-radius:12px;max-width:520px;">
      <p style="margin:0 0 6px;font-size:20px;font-weight:800;color:#0ea5e9;">New Quote Request</p>
      <p style="margin:0 0 24px;font-size:13px;color:#64748b;">Via website preview for <strong style="color:#f1f5f9;">${businessName}</strong></p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:10px 0;border-bottom:1px solid #1e293b;font-size:13px;color:#94a3b8;width:100px;">From</td><td style="padding:10px 0;border-bottom:1px solid #1e293b;font-size:14px;color:#f1f5f9;font-weight:600;">${name}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #1e293b;font-size:13px;color:#94a3b8;">Contact</td><td style="padding:10px 0;border-bottom:1px solid #1e293b;font-size:14px;color:#f1f5f9;">${contact}</td></tr>
        <tr><td style="padding:10px 0;font-size:13px;color:#94a3b8;vertical-align:top;">Message</td><td style="padding:10px 0;font-size:14px;color:#f1f5f9;line-height:1.6;">${message}</td></tr>
      </table>
      ${previewId ? `<div style="margin-top:24px;"><a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://nexus-agency-formore-cvufrmzih.vercel.app'}/preview/${previewId}" style="display:inline-block;padding:10px 20px;background:#0ea5e9;color:#000;font-weight:700;font-size:13px;border-radius:8px;text-decoration:none;">View Their Preview</a></div>` : ''}
    </div>`,
  })

  return NextResponse.redirect(new URL(`/preview/${previewId}?submitted=1`, req.url))
}
