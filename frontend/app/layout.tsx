import type { Metadata } from 'next'
import { Cairo, Tajawal } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import PixelLoader from '@/components/common/PixelLoader'

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
  preload: true,
})

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-tajawal',
  display: 'swap',
  preload: true,
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
  other: {
    'facebook-domain-verification': 'aeahdium0tq88plpv2snt64jms05tx',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable}`}>
      <head>
        {/* Preconnect for critical third-parties */}
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://www.facebook.com" />
        <link rel="dns-prefetch" href="https://analytics.tiktok.com" />
      </head>
      <body>
        {children}
        <PixelLoader />
        {/* Facebook Pixel — lazy loaded for better performance */}
        <Script id="fb-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '974930055129956');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{display:'none'}} src="https://www.facebook.com/tr?id=974930055129956&ev=PageView&noscript=1" alt="" />
        </noscript>
      </body>
    </html>
  )
}
