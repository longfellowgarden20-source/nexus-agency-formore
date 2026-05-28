import { notFound } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { transporter } from '@/lib/mailer'
import { Phone, Mail, MapPin, CheckCircle, ArrowRight, Zap } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Preview = {
  id: string
  business_name: string
  city: string | null
  category: string | null
  tagline: string | null
  headline: string | null
  subheadline: string | null
  services: string[] | null
  primary_color: string
  phone: string | null
  email: string | null
  cta_text: string | null
  about: string | null
}

export default async function PreviewPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ t?: string }> }) {
  const { id } = await params
  const { t: template = 'modern' } = await searchParams

  const { data: preview, error } = await getSupabaseAdmin()
    .from('previews')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !preview) notFound()

  // Increment view count every visit; mark viewed + notify on first open
  await getSupabaseAdmin()
    .rpc('increment_preview_views', { preview_id: id })

  if (!preview.viewed) {
    await getSupabaseAdmin()
      .from('previews')
      .update({ viewed: true, viewed_at: new Date().toISOString() })
      .eq('id', id)

    const previewUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://nexus-agency-formore-cvufrmzih.vercel.app'}/preview/${id}`
    await transporter.sendMail({
      from: `Fast Websites <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `👀 ${preview.business_name} just viewed their website preview`,
      html: `<div style="font-family:-apple-system,Arial,sans-serif;background:#0f172a;color:#f1f5f9;padding:32px;border-radius:12px;max-width:480px;">
        <p style="margin:0 0 8px;font-size:20px;font-weight:800;color:#0ea5e9;">Preview Opened</p>
        <p style="margin:0 0 20px;font-size:14px;color:#94a3b8;">${new Date().toLocaleString()}</p>
        <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:#f1f5f9;">${preview.business_name}</p>
        <p style="margin:0 0 24px;font-size:13px;color:#64748b;">${preview.city ?? ''} · ${preview.category ?? ''}</p>
        <a href="${previewUrl}" style="display:inline-block;padding:12px 24px;background:#0ea5e9;color:#000;font-weight:700;font-size:13px;border-radius:8px;text-decoration:none;">View Preview</a>
        <p style="margin:20px 0 0;font-size:12px;color:#334155;">Follow up while they're looking — now is the best time.</p>
      </div>`,
    }).catch(() => { /* don't block page render if email fails */ })
  }

  const p = preview as Preview
  const color = p.primary_color || '#0ea5e9'
  const services = p.services ?? []

  if (template === 'bold') return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#0f172a', color: '#f1f5f9' }}>
      <nav style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#ffffff' }}>{p.business_name}</span>
          {p.phone && <a href={`tel:${p.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: color, color: '#ffffff', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}><Phone style={{ width: 14, height: 14 }} /> {p.phone}</a>}
        </div>
      </nav>
      <section style={{ background: `linear-gradient(135deg, ${color}22 0%, #0f172a 60%)`, padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {p.category && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: `${color}25`, borderRadius: 999, fontSize: 12, fontWeight: 600, color, marginBottom: 24 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />{p.category} · {p.city}</div>}
          <h1 style={{ fontSize: 56, fontWeight: 900, color: '#ffffff', lineHeight: 1.1, margin: '0 0 24px' }}>{p.headline ?? `Welcome to ${p.business_name}`}</h1>
          <p style={{ fontSize: 20, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 40px' }}>{p.tagline}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={p.phone ? `tel:${p.phone}` : '#'} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px', background: color, color: '#fff', borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>{p.cta_text ?? 'Call Us Today'} <ArrowRight style={{ width: 18, height: 18 }} /></a>
            {p.email && <a href={`mailto:${p.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px', border: `2px solid ${color}50`, color: '#f1f5f9', borderRadius: 12, fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>Get a Free Quote</a>}
          </div>
        </div>
      </section>
      {services.length > 0 && <section style={{ padding: '80px 24px', background: '#0f172a' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#ffffff', margin: '0 0 40px', textAlign: 'center' }}>What We Do</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {services.map((s, i) => <div key={i} style={{ padding: '24px 20px', background: '#1e293b', borderRadius: 14, border: `1px solid ${color}30`, textAlign: 'center' }}><div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}><CheckCircle style={{ width: 20, height: 20, color }} /></div><p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#f1f5f9' }}>{s}</p></div>)}
          </div>
        </div>
      </section>}
      {p.about && <section style={{ padding: '80px 24px', background: '#0a0f1a', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#ffffff', margin: '0 0 20px' }}>About Us</h2>
          <p style={{ fontSize: 17, color: '#94a3b8', lineHeight: 1.8, margin: 0 }}>{p.about}</p>
        </div>
      </section>}
      <section style={{ padding: '80px 24px', background: color, textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#ffffff', margin: '0 0 12px' }}>Ready to Get Started?</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', margin: '0 0 36px' }}>We&apos;d love to work with {p.business_name}.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            {p.phone && <a href={`tel:${p.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 28px', background: '#ffffff', color: color, borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}><Phone style={{ width: 16, height: 16 }} /> {p.phone}</a>}
            {p.email && <a href={`mailto:${p.email}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 28px', background: 'rgba(255,255,255,0.15)', color: '#ffffff', borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}><Mail style={{ width: 16, height: 16 }} /> {p.email}</a>}
          </div>
        </div>
      </section>
      <footer style={{ padding: '20px 24px', background: '#020617', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: 12, color: '#334155' }}>© {new Date().getFullYear()} {p.business_name} · <span style={{ color: '#475569' }}>Website by </span><a href="https://fastwebsitesagency.com" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: 600 }}>Fast Websites</a></p>
      </footer>
      <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 100 }}>
        <a href="https://fastwebsitesagency.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#0f172a', borderRadius: 999, border: '1px solid #1e293b', textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}><Zap style={{ width: 14, height: 14, color: '#0ea5e9' }} /><span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>Powered by Fast Websites</span></a>
      </div>
    </div>
  )

  if (template === 'minimal') return (
    <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', background: '#fafaf9', color: '#1c1917' }}>
      <nav style={{ background: '#fafaf9', borderBottom: '1px solid #e7e5e4', padding: '0 48px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em', color: '#1c1917' }}>{p.business_name}</span>
          {p.phone && <a href={`tel:${p.phone}`} style={{ fontSize: 13, color: color, textDecoration: 'none', fontWeight: 600 }}>{p.phone}</a>}
        </div>
      </nav>
      <section style={{ padding: '80px 48px 60px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ width: 32, height: 3, background: color, marginBottom: 24 }} />
        {p.category && <p style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#78716c', margin: '0 0 16px' }}>{p.category} · {p.city}</p>}
        <h1 style={{ fontSize: 48, fontWeight: 700, color: '#1c1917', lineHeight: 1.2, margin: '0 0 24px', letterSpacing: '-0.02em' }}>{p.headline ?? `Welcome to ${p.business_name}`}</h1>
        <p style={{ fontSize: 18, color: '#57534e', lineHeight: 1.8, margin: '0 0 12px', maxWidth: 600 }}>{p.tagline}</p>
        <p style={{ fontSize: 15, color: '#78716c', lineHeight: 1.8, margin: '0 0 36px', maxWidth: 580 }}>{p.subheadline}</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href={p.phone ? `tel:${p.phone}` : '#'} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#1c1917', color: '#fafaf9', borderRadius: 4, fontSize: 14, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.02em' }}>{p.cta_text ?? 'Call Us Today'}</a>
          {p.email && <a href={`mailto:${p.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', border: '1px solid #d6d3d1', color: '#1c1917', borderRadius: 4, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Send a Message</a>}
        </div>
      </section>
      {services.length > 0 && <section style={{ padding: '60px 48px', background: '#f5f5f4', borderTop: '1px solid #e7e5e4', borderBottom: '1px solid #e7e5e4' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#78716c', margin: '0 0 32px' }}>Services</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px 32px' }}>
            {services.map((s, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 4, height: 4, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} /><p style={{ margin: 0, fontSize: 14, color: '#292524' }}>{s}</p></div>)}
          </div>
        </div>
      </section>}
      {p.about && <section style={{ padding: '60px 48px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#78716c', margin: '0 0 20px' }}>About</p>
          <p style={{ fontSize: 16, color: '#44403c', lineHeight: 1.9, margin: 0 }}>{p.about}</p>
        </div>
      </section>}
      <section style={{ padding: '60px 48px', borderTop: '1px solid #e7e5e4' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div><p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#1c1917' }}>{p.business_name}</p><p style={{ margin: 0, fontSize: 13, color: '#78716c' }}>Get in touch today.</p></div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {p.phone && <a href={`tel:${p.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: '#1c1917', color: '#fafaf9', borderRadius: 4, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}><Phone style={{ width: 14, height: 14 }} /> {p.phone}</a>}
            {p.email && <a href={`mailto:${p.email}`} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', border: '1px solid #d6d3d1', color: '#1c1917', borderRadius: 4, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}><Mail style={{ width: 14, height: 14 }} /> {p.email}</a>}
          </div>
        </div>
      </section>
      <footer style={{ padding: '16px 48px', background: '#1c1917', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: 11, color: '#57534e' }}>© {new Date().getFullYear()} {p.business_name} · <a href="https://fastwebsitesagency.com" style={{ color: '#78716c', textDecoration: 'none' }}>Fast Websites</a></p>
      </footer>
      <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 100 }}>
        <a href="https://fastwebsitesagency.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#0f172a', borderRadius: 999, border: '1px solid #1e293b', textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}><Zap style={{ width: 14, height: 14, color: '#0ea5e9' }} /><span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>Powered by Fast Websites</span></a>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#ffffff', color: '#1e293b' }}>

      {/* Nav */}
      <nav style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>{p.business_name}</span>
            {p.city && <span style={{ fontSize: 13, color: '#94a3b8', marginLeft: 8 }}>{p.city}</span>}
          </div>
          {p.phone && (
            <a href={`tel:${p.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: color, color: '#ffffff', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              <Phone style={{ width: 14, height: 14 }} /> {p.phone}
            </a>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)`, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            {p.category && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: `${color}15`, borderRadius: 999, fontSize: 12, fontWeight: 600, color, marginBottom: 20 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
                {p.category} · {p.city}
              </div>
            )}
            <h1 style={{ fontSize: 48, fontWeight: 800, color: '#0f172a', lineHeight: 1.15, margin: '0 0 20px' }}>
              {p.headline ?? `Welcome to ${p.business_name}`}
            </h1>
            <p style={{ fontSize: 18, color: '#475569', lineHeight: 1.7, margin: '0 0 12px' }}>
              {p.tagline}
            </p>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, margin: '0 0 32px' }}>
              {p.subheadline}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href={p.phone ? `tel:${p.phone}` : '#'} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: color, color: '#fff', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                {p.cta_text ?? 'Call Us Today'} <ArrowRight style={{ width: 16, height: 16 }} />
              </a>
              {p.email && (
                <a href={`mailto:${p.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', border: '2px solid #e2e8f0', color: '#334155', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none', background: '#fff' }}>
                  Get a Free Quote
                </a>
              )}
            </div>
          </div>

          {/* Visual card */}
          <div style={{ background: '#ffffff', borderRadius: 20, padding: 32, boxShadow: '0 20px 60px -10px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap style={{ width: 24, height: 24, color }} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{p.business_name}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>{p.category} · {p.city}</p>
              </div>
            </div>
            {services.slice(0, 4).map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < 3 ? '1px solid #f8fafc' : 'none' }}>
                <CheckCircle style={{ width: 16, height: 16, color, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: '#334155' }}>{s}</span>
              </div>
            ))}
            {p.phone && (
              <div style={{ marginTop: 20, padding: '14px 16px', background: `${color}10`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Phone style={{ width: 14, height: 14, color }} />
                <span style={{ fontSize: 14, fontWeight: 600, color }}>{p.phone}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      {services.length > 0 && (
        <section style={{ padding: '80px 24px', background: '#ffffff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>Our Services</h2>
              <p style={{ fontSize: 16, color: '#64748b', margin: 0 }}>Everything you need, handled by professionals</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
              {services.map((s, i) => (
                <div key={i} style={{ padding: '24px 20px', background: '#f8fafc', borderRadius: 14, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <CheckCircle style={{ width: 20, height: 20, color }} />
                  </div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About */}
      {p.about && (
        <section style={{ padding: '80px 24px', background: `${color}08` }}>
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', margin: '0 0 20px' }}>About Us</h2>
            <p style={{ fontSize: 17, color: '#475569', lineHeight: 1.8, margin: '0 0 32px' }}>{p.about}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
              {[['10+', 'Years Experience'], ['500+', 'Happy Customers'], ['4.9★', 'Average Rating']].map(([val, lbl]) => (
                <div key={lbl} style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color }}>{val}</p>
                  <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>{lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section style={{ padding: '80px 24px', background: '#0f172a' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#ffffff', margin: '0 0 12px' }}>Get In Touch</h2>
          <p style={{ fontSize: 16, color: '#94a3b8', margin: '0 0 40px' }}>Ready to get started? We'd love to hear from you.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            {p.phone && (
              <a href={`tel:${p.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 28px', background: color, color: '#fff', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                <Phone style={{ width: 16, height: 16 }} /> {p.phone}
              </a>
            )}
            {p.email && (
              <a href={`mailto:${p.email}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 28px', background: '#1e293b', color: '#e2e8f0', borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: 'none', border: '1px solid #334155' }}>
                <Mail style={{ width: 16, height: 16 }} /> {p.email}
              </a>
            )}
            {p.city && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 28px', background: '#1e293b', color: '#94a3b8', borderRadius: 12, fontSize: 15, border: '1px solid #334155' }}>
                <MapPin style={{ width: 16, height: 16 }} /> {p.city}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '20px 24px', background: '#020617', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: 12, color: '#334155' }}>
          © {new Date().getFullYear()} {p.business_name} · {p.city}
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <span style={{ color: '#475569' }}>Website by </span>
          <a href="https://fastwebsitesagency.com" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: 600 }}>Fast Websites</a>
        </span>
        </p>
      </footer>

      {/* Powered by banner */}
      <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 100 }}>
        <a href="https://fastwebsitesagency.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#0f172a', borderRadius: 999, border: '1px solid #1e293b', textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          <Zap style={{ width: 14, height: 14, color: '#0ea5e9' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>Powered by Fast Websites</span>
        </a>
      </div>

    </div>
  )
}
