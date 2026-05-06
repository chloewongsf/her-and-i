import type { ConversationTurn } from './types'

export async function generateChatResponse(conversation: ConversationTurn[]): Promise<{
  acknowledgement: string
  nextPrompt: string
}> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversation }),
  })

  if (!res.ok) throw new Error(`Chat API error: ${res.status}`)

  return res.json()
}
