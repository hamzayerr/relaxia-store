import Image from 'next/image'

const IMAGES: Record<string, string> = {
  coloflora: '/images/before-after-coloflora.png',
}

export default function BeforeAfterSection({ productId }: { productId: string }) {
  const src = IMAGES[productId]
  if (!src) return null

  return (
    <section className="py-12 lg:py-16 bg-cream-50">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="font-cairo font-extrabold text-2xl lg:text-4xl text-brand-700 mb-3">
            النتيجة قبل و بعد
          </h2>
          <p className="font-tajawal text-gray-600 text-base lg:text-lg max-w-2xl mx-auto">
            شوف الفرق بعد الاستعمال المنتظم لـ COLOFLORA
          </p>
        </div>

        <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-xl bg-white">
          <Image
            src={src}
            alt="Before and After COLOFLORA"
            width={1000}
            height={1333}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>
    </section>
  )
}
