import { notFound } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { transporter } from '@/lib/mailer'
import { Phone, Mail, MapPin, CheckCircle, ArrowRight, Zap, Star, ChevronDown, Shield, Award, Clock, Calendar, Users } from 'lucide-react'
import PreviewChatWidget from './PreviewChatWidget'
import ClaimButton from './ClaimButton'

// Unsplash hero images by industry keyword
const HERO_IMAGES: Record<string, string> = {
  // Outdoor / property
  landscap: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80&auto=format&fit=crop',
  lawn:     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80&auto=format&fit=crop',
  garden:   'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&q=80&auto=format&fit=crop',
  tree:     'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80&auto=format&fit=crop',
  fence:    'https://images.unsplash.com/photo-1558618047-3c8c76ca4fb9?w=1600&q=80&auto=format&fit=crop',
  deck:     'https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?w=1600&q=80&auto=format&fit=crop',
  pool:     'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=1600&q=80&auto=format&fit=crop',
  // Trades
  plumb:    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1600&q=80&auto=format&fit=crop',
  electric: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1600&q=80&auto=format&fit=crop',
  roof:     'https://images.unsplash.com/photo-1632759145354-ac2e0ebe3d41?w=1600&q=80&auto=format&fit=crop',
  hvac:     'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1600&q=80&auto=format&fit=crop',
  heat:     'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1600&q=80&auto=format&fit=crop',
  air:      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1600&q=80&auto=format&fit=crop',
  paint:    'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1600&q=80&auto=format&fit=crop',
  contrac:  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80&auto=format&fit=crop',
  remodel:  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80&auto=format&fit=crop',
  floor:    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=80&auto=format&fit=crop',
  tile:     'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=80&auto=format&fit=crop',
  concrete: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80&auto=format&fit=crop',
  window:   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80&auto=format&fit=crop',
  // Cleaning
  clean:    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80&auto=format&fit=crop',
  pressure: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80&auto=format&fit=crop',
  wash:     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80&auto=format&fit=crop',
  maid:     'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80&auto=format&fit=crop',
  junk:     'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80&auto=format&fit=crop',
  // Automotive
  auto:     'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=1600&q=80&auto=format&fit=crop',
  mechanic: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=1600&q=80&auto=format&fit=crop',
  tow:      'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=1600&q=80&auto=format&fit=crop',
  detai:    'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=1600&q=80&auto=format&fit=crop',
  // Beauty / wellness
  salon:    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80&auto=format&fit=crop',
  hair:     'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80&auto=format&fit=crop',
  barber:   'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1600&q=80&auto=format&fit=crop',
  nail:     'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1600&q=80&auto=format&fit=crop',
  spa:      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1600&q=80&auto=format&fit=crop',
  massage:  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1600&q=80&auto=format&fit=crop',
  fitness:  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80&auto=format&fit=crop',
  gym:      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80&auto=format&fit=crop',
  yoga:     'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&q=80&auto=format&fit=crop',
  // Pets
  groom:    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1600&q=80&auto=format&fit=crop',
  pet:      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1600&q=80&auto=format&fit=crop',
  dog:      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1600&q=80&auto=format&fit=crop',
  veterin:  'https://images.unsplash.com/photo-1559190394-df5a28aab5c5?w=1600&q=80&auto=format&fit=crop',
  // Pest / security
  pest:     'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80&auto=format&fit=crop',
  extermina:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80&auto=format&fit=crop',
  security: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80&auto=format&fit=crop',
  lock:     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80&auto=format&fit=crop',
  // Medical / professional
  dental:   'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1600&q=80&auto=format&fit=crop',
  medical:  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1600&q=80&auto=format&fit=crop',
  chiro:    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1600&q=80&auto=format&fit=crop',
  // Food / hospitality
  restaur:  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80&auto=format&fit=crop',
  food:     'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80&auto=format&fit=crop',
  cater:    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80&auto=format&fit=crop',
  // Moving / storage
  mov:      'https://images.unsplash.com/photo-1600518464441-9306c6e9ed75?w=1600&q=80&auto=format&fit=crop',
  storage:  'https://images.unsplash.com/photo-1600518464441-9306c6e9ed75?w=1600&q=80&auto=format&fit=crop',
}

function getHeroImage(industry: string): string {
  const lower = (industry ?? '').toLowerCase()
  for (const [key, url] of Object.entries(HERO_IMAGES)) {
    if (lower.includes(key)) return url
  }
  return 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80&auto=format&fit=crop'
}

