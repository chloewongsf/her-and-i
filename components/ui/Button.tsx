import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-coral-500 text-cream-50 hover:bg-coral-600 active:bg-coral-700 shadow-sm',
  secondary:
    'bg-cream-200 text-dusk hover:bg-cream-300 active:bg-cream-400',
  ghost:
    'bg-transparent text-dusk hover:bg-cream-200 active:bg-cream-300',
  outline:
    'border border-coral-400 text-coral-600 hover:bg-coral-50 active:bg-coral-100',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-4 py-2 rounded-lg',
  md: 'text-sm px-5 py-2.5 rounded-xl',
  lg: 'text-sm px-7 py-3.5 rounded-xl',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-sans font-medium tracking-wide',
        'transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-300 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100',
        'disabled:opacity-40 disabled:pointer-events-none',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
)

Button.displayName = 'Button'

export default Button
