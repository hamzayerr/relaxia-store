import type { Product } from '@/lib/products'

export default function ProblemSection({ product }: { product: Product }) {
  return (
    <section className="py-14">
      <div className="container-custom">
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
