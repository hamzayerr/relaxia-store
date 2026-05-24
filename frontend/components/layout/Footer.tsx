'use client'
import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { PRODUCTS } from '@/lib/products'
import { cn } from '@/lib/utils'

const BADGES = ['طبيعي 100%', 'مصنوع في المغرب', 'ضمان 30 يوم']

const SECTIONS = [
  {
    title: 'منتجاتنا',
    links: PRODUCTS.map(p => ({ href: `/products/${p.slug}`, label: p.nameAr })),
  },
  {
    title: 'روابط سريعة',
    links: [
      { href: '/', label: 'الرئيسية' },
      { href: '/products', label: 'المنتجات' },
      { href: '/about', label: 'من نحن' },
      { href: '/contact', label: 'تواصل معنا' },
    ],
  },
  {
    title: 'الدعم',
    links: [
      { href: '/policies/refund', label: 'سياسة الاسترداد' },
      { href: '/policies/privacy', label: 'سياسة الخصوصية' },
      { href: '/policies/terms', label: 'الشروط والأحكام' },
    ],
  },
]

function AccordionSection({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-brand-100">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4"
      >
        <ChevronDown
          className={cn('w-5 h-5 text-brand-700 transition-transform', open && 'rotate-180')}
        />
        <h4 className="font-cairo font-bold text-brand-900">{title}</h4>
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          open ? 'max-h-96 pb-4' : 'max-h-0'
        )}
      >
        <ul className="space-y-2">
          {links.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-brand-500 hover:text-brand-700 font-tajawal text-sm transition-colors block"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-brand-100 mt-10">
      <div className="container-custom py-10">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <img src="/logo.png" alt="RELAXIA" className="h-10 w-10 object-contain mix-blend-multiply" />
            <div className="flex flex-col leading-tight">
              <span className="font-cairo font-extrabold text-xl text-brand-900 tracking-wide">
                ريلاكسيا
              </span>
              <span className="font-cairo font-bold text-xs text-brand-700 tracking-widest">
                RELAXIA
              </span>
            </div>
          </div>
          <p className="text-brand-500 text-sm font-tajawal leading-relaxed max-w-md mx-auto">
            الصحة الطبيعية — بقوة العلم.<br />
            مكملات طبيعية مثبتة علميًا، مصممة للمغربي.
          </p>
        </div>

        {/* Badges — centered */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-xl mx-auto">
          {BADGES.map(b => (
            <span
              key={b}
              className="inline-block bg-brand-50 text-brand-700 font-cairo font-bold text-xs px-3 py-1.5 rounded-full border border-brand-100"
            >
              {b}
            </span>
          ))}
        </div>

        {/* Accordion sections — right-aligned */}
        <div className="max-w-md mr-0 ml-auto" dir="rtl">
          {SECTIONS.map(s => (
            <AccordionSection key={s.title} title={s.title} links={s.links} />
          ))}
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
