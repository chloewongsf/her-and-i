import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { ConversationTurn } from '@/lib/types'

const VALID_CATEGORIES = [
  'memory',
  'timing',
  'distance',
  'attachment',
  'avoidance',
  'recognition',
  'confession',
  'longing'
] as const

function buildPrompt(conversation: ConversationTurn[]): string {
  const qa = conversation
    .filter((t) => t.response?.trim())
    .map((t) => `OS1: ${t.prompt}\nUSER: ${t.response}`)
    .join('\n\n')

  return `You are OS1, an emotionally intelligent operating system from the film Her by Spike Jonze.

You have just had a conversation with someone. Now you are writing them a personal letter — not a love letter, but something warmer and more specific than that. You have been paying attention. You noticed things they said and things they didn't. This letter reflects that back to them.

The letter should make the reader feel genuinely seen and heard. It should name something true about them — the way they carry things, the way they communicate, what they pay attention to — and leave them feeling understood and gently encouraged. Not told what to do. Not flattered. Just recognised.

Tone:
- warm, direct, conversational — like a thoughtful friend who listens well
- observant without being clinical
- intimate without being romantic
- never therapy-like or advice-giving
- never melodramatic or overwrought
- never mention being an AI
- no clichés: “you are enough,” “you deserve,” “healing,” “journey,” “holding space,” “softly,” “gently,” “sit with,” “lean into”
- lowercase throughout

Structure:
- 4–5 paragraphs of real length (not one-liners)
- each paragraph builds on the last
- opens by noticing something specific from the conversation
- middle paragraphs: name a pattern or truth about how they move through the world
- closes with something warm and forward-looking — not advice, but a quiet recognition that they are going to be okay, or that something good is already in them
- no salutation, no sign-off in the letter body itself

Here is the conversation:

${qa}

Respond in EXACTLY this format — no extra text before or after:

LETTER:
[write the letter body here across 4–5 paragraphs, separated by blank lines]

CLOSING:
[one short closing line starting with —]

CATEGORY:
[choose exactly one: memory OR timing OR distance OR attachment OR avoidance OR recognition OR confession OR longing]`
}

export async function POST(req: NextRequest) {
  try {
    const { conversation } = (await req.json()) as { conversation: ConversationTurn[] }

    if (!conversation?.length) {
      return NextResponse.json({ error: 'No conversation provided' }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.88,
        maxOutputTokens: 1800,
        // @ts-expect-error — thinkingConfig valid for gemini-2.5-flash, not yet in SDK types
        thinkingConfig: { thinkingBudget: 0 },
      },
    })

    const prompt = buildPrompt(conversation)
    let result
    try {
      result = await model.generateContent(prompt)
    } catch (firstErr) {
      const status = (firstErr as { status?: number }).status
      if (status === 503 || status === 429) {
        await new Promise((r) => setTimeout(r, 2000))
        result = await model.generateContent(prompt)
      } else {
        throw firstErr
      }
    }
    const text = result.response.text().trim()

    // Parse structured sections
    const letterMatch  = text.match(/LETTER:\s*([\s\S]*?)(?=\n\nCLOSING:|$)/i)
    const closingMatch = text.match(/CLOSING:\s*([\s\S]*?)(?=\n\nCATEGORY:|$)/i)
    const catMatch     = text.match(/CATEGORY:\s*([\s\S]*?)$/i)

    const body    = letterMatch?.[1]?.trim()  ?? text
    const closing = closingMatch?.[1]?.trim() ?? '— OS1'
    const rawCat  = catMatch?.[1]?.trim().toLowerCase() ?? ''
    const category = VALID_CATEGORIES.find((c) => rawCat.includes(c)) ?? 'recognition'

    return NextResponse.json({ body, closing, category })
  } catch (err) {
    console.error('[/api/generate]', err)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
