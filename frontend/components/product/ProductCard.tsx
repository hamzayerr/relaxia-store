'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ProductImage from '@/components/common/ProductImage'
import { type Product, type OfferId, getOfferById } from '@/lib/products'
import StarRating from '@/components/common/StarRating'
import OfferSelector from '@/components/common/OfferSelector'
import PriceDisplay from '@/components/common/PriceDisplay'
import ScarcityBanner from '@/components/common/ScarcityBanner'
import TrustBarMarquee from '@/components/common/TrustBarMarquee'
import SocialProofToast from '@/components/common/SocialProofToast'
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
  const [formVisible, setFormVisible] = useState(false)
  const router = useRouter()
  const offer = getOfferById(selectedOffer, product.id)

  // Hide the sticky mobile CTA when the order form is already on screen
  useEffect(() => {
    const formEl = document.getElementById('order-form')
    if (!formEl) return
    const observer = new IntersectionObserver(
      ([entry]) => setFormVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(formEl)
    return () => observer.disconnect()
  }, [])

  // Track ViewContent when product page loads
  useEffect(() => {
    const price = getOfferById('one', product.id).price
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

  const validateField = (field: 'name' | 'phone' | 'city', value: string): string => {
    if (field === 'name') return value.trim().length < 2 ? 'أدخل اسمك الكامل' : ''
    if (field === 'phone') return !/^0[5-7]\d{8}$/.test(value.trim()) ? 'أدخل رقم هاتف صحيح (مثال: 0612345678)' : ''
    if (field === 'city') return !value.trim() ? 'أدخل مدينتك' : ''
    return ''
  }

  const handleFieldChange = (field: 'name' | 'phone' | 'city', value: string) => {
    setForm(p => ({ ...p, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: validateField(field, value) }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {
      name: validateField('name', form.name),
      phone: validateField('phone', form.phone),
      city: validateField('city', form.city),
    }
    setErrors(errs)
    if (Object.values(errs).some(Boolean)) return
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
    // Note: Purchase event is fired on thank-you page with proper eventID for CAPI deduplication
    // Do NOT fire Purchase here (would cause duplicate events)
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
          {(() => {
            const beforeAfterMap: Record<string, string> = {
              coloflora: '/images/before-after-coloflora.png?v=2',
              flexima: '/images/before-after-flexima.png?v=5',
              pylorex: '/images/before-after-pylorex.png?v=5',
              melanex: '/images/before-after-melanex-hands.png?v=4',
              keranex: '/images/products/keranex/before-after-hands.png?v=1',
            }
            const beforeAfter = beforeAfterMap[product.id]
            if (beforeAfter && activeImg === 0) {
              return (
                <div className="rounded-2xl overflow-hidden bg-brand-50">
                  <Image
                    src={beforeAfter}
                    alt={product.nameAr}
                    width={1200}
                    height={1200}
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="w-full h-auto max-h-[60vh] lg:max-h-none object-cover"
                    priority
                    quality={80}
                  />
                </div>
              )
            }
            return (
              <div className="relative aspect-[3/4] max-h-[60vh] lg:max-h-none rounded-2xl overflow-hidden bg-brand-50">
                <ProductImage
                  src={product.images.gallery[activeImg] || product.images.hero}
                  alt={product.nameAr}
                  productId={product.id}
                  productNameAr={product.nameAr}
                  productNameFr={product.nameFr}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )
          })()}
          {product.images.gallery.length > 1 && (
            <div className="flex gap-2">
              {product.images.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-[72px] h-[72px] min-w-[72px] min-h-[72px] rounded-xl overflow-hidden border-2 transition-colors flex-shrink-0
                    ${activeImg === i ? 'border-green-600' : 'border-brand-100 hover:border-brand-300'}`}
                >
                  <ProductImage src={img} alt={`صورة ${i + 1}`} productId={product.id} productNameAr={product.nameAr} productNameFr={product.nameFr} fill />
                </button>
              ))}
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { label: 'طبيعي', sub: '100%' },
              product.type === 'capsule'
                ? { label: `${product.capsules ?? 30} كبسولة`, sub: 'لكل علبة' }
                : { label: product.volume ?? '50g', sub: 'لكل علبة' },
              { label: 'ضمان', sub: '30 يوم' },
            ].map((b, i) => (
              <div key={i} className="bg-white border border-brand-100 rounded-xl p-2 text-center">
                <p className="font-cairo font-extrabold text-xs text-brand-900 leading-tight">{b.label}</p>
                <p className="font-tajawal text-[10px] text-[#4A6555] mt-0.5">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-3">
          {/* Name (small, above headline) */}
          <h1 className="font-cairo font-bold text-base text-brand-700 mb-0">
            {product.nameAr}
          </h1>

          {/* Headline — big bold tagline */}
          <h2 className="font-cairo font-extrabold text-2xl sm:text-3xl text-brand-900 leading-tight !mt-1">
            {product.taglineAr}
          </h2>

          {/* Description */}
          <p className="font-tajawal text-[#4A6555] text-sm leading-relaxed">{product.subTaglineAr}</p>

          {/* Benefits checklist (per product) */}
          {(() => {
            const benefitsMap: Record<string, string[]> = {
              coloflora: [
                'يدعم الهضم',
                'يخفف الشعور بالنفخة',
                'يساعد على توازن الأمعاء',
                'مكونات طبيعية آمنة',
              ],
              pylorex: [
                'يحارب جرثومة المعدة طبيعيًا',
                'يخفف الحرقة والألم',
                'يدعم بطانة المعدة',
                'مكونات طبيعية 100% آمنة',
              ],
              flexima: [
                'يخفف آلام المفاصل',
                'يقوي العضلات',
                'تأثير سريع ومريح',
                'مكونات طبيعية 100%',
              ],
              melanex: [
                'يحفز الميلانين الطبيعي',
                'يوحد لون البشرة تدريجيًا',
                'ترطيب عميق وآمن',
                'مكونات طبيعية 100% بلا كورتيزون',
              ],
            }
            const benefits = benefitsMap[product.id]
            if (!benefits) return null
            return (
              <ul className="space-y-2">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="font-tajawal text-brand-900 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            )
          })()}

          {/* Stars */}
          <StarRating rating={product.rating} count={product.reviewCount} size="lg" />

          {/* Offer selector */}
          <div>
            <p className="font-cairo font-bold text-brand-900 text-sm mb-2">اختار عرضك:</p>
            <OfferSelector selected={selectedOffer} onChange={setSelectedOffer} productId={product.id} />
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

          {/* Trust bar */}
          <TrustBarMarquee />

          {/* Inline order form */}
          <form id="order-form" onSubmit={handleSubmit} className="space-y-3 bg-brand-50 rounded-2xl p-4 border border-brand-100">
            <p className="font-cairo font-bold text-brand-900 text-sm text-center">أدخل معلوماتك لإتمام الطلب</p>
            <div>
              <label className="block font-cairo font-bold text-brand-900 text-xs mb-1">الاسم الكامل</label>
              <input
                type="text" placeholder="مثال: فاطمة الزهراء" value={form.name}
                onChange={e => handleFieldChange('name', e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 font-tajawal text-sm text-right focus:outline-none bg-white
                  ${form.name === '' ? 'border-brand-200 focus:border-brand-500' : errors.name ? 'border-red-400 focus:border-red-500' : 'border-green-500 focus:border-green-600'}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 font-tajawal">{errors.name}</p>}
            </div>
            <div>
              <label className="block font-cairo font-bold text-brand-900 text-xs mb-1">رقم الهاتف</label>
              <input
                type="tel" placeholder="0612 345 678" value={form.phone} dir="ltr" style={{textAlign: 'right'}}
                onChange={e => handleFieldChange('phone', e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 font-tajawal text-sm focus:outline-none bg-white
                  ${form.phone === '' ? 'border-brand-200 focus:border-brand-500' : errors.phone ? 'border-red-400 focus:border-red-500' : 'border-green-500 focus:border-green-600'}`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1 font-tajawal">{errors.phone}</p>}
            </div>
            <div>
              <label className="block font-cairo font-bold text-brand-900 text-xs mb-1">المدينة</label>
              <input
                type="text" placeholder="مثال: الدار البيضاء" value={form.city}
                onChange={e => handleFieldChange('city', e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 font-tajawal text-sm text-right focus:outline-none bg-white
                  ${form.city === '' ? 'border-brand-200 focus:border-brand-500' : errors.city ? 'border-red-400 focus:border-red-500' : 'border-green-500 focus:border-green-600'}`}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1 font-tajawal">{errors.city}</p>}
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-brand-700 hover:bg-brand-800 text-white font-cairo font-bold text-lg rounded-2xl py-4 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {loading ? 'جاري الإرسال...' : `تأكيد الطلب — ${offer.price} درهم ←`}
            </button>
            <p className="text-center font-tajawal text-xs text-[#4A6555]">✓ معلوماتك آمنة — ما غادي تدفع حتى تستلم</p>
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
      <StickyBar product={product} selectedOffer={selectedOffer} price={offer.price} hidden={formVisible} />

      {/* Social proof toast */}
      <SocialProofToast productNameAr={product.nameAr} />
    </section>
  )
}

function StickyBar({ product, price, hidden }: { product: Product; selectedOffer: OfferId; price: number; hidden: boolean }) {
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white border-t border-brand-100 shadow-up p-3 transition-transform duration-300
      ${hidden ? 'translate-y-full' : 'translate-y-0'}`}>
      <div className="flex items-center gap-3 max-w-md mx-auto">
        <div className="flex-1">
          <p className="font-cairo font-bold text-brand-900 text-sm truncate">{product.nameAr}</p>
          <p className="font-cairo font-extrabold text-brand-700 text-base" style={{ direction: 'ltr' }}>
            {price} درهم
          </p>
        </div>
        <a href="#order-form" className="bg-green-600 hover:bg-green-700 text-white font-cairo font-bold text-sm rounded-xl px-4 py-2 flex-shrink-0">
          اطلب الآن ←
        </a>
      </div>
    </div>
  )
}
