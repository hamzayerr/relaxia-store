'use client'
import { useState } from 'react'
import { useCartStore } from '@/lib/store/cartStore'
import ProductImage from '@/components/common/ProductImage'
import { type Product, type OfferId, getOfferById, OFFERS } from '@/lib/products'
import Button from '@/components/common/Button'
import StarRating from '@/components/common/StarRating'
import OfferSelector from '@/components/common/OfferSelector'
import PriceDisplay from '@/components/common/PriceDisplay'
import TrustBadges from '@/components/common/TrustBadges'
import ScarcityBanner from '@/components/common/ScarcityBanner'
import { trackAddToCart } from '@/lib/pixels'
import { ShieldCheck, Truck, Leaf } from 'lucide-react'

export default function ProductCard({ product }: { product: Product }) {
  const [selectedOffer, setSelectedOffer] = useState<OfferId>('two')
  const [activeImg, setActiveImg] = useState(0)
  const addItem = useCartStore(s => s.addItem)
  const offer = getOfferById(selectedOffer)

  const handleAdd = () => {
    addItem(product, selectedOffer)
    trackAddToCart({ productId: product.id, productName: product.nameAr, price: offer.price, quantity: 1 })
  }

  return (
    <section id="product-heading" className="container-custom py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-brand-50">
            <ProductImage
              src={
                product.id === 'coloflora' && activeImg === 0
                  ? '/images/before-after-coloflora.png'
                  : (product.images.gallery[activeImg] || product.images.hero)
              }
              alt={product.nameAr}
              productId={product.id}
              productNameAr={product.nameAr}
              productNameFr={product.nameFr}
              fill
              priority
            />
          </div>
          {product.images.gallery.length > 1 && (
            <div className="flex gap-2">
              {product.images.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors flex-shrink-0
                    ${activeImg === i ? 'border-brand-700' : 'border-brand-100 hover:border-brand-300'}`}
                >
                  <ProductImage src={img} alt={`صورة ${i + 1}`} productId={product.id} productNameAr={product.nameAr} productNameFr={product.nameFr} fill />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          {/* Badge */}
          <span className="inline-block bg-brand-100 text-brand-700 font-cairo font-bold text-xs px-3 py-1 rounded-full">
            {product.category === 'digestive' ? '🌿 دعم الهضم' : '🦴 صحة المفاصل'}
          </span>

          {/* Name */}
          <h1 className="font-cairo font-extrabold text-3xl sm:text-4xl text-brand-900">
            {product.nameAr}
          </h1>

          {/* Tagline */}
          <p className="font-tajawal text-[#4A6555] text-lg leading-relaxed">{product.taglineAr}</p>

          {/* Stars */}
          <StarRating rating={product.rating} count={product.reviewCount} size="lg" />

          {/* Offer selector */}
          <div>
            <p className="font-cairo font-bold text-brand-900 text-sm mb-2">اختار عرضك:</p>
            <OfferSelector selected={selectedOffer} onChange={setSelectedOffer} />
          </div>

          {/* Price */}
          <PriceDisplay
            current={offer.price}
            original={offer.originalPrice}
            perUnit={offer.id !== 'one' ? offer.pricePerUnit : undefined}
            size="lg"
          />

          {/* Scarcity */}
          <ScarcityBanner />

          {/* CTA */}
          <Button variant="primary" size="xl" fullWidth onClick={handleAdd}>
            أضف للسلة — الدفع عند الاستلام ←
          </Button>

          {/* Mini trust */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { Icon: Truck, text: 'توصيل مجاني' },
              { Icon: ShieldCheck, text: 'ضمان 30 يوم' },
              { Icon: Leaf, text: 'طبيعي 100%' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1 text-center bg-brand-50 rounded-xl p-2">
                <Icon className="w-5 h-5 text-brand-700" />
                <span className="font-tajawal text-xs text-brand-900">{text}</span>
              </div>
            ))}
          </div>

          {/* Details accordion */}
          <details className="group border border-brand-100 rounded-xl">
            <summary className="flex justify-between items-center px-4 py-3 cursor-pointer font-cairo font-bold text-brand-900 text-sm list-none">
              طريقة الاستخدام
              <span className="text-brand-700 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-4 pb-4 space-y-1.5">
              {product.howToUse.map((step, i) => (
                <p key={i} className="font-tajawal text-sm text-[#4A6555] flex gap-2">
                  <span className="text-brand-700 font-bold">{i + 1}.</span> {step}
                </p>
              ))}
            </div>
          </details>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <StickyBar product={product} selectedOffer={selectedOffer} onAdd={handleAdd} />
    </section>
  )
}

function StickyBar({ product, selectedOffer, onAdd }: { product: Product; selectedOffer: OfferId; onAdd: () => void }) {
  const offer = getOfferById(selectedOffer)
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white border-t border-brand-100 shadow-up p-3">
      <div className="flex items-center gap-3 max-w-md mx-auto">
        <div className="flex-1">
          <p className="font-cairo font-bold text-brand-900 text-sm truncate">{product.nameAr}</p>
          <p className="font-cairo font-extrabold text-brand-700 text-base" style={{ direction: 'ltr' }}>
            {offer.price} درهم
          </p>
        </div>
        <Button variant="primary" size="md" onClick={onAdd} className="flex-shrink-0 text-sm">
          أضف للسلة ←
        </Button>
      </div>
    </div>
  )
}
