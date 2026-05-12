'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import ArchiveCard from '@/components/ui/ArchiveCard'
import Button from '@/components/ui/Button'
import { archiveLetters, CATEGORIES } from '@/lib/sampleData'
import type { LetterCategory } from '@/lib/types'
import { cn } from '@/lib/utils'

const ALL = 'all' as const
type Filter = LetterCategory | typeof ALL

interface Letter {
  id: string
  body: string
  closing: string
  category: string
  timestamp: string
  frame: string
}

function LetterModal({ letter, onClose }: { letter: Letter; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const paragraphs = letter.body.split(/\n\n+/)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6 py-12 bg-[#2C1810]/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#FDFCF9] border border-cream-200/60 shadow-[0_8px_48px_rgba(44,24,16,0.12)] px-10 py-12 overflow-y-auto max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-[#9A8570] hover:text-dusk text-xl leading-none transition-colors"
          aria-label="Close"
        >
          ×
        </button>

        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cream-300/80 to-transparent" />

        <div className="space-y-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="font-lora italic text-[15px] text-[#2C1810]/85 leading-[2]">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-8 pt-5 border-t border-cream-200/50 flex items-center justify-between gap-4">
          <p className="font-lora italic text-xs text-[#9A8570]">{letter.closing}</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#C8B9A8] shrink-0">{letter.category}</p>
        </div>
      </div>
    </div>
  )
}

export default function ArchivePage() {
  const [activeFilter, setActiveFilter]   = useState<Filter>(ALL)
  const [selected, setSelected]           = useState<Letter | null>(null)
  const [serverLetters, setServerLetters] = useState<Letter[]>([])
  const [ownLetter]                       = useState<Letter | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const stored = localStorage.getItem('her-and-i-published')
      return stored ? (JSON.parse(stored) as Letter) : null
    } catch { return null }
  })
  const handleClose = useCallback(() => setSelected(null), [])

  useEffect(() => {
    fetch('/api/letters')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setServerLetters(data) })
      .catch(() => {})
  }, [])

  const allLetters: Letter[] = [
    ...(ownLetter ? [ownLetter] : []),
    ...serverLetters,
    ...archiveLetters.map((l) => ({ ...l, frame: l.frame as string })),
  ]

  const filtered =
    activeFilter === ALL
      ? allLetters
      : allLetters.filter((l) => l.category === activeFilter)

  return (
    <div className="min-h-screen pt-24 pb-32 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="pt-12 mb-16">
          <p className="text-[10px] uppercase tracking-[0.25em] text-coral-500 mb-3">
            public archive
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#A63A52] leading-tight">
            letters from OS1.
          </h1>
          <p className="font-lora italic text-sm text-mist mt-4 max-w-md leading-relaxed">
            anonymous. no names, no likes, no comments.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-14 border-b border-cream-300/50 pb-6">
          <button
            onClick={() => setActiveFilter(ALL)}
            className={cn(
              'text-xs transition-colors duration-150',
              activeFilter === ALL ? 'text-dusk' : 'text-mist/50 hover:text-mist',
            )}
          >
            all
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={cn(
                'text-xs transition-colors duration-150',
                activeFilter === cat ? 'text-dusk' : 'text-mist/50 hover:text-mist',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Archive grid */}
        {filtered.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
            {filtered.map((letter) => (
              <div
                key={letter.id}
                className="break-inside-avoid mb-5 cursor-pointer group"
                onClick={() => setSelected(letter)}
              >
                <ArchiveCard
                  body={letter.body}
                  closing={letter.closing}
                  category={letter.category}
                  timestamp={letter.timestamp}
                  frame={letter.frame as 'none'}
                  className="transition-shadow duration-200 group-hover:shadow-[0_4px_24px_rgba(44,24,16,0.09)]"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-lora italic text-mist text-lg">nothing published yet.</p>
            <p className="text-sm text-mist/50 mt-2">open OS1 to generate the first letter.</p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-24 pt-10 border-t border-cream-300/60 text-center">
          <p className="font-lora italic text-mist text-base mb-6">
            begin with OS1. leave with a letter.
          </p>
          <Link href="/chat">
            <Button variant="primary" size="lg">open OS1</Button>
          </Link>
        </div>
      </div>

      {selected && <LetterModal letter={selected} onClose={handleClose} />}
    </div>
  )
}
