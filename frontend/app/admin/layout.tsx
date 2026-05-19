'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { BarChart2, Package, LogOut } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const path = usePathname()

  useEffect(() => {
    if (path === '/admin/login') return
    const token = localStorage.getItem('relaxia_admin_token')
    if (!token) router.push('/admin/login')
  }, [path, router])

  const logout = () => {
    localStorage.removeItem('relaxia_admin_token')
    router.push('/admin/login')
  }

  if (path === '/admin/login') return <>{children}</>

  const navItems = [
    { href: '/admin', label: 'الإحصائيات', Icon: BarChart2 },
    { href: '/admin/orders', label: 'الطلبيات', Icon: Package },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-brand-900 text-white flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="RELAXIA" className="h-8 w-8 object-contain" />
            <span className="font-cairo font-bold">RELAXIA Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-tajawal text-sm ${
                path === href ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'
              }`}>
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={logout} className="flex items-center gap-3 text-white/70 hover:text-white text-sm font-tajawal w-full">
            <LogOut className="w-4 h-4" /> خروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}
