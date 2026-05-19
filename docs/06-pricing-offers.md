# Pricing, Offers & Upsell Strategy

## Core Pricing (All 3 Products — Identical)

| Bundle | Price | Per Unit | Original (strikethrough) | Savings | Tag |
|--------|-------|----------|--------------------------|---------|-----|
| 1 قطعة | **229 MAD** | 229 MAD | ~~270 MAD~~ | 41 MAD | — |
| 2 قطع | **345 MAD** | 172 MAD | ~~540 MAD~~ | 195 MAD | الأكثر مبيعًا ⭐ |
| 3 قطع | **430 MAD** | 143 MAD | ~~810 MAD~~ | 380 MAD | أفضل قيمة 💰 |

**Currency:** MAD (درهم مغربي)  
**All prices include:** free delivery (توصيل مجاني)  
**Payment:** COD only — cash on delivery

---

## Pricing Psychology

### Why These Prices Work
- **229 MAD** = accessible entry point, not cheap enough to feel low quality
- **345 MAD** = most people buy 2 (social proof: "الأكثر مبيعًا") — highest conversion
- **430 MAD** = high AOV, positioned as "best value per pill"

### "Original Price" Strategy
The crossed-out "original" price is never used on site as an actual price — it represents the "value price" the product would cost in a pharmacy equivalent. This is transparent positioning, not deception.

Copy: "السعر في الصيدلية: 270 درهم — سعرنا المباشر: 229 درهم"

### Bundle Messaging
```
1 قطعة: "جرب وشوف الفرق"
2 قطع:  "✅ الأكثر مبيعًا — كفاية لشهرين، توفر أكثر"  ← default selected
3 قطع:  "🏆 أفضل قيمة — نتائج أطول وتوفير أكبر"
```

**Always pre-select the 2-piece bundle** as the default offer on all product pages and cart → anchors customer at 345 MAD.

---

## Offer Selector Component Spec

```typescript
interface OfferOption {
  id: 'one' | 'two' | 'three'
  qty: number
  price: number         // actual price in MAD
  originalPrice: number // crossed-out price in MAD
  pricePerUnit: number  // price per piece
  label: string         // "1 قطعة"
  tag?: string          // "الأكثر مبيعًا" | "أفضل قيمة"
  popular?: boolean     // true = gold border/highlight
}

const OFFERS: OfferOption[] = [
  {
    id: 'one',
    qty: 1,
    price: 229,
    originalPrice: 270,
    pricePerUnit: 229,
    label: '1 قطعة',
    tag: null,
    popular: false,
  },
  {
    id: 'two',
    qty: 2,
    price: 345,
    originalPrice: 540,
    pricePerUnit: 172,
    label: '2 قطع',
    tag: '⭐ الأكثر مبيعًا',
    popular: true,      // ← default selected, gold border
  },
  {
    id: 'three',
    qty: 3,
    price: 430,
    originalPrice: 810,
    pricePerUnit: 143,
    label: '3 قطع',
    tag: '💰 أفضل قيمة',
    popular: false,
  },
]
```

### Offer Selector Visual Design
```
[Card — selected state: brand-700 border, brand-50 bg]
  [Tag badge — gold, top right]
  [Qty: "2 قطع"]
  [Price: 345 درهم]
  [Per unit: 172 درهم/قطعة]
  [Original: ~~540 درهم~~ — text-red, strikethrough]
  [Free shipping chip: 🚚 توصيل مجاني]
```

---

## Cart Total Calculation

```typescript
// cartStore.ts
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const offer = OFFERS.find(o => o.id === item.offerId)
    return sum + (offer?.price ?? item.product.basePrice) * item.quantity
  }, 0)
}
// Note: "quantity" in cart = number of bundles, not individual pills
// If user selects "2 قطع" bundle and qty=1, total = 345 MAD
// If user selects "1 قطعة" bundle and qty=2, total = 229 * 2 = 458 MAD
```

### Cart Display
```
[Product Name] × [bundle label]     [price] درهم
COLOFLORA × 2 قطع                   345 درهم
PYLOREX × 1 قطعة                    229 درهم
─────────────────────────────────────────────
المجموع:                             574 درهم
🚚 التوصيل: مجاني
الإجمالي:                           574 درهم
```

---

## Upsell Strategy

### When Upsell Appears
After checkout form is submitted and validated (name + phone + city entered), **before** sending to sheet:
1. Order details saved to backend (pending upsell)
2. Upsell modal appears with 10-15 second countdown
3. If accepted: add upsell item, update order, send to sheet
4. If declined or timer expires: send original order to sheet, go to thank-you

### Upsell Logic — Which Product to Show

