import type { ConversationTurn, GeneratedLetter } from './types'

export async function generateLoveLetter(
  conversation: ConversationTurn[],
): Promise<GeneratedLetter> {
  const res = await fetch('/api/generate', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ conversation }),
  })

  if (!res.ok) throw new Error(`Generation failed: ${res.status}`)

  const { body, closing, category } = await res.json()

  return {
    id:          `letter-${Date.now()}`,
    body,
    closing,
    category,
    generatedAt: new Date().toISOString(),
  }
}
