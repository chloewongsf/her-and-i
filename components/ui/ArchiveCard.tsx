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
        'bg-[#FDFCF9] px-7 py-8',
        'shadow-[0_2px_16px_rgba(44,24,16,0.06)]',
        className,
      )}
    >
      <p className="font-lora italic text-base text-[#2C1810] leading-[1.9] line-clamp-6">
        {body}
      </p>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <p className="font-lora italic text-sm text-[#9A8570]">{closing}</p>
        <p className="text-xs text-[#C8B9A8] shrink-0">{category}</p>
      </div>
    </article>
  )
}