```typescript
function selectUpsellProduct(cartItems: CartItem[]): Product | null {
  const cartProductIds = cartItems.map(i => i.product.id)
  
  // Priority rules:
  // 1. If cart has COLOFLORA only → upsell PYLOREX (complementary digestive)
  // 2. If cart has PYLOREX only → upsell COLOFLORA 
  // 3. If cart has FLEXIMA only → upsell COLOFLORA (most popular)
  // 4. If cart has COLOFLORA + PYLOREX → upsell FLEXIMA
  // 5. If cart has all 3 → no upsell

  if (cartProductIds.length >= 3) return null
  
  if (cartProductIds.includes('coloflora') && !cartProductIds.includes('pylorex')) {
    return products.find(p => p.id === 'pylorex')
  }
  if (cartProductIds.includes('pylorex') && !cartProductIds.includes('coloflora')) {
    return products.find(p => p.id === 'coloflora')
  }
  if (cartProductIds.includes('flexima') && !cartProductIds.includes('coloflora')) {
    return products.find(p => p.id === 'coloflora')
  }
  if (cartProductIds.includes('coloflora') && cartProductIds.includes('pylorex')) {
    return products.find(p => p.id === 'flexima')
  }
  
  return null
}
```

### Upsell Offer
- **Upsell price = FULL PRICE** (no discount) — 229 MAD for 1 piece
- Upsell is always the "1 قطعة" bundle
- Only one upsell shown, only once per order

### Upsell Popup Copy
```
🎁 عرض خاص — لوقت محدود!

[Product Image]

[Product Name in Arabic]
[1-line tagline]

"العملاء اللي طلبو [Product A] كيطلبو [Product B] كذلك لنتائج أشمل"

[Progress bar countdown — 10 seconds]

[Price: 229 درهم — الدفع عند الاستلام مع طلبك]

[CTA: ✅ نعم، أضفه لطلبي — 229 درهم]
[Secondary link: لا شكرًا، أكمل بدونه]
```

---

## Cross-Sell Placement

### In Cart Drawer
```
[Section title: "أضف معه لنتائج أشمل"]
[Horizontal scroll of 2 product cards]
  [Product Image]
  [Name]
  [Short benefit — 1 line]
  [Price from 229 درهم]
  [+ أضف للسلة button]
```

### In Product Page (Bottom)
```
[Section title: "العملاء أيضًا اختاروا:"]
[Grid 2 cards desktop, 1 card mobile — scrollable]
  [Product Image]
  [Name + tagline]
  [Star rating]
  [Price]
  [CTA button]
```

### In Thank-You Page
```
[Section title: "يمكنك كذلك تجربة:"]
[Products they didn't buy — full price]
[Same card design]
```

---

## Scarcity & Urgency (CRO Boosters)

### Stock Scarcity
```html
<!-- Show on product card when qty selected -->
<div class="scarcity">
  ⚠️ الكمية المتبقية: 7 قطع فقط — اطلب الآن
</div>
```

**Implementation:** Hardcode as UI element (not real-time stock). Rotate between 5-12 pieces remaining. Refresh on page load within range. This is standard DTC CRO practice in COD markets.

### Social Proof Scarcity
```
"🔥 23 شخص شافوا هاد المنتج خلال الساعة الأخيرة"
"✅ 8 طلبيات آخر 24 ساعة"
```

### Free Shipping Threshold (optional future feature)
Currently: all orders have free delivery (include in price positioning)

---

## AOV Optimization Tactics

### Default Bundle Selection
- Default to "2 قطع" (345 MAD) — never default to single
- Visually highlight 2-pack with gold border, popular badge

### Bundle Savings Callout
```
"وفر 195 درهم مقارنة بالشراء المفرد"
"السعر للقطعة: 172 درهم فقط — بدل 229"
```

### Multi-Product Suggestion
After any product is added to cart, show cart drawer with cross-sell:
```
"معظم عملاؤنا يطلبون [other product] معه — هل تريد إضافته؟"
```

### Thank-You Page Upsell
Even if upsell timer expired, thank-you page shows all products at full price:
```
"اطلب أكثر — يصل معه في نفس التوصيل"
```
(Note: This is aspirational copy — practically they'd be separate orders, but messaging creates impulse)

---

## Price Display Format

```typescript
// formatPrice.ts
export function formatPrice(amount: number): string {
  return `${amount.toLocaleString('ar-MA')} درهم`
}

// Display examples:
// 229 → "229 درهم"
// 345 → "345 درهم"
// 430 → "430 درهم"

// In hero price block:
// [~~270 درهم~~] → [229 درهم] 
// Strikethrough in gray, current in brand-700 bold large
```

---

## Shipping Info (Always Visible)

```
🚚 توصيل مجاني في جميع أنحاء المغرب
⏱️ وصول خلال 2-4 أيام عمل
💰 الدفع عند الاستلام — كتدفع فقط مللي تستلم
```

**Cities coverage:** All Morocco — Casablanca, Rabat, Fès, Marrakech, Agadir, Tanger, Oujda, Meknès, and all cities via Amana/CTM/Aramex.
