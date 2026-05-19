'use client'
import Link from 'next/link'
import ProductImage from '@/components/common/ProductImage'
import { useCartStore } from '@/lib/store/cartStore'
import { getCrossSells } from '@/lib/products'
import StarRating from '@/components/common/StarRating'
import Button from '@/components/common/Button'
import { trackAddToCart } from '@/lib/pixels'

export default function CrossSellSection({ productId }: { productId: string }) {
  const crossSells = getCrossSells(productId)
  const addItem = useCartStore(s => s.addItem)

  if (crossSells.length === 0) return null

  return (
    <section className="py-14">
      <div className="container-custom">
        <h2 className="section-heading text-center mb-3">أضف معه لنتائج أشمل</h2>
        <p className="section-subheading text-center mb-10">العملاء اللي اشتروا هاد المنتج اختاروا كذلك:</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {crossSells.map(product => (
            <div key={product.id} className="card p-6">
              <div className="relative h-48 rounded-xl overflow-hidden bg-brand-50 mb-4">
                <ProductImage src={product.images.hero} alt={product.nameAr} productId={product.id} productNameAr={product.nameAr} productNameFr={product.nameFr} fill />
              </div>
              <h3 className="font-cairo font-bold text-xl text-brand-900 mb-1">{product.nameAr}</h3>
              <p className="font-tajawal text-sm text-[#4A6555] mb-3">{product.taglineAr}</p>
              <StarRating rating={product.rating} count={product.reviewCount} size="sm" className="mb-4" />
              <p className="font-cairo font-extrabold text-brand-700 text-xl mb-4">229 درهم</p>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={() => {
                    addItem(product, 'one')
                    trackAddToCart({ productId: product.id, productName: product.nameAr, price: 229, quantity: 1 })
                  }}
                >
                  أضف للسلة
                </Button>
                <Link href={`/products/${product.slug}`}>
                  <Button variant="secondary" size="md">تفاصيل</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
