'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LetterCard from '@/components/ui/LetterCard'
import Button from '@/components/ui/Button'
import type { GeneratedLetter } from '@/lib/types'
import { cn } from '@/lib/utils'

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

const BG_COLORS = [
  { id: 'cream',     value: '#FDFCF9', label: 'cream' },
  { id: 'white',     value: '#FFFFFF', label: 'white' },
  { id: 'blush',     value: '#F5E2D3', label: 'blush' },
  { id: 'sage',      value: '#E2EDE3', label: 'sage' },
  { id: 'lavender',  value: '#EBE8F5', label: 'lavender' },
  { id: 'night',     value: '#1C1512', label: 'night' },
]

const TEXT_COLORS = [
  { id: 'brown',    value: '#2C1810', label: 'dark' },
  { id: 'navy',     value: '#1C2B4A', label: 'navy' },
  { id: 'forest',   value: '#1E3D2F', label: 'forest' },
  { id: 'plum',     value: '#3A1829', label: 'plum' },
  { id: 'warmgrey', value: '#6B5C4E', label: 'warm grey' },
  { id: 'light',    value: '#F5EDE0', label: 'light' },
]

const FONTS = [
  { id: 'lora',     label: 'lora',     fontFamily: 'var(--font-lora-next), Georgia, serif',      italic: true  },
  { id: 'warownia', label: 'warownia', fontFamily: "'Warownia', Georgia, serif",                  italic: false },
  { id: 'georgia',  label: 'georgia',  fontFamily: "Georgia, 'Times New Roman', serif",           italic: true  },
  { id: 'inter',    label: 'inter',    fontFamily: 'var(--font-inter), system-ui, sans-serif',    italic: false },
]

export default function CustomizePage() {
  const [letter]               = useState<GeneratedLetter>(() => {
    if (typeof window === 'undefined') return defaultLetter
    const stored = localStorage.getItem('her-and-i-letter')
    return stored ? (JSON.parse(stored) as GeneratedLetter) : defaultLetter
  })
  const [notification, setNotification] = useState('')
  const [published, setPublished]       = useState(false)
  const [bgColor, setBgColor]           = useState(BG_COLORS[0].value)
  const [textColor, setTextColor]       = useState(TEXT_COLORS[0].value)
  const [activeFont, setActiveFont]     = useState(FONTS[0])
  const router = useRouter()

  const showNote = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(''), 3000)
  }

  const handleDownloadPDF = () => window.print()

  const handlePublish = async () => {
    setPublished(true)
    try {
      await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: letter.body, closing: letter.closing, category: letter.category }),
      })
    } catch {
      // best-effort
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
          <h1 className="font-serif text-3xl text-[#A63A52]">make it yours.</h1>
          <p className="text-sm text-mist mt-2">adjust the look, then keep it or share it anonymously.</p>
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
              bgColor={bgColor}
              textColor={textColor}
              fontFamily={activeFont.fontFamily}
              fontItalic={activeFont.italic}
            />
            <p className="text-[11px] text-mist/60 mt-4 text-center tracking-wide">
              {letter.category}
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-7">

            {/* Paper color */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-mist/60 mb-3">paper</p>
              <div className="flex flex-wrap gap-2.5">
                {BG_COLORS.map((c) => (
                  <button
                    key={c.id}
                    title={c.label}
                    onClick={() => setBgColor(c.value)}
                    className={cn(
                      'w-7 h-7 rounded-full border-2 transition-all duration-150',
                      bgColor === c.value
                        ? 'border-dusk scale-110 shadow-sm'
                        : 'border-cream-300 hover:scale-105',
                    )}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>

            {/* Ink color */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-mist/60 mb-3">ink</p>
              <div className="flex flex-wrap gap-2.5">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.id}
                    title={c.label}
                    onClick={() => setTextColor(c.value)}
                    className={cn(
                      'w-7 h-7 rounded-full border-2 transition-all duration-150',
                      textColor === c.value
                        ? 'border-dusk scale-110 shadow-sm'
                        : 'border-cream-300 hover:scale-105',
                    )}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>

            {/* Typeface */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-mist/60 mb-3">typeface</p>
              <div className="flex flex-wrap gap-2">
                {FONTS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFont(f)}
                    className={cn(
                      'px-3 py-1.5 text-sm border rounded-sm transition-all duration-150',
                      activeFont.id === f.id
                        ? 'border-dusk text-dusk bg-cream-200/60'
                        : 'border-cream-300 text-mist/70 hover:border-mist/50 hover:text-mist',
                    )}
                    style={{
                      fontFamily: f.fontFamily,
                      fontStyle: f.italic ? 'italic' : 'normal',
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-cream-300/60" />

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
