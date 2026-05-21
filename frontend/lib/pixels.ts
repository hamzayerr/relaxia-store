/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

declare global {
  interface Window {
    fbq?: any
    _fbq?: any
    ttq?: any
    snaptr?: any
  }
}

// ─── Facebook ────────────────────────────────────────────────────────────────

export function initFacebookPixel(pixelId: string) {
  if (typeof window === 'undefined' || window.fbq) return
  const n: any = function(...args: any[]) {
    n.callMethod ? n.callMethod(...args) : n.queue.push(args)
  }
  n.push = n
  n.loaded = true
  n.version = '2.0'
  n.queue = []
  window.fbq = n
  window._fbq = n
  const t = document.createElement('script')
  t.async = true
  t.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(t)
  window.fbq('init', pixelId)
  window.fbq('track', 'PageView')
}

export function fbTrack(event: string, params?: object, eventId?: string) {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', event, params || {}, eventId ? { eventID: eventId } : {})
}

// ─── TikTok ──────────────────────────────────────────────────────────────────

export function initTikTokPixel(pixelId: string) {
  if (typeof window === 'undefined' || window.ttq) return
  const w: any = window, d = document, t = 'ttq'
  w.TiktokAnalyticsObject = t
  const ttq = w[t] = w[t] || []
  ttq.methods = ["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"]
  ttq.setAndDefer = function(t: any, e: any) { t[e] = function() { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } }
  for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i])
  ttq.load = function(e: any, n: any) {
    const r = "https://analytics.tiktok.com/i18n/pixel/events.js"
    ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = r
    ttq._t = ttq._t || {}; ttq._t[e] = +new Date
    ttq._o = ttq._o || {}; ttq._o[e] = n || {}
    const script = d.createElement("script")
    script.type = "text/javascript"; script.async = true
    script.src = r + "?sdkid=" + e + "&lib=" + t
    const s = d.getElementsByTagName("script")[0]
    s.parentNode?.insertBefore(script, s)
  }
  ttq.load(pixelId)
  ttq.page()
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
  const q: any[][] = []
  window.snaptr = (...args: any[]) => { q.push(args) }
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
