'use client'

import { useState } from 'react'
import Link from 'next/link'
import ArchiveCard from '@/components/ui/ArchiveCard'
import Button from '@/components/ui/Button'
import { archiveLetters, CATEGORIES } from '@/lib/sampleData'
import type { LetterCategory } from '@/lib/types'
import { cn } from '@/lib/utils'

const ALL = 'all' as const
type Filter = LetterCategory | typeof ALL

export default function ArchivePage() {
  const [activeFilter, setActiveFilter] = useState<Filter>(ALL)

  const filtered =
    activeFilter === ALL
      ? archiveLetters
      : archiveLetters.filter((l) => l.category === activeFilter)

  return (
    <div className="min-h-screen pt-24 pb-32 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="pt-12 mb-16">
          <p className="text-[10px] uppercase tracking-[0.25em] text-coral-500 mb-3">
            public archive
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-dusk leading-tight">
            letters from OS1.
          </h1>
          <p className="font-lora italic text-sm text-mist mt-4 max-w-md leading-relaxed">
            anonymous. no names, no likes, no comments.
          </p>
        </div>

        {/* Filter — bare text links, no chips */}
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
                activeFilter === cat
                  ? 'text-dusk'
                  : 'text-mist/50 hover:text-mist',
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
              <div key={letter.id} className="break-inside-avoid mb-5">
                <ArchiveCard
                  body={letter.body}
                  closing={letter.closing}
                  category={letter.category}
                  timestamp={letter.timestamp}
                  frame={letter.frame}
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
    </div>
  )
}
