'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ChatBubble from '@/components/ui/ChatBubble'
import Button from '@/components/ui/Button'
import LetterCard from '@/components/ui/LetterCard'
import { generateChatResponse } from '@/lib/generateChatResponse'
import { generateLoveLetter } from '@/lib/generateLetter'
import type { ConversationTurn, GeneratedLetter } from '@/lib/types'

interface Message {
  id: string
  role: 'ai' | 'user'
  text: string
  isTyping?: boolean
}

type Phase = 'chatting' | 'generating' | 'done'

const TYPING_DELAY = 1100
const SEND_GAP    = 350
const MAX_TURNS = 7

const OPENING_PROMPTS = [
  "hi. i'm here. what were you just thinking about? it's ok if it's nothing.",
  "hey. is there something already sitting with you, or did you just end up here?",
  "hi. no pressure. what's something you haven't said out loud today?",
  "hey. what were you thinking about on the way here?",
  "hi. i've been waiting. what's on your mind right now — even if it's small.",
  "hey. before we start — how are you actually doing?",
  "hi. just checking in. is there something you've been carrying around lately?",
  "hey. what's something you've been meaning to think about but keep putting off?",
]

function progressLabel(p: number): string {
  if (p < 25) return 'reading from the exchange...'
  if (p < 55) return 'assembling the letter...'
  if (p < 82) return 'composing...'
  return 'finishing up...'
}

