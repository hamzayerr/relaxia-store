'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ProductImage from '@/components/common/ProductImage'
import { fetchOrder } from '@/lib/api'
import { isBusinessHours, maskPhone } from '@/lib/utils'
import { PRODUCTS } from '@/lib/products'
import { useCartStore } from '@/lib/store/cartStore'
import Button from '@/components/common/Button'
import StarRating from '@/components/common/StarRating'

interface OrderData {
  order_id: string
  customer_name: string
  phone: string
  city: string
  total_price: number
  items: { product_name: string; quantity: number; unit_price: number; offer_type: string }[]
  created_at: string
}

export default function ThankYouPage() {
  const params = useSearchParams()
  const orderId = params.get('order')
  const [order, setOrder] = useState<OrderData | null>(null)
  const clearCart = useCartStore(s => s.clearCart)

  useEffect(() => { clearCart() }, [clearCart])

  useEffect(() => {
    if (!orderId) return
    fetchOrder(orderId).then(data => setOrder(data as OrderData)).catch(() => {})
  }, [orderId])

  const businessHours = isBusinessHours()
  const name = order?.customer_name || ''
  const phone = order?.phone || ''

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Minimal header */}
      <div className="bg-white border-b border-brand-100 py-4">
        <div className="container-custom flex items-center gap-2">
          <img src="/logo.png" alt="RELAXIA" className="h-9 w-9 object-contain mix-blend-multiply" />
          <span className="font-cairo font-extrabold text-lg text-brand-900">RELAXIA</span>
        </div>
      </div>

      <div className="container-custom py-10 max-w-2xl">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-100 border-4 border-green-500 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-cairo font-extrabold text-4xl text-brand-900 mb-2">
            {name ? `شكرًا ${name}!` : 'شكرًا!'} طلبك وصلنا 🎉
          </h1>
          {orderId && (
            <p className="font-tajawal text-[#4A6555] text-sm">رقم الطلبية: <span className="font-cairo font-bold text-brand-700">{orderId}</span></p>
          )}
        </div>

        {/* Call banner */}
        <div className={`rounded-2xl p-6 mb-6 text-center ${businessHours ? 'bg-gold-500' : 'bg-brand-700'} text-white`}>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          {businessHours ? (
            <>
              <h2 className="font-cairo font-extrabold text-2xl mb-2">سنتصل بك خلال أقل من 10 دقائق!</h2>
              <p className="font-tajawal text-white/90 text-lg mb-1">
                فريقنا سيتصل بك على {phone ? maskPhone(phone) : 'رقمك'} لتأكيد طلبك وعنوانك
              </p>
              <p className="font-tajawal text-white/70 text-sm">⏰ ساعات التواصل: من 9 صباحًا إلى 9 مساءً</p>
            </>
          ) : (
            <>
              <h2 className="font-cairo font-extrabold text-2xl mb-2">طلبك وصلنا بنجاح!</h2>
              <p className="font-tajawal text-white/90 text-lg mb-1">
                سنتصل بك على {phone ? maskPhone(phone) : 'رقمك'} بكرا الصباح لتأكيد طلبك
              </p>
              <p className="font-tajawal text-white/70 text-sm">📅 من الساعة 9 صباحًا</p>
            </>
          )}
        </div>

        {/* Prep tips */}
        <div className="bg-white rounded-2xl border border-brand-100 p-6 mb-6">
          <h3 className="font-cairo font-bold text-xl text-brand-900 mb-4">حضّر نفسك للمكالمة:</h3>
          <div className="space-y-3">
            {[
              '📱 اعمل التليفون قريب منك',
              `✅ تأكد أن الرقم ${phone ? maskPhone(phone) : ''} صحيح ويرد`,
              '🏠 جهّز عنوانك الكامل للتوصيل',
              '💰 الدفع يكون عند الاستلام — ما خسرتيش شي الآن',
            ].map((tip, i) => (
              <p key={i} className="font-tajawal text-brand-900 flex gap-2 items-start">
                <span>{tip}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Order summary */}
        {order && (
          <div className="bg-white rounded-2xl border border-brand-100 p-6 mb-6">
            <h3 className="font-cairo font-bold text-xl text-brand-900 mb-4">ملخص طلبتك:</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-brand-50 last:border-0">
                  <span className="font-tajawal text-brand-900">{item.product_name}</span>
                  <span className="font-cairo font-bold text-brand-700" style={{ direction: 'ltr' }}>
                    {item.unit_price} درهم
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-brand-100">
              <span className="font-cairo font-bold text-lg text-brand-900">المجموع:</span>
              <span className="font-cairo font-extrabold text-2xl text-brand-700" style={{ direction: 'ltr' }}>
                {order.total_price} درهم
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="font-tajawal text-[#4A6555]">التوصيل:</span>
              <span className="text-green-600 font-tajawal">🚚 مجاني</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="font-tajawal text-[#4A6555]">المدينة:</span>
              <span className="font-tajawal text-brand-900">{order.city}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="font-tajawal text-[#4A6555]">طريقة الدفع:</span>
              <span className="font-tajawal text-brand-900">عند الاستلام 💰</span>
            </div>
          </div>
        )}

        {/* Excitement timeline */}
        <div className="bg-brand-50 rounded-2xl p-6 mb-8">
          <h3 className="font-cairo font-bold text-xl text-brand-900 mb-4 text-center">اش كيصراك دابا؟</h3>
          <div className="space-y-3">
            {[
              { icon: '📞', text: 'خلال 10 دقائق — منتصلوا بيك لتأكيد' },
              { icon: '📦', text: 'خلال 2-4 أيام — طلبيتك تصلك' },
              { icon: '🌿', text: 'من الأسبوع الأول — تبدا تحس الفرق' },
              { icon: '✨', text: 'بعد شهر — نتائج حقيقية وملموسة' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <span className="font-tajawal text-brand-900">{s.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mini reviews */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { name: 'فاطمة م.', text: 'وصل في يومين، النتائج من الأسبوع الأول 🌟' },
            { name: 'عبد الله ك.', text: 'الفريق اتصل بسرعة وكانوا لطيفين جداً' },
            { name: 'مريم ع.', text: 'رجعت طلبت مرة ثانية — منتج رائع!' },
          ].map((t, i) => (
            <div key={i} className="bg-white rounded-xl border border-brand-100 p-4 text-center">
              <StarRating rating={5} size="sm" className="justify-center mb-2" />
              <p className="font-tajawal text-xs text-brand-900 mb-2">"{t.text}"</p>
              <p className="font-cairo font-bold text-xs text-[#4A6555]">{t.name}</p>
            </div>
          ))}
        </div>

        {/* Cross-sells */}
        <div>
          <h3 className="font-cairo font-bold text-xl text-brand-900 mb-6 text-center">يمكنك كذلك تجربة:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PRODUCTS.slice(0, 3).map(p => (
              <Link key={p.id} href={`/products/${p.slug}`} className="card p-4 hover:border-brand-300 text-center block">
                <div className="relative h-28 rounded-xl overflow-hidden bg-brand-50 mb-3">
                  <ProductImage src={p.images.hero} alt={p.nameAr} productId={p.id} productNameAr={p.nameAr} productNameFr={p.nameFr} fill />
                </div>
                <p className="font-cairo font-bold text-sm text-brand-900 mb-1">{p.nameAr}</p>
                <p className="font-cairo font-extrabold text-brand-700 text-sm">229 درهم</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-brand-100 mt-10 py-6 text-center">
        <p className="font-tajawal text-sm text-[#4A6555]">© 2026 RELAXIA — relaxia.store</p>
      </div>
    </div>
  )
}
