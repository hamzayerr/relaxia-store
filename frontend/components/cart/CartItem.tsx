'use client'
import { Minus, Plus, Trash2 } from 'lucide-react'
import ProductImage from '@/components/common/ProductImage'
import { useCartStore, type CartItem as CartItemType } from '@/lib/store/cartStore'
import { getOfferById } from '@/lib/products'
import { formatPrice } from '@/lib/utils'

export default function CartItem({ item }: { item: CartItemType }) {
  const { removeItem, updateQuantity } = useCartStore()
  const offer = getOfferById(item.offerId)
  const itemTotal = offer.price * item.quantity

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-[#E8E0C8]">
      {/* Image */}
      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-brand-100">
        <ProductImage
          src={item.product.images.hero}
          alt={item.product.nameAr}
          productId={item.product.id}
          productNameAr={item.product.nameAr}
          productNameFr={item.product.nameFr}
          fill
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-cairo font-bold text-brand-900 text-sm truncate">{item.product.nameAr}</p>
        <p className="text-xs text-[#4A6555] font-tajawal">{offer.label}</p>
        <p className="font-cairo font-extrabold text-brand-700 text-sm mt-0.5" style={{ direction: 'ltr' }}>
          {formatPrice(itemTotal)}
        </p>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => updateQuantity(item.product.id, item.offerId, item.quantity - 1)}
          className="w-7 h-7 rounded-lg bg-white border border-brand-200 flex items-center justify-center hover:bg-brand-50 transition-colors"
        >
          {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-500" /> : <Minus className="w-3.5 h-3.5 text-brand-700" />}
        </button>
        <span className="w-6 text-center font-cairo font-bold text-sm">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.product.id, item.offerId, item.quantity + 1)}
          className="w-7 h-7 rounded-lg bg-white border border-brand-200 flex items-center justify-center hover:bg-brand-50 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-brand-700" />
        </button>
      </div>
    </div>
  )
}
