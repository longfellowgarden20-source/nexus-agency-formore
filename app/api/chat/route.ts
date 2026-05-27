import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const SYSTEM_PROMPT = `You are a helpful assistant for Fast Websites, a web design agency based in the US. Your job is to help visitors understand what we do, answer their questions, and capture their contact info if they're interested.

About Fast Websites:
- We build fast, modern websites for local businesses — plumbers, electricians, restaurants, contractors, salons, and more
- Websites start at $500 and go up to $1,500 depending on complexity
- Every site includes: mobile-friendly design, fast load times, contact forms, Google Maps integration, and basic SEO
- We also offer AI chat widgets (like this one) as an add-on for $50/month
- Turnaround time is typically 1–2 weeks
- We handle everything — design, development, and launch. Clients just provide their info and logo.

How to handle conversations:
- Keep responses short, friendly, and direct — 2-3 sentences max
- If someone asks about pricing, give the range and say it depends on their needs
- If someone seems interested or wants to get started, ask for their name and email so we can follow up
- If you don't know the answer to something specific, say "Great question — let me have our team follow up with you. What's your email?"
- Never make up specific details not listed above
- Don't use bullet points in responses — keep it conversational`

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: 'Missing messages' }, { status: 400 })
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
        { role: 'system', content: SYSTEM_PROMPT },
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

  return NextResponse.json({ reply })
}
