export type FrameStyle = 'none' | 'frame-1' | 'frame-2' | 'frame-3' | 'frame-4'

export type LetterCategory =
  | 'memory'
  | 'timing'
  | 'distance'
  | 'attachment'
  | 'avoidance'
  | 'recognition'
  | 'confession'
  | 'longing'

export interface ArchiveLetter {
  id: string
  body: string
  closing: string
  category: LetterCategory
  timestamp: string
  frame: FrameStyle
}

export interface ConversationTurn {
  promptId: string
  prompt: string
  response: string
}

export interface GeneratedLetter {
  id: string
  body: string
  closing: string
  category: string
  generatedAt: string
}
