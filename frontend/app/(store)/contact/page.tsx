import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تواصل معنا | ريلاكسيا',
}

export default function ContactPage() {
  return (
    <>
      <section className="bg-brand-50 py-12 text-center">
        <div className="container-custom">
          <h1 className="section-heading mb-2">تواصل معنا</h1>
          <p className="section-subheading">فريقنا المغربي جاهز للرد — من 9 صباحًا إلى 6 مساءً</p>
        </div>
      </section>

      <section className="py-16 bg-[#FAFAF8]">
        <div className="container-custom max-w-2xl">
          {/* Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[
              { icon: '📧', title: 'البريد الإلكتروني', value: 'support@relaxia.store' },
              { icon: '⏰', title: 'ساعات العمل', value: 'الاثنين–السبت\n9ص–6م' },
              { icon: '📦', title: 'تتبع الطلبية', value: 'أرسل لنا رقم طلبيتك' },
            ].map(i => (
              <div key={i.title} className="card p-5 text-center">
                <div className="text-3xl mb-2">{i.icon}</div>
                <p className="font-cairo font-bold text-brand-900 text-sm mb-1">{i.title}</p>
                <p className="font-tajawal text-[#4A6555] text-sm whitespace-pre-line">{i.value}</p>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-2xl border border-brand-100 p-8">
            <h2 className="font-cairo font-bold text-2xl text-brand-900 mb-6">أرسل لنا رسالة</h2>
            <form className="space-y-4" action="mailto:support@relaxia.store">
              <div>
                <label className="field-label">الاسم الكامل</label>
                <input type="text" placeholder="اسمك" className="field-input" />
              </div>
              <div>
                <label className="field-label">البريد الإلكتروني أو رقم الهاتف</label>
                <input type="text" placeholder="email@example.com أو 0612345678" className="field-input" />
              </div>
              <div>
                <label className="field-label">رقم الطلبية (اختياري)</label>
                <input type="text" placeholder="RLX-20260519-XXXX" className="field-input" dir="ltr" />
              </div>
              <div>
                <label className="field-label">الموضوع</label>
                <select className="field-input">
                  <option>سؤال عن المنتج</option>
                  <option>مشكلة في الطلبية</option>
                  <option>استخدام الضمان</option>
                  <option>تتبع الشحن</option>
                  <option>أخرى</option>
                </select>
              </div>
              <div>
                <label className="field-label">رسالتك</label>
                <textarea rows={4} placeholder="اكتب رسالتك هنا..." className="field-input resize-none" />
              </div>
              <button type="submit" className="btn-primary px-8 py-4 w-full text-lg">
                أرسل رسالتك ←
              </button>
            </form>
          </div>

          {/* FAQ links */}
          <div className="mt-10">
            <h3 className="font-cairo font-bold text-xl text-brand-900 mb-4">أسئلة شائعة:</h3>
            <div className="space-y-3">
              {[
                'كيفاش أتتبع طلبيتي؟',
                'كيفاش أستخدم الضمان 30 يوم؟',
                'المنتج وصل مكسور — شنو نديرو؟',
                'طلبيتي تأخرت',
              ].map(q => (
                <div key={q} className="flex items-center gap-2 text-brand-700 font-tajawal hover:text-brand-900 cursor-pointer">
                  <span>→</span><span>{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
