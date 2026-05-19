import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'الشروط والأحكام | ريلاكسيا' }

export default function TermsPage() {
  return (
    <div className="container-custom py-16 max-w-2xl">
      <h1 className="section-heading mb-8">الشروط والأحكام</h1>
      <div className="space-y-6 font-tajawal text-[#4A6555] leading-relaxed">
        <p>باستخدامك لموقع relaxia.store، فأنت توافق على الشروط والأحكام التالية.</p>
        <h2 className="font-cairo font-bold text-xl text-brand-900">عملية الطلب</h2>
        <p>جميع الطلبيات تتم عبر نظام الدفع عند الاستلام (COD). ستتلقى مكالمة تأكيد خلال 10 دقائق من تقديم طلبيتك (ضمن ساعات العمل 9ص–9م).</p>
        <h2 className="font-cairo font-bold text-xl text-brand-900">التوصيل</h2>
        <p>التوصيل خلال 2-4 أيام عمل في جميع أنحاء المغرب. التوصيل مجاني.</p>
        <h2 className="font-cairo font-bold text-xl text-brand-900">إلغاء الطلب</h2>
        <p>يمكن إلغاء الطلبية قبل الشحن بالتواصل معنا على support@relaxia.store.</p>
        <h2 className="font-cairo font-bold text-xl text-brand-900">إخلاء المسؤولية</h2>
        <p>منتجات ريلاكسيا هي مكملات غذائية وليست أدوية. لا تغني عن الاستشارة الطبية. هذه المنتجات ليست مخصصة لتشخيص أو علاج أو شفاء أو منع أي مرض.</p>
        <h2 className="font-cairo font-bold text-xl text-brand-900">القانون المطبق</h2>
        <p>تخضع هذه الشروط للقانون المغربي.</p>
      </div>
    </div>
  )
}
