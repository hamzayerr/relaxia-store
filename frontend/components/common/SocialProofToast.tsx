'use client'
import { useEffect, useState } from 'react'

const NAMES = ['سعاد', 'فاطمة', 'خديجة', 'إيمان', 'نادية', 'أسماء', 'ريم']
const CITIES = ['الرباط', 'الدار البيضاء', 'مراكش', 'فاس', 'أكادير', 'طنجة', 'مكناس']

export default function SocialProofToast({ productNameAr }: { productNameAr: string }) {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>

    const show = () => {
      const name = NAMES[Math.floor(Math.random() * NAMES.length)]
      const city = CITIES[Math.floor(Math.random() * CITIES.length)]
      const qty = Math.floor(Math.random() * 2) + 1
      setMessage(`${name} من ${city} طلبت للتو ${qty} قطع من ${productNameAr} 🛒`)
      hideTimer = setTimeout(() => setMessage(null), 5000)
    }

    const interval = setInterval(show, 30000 + Math.random() * 15000)
    const firstShow = setTimeout(show, 10000)

    return () => {
      clearInterval(interval)
      clearTimeout(firstShow)
      clearTimeout(hideTimer)
    }
  }, [productNameAr])

  if (!message) return null

  return (
    <div className="fixed bottom-20 left-3 z-50 max-w-[280px] animate-slide-in-left lg:bottom-6">
      <div className="flex items-center gap-2 bg-white border border-brand-100 shadow-lg rounded-xl px-3 py-2.5">
        <span className="text-xl flex-shrink-0">🛒</span>
        <p className="font-tajawal text-xs text-brand-900 leading-snug">{message}</p>
      </div>
    </div>
  )
}
