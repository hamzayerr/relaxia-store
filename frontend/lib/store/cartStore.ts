'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product, OfferId } from '@/lib/products'
import { getOfferById, OFFERS } from '@/lib/products'

export interface CartItem {
  product: Product
  offerId: OfferId
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, offerId: OfferId) => void
  removeItem: (productId: string, offerId: OfferId) => void
  updateQuantity: (productId: string, offerId: OfferId, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, offerId) => {
        set(state => {
          const idx = state.items.findIndex(
            i => i.product.id === product.id && i.offerId === offerId
          )
          if (idx >= 0) {
            const updated = [...state.items]
            updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 }
            return { items: updated, isOpen: true }
          }
          return { items: [...state.items, { product, offerId, quantity: 1 }], isOpen: true }
        })
      },

      removeItem: (productId, offerId) => {
        set(state => ({
          items: state.items.filter(
            i => !(i.product.id === productId && i.offerId === offerId)
          ),
        }))
      },

      updateQuantity: (productId, offerId, qty) => {
        if (qty <= 0) {
          get().removeItem(productId, offerId)
          return
        }
        set(state => ({
          items: state.items.map(i =>
            i.product.id === productId && i.offerId === offerId
              ? { ...i, quantity: qty }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [], isOpen: false }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () => {
        return get().items.reduce((sum, item) => {
          const offer = getOfferById(item.offerId)
          return sum + offer.price * item.quantity
        }, 0)
      },

      itemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'relaxia-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ items: state.items }),
    }
  )
)
