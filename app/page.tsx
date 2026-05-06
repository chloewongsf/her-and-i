'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { archiveLetters } from '@/lib/sampleData'

export default function Home() {
  const previewLetters = archiveLetters.slice(0, 3)
    useEffect(() => {
      const sections = ['hero', 'archive-preview', 'how', 'closing']
      let locked = false

      const getCurrentIndex = () => {
        const scrollY = window.scrollY

        return sections.reduce((bestIndex, id, index) => {
          const el = document.getElementById(id)
          const bestEl = document.getElementById(sections[bestIndex])
          if (!el || !bestEl) return bestIndex

          const dist = Math.abs(el.offsetTop - scrollY)
          const bestDist = Math.abs(bestEl.offsetTop - scrollY)

          return dist < bestDist ? index : bestIndex

        }, 0)
      }

      const goTo = (index: number) => {
        const el = document.getElementById(sections[index])
        if (!el) return

        locked = true

        el.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })

        setTimeout(() => {
          locked = false
        }, 1100)
      }

      const onWheel = (e: WheelEvent) => {
        if (locked) {
          e.preventDefault()
          return
        }

        if (Math.abs(e.deltaY) < 50) return

        const current = getCurrentIndex()

        if (e.deltaY > 0 && current < sections.length - 1) {
          e.preventDefault()
          goTo(current + 1)
        } else if (e.deltaY < 0 && current > 0) {
          e.preventDefault()
          goTo(current - 1)
        }
      }

      window.addEventListener('wheel', onWheel, { passive: false })
      return () => window.removeEventListener('wheel', onWheel)
    }, [])
      

  return (
    <main className="overflow-hidden">
    
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-screen scroll-mt-16 flex items-center justify-center overflow-hidden px-6 pt-16"
      >
        <div className="absolute inset-0 bg-cream-100" />
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-coral-100/60 blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-blush/50 blur-[120px] pointer-events-none" />
        <div className="absolute top-2/3 left-1/4 w-[300px] h-[300px] rounded-full bg-cream-300/40 blur-[100px] pointer-events-none" />

        <span
          aria-hidden
          className="absolute select-none pointer-events-none font-serif font-extralight text-[22rem] leading-none text-[#A63A52]/6 -right-16 top-1/2 -translate-y-1/2"
        >
          H
        </span>

        <div className="relative z-10 max-w-2xl text-center">
          <h1
            className="font-serif font-extralight text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] leading-[0.9] tracking-[-0.07em] [word-spacing:0] text-[#A63A52] animate-fade-in"
            style={{ animationDelay: '0.1s', opacity: 0 }}
          >
            her &amp; i
          </h1>

          <p
            className="font-lora italic text-2xl md:text-3xl text-mist mt-8 animate-fade-in"
            style={{ animationDelay: '0.3s', opacity: 0 }}
          >
            conversations with OS1
          </p>

          <p
            className="font-lora italic text-base text-dusk/50 mt-6 max-w-xs mx-auto leading-[2] animate-fade-in"
            style={{ animationDelay: '0.45s', opacity: 0 }}
          >
            private exchanges, written back to you.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center gap-6 justify-center mt-12 animate-fade-in"
            style={{ animationDelay: '0.6s', opacity: 0 }}
          >
            <Link href="/chat">
              <Button 
                size="lg" 
                variant="primary"
                className="bg-[#A85A5F] hover:bg-[#944B50] border-none"
              >
                open OS1
              </Button>
            </Link>
            <Link href="/archive" className="text-sm text-mist hover:text-dusk transition-colors">
              archive →
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dusk animate-bounce">
          <div className="w-px h-10 bg-dusk/20" />
          <span className="text-[10px] tracking-widest uppercase">scroll</span>
        </div>
      </section>

      {/* ── Archive ───────────────────────────────────────────── */}
      <section
        id="archive-preview"
        className="min-h-screen scroll-mt-16 py-28 px-6 flex items-center bg-cream-200/40"
      >
        <div className="max-w-2xl mx-auto w-full">
          <div className="flex items-baseline justify-between mb-16">
            <p className="text-[11px] uppercase tracking-[0.25em] text-coral-400">
              public archive
            </p>
            <Link href="/archive" className="text-sm text-mist/50 hover:text-dusk transition-colors">
              read all →
            </Link>
          </div>

          <div className="space-y-0 divide-y divide-cream-300/50">
            {previewLetters.map((letter) => (
              <div key={letter.id} className="py-12">
                <p className="font-lora italic text-lg text-dusk leading-[2]">
                  {letter.body}
                </p>
                <div className="flex items-baseline justify-between mt-5">
                  <p className="font-lora italic text-sm text-mist/50">{letter.closing}</p>
                  <p className="text-xs text-mist/30 ml-4 shrink-0">{letter.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How ───────────────────────────────────────────────── */}
      <section
        id="how"
        className="min-h-screen scroll-mt-16 py-24 px-6 flex items-center bg-gradient-to-b from-transparent to-cream-200/30"
      >
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start w-full">
          <div className="md:sticky md:top-32">
            <p className="text-[11px] uppercase tracking-[0.25em] text-coral-400 mb-4">what happens</p>
            <p className="font-serif text-4xl md:text-5xl text-[#4A241B] leading-tight">
              scan.<br />respond.<br />leave it behind.<br />(or don&apos;t).
            </p>
          </div>

          <div className="mt-2 space-y-6 font-lora italic text-lg text-dusk/60 leading-[2]">
            <p>
              posters placed throughout the city lead users into a private chat with OS1.
            </p>
            <p>
              the exchange is brief: a sequence of small prompts and replies. nothing asks
              for a confession directly.
            </p>
            <p>
              OS1 uses the conversation to generate a letter. the user can revise it,
              style it, save it, or publish it anonymously.
            </p>
            <p>
              over time, the archive becomes the campaign: a public archive of private
              exchanges.
            </p>
          </div>
        </div>
      </section>

      {/* ── Closing ───────────────────────────────────────────── */}
      <section
        id="closing"
        className="h-screen scroll-mt-16 px-6 flex items-center bg-gradient-to-br from-[#9A5A5A] to-[#7F3F4A]"
      >
        <div className="max-w-lg mx-auto text-center w-full">
          <h2 className="font-serif text-5xl md:text-6xl leading-tight text-cream-50">
            start a correspondence...
          </h2>
          <p className="font-lora italic text-[#F6EEE8]/60 mt-6 text-xl">
            the letter is yours to keep, or leave behind.
          </p>
          <div className="mt-12">
            <Link href="/chat">
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-cream-50 text-[#A63A52] hover:bg-cream-100"
              >
                begin
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
