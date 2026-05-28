import { notFound } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { transporter } from '@/lib/mailer'
import { Phone, Mail, MapPin, CheckCircle, ArrowRight, Zap, Star, ChevronDown } from 'lucide-react'

export const dynamic = 'force-dynamic'

// ── Types ────────────────────────────────────────────────────
type Colors = {
  accent: string; accentDark: string; accentLight: string; accentBorder: string
  accentFooter: string; accentFooterBorder: string; accentFooterText: string; accentFooterHeading: string
}
type Service = { title: string; description: string; icon?: string }
type PricingPlan = { name: string; price: string; description: string; features: string[]; cta: string; featured: boolean }
type WhyPoint = { title: string; description: string }
type Testimonial = { quote: string; name: string; location: string }
type FAQ = { question: string; answer: string }
type BusinessConfig = {
  name: string; shortName: string; tagline: string; phone: string; phoneHref: string
  email: string; domain: string; industry: string; industryLabel: string
  serviceNoun: string; proNoun: string; proNounSingular: string; logoEmoji: string
  colors: Colors
  hero: { badgeText: string; headline: string; headlineAccent: string; subheadline: string; ctaPrimary: string; ctaSecondary: string; socialProof: string; socialProof2: string }
  services: Service[]
  whyUs: { tagline: string; headline: string; intro: string; points: WhyPoint[]; outro: string }
  pricing: { tagline: string; headline: string; intro: string; outro: string; plans: PricingPlan[] }
  testimonials: Testimonial[]
  faqs: FAQ[]
  cta: { headline: string; subheadline: string; ctaPrimary: string; ctaSecondary: string }
  about: { tagline: string; headline: string; intro: string; values: { title: string; body: string }[] }
  owner: { name: string; title: string; yearsExperience: string; bio: string[] }
  serviceArea: { city: string; state: string; headline: string; intro: string; neighborhoods: string[]; nearbyCities: string[] }
  seo: { defaultDescription: string }
  contact?: { headline?: string; intro?: string }
}

// ── Fallback for old previews without business_config ─────────
function buildFallbackConfig(row: Record<string, unknown>): BusinessConfig {
  const color = String(row.primary_color ?? '#0ea5e9')
  return {
    name: String(row.business_name ?? 'Business'),
    shortName: String(row.business_name ?? 'Business'),
    tagline: String(row.tagline ?? ''),
    phone: String(row.phone ?? ''),
    phoneHref: '',
    email: String(row.email ?? ''),
    domain: '',
    industry: String(row.category ?? 'service'),
    industryLabel: String(row.category ?? 'Service'),
    serviceNoun: 'service',
    proNoun: 'professionals',
    proNounSingular: 'professional',
    logoEmoji: '⚡',
    colors: {
      accent: color, accentDark: color, accentLight: `${color}15`, accentBorder: `${color}30`,
      accentFooter: '#0f172a', accentFooterBorder: '#1e293b', accentFooterText: '#94a3b8', accentFooterHeading: '#f1f5f9',
    },
    hero: {
      badgeText: `Professional ${row.category ?? 'Service'} Provider`,
      headline: String(row.headline ?? `Welcome to ${row.business_name}`),
      headlineAccent: '',
      subheadline: String(row.subheadline ?? ''),
      ctaPrimary: String(row.cta_text ?? 'Get a Quote'),
      ctaSecondary: 'Learn More',
      socialProof: '⭐ 4.9/5 from 100+ customers',
      socialProof2: `Serving ${row.city ?? 'your area'} and surrounding communities`,
    },
    services: ((row.services as string[] | null) ?? []).map((s) => ({ title: s, description: '', icon: 'Star' })),
    whyUs: { tagline: '', headline: 'Why choose us', intro: '', points: [], outro: '' },
    pricing: { tagline: 'Pricing', headline: 'Our Packages', intro: '', outro: '', plans: [] },
    testimonials: [],
    faqs: [],
    cta: { headline: 'Ready to get started?', subheadline: "We'd love to work with you.", ctaPrimary: 'Contact Us', ctaSecondary: 'View Services' },
    about: { tagline: 'About Us', headline: String(row.about ?? ''), intro: String(row.about ?? ''), values: [] },
    owner: { name: '', title: 'Owner', yearsExperience: '10+', bio: [] },
    serviceArea: { city: String(row.city ?? ''), state: '', headline: '', intro: '', neighborhoods: [], nearbyCities: [] },
    seo: { defaultDescription: String(row.tagline ?? '') },
  }
}

