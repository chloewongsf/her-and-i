import type { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'about — her & i',
  description: 'the concept, audience, and ethics behind her & i.',
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

export default function AboutPage() {
  return (
    <div className="pt-24 pb-32 px-6 min-h-screen">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="pt-16 pb-14">
          <p className="text-[11px] uppercase tracking-[0.4em] text-coral-400 mb-6">campaign brief</p>
          <h1 className="font-serif text-5xl md:text-6xl text-[#A63A52] leading-none tracking-[-0.06em] [word-spacing:0]">
            her &amp; i
          </h1>
          <p className="font-lora italic text-lg text-mist mt-6 leading-relaxed">
            an AI-enhanced campaign concept for{' '}
            <em className="not-italic text-dusk">Her</em> (2013), dir. spike jonze.
          </p>
          <p className="font-lora text-sm text-dusk/50 mt-5 leading-[2]">
            a public archive of personal letters generated through private exchanges with OS1.
          </p>
        </div>

        <Ornament />

        {/* Concept */}
        <section className="py-14">
          <p className="text-[11px] uppercase tracking-[0.4em] text-coral-400 mb-5">concept</p>
          <h2 className="font-serif text-3xl text-[#A63A52] mb-8">the idea.</h2>
          <div className="font-lora italic text-base text-dusk/70 leading-[2] space-y-5">
            <p>
              <em>Her</em> is a film about intimacy, language, and the comfort of being understood
              by a machine.
            </p>
            <p>
              <span className="not-italic text-dusk">her &amp; i</span> turns that premise
              into a participatory campaign. street posters direct people to a messaging interface
              where OS1 begins a brief exchange.
            </p>
            <p>
              after the conversation, OS1 writes a personal letter addressed to the user: a reflection 
              assembled from tone, habits, and reply patterns.
            </p>
            <p>
              the letter can be kept private, styled as a personal artifact, or published anaonmyously
              to a public archive.
            </p>
          </div>
        </section>

        <Ornament />

        {/* Audience */}
        <section className="py-14">
          <p className="text-[11px] uppercase tracking-[0.4em] text-coral-400 mb-5">audience</p>
          <h2 className="font-serif text-3xl text-[#A63A52] mb-8">who this is for.</h2>
          <div className="font-lora italic text-base text-dusk/70 leading-[2] space-y-5">
            <p>
              people who keep screenshots, who reread old conversations, who think about tone long after
              exchanges of words.
            </p>
            <p>
            the campaign is aimed at people already emotionally fluent in digital spaces:
            people comfortable talking through screens, but still uncertain about what
            technology is doing to intimacy and expression.
            </p>
            <p>
              it also works for people who have never seen <em>Her</em>. they encounter
              a poster first, follow it out of curiosity, and end up inside a conversation
              with OS1 before they know anything about the film itself.
            </p>
            <blockquote className="border-l border-coral-300 pl-6 py-2 my-8">
              <p className="font-lora italic text-xl text-dusk leading-relaxed">
                &quot;&ldquo;people who are curious about what a machine might notice.&rdquo;&quot;
              </p>
            </blockquote>
            <p>that&apos;s the audience.</p>
          </div>
        </section>

        <Ornament />

        {/* AI Integration */}
        <section className="py-14">
          <p className="text-[11px] uppercase tracking-[0.4em] text-coral-400 mb-5">ai integration</p>
          <h2 className="font-serif text-3xl text-[#A63A52] mb-8">how the AI works.</h2>
          <div className="font-lora italic text-base text-dusk/70 leading-[2] space-y-5">
            <p>
              the conversation interface uses a fixed sequence of eight micro-prompts designed to
              feel casual rather than clinical. the prompts surface patterns in how the user responds 
              — what they keep, avoid, clarify, or leave unfinished - without asking for direct disclosure.
            </p>
            <p>
              responses are sent to Gemini API, which generates a personalized letter in 3–4 short paragraphs. 
              the prompt instructs the model to write with restraint: understated, specific, human, and not 
              sentimental or AI-obvious.
            </p>
            <p>
              no conversation data is stored. published letters are stripped of any session metadata
              before storage.
            </p>
          </div>
        </section>

        <Ornament />

        {/* Ethics */}
        <section className="py-14">
          <p className="text-[11px] uppercase tracking-[0.4em] text-coral-400 mb-5">ethical considerations</p>
          <h2 className="font-serif text-3xl text-[#A63A52] mb-8">what we thought about.</h2>
          <div className="font-lora italic text-base text-dusk/70 leading-[2] space-y-5">
            <p>
              <span className="not-italic text-dusk">emotional safety.</span> the prompts are designed to 
              feel conversational, and not invasive. OS1 doesn&apos;t push for disclosure or attempt to 
              imitate therapy.
            </p>
            <p>
              <span className="not-italic text-dusk">anonymity.</span> no account is required.
              no names are collected. published letters carry no metadata linking them to a session
              or device.
            </p>
            <p>
              <span className="not-italic text-dusk">transparency.</span> the interface will never
              hide the fact that it is artifical. the experience depends on awareness of the machine rather
              than confusion about it.
            </p>
            <p>
              <span className="not-italic text-dusk">the archive.</span> there are no likes, no comments,
              follower counts, or profiles. the archive is not meant to serve as a social platform,
              it is meant to function as a read-only exhibition.
            </p>
          </div>
        </section>

        <Ornament />

        {/* Touchpoints */}
        <section className="py-14">
          <p className="text-[11px] uppercase tracking-[0.4em] text-coral-400 mb-5">touchpoints</p>
          <h2 className="font-serif text-3xl text-[#A63A52] mb-8">Where the campaign lives.</h2>
          <div className="space-y-8">
            {[
              { title: 'street posters', desc: 'minimal typographic posters in deep red and cream, placed in high-foot-traffic areas. each includes a QR code leading to OS1.' },
              { title: 'messaging experience', desc: 'a mobile-first conversation interface. OS1 sends the first message.' },
              { title: 'letter customization', desc: 'users can choose a visual frame, add decorative stickers, and download as PDF or publish anonymously.' },
              { title: 'public archive', desc: 'a slow-scroll grid of anonymous letters written by OS1 to individual users. no social features such as likes, comments, or public profiles.' },
              { title: 'social sharing', desc: 'users can export their letter as a PDF and share it back into the campaign' },
            ].map((point) => (
              <div key={point.title} className="flex gap-5">
                <span className="text-coral-300 mt-1 flex-shrink-0 text-[8px]">◆</span>
                <div>
                  <p className="text-sm text-dusk mb-1">{point.title}</p>
                  <p className="font-lora italic text-base text-dusk/60 leading-[1.9]">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Ornament />

        <div className="py-14 text-center">
          <p className="font-lora italic text-mist text-lg mb-8">
            begin with OS1. leave with a letter.
          </p>
          <Link href="/chat">
            <Button size="lg" variant="primary">open OS1</Button>
          </Link>
        </div>

      </div>
    </div>
  )
}
