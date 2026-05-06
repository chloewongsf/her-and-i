interface CampaignStepProps {
  number: string
  title: string
  description: string
  isLast?: boolean
}

export default function CampaignStep({
  number,
  title,
  description,
  isLast,
}: CampaignStepProps) {
  return (
    <div className="flex gap-5">
      {/* Connector column */}
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-full border-2 border-coral-400 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-mono text-coral-600 tracking-wider">
            {number}
          </span>
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-gradient-to-b from-coral-300 to-transparent mt-2 min-h-8" />
        )}
      </div>

      {/* Content */}
      <div className={isLast ? 'pb-0' : 'pb-10'}>
        <h3 className="font-serif text-lg text-dusk leading-tight">
          {title}
        </h3>
        <p className="text-sm text-mist mt-1.5 leading-relaxed max-w-xs">
          {description}
        </p>
      </div>
    </div>
  )
}
