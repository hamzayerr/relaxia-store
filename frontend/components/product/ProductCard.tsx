'use client'
import { useState, useEffect } from 'react'
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

  // Track ViewContent when product page loads
  useEffect(() => {
    const price = getOfferById('one').price
    // Facebook ViewContent
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_ids: [product.id],
        content_name: product.nameAr,
        content_type: 'product',
        value: price,
        currency: 'MAD'
      })
    }
    // TikTok ViewContent
    if (typeof window !== 'undefined' && (window as any).ttq) {
      (window as any).ttq.track('ViewContent', {
        content_id: product.id,
        content_name: product.nameAr,
        value: price,
        currency: 'MAD'
      })
    }
  }, [product.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'أدخل اسمك'
    if (form.phone.trim().length < 9) errs.phone = 'أدخل رقم هاتفك'
    if (!form.city.trim()) errs.city = 'أدخل مدينتك'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try { trackAddToCart({ productId: product.id, productName: product.nameAr, price: offer.price, quantity: 1 }) } catch {}
    try { trackInitiateCheckout({ value: offer.price, numItems: 1 }) } catch {}
    try {
      if ((window as any).ttq) {
        (window as any).ttq.track('AddToCart', { content_id: product.id, value: offer.price, currency: 'MAD' })
        (window as any).ttq.track('PlaceAnOrder', { value: offer.price, currency: 'MAD' })
      }
      if ((window as any).fbq) {
        (window as any).fbq('track', 'AddToCart', { content_ids: [product.id], value: offer.price, currency: 'MAD' })
        (window as any).fbq('track', 'InitiateCheckout', { value: offer.price, currency: 'MAD', num_items: 1 })
      }
    } catch {}
    // Generate order ID immediately
    const d = new Date()
    const orderId = `RLX-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${Math.floor(1000 + Math.random() * 9000)}`
    // Send to sheets in background
    createOrder(form, [{ product, offerId: selectedOffer, quantity: 1 }], offer.price, orderId).catch(() => {})
    // Facebook Purchase event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', { value: offer.price, currency: 'MAD', content_ids: [product.id], content_type: 'product' })
    }
    // Redirect after React render cycle
    setTimeout(() => {
      window.location.href = `/thank-you?order=${orderId}&phone=${encodeURIComponent(form.phone)}&name=${encodeURIComponent(form.name)}&price=${offer.price}&pid=${product.id}`
    }, 100)
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
                type="tel" placeholder="0612345678" value={form.phone} dir="ltr" style={{textAlign: 'right'}}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full border border-brand-200 rounded-xl px-4 py-3 font-tajawal text-sm focus:outline-none focus:border-brand-500 bg-white"
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

          {/* طريقة الاستخدام */}
          <div className="border border-brand-100 rounded-xl p-4 bg-brand-50">
            <p className="font-cairo font-bold text-brand-900 text-sm mb-4 text-center">طريقة الاستخدام</p>
            <div className="flex items-start justify-between gap-2">
              {product.howToUse.map((step, i) => (
                <div key={i} className="flex-1 flex flex-col items-center text-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-brand-700 text-white font-cairo font-extrabold text-sm flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <p className="font-tajawal text-xs text-brand-900 leading-snug">{step}</p>
                  {i < product.howToUse.length - 1 && (
                    <div className="hidden" />
                  )}
                </div>
              ))}
            </div>
          </div>
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
