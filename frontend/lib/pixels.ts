'use client'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    ttq?: { track: (...args: unknown[]) => void; page: () => void }
    snaptr?: (...args: unknown[]) => void
  }
}

// ─── Facebook ────────────────────────────────────────────────────────────────

export function initFacebookPixel(pixelId: string) {
  if (typeof window === 'undefined' || window.fbq) return
  const f = window as Window & { fbq?: (...args: unknown[]) => void; _fbq?: unknown }
  const n = (...args: unknown[]) => { (n as { queue?: unknown[]; callMethod?: (...a: unknown[]) => void }).callMethod ? (n as { callMethod: (...a: unknown[]) => void }).callMethod(...args) : ((n as { queue: unknown[] }).queue = (n as { queue: unknown[] }).queue || []).push(args) }
  if (!f._fbq) f._fbq = n
  f.fbq = n as (...args: unknown[]) => void;
  (n as { push: typeof n; loaded: boolean; version: string; queue: unknown[] }).push = n;
  (n as { push: typeof n; loaded: boolean; version: string; queue: unknown[] }).loaded = true;
  (n as { push: typeof n; loaded: boolean; version: string; queue: unknown[] }).version = '2.0';
  (n as { push: typeof n; loaded: boolean; version: string; queue: unknown[] }).queue = []
  const t = document.createElement('script'); t.async = true
  t.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(t)
  window.fbq?.('init', pixelId)
  window.fbq?.('track', 'PageView')
}

export function fbTrack(event: string, params?: object, eventId?: string) {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', event, params || {}, eventId ? { eventID: eventId } : {})
}

// ─── TikTok ──────────────────────────────────────────────────────────────────

export function initTikTokPixel(pixelId: string) {
  if (typeof window === 'undefined' || window.ttq) return
  const script = document.createElement('script')
  script.async = true
  script.src = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${pixelId}&lib=ttq`
  document.head.appendChild(script)
  window.ttq = {
    track: (...args: unknown[]) => console.log('ttq.track', args),
    page: () => {},
  }
}

export function ttTrack(event: string, params?: object) {
  if (typeof window === 'undefined' || !window.ttq) return
  window.ttq.track(event, params || {})
}

// ─── Snapchat ─────────────────────────────────────────────────────────────────

export function initSnapchatPixel(pixelId: string) {
  if (typeof window === 'undefined' || window.snaptr) return
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://sc-static.net/scevent.min.js'
  document.head.appendChild(script)
  const q: unknown[][] = []
  window.snaptr = (...args: unknown[]) => { q.push(args) }
  script.onload = () => {
    window.snaptr?.('init', pixelId)
    window.snaptr?.('track', 'PAGE_VIEW')
    q.forEach(args => window.snaptr?.(...args))
  }
}

export function snapTrack(event: string, params?: object) {
  if (typeof window === 'undefined' || !window.snaptr) return
  window.snaptr('track', event, params || {})
}

// ─── Unified events ───────────────────────────────────────────────────────────

export function trackViewContent(params: { productId: string; productName: string; price: number }) {
  fbTrack('ViewContent', { content_ids: [params.productId], content_name: params.productName, content_type: 'product', value: params.price, currency: 'MAD' })
  ttTrack('ViewContent', { content_id: params.productId, content_name: params.productName, value: params.price, currency: 'MAD' })
  snapTrack('VIEW_CONTENT', { item_ids: [params.productId], price: params.price, currency: 'MAD' })
}

export function trackAddToCart(params: { productId: string; productName: string; price: number; quantity: number }) {
  fbTrack('AddToCart', { content_ids: [params.productId], content_name: params.productName, content_type: 'product', value: params.price, currency: 'MAD', num_items: params.quantity })
  ttTrack('AddToCart', { content_id: params.productId, value: params.price, currency: 'MAD' })
  snapTrack('ADD_CART', { item_ids: [params.productId], price: params.price, currency: 'MAD' })
}

export function trackInitiateCheckout(params: { value: number; numItems: number }) {
  fbTrack('InitiateCheckout', { value: params.value, currency: 'MAD', num_items: params.numItems })
  ttTrack('InitiateCheckout', { value: params.value, currency: 'MAD' })
  snapTrack('START_CHECKOUT', { price: params.value, currency: 'MAD' })
}

export function trackPurchase(params: { orderId: string; value: number; items: { productId: string; quantity: number }[]; eventId: string }) {
  fbTrack('Purchase', { value: params.value, currency: 'MAD', content_ids: params.items.map(i => i.productId), content_type: 'product', order_id: params.orderId }, params.eventId)
  ttTrack('CompletePayment', { value: params.value, currency: 'MAD', order_id: params.orderId })
  snapTrack('PURCHASE', { transaction_id: params.orderId, price: params.value, currency: 'MAD' })
}
