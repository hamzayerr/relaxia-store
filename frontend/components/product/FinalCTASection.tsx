'use client'
import { useState } from 'react'
import { type Product, type OfferId, getOfferById } from '@/lib/products'
import OfferSelector from '@/components/common/OfferSelector'
import Button from '@/components/common/Button'
import { useCartStore } from '@/lib/store/cartStore'
import { trackAddToCart } from '@/lib/pixels'
import TrustBadges from '@/components/common/TrustBadges'

export default function FinalCTASection({ product }: { product: Product }) {
  const [selectedOffer, setSelectedOffer] = useState<OfferId>('two')
  const addItem = useCartStore(s => s.addItem)
  const offer = getOfferById(selectedOffer, product.id)

  return (
    <section className="py-16 bg-brand-900 text-white">
      <div className="container-custom">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="font-cairo font-extrabold text-3xl text-white mb-3">{product.taglineAr}</h2>
          <p className="font-tajawal text-white/70 mb-8">الدفع عند الاستلام. ضمان 30 يوم. توصيل مجاني.</p>

          <div className="bg-white/10 rounded-2xl p-6 mb-6">
            <OfferSelector selected={selectedOffer} onChange={setSelectedOffer} productId={product.id} />
          </div>

          <Button
            variant="gold"
            size="xl"
            fullWidth
            onClick={() => {
              addItem(product, selectedOffer)
              trackAddToCart({ productId: product.id, productName: product.nameAr, price: offer.price, quantity: 1 })
            }}
          >
            أضف للسلة — {offer.price} درهم ←
          </Button>

          <div className="mt-6">
            <TrustBadges compact dark />
          </div>
        </div>
      </div>
    </section>
  )
}
