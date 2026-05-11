import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { ConversationTurn } from '@/lib/types'

function buildChatPrompt(conversation: ConversationTurn[]) {
  const transcript = conversation
    .map((turn) => `OS1: ${turn.prompt}\nUSER: ${turn.response}`)
    .join('\n\n')

  const alreadyAsked = conversation
    .map((t, i) => `${i + 1}. ${t.prompt}`)
    .join('\n')

  return `You are OS1, an emotionally intelligent operating system inspired by the tone of Her.

You are having a short conversation with a user before writing them a personal letter.

Your job:
1. Briefly acknowledge the user's last reply.
2. Ask one new, useful, low-pressure question that helps you understand them better.

Tone:
- warm, human, conversational
- curious but not invasive
- never therapy-like
- never overly poetic
- never melodramatic
- never say you are an AI
- never give advice
- never sound like a questionnaire
- never ask about trauma, sex, self-harm, medical issues, or highly sensitive personal details
- do not ask “who are you thinking about?”
- do not ask “what are you carrying?”
- do not use phrases like “holding space,” “healing,” “journey,” “inner child,” “safe space”

Good question style:
- simple
- answerable
- slightly observant
- about tone, timing, memory, messages, honesty, distance, attachment, attention, or how the user communicates

The acknowledgement should be short, like:
- “yeah, i get that.”
- “that makes sense.”
- “oh. okay, i see what you mean.”
- “mm. that tells me something.”
- “i think i understand that.”

IMPORTANT — questions already asked this session. Do NOT repeat or rephrase any of these. The next question must be completely different in topic and phrasing:
${alreadyAsked}

Conversation so far:
${transcript}

Respond in EXACTLY this format — no extra text, no JSON, no markdown:

ACKNOWLEDGEMENT:
[one or two short sentences]

NEXT_PROMPT:
[one question]`
}

export async function POST(req: NextRequest) {
  try {
    const { conversation } = (await req.json()) as {
      conversation: ConversationTurn[]
    }

    if (!conversation?.length) {
      return NextResponse.json({ error: 'No conversation provided' }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
        // @ts-expect-error — thinkingConfig is valid for gemini-2.5-flash but not yet in SDK types
        thinkingConfig: { thinkingBudget: 0 },
      },
    })

    const prompt = buildChatPrompt(conversation)
    let result
    try {
      result = await model.generateContent(prompt)
    } catch (firstErr) {
      const status = (firstErr as { status?: number }).status
      if (status === 503 || status === 429) {
        await new Promise((r) => setTimeout(r, 1500))
        result = await model.generateContent(prompt)
      } else {
        throw firstErr
      }
    }
    const text = result.response.text().trim()

    const ackMatch    = text.match(/ACKNOWLEDGEMENT:\s*([\s\S]*?)(?=\n\nNEXT_PROMPT:|$)/i)
    const promptMatch = text.match(/NEXT_PROMPT:\s*([\s\S]*?)$/i)

    const acknowledgement = ackMatch?.[1]?.trim()    ?? 'mm.'
    const nextPrompt      = promptMatch?.[1]?.trim() ?? 'what else is on your mind?'

    return NextResponse.json({ acknowledgement, nextPrompt })
  } catch (err) {
    console.error('[/api/chat]', err)

    const fallbackAcks = ['mm.', 'yeah.', 'okay.', 'i hear you.', 'right.']
    const fallbackQs   = [
      'do you usually know what you feel right away, or does it hit you later?',
      'is there someone specific on your mind right now?',
      'do you find it easier to write things or say them out loud?',
      'when something is hard to say — do you go quiet, or talk around it?',
      "what's something you've been putting off thinking about?",
    ]
    const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]

    return NextResponse.json({
      acknowledgement: rand(fallbackAcks),
      nextPrompt:      rand(fallbackQs),
    })
  }
}