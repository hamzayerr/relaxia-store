import type { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/common/Button'

export const metadata: Metadata = {
  title: 'من نحن | ريلاكسيا',
  description: 'تعرف على قصة ريلاكسيا — المتجر الطبيعي رقم 1 في المغرب للصحة الهضمية والمفاصل',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-bl from-brand-900 to-brand-700 text-white py-20 text-center">
        <div className="container-custom">
          <h1 className="font-cairo font-extrabold text-5xl mb-4">من نحن</h1>
          <p className="font-tajawal text-white/80 text-xl">الصحة الطبيعية — بقوة العلم</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-[#FAFAF8]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-heading mb-6">ريلاكسيا ما بداتش كتجارة — بدات كحل</h2>
              <div className="space-y-4 font-tajawal text-[#4A6555] text-lg leading-relaxed">
                <p>كتير ديال المغاربة كيعانيو من مشاكل الهضم والمفاصل، ويديرو دورة كاملة ديال الأدوية الكيماوية، لكن النتيجة تكون مؤقتة أو ما تكونش.</p>
                <p>قررنا نبحثو على أحسن المكونات الطبيعية — المثبتة علميًا — وندمجوهم في فورمولا واحدة فعالة ومحددة لكل مشكلة.</p>
                <p>اليوم، ريلاكسيا هي المتجر الوحيد في المغرب اللي كيجمع السلطة العلمية، المكونات الطبيعية المميزة، والنتائج الحقيقية — كلها في جاي واحد.</p>
                <p className="font-bold text-brand-900">لأن صحتك تستاهل أحسن حاجة.</p>
              </div>
            </div>
            <div className="bg-brand-700 rounded-2xl p-8 text-white text-center">
              <div className="text-6xl mb-4">🌿</div>
              <h3 className="font-cairo font-extrabold text-2xl mb-2">مهمتنا</h3>
              <p className="font-tajawal text-white/80 leading-relaxed">
                نقدمو لكل مغربي ومغربية حلولًا طبيعية حقيقية — مثبتة بالعلم — لمشاكل الصحة اللي تأثر على حياتهم اليومية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="section-heading text-center mb-12">قيمنا</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🔬', title: 'العلم أولًا', desc: 'كل مكوّن مثبت بدراسات إكلينيكية موثقة' },
              { icon: '🌿', title: 'الطبيعة', desc: 'بدون مواد كيماوية قاسية أو مواد حافظة ضارة' },
              { icon: '🤝', title: 'الثقة', desc: 'ضمان 30 يوم وشفافية كاملة في المكونات' },
              { icon: '🇲🇦', title: 'المغرب', desc: 'صنعنا لجسم المغربي وحياته وبيئته' },
            ].map(v => (
              <div key={v.title} className="card p-6 text-center">
                <div className="text-4xl mb-3">{v.icon}</div>
                <h3 className="font-cairo font-bold text-xl text-brand-900 mb-2">{v.title}</h3>
                <p className="font-tajawal text-[#4A6555] text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-20 bg-brand-700 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '+10,000', label: 'عميل راضي' },
              { num: '4.8/5', label: 'تقييم وسطي' },
              { num: '3', label: 'منتجات متخصصة' },
              { num: '30 يوم', label: 'ضمان ذهبي' },
            ].map(s => (
              <div key={s.label}>
                <p className="font-cairo font-extrabold text-4xl text-gold-400 mb-1">{s.num}</p>
                <p className="font-tajawal text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#FAFAF8] text-center">
        <div className="container-custom">
          <h2 className="section-heading mb-4">جاهز تجرب الفرق؟</h2>
          <p className="section-subheading mb-8">الدفع عند الاستلام. ضمان 30 يوم. توصيل مجاني.</p>
          <Link href="/products">
            <Button variant="primary" size="xl">اكتشف منتجاتنا ←</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
