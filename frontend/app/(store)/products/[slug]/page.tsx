import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductBySlug, PRODUCTS } from '@/lib/products'
import ProductCard from '@/components/product/ProductCard'
import ProblemSection from '@/components/product/ProblemSection'
import SolutionSection from '@/components/product/SolutionSection'
import ProblemSolutionSection from '@/components/product/ProblemSolutionSection'
import IngredientsSection from '@/components/product/IngredientsSection'
import TestimonialsSection from '@/components/product/TestimonialsSection'
import GuaranteeSection from '@/components/product/GuaranteeSection'
import FAQSection from '@/components/product/FAQSection'
import CrossSellSection from '@/components/product/CrossSellSection'
import TrustBadges from '@/components/common/TrustBadges'
import FinalCTASection from '@/components/product/FinalCTASection'

export async function generateStaticParams() {
  return PRODUCTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return {}
  return {
    title: `${product.nameAr} | ${product.taglineAr}`,
    description: product.descriptionAr,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  return (
    <>
      <ProductCard product={product} />

      {/* Trust bar */}
      <div className="bg-brand-700 py-4">
        <div className="container-custom">
          <TrustBadges compact dark />
        </div>
      </div>

      <ProblemSection product={product} />
      <ProblemSolutionSection productId={product.id} />
      <SolutionSection product={product} />
      <IngredientsSection product={product} />
      <TestimonialsSection product={product} />
      <GuaranteeSection />
      <FAQSection product={product} />
      <CrossSellSection productId={product.id} />
      <FinalCTASection product={product} />

      {/* Bottom padding for mobile sticky CTA */}
      <div className="h-20 lg:h-0" />
    </>
  )
}
