import { cn } from '@/lib/utils'
import type { FrameStyle } from '@/lib/types'

interface ArchiveCardProps {
  body: string
  closing: string
  category: string
  timestamp: string
  frame?: FrameStyle
  className?: string
}

export default function ArchiveCard({
  body,
  closing,
  category,
  className,
}: ArchiveCardProps) {
  return (
    <article
      className={cn(
        'relative bg-[#FDFCF9] px-7 py-8 overflow-hidden',
        'border border-cream-200/60',
        'shadow-[0_2px_16px_rgba(44,24,16,0.045)]',
        className,
      )}
    >
      {/* faint top rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cream-300/80 to-transparent" />

      {/* body */}
      <p className="font-lora italic text-[15px] text-[#2C1810]/85 leading-[2] line-clamp-6">
        {body}
      </p>

      {/* footer */}
      <div className="mt-6 pt-4 border-t border-cream-200/50 flex items-center justify-between gap-4">
        <p className="font-lora italic text-xs text-[#9A8570]">
          {closing}
        </p>

        <p className="text-[10px] uppercase tracking-[0.18em] text-[#C8B9A8] shrink-0">
          {category}
        </p>
      </div>
    </article>
  )
}