import { cn } from '@/lib/utils'
import type { FrameStyle } from '@/lib/types'

interface LetterCardProps {
  body: string
  closing: string
  frame?: FrameStyle
  stickers?: string[]
  id?: string
  className?: string
}

export default function LetterCard({
  body,
  closing,
  frame = 'none',
  stickers = [],
  id,
  className,
}: LetterCardProps) {
  return (
    <div
      id={id}
      className={cn('relative bg-[#FDFCF9] overflow-hidden', className)}
      style={{ boxShadow: '0 4px 60px rgba(44,24,16,0.10), 0 1px 8px rgba(44,24,16,0.05)' }}
    >
      {/* Frame image — decorative overlay from /public/frames/ */}
      {frame !== 'none' && (
        <img
          src={`/frames/${frame}.png`}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-fill pointer-events-none z-10 select-none"
        />
      )}

      {/* Sticker images from /public/stickers/ */}
      {stickers.map((filename, i) => (
        <img
          key={i}
          src={`/stickers/${filename}`}
          alt=""
          aria-hidden
          className="absolute z-20 w-14 h-14 object-contain pointer-events-none select-none"
          style={{
            top:       `${8  + (i * 19) % 55}%`,
            right:     `${4  + (i * 11) % 18}%`,
            transform: `rotate(${[-8, 6, -4, 10, -6, 8][i % 6]}deg)`,
          }}
        />
      ))}

      {/* Letter content */}
      <div className="relative z-0 px-10 py-12 md:px-14 md:py-16">
        {/* Top rule */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-[#D4C4B0]" />
          <span className="text-[#C9A08A] text-[8px] select-none">◆</span>
          <div className="flex-1 h-px bg-[#D4C4B0]" />
        </div>

        {/* Body */}
        <p className="font-lora italic text-lg text-[#2C1810] leading-[2.05] whitespace-pre-line">
          {body}
        </p>

        {/* Closing */}
        <p className="font-lora italic text-base text-[#9A8570] mt-10">
          {closing}
        </p>

        {/* Bottom rule */}
        <div className="flex items-center gap-4 mt-12">
          <div className="flex-1 h-px bg-[#D4C4B0]" />
          <span className="text-[#C9A08A] text-[8px] select-none">◆</span>
          <div className="flex-1 h-px bg-[#D4C4B0]" />
        </div>
      </div>
    </div>
  )
}
