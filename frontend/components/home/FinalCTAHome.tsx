import Link from 'next/link'
import { ShieldCheck, Truck, Award } from 'lucide-react'

export default function FinalCTAHome() {
  return (
    <section className="py-14">
      <div className="container-custom">
        <div className="bg-white border border-brand-100 rounded-3xl px-8 py-14 text-center relative overflow-hidden shadow-sm">
          <div className="relative z-10">
            <p className="text-xs font-cairo font-bold text-brand-600 tracking-widest uppercase mb-4">الصحة تستاهل</p>
            <h2 className="font-cairo font-extrabold text-4xl sm:text-5xl text-brand-900 mb-4 leading-tight">
              صحتك تستحق علم،<br />مو وعود
            </h2>
            <p className="font-tajawal text-brand-600 text-lg mb-10 max-w-lg mx-auto">
              الدفع عند الاستلام. ضمان 30 يوم أو فلوسك كاملة. توصيل مجاني في المغرب.
            </p>

            <Link href="/products">
              <button className="inline-flex items-center gap-2 bg-brand-700 text-white font-cairo font-extrabold text-lg px-10 py-4 rounded-xl hover:bg-brand-800 transition-colors shadow-lg">
                اكتشف العلاجات الآن
                <span className="rtl-flip">←</span>
              </button>
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              {[
                { Icon: ShieldCheck, text: 'ضمان 30 يوم' },
                { Icon: Truck,       text: 'توصيل مجاني' },
                { Icon: Award,       text: 'مكونات سريرية' },
              ].map(({ Icon, text }) => (
                <span key={text} className="flex items-center gap-2 text-brand-500 text-sm font-tajawal">
                  <Icon className="w-4 h-4 text-brand-700" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
