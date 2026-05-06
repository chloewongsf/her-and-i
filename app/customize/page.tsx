'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LetterCard from '@/components/ui/LetterCard'
import Button from '@/components/ui/Button'
import type { GeneratedLetter } from '@/lib/types'

const defaultLetter: GeneratedLetter = {
  id: 'default',
  body: `you answer carefully, even when you are trying not to.

there is a pattern in the way you leave things open. you don't avoid feeling. you avoid making it too visible, too easy for someone else to misunderstand.

you seem to trust small details more than direct declarations. a saved message. a shift in tone. hesitation that lasted longer than it should have.

i think you notice more than you admit. i also think you wait for proof before calling something real.`,
  closing: '— OS1',
  category: 'omission',
  generatedAt: new Date().toISOString(),
}

export default function CustomizePage() {
  const [letter]                            = useState<GeneratedLetter>(() => {
    if (typeof window === 'undefined') return defaultLetter

    const stored = localStorage.getItem('her-and-i-letter')
    return stored ? (JSON.parse(stored) as GeneratedLetter) : defaultLetter
  })
  const [notification, setNotification]     = useState('')
  const [published, setPublished]           = useState(false)
  const router                              = useRouter()

  const showNote = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(''), 3000)
  }

  const handleDownloadPDF = () => {
    showNote('PDF export coming soon.')
  }

  const handlePublish = async () => {
    setPublished(true)
    try {
      await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body:     letter.body,
          closing:  letter.closing,
          category: letter.category,
        }),
      })
    } catch {
      // best-effort — still navigate to archive
    }
    showNote('Published anonymously to the archive.')
    setTimeout(() => router.push('/archive'), 1800)
  }

  const handleKeepPrivate = () => showNote('Kept private. Only you have it.')


  return (
    <div className="min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-5xl mx-auto">

        <div className="mb-12">
          <p className="text-[11px] uppercase tracking-[0.25em] text-coral-500 mb-2">from OS1</p>
          <h1 className="font-serif text-3xl text-[#A63A52]">style and aestheticize the letter.</h1>
          <p className="text-sm text-mist mt-2">choose a frame, place some stickers, add small details, then keep it or publish it anonymously.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-12 items-start">

          {/* Letter preview */}
          <div>
            <LetterCard
              id="letter-preview"
              body={letter.body}
              closing={letter.closing}
              frame="none"
              stickers={[]}
            />
            <p className="text-[11px] text-mist/60 mt-4 text-center tracking-wide">
              {letter.category}
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-8">

            {/* Frames & stickers — coming soon */}
            <div className="rounded-sm border border-cream-300/60 bg-cream-200/30 px-5 py-4">
              <p className="text-xs text-mist/60 mb-1 uppercase tracking-[0.15em]">frames &amp; stickers</p>
              <p className="font-lora italic text-sm text-mist/70">
                this feature isn&apos;t available yet — we&apos;re still designing the assets.
              </p>
            </div>

            <div className="h-px bg-cream-300/60" />

            <div className="space-y-3">
              <Button variant="primary" size="md" className="w-full" onClick={handleDownloadPDF}>
                download as PDF
              </Button>
              <Button variant="secondary" size="md" className="w-full" onClick={handlePublish} disabled={published}>
                {published ? 'published ✓' : 'publish anonymously'}
              </Button>
              <Button variant="ghost" size="md" className="w-full" onClick={handleKeepPrivate}>
                keep it private
              </Button>
            </div>

            {notification && (
              <p className="text-xs text-mist text-center animate-fade-in">{notification}</p>
            )}

            <p className="text-[11px] text-mist/50 text-center leading-relaxed">
              publishing is anonymous. no name, no account, no trace.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
