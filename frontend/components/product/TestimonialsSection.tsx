import type { Product } from '@/lib/products'
import StarRating from '@/components/common/StarRating'

export default function TestimonialsSection({ product }: { product: Product }) {
  return (
    <section className="py-14">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="section-heading mb-3">آراء عملاؤنا الحقيقيين</h2>
          <StarRating rating={product.rating} count={product.reviewCount} size="lg" className="justify-center" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {product.testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-brand-100 shadow-sm">
              <StarRating rating={t.rating} size="sm" className="mb-3" />
              <p className="font-tajawal text-brand-900 leading-relaxed mb-4 text-sm">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-700 flex items-center justify-center">
                  <span className="text-white font-cairo font-bold text-sm">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-cairo font-bold text-brand-900 text-sm">{t.name}</p>
                  <p className="font-tajawal text-xs text-[#4A6555]">{t.city}</p>
                </div>
                <span className="mr-auto text-xs bg-gold-500/10 text-gold-700 font-cairo font-bold px-2 py-0.5 rounded-full">
                  ✓ مشتري موثق
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
