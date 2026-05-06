import { cn } from '@/lib/utils'
import type { FrameStyle } from '@/lib/types'

const frames: { id: FrameStyle; label: string }[] = [
  { id: 'none',    label: 'Plain'   },
  { id: 'frame-1', label: 'Frame 1' },
  { id: 'frame-2', label: 'Frame 2' },
  { id: 'frame-3', label: 'Frame 3' },
  { id: 'frame-4', label: 'Frame 4' },
]

interface FrameSelectorProps {
  selected: FrameStyle
  onSelect: (frame: FrameStyle) => void
}

export default function FrameSelector({ selected, onSelect }: FrameSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      {frames.map((frame) => (
        <button
          key={frame.id}
          onClick={() => onSelect(frame.id)}
          className={cn(
            'flex items-center gap-4 px-4 py-3 rounded-xl border-2 text-left transition-all duration-150',
            selected === frame.id
              ? 'border-coral-400 bg-coral-50'
              : 'border-cream-300 bg-white hover:border-coral-200 hover:bg-cream-50',
          )}
        >
          {/* Preview thumbnail */}
          <div className="w-10 h-12 rounded-sm overflow-hidden flex-shrink-0 bg-[#FDFCF9] border border-cream-200 relative">
            {frame.id !== 'none' ? (
              <img
                src={`/frames/${frame.id}.png`}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-6 h-px bg-cream-300" />
              </div>
            )}
          </div>

          <p className="text-sm text-dusk">{frame.label}</p>
        </button>
      ))}
    </div>
  )
}
