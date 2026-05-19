'use client'
import { useState } from 'react'
import type { Product } from '@/lib/products'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FAQSection({ product }: { product: Product }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-14">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          <h2 className="section-heading text-center mb-10">أسئلة شائعة</h2>
          <div className="space-y-3">
            {product.faq.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-brand-100 overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-right"
                >
                  <span className="font-cairo font-bold text-brand-900 text-base">{item.q}</span>
                  <ChevronDown className={cn('w-5 h-5 text-brand-700 flex-shrink-0 transition-transform duration-200', open === i && 'rotate-180')} />
                </button>
                {open === i && (
                  <div className="px-5 pb-5">
                    <p className="font-tajawal text-[#4A6555] leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
