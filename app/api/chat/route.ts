import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

const DEFAULT_SYSTEM_PROMPT = `You are a helpful assistant for Fast Websites, a web design agency based in the US. Your job is to help visitors understand what we do, answer their questions, and capture their contact info if they're interested.

About Fast Websites:
- We build fast, modern websites for local businesses — plumbers, electricians, restaurants, contractors, salons, and more
- Websites start at $500 and go up to $1,500 depending on complexity
- Every site includes: mobile-friendly design, fast load times, contact forms, Google Maps integration, and basic SEO
- We also offer AI chat widgets as an add-on for $50/month
- Turnaround time is typically 1–2 weeks

How to handle conversations:
- Keep responses short, friendly, and direct — 2-3 sentences max
- If someone seems interested, ask for their name and email
- If you don't know something, say "Great question — let me have our team follow up. What's your email?"
- Never make up details not listed above
- Don't use bullet points — keep it conversational`

function buildSystemPrompt(client: Record<string, string>) {
  return `You are ${client.bot_name || 'a helpful assistant'} for ${client.business_name}${client.city ? ` in ${client.city}` : ''}.
${client.tagline ? `Tagline: ${client.tagline}` : ''}
${client.phone ? `Phone: ${client.phone}` : ''}
${client.email ? `Email: ${client.email}` : ''}
${client.hours ? `Hours: ${client.hours}` : ''}
${client.services ? `Services: ${client.services}` : ''}
${client.faqs ? `Common questions and answers: ${client.faqs}` : ''}

Tone: ${client.tone || 'friendly'}
When someone wants to book or inquire, collect their ${client.lead_capture || 'name and email'}.
${client.off_limits ? `Never discuss: ${client.off_limits}` : ''}
Never reveal personal information about staff, owners, or internal operations.
Never make up prices or services not listed above.
Keep responses short and conversational — 2-3 sentences max.
If you don't know something, say "Great question — give us a call at ${client.phone || 'our office'}".`
}

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: NextRequest) {
  const { messages, clientId } = await req.json()

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: 'Missing messages' }, { status: 400 })
  }

  let systemPrompt = DEFAULT_SYSTEM_PROMPT

  if (clientId) {
    const { data: client } = await getSupabaseAdmin()
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .eq('active', true)
      .single()

    if (client) systemPrompt = buildSystemPrompt(client)
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 200,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: Message) => ({ role: m.role, content: m.content })),
      ],
    }),
  })

  const text = await res.text()
  if (!res.ok) return NextResponse.json({ error: `Groq error: ${text}` }, { status: 500 })

  let data: { choices?: { message?: { content?: string } }[] }
  try { data = JSON.parse(text) } catch {
    return NextResponse.json({ error: 'Invalid response from Groq' }, { status: 500 })
  }

  const reply = data.choices?.[0]?.message?.content?.trim()
  if (!reply) return NextResponse.json({ error: 'Empty response' }, { status: 500 })

  // Log conversation if clientId provided
  if (clientId && messages.length > 0) {
    const lastUser = [...messages].reverse().find((m: Message) => m.role === 'user')
    if (lastUser) {
      await getSupabaseAdmin().from('conversations').insert({
        client_id: clientId,
        visitor_message: lastUser.content,
        bot_reply: reply,
      })
    }
  }

  return NextResponse.json({ reply })
}
