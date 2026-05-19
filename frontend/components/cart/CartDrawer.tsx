'use client'
import { useCartStore } from '@/lib/store/cartStore'
import { useUIStore } from '@/lib/store/uiStore'
import { X, ShoppingBag } from 'lucide-react'
import Button from '@/components/common/Button'
import CartItem from './CartItem'
import CartUpsell from './CartUpsell'
import TrustBadges from '@/components/common/TrustBadges'
import { formatPrice } from '@/lib/utils'
import { trackInitiateCheckout } from '@/lib/pixels'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function CartDrawer() {
  const { items, isOpen, closeCart, total, itemCount } = useCartStore()
  const openCheckout = useUIStore(s => s.openCheckout)
  const cartTotal = total()
  const count = itemCount()

  const handleCheckout = () => {
    trackInitiateCheckout({ value: cartTotal, numItems: count })
    closeCart()
    openCheckout()
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div className={cn(
        'fixed top-0 left-0 bottom-0 w-full sm:w-[420px] bg-[#EDE8D5] z-50 flex flex-col transition-transform duration-300 border-r border-[#E0D8C0]',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E0D8C0]">
          <h2 className="font-cairo font-bold text-xl text-brand-900">
            سلتي {count > 0 && <span className="text-brand-700">({count})</span>}
          </h2>
          <button onClick={closeCart} className="p-2 rounded-xl hover:bg-brand-50 transition-colors">
            <X className="w-5 h-5 text-brand-700" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
              <ShoppingBag className="w-16 h-16 text-brand-200" />
              <p className="font-cairo font-bold text-xl text-brand-900">سلتك فارغة</p>
              <p className="text-[#4A6555] font-tajawal text-sm">اكتشف منتجاتنا الطبيعية</p>
              <Link href="/products" onClick={closeCart}>
                <Button variant="primary" size="md">اكتشف المنتجات ←</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="p-4 space-y-3">
                {items.map(item => (
                  <CartItem key={`${item.product.id}-${item.offerId}`} item={item} />
                ))}
              </div>

              {/* Cross-sell */}
              <CartUpsell cartProductIds={items.map(i => i.product.id)} />
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E0D8C0] bg-white p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-cairo font-bold text-brand-900 text-lg">المجموع:</span>
              <span className="font-cairo font-extrabold text-brand-700 text-2xl" style={{ direction: 'ltr' }}>
                {cartTotal} درهم
              </span>
            </div>
            <p className="text-xs text-green-600 font-tajawal text-center">🚚 التوصيل مجاني في جميع أنحاء المغرب</p>
            <Button variant="primary" size="lg" fullWidth onClick={handleCheckout}>
              إتمام الطلب — الدفع عند الاستلام ←
            </Button>
            <TrustBadges compact />
          </div>
        )}
      </div>
    </>
  )
}
