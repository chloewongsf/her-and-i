import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { FrameStyle } from '@/lib/types'

interface LetterCardProps {
  body: string
  closing: string
  frame?: FrameStyle
  stickers?: string[]
  id?: string
  className?: string
  bgColor?: string
  textColor?: string
  fontFamily?: string
  fontItalic?: boolean
}

export default function LetterCard({
  body,
  closing,
  frame = 'none',
  stickers = [],
  id,
  className,
  bgColor = '#FDFCF9',
  textColor = '#2C1810',
  fontFamily = 'var(--font-lora-next), Georgia, serif',
  fontItalic = true,
}: LetterCardProps) {
  const dividerColor = textColor === '#FDFCF9' || textColor === '#F5EDE0'
    ? 'rgba(255,255,255,0.15)'
    : 'rgba(44,24,16,0.12)'

  return (
    <div
      id={id}
      className={cn(
        'relative overflow-hidden border border-cream-200/70',
        'shadow-[0_3px_32px_rgba(44,24,16,0.07)]',
        className,
      )}
      style={{ backgroundColor: bgColor }}
    >
      {frame !== 'none' && (
        <Image
          src={`/frames/${frame}.png`}
          alt=""
          aria-hidden
          fill
          className="object-fill pointer-events-none z-10 select-none"
        />
      )}

      {stickers.map((filename, i) => (
        <Image
          key={i}
          src={`/stickers/${filename}`}
          alt=""
          aria-hidden
          width={56}
          height={56}
          className="absolute z-20 object-contain pointer-events-none select-none"
          style={{
            top: `${8 + (i * 19) % 55}%`,
            right: `${4 + (i * 11) % 18}%`,
            transform: `rotate(${[-8, 6, -4, 10, -6, 8][i % 6]}deg)`,
          }}
        />
      ))}

      <div className="relative z-0 px-10 py-12 md:px-14 md:py-16">
        <div className="mb-10 h-px" style={{ backgroundColor: dividerColor }} />

        <p
          className="text-[17px] leading-[2.05] whitespace-pre-line"
          style={{
            color: textColor,
            fontFamily,
            fontStyle: fontItalic ? 'italic' : 'normal',
            opacity: 0.9,
          }}
        >
          {body}
        </p>

        <p
          className="text-sm mt-10"
          style={{
            color: textColor,
            fontFamily,
            fontStyle: fontItalic ? 'italic' : 'normal',
            opacity: 0.6,
          }}
        >
          {closing}
        </p>

        <div className="mt-12 h-px" style={{ backgroundColor: dividerColor }} />
      </div>
    </div>
  )
}