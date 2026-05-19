# Pixels & Tracking — Facebook, TikTok, Snapchat

## Overview

### Three-Layer Tracking Architecture
1. **Web Pixel** (browser-side) — fires on user actions in the browser
2. **CAPI** (server-side) — fires from backend after order confirmation, for dedup and reliability
3. **Deduplication** — both web + CAPI fire for the same event; Facebook/TikTok/Snap match by `event_id` to avoid double-counting

### Key Principles
- **Deferred loading**: All web pixels load after hydration (useEffect) — never block page render
- **No hashing on web**: Browser-side sends raw data (email, phone) — platform handles hashing
- **Hashing on CAPI**: Backend hashes PII before sending to CAPI endpoints
- **Deduplication**: Same `event_id` sent from web pixel and CAPI — platforms deduplicate
- **TikTok phone**: TikTok CAPI requires phone in E.164 format (`+212XXXXXXXXX`)
- **Privacy-safe**: Pixels load after user interaction (deferred), not on initial paint

---

## Web Pixels (Frontend)

### Setup: lib/pixels.ts

```typescript
// lib/pixels.ts

declare global {
  interface Window {
    fbq: Function
    ttq: any
    snaptr: Function
    _fbp?: string
    _fbc?: string
  }
}

// ─── Facebook Pixel ───────────────────────────────────────────────────────────

export function initFacebookPixel(pixelId: string) {
  if (typeof window === 'undefined' || window.fbq) return
  
  // Inline Facebook pixel base code
  ;(function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return
    n = f.fbq = function() {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = !0
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = !0
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode?.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
  
  window.fbq('init', pixelId)
  window.fbq('track', 'PageView')
}

export function fbTrack(event: string, params?: object, eventId?: string) {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', event, params || {}, eventId ? { eventID: eventId } : {})
}

// Get Facebook browser cookies for CAPI
export function getFbCookies() {
  if (typeof document === 'undefined') return { fbp: '', fbc: '' }
  
  const cookies = document.cookie.split(';').reduce((acc: Record<string, string>, c) => {
    const [k, v] = c.trim().split('=')
    acc[k] = v
    return acc
  }, {})
  
  return {
    fbp: cookies['_fbp'] || '',
    fbc: cookies['_fbc'] || new URLSearchParams(window.location.search).get('fbclid') 
      ? `fb.1.${Date.now()}.${new URLSearchParams(window.location.search).get('fbclid')}`
      : '',
  }
}

// ─── TikTok Pixel ─────────────────────────────────────────────────────────────

export function initTikTokPixel(pixelId: string) {
  if (typeof window === 'undefined' || window.ttq) return
  
  ;(function(w: any, d: any, t: any) {
    w.TiktokAnalyticsObject = t
    const ttq = w[t] = w[t] || []
    ttq.methods = ['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie']
    ttq.setAndDefer = function(t: any, e: any) { t[e] = function() { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } }
    for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i])
    ttq.instance = function(t: any) {
      const i = ttq._i[t] || []
      for (let n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(i, ttq.methods[n])
      return i
    }
    ttq.load = function(e: any, n?: any) {
      const i = 'https://analytics.tiktok.com/i18n/pixel/events.js'
      ttq._i = ttq._i || {}
      ttq._i[e] = []
      ttq._i[e]._u = i
      ttq._t = ttq._t || {}
      ttq._t[e] = +new Date()
      ttq._o = ttq._o || {}
      ttq._o[e] = n || {}
      const o = document.createElement('script')
      o.type = 'text/javascript'
      o.async = true
      o.src = i + '?sdkid=' + e + '&lib=' + t
      const a = document.getElementsByTagName('script')[0]
      a.parentNode?.insertBefore(o, a)
    }
    ttq.load(pixelId)
    ttq.page()
  })(window, document, 'ttq')
}

export function ttTrack(event: string, params?: object) {
  if (typeof window === 'undefined' || !window.ttq) return
  window.ttq.track(event, params || {})
}

// ─── Snapchat Pixel ──────────────────────────────────────────────────────────

export function initSnapchatPixel(pixelId: string) {
  if (typeof window === 'undefined' || window.snaptr) return
  
  ;(function(e: any, t: any, n: any) {
    if (e.snaptr) return
    const a = e.snaptr = function() { a.handleRequest ? a.handleRequest.apply(a, arguments) : a.queue.push(arguments) }
    a.queue = []
    const s = 'script'
    const r = t.createElement(s)
    r.async = !0
    r.src = n
    const u = t.getElementsByTagName(s)[0]
    u.parentNode?.insertBefore(r, u)
  })(window, document, 'https://sc-static.net/scevent.min.js')
  
  window.snaptr('init', pixelId)
  window.snaptr('track', 'PAGE_VIEW')
}

export function snapTrack(event: string, params?: object) {
  if (typeof window === 'undefined' || !window.snaptr) return
  window.snaptr('track', event, params || {})
}

// ─── Unified Event Helpers ────────────────────────────────────────────────────

export function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// ViewContent — fires on product page visit
export function trackViewContent(params: {
  productId: string
  productName: string
  price: number
  currency?: string
}) {
  const eventId = generateEventId()
  const { productId, productName, price, currency = 'MAD' } = params
  
  fbTrack('ViewContent', {
    content_ids: [productId],
    content_name: productName,
    content_type: 'product',
    value: price,
    currency,
  }, eventId)
  
  ttTrack('ViewContent', {
    content_id: productId,
    content_name: productName,
    content_type: 'product',
    value: price,
    currency,
  })
  
  snapTrack('VIEW_CONTENT', {
    item_ids: [productId],
    item_names: [productName],
    price,
    currency,
  })
  
  return eventId
}

// AddToCart
export function trackAddToCart(params: {
  productId: string
  productName: string
  price: number
  quantity: number
  currency?: string
}) {
  const eventId = generateEventId()
  const { productId, productName, price, quantity, currency = 'MAD' } = params
  
  fbTrack('AddToCart', {
    content_ids: [productId],
    content_name: productName,
    content_type: 'product',
    value: price,
    currency,
    num_items: quantity,
  }, eventId)
  
  ttTrack('AddToCart', {
    content_id: productId,
    content_name: productName,
    quantity,
    value: price,
    currency,
  })
  
  snapTrack('ADD_CART', {
    item_ids: [productId],
    price,
    currency,
  })
  
  return eventId
}

// InitiateCheckout
export function trackInitiateCheckout(params: {
  value: number
  numItems: number
  currency?: string
}) {
  const eventId = generateEventId()
  
  fbTrack('InitiateCheckout', {
    value: params.value,
    currency: params.currency || 'MAD',
    num_items: params.numItems,
  }, eventId)
  
  ttTrack('InitiateCheckout', {
    value: params.value,
    currency: params.currency || 'MAD',
  })
  
  snapTrack('START_CHECKOUT', {
    price: params.value,
    currency: params.currency || 'MAD',
  })
  
  return eventId
}

// Purchase — web side (CAPI fires from backend too — both use same eventId for dedup)
export function trackPurchase(params: {
  orderId: string
  value: number
  items: Array<{ productId: string; productName: string; quantity: number }>
  currency?: string
  eventId: string
}) {
  const { orderId, value, items, currency = 'MAD', eventId } = params
  
  fbTrack('Purchase', {
    value,
    currency,
    content_ids: items.map(i => i.productId),
    content_type: 'product',
    num_items: items.reduce((s, i) => s + i.quantity, 0),
    order_id: orderId,
  }, eventId)
  
  ttTrack('CompletePayment', {
    value,
    currency,
    content_id: items.map(i => i.productId).join(','),
    quantity: items.reduce((s, i) => s + i.quantity, 0),
    order_id: orderId,
  })
  
  snapTrack('PURCHASE', {
    transaction_id: orderId,
    price: value,
    currency,
    item_ids: items.map(i => i.productId),
  })
}
```

### Deferred Loading (app/layout.tsx or root layout)

```tsx
// app/layout.tsx — ALWAYS defer pixels, never block render

'use client'
import { useEffect } from 'react'
import { initFacebookPixel, initTikTokPixel, initSnapchatPixel } from '@/lib/pixels'

function PixelLoader() {
  useEffect(() => {
    // Defer pixel loading to after hydration
    const timer = setTimeout(() => {
      const fbPixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID
      const ttPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID
      const snapPixelId = process.env.NEXT_PUBLIC_SNAPCHAT_PIXEL_ID
      
      if (fbPixelId) initFacebookPixel(fbPixelId)
      if (ttPixelId) initTikTokPixel(ttPixelId)
      if (snapPixelId) initSnapchatPixel(snapPixelId)
    }, 0) // setTimeout 0 = after current render cycle
    
    return () => clearTimeout(timer)
  }, [])
  
  return null
}
```

---

## Server-Side CAPI (Backend)

### services/capi.py

```python
import httpx
import hashlib
import time
from app.config import settings
from app.models.order import Order
from typing import Optional

def sha256_hash(value: str) -> str:
    """Hash PII for CAPI — required for server-side events."""
    return hashlib.sha256(value.strip().lower().encode()).hexdigest()

def format_phone_e164(phone: str) -> str:
    """Convert Moroccan phone to E.164: 0612345678 → +212612345678"""
    phone = phone.strip().replace(' ', '').replace('-', '')
    if phone.startswith('0'):
        return '+212' + phone[1:]
    return phone

# ─── Facebook CAPI ────────────────────────────────────────────────────────────

async def send_facebook_purchase_capi(order: Order, event_id: str):
    if not settings.FACEBOOK_ACCESS_TOKEN or not settings.FACEBOOK_PIXEL_ID:
        return
    
    phone_e164 = format_phone_e164(order.phone)
    
    payload = {
        "data": [{
            "event_name": "Purchase",
            "event_time": int(time.time()),
            "event_id": event_id,          # dedup with web pixel
            "action_source": "website",
            "event_source_url": f"https://relaxia.store/thank-you",
            "user_data": {
                "ph": [sha256_hash(phone_e164)],   # hashed phone (E.164)
                "ct": [sha256_hash(order.city.lower())],
                "country": [sha256_hash("ma")],    # morocco
                "client_ip_address": order.ip_address,
                "client_user_agent": order.user_agent,
                "fbp": order.fbp,
                "fbc": order.fbc,
            },
            "custom_data": {
                "currency": "MAD",
                "value": float(order.total_price),
                "order_id": order.order_id,
                "content_ids": [item.product_id for item in order.items],
                "content_type": "product",
                "num_items": sum(item.quantity for item in order.items),
            },
        }],
    }
    
    url = f"https://graph.facebook.com/v20.0/{settings.FACEBOOK_PIXEL_ID}/events"
    params = {"access_token": settings.FACEBOOK_ACCESS_TOKEN}
    
    if settings.FACEBOOK_TEST_EVENT_CODE:
        payload["test_event_code"] = settings.FACEBOOK_TEST_EVENT_CODE
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(url, params=params, json=payload)
            response.raise_for_status()
    except Exception as e:
        print(f"Facebook CAPI error: {e}")

# ─── TikTok CAPI ─────────────────────────────────────────────────────────────

async def send_tiktok_purchase_capi(order: Order, event_id: str):
    if not settings.TIKTOK_ACCESS_TOKEN or not settings.TIKTOK_PIXEL_ID:
        return
    
    phone_e164 = format_phone_e164(order.phone)
    
    payload = {
        "pixel_code": settings.TIKTOK_PIXEL_ID,
        "event": "CompletePayment",
        "event_id": event_id,
        "timestamp": str(int(time.time())),
        "context": {
            "user": {
                "phone_number": sha256_hash(phone_e164),   # hashed, E.164 required
            },
            "ip": order.ip_address,
            "user_agent": order.user_agent,
            "ttclid": order.ttclid,
        },
        "properties": {
            "currency": "MAD",
            "value": float(order.total_price),
            "order_id": order.order_id,
            "content_type": "product",
            "contents": [
                {
                    "content_id": item.product_id,
                    "content_name": item.product_name,
                    "quantity": item.quantity,
                    "price": float(item.unit_price),
                }
                for item in order.items
            ],
        },
    }
    
    url = "https://business-api.tiktok.com/open_api/v1.3/event/track/"
    headers = {"Access-Token": settings.TIKTOK_ACCESS_TOKEN}
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
    except Exception as e:
        print(f"TikTok CAPI error: {e}")

# ─── Snapchat CAPI ────────────────────────────────────────────────────────────

async def send_snapchat_purchase_capi(order: Order, event_id: str):
    if not settings.SNAPCHAT_ACCESS_TOKEN or not settings.SNAPCHAT_PIXEL_ID:
        return
    
    phone_e164 = format_phone_e164(order.phone)
    
    payload = {
        "pixel_id": settings.SNAPCHAT_PIXEL_ID,
        "timestamp": int(time.time() * 1000),  # Snapchat uses milliseconds
        "event_conversion_type": "WEB",
        "event_type": "PURCHASE",
        "event_id": event_id,
        "user_data": {
            "phone_number": sha256_hash(phone_e164),
            "client_ip_address": order.ip_address,
            "client_user_agent": order.user_agent,
        },
        "custom_data": {
            "currency": "MAD",
            "price": float(order.total_price),
            "transaction_id": order.order_id,
            "item_ids": [item.product_id for item in order.items],
            "number_items": sum(item.quantity for item in order.items),
        },
    }
    
    url = "https://tr.snapchat.com/v2/conversion"
    headers = {
        "Authorization": f"Bearer {settings.SNAPCHAT_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
    except Exception as e:
        print(f"Snapchat CAPI error: {e}")

# ─── Unified CAPI Sender ──────────────────────────────────────────────────────

async def send_purchase_capi(order: Order, event_id: Optional[str] = None):
    """Called from background task after order finalization."""
    if not event_id:
        import random, string
        event_id = f"capi_{''.join(random.choices(string.ascii_lowercase + string.digits, k=16))}"
    
    import asyncio
    await asyncio.gather(
        send_facebook_purchase_capi(order, event_id),
        send_tiktok_purchase_capi(order, event_id),
        send_snapchat_purchase_capi(order, event_id),
        return_exceptions=True,  # Don't fail if one CAPI fails
    )
```

