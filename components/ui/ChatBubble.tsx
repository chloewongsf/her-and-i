import { cn } from '@/lib/utils'

interface ChatBubbleProps {
  role: 'ai' | 'user'
  text: string
  isTyping?: boolean
}

export default function ChatBubble({ role, text, isTyping }: ChatBubbleProps) {
  if (role === 'ai') {
    return (
      <div className="flex items-end gap-2.5 max-w-sm animate-fade-in">
        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-coral-100 border border-coral-200 flex-shrink-0 flex items-center justify-center mb-0.5">
          <span className="text-[10px] text-coral-600 font-serif italic select-none">h</span>
        </div>

        <div
          className={cn(
            'bg-white border border-[#EDE2D3] rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm',
            isTyping ? 'py-4' : '',
          )}
        >
          {isTyping ? (
            <div className="flex gap-1.5 items-center">
              {[0, 150, 300].map((delay, i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-mist animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          ) : (
            <p className="text-base text-[#240707] leading-relaxed">{text}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-end animate-fade-in">
      <div className="bg-coral-500 rounded-2xl rounded-br-sm px-4 py-3 max-w-sm">
        <p className="text-base text-cream-50 leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
