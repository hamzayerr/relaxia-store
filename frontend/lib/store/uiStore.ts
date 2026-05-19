'use client'
import { create } from 'zustand'
import type { Product } from '@/lib/products'

interface UIStore {
  checkoutModalOpen: boolean
  upsellModalOpen: boolean
  upsellProduct: Product | null
  currentOrderId: string | null
  openCheckout: () => void
  closeCheckout: () => void
  showUpsell: (product: Product, orderId: string) => void
  closeUpsell: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  checkoutModalOpen: false,
  upsellModalOpen: false,
  upsellProduct: null,
  currentOrderId: null,

  openCheckout: () => set({ checkoutModalOpen: true }),
  closeCheckout: () => set({ checkoutModalOpen: false }),

  showUpsell: (product, orderId) =>
    set({ upsellModalOpen: true, upsellProduct: product, currentOrderId: orderId }),

  closeUpsell: () =>
    set({ upsellModalOpen: false, upsellProduct: null }),
}))
