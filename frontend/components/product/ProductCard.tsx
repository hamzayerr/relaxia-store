'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProductImage from '@/components/common/ProductImage'
import { type Product, type OfferId, getOfferById } from '@/lib/products'
import StarRating from '@/components/common/StarRating'
import OfferSelector from '@/components/common/OfferSelector'
import PriceDisplay from '@/components/common/PriceDisplay'
import ScarcityBanner from '@/components/common/ScarcityBanner'
import { trackAddToCart, trackInitiateCheckout } from '@/lib/pixels'
import { ShieldCheck, Truck, Leaf } from 'lucide-react'
import { createOrder } from '@/lib/api'
import Button from '@/components/common/Button'

const CITIES = ['الدار البيضاء','الرباط','مراكش','فاس','طنجة','أكادير','مكناس','وجدة','تطوان','القنيطرة','سلا','بني ملال','خريبكة','الجديدة','سطات','العرائش','الناظور','آسفي','الحسيمة','تازة']

export default function ProductCard({ product }: { product: Product }) {
  const [selectedOffer, setSelectedOffer] = useState<OfferId>('two')
  const [activeImg, setActiveImg] = useState(0)
  const [form, setForm] = useState({ name: '', phone: '', city: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const offer = getOfferById(selectedOffer)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'أدخل اسمك الكامل'
    if (!/^0[5-7]\d{8}$/.test(form.phone)) e.phone = 'رقم الهاتف غير صحيح'
    if (!form.city.trim()) e.city = 'أدخل مدينتك'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    trackAddToCart({ productId: product.id, productName: product.nameAr, price: offer.price, quantity: 1 })
    trackInitiateCheckout({ value: offer.price, numItems: 1 })
    try {
      const eventId = `order_${Date.now()}`
      const order = await createOrder(form, [{ product, offerId: selectedOffer, quantity: 1 }], offer.price, eventId)
      router.push(`/thank-you?order=${order.order_id}`)
    } catch {
      setLoading(false)
    }
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

          {/* Inline order form */}
          <form id="order-form" onSubmit={handleSubmit} className="space-y-3 bg-brand-50 rounded-2xl p-4 border border-brand-100">
            <p className="font-cairo font-bold text-brand-900 text-sm text-center">أدخل معلوماتك لإتمام الطلب</p>
            <div>
              <input
                type="text" placeholder="الاسم الكامل" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full border border-brand-200 rounded-xl px-4 py-3 font-tajawal text-sm text-right focus:outline-none focus:border-brand-500 bg-white"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 font-tajawal">{errors.name}</p>}
            </div>
            <div>
              <input
                type="tel" placeholder="رقم الهاتف: 06XXXXXXXX" value={form.phone} dir="ltr"
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full border border-brand-200 rounded-xl px-4 py-3 font-tajawal text-sm text-left focus:outline-none focus:border-brand-500 bg-white"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1 font-tajawal">{errors.phone}</p>}
            </div>
            <div>
              <input
                type="text" placeholder="المدينة" value={form.city}
                onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                className="w-full border border-brand-200 rounded-xl px-4 py-3 font-tajawal text-sm text-right focus:outline-none focus:border-brand-500 bg-white"
              />
              {errors.city && <p className="text-red-500 text-xs mt-1 font-tajawal">{errors.city}</p>}
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-brand-700 hover:bg-brand-800 text-white font-cairo font-bold text-lg rounded-2xl py-4 transition-colors disabled:opacity-70"
            >
              {loading ? 'جاري الإرسال...' : `تأكيد الطلب — ${offer.price} درهم ←`}
            </button>
            <p className="text-center font-tajawal text-xs text-[#4A6555]">الدفع عند الاستلام — بدون بطاقة بنكية</p>
          </form>

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
      <StickyBar product={product} selectedOffer={selectedOffer} price={offer.price} />
    </section>
  )
}

function StickyBar({ product, price }: { product: Product; selectedOffer: OfferId; price: number }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white border-t border-brand-100 shadow-up p-3">
      <div className="flex items-center gap-3 max-w-md mx-auto">
        <div className="flex-1">
          <p className="font-cairo font-bold text-brand-900 text-sm truncate">{product.nameAr}</p>
          <p className="font-cairo font-extrabold text-brand-700 text-base" style={{ direction: 'ltr' }}>
            {price} درهم
          </p>
        </div>
        <a href="#order-form" className="bg-brand-700 text-white font-cairo font-bold text-sm rounded-xl px-4 py-2 flex-shrink-0">
          اطلب الآن ←
        </a>
      </div>
    </div>
  )
}
