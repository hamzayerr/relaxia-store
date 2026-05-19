import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  count?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function StarRating({ rating, count, size = 'md', className }: StarRatingProps) {
  const starSizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' }
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(i => (
          <Star
            key={i}
            className={cn(starSizes[size], i <= Math.round(rating) ? 'fill-gold-500 text-gold-500' : 'text-gray-200 fill-gray-200')}
          />
        ))}
      </div>
      <span className={cn('font-cairo font-bold text-brand-700', textSizes[size])}>
        {rating}
      </span>
      {count !== undefined && (
        <span className={cn('text-[#4A6555]', textSizes[size])}>
          ({count.toLocaleString('ar-MA')} تقييم)
        </span>
      )}
    </div>
  )
}
