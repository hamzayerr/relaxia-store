import type { Product } from '@/lib/products'
import { CheckCircle } from 'lucide-react'

export default function SolutionSection({ product }: { product: Product }) {
  return (
    <section className="py-14">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="order-2 md:order-1">
            <h2 className="section-heading mb-6">{product.solutionHeading}</h2>
            {product.solutionBody.split('\n\n').map((para, i) => (
              <p key={i} className="font-tajawal text-[#4A6555] text-lg leading-relaxed mb-4">{para}</p>
            ))}
            <div className="space-y-2 mt-6">
              {product.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-700 flex-shrink-0" />
                  <span className="font-tajawal text-brand-900">{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="order-1 md:order-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-100 space-y-4">
              <p className="font-cairo font-bold text-brand-900 text-lg mb-4 text-center">متى تشوف النتيجة؟</p>
              {product.resultsTimeline.map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-700 text-white flex items-center justify-center font-cairo font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-cairo font-bold text-brand-700 text-sm">{step.week}</p>
                    <p className="font-tajawal text-brand-900 text-sm">{step.result}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
