import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'سياسة الاسترداد | ريلاكسيا' }

export default function RefundPage() {
  return (
    <div className="container-custom py-16 max-w-2xl">
      <h1 className="section-heading mb-8">سياسة الاسترداد — ضماننا الذهبي 30 يوم</h1>
      <div className="prose-ar space-y-6 font-tajawal text-[#4A6555] leading-relaxed">
        <div className="bg-brand-50 rounded-2xl p-6 border border-brand-100">
          <p className="font-cairo font-bold text-2xl text-brand-900 mb-2">🏅 ضمان 30 يوم كاملين</p>
          <p>إلا ما كنتيش راضي على المنتج في 30 يوم من تاريخ الاستلام، نردوا ليك فلوسك كاملين، بلا أسئلة، بلا شروط معقدة.</p>
        </div>
        <h2 className="font-cairo font-bold text-xl text-brand-900">كيفاش تستخدم الضمان؟</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>تواصل معنا على support@relaxia.store خلال 30 يوم من الاستلام</li>
          <li>أخبرنا برقم طلبيتك والسبب</li>
          <li>ترجع لينا المنتج (غير المستخدم بالكامل)</li>
          <li>نردوا ليك فلوسك خلال 5-7 أيام عمل</li>
        </ol>
        <h2 className="font-cairo font-bold text-xl text-brand-900">شروط الاسترداد</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>الطلب في 30 يوم من تاريخ الاستلام</li>
          <li>المنتجات المستخدمة بالكامل لا يمكن استرجاعها</li>
          <li>يجب إرجاع التغليف الأصلي</li>
        </ul>
        <p>للتواصل: <a href="mailto:support@relaxia.store" className="text-brand-700 font-bold">support@relaxia.store</a></p>
      </div>
    </div>
  )
}
