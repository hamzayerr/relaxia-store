import { FlaskConical, ShieldCheck, Banknote, Leaf, Truck, Award } from 'lucide-react'

const reasons = [
  { Icon: FlaskConical, title: 'مكونات مثبتة علميًا',   desc: 'نسب دقيقة في كل فورمولا — مو تخمين' },
  { Icon: ShieldCheck,  title: 'ضمان ذهبي 30 يوم',      desc: 'نرجعوا ليك فلوسك بلا أسئلة' },
  { Icon: Banknote,     title: 'الدفع عند الاستلام',     desc: 'الدفع عند استلام الطلب' },
  { Icon: Leaf,         title: 'طبيعي 100%',              desc: 'بدون مواد حافظة ضارة' },
  { Icon: Truck,        title: 'توصيل سريع 48 ساعة',    desc: 'في جميع مدن المغرب' },
  { Icon: Award,        title: 'صيدلية، مو متجر',        desc: 'سلطة علمية وتركيبة سريرية' },
]

export default function WhyRelaxia() {
  return (
    <section className="py-14">
      <div className="container-custom">
        <div className="text-center mb-10">
          <p className="text-xs font-cairo font-bold text-brand-700 tracking-widest uppercase mb-2">لماذا ريلاكسيا</p>
          <h2 className="section-heading mb-2">صيدلية، مو متجر تجميل</h2>
          <p className="section-subheading">كلشي كيبيع مكملات. ريلاكسيا وحدها كتبين ليك شنو فيها وعلاش تنجح.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reasons.map(r => (
            <div key={r.title} className="card p-6 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0">
                <r.Icon className="w-5 h-5 text-brand-700" />
              </div>
              <div>
                <h3 className="font-cairo font-bold text-base text-brand-900 mb-1">{r.title}</h3>
                <p className="font-tajawal text-[#4A6555] text-sm leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
