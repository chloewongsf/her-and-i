import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-cream-300/60 bg-cream-100 py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        <div>
          <p className="font-serif font-extralight tracking-[-0.03em] text-dusk text-sm">
            her &amp; i
          </p>
          <p className="text-xs text-mist mt-1">
            conversations with OS1.
          </p>
        </div>

        <nav className="flex items-center gap-6 text-xs text-mist">
          <Link href="/chat" className="hover:text-dusk transition-colors">
            open OS1
          </Link>

          <Link href="/archive" className="hover:text-dusk transition-colors">
            archive
          </Link>

          <Link href="/theodore" className="hover:text-dusk transition-colors">
            theodore
          </Link>

          <Link href="/about" className="hover:text-dusk transition-colors">
            about
          </Link>
        </nav>

        <p className="text-xs text-mist/60 text-center md:text-right leading-relaxed">
          anonymous correspondence archive.
          <br />
          no accounts. no public profiles.
        </p>

      </div>
    </footer>
  )
}