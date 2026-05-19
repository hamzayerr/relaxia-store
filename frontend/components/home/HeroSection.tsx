import Link from 'next/link'
import Button from '@/components/common/Button'
import StarRating from '@/components/common/StarRating'
import ProductImage from '@/components/common/ProductImage'
import { PRODUCTS } from '@/lib/products'

export default function HeroSection() {
  const hero = PRODUCTS[0] // COLOFLORA as hero product

  return (
    <section className="py-6 sm:py-10">
      <div className="container-custom">
        {/* Announcement pill */}
        <div className="text-center mb-6">
          <span className="inline-block bg-brand-700 text-white font-tajawal text-xs px-4 py-1.5 rounded-full">
            صيدلية طبيعية مرخصة — ضمان 30 يوم أو استرداد كامل
          </span>
        </div>

        {/* Main hero card */}
        <div className="bg-white rounded-3xl overflow-hidden border border-[#E0D8C0] shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Left: Product image */}
            <div className="relative bg-[#F5F1E6] min-h-[300px] md:min-h-[420px] flex items-center justify-center p-8">
              <div className="relative w-full max-w-xs mx-auto aspect-square rounded-2xl overflow-hidden">
                <ProductImage
                  src={hero.images.hero}
                  alt={hero.nameAr}
                  productId={hero.id}
                  productNameAr={hero.nameAr}
                  productNameFr={hero.nameFr}
                  fill
                  priority
                />
              </div>
              {/* Floating trust badge */}
              <div className="absolute bottom-4 right-4 bg-white rounded-xl px-3 py-2 shadow-sm border border-[#E0D8C0] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-tajawal text-xs text-brand-900">متاح للطلب الآن</span>
              </div>
            </div>

            {/* Right: Text */}
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <p className="text-xs font-cairo font-bold text-brand-700 tracking-widest uppercase mb-3">
                RELAXIA — الصحة الطبيعية
              </p>

              <h1 className="font-cairo font-extrabold text-3xl sm:text-4xl text-brand-900 leading-tight mb-4">
                علاجات سريرية،<br />
                <span className="text-brand-700">لصحة تبدأ من الداخل</span>
              </h1>

              <p className="font-tajawal text-[#4A6555] text-base leading-relaxed mb-6">
                ثلاث فورمولات مثبتة من أكثر من 3000 دراسة — تركيبة المكونات والنتائج والضمان كلها معاك.
                توصيل 48 ساعة — ضمان 30 يوم.
              </p>

              {/* Stars */}
              <StarRating rating={4.8} count={3200} size="md" className="mb-6" />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-7">
                {[
                  { num: '+10,000', label: 'عميل' },
                  { num: '30 يوم', label: 'ضمان' },
                  { num: '4.8', label: 'تقييم' },
                ].map(s => (
                  <div key={s.label} className="text-center bg-[#F5F1E6] rounded-xl py-2.5">
                    <p className="font-cairo font-extrabold text-lg text-brand-700">{s.num}</p>
                    <p className="font-tajawal text-xs text-[#4A6555]">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/products" className="flex-1">
                  <Button variant="primary" size="lg" fullWidth>
                    اكتشف العلاجات ←
                  </Button>
                </Link>
                <Link href="/about" className="flex-1">
                  <Button variant="secondary" size="lg" fullWidth>
                    تعرف علينا
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
