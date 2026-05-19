import { cn } from '@/lib/utils'

interface PriceDisplayProps {
  current: number
  original: number
  perUnit?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm:  { current: 'text-xl', original: 'text-sm', savings: 'text-xs' },
  md:  { current: 'text-2xl', original: 'text-base', savings: 'text-sm' },
  lg:  { current: 'text-3xl', original: 'text-lg', savings: 'text-sm' },
  xl:  { current: 'text-4xl', original: 'text-xl', savings: 'text-base' },
}

export default function PriceDisplay({ current, original, perUnit, size = 'lg', className }: PriceDisplayProps) {
  const savings = original - current
  const s = sizes[size]

  return (
    <div className={cn('flex flex-wrap items-baseline gap-3', className)}>
      <span className={cn('price-current font-cairo font-extrabold text-brand-700', s.current)}>
        {current} درهم
      </span>
      <span className={cn('price-original text-gray-400', s.original)}>
        {original} درهم
      </span>
      <span className={cn('text-green-600 font-cairo font-bold', s.savings)}>
        وفر {savings} درهم
      </span>
      {perUnit && (
        <span className="text-[#4A6555] text-sm font-tajawal">
          ({perUnit} درهم/قطعة)
        </span>
      )}
    </div>
  )
}
