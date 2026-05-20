export default function HowItWorks() {
  const steps = [
    { num: '3', title: 'اختار منتجك',   desc: 'اختار المنتج المناسب لمشكلتك واختار العرض اللي يناسبك' },
    { num: '2', title: 'تعبئة الطلب',   desc: 'أدخل اسمك ورقم هاتفك — 30 ثانية فقط' },
    { num: '1', title: 'استلم وادفع',   desc: 'نوصلوا ليك خلال 48 ساعة والدفع عند الاستلام' },
  ]

  return (
    <section className="py-14">
      <div className="container-custom">
        <div className="text-center mb-10">
          <p className="text-xs font-cairo font-bold text-brand-700 tracking-widest uppercase mb-2">طريقة الطلب</p>
          <h2 className="section-heading mb-2">من الطلب لبابك في 3 خطوات</h2>
          <p className="section-subheading">بكل سهولة، بدون تعقيدات</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {steps.map(s => (
            <div key={s.num} className="card p-6 flex gap-4 items-start">
              <div className="w-9 h-9 rounded-full bg-brand-700 text-white flex items-center justify-center font-cairo font-extrabold text-base flex-shrink-0">
                {s.num}
              </div>
              <div>
                <p className="font-cairo font-bold text-brand-900 mb-1">{s.title}</p>
                <p className="font-tajawal text-[#4A6555] text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { num: '+60', label: 'مكوناً طبيعياً' },
              { num: '30', label: 'يوم ضمان' },
              { num: '2', label: 'يوم توصيل' },
              { num: '+10,000', label: 'عميل راضي' },
            ].map(s => (
              <div key={s.label}>
                <p className="font-cairo font-extrabold text-2xl text-brand-700">{s.num}</p>
                <p className="font-tajawal text-brand-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
