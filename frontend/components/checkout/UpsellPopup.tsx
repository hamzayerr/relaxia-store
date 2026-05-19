'use client'
import { useUIStore } from '@/lib/store/uiStore'
import ProductImage from '@/components/common/ProductImage'
import Button from '@/components/common/Button'
import CountdownTimer from '@/components/common/CountdownTimer'
import { addUpsellToOrder, finalizeOrder } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'

export default function UpsellPopup() {
  const { upsellModalOpen, upsellProduct, currentOrderId, closeUpsell } = useUIStore()
  const router = useRouter()
  const [processing, setProcessing] = useState(false)

  const goToThankYou = useCallback(async (withUpsell = false) => {
    if (!currentOrderId || processing) return
    setProcessing(true)
    try {
      if (!withUpsell) await finalizeOrder(currentOrderId)
      router.push(`/thank-you?order=${currentOrderId}`)
    } finally {
      closeUpsell()
    }
  }, [currentOrderId, processing, router, closeUpsell])

  const handleAccept = async () => {
    if (!currentOrderId || !upsellProduct || processing) return
    setProcessing(true)
    try {
      await addUpsellToOrder(currentOrderId, {
        id: upsellProduct.id,
        nameAr: upsellProduct.nameAr,
        sku: upsellProduct.sku,
      })
      await finalizeOrder(currentOrderId)
      router.push(`/thank-you?order=${currentOrderId}&upsell=true`)
    } catch {
      router.push(`/thank-you?order=${currentOrderId}`)
    } finally {
      closeUpsell()
    }
  }

  const handleExpire = useCallback(() => { goToThankYou(false) }, [goToThankYou])
  const handleDecline = () => { goToThankYou(false) }

  if (!upsellModalOpen || !upsellProduct) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-scale-in">
        {/* Gold header */}
        <div className="bg-gold-500 text-white text-center py-3 px-4">
          <p className="font-cairo font-extrabold text-lg">🎁 عرض خاص لك — لوقت محدود!</p>
        </div>

        <div className="p-6">
          {/* Product image */}
          <div className="relative h-36 rounded-xl overflow-hidden bg-brand-50 mb-4">
            <ProductImage
              src={upsellProduct.images.hero}
              alt={upsellProduct.nameAr}
              productId={upsellProduct.id}
              productNameAr={upsellProduct.nameAr}
              productNameFr={upsellProduct.nameFr}
              fill
            />
          </div>

          <h3 className="font-cairo font-extrabold text-xl text-brand-900 text-center">{upsellProduct.nameAr}</h3>
          <p className="text-center text-[#4A6555] font-tajawal text-sm mt-1">{upsellProduct.taglineAr}</p>

          <p className="text-center text-sm font-tajawal text-brand-700 mt-3 bg-brand-50 rounded-lg p-2">
            "العملاء اللي طلبو من ريلاكسيا اختاروا {upsellProduct.nameAr} كذلك لنتائج أشمل"
          </p>

          {/* Countdown */}
          <div className="mt-4">
            <p className="text-center text-sm text-[#4A6555] font-tajawal mb-2">هذا العرض ينتهي خلال:</p>
            <CountdownTimer seconds={10} onExpire={handleExpire} />
          </div>

          {/* Price */}
          <div className="text-center mt-4">
            <span className="font-cairo font-extrabold text-3xl text-brand-700">229 درهم</span>
            <p className="text-xs text-[#4A6555] font-tajawal mt-0.5">يُضاف لنفس طلبك — الدفع عند الاستلام</p>
          </div>

          {/* CTAs */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleAccept}
            loading={processing}
            className="mt-4"
          >
            ✅ نعم، أضفه لطلبي
          </Button>

          <button
            onClick={handleDecline}
            disabled={processing}
            className="w-full text-center text-sm text-[#4A6555] font-tajawal mt-3 py-2 hover:text-brand-700 transition-colors"
          >
            لا شكرًا، أكمل بدونه
          </button>
        </div>
      </div>
    </div>
  )
}
