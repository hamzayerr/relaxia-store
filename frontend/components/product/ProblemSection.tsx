import Image from 'next/image'
import type { Product } from '@/lib/products'

const MAN_IMAGES: Record<string, string> = {
  coloflora: '/images/man-coloflora.jpg?v=2',
  pylorex: '/images/man-pylorex.jpg?v=5',
  flexima: '/images/man-flexima.jpg?v=5',
  melanex: '/images/man-melanex.jpg?v=2',
}

export default function ProblemSection({ product }: { product: Product }) {
  const manImage = MAN_IMAGES[product.id]

  return (
    <section className="py-14">
      <div className="container-custom">
        {manImage && (
          <div className="max-w-3xl mx-auto mb-10">
            <div className="rounded-3xl overflow-hidden shadow-xl relative aspect-square">
              <Image
                src={manImage}
                alt={`${product.nameAr} Before/After`}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                loading="lazy"
                quality={75}
              />
            </div>
          </div>
        )}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-cairo font-bold text-brand-700 tracking-widest uppercase mb-3">المشكلة</p>
          <h2 className="section-heading mb-8">{product.problemHeading}</h2>
          <div className="space-y-4">
            {product.problemBody.split('\n\n').map((para, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#E0D8C0] p-4">
                <p className="font-tajawal text-[#4A6555] leading-relaxed">{para}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
