'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X, Truck, ShieldCheck, Wallet, RotateCcw, Award } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useUIStore } from '@/lib/store/uiStore'
import { cn } from '@/lib/utils'
import { PRODUCTS } from '@/lib/products'

const ANNOUNCEMENTS = [
  { Icon: Wallet, text: 'الدفع عند الاستلام في جميع أنحاء المغرب' },
  { Icon: RotateCcw, text: 'ضمان 30 يوم أو استرداد كامل' },
  { Icon: Award, text: 'جرب بدون قلق — منتجات أصلية 100%' },
  { Icon: Truck, text: 'توصيل سريع لجميع مناطق المغرب' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [annIndex, setAnnIndex] = useState(0)
  const itemCount = useCartStore(s => s.itemCount())
  const openCart = useCartStore(s => s.openCart)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setAnnIndex(i => (i + 1) % ANNOUNCEMENTS.length)
    }, 3500)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      {/* Announcement bar — auto-rotating */}
      <div className="bg-brand-900 text-white py-2.5 overflow-hidden relative">
        <div key={annIndex} className="container-custom flex items-center justify-center gap-2 min-h-[20px] animate-fadeIn">
          {(() => {
            const Icon = ANNOUNCEMENTS[annIndex].Icon
            return <Icon className="w-4 h-4 flex-shrink-0" />
          })()}
          <p className="font-tajawal text-xs text-center">
            {ANNOUNCEMENTS[annIndex].text}
          </p>
        </div>
      </div>

      <header className={cn(
        'sticky top-0 left-0 right-0 z-40 transition-all duration-300 border-b',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-brand-100'
          : 'bg-white border-brand-100'
      )}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 sm:h-18">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <img
                src="/logo.png"
                alt="RELAXIA"
                className="h-10 w-10 object-contain mix-blend-multiply"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-cairo font-extrabold text-base sm:text-xl text-brand-900 tracking-wide">
                  ريلاكسيا
                </span>
                <span className="font-cairo font-bold text-[10px] sm:text-xs text-brand-700 tracking-widest">
                  RELAXIA
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="font-cairo font-medium text-brand-900 hover:text-brand-700 transition-colors text-sm">الرئيسية</Link>
              <Link href="/products" className="font-cairo font-medium text-brand-900 hover:text-brand-700 transition-colors text-sm">منتجاتنا</Link>
              <Link href="/about" className="font-cairo font-medium text-brand-900 hover:text-brand-700 transition-colors text-sm">من نحن</Link>
              <Link href="/contact" className="font-cairo font-medium text-brand-900 hover:text-brand-700 transition-colors text-sm">تواصل معنا</Link>
            </nav>

            {/* Cart + Mobile menu */}
            <div className="flex items-center gap-2">
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-xl hover:bg-brand-50 transition-colors"
                aria-label="السلة"
              >
                <ShoppingCart className="w-6 h-6 text-brand-700" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -left-1 bg-gold-500 text-white text-[10px] font-cairo font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-bounce-once">
                    {itemCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMenuOpen(true)}
                className="md:hidden p-2.5 rounded-xl hover:bg-brand-50 transition-colors"
                aria-label="القائمة"
              >
                <Menu className="w-6 h-6 text-brand-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-72 bg-[#EDE8D5] border-l border-[#E0D8C0] flex flex-col" style={{ animation: 'slideInRight 0.3s ease' }}>
            <div className="flex items-center justify-between p-4 border-b border-brand-100">
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
                <img src="/logo.png" alt="RELAXIA" className="h-9 w-9 object-contain mix-blend-multiply" />
                <span className="font-cairo font-extrabold text-lg text-brand-900">RELAXIA</span>
              </Link>
              <button onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-brand-50">
                <X className="w-5 h-5 text-brand-700" />
              </button>
            </div>

            <nav className="flex flex-col p-4 gap-1 flex-1">
              {[
                { href: '/', label: 'الرئيسية' },
                { href: '/products', label: 'منتجاتنا' },
              ].map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                  className="font-cairo font-medium text-brand-900 hover:text-brand-700 hover:bg-brand-50 px-4 py-3 rounded-xl transition-colors">
                  {item.label}
                </Link>
              ))}

              <div className="px-4 py-2">
                <p className="text-xs font-cairo font-bold text-[#4A6555] uppercase tracking-wider mb-2">المنتجات</p>
                {PRODUCTS.map(p => (
                  <Link key={p.slug} href={`/products/${p.slug}`} onClick={() => setMenuOpen(false)}
                    className="block font-tajawal text-brand-900 hover:text-brand-700 hover:bg-brand-50 px-4 py-2 rounded-xl transition-colors text-sm">
                    {p.nameAr}
                  </Link>
                ))}
              </div>

              {[
                { href: '/about', label: 'من نحن' },
                { href: '/contact', label: 'تواصل معنا' },
              ].map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                  className="font-cairo font-medium text-brand-900 hover:text-brand-700 hover:bg-brand-50 px-4 py-3 rounded-xl transition-colors">
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-brand-100">
              <div className="flex flex-wrap gap-3 justify-center">
                {['🚚 COD', '🏅 ضمان 30 يوم', '🌿 طبيعي'].map(b => (
                  <span key={b} className="text-xs font-tajawal text-[#4A6555]">{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-0" />
    </>
  )
}
