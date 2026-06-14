'use client'
import { useState } from 'react'
import Link from 'next/link'
import ProductImage from '@/components/common/ProductImage'
import { useCartStore } from '@/lib/store/cartStore'
import { PRODUCTS, OFFERS, type OfferId, getOfferById } from '@/lib/products'
import Button from '@/components/common/Button'
import StarRating from '@/components/common/StarRating'
import TrustBarSection from '@/components/home/TrustBarSection'
import { trackAddToCart } from '@/lib/pixels'

function ProductFullCard({ product }: { product: typeof PRODUCTS[0] }) {
  const [offer, setOffer] = useState<OfferId>('two')
  const addItem = useCartStore(s => s.addItem)
  const selectedOffer = getOfferById(offer)

  return (
    <div className="card overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square md:aspect-auto md:h-auto md:min-h-[320px] bg-brand-50">
          <ProductImage src={product.images.hero} alt={product.nameAr} productId={product.id} productNameAr={product.nameAr} productNameFr={product.nameFr} fill className="!object-contain p-3" />
        </div>

        {/* Info */}
        <div className="p-6 space-y-4">
          <span className={`inline-block text-xs font-cairo font-bold px-3 py-1 rounded-full text-white ${product.category === 'digestive' ? 'bg-brand-700' : 'bg-orange-500'}`}>
            {product.category === 'digestive' ? '🌿 دعم الهضم' : '🦴 المفاصل'}
          </span>

          <h2 className="font-cairo font-extrabold text-3xl text-brand-900">{product.nameAr}</h2>
          <p className="font-tajawal text-[#4A6555]">{product.taglineAr}</p>
          <StarRating rating={product.rating} count={product.reviewCount} size="sm" />

          <ul className="space-y-1.5">
            {product.benefits.slice(0, 3).map((b, i) => (
              <li key={i} className="flex items-center gap-2 text-sm font-tajawal text-brand-900">
                <span className="text-brand-700">✓</span> {b}
              </li>
            ))}
          </ul>

          {/* Offer chips */}
          <div className="flex gap-2">
            {OFFERS.map(o => (
              <button key={o.id} onClick={() => setOffer(o.id)}
                className={`flex-1 text-xs font-cairo font-bold py-2 rounded-lg border transition-colors ${
                  offer === o.id ? 'bg-brand-700 text-white border-brand-700' : 'border-brand-200 text-brand-700'
                }`}>
                {o.label}<br />
                <span className="font-normal">{o.price} درهم</span>
              </button>
            ))}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-cairo font-extrabold text-2xl text-brand-700" style={{ direction: 'ltr' }}>
              {selectedOffer.price} درهم
            </span>
            <span className="line-through text-gray-400 text-sm">{selectedOffer.originalPrice} درهم</span>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" size="lg" className="flex-1"
              onClick={() => {
                addItem(product, offer)
                trackAddToCart({ productId: product.id, productName: product.nameAr, price: selectedOffer.price, quantity: 1 })
              }}>
              أضف للسلة
            </Button>
            <Link href={`/products/${product.slug}`}>
              <Button variant="secondary" size="lg">تفاصيل</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CollectionPage() {
  return (
    <>
      <div className="bg-brand-50 py-12 text-center">
        <h1 className="section-heading mb-2">منتجاتنا الطبيعية</h1>
        <p className="section-subheading">3 منتجات. مشاكل حقيقية. حلول طبيعية مثبتة.</p>
      </div>

      <TrustBarSection />

      <section className="py-12 bg-[#FAFAF8]">
        <div className="container-custom">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {PRODUCTS.map(p => {
              const offer = getOfferById('one', p.id)
              return (
                <div key={p.id} className="card group overflow-hidden">
                  <div className="relative aspect-square bg-[#F5F1E6] overflow-hidden">
                    <ProductImage
                      src={p.images.hero} alt={p.nameAr}
                      productId={p.id} productNameAr={p.nameAr} productNameFr={p.nameFr}
                      fill className="!object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 bg-brand-700 text-white font-cairo font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {p.category === 'digestive' ? 'دعم الهضم' : p.category === 'joints' ? 'المفاصل' : 'العناية بالأظافر'}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-cairo font-extrabold text-base sm:text-lg text-brand-900 mb-1">{p.nameAr}</h3>
                    <p className="font-tajawal text-[#4A6555] text-xs sm:text-sm leading-relaxed mb-2 line-clamp-2">{p.taglineAr}</p>
                    <StarRating rating={p.rating} count={p.reviewCount} size="sm" className="mb-3" />
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="font-cairo font-extrabold text-lg text-brand-700">{offer.price} درهم</span>
                      <span className="font-cairo text-xs text-gray-400 line-through">{offer.originalPrice}</span>
                    </div>
                    <Link href={`/products/${p.slug}`}
                      className="block w-full text-center text-xs sm:text-sm font-cairo font-bold text-white bg-brand-700 hover:bg-brand-800 transition-colors py-2 rounded-xl">
                      اكتشف التفاصيل
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-heading text-center mb-10">أيّ منتج يناسبك؟</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-brand-700 text-white">
                  <th className="p-4 font-cairo font-bold">المشكلة</th>
                  <th className="p-4 font-cairo font-bold text-center">كولوفلورا</th>
                  <th className="p-4 font-cairo font-bold text-center">بيلوريكس</th>
                  <th className="p-4 font-cairo font-bold text-center">فليكسيما</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                {[
                  { prob: 'القولون العصبي والنفخة', col: true, pyl: false, flex: false },
                  { prob: 'الغازات والتقلصات', col: true, pyl: true, flex: false },
                  { prob: 'جرثومة المعدة H. pylori', col: false, pyl: true, flex: false },
                  { prob: 'حرقة المعدة', col: true, pyl: true, flex: false },
                  { prob: 'آلام الركبة والمفاصل', col: false, pyl: false, flex: true },
                  { prob: 'آلام العضلات', col: false, pyl: false, flex: true },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-brand-50' : 'bg-white'}>
                    <td className="p-4 font-tajawal text-brand-900">{row.prob}</td>
                    {[row.col, row.pyl, row.flex].map((val, j) => (
                      <td key={j} className="p-4 text-center text-xl">
                        {val ? '✅' : '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}
