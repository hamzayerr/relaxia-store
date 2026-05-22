import type { CartItem } from '@/lib/store/cartStore'
import { getOfferById } from '@/lib/products'
import { getUTMParams, getFbCookies } from '@/lib/utils'

const SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL || ''

export interface OrderResponse {
  order_id: string
  status: string
  total_price: number
  created_at: string
  customer_name: string
  phone: string
  city: string
  items: { product_name: string; quantity: number; unit_price: number; offer_type: string }[]
}

function generateOrderId() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `RLX-${y}${m}${day}-${rand}`
}

function saveLocal(order: OrderResponse) {
  try {
    localStorage.setItem(`relaxia_order_${order.order_id}`, JSON.stringify(order))
    localStorage.setItem('relaxia_last_order', order.order_id)
  } catch {}
}

function loadLocal(orderId: string): OrderResponse | null {
  try {
    const raw = localStorage.getItem(`relaxia_order_${orderId}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

async function sendToSheet(payload: Record<string, unknown>) {
  try {
    await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (e) {
    console.error('[Sheets] webhook failed', e)
  }
}

function formatDate(d: Date) {
  const day = String(d.getDate()).padStart(2, '0')
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}/${m}/${d.getFullYear()}`
}

export async function createOrder(
  formData: { name: string; phone: string; city: string },
  cartItems: CartItem[],
  total: number,
  eventId: string
): Promise<OrderResponse> {
  const utmParams = getUTMParams()
  const fbCookies = getFbCookies()
  const orderId = generateOrderId()
  const now = new Date()

  const productNames = cartItems.map(i => i.product.nameAr).join(' / ')
  const skus = cartItems.map(i => i.product.sku).join(' / ')
  const quantities = cartItems.map(i => {
    const q = { one: 1, two: 2, three: 3 }[i.offerId] || 1
    return q
  }).join(' / ')

  // Fire and forget - don't wait for sheet
  sendToSheet({
    orderId,
    date: formatDate(now),
    country: 'Morocco',
    name: formData.name,
    phone: formData.phone,
    city: formData.city,
    product: productNames,
    sku: skus,
    quantity: quantities,
    totalPrice: total,
    currency: 'MAD',
    status: 'جديد',
    source: utmParams.source || '',
    medium: utmParams.medium || '',
    campaign: utmParams.campaign || '',
    fbclid: utmParams.fbclid || '',
    ttclid: utmParams.ttclid || '',
    fbp: fbCookies.fbp || '',
    fbc: fbCookies.fbc || '',
    eventId,
  })

  const order: OrderResponse = {
    order_id: orderId,
    status: 'new',
    total_price: total,
    created_at: now.toISOString(),
    customer_name: formData.name,
    phone: formData.phone,
    city: formData.city,
    items: cartItems.map(item => {
      const offer = getOfferById(item.offerId)
      return {
        product_name: item.product.nameAr,
        quantity: item.quantity,
        unit_price: offer.price,
        offer_type: item.offerId,
      }
    }),
  }
  saveLocal(order)
  return order
}

export async function addUpsellToOrder(orderId: string, product: { id: string; nameAr: string; sku: string }) {
  const existing = loadLocal(orderId)
  if (!existing) throw new Error('الطلب غير موجود')
  const upsellPrice = 229
  const updated: OrderResponse = {
    ...existing,
    total_price: existing.total_price + upsellPrice,
    items: [
      ...existing.items,
      { product_name: product.nameAr, quantity: 1, unit_price: upsellPrice, offer_type: 'one' },
    ],
  }
  saveLocal(updated)

  await sendToSheet({
    orderId: `${orderId}-UPSELL`,
    date: formatDate(new Date()),
    country: 'Morocco',
    name: existing.customer_name,
    phone: existing.phone,
    city: existing.city,
    product: `[UPSELL] ${product.nameAr}`,
    sku: product.sku,
    quantity: 1,
    totalPrice: upsellPrice,
    currency: 'MAD',
    status: 'جديد - upsell',
  })
  return updated
}

export async function finalizeOrder(orderId: string) {
  return loadLocal(orderId)
}

export async function fetchOrder(orderId: string): Promise<OrderResponse> {
  const o = loadLocal(orderId)
  if (!o) throw new Error('الطلب غير موجود')
  return o
}
