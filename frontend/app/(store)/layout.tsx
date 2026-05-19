import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import CheckoutModal from '@/components/checkout/CheckoutModal'
import UpsellPopup from '@/components/checkout/UpsellPopup'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <CheckoutModal />
      <UpsellPopup />
    </>
  )
}
