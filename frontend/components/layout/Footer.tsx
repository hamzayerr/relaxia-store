import Link from 'next/link'
import { PRODUCTS } from '@/lib/products'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-brand-100 mt-10">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="RELAXIA" className="h-10 w-10 object-contain mix-blend-multiply" />
              <span className="font-cairo font-extrabold text-xl tracking-wide text-brand-900">RELAXIA</span>
            </div>
            <p className="text-brand-500 text-sm font-tajawal leading-relaxed">
              الصحة الطبيعية — بقوة العلم.<br />
              مكملات طبيعية مثبتة علميًا، مصممة للمغربي.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-cairo font-bold text-brand-900 mb-4">منتجاتنا</h4>
            <ul className="space-y-2">
              {PRODUCTS.map(p => (
                <li key={p.slug}>
                  <Link href={`/products/${p.slug}`} className="text-brand-500 hover:text-brand-700 font-tajawal text-sm transition-colors">
                    {p.nameAr}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-cairo font-bold text-brand-900 mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'الرئيسية' },
                { href: '/products', label: 'المنتجات' },
                { href: '/about', label: 'من نحن' },
                { href: '/contact', label: 'تواصل معنا' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-brand-500 hover:text-brand-700 font-tajawal text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-cairo font-bold text-brand-900 mb-4">الدعم</h4>
            <ul className="space-y-2">
              {[
                { href: '/policies/refund', label: 'سياسة الاسترداد' },
                { href: '/policies/privacy', label: 'سياسة الخصوصية' },
                { href: '/policies/terms', label: 'الشروط والأحكام' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-brand-500 hover:text-brand-700 font-tajawal text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-brand-100">
        <div className="container-custom py-4">
          <p className="text-center text-brand-400 text-xs font-tajawal">
            © 2026 RELAXIA — relaxia.store — جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  )
}
