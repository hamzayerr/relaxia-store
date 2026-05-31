'use client'
import { useUIStore } from '@/lib/store/uiStore'
import { useCartStore } from '@/lib/store/cartStore'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/common/Button'
import { createOrder } from '@/lib/api'
import { trackPurchase } from '@/lib/pixels'
import { selectUpsellProduct, getOfferById } from '@/lib/products'
import { generateEventId, formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const schema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  phone: z.string().regex(/^0[5-7]\d{8}$/, 'رقم هاتف مغربي غير صحيح — مثال: 0612345678'),
  city: z.string().min(2, 'الرجاء إدخال المدينة'),
})
type FormData = z.infer<typeof schema>

export default function CheckoutModal() {
  const { checkoutModalOpen, closeCheckout, showUpsell } = useUIStore()
  const { items, total, clearCart } = useCartStore()
  const router = useRouter()
  const cartTotal = total()

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const eventId = generateEventId()
      const order = await createOrder(data, items, cartTotal, eventId)

      trackPurchase({
        orderId: order.order_id,
        value: cartTotal,
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        eventId,
      })

      closeCheckout()

      const upsell = selectUpsellProduct(items.map(i => i.product.id))
      if (upsell) {
        clearCart()
        showUpsell(upsell, order.order_id)
      } else {
        const { finalizeOrder } = await import('@/lib/api')
        await finalizeOrder(order.order_id)
        clearCart()
        router.push(`/thank-you?order=${order.order_id}`)
      }
    } catch {
      setError('root', { message: 'حدث خطأ — حاول مرة أخرى' })
    }
  }

  if (!checkoutModalOpen) return null

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeCheckout} />

      <div className="relative bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        {/* Close */}
        <button onClick={closeCheckout} className="absolute top-4 left-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors z-10">
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-6">
          <h2 className="font-cairo font-extrabold text-2xl text-brand-900 mb-1 text-center">تأكيد طلبك</h2>
          <p className="text-center text-[#4A6555] font-tajawal text-sm mb-5">الدفع عند الاستلام</p>

          {/* Order summary */}
          <div className="bg-brand-50 rounded-xl p-4 mb-5">
            <p className="font-cairo font-bold text-brand-900 text-sm mb-3">ملخص طلبك:</p>
            <div className="space-y-2">
              {items.map(item => {
                const offer = getOfferById(item.offerId)
                return (
                  <div key={`${item.product.id}-${item.offerId}`} className="flex justify-between text-sm">
                    <span className="font-tajawal text-brand-900">{item.product.nameAr} × {offer.label}</span>
                    <span className="font-cairo font-bold text-brand-700" style={{ direction: 'ltr' }}>
                      {offer.price * item.quantity} درهم
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-brand-200 mt-3 pt-3 flex justify-between">
              <span className="font-cairo font-bold text-brand-900">المجموع:</span>
              <span className="font-cairo font-extrabold text-brand-700 text-lg" style={{ direction: 'ltr' }}>
                {formatPrice(cartTotal)}
              </span>
            </div>
            <p className="text-xs text-green-600 font-tajawal mt-1">🚚 التوصيل مجاني</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="field-label">الاسم الكامل *</label>
              <input
                type="text"
                placeholder="مثال: محمد الأمين"
                className={cn('field-input', errors.name && 'error')}
                {...register('name')}
              />
              {errors.name && <p className="field-error">{errors.name.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="field-label">رقم الهاتف *</label>
              <input
                type="tel"
                placeholder="0612345678"
                dir="ltr"
                className={cn('field-input text-left', errors.phone && 'error')}
                {...register('phone')}
              />
              <p className="text-xs text-[#4A6555] font-tajawal mt-1">مثال: 0612345678</p>
              {errors.phone && <p className="field-error">{errors.phone.message}</p>}
            </div>

            {/* City */}
            <div>
              <label className="field-label">المدينة *</label>
              <input
                type="text"
                placeholder="مثال: الدار البيضاء"
                className={cn('field-input', errors.city && 'error')}
                {...register('city')}
              />
              {errors.city && <p className="field-error">{errors.city.message}</p>}
            </div>

            {errors.root && (
              <p className="text-red-500 text-sm font-tajawal text-center bg-red-50 rounded-lg p-2">
                {errors.root.message}
              </p>
            )}

            <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting}>
              {isSubmitting ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب — الدفع عند الاستلام ←'}
            </Button>
          </form>

          {/* Trust */}
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {['🔒 الدفع عند الاستلام', '🏅 ضمان 30 يوم', '🚚 توصيل من 24 إلى 48 ساعة'].map(t => (
              <span key={t} className="text-xs font-tajawal text-[#4A6555]">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
