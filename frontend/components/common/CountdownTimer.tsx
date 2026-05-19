'use client'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface CountdownTimerProps {
  seconds: number
  onExpire: () => void
  className?: string
}

export default function CountdownTimer({ seconds, onExpire, className }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    if (remaining <= 0) { onExpire(); return }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining, onExpire])

  const progress = (remaining / seconds) * 100
  const isUrgent = remaining <= 5

  return (
    <div className={cn('space-y-2', className)}>
      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-1000', isUrgent ? 'bg-red-500' : 'bg-brand-700')}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className={cn('text-center font-cairo font-bold text-2xl tabular-nums', isUrgent ? 'text-red-500' : 'text-brand-700')}>
        {remaining}s
      </p>
    </div>
  )
}
