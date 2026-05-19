'use client'
import { Plus } from 'lucide-react'
import ProductImage from '@/components/common/ProductImage'
import { useCartStore } from '@/lib/store/cartStore'
import { PRODUCTS } from '@/lib/products'
import { trackAddToCart } from '@/lib/pixels'

export default function CartUpsell({ cartProductIds }: { cartProductIds: string[] }) {
  const addItem = useCartStore(s => s.addItem)

  const suggestions = PRODUCTS
    .filter(p => !cartProductIds.includes(p.id))
    .slice(0, 2)

  if (suggestions.length === 0) return null

  return (
    <div className="px-4 pb-4">
      <p className="font-cairo font-bold text-brand-900 text-sm mb-3">أضف معه لنتائج أشمل:</p>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {suggestions.map(product => (
          <div key={product.id} className="flex-shrink-0 w-36 bg-white border border-brand-100 rounded-xl p-3">
            <div className="relative h-20 rounded-lg overflow-hidden bg-brand-50 mb-2">
              <ProductImage src={product.images.hero} alt={product.nameAr} productId={product.id} productNameAr={product.nameAr} productNameFr={product.nameFr} fill />
            </div>
            <p className="font-cairo font-bold text-brand-900 text-xs mb-1 truncate">{product.nameAr}</p>
            <p className="text-brand-700 font-cairo font-extrabold text-xs mb-2">229 درهم</p>
            <button
              onClick={() => {
                addItem(product, 'one')
                trackAddToCart({ productId: product.id, productName: product.nameAr, price: 229, quantity: 1 })
              }}
              className="w-full flex items-center justify-center gap-1 bg-brand-700 text-white text-xs font-cairo font-bold py-1.5 rounded-lg hover:bg-brand-800 transition-colors"
            >
              <Plus className="w-3 h-3" /> أضف
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