// ── Main page ─────────────────────────────────────────────────
export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: row, error } = await getSupabaseAdmin()
    .from('previews')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !row) notFound()

  // Increment views + first-open notification (non-blocking)
  void getSupabaseAdmin().rpc('increment_preview_views', { preview_id: id })

  if (!row.viewed) {
    void getSupabaseAdmin()
      .from('previews')
      .update({ viewed: true, viewed_at: new Date().toISOString() })
      .eq('id', id)

    const previewUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://nexus-agency-formore-cvufrmzih.vercel.app'}/preview/${id}`
    void transporter.sendMail({
      from: `Fast Websites <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `👀 ${row.business_name} just viewed their website preview`,
      html: `<div style="font-family:-apple-system,Arial,sans-serif;background:#0f172a;color:#f1f5f9;padding:32px;border-radius:12px;max-width:480px;">
        <p style="margin:0 0 8px;font-size:20px;font-weight:800;color:#0ea5e9;">Preview Opened</p>
        <p style="margin:0 0 20px;font-size:14px;color:#94a3b8;">${new Date().toLocaleString()}</p>
        <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:#f1f5f9;">${row.business_name}</p>
        <p style="margin:0 0 24px;font-size:13px;color:#64748b;">${row.city ?? ''} · ${row.category ?? ''}</p>
        <a href="${previewUrl}" style="display:inline-block;padding:12px 24px;background:#0ea5e9;color:#000;font-weight:700;font-size:13px;border-radius:8px;text-decoration:none;">View Preview</a>
        <p style="margin:20px 0 0;font-size:12px;color:#334155;">Follow up while they're looking — now is the best time.</p>
      </div>`,
    }).catch(() => {})
  }

  const cfg: BusinessConfig = row.business_config
    ? (row.business_config as BusinessConfig)
    : buildFallbackConfig(row as Record<string, unknown>)

  const c = cfg.colors
  const agencyEmail = process.env.GMAIL_USER ?? 'robthebob2003@gmail.com'

  return (
    <>
      <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; scroll-behavior: smooth; }
          body { background: #fff; color: #1e293b; }
          a { color: inherit; }
          img { display: block; max-width: 100%; }

          /* Demo banner */
          .demo-banner { position: fixed; top: 0; left: 0; right: 0; z-index: 999; background: #0f172a; border-bottom: 1px solid #1e293b; padding: 10px 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
          .demo-banner-text { font-size: 13px; color: #94a3b8; }
          .demo-banner-text strong { color: #f1f5f9; }
          .demo-banner-cta { display: inline-flex; align-items: center; gap: 6px; padding: 7px 16px; background: ${c.accent}; color: #fff; border-radius: 6px; font-size: 12px; font-weight: 700; text-decoration: none; white-space: nowrap; }

          /* Push content below fixed demo banner */
          body { padding-top: 44px; }
          @media (max-width: 600px) { body { padding-top: 80px; } }

          /* Nav */
          .nav { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.97); backdrop-filter: blur(8px); border-bottom: 1px solid #e2e8f0; }
          .nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
          .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
          .nav-logo-icon { width: 38px; height: 38px; border-radius: 10px; background: ${c.accent}; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
          .nav-logo-name { font-size: 17px; font-weight: 800; color: #0f172a; letter-spacing: -0.01em; }
          .nav-links { display: flex; align-items: center; gap: 24px; }
          .nav-link { font-size: 14px; color: #475569; text-decoration: none; font-weight: 500; transition: color 0.15s; }
          .nav-link:hover { color: ${c.accent}; }
          .nav-cta { padding: 9px 20px; background: ${c.accent}; color: #fff; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; transition: background 0.15s; }
          .nav-cta:hover { background: ${c.accentDark}; }
          @media (max-width: 768px) { .nav-links { display: none; } }

          /* Hero */
          .hero { position: relative; min-height: 680px; display: flex; align-items: center; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); overflow: hidden; }
          .hero-bg-gradient { position: absolute; inset: 0; background: linear-gradient(135deg, ${c.accent}22 0%, transparent 60%); }
          .hero-inner { position: relative; max-width: 1200px; margin: 0 auto; padding: 80px 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
          .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 999px; font-size: 13px; color: rgba(255,255,255,0.9); font-weight: 500; margin-bottom: 24px; }
          .hero-badge-dot { width: 8px; height: 8px; border-radius: 50%; background: #4ade80; animation: pulse 2s infinite; }
          @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
          .hero-h1 { font-size: clamp(36px, 5vw, 60px); font-weight: 900; color: #fff; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 20px; }
          .hero-accent { color: ${c.accent}; }
          .hero-sub { font-size: 18px; color: rgba(255,255,255,0.8); line-height: 1.7; margin-bottom: 36px; max-width: 520px; }
          .hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 32px; }
          .btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: ${c.accent}; color: #fff; border-radius: 10px; font-size: 15px; font-weight: 700; text-decoration: none; transition: background 0.15s; }
          .btn-primary:hover { background: ${c.accentDark}; }
          .btn-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.3); color: #fff; border-radius: 10px; font-size: 15px; font-weight: 600; text-decoration: none; transition: background 0.15s; }
          .btn-secondary:hover { background: rgba(255,255,255,0.2); }
          .hero-proof { display: flex; align-items: center; gap: 16px; font-size: 13px; color: rgba(255,255,255,0.7); flex-wrap: wrap; }
          .hero-proof-sep { width: 1px; height: 16px; background: rgba(255,255,255,0.3); }
          .hero-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 28px; backdrop-filter: blur(8px); }
          .hero-card-header { display: flex; align-items: center; gap: 12px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 20px; }
          .hero-card-icon { width: 48px; height: 48px; border-radius: 12px; background: ${c.accent}25; display: flex; align-items: center; justify-content: center; }
          .hero-card-name { font-size: 15px; font-weight: 700; color: #fff; }
          .hero-card-sub { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 2px; }
          .hero-card-service { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .hero-card-service:last-child { border-bottom: none; }
          .hero-card-service-text { font-size: 14px; color: rgba(255,255,255,0.85); }
          .hero-card-phone { margin-top: 16px; padding: 12px 16px; background: ${c.accent}20; border-radius: 10px; display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: ${c.accent}; }
          @media (max-width: 900px) { .hero-inner { grid-template-columns: 1fr; } .hero-card { display: none; } }

          /* Section commons */
          .section { padding: 80px 24px; }
          .section-inner { max-width: 1200px; margin: 0 auto; }
          .section-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700; color: ${c.accent}; margin-bottom: 14px; }
          .section-h2 { font-size: clamp(28px, 4vw, 44px); font-weight: 900; color: #0f172a; line-height: 1.2; letter-spacing: -0.02em; }
          .section-intro { font-size: 17px; color: #475569; line-height: 1.7; max-width: 640px; margin-top: 14px; }
          .section-center { text-align: center; }
          .section-center .section-intro { margin: 14px auto 0; }

          /* Services grid */
          .services-bg { background: ${c.accentLight}; border-top: 1px solid ${c.accentBorder}; }
          .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 48px; }
          .service-card { background: #fff; border: 2px solid ${c.accentBorder}; border-radius: 16px; padding: 28px; transition: border-color 0.2s, box-shadow 0.2s; }
          .service-card:hover { border-color: ${c.accent}; box-shadow: 0 8px 30px -8px rgba(0,0,0,0.12); }
          .service-icon { width: 48px; height: 48px; border-radius: 12px; background: ${c.accentLight}; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
          .service-title { font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
          .service-desc { font-size: 14px; color: #64748b; line-height: 1.6; }

          /* Why us */
          .whyus-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 48px; }
          .whyus-card { border: 2px solid ${c.accentBorder}; border-radius: 20px; padding: 28px; background: #fff; transition: border-color 0.2s, box-shadow 0.2s; }
          .whyus-card:hover { border-color: ${c.accent}; box-shadow: 0 8px 30px -8px rgba(0,0,0,0.12); }
          .whyus-title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 10px; }
          .whyus-desc { font-size: 14px; color: #64748b; line-height: 1.6; }
          .whyus-outro { text-align: center; margin-top: 40px; font-size: 16px; color: #475569; max-width: 640px; margin-left: auto; margin-right: auto; }

          /* Pricing */
          .pricing-bg { background: ${c.accentLight}; border-top: 1px solid ${c.accentBorder}; }
          .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 48px; }
          .pricing-card { border: 2px solid ${c.accentBorder}; border-radius: 20px; background: #fff; overflow: hidden; transition: border-color 0.2s; display: flex; flex-direction: column; }
          .pricing-card:hover { border-color: ${c.accent}; }
          .pricing-card-featured { border-color: ${c.accent}; background: ${c.accent}; transform: scale(1.02); box-shadow: 0 20px 60px -10px rgba(0,0,0,0.25); }
          .pricing-featured-badge { padding: 8px 16px; background: ${c.accentDark}; color: #fff; font-size: 12px; font-weight: 700; text-align: center; }
          .pricing-body { padding: 28px; flex: 1; display: flex; flex-direction: column; }
          .pricing-name { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
          .pricing-name-featured { color: #fff; }
          .pricing-desc { font-size: 14px; color: #64748b; margin-bottom: 20px; }
          .pricing-desc-featured { color: rgba(255,255,255,0.75); }
          .pricing-price { font-size: 44px; font-weight: 900; color: #0f172a; margin-bottom: 20px; letter-spacing: -0.02em; }
          .pricing-price-featured { color: #fff; }
          .pricing-cta { display: block; text-align: center; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 700; text-decoration: none; margin-bottom: 24px; transition: background 0.15s; }
          .pricing-cta-normal { background: ${c.accent}; color: #fff; }
          .pricing-cta-normal:hover { background: ${c.accentDark}; }
          .pricing-cta-featured { background: #fff; color: ${c.accent}; }
          .pricing-cta-featured:hover { background: #f1f5f9; }
          .pricing-features { list-style: none; display: flex; flex-direction: column; gap: 10px; flex: 1; }
          .pricing-feature { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #475569; }
          .pricing-feature-featured { color: rgba(255,255,255,0.9); }
          .pricing-outro { text-align: center; margin-top: 32px; font-size: 14px; color: #64748b; }

          /* Testimonials */
          .testimonials-bg { background: #f8fafc; border-top: 1px solid #e2e8f0; }
          .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 48px; }
          .testimonial-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; }
          .testimonial-stars { display: flex; gap: 3px; margin-bottom: 14px; }
          .testimonial-quote { font-size: 15px; color: #475569; line-height: 1.7; margin-bottom: 20px; font-style: italic; }
          .testimonial-name { font-size: 14px; font-weight: 700; color: #0f172a; }
          .testimonial-location { font-size: 12px; color: #94a3b8; margin-top: 2px; }

          /* Service area */
          .service-area-bg { background: #fff; border-top: 1px solid #e2e8f0; }
          .service-area-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; margin-top: 0; }
          .neighborhoods-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-top: 24px; }
          .neighborhoods-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #94a3b8; margin-bottom: 16px; }
          .neighborhoods-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
          .neighborhood-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #475569; }
          .nearby-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
          .nearby-pill { padding: 6px 14px; border: 1px solid #e2e8f0; border-radius: 999px; font-size: 13px; color: #475569; background: #fff; font-weight: 500; }
          .map-placeholder { border-radius: 20px; overflow: hidden; border: 2px solid #e2e8f0; aspect-ratio: 4/3; background: linear-gradient(135deg, ${c.accentLight} 0%, #f1f5f9 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; }
          .map-city { font-size: 24px; font-weight: 800; color: ${c.accent}; }
          .map-label { font-size: 13px; color: #64748b; }
          @media (max-width: 768px) { .service-area-grid { grid-template-columns: 1fr; } }

          /* FAQs */
          .faqs-bg { background: ${c.accentLight}; border-top: 1px solid ${c.accentBorder}; }
          .faqs-list { max-width: 760px; margin: 48px auto 0; display: flex; flex-direction: column; gap: 12px; }
          details.faq { border: 2px solid ${c.accentBorder}; border-radius: 16px; background: #fff; overflow: hidden; transition: border-color 0.2s; }
          details.faq[open] { border-color: ${c.accent}; background: ${c.accentLight}; }
          details.faq summary { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 24px; cursor: pointer; list-style: none; font-size: 15px; font-weight: 600; color: #0f172a; }
          details.faq summary::-webkit-details-marker { display: none; }
          details.faq summary .chevron { width: 18px; height: 18px; color: ${c.accent}; flex-shrink: 0; transition: transform 0.2s; }
          details.faq[open] summary .chevron { transform: rotate(180deg); }
          details.faq .faq-answer { padding: 0 24px 20px; font-size: 14px; color: #475569; line-height: 1.7; }

          /* Contact / Quote form */
          .contact-bg { background: #fff; border-top: 1px solid #e2e8f0; }
          .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
          .contact-info-list { display: flex; flex-direction: column; gap: 16px; margin-top: 28px; }
          .contact-info-item { display: flex; align-items: center; gap: 14px; }
          .contact-info-icon { width: 44px; height: 44px; border-radius: 12px; background: ${c.accentLight}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
          .contact-info-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; font-weight: 600; }
          .contact-info-value { font-size: 15px; font-weight: 600; color: #0f172a; text-decoration: none; }
          .contact-info-value:hover { color: ${c.accent}; }
          .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
          .form-label { font-size: 13px; font-weight: 600; color: #374151; }
          .form-input { padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #0f172a; outline: none; transition: border-color 0.15s; width: 100%; font-family: inherit; background: #fff; }
          .form-input:focus { border-color: ${c.accent}; }
          textarea.form-input { min-height: 100px; resize: vertical; }
          .form-submit { width: 100%; padding: 14px; background: ${c.accent}; color: #fff; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit; transition: background 0.15s; }
          .form-submit:hover { background: ${c.accentDark}; }
          @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }

          /* CTA banner */
          .cta-bg { background: ${c.accent}; }
          .cta-inner { max-width: 800px; margin: 0 auto; padding: 80px 24px; text-align: center; }
          .cta-h2 { font-size: clamp(28px, 4vw, 44px); font-weight: 900; color: #fff; line-height: 1.2; margin-bottom: 16px; }
          .cta-sub { font-size: 18px; color: rgba(255,255,255,0.85); margin-bottom: 36px; }
          .cta-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
          .btn-cta-primary { padding: 14px 28px; background: #fff; color: ${c.accent}; border-radius: 10px; font-size: 15px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: background 0.15s; }
          .btn-cta-primary:hover { background: #f1f5f9; }
          .btn-cta-secondary { padding: 14px 28px; border: 2px solid rgba(255,255,255,0.5); color: #fff; border-radius: 10px; font-size: 15px; font-weight: 600; text-decoration: none; transition: background 0.15s; }
          .btn-cta-secondary:hover { background: rgba(255,255,255,0.15); }

          /* Footer */
          .footer { background: ${c.accentFooter}; border-top: 1px solid ${c.accentFooterBorder}; padding: 56px 24px 32px; }
          .footer-inner { max-width: 1200px; margin: 0 auto; }
          .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
          .footer-brand-name { font-size: 16px; font-weight: 800; color: ${c.accentFooterHeading}; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
          .footer-brand-icon { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 14px; }
          .footer-tagline { font-size: 13px; color: ${c.accentFooterText}; line-height: 1.6; max-width: 240px; }
          .footer-col-title { font-size: 13px; font-weight: 700; color: ${c.accentFooterHeading}; margin-bottom: 16px; }
          .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
          .footer-link { font-size: 13px; color: ${c.accentFooterText}; text-decoration: none; transition: color 0.15s; }
          .footer-link:hover { color: ${c.accentFooterHeading}; }
          .footer-bottom { border-top: 1px solid ${c.accentFooterBorder}; padding-top: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
          .footer-copy { font-size: 12px; color: ${c.accentFooterText}; }
          .footer-powered { font-size: 12px; color: ${c.accentFooterText}; }
          .footer-powered a { color: #0ea5e9; text-decoration: none; font-weight: 600; }
          @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; } }
          @media (max-width: 520px) { .footer-grid { grid-template-columns: 1fr; } }

          /* Powered by badge */
          .powered-badge { position: fixed; bottom: 20px; left: 20px; z-index: 100; display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: #0f172a; border-radius: 999px; border: 1px solid #1e293b; text-decoration: none; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
          .powered-badge span { font-size: 12px; font-weight: 700; color: #fff; }
        `}</style>
      <div>

        {/* ── Demo banner ──────────────────────────────────── */}
        <div className="demo-banner">
          <p className="demo-banner-text">
            👋 This is a <strong>free website preview</strong> built for <strong>{cfg.name}</strong> by Fast Websites. Like what you see?
          </p>
          <a href={`mailto:${agencyEmail}?subject=I want this website for ${cfg.name}&body=Hi, I just viewed my website preview and I'm interested in getting started.`} className="demo-banner-cta">
            Claim This Site →
          </a>
        </div>

        {/* ── Navigation ───────────────────────────────────── */}
        <nav className="nav">
          <div className="nav-inner">
            <a href="#" className="nav-logo">
              <div className="nav-logo-icon">{cfg.logoEmoji}</div>
              <span className="nav-logo-name">{cfg.shortName}</span>
            </a>
            <div className="nav-links">
              <a href="#services" className="nav-link">Services</a>
              <a href="#why-us" className="nav-link">Why Us</a>
              <a href="#pricing" className="nav-link">Pricing</a>
              <a href="#reviews" className="nav-link">Reviews</a>
              <a href="#faq" className="nav-link">FAQ</a>
            </div>
            <a href="#contact" className="nav-cta">Get a Quote</a>
          </div>
        </nav>

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="hero">
          <div className="hero-bg-gradient" />
          <div className="hero-inner">
            <div>
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                {cfg.hero.badgeText}
              </div>
              <h1 className="hero-h1">
                {cfg.hero.headline}
                {cfg.hero.headlineAccent && (
                  <><br /><span className="hero-accent">{cfg.hero.headlineAccent}</span></>
                )}
              </h1>
              <p className="hero-sub">{cfg.hero.subheadline}</p>
              <div className="hero-ctas">
                <a href="#contact" className="btn-primary">
                  {cfg.hero.ctaPrimary}
                  <ArrowRight size={16} />
                </a>
                <a href="#services" className="btn-secondary">{cfg.hero.ctaSecondary}</a>
              </div>
              <div className="hero-proof">
                <span>{cfg.hero.socialProof}</span>
                <span className="hero-proof-sep" />
                <span>{cfg.hero.socialProof2}</span>
              </div>
            </div>

            {/* Hero card — desktop only */}
            <div className="hero-card">
              <div className="hero-card-header">
                <div className="hero-card-icon">
                  <Zap size={22} color={c.accent} />
                </div>
                <div>
                  <div className="hero-card-name">{cfg.name}</div>
                  <div className="hero-card-sub">{cfg.industryLabel} · {cfg.serviceArea.city}</div>
                </div>
              </div>
              {cfg.services.slice(0, 4).map((s, i) => (
                <div key={i} className="hero-card-service">
                  <CheckCircle size={15} color={c.accent} style={{ flexShrink: 0 }} />
                  <span className="hero-card-service-text">{s.title}</span>
                </div>
              ))}
              {cfg.phone && (
                <div className="hero-card-phone">
                  <Phone size={14} />
                  {cfg.phone}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Services ─────────────────────────────────────── */}
        {cfg.services.length > 0 && (
          <section id="services" className="section services-bg">
            <div className="section-inner">
              <div className="section-center">
                <p className="section-label">What We Do</p>
                <h2 className="section-h2">{cfg.industryLabel} Services</h2>
                <p className="section-intro">Professional {cfg.industry} solutions for every need.</p>
              </div>
              <div className="services-grid">
                {cfg.services.map((s, i) => (
                  <div key={i} className="service-card">
                    <div className="service-icon">
                      <CheckCircle size={22} color={c.accent} />
                    </div>
                    <div className="service-title">{s.title}</div>
                    {s.description && <p className="service-desc">{s.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Why Us ───────────────────────────────────────── */}
        {cfg.whyUs.points.length > 0 && (
          <section id="why-us" className="section">
            <div className="section-inner">
              <div className="section-center">
                {cfg.whyUs.tagline && <p className="section-label">{cfg.whyUs.tagline}</p>}
                <h2 className="section-h2">{cfg.whyUs.headline}</h2>
                {cfg.whyUs.intro && <p className="section-intro">{cfg.whyUs.intro}</p>}
              </div>
              <div className="whyus-grid">
                {cfg.whyUs.points.map((pt, i) => (
                  <div key={i} className="whyus-card">
                    <div className="whyus-title">{pt.title}</div>
                    <p className="whyus-desc">{pt.description}</p>
                  </div>
                ))}
              </div>
              {cfg.whyUs.outro && <p className="whyus-outro">{cfg.whyUs.outro}</p>}
            </div>
          </section>
        )}

        {/* ── Pricing ──────────────────────────────────────── */}
        {cfg.pricing.plans.length > 0 && (
          <section id="pricing" className="section pricing-bg">
            <div className="section-inner">
              <div className="section-center">
                {cfg.pricing.tagline && <p className="section-label">{cfg.pricing.tagline}</p>}
                <h2 className="section-h2">{cfg.pricing.headline}</h2>
                {cfg.pricing.intro && <p className="section-intro">{cfg.pricing.intro}</p>}
              </div>
              <div className="pricing-grid">
                {cfg.pricing.plans.map((plan, i) => (
                  <div key={i} className={`pricing-card${plan.featured ? ' pricing-card-featured' : ''}`}>
                    {plan.featured && <div className="pricing-featured-badge">Most Popular</div>}
                    <div className="pricing-body">
                      <div className={`pricing-name${plan.featured ? ' pricing-name-featured' : ''}`}>{plan.name}</div>
                      <p className={`pricing-desc${plan.featured ? ' pricing-desc-featured' : ''}`}>{plan.description}</p>
                      <div className={`pricing-price${plan.featured ? ' pricing-price-featured' : ''}`}>{plan.price}</div>
                      <a href="#contact" className={`pricing-cta${plan.featured ? ' pricing-cta-featured' : ' pricing-cta-normal'}`}>
                        {plan.cta}
                      </a>
                      <ul className="pricing-features">
                        {plan.features.map((f, fi) => (
                          <li key={fi} className={`pricing-feature${plan.featured ? ' pricing-feature-featured' : ''}`}>
                            <CheckCircle size={15} color={plan.featured ? 'rgba(255,255,255,0.7)' : c.accent} style={{ flexShrink: 0, marginTop: 1 }} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              {cfg.pricing.outro && <p className="pricing-outro">{cfg.pricing.outro}</p>}
            </div>
          </section>
        )}

        {/* ── Testimonials ─────────────────────────────────── */}
        {cfg.testimonials.length > 0 && (
          <section id="reviews" className="section testimonials-bg">
            <div className="section-inner">
              <div className="section-center">
                <p className="section-label">Reviews</p>
                <h2 className="section-h2">What customers say</h2>
              </div>
              <div className="testimonials-grid">
                {cfg.testimonials.map((t, i) => (
                  <div key={i} className="testimonial-card">
                    <div className="testimonial-stars">
                      {[...Array(5)].map((_, si) => (
                        <Star key={si} size={14} color={c.accent} fill={c.accent} />
                      ))}
                    </div>
                    <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-location">{t.location}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Service Area ─────────────────────────────────── */}
        {(cfg.serviceArea.city || cfg.serviceArea.neighborhoods.length > 0) && (
          <section className="section service-area-bg">
            <div className="section-inner">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <MapPin size={18} color={c.accent} />
                <p className="section-label" style={{ marginBottom: 0 }}>Service Area</p>
              </div>
              <div className="service-area-grid">
                <div>
                  <h2 className="section-h2" style={{ marginBottom: 16 }}>
                    {cfg.serviceArea.headline
                      ? cfg.serviceArea.headline.split('\\n').map((line: string, i: number) => (
                          <span key={i}>{line}{i === 0 && <br />}</span>
                        ))
                      : `Proudly serving ${cfg.serviceArea.city}`}
                  </h2>
                  {cfg.serviceArea.intro && (
                    <p className="section-intro" style={{ marginTop: 0, marginBottom: 24 }}>{cfg.serviceArea.intro}</p>
                  )}
                  {cfg.serviceArea.neighborhoods.length > 0 && (
                    <div className="neighborhoods-box">
                      <div className="neighborhoods-label">{cfg.serviceArea.city} Neighborhoods</div>
                      <div className="neighborhoods-grid">
                        {cfg.serviceArea.neighborhoods.map((n, i) => (
                          <div key={i} className="neighborhood-item">
                            <CheckCircle size={14} color={c.accent} style={{ flexShrink: 0 }} />
                            <span>{n}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {cfg.serviceArea.nearbyCities.length > 0 && (
                    <div style={{ marginTop: 20 }}>
                      <div className="neighborhoods-label">Also Serving Nearby Cities</div>
                      <div className="nearby-pills">
                        {cfg.serviceArea.nearbyCities.map((city, i) => (
                          <span key={i} className="nearby-pill">{city}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="map-placeholder">
                  <MapPin size={32} color={c.accent} />
                  <div className="map-city">{cfg.serviceArea.city}{cfg.serviceArea.state ? `, ${cfg.serviceArea.state}` : ''}</div>
                  <div className="map-label">{cfg.industryLabel} Services</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── FAQs ─────────────────────────────────────────── */}
        {cfg.faqs.length > 0 && (
          <section id="faq" className="section faqs-bg">
            <div className="section-inner">
              <div className="section-center">
                <p className="section-label">FAQ</p>
                <h2 className="section-h2">Common questions</h2>
              </div>
              <div className="faqs-list">
                {cfg.faqs.map((faq, i) => (
                  <details key={i} className="faq">
                    <summary>
                      {faq.question}
                      <ChevronDown className="chevron" />
                    </summary>
                    <p className="faq-answer">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Quote form ────────────────────────────────────── */}
        <section id="contact" className="section contact-bg">
          <div className="section-inner">
            <div className="contact-grid">
              <div>
                <p className="section-label">Get in Touch</p>
                <h2 className="section-h2">{cfg.contact?.headline ?? `Ready for a beautiful result? Get a free quote today`}</h2>
                <p className="section-intro">{cfg.contact?.intro ?? `Reach out for a free consultation and quote. We respond fast.`}</p>
                <div className="contact-info-list">
                  {cfg.phone && (
                    <div className="contact-info-item">
                      <div className="contact-info-icon"><Phone size={18} color={c.accent} /></div>
                      <div>
                        <div className="contact-info-label">Phone</div>
                        <a href={`tel:${cfg.phone}`} className="contact-info-value">{cfg.phone}</a>
                      </div>
                    </div>
                  )}
                  {cfg.email && (
                    <div className="contact-info-item">
                      <div className="contact-info-icon"><Mail size={18} color={c.accent} /></div>
                      <div>
                        <div className="contact-info-label">Email</div>
                        <a href={`mailto:${cfg.email}`} className="contact-info-value">{cfg.email}</a>
                      </div>
                    </div>
                  )}
                  {cfg.serviceArea.city && (
                    <div className="contact-info-item">
                      <div className="contact-info-icon"><MapPin size={18} color={c.accent} /></div>
                      <div>
                        <div className="contact-info-label">Location</div>
                        <span className="contact-info-value">{cfg.serviceArea.city}{cfg.serviceArea.state ? `, ${cfg.serviceArea.state}` : ''}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form sends to agency owner */}
              <form
                method="POST"
                action={`/api/preview-contact`}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <input type="hidden" name="business_name" value={cfg.name} />
                <input type="hidden" name="preview_id" value={row.id} />
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input className="form-input" name="name" type="text" placeholder="John Smith" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone or Email</label>
                  <input className="form-input" name="contact" type="text" placeholder="(555) 123-4567 or email@example.com" required />
                </div>
                <div className="form-group">
                  <label className="form-label">What service do you need?</label>
                  <textarea className="form-input" name="message" placeholder={`Tell us about your ${cfg.industry} project...`} required />
                </div>
                <button type="submit" className="form-submit">
                  Send Message →
                </button>
                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 10, textAlign: 'center' }}>
                  We typically respond within 1 business day.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* ── CTA banner ───────────────────────────────────── */}
        <div className="cta-bg">
          <div className="cta-inner">
            <h2 className="cta-h2">{cfg.cta.headline}</h2>
            <p className="cta-sub">{cfg.cta.subheadline}</p>
            <div className="cta-buttons">
              <a href="#contact" className="btn-cta-primary">
                {cfg.cta.ctaPrimary} <ArrowRight size={16} />
              </a>
              <a href="#services" className="btn-cta-secondary">{cfg.cta.ctaSecondary}</a>
            </div>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────── */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-grid">
              <div>
                <div className="footer-brand-name">
                  <div className="footer-brand-icon">{cfg.logoEmoji}</div>
                  {cfg.shortName}
                </div>
                <p className="footer-tagline">
                  Certified {cfg.proNoun} delivering beautiful, reliable service for homes and businesses in {cfg.serviceArea.city}.
                </p>
              </div>
              <div>
                <div className="footer-col-title">Services</div>
                <ul className="footer-links">
                  {cfg.services.slice(0, 4).map((s, i) => (
                    <li key={i}><a href="#services" className="footer-link">{s.title}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="footer-col-title">Company</div>
                <ul className="footer-links">
                  <li><a href="#why-us" className="footer-link">Why Us</a></li>
                  <li><a href="#pricing" className="footer-link">Pricing</a></li>
                  <li><a href="#reviews" className="footer-link">Reviews</a></li>
                  <li><a href="#faq" className="footer-link">FAQ</a></li>
                </ul>
              </div>
              <div>
                <div className="footer-col-title">Contact</div>
                <ul className="footer-links">
                  {cfg.phone && <li><a href={`tel:${cfg.phone}`} className="footer-link">{cfg.phone}</a></li>}
                  {cfg.email && <li><a href={`mailto:${cfg.email}`} className="footer-link">{cfg.email}</a></li>}
                  {cfg.serviceArea.city && <li><span className="footer-link">{cfg.serviceArea.city}, {cfg.serviceArea.state}</span></li>}
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p className="footer-copy">© {new Date().getFullYear()} {cfg.name}. All rights reserved.</p>
              <p className="footer-powered">Website preview by <a href="https://fastwebsitesagency.com">Fast Websites</a></p>
            </div>
          </div>
        </footer>

        {/* ── Powered by badge ─────────────────────────────── */}
        <a href="https://fastwebsitesagency.com" target="_blank" rel="noopener noreferrer" className="powered-badge">
          <Zap size={14} color="#0ea5e9" />
          <span>Powered by Fast Websites</span>
        </a>

      </div>
    </>
  )
}
