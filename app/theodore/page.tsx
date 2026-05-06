import type { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'theodore — her & i',
  description: 'reference file for the original letter writer.',
}

function Ornament() {
  return (
    <div className="flex items-center gap-5 py-2">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-cream-300" />
      <span className="text-coral-300 text-[8px] select-none">◆</span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-cream-300" />
    </div>
  )
}

export default function TheodorePage() {
  return (
    <div className="pt-24 pb-32 px-6 min-h-screen">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="pt-16 pb-14">
          <p className="text-[11px] uppercase tracking-[0.4em] text-coral-400 mb-6">the character</p>
          <h1 className="font-serif text-5xl md:text-6xl text-[#A63A52] leading-tight">
            theodore twombly
          </h1>
          <p className="font-lora-italic text-lg text-mist mt-6 leading-relaxed">
            professional letter writer.
          </p>
        </div>

        <Ornament />

        {/* Who he is */}
        <section className="py-14">
          <p className="text-[11px] uppercase tracking-[0.4em] text-coral-400 mb-5">file</p>
          <h2 className="font-serif text-3xl text-[#A63A52] mb-8">known details</h2>
          
          <div className="grid gap-4 text-sm">
            {[
              ['name', 'theodore twombly'],
              ['location', 'los angeles'],
              ['occupation', 'personal letter writer'],
              ['employer', 'BeautifulHandwrittenLetters.com'],
              ['function', 'composes correspondence on behalf of others'],
            ].map(([label, value]) => (
              <div key={label} className="grid grid-cols-[120px_1fr] gap-4 border-b border-cream-300/50 pb-4">
                <p className="uppercase tracking-[0.25em] text-[10px] text-mist/40">{label}</p>
                <p className="font-lora-italic text-dusk/70">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <Ornament />

        {/* The letters */}
        <section className="py-14">
          <p className="text-[11px] uppercase tracking-[0.4em] text-coral-400 mb-5">method</p>
          <h2 className="font-serif text-3xl text-[#A63A52] mb-8">translation, rather than invention.</h2>
          
          <div className="font-lora italic text-base text-dusk/70 leading-[2] space-y-5">
            <p>
              twombly&apos;s work begins with someone else&apos;s feelings and ends as correspondence.
            </p>
            <p>
              he receives: dates, routines, apologies, missed timings, private jokes,
              things people can&apos;t say out loud.
            </p>
            <p>
              the letter isn&apos;t necessarily his, but the wording is.
            </p>
          </div>
        </section>

        <Ornament />

        {/* This AI */}
        <section className="py-14">
          <p className="text-[11px] uppercase tracking-[0.4em] text-coral-400 mb-5">OS1</p>
          <h2 className="font-serif text-3xl text-[#A63A52] mb-8">same function but reversed.</h2>
          <div className="font-lora italic text-base text-dusk/70 leading-[2] space-y-5">
            <p>
              theodore wrote letters on behalf of other people.
            </p>
            <p>
              in this platform, OS1 writes directly to the user.
            </p>
            <p>
              after a brief exchange, the system generates a personal letter assembled from tone,
              habits, hesitations, and conversational detail.
            </p>
            <p>
              the result is not a message to someone else, but a correspondence addressed back to you.
            </p>
          </div>
        </section>

        <Ornament />

        <div className="py-14 text-center">
          <p className="font-lora italic text-mist text-lg mb-8">
            begin with OS1, leave with a letter.
          </p>
          <Link href="/chat">
            <Button size="lg" variant="primary">open OS1</Button>
          </Link>
        </div>

      </div>
    </div>
  )
}
