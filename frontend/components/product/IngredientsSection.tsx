import Image from 'next/image'
import type { Product } from '@/lib/products'

const INGREDIENT_IMAGES: Record<string, string> = {
  coloflora: '/images/ingredients-coloflora.png?v=3',
  pylorex: '/images/ingredients-pylorex.png?v=1',
  flexima: '/images/ingredients-flexima.png?v=1',
  melanex: '/images/ingredients-melanex.png?v=2',
  keranex: '/images/ingredients-keranex.png?v=1',
}

const ALT_TEXTS: Record<string, string> = {
  coloflora: 'مكونات كولوفلورا',
  pylorex: 'مكونات بيلوريكس',
  flexima: 'مكونات فليكسيما',
  melanex: 'مكونات ميلانكس',
  keranex: 'مكونات كيرانكس',
}

export default function IngredientsSection({ product }: { product: Product }) {
  const ingredientImage = INGREDIENT_IMAGES[product.id]

  // If we have an image for this product, show single image (full width on mobile, centered on desktop)
  if (ingredientImage) {
    return (
      <section className="py-8 lg:py-14">
        <div className="lg:container-custom">
          <div className="lg:max-w-5xl lg:mx-auto">
            <Image
              src={ingredientImage}
              alt={ALT_TEXTS[product.id] || 'المكونات'}
              width={1200}
              height={1600}
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="w-full h-auto lg:rounded-2xl lg:shadow-lg"
              loading="lazy"
              quality={75}
            />
          </div>
        </div>
      </section>
    )
  }

  // Fallback: card grid
  return (
    <section className="py-14">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-heading mb-3">المكونات — الشفافية الكاملة</h2>
          <p className="section-subheading">نسب دقيقة. مكونات مثبتة. مو كلام فارغ.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {product.ingredients.map((ing, i) => (
            <div key={i} className="card p-6 text-center hover:border-brand-300">
              <div className="text-4xl mb-3">{ing.icon || '🌿'}</div>
              <h3 className="font-cairo font-bold text-brand-900 text-base mb-1">{ing.nameAr}</h3>
              <p className="font-tajawal text-xs text-[#4A6555] mb-2 italic">{ing.nameFr}</p>
              {(ing.percentage || ing.amount) && (
                <span className="inline-block bg-gold-500 text-white font-cairo font-bold text-xs px-2 py-0.5 rounded-full mb-3">
                  {ing.percentage || ing.amount}
                </span>
              )}
              <p className="font-tajawal text-sm text-brand-900 leading-relaxed">{ing.benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
