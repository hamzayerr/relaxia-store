import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import TrustBarSection from '@/components/home/TrustBarSection'
import ProductsGrid from '@/components/home/ProductsGrid'
import WhyRelaxia from '@/components/home/WhyRelaxia'
import HowItWorks from '@/components/home/HowItWorks'
import TestimonialsHome from '@/components/home/TestimonialsHome'
import FinalCTAHome from '@/components/home/FinalCTAHome'

export const metadata: Metadata = {
  title: 'ريلاكسيا | المتجر الطبيعي رقم 1 للصحة الهضمية والمفاصل في المغرب',
  description: 'اكتشف كولوفلورا، بيلوريكس وفليكسيما — منتجات طبيعية مثبتة علميًا لدعم القولون، مكافحة جرثومة المعدة، وتخفيف آلام المفاصل. الدفع عند الاستلام. ضمان 30 يوم.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBarSection />
      <ProductsGrid />
      <WhyRelaxia />
      <HowItWorks />
      <TestimonialsHome />
      <FinalCTAHome />
    </>
  )
}
