import type { Metadata } from 'next'
import { Cairo, Tajawal, Inter } from 'next/font/google'
import './globals.css'
import PixelLoader from '@/components/common/PixelLoader'

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
})

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-tajawal',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ريلاكسيا | المتجر الطبيعي رقم 1 للصحة الهضمية والمفاصل في المغرب',
    template: '%s | ريلاكسيا',
  },
  description: 'اكتشف كولوفلورا، بيلوريكس وفليكسيما — منتجات طبيعية مثبتة علميًا لدعم القولون، مكافحة جرثومة المعدة، وتخفيف آلام المفاصل. الدفع عند الاستلام. ضمان 30 يوم.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://relaxia.store'),
  openGraph: {
    type: 'website',
    locale: 'ar_MA',
    siteName: 'ريلاكسيا',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable} ${inter.variable}`}>
      <body>
        {children}
        <PixelLoader />
      </body>
    </html>
  )
}
