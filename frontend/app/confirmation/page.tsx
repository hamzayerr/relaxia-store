'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ConfirmationContent() {
  const params = useSearchParams()
  const name = params.get('name') || ''
  const phone = params.get('phone') || ''
  const city = params.get('city') || ''
  const quantity = Number(params.get('quantity') || '1')
  const totalPrice = Number(params.get('totalPrice') || '0')

  const [orderId] = useState(() => `#RLX-${Math.floor(10000 + Math.random() * 90000)}`)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText(orderId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const steps = [
    { icon: '✅', label: 'تم الطلب', active: true },
    { icon: '⏳', label: 'تأكيد', active: false },
    { icon: '🚚', label: 'جاري التوصيل', active: false },
    { icon: '💵', label: 'استلام ودفع', active: false },
  ]

  return (
    <div className="min-h-screen bg-[#f0fdf4] py-8 px-4" dir="rtl">
      <div className="max-w-[480px] mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">

        {/* Animation succès */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-20 h-20 rounded-full bg-[#16a34a] flex items-center justify-center animate-success-pop">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-cairo font-extrabold text-2xl text-gray-900">
            شكرًا {name || 'بزاف'}! طلبك وصلنا 🎉
          </h1>
        </div>

        {/* Numéro de commande */}
        <button
          onClick={handleCopy}
          className="w-full bg-gray-100 rounded-xl px-4 py-3 text-center font-cairo font-bold text-gray-700 hover:bg-gray-200 transition-colors"
        >
          {orderId}
          <span className="block text-xs font-tajawal text-gray-400 mt-1">
            {copied ? 'تم النسخ ✓' : 'اضغط للنسخ'}
          </span>
        </button>

        {/* Résumé commande */}
        <div className="border border-gray-100 rounded-xl p-4 space-y-2 font-tajawal text-sm text-gray-700">
          <div className="flex justify-between">
            <span>كيرانكس × {quantity} قطعة</span>
            <span className="font-bold">{totalPrice} درهم</span>
          </div>
          {city && (
            <div className="flex justify-between">
              <span>المدينة</span>
              <span className="font-bold">{city}</span>
            </div>
          )}
          {phone && (
            <div className="flex justify-between">
              <span>رقم الهاتف</span>
              <span className="font-bold" dir="ltr">{phone}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>طريقة الدفع</span>
            <span className="font-bold">عند الاستلام 💵</span>
          </div>
        </div>

        {/* Bloc rassurant */}
        <div className="bg-[#f0fdf4] border border-green-100 rounded-xl p-4 space-y-2 font-tajawal text-sm text-gray-700">
          <p>📞 سنتواصل معك قريبًا لتأكيد طلبك</p>
          <p>💰 الدفع فقط عند الاستلام — ما غادي تدفع حتى توصلك السلعة</p>
          <p>🛡️ إلا ما عجبكش — عندك ضمان 30 يوم كامل</p>
        </div>

        {/* Timeline livraison */}
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={i} className="flex-1 flex flex-col items-center text-center gap-1.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base
                ${step.active ? 'bg-[#16a34a] text-white' : 'bg-gray-100 text-gray-400'}`}>
                {step.icon}
              </div>
              <span className={`text-[10px] font-tajawal leading-tight ${step.active ? 'text-[#16a34a] font-bold' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Bouton WhatsApp */}
        <a
          href="https://wa.me/212600000000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5a] text-white font-cairo font-bold rounded-xl py-3.5 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.149-.149.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.05-.52-.099-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.057 3.146 4.983 4.287 2.927 1.142 2.927.762 3.453.714.527-.05 1.758-.718 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12.04 0C5.388 0 0 5.388 0 12.04c0 2.13.557 4.13 1.527 5.875L0 24l6.273-1.646A11.98 11.98 0 0 0 12.04 24.08c6.652 0 12.04-5.388 12.04-12.04S18.692 0 12.04 0zm0 22.06c-1.95 0-3.857-.522-5.524-1.512l-.396-.234-3.715.973.99-3.62-.257-.41A9.99 9.99 0 0 1 2.06 12.04c0-5.5 4.48-9.98 9.98-9.98 5.5 0 9.98 4.48 9.98 9.98 0 5.5-4.48 9.98-9.98 9.98z" />
          </svg>
          تواصل معنا على واتساب
        </a>

        {/* Paiement à la livraison */}
        <p className="text-center font-tajawal text-xs text-gray-500">
          الدفع فقط عند الاستلام — بدون بطاقة
        </p>

        {/* CTA discret */}
        <Link
          href="/products"
          className="block text-center font-tajawal text-sm text-[#16a34a] hover:underline"
        >
          اكتشفي منتجاتنا الأخرى ←
        </Link>
      </div>

      <style>{`
        @keyframes success-pop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          80% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .animate-success-pop {
          animation: success-pop 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmationContent />
    </Suspense>
  )
}