// Time slots for booking widget
const TIME_SLOTS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

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
  googleRating?: number | null
  googleReviewCount?: number | null
  mapsPlaceId?: string | null
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

  // Increment view count directly — no RPC needed
  void getSupabaseAdmin()
    .from('previews')
    .update({ view_count: (row.view_count ?? 0) + 1 })
    .eq('id', id)

  if (!row.viewed) {
    void getSupabaseAdmin()
      .from('previews')
      .update({ viewed: true, viewed_at: new Date().toISOString() })
      .eq('id', id)

    const previewUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://nexus-agency-formore.vercel.app'}/preview/${id}`
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
  const agencyPhone = process.env.AGENCY_PHONE ?? '(562) 333-1388'
  const heroImage = getHeroImage(cfg.industry)
  const mapsEmbedKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY ?? process.env.GOOGLE_MAPS_API_KEY ?? ''

  // Monthly search volume — plausible numbers by industry keyword
  const SEARCH_VOLUMES: Record<string, number> = {
    landscap: 2400, lawn: 1900, garden: 1600, plumb: 3200, electric: 2800,
    clean: 2100, roof: 1800, hvac: 2600, paint: 1400, contrac: 1700,
    auto: 3100, mechanic: 2900, salon: 1500, hair: 1800, fitness: 2200,
    gym: 2400, dental: 3400, medical: 3800, restaur: 4200, food: 3600,
  }
  function getSearchVolume(industry: string): number {
    const lower = (industry ?? '').toLowerCase()
    for (const [key, vol] of Object.entries(SEARCH_VOLUMES)) {
      if (lower.includes(key)) return vol
    }
    return 1800
  }
  const monthlySearches = getSearchVolume(cfg.industry)

  // Competitor count — plausible by review count (more reviews = more competition)
  const competitorCount = cfg.googleReviewCount
    ? cfg.googleReviewCount > 200 ? 12 : cfg.googleReviewCount > 50 ? 7 : 4
    : 5

  // Time-based greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <>
      {/* Preload hero image so LCP fires as early as possible */}
      <link rel="preload" as="image" href={heroImage} fetchPriority="high" />
      <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          body { background: #fff; color: #1e293b; overflow-x: hidden; max-width: 100vw; }
          * { min-width: 0; }
          a { color: inherit; }
          img { display: block; max-width: 100%; }

          /* Demo banner */
          .demo-banner { position: fixed; top: 0; left: 0; right: 0; z-index: 999; background: #0f172a; border-bottom: 1px solid #1e293b; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; gap: 10px; overflow: hidden; }
          .demo-banner-text { font-size: 12px; color: #94a3b8; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .demo-banner-text strong { color: #f1f5f9; }
          @media (max-width: 500px) { .demo-banner-text .hide-mobile { display: none; } .demo-banner { padding: 8px 12px; } .demo-banner-cta { padding: 6px 12px; font-size: 11px; } }
          .demo-banner-cta { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; background: ${c.accent}; color: #fff; border-radius: 6px; font-size: 12px; font-weight: 700; text-decoration: none; white-space: nowrap; flex-shrink: 0; }

          /* Search demand bar */
          .demand-bar { background: ${c.accentLight}; border-bottom: 1px solid ${c.accentBorder}; padding: 9px 16px; display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; overflow: hidden; }
          .demand-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #475569; font-weight: 500; min-width: 0; }
          .demand-item strong { color: #0f172a; font-weight: 700; }
          .demand-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; animation: pulse 2s infinite; flex-shrink: 0; }

          /* Push content below fixed demo banner */
          body { padding-top: 44px; }
          @media (max-width: 600px) { body { padding-top: 80px; } }

          /* Mobile global overrides */
          @media (max-width: 640px) {
            .section { padding: 48px 16px; }
            .section-inner { overflow-x: hidden; }
            .hero-sub { font-size: 16px; }
            .demand-bar { flex-direction: column; gap: 8px; padding: 10px 16px; text-align: center; }
            .demand-item { justify-content: center; font-size: 11px; }
            .compare-inner { padding: 48px 16px; }
            .nav-inner { padding: 0 16px; }
            .cta-inner { padding: 48px 16px; }
            .booking-slots { grid-template-columns: repeat(2, 1fr); }
            .trust-inner { gap: 10px; }
            .trust-badge { font-size: 11px; }
            .neighborhoods-grid { grid-template-columns: 1fr 1fr; }
            .section-h2 { word-break: break-word; }
          }

          /* Nav */
          .nav { position: sticky; top: 0; z-index: 50; background: #fff; border-bottom: 1px solid #e2e8f0; will-change: transform; }
          .nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
          .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
          .nav-logo-icon { width: 38px; height: 38px; border-radius: 10px; background: ${c.accent}; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
          .nav-logo-name { font-size: 17px; font-weight: 800; color: #0f172a; letter-spacing: -0.01em; }
          .nav-links { display: flex; align-items: center; gap: 24px; }
          .nav-link { font-size: 14px; color: #475569; text-decoration: none; font-weight: 500; transition: color 0.15s; }
          .nav-link:hover { color: ${c.accentDark}; }
          .nav-cta { padding: 9px 20px; background: ${c.accent}; color: #fff; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; transition: background 0.15s; }
          .nav-cta:hover { background: ${c.accentDark}; }
          @media (max-width: 768px) { .nav-links { display: none; } }

          /* Hero */
          .hero { position: relative; min-height: 680px; display: flex; align-items: center; overflow: hidden; }
          .hero-bg-img { position: absolute; inset: 0; background-image: url('${heroImage.replace('w=1600', 'w=800')}'); background-size: cover; background-position: center; }
          @media (min-width: 1024px) { .hero-bg-img { background-image: url('${heroImage}'); } }
          .hero-bg-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.3) 100%); }
          .hero-bg-gradient { position: absolute; inset: 0; background: linear-gradient(135deg, ${c.accent}33 0%, transparent 50%); }
          .hero-inner { position: relative; max-width: 1200px; margin: 0 auto; padding: 80px 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
          .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 999px; font-size: 13px; color: rgba(255,255,255,0.9); font-weight: 500; margin-bottom: 24px; }
          .hero-badge-dot { width: 8px; height: 8px; border-radius: 50%; background: #4ade80; animation: pulse 2s infinite; }
          @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
          .hero-h1 { font-size: clamp(36px, 5vw, 60px); font-weight: 900; color: #fff; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 20px; }
          .hero-accent { color: ${c.accent}; filter: brightness(1.4) saturate(1.2); }
          .hero-sub { font-size: 18px; color: rgba(255,255,255,0.8); line-height: 1.7; margin-bottom: 36px; max-width: 520px; }
          .hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 32px; }
          .btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: ${c.accent}; color: #fff; border-radius: 10px; font-size: 15px; font-weight: 700; text-decoration: none; transition: background 0.15s; }
          .btn-primary:hover { background: ${c.accentDark}; }
          .btn-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.3); color: #fff; border-radius: 10px; font-size: 15px; font-weight: 600; text-decoration: none; transition: background 0.15s; }
          .btn-secondary:hover { background: rgba(255,255,255,0.2); }
          .live-pill { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); border-radius: 999px; font-size: 12px; font-weight: 600; color: #4ade80; margin-bottom: 16px; }
          .live-dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; animation: pulse 2s infinite; }
          .hero-proof { display: flex; align-items: center; gap: 16px; font-size: 13px; color: rgba(255,255,255,0.7); flex-wrap: wrap; }
          .hero-proof-sep { width: 1px; height: 16px; background: rgba(255,255,255,0.3); }
          .hero-card { background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 28px; }
          .hero-card-header { display: flex; align-items: center; gap: 12px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 20px; }
          .hero-card-icon { width: 48px; height: 48px; border-radius: 12px; background: ${c.accent}25; display: flex; align-items: center; justify-content: center; }
          .hero-card-name { font-size: 15px; font-weight: 700; color: #fff; }
          .hero-card-sub { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 2px; }
          .hero-card-service { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .hero-card-service:last-child { border-bottom: none; }
          .hero-card-service-text { font-size: 14px; color: rgba(255,255,255,0.85); }
          .hero-card-phone { margin-top: 16px; padding: 12px 16px; background: ${c.accent}20; border-radius: 10px; display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: ${c.accentDark}; }
          @media (max-width: 900px) { .hero-inner { grid-template-columns: 1fr; gap: 0; } .hero-card { display: none; } }
          @media (max-width: 640px) { .hero-inner { padding: 48px 16px; } .hero-h1 { word-break: break-word; } .hero-ctas { flex-direction: column; } .btn-primary, .btn-secondary { width: 100%; justify-content: center; } .hero-proof { flex-direction: column; gap: 6px; } .hero-proof-sep { display: none; } }

          /* Section commons */
          .section { padding: 80px 24px; }
          .section-inner { max-width: 1200px; margin: 0 auto; }
          .section-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700; color: ${c.accentDark}; margin-bottom: 14px; }
          .section-h2 { font-size: clamp(28px, 4vw, 44px); font-weight: 900; color: #0f172a; line-height: 1.2; letter-spacing: -0.02em; }
          .section-intro { font-size: 17px; color: #475569; line-height: 1.7; max-width: 640px; margin-top: 14px; }
          .section-center { text-align: center; }
          .section-center .section-intro { margin: 14px auto 0; }

          /* Services grid */
          .services-bg { background: ${c.accentLight}; border-top: 1px solid ${c.accentBorder}; }
          .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 20px; margin-top: 48px; }
          .service-card { background: #fff; border: 2px solid ${c.accentBorder}; border-radius: 16px; padding: 28px; transition: border-color 0.2s, box-shadow 0.2s; }
          .service-card:hover { border-color: ${c.accent}; box-shadow: 0 8px 30px -8px rgba(0,0,0,0.12); }
          .service-icon { width: 48px; height: 48px; border-radius: 12px; background: ${c.accentLight}; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
          .service-title { font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
          .service-desc { font-size: 14px; color: #64748b; line-height: 1.6; }

          /* Why us */
          .whyus-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 20px; margin-top: 48px; }
          .whyus-card { border: 2px solid ${c.accentBorder}; border-radius: 20px; padding: 28px; background: #fff; transition: border-color 0.2s, box-shadow 0.2s; }
          .whyus-card:hover { border-color: ${c.accent}; box-shadow: 0 8px 30px -8px rgba(0,0,0,0.12); }
          .whyus-title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 10px; }
          .whyus-desc { font-size: 14px; color: #64748b; line-height: 1.6; }
          .whyus-outro { text-align: center; margin-top: 40px; font-size: 16px; color: #475569; max-width: 640px; margin-left: auto; margin-right: auto; }

          /* Pricing */
          .pricing-bg { background: ${c.accentLight}; border-top: 1px solid ${c.accentBorder}; }
          .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 24px; margin-top: 48px; }
          .pricing-card { border: 2px solid ${c.accentBorder}; border-radius: 20px; background: #fff; overflow: hidden; transition: border-color 0.2s; display: flex; flex-direction: column; }
          .pricing-card:hover { border-color: ${c.accent}; }
          .pricing-card-featured { border-color: ${c.accent}; background: ${c.accent}; transform: scale(1.02); box-shadow: 0 20px 60px -10px rgba(0,0,0,0.25); }
          @media (max-width: 640px) { .pricing-card-featured { transform: none; } }
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
          .pricing-cta-featured { background: #fff; color: ${c.accentDark}; }
          .pricing-cta-featured:hover { background: #f1f5f9; }
          .pricing-features { list-style: none; display: flex; flex-direction: column; gap: 10px; flex: 1; }
          .pricing-feature { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #475569; }
          .pricing-feature-featured { color: rgba(255,255,255,0.9); }
          .pricing-outro { text-align: center; margin-top: 32px; font-size: 14px; color: #64748b; }

          /* Testimonials conveyor */
          .testimonials-bg { background: #f8fafc; border-top: 1px solid #e2e8f0; }
          .testimonials-track-wrap { width: 100%; overflow: hidden; margin-top: 48px; -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%); mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%); }
          .testimonials-track { display: flex; gap: 20px; width: max-content; animation: reviews-scroll 32s linear infinite; will-change: transform; }
          @keyframes reviews-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .testimonial-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; width: 320px; flex-shrink: 0; }
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
          .map-city { font-size: 24px; font-weight: 800; color: ${c.accentDark}; }
          .map-label { font-size: 13px; color: #64748b; }
          @media (max-width: 768px) { .service-area-grid { grid-template-columns: 1fr; } }

          /* FAQs */
          .faqs-bg { background: ${c.accentLight}; border-top: 1px solid ${c.accentBorder}; }
          .faqs-list { max-width: 760px; margin: 48px auto 0; display: flex; flex-direction: column; gap: 12px; }
          details.faq { border: 2px solid ${c.accentBorder}; border-radius: 16px; background: #fff; overflow: hidden; transition: border-color 0.2s; }
          details.faq[open] { border-color: ${c.accent}; background: ${c.accentLight}; }
          details.faq summary { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 24px; cursor: pointer; list-style: none; font-size: 15px; font-weight: 600; color: #0f172a; }
          details.faq summary::-webkit-details-marker { display: none; }
          details.faq summary .chevron { width: 18px; height: 18px; color: ${c.accentDark}; flex-shrink: 0; transition: transform 0.2s; }
          details.faq[open] summary .chevron { transform: rotate(180deg); }
          details.faq .faq-answer { padding: 0 24px 20px; font-size: 14px; color: #475569; line-height: 1.7; }

          /* Contact / Quote form */
          .contact-bg { background: #fff; border-top: 1px solid #e2e8f0; }
          .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
          .contact-info-list { display: flex; flex-direction: column; gap: 16px; margin-top: 28px; }
          .contact-info-item { display: flex; align-items: center; gap: 14px; }
          .contact-info-icon { width: 44px; height: 44px; border-radius: 12px; background: ${c.accentLight}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
          .contact-info-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; font-weight: 600; }
          .contact-info-value { font-size: 15px; font-weight: 600; color: #0f172a; text-decoration: none; word-break: break-all; }
          .contact-info-value:hover { color: ${c.accentDark}; }
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
          .btn-cta-primary { padding: 14px 28px; background: #fff; color: ${c.accentDark}; border-radius: 10px; font-size: 15px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: background 0.15s; }
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
          @media (max-width: 520px) { .footer-grid { grid-template-columns: 1fr; gap: 24px; } .footer { padding: 40px 16px 24px; } }

          /* Stats bar */
          .stats-bar { background: ${c.accent}; padding: 20px 16px; overflow: hidden; }
          .stats-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
          .stat-item { text-align: center; }
          .stat-value { font-size: clamp(24px, 3vw, 36px); font-weight: 900; color: #fff; letter-spacing: -0.02em; }
          .stat-label { font-size: 12px; color: rgba(255,255,255,0.8); font-weight: 500; margin-top: 2px; }
          @media (max-width: 640px) { .stats-inner { grid-template-columns: repeat(2, 1fr); } }

          /* Trust badges */
          .trust-bar { background: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 16px; overflow: hidden; }
          .trust-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap; }
          .trust-badge { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: #475569; white-space: nowrap; }
          .trust-badge-icon { width: 28px; height: 28px; border-radius: 8px; background: ${c.accentLight}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

          /* Before / After comparison */
          .compare-bg { background: #0f172a; border-top: 1px solid #1e293b; }
          .compare-inner { max-width: 1100px; margin: 0 auto; padding: 80px 24px; }
          .compare-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700; color: #94a3b8; margin-bottom: 14px; text-align: center; }
          .compare-h2 { font-size: clamp(26px, 4vw, 40px); font-weight: 900; color: #fff; line-height: 1.2; letter-spacing: -0.02em; text-align: center; margin-bottom: 48px; }
          .compare-grid { display: grid; grid-template-columns: 1fr auto 1fr; gap: 24px; align-items: center; width: 100%; }
          .compare-card { border-radius: 20px; overflow: hidden; }
          .compare-card-before { background: #1e293b; border: 2px solid #334155; }
          .compare-card-after { background: #fff; border: 2px solid ${c.accent}; box-shadow: 0 0 0 4px ${c.accent}22; }
          .compare-card-header { padding: 14px 20px; display: flex; align-items: center; gap: 10px; }
          .compare-card-header-before { background: #0f172a; border-bottom: 1px solid #334155; }
          .compare-card-header-after { background: ${c.accent}; border-bottom: 1px solid ${c.accentDark}; }
          .compare-card-dots { display: flex; gap: 6px; }
          .compare-dot { width: 10px; height: 10px; border-radius: 50%; }
          .compare-card-url { font-size: 11px; font-weight: 600; flex: 1; text-align: center; border-radius: 6px; padding: 4px 10px; }
          .compare-url-before { background: #334155; color: #64748b; }
          .compare-url-after { background: rgba(255,255,255,0.2); color: #fff; }
          .compare-card-body { padding: 24px; }
          .compare-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #1e293b; }
          .compare-row:last-child { border-bottom: none; }
          .compare-row-after { border-bottom-color: #e2e8f0; }
          .compare-icon-bad { width: 28px; height: 28px; border-radius: 8px; background: #ef444420; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
          .compare-icon-good { width: 28px; height: 28px; border-radius: 8px; background: ${c.accentLight}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
          .compare-row-text { font-size: 13px; font-weight: 500; }
          .compare-row-text-before { color: #64748b; }
          .compare-row-text-after { color: #0f172a; }
          .compare-vs { width: 48px; height: 48px; border-radius: 50%; background: ${c.accent}; color: #fff; font-size: 14px; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 0 0 6px ${c.accent}33; }
          .compare-badge-before { display: inline-flex; align-items: center; gap: 6px; margin-top: 16px; padding: 6px 12px; background: #ef444420; border-radius: 999px; font-size: 12px; font-weight: 700; color: #ef4444; }
          .compare-badge-after { display: inline-flex; align-items: center; gap: 6px; margin-top: 16px; padding: 6px 12px; background: #22c55e20; border-radius: 999px; font-size: 12px; font-weight: 700; color: #22c55e; }
          @media (max-width: 700px) { .compare-grid { grid-template-columns: 1fr; gap: 16px; } .compare-vs { margin: 0 auto; } .compare-inner { padding: 48px 16px; overflow-x: hidden; } }

          /* Process / How it works */
          .process-bg { background: #fff; border-top: 1px solid #e2e8f0; }
          .process-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 48px; position: relative; }
          .process-steps::before { content: ''; position: absolute; top: 28px; left: calc(16.67% + 16px); right: calc(16.67% + 16px); height: 2px; background: ${c.accentBorder}; z-index: 0; }
          .process-step { text-align: center; position: relative; z-index: 1; }
          .process-num { width: 56px; height: 56px; border-radius: 50%; background: ${c.accent}; color: #fff; font-size: 20px; font-weight: 900; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 0 0 8px ${c.accentLight}; }
          .process-title { font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
          .process-desc { font-size: 14px; color: #64748b; line-height: 1.6; }
          @media (max-width: 640px) { .process-steps { grid-template-columns: 1fr; } .process-steps::before { display: none; } }

          /* Booking widget */
          .booking-bg { background: ${c.accentLight}; border-top: 1px solid ${c.accentBorder}; }
          .booking-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
          .booking-form { background: #fff; border-radius: 20px; padding: 32px; box-shadow: 0 8px 40px -8px rgba(0,0,0,0.1); border: 1px solid ${c.accentBorder}; }
          .booking-form-title { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
          .booking-form-sub { font-size: 14px; color: #64748b; margin-bottom: 24px; }
          .booking-slots { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 8px; }
          .time-slot { padding: 8px 4px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 12px; font-weight: 600; color: #475569; text-align: center; cursor: pointer; transition: all 0.15s; background: #fff; }
          .time-slot:hover { border-color: ${c.accent}; color: ${c.accentDark}; background: ${c.accentLight}; }
          .time-slot.selected { border-color: ${c.accent}; background: ${c.accent}; color: #fff; }
          .booking-info { padding: 32px 0; }
          .booking-feature { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 24px; }
          .booking-feature-icon { width: 44px; height: 44px; border-radius: 12px; background: ${c.accent}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
          .booking-feature-title { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
          .booking-feature-desc { font-size: 13px; color: #64748b; line-height: 1.5; }
          @media (max-width: 768px) { .booking-grid { grid-template-columns: 1fr; gap: 32px; } }

          /* Powered by badge */
          .powered-badge { position: fixed; bottom: 16px; left: 16px; z-index: 100; display: flex; align-items: center; gap: 8px; padding: 8px 14px; background: #0f172a; border-radius: 999px; border: 1px solid #1e293b; text-decoration: none; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
          .powered-badge span { font-size: 11px; font-weight: 700; color: #fff; }
          @media (max-width: 640px) { .powered-badge { bottom: 12px; left: 12px; padding: 7px 12px; } .powered-badge span { display: none; } }
        `}</style>
      <div>

        {/* ── Browser title (SEO / tab label) ─────────────── */}
        <title>{cfg.name} — {cfg.industryLabel} in {cfg.serviceArea.city}</title>

        {/* ── Demo banner ──────────────────────────────────── */}
        <div className="demo-banner">
          <p className="demo-banner-text">
            👋 <strong>{cfg.name}</strong><span className="hide-mobile"> — we built this for you. <strong>{competitorCount} competitors</strong> in {cfg.serviceArea.city} have websites.</span>
          </p>
          <ClaimButton businessName={cfg.name} agencyEmail={agencyEmail} agencyPhone={agencyPhone} />
        </div>

        {/* ── Search demand bar ────────────────────────────── */}
        <div className="demand-bar">
          <div className="demand-item">
            <div className="demand-dot" />
            <span><strong>{monthlySearches.toLocaleString()}+</strong> people search for {cfg.industryLabel.toLowerCase()} in {cfg.serviceArea.city} every month</span>
          </div>
          <div className="demand-item">
            <span>🔍</span>
            <span><strong>{competitorCount} competitors</strong> already have websites capturing those searches</span>
          </div>
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
          <div className="hero-bg-img" />
          <div className="hero-bg-overlay" />
          <div className="hero-bg-gradient" />
          <div className="hero-inner">
            <div>
              <div className="live-pill">
                <span className="live-dot" />
                Currently accepting new clients in {cfg.serviceArea.city}
              </div>
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

        {/* ── Stats bar ────────────────────────────────────── */}
        <div className="stats-bar">
          <div className="stats-inner">
            <div className="stat-item">
              <div className="stat-value">
                {cfg.googleReviewCount ? `${cfg.googleReviewCount}+` : '500+'}
              </div>
              <div className="stat-label">Google Reviews</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {cfg.googleRating ? `${cfg.googleRating}★` : '4.9★'}
              </div>
              <div className="stat-label">Google Rating</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">15+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">100%</div>
              <div className="stat-label">Satisfaction Guarantee</div>
            </div>
          </div>
        </div>

        {/* ── Trust badges ─────────────────────────────────── */}
        <div className="trust-bar">
          <div className="trust-inner">
            <div className="trust-badge">
              <div className="trust-badge-icon"><Shield size={16} color={c.accent} /></div>
              Licensed &amp; Insured
            </div>
            <div className="trust-badge">
              <div className="trust-badge-icon"><Award size={16} color={c.accent} /></div>
              BBB Accredited
            </div>
            <div className="trust-badge">
              <div className="trust-badge-icon"><Star size={16} color={c.accent} /></div>
              Google Guaranteed
            </div>
            <div className="trust-badge">
              <div className="trust-badge-icon"><Users size={16} color={c.accent} /></div>
              Local Business
            </div>
            <div className="trust-badge">
              <div className="trust-badge-icon"><Clock size={16} color={c.accent} /></div>
              Same-Day Response
            </div>
          </div>
        </div>

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

        {/* ── Before / After ───────────────────────────────── */}
        <section className="compare-bg">
          <div className="compare-inner">
            <p className="compare-label">Why This Matters</p>
            <h2 className="compare-h2">
              Most {cfg.industryLabel.toLowerCase()} businesses are invisible online.<br />
              <span style={{ color: c.accent }}>Yours doesn&apos;t have to be.</span>
            </h2>
            <div className="compare-grid">

              {/* Before card */}
              <div className="compare-card compare-card-before">
                <div className="compare-card-header compare-card-header-before">
                  <div className="compare-card-dots">
                    <div className="compare-dot" style={{ background: '#ef4444' }} />
                    <div className="compare-dot" style={{ background: '#f59e0b' }} />
                    <div className="compare-dot" style={{ background: '#334155' }} />
                  </div>
                  <div className="compare-card-url compare-url-before">No website found</div>
                </div>
                <div className="compare-card-body">
                  {[
                    'No website — customers can\'t find you',
                    'Outdated Facebook, last post 2+ years ago',
                    'No way to book online',
                    'Losing jobs to competitors with websites',
                    'Phone number buried on Yelp',
                    'No way to show off your work',
                  ].map((text, i) => (
                    <div key={i} className="compare-row">
                      <div className="compare-icon-bad">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/></svg>
                      </div>
                      <span className="compare-row-text compare-row-text-before">{text}</span>
                    </div>
                  ))}
                  <div className="compare-badge-before">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    Invisible to local customers
                  </div>
                </div>
              </div>

              {/* VS divider */}
              <div className="compare-vs">VS</div>

              {/* After card */}
              <div className="compare-card compare-card-after">
                <div className="compare-card-header compare-card-after" style={{ borderRadius: 0 }}>
                  <div className="compare-card-dots">
                    <div className="compare-dot" style={{ background: 'rgba(255,255,255,0.4)' }} />
                    <div className="compare-dot" style={{ background: 'rgba(255,255,255,0.4)' }} />
                    <div className="compare-dot" style={{ background: 'rgba(255,255,255,0.4)' }} />
                  </div>
                  <div className="compare-card-url compare-url-after">{cfg.name.toLowerCase().replace(/\s+/g, '')}.com</div>
                </div>
                <div className="compare-card-body">
                  {[
                    `Professional website live in 48 hours`,
                    'Customers can find you on Google',
                    'Online booking & quote requests',
                    `Showcase your ${cfg.industryLabel.toLowerCase()} work`,
                    'Phone, email & location always visible',
                    'Built to rank in local search',
                  ].map((text, i) => (
                    <div key={i} className="compare-row compare-row-after">
                      <div className="compare-icon-good">
                        <CheckCircle size={14} color={c.accent} />
                      </div>
                      <span className="compare-row-text compare-row-text-after">{text}</span>
                    </div>
                  ))}
                  <div className="compare-badge-after">
                    <CheckCircle size={12} color="#22c55e" />
                    Ready to get you found &amp; booked
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────── */}
        <section className="section process-bg">
          <div className="section-inner">
            <div className="section-center">
              <p className="section-label">Our Process</p>
              <h2 className="section-h2">How it works</h2>
              <p className="section-intro">Getting started is simple — we handle everything from start to finish.</p>
            </div>
            <div className="process-steps">
              <div className="process-step">
                <div className="process-num">1</div>
                <div className="process-title">Request a Quote</div>
                <p className="process-desc">Fill out our quick form or give us a call. We&apos;ll get back to you within 1 business day with a free, no-obligation estimate.</p>
              </div>
              <div className="process-step">
                <div className="process-num">2</div>
                <div className="process-title">We Assess &amp; Plan</div>
                <p className="process-desc">Our {cfg.proNounSingular} visits your property, reviews the scope, and puts together a clear plan with timeline and pricing.</p>
              </div>
              <div className="process-step">
                <div className="process-num">3</div>
                <div className="process-title">Work Begins</div>
                <p className="process-desc">We show up on time, do the job right, and don&apos;t leave until you&apos;re 100% satisfied. Cleanup is always included.</p>
              </div>
            </div>
          </div>
        </section>

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
                {cfg.googleRating && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 16, padding: '10px 20px', background: '#fff', border: '2px solid #e2e8f0', borderRadius: 999, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{cfg.googleRating} out of 5</span>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={14} color="#f59e0b" fill={i <= Math.round(cfg.googleRating!) ? '#f59e0b' : 'none'} />
                      ))}
                    </div>
                    {cfg.googleReviewCount && (
                      <span style={{ fontSize: 13, color: '#64748b' }}>({cfg.googleReviewCount} reviews)</span>
                    )}
                  </div>
                )}
              </div>
              <div className="testimonials-track-wrap">
                <div className="testimonials-track">
                  {[...cfg.testimonials, ...cfg.testimonials].map((t, i) => (
                    <div key={i} className="testimonial-card">
                      <div className="testimonial-stars">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={14} color={c.accent} fill={c.accent} />
                        ))}
                      </div>
                      <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-location">{t.location}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Google Reviews link */}
              {cfg.mapsPlaceId && (
                <div style={{ textAlign: 'center', marginTop: 32 }}>
                  <a
                    href={`https://www.google.com/maps/place/?q=place_id:${cfg.mapsPlaceId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 24px', background: '#fff', border: '2px solid #e2e8f0', borderRadius: 999, textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'border-color 0.15s' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                      See all {cfg.googleReviewCount ? `${cfg.googleReviewCount} ` : ''}reviews on Google
                    </span>
                    <ArrowRight size={14} color="#64748b" />
                  </a>
                </div>
              )}
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
                {cfg.mapsPlaceId && mapsEmbedKey ? (
                  <div style={{ borderRadius: 20, overflow: 'hidden', border: `2px solid ${c.accentBorder}`, aspectRatio: '4/3', width: '100%' }}>
                    <iframe
                      title="Business location"
                      width="100%"
                      height="100%"
                      style={{ border: 0, display: 'block' }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps/embed/v1/place?key=${mapsEmbedKey}&q=place_id:${cfg.mapsPlaceId}`}
                    />
                  </div>
                ) : (
                  <div className="map-placeholder">
                    <MapPin size={32} color={c.accent} />
                    <div className="map-city">{cfg.serviceArea.city}{cfg.serviceArea.state ? `, ${cfg.serviceArea.state}` : ''}</div>
                    <div className="map-label">{cfg.industryLabel} Services</div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Booking widget ───────────────────────────────── */}
        <section className="section booking-bg">
          <div className="section-inner">
            <div className="booking-grid">
              <div className="booking-form">
                <div className="booking-form-title">Book an Appointment</div>
                <div className="booking-form-sub">Select a date and time that works for you — we&apos;ll confirm within 2 hours.</div>
                <div className="form-group">
                  <label className="form-label">Service</label>
                  <select className="form-input">
                    <option value="">Select a service…</option>
                    {cfg.services.slice(0, 6).map((s, i) => (
                      <option key={i} value={s.title}>{s.title}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input className="form-input" type="date" />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Time</label>
                  <div className="booking-slots">
                    {TIME_SLOTS.map((slot, i) => (
                      <div key={i} className={`time-slot${i === 2 ? ' selected' : ''}`}>{slot}</div>
                    ))}
                  </div>
                </div>
                <button type="button" className="form-submit" style={{ marginTop: 20 }}>
                  <Calendar size={16} style={{ display: 'inline', marginRight: 8 }} />
                  Request Appointment
                </button>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 10, textAlign: 'center' }}>
                  This is a preview — bookings go to {cfg.name}&apos;s team.
                </p>
              </div>
              <div className="booking-info">
                <p className="section-label">Flexible Scheduling</p>
                <h2 className="section-h2" style={{ marginBottom: 32 }}>Book at your convenience</h2>
                <div className="booking-feature">
                  <div className="booking-feature-icon"><Clock size={20} color="#fff" /></div>
                  <div>
                    <div className="booking-feature-title">Same-Day &amp; Next-Day Available</div>
                    <p className="booking-feature-desc">We keep slots open every week so you can get help when you need it most.</p>
                  </div>
                </div>
                <div className="booking-feature">
                  <div className="booking-feature-icon"><Shield size={20} color="#fff" /></div>
                  <div>
                    <div className="booking-feature-title">No Commitment Required</div>
                    <p className="booking-feature-desc">Request a booking and we&apos;ll reach out to confirm — no payment needed upfront.</p>
                  </div>
                </div>
                <div className="booking-feature">
                  <div className="booking-feature-icon"><CheckCircle size={20} color="#fff" /></div>
                  <div>
                    <div className="booking-feature-title">Free On-Site Estimate</div>
                    <p className="booking-feature-desc">Every appointment includes a free estimate. You&apos;ll know exactly what you&apos;re paying before we start.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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

        {/* ── AI Chat callout ──────────────────────────────── */}
        <div style={{ background: '#0f172a', borderTop: '1px solid #1e293b', padding: 'clamp(32px,5vw,48px) clamp(16px,4vw,24px)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 40, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, color: c.accent, marginBottom: 12 }}>Included With Every Site</p>
              <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 14 }}>
                A 24/7 AI assistant answers your customers — even at 2am
              </h2>
              <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, marginBottom: 24 }}>
                Every Fast Websites site comes with an AI chat widget that knows your services, pricing, and location. It captures leads, answers questions, and books appointments while you sleep.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  `"Do you serve ${cfg.serviceArea.city}?" — answered instantly`,
                  `"How much does ${cfg.services[0]?.title ?? cfg.industryLabel} cost?" — answered instantly`,
                  '"Can I book an appointment?" — captured as a lead for you',
                ].map((line, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#cbd5e1' }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: `${c.accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle size={12} color={c.accent} />
                    </div>
                    {line}
                  </div>
                ))}
              </div>
            </div>
            {/* Mini chat preview */}
            <div style={{ background: '#1e293b', borderRadius: 16, overflow: 'hidden', border: '1px solid #334155' }}>
              <div style={{ background: '#0f172a', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #334155' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{cfg.shortName} — AI Assistant</span>
              </div>
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ background: '#334155', borderRadius: '12px 12px 12px 4px', padding: '10px 14px', fontSize: 13, color: '#e2e8f0', maxWidth: '85%' }}>
                  Hi! I can answer questions about our {cfg.industryLabel.toLowerCase()} services in {cfg.serviceArea.city}. What can I help you with? 👋
                </div>
                <div style={{ background: c.accent, borderRadius: '12px 12px 4px 12px', padding: '10px 14px', fontSize: 13, color: '#fff', maxWidth: '85%', alignSelf: 'flex-end' }}>
                  How much does {cfg.services[0]?.title ?? 'your service'} cost?
                </div>
                <div style={{ background: '#334155', borderRadius: '12px 12px 12px 4px', padding: '10px 14px', fontSize: 13, color: '#e2e8f0', maxWidth: '85%' }}>
                  Great question! Our {cfg.services[0]?.title ?? 'service'} pricing starts at {(cfg.pricing?.plans?.[0]?.price) ?? 'a competitive rate'}. Want me to get you a free quote? 🙌
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0f172a', borderRadius: 10, padding: '8px 12px', marginTop: 4, border: '1px solid #334155' }}>
                  <span style={{ fontSize: 12, color: '#475569', flex: 1 }}>Ask a question…</span>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: c.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowRight size={12} color="#fff" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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

      {/* ── Preview chat widget ───────────────────────────── */}
      <PreviewChatWidget biz={{
        name: cfg.name,
        phone: cfg.phone,
        email: cfg.email,
        industry: cfg.industry,
        services: cfg.services,
        city: cfg.serviceArea.city,
        state: cfg.serviceArea.state,
        accentColor: cfg.colors.accent,
      }} />
    </>
  )
}