---

## Event Tracking (Frontend → Backend)

### Track Event API Route (for storing events in DB)

```typescript
// app/api/track/route.ts (Next.js API route)
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  
  // Forward to backend for storage
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  await fetch(`${backendUrl}/api/track/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...body,
      ip_address: req.headers.get('x-forwarded-for') || req.ip,
      user_agent: req.headers.get('user-agent'),
    }),
  })
  
  return NextResponse.json({ ok: true })
}
```

---

## Events Fired Per Page/Action

| Event | Web Pixel | CAPI | When |
|-------|-----------|------|------|
| PageView | ✅ all pages | ❌ | Page load |
| ViewContent | ✅ | ❌ | Product page |
| AddToCart | ✅ | ❌ | Add to cart button |
| InitiateCheckout | ✅ | ❌ | Click "إتمام الطلب" |
| Purchase | ✅ | ✅ | Order finalized |

---

## Deduplication Strategy

```
Event ID format: evt_{timestamp}_{random8chars}
Example:         evt_1748000000000_k7m2x9qp

1. Frontend generates event_id before firing web pixel Purchase event
2. Same event_id is sent to backend with the order creation request
3. Backend stores event_id in DB
4. Backend fires CAPI with same event_id when order is finalized
5. Platforms match on event_id → count as 1 conversion, not 2

Implementation:
  - Frontend: trackPurchase({ ..., eventId: generatedId })
  - Backend: store eventId in order record
  - CAPI: use stored eventId
```

---

## Verifying Pixel Installation

### Facebook
1. Install Meta Pixel Helper Chrome extension
2. Navigate to product page → check for ViewContent
3. Add to cart → check for AddToCart
4. Place test order → check for Purchase in Events Manager

### TikTok
1. Install TikTok Pixel Helper Chrome extension
2. Similar verification flow

### Snapchat
1. Use Snapchat Pixel Helper
2. Verify events in Snap Ads Manager → Events

### Test Events
- Facebook: set `FACEBOOK_TEST_EVENT_CODE` in backend .env
- TikTok: use TikTok Events API test tool
- Snapchat: use Snap Events Manager test events tab
