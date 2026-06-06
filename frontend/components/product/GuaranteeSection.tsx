import { ShieldCheck } from 'lucide-react'

export default function GuaranteeSection() {
  return (
    <section className="py-14">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-gold-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h2 className="section-heading mb-4">ضماننا الذهبي — 30 يوم كاملين</h2>
          <p className="section-subheading mb-8">
            نحن واثقون من جودة منتجاتنا. إلا ما كنتيش راضي على النتيجة في 30 يوم من تاريخ الاستلام — نردوا ليك فلوسك كاملين، بلا أسئلة، بلا شروط.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { step: '1', text: 'تواصل معنا خلال 30 يوم' },
              { step: '2', text: 'أخبرنا برقم طلبك والسبب' },
              { step: '3', text: 'نردوا ليك فلوسك خلال 5-7 أيام' },
            ].map(s => (
              <div key={s.step} className="bg-brand-50 rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-brand-700 text-white font-cairo font-bold text-sm flex items-center justify-center mx-auto mb-2">
                  {s.step}
                </div>
                <p className="font-tajawal text-brand-900 text-sm">{s.text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              'الدفع عند الاستلام',
              'استرداد كامل بلا أسئلة',
              'ضمان حقيقي وشفاف',
            ].map(t => (
              <span key={t} className="bg-green-50 text-green-700 font-tajawal text-sm px-4 py-2 rounded-full border border-green-200">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
