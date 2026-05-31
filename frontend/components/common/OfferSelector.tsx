'use client'
import { cn } from '@/lib/utils'
import { OFFERS, type OfferId, getOffersForProduct } from '@/lib/products'
import { Check } from 'lucide-react'

interface OfferSelectorProps {
  selected: OfferId
  onChange: (id: OfferId) => void
  className?: string
  productId?: string
}

export default function OfferSelector({ selected, onChange, className, productId }: OfferSelectorProps) {
  const offers = productId ? getOffersForProduct(productId) : OFFERS
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {offers.map(offer => (
        <button
          key={offer.id}
          onClick={() => onChange(offer.id)}
          className={cn(
            'relative flex items-center justify-between p-4 rounded-xl border-2 text-right transition-all duration-200 cursor-pointer',
            selected === offer.id
              ? 'border-brand-700 bg-brand-50 shadow-md'
              : 'border-brand-100 bg-white hover:border-brand-300'
          )}
        >
          {/* Tag badge */}
          {offer.tag && (
            <span className={cn(
              'absolute -top-2.5 left-3 text-xs font-cairo font-bold px-2 py-0.5 rounded-full',
              offer.popular ? 'bg-gold-500 text-white' : 'bg-brand-700 text-white'
            )}>
              {offer.tag}
            </span>
          )}

          {/* Right: label + quantity info */}
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
              selected === offer.id ? 'border-brand-700 bg-brand-700' : 'border-gray-300'
            )}>
              {selected === offer.id && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </div>
            <div className="text-right">
              <p className="font-cairo font-bold text-brand-900">{offer.label}</p>
              {offer.id !== 'one' && (
                <p className="text-xs text-[#4A6555] font-tajawal">{offer.pricePerUnit} درهم/قطعة</p>
              )}
            </div>
          </div>

          {/* Left: prices */}
          <div className="text-left flex flex-col items-end">
            <span className="font-cairo font-extrabold text-brand-700 text-lg" style={{ direction: 'ltr' }}>
              {offer.price} درهم
            </span>
            <span className="text-xs text-gray-400 line-through font-cairo" style={{ direction: 'ltr' }}>
              {offer.originalPrice} درهم
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
