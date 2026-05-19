import { cn } from '@/lib/utils'
import { Truck, ShieldCheck, Leaf, Package } from 'lucide-react'

interface TrustBadgesProps {
  compact?: boolean
  className?: string
  dark?: boolean
}

const badges = [
  { Icon: Truck,        text: 'الدفع عند الاستلام' },
  { Icon: ShieldCheck,  text: 'ضمان ذهبي 30 يوم' },
  { Icon: Leaf,         text: 'طبيعي 100%' },
  { Icon: Package,      text: 'توصيل 2-4 أيام' },
]

export default function TrustBadges({ compact = false, className, dark = false }: TrustBadgesProps) {
  if (compact) {
    return (
      <div className={cn('flex flex-wrap items-center justify-center gap-3', className)}>
        {badges.map(b => (
          <span key={b.text} className={cn('flex items-center gap-1.5 text-xs font-tajawal', dark ? 'text-white/80' : 'text-[#4A6555]')}>
            <b.Icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{b.text}</span>
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-4 gap-3', className)}>
      {badges.map(b => (
        <div key={b.text} className={cn(
          'flex flex-col items-center gap-1.5 p-3 rounded-xl text-center',
          dark ? 'bg-white/10 text-white' : 'bg-brand-50 text-brand-900'
        )}>
          <b.Icon className={cn('w-6 h-6', dark ? 'text-white' : 'text-brand-700')} />
          <span className="text-xs font-cairo font-semibold">{b.text}</span>
        </div>
      ))}
    </div>
  )
}
