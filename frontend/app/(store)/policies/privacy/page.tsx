import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'سياسة الخصوصية | ريلاكسيا' }

export default function PrivacyPage() {
  return (
    <div className="container-custom py-16 max-w-2xl">
      <h1 className="section-heading mb-8">سياسة الخصوصية</h1>
      <div className="space-y-6 font-tajawal text-[#4A6555] leading-relaxed">
        <p>ريلاكسيا (relaxia.store) تحترم خصوصيتك وتلتزم بحماية معلوماتك الشخصية.</p>
        <h2 className="font-cairo font-bold text-xl text-brand-900">المعلومات التي نجمعها</h2>
        <p>عند تقديم طلبيتك، نجمع: الاسم، رقم الهاتف، المدينة. هذه المعلومات تستخدم فقط لمعالجة طلبيتك والتواصل معك للتأكيد والتوصيل.</p>
        <h2 className="font-cairo font-bold text-xl text-brand-900">الكوكيز وبكسلات التتبع</h2>
        <p>نستخدم بكسلات التتبع (Facebook, TikTok, Snapchat) لتحسين إعلاناتنا وتجربتك على الموقع. هذه البكسلات تعمل وفق سياسات الخصوصية الخاصة بكل منصة.</p>
        <h2 className="font-cairo font-bold text-xl text-brand-900">مشاركة المعلومات</h2>
        <p>لا نبيع ولا نشارك معلوماتك الشخصية مع أطراف ثالثة إلا لأغراض التوصيل (شركة الشحن) ومعالجة الطلبيات.</p>
        <h2 className="font-cairo font-bold text-xl text-brand-900">التواصل معنا</h2>
        <p>لأي سؤال حول خصوصيتك: <a href="mailto:support@relaxia.store" className="text-brand-700 font-bold">support@relaxia.store</a></p>
      </div>
    </div>
  )
}