export default function ChatPage() {
  const [messages, setMessages]           = useState<Message[]>([])
  const [inputValue, setInputValue]       = useState('')
  const [firstPrompt]                     = useState(() => OPENING_PROMPTS[Math.floor(Math.random() * OPENING_PROMPTS.length)])
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [turnCount, setTurnCount]         = useState(0)
  const [isAITyping, setIsAITyping]       = useState(false)
  const [conversation, setConversation]   = useState<ConversationTurn[]>([])
  const [phase, setPhase]                 = useState<Phase>('chatting')
  const [generatedLetter, setGeneratedLetter] = useState<GeneratedLetter | null>(null)
  const [notification, setNotification]   = useState('')
  const [progress, setProgress]           = useState(0)

  const messagesEndRef      = useRef<HTMLDivElement>(null)
  const scrollContainerRef  = useRef<HTMLDivElement>(null)
  const inputRef            = useRef<HTMLInputElement>(null)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const router              = useRouter()

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages, phase])

  const deliverAIMessage = useCallback((text: string, id: string) => {
    const typingId = `typing-${id}`
    setIsAITyping(true)
    setMessages((prev) => [...prev, { id: typingId, role: 'ai', text: '', isTyping: true }])
    setTimeout(() => {
      setMessages((prev) =>
        prev.filter((m) => m.id !== typingId).concat({ id, role: 'ai', text }),
      )
      setIsAITyping(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }, TYPING_DELAY)
  }, [])

  const runGeneration = useCallback(async (conv: ConversationTurn[]) => {
    setPhase('generating')
    setProgress(0)

    // Fake progress: inch toward 82% over ~12s, slowing as it approaches
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 82) return prev
        const remaining = 82 - prev
        const step = Math.max(0.4, remaining * 0.045)
        return Math.min(82, prev + step)
      })
    }, 200)

    try {
      const letter = await generateLoveLetter(conv)

      // Snap to 100 then reveal
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      setProgress(100)

      setTimeout(() => {
        setGeneratedLetter(letter)
        setPhase('done')
      }, 400)
    } catch {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      setProgress(0)
      setPhase('chatting')
      setNotification('Something went wrong. Try again.')
    }
  }, [])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      deliverAIMessage(firstPrompt, `ai-first${Date.now()}`)
      setCurrentPrompt(firstPrompt)
    }, 800)
    return () => clearTimeout(timer)
  // firstPrompt is stable (useState initializer, no setter) — safe to omit
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliverAIMessage])

  const handleSend = async () => {
    if (!inputValue.trim() || isAITyping || phase !== 'chatting' || !currentPrompt) return

    const userText      = inputValue.trim()
    setInputValue('')

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', text: userText},
    ])

    const newTurn: ConversationTurn = {
      promptId: `turn-${turnCount + 1}`,
      prompt: currentPrompt,
      response: userText,
    }

    const newConversation = [...conversation, newTurn]
    const nextTurnCount = turnCount + 1

    setConversation(newConversation)
    setTurnCount(nextTurnCount)

    if (nextTurnCount >= MAX_TURNS) {
      setPhase('generating')
      deliverAIMessage('wait. i think i have enough.', `ai-final-${Date.now()}`)
      setTimeout(() => runGeneration(newConversation), TYPING_DELAY + 700)
      return
    } 
    
    try {
      const next = await generateChatResponse(newConversation)

      setTimeout(() => {
        deliverAIMessage(next.acknowledgement, `ai-ack-${Date.now()}`)
        setTimeout(() => {
          deliverAIMessage(next.nextPrompt, `ai-q-${Date.now()}`)
          setCurrentPrompt(next.nextPrompt)
        }, TYPING_DELAY + 400)
      }, SEND_GAP)
    } catch {
      const fallbackPrompts = [
        "what's something you've been meaning to say to someone?",
        'do you find it easier to write things or say them out loud?',
        "is there someone you think about more than you'd expect?",
        'when something is hard to say — do you go quiet, or talk around it?',
      ]
      const fallback = fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)]

      setTimeout(() => {
        deliverAIMessage('mm.', `ai-ack-fallback-${Date.now()}`)
        setTimeout(() => {
          deliverAIMessage(fallback, `ai-q-fallback-${Date.now()}`)
          setCurrentPrompt(fallback)
        }, TYPING_DELAY + 400)
      }, SEND_GAP)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleMakeItYours = () => {
    if (!generatedLetter) return
    localStorage.setItem(
      'her-and-i-letter', 
      JSON.stringify(generatedLetter)
    )

    localStorage.setItem(
      'her-and-i-conversation',
      JSON.stringify(conversation)
    )
    router.push('/customize')
  }

  const handleTryAgain = async () => {
    setGeneratedLetter(null)
    await runGeneration(conversation)
  }

  const handleLikeIt = () => {
    if (!generatedLetter) return
    localStorage.setItem('her-and-i-letter', JSON.stringify(generatedLetter))
    setNotification("saved. it's yours.")
    setTimeout(() => setNotification(''), 2500)
  }

  const isDone        = phase === 'done' && generatedLetter !== null
  const isGenerating  = phase === 'generating'
  const inputDisabled = isAITyping || isGenerating || isDone

  return (
    <div className="h-screen bg-cream-100 flex flex-col overflow-hidden">

      {/* Spacer for the global fixed header */}
      <div className="h-16 flex-shrink-0" />

      {/* Chat sub-header */}
      <div className="flex-shrink-0 bg-cream-100/95 backdrop-blur-md border-b border-cream-300/60 px-6 py-3">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-coral-100 border border-coral-200 flex items-center justify-center flex-shrink-0">
            <span className="text-xs text-coral-600 font-serif italic select-none">1</span>
          </div>
          <div>
            <p className="text-sm font-medium text-dusk leading-none">OS1</p>
            <p className="text-[10px] text-mist/70 mt-0.5">
              {isGenerating ? 'composing...' : isAITyping ? 'typing...' : 'online'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages — scrolls internally, always below the sub-header */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-6">
        <div className="max-w-xl mx-auto flex flex-col justify-end min-h-full gap-4 py-6">

          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              role={msg.role}
              text={msg.text}
              isTyping={msg.isTyping}
            />
          ))}

          {/* Letter generation skeleton */}
          {isGenerating && (
            <div className="mt-10 animate-fade-in">
              <p className="text-[10px] uppercase tracking-[0.2em] text-mist mb-4 text-center">
                {progressLabel(progress)}
              </p>

              {/* Skeleton letter */}
              <div className="relative bg-[#FDFCF9] rounded-sm overflow-hidden shadow-[0_4px_32px_rgba(44,24,16,0.08)]">
                {/* Progress bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-cream-200 z-20">
                  <div
                    className="h-full bg-coral-400 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Skeleton content */}
                <div className="px-10 py-12 md:px-14 md:py-16">
                  {/* Top ornament */}
                  <div className="flex items-center gap-3 mb-10">
                    <div className="flex-1 h-px bg-cream-300/60" />
                    <div className="w-2 h-2 rounded-full bg-cream-300" />
                    <div className="flex-1 h-px bg-cream-300/60" />
                  </div>

                  {/* Shimmer lines simulating letter body */}
                  <div className="space-y-3">
                    {[100, 92, 97, 85, 93, 78, 95, 88, 60].map((w, i) => (
                      <div
                        key={i}
                        className="h-3 rounded-full bg-cream-200 animate-pulse"
                        style={{
                          width: `${w}%`,
                          animationDelay: `${i * 80}ms`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Blank gap */}
                  <div className="h-8" />

                  {/* More lines */}
                  <div className="space-y-3">
                    {[88, 95, 72, 90, 50].map((w, i) => (
                      <div
                        key={i}
                        className="h-3 rounded-full bg-cream-200 animate-pulse"
                        style={{
                          width: `${w}%`,
                          animationDelay: `${(i + 9) * 80}ms`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Closing placeholder */}
                  <div className="mt-10 space-y-2">
                    <div className="h-2.5 rounded-full bg-cream-200/80 animate-pulse w-32" style={{ animationDelay: '1100ms' }} />
                    <div className="h-2.5 rounded-full bg-cream-200/80 animate-pulse w-24" style={{ animationDelay: '1200ms' }} />
                  </div>

                  {/* Bottom ornament */}
                  <div className="flex items-center gap-3 mt-10">
                    <div className="flex-1 h-px bg-cream-300/60" />
                    <div className="w-2 h-2 rounded-full bg-cream-300" />
                    <div className="flex-1 h-px bg-cream-300/60" />
                  </div>
                </div>
              </div>

              {/* Progress % label */}
              <p className="text-[10px] text-mist/50 text-center mt-3 tabular-nums">
                {Math.round(progress)}%
              </p>
            </div>
          )}

          {/* Generated letter reveal */}
          {isDone && (
            <div className="mt-10 animate-slide-up">
              <p className="text-[10px] uppercase tracking-[0.2em] text-mist mb-4 text-center">
                from OS1
              </p>
              <LetterCard
                body={generatedLetter!.body}
                closing={generatedLetter!.closing}
                frame="none"
              />
              <div className="flex flex-wrap gap-3 mt-6">
                <Button variant="primary" onClick={handleMakeItYours}>keep &amp; personalize</Button>
                <Button variant="ghost" onClick={handleTryAgain}>regenerate</Button>
                <Button variant="ghost" onClick={handleLikeIt}>save</Button>
              </div>
              {notification && (
                <p className="text-xs text-mist mt-4 animate-fade-in">{notification}</p>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      {!isDone && (
        <div className="flex-shrink-0 bg-cream-100/95 backdrop-blur-md border-t border-cream-300/60 px-6 py-4">
          <div className="max-w-xl mx-auto flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isGenerating ? 'composing...' :
                isAITyping   ? 'OS1 is typing...' :
                'reply'
              }
              disabled={inputDisabled}
              className="flex-1 bg-white border border-cream-300 rounded-xl px-4 py-3 text-sm text-dusk placeholder:text-mist/60 focus:outline-none focus:border-coral-300 disabled:opacity-50 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || inputDisabled}
              aria-label="Send"
              className="w-11 h-11 bg-coral-500 text-cream-50 rounded-xl flex items-center justify-center disabled:opacity-30 hover:bg-coral-600 active:bg-coral-700 transition-colors flex-shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13.5 8H2.5M8.5 3L13.5 8l-5 5" />
              </svg>
            </button>
          </div>

          {/* Progress dots */}
          <div className="max-w-xl mx-auto flex gap-1.5 justify-center mt-3">
            {Array.from({ length: MAX_TURNS }).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i < turnCount ? 'bg-coral-400 w-3' : 'bg-cream-300 w-1'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
