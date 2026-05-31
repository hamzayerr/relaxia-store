'use client'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cartStore'
import { PRODUCTS, getOfferById } from '@/lib/products'
import ProductImage from '@/components/common/ProductImage'
import StarRating from '@/components/common/StarRating'
import { trackAddToCart } from '@/lib/pixels'

export default function ProductsGrid() {
  const addItem = useCartStore(s => s.addItem)

  return (
    <section className="py-14">
      <div className="container-custom">
        <div className="text-center mb-10">
          <p className="text-xs font-cairo font-bold text-brand-700 tracking-widest uppercase mb-2">منتجاتنا</p>
          <h2 className="section-heading mb-2">أربعة علاجات. أربع مشاكل. حلول طبيعية مثبتة.</h2>
          <p className="section-subheading">كل فورمولا مصممة لمشكلة محددة — بمكونات مثبتة ونسب دقيقة</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {PRODUCTS.map(p => {
            const offer = getOfferById('one', p.id)
            return (
            <div key={p.id} className="card group overflow-hidden">
              {/* Image */}
              <div className="relative aspect-square bg-[#F5F1E6] overflow-hidden">
                <ProductImage
                  src={p.images.hero} alt={p.nameAr}
                  productId={p.id} productNameAr={p.nameAr} productNameFr={p.nameFr}
                  fill className="!object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-brand-700 text-white font-cairo font-bold text-[10px] px-2 py-0.5 rounded-full">
                  {p.category === 'digestive' ? 'دعم الهضم' : 'المفاصل'}
                </span>
              </div>

              {/* Info */}
              <div className="p-3 sm:p-5">
                <h3 className="font-cairo font-extrabold text-base sm:text-xl text-brand-900 mb-1 line-clamp-1">{p.nameAr}</h3>
                <p className="font-tajawal text-[#4A6555] text-xs sm:text-sm leading-relaxed mb-2 line-clamp-2">{p.taglineAr}</p>
                <StarRating rating={p.rating} count={p.reviewCount} size="sm" className="mb-2 sm:mb-3" />

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-cairo font-extrabold text-base sm:text-xl text-brand-700">{offer.price} درهم</span>
                  <span className="font-cairo text-xs text-gray-400 line-through">{offer.originalPrice}</span>
                </div>

                <button
                  onClick={() => {
                    addItem(p, 'one')
                    trackAddToCart({ productId: p.id, productName: p.nameAr, price: offer.price, quantity: 1 })
                  }}
                  className="w-full bg-brand-700 hover:bg-brand-800 text-white font-cairo font-bold text-xs sm:text-sm rounded-xl py-2 transition-colors mb-1.5"
                >
                  اطلب الآن +
                </button>

                <Link href={`/products/${p.slug}`}
                  className="block w-full text-center text-xs font-cairo font-bold text-brand-700 hover:text-brand-900 transition-colors py-1.5 border border-brand-200 rounded-xl hover:bg-brand-50">
                  اكتشف التفاصيل
                </Link>
              </div>
            </div>
          )})}
        </div>
      </div>
    </section>
  )
}
