'use client'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cartStore'
import { PRODUCTS } from '@/lib/products'
import ProductImage from '@/components/common/ProductImage'
import StarRating from '@/components/common/StarRating'
import { Plus } from 'lucide-react'
import { trackAddToCart } from '@/lib/pixels'

export default function ProductsGrid() {
  const addItem = useCartStore(s => s.addItem)

  return (
    <section className="py-14">
      <div className="container-custom">
        <div className="text-center mb-10">
          <p className="text-xs font-cairo font-bold text-brand-700 tracking-widest uppercase mb-2">منتجاتنا</p>
          <h2 className="section-heading mb-2">ثلاث علاجات. ثلاث مشاكل. حل سريري واحد.</h2>
          <p className="section-subheading">كل فورمولا مصممة لمشكلة محددة — بمكونات مثبتة ونسب دقيقة</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
          {PRODUCTS.map(p => (
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
              <div className="p-5">
                <h3 className="font-cairo font-extrabold text-xl text-brand-900 mb-1">{p.nameAr}</h3>
                <p className="font-tajawal text-[#4A6555] text-sm leading-relaxed mb-3">{p.taglineAr}</p>
                <StarRating rating={p.rating} count={p.reviewCount} size="sm" className="mb-4" />

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-cairo font-extrabold text-xl text-brand-700">229 درهم</span>
                    <span className="font-cairo text-sm text-gray-400 line-through mr-2">270 درهم</span>
                  </div>
                  <button
                    onClick={() => {
                      addItem(p, 'one')
                      trackAddToCart({ productId: p.id, productName: p.nameAr, price: 229, quantity: 1 })
                    }}
                    className="w-9 h-9 rounded-full bg-brand-700 flex items-center justify-center hover:bg-brand-800 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>

                <Link href={`/products/${p.slug}`}
                  className="block w-full text-center mt-3 text-sm font-cairo font-bold text-brand-700 hover:text-brand-900 transition-colors py-2 border border-brand-200 rounded-xl hover:bg-brand-50">
                  اكتشف التفاصيل
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
