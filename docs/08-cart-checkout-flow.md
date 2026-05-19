# Cart, Checkout & Order Flow

## Complete User Journey

```
[Product Page] → [Add to Cart] → [Cart Drawer opens]
      ↓
[Cart Drawer] → [Cross-sells shown] → [Click "إتمام الطلب"]
      ↓
[Checkout Modal opens] (Cart drawer CLOSES first)
      ↓
[Fill: Name + Phone + City] → [Click "تأكيد الطلب"]
      ↓
[Validation passes] → [Order created in backend (pending)]
      ↓
[Checkout Modal CLOSES] → [Upsell Popup appears]
      ↓
[Upsell: 10s timer]
  ├── [Accepted] → [Upsell added to order] → [Sheet updated] → [Thank You page]
  └── [Declined / Timer expired] → [Order sent to Sheet] → [Thank You page]
```

---

## 1. Add to Cart Flow

### Trigger Points
- Product page hero: "أضف للسلة — الدفع عند الاستلام" button
- Collection page product card: "أضف للسلة" button
- Cross-sell cards (in cart drawer, product page bottom): "+ أضف" button
- Sticky CTA bar on product page (mobile)

### Add to Cart Logic
```typescript
// cartStore.ts
function addItem(product: Product, qty: number, offerId: 'one' | 'two' | 'three') {
  const existingIndex = items.findIndex(
    i => i.product.id === product.id && i.offerId === offerId
  )
  
  if (existingIndex >= 0) {
    // Same product + same offer → increment quantity (number of bundles)
    items[existingIndex].quantity += 1
  } else {
    // New item → add to cart
    items.push({ product, qty: 1, offerId })
  }
  
  // Always open cart drawer after adding
  openCart()
  
  // Fire AddToCart pixel event
  trackAddToCart({ product, offerId, price: OFFERS[offerId].price })
}
```

### Cart Feedback Animation
- Cart icon badge: animate scale (bounce) when item added
- Brief green flash on cart icon
- Cart drawer slides in automatically

---

## 2. Cart Drawer

### Component: `CartDrawer.tsx`

**Position:** Fixed overlay, slides from LEFT (RTL: left = end direction)  
**Width:** 420px desktop, 100vw mobile  
**Z-index:** 50  
**Backdrop:** `bg-black/50` click to close  
**Animation:** `translateX(-100%)` → `translateX(0)` in 300ms ease

### Cart Drawer Structure
```tsx
<CartDrawer>
  {/* Header */}
  <div className="flex justify-between items-center p-4 border-b">
    <h2>سلتي ({itemCount} منتجات)</h2>
    <button onClick={closeCart}>✕</button>
  </div>

  {/* Empty state */}
  {items.length === 0 && (
    <EmptyCart 
      message="سلتك فارغة — اكتشف منتجاتنا"
      cta={{ label: "اكتشف المنتجات", href: "/products" }}
    />
  )}

  {/* Items list */}
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {items.map(item => (
      <CartItem key={`${item.product.id}-${item.offerId}`} item={item} />
    ))}
  </div>

  {/* Cross-sell strip */}
  {crossSellProducts.length > 0 && (
    <CartUpsell products={crossSellProducts} />
  )}

  {/* Summary + CTA */}
  <div className="border-t p-4 space-y-4">
    <CartSummary total={total} />
    <Button variant="primary" size="lg" fullWidth onClick={openCheckout}>
      إتمام الطلب ←
    </Button>
    <TrustBadges compact />
  </div>
</CartDrawer>
```

### CartItem Component
```tsx
<CartItem>
  <Image src={item.product.images.hero} width={80} height={80} />
  <div>
    <p>{item.product.nameAr}</p>
    <p className="text-sm text-muted">{offerLabel}</p>  {/* "2 قطع" */}
  </div>
  <div className="flex items-center gap-2">
    <button onClick={() => decrementQty(item)}>−</button>
    <span>{item.quantity}</span>
    <button onClick={() => incrementQty(item)}>+</button>
  </div>
  <p className="font-bold">{formatPrice(itemTotal)}</p>
  <button onClick={() => removeItem(item)} className="text-muted">🗑</button>
</CartItem>
```

**Note:** Quantity controls adjust the number of bundles, not individual pills. "2 قطع × 2" = 2 bundles of 2 pieces = 4 pieces total = 345×2 = 690 MAD.

### Cart Cross-Sell Strip
```tsx
<CartUpsell>
  <h3 className="text-sm font-bold mb-2">أضف معه لنتائج أشمل:</h3>
  <div className="flex gap-3 overflow-x-auto pb-2">
    {crossSellProducts.map(product => (
      <CrossSellCard
        key={product.id}
        product={product}
        onAdd={() => addItem(product, 1, 'one')}
      />
    ))}
  </div>
</CartUpsell>
```

Cross-sell logic: show products NOT already in cart (max 2 products shown).

---

## 3. Checkout Modal

### Trigger
- Click "إتمام الطلب" in cart drawer
- Cart drawer CLOSES simultaneously (not both visible at once)

### Component: `CheckoutModal.tsx`

**Type:** Centered modal with overlay  
**Width:** 480px desktop, 100vw / full screen mobile  
**Animation:** scale(0.95)→scale(1) + fade in, 250ms  
**Z-index:** 60 (above cart drawer 50)

### Checkout Modal Structure
```tsx
<CheckoutModal>
  {/* Close button */}
  <button onClick={handleClose} className="absolute top-4 left-4">✕</button>

  {/* Order Summary (compact) */}
  <div className="bg-brand-50 rounded-lg p-4 mb-6">
    <h3 className="font-bold mb-2">ملخص طلبك:</h3>
    {items.map(item => (
      <div key={item.id} className="flex justify-between text-sm">
        <span>{item.nameAr} × {item.qty}</span>
        <span>{formatPrice(item.price)}</span>
      </div>
    ))}
    <div className="border-t mt-2 pt-2 flex justify-between font-bold">
      <span>المجموع:</span>
      <span>{formatPrice(total)} درهم</span>
    </div>
    <p className="text-sm text-success mt-1">🚚 التوصيل: مجاني</p>
  </div>

  {/* Form */}
  <CheckoutForm onSubmit={handleOrderSubmit} />

  {/* Trust badges */}
  <TrustBadges compact className="mt-4" />
</CheckoutModal>
```

### CheckoutForm Component
```tsx
<CheckoutForm>
  <form onSubmit={handleSubmit(onSubmit)}>
    {/* Name */}
    <div className="field">
      <label>الاسم الكامل *</label>
      <input
        type="text"
        placeholder="مثال: محمد الأمين"
        {...register('name', { required: true, minLength: 2 })}
      />
      {errors.name && <span className="error">الرجاء إدخال اسمك</span>}
    </div>

    {/* Phone */}
    <div className="field">
      <label>رقم الهاتف *</label>
      <input
        type="tel"
        placeholder="0612345678"
        dir="ltr"
        {...register('phone', {
          required: true,
          pattern: /^0[5-7]\d{8}$/,
        })}
      />
      <p className="hint text-sm text-muted">مثال: 0612345678</p>
      {errors.phone && <span className="error">رقم هاتف مغربي غير صحيح</span>}
    </div>

    {/* City */}
    <div className="field">
      <label>المدينة *</label>
      <input
        type="text"
        placeholder="مثال: الدار البيضاء"
        {...register('city', { required: true })}
      />
      {errors.city && <span className="error">الرجاء إدخال مدينتك</span>}
    </div>

    {/* Submit */}
    <Button
      type="submit"
      variant="primary"
      size="lg"
      fullWidth
      loading={isSubmitting}
    >
      {isSubmitting ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب — الدفع عند الاستلام ←'}
    </Button>
  </form>
</CheckoutForm>
```

### Form Validation Rules
```typescript
const schema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  phone: z.string().regex(
    /^0[5-7]\d{8}$/,
    'رقم هاتف مغربي غير صحيح — مثال: 0612345678'
  ),
  city: z.string().min(2, 'الرجاء إدخال المدينة'),
})
```

### On Form Submit
```typescript
async function handleOrderSubmit(formData: CheckoutFormData) {
  try {
    setIsSubmitting(true)
    
    // 1. Create order in backend (status: pending_upsell)
    const order = await createOrder({
      customer: formData,
      items: cartItems,
      total: cartTotal,
      source: getUTMSource(),
      fbclid: getFbclid(),
    })
    
    // 2. Fire Purchase pixel event
    trackPurchase({ orderId: order.orderId, value: cartTotal, items: cartItems })
    
    // 3. Close checkout modal
    closeCheckout()
    closeCart()
    
    // 4. Show upsell popup
    const upsellProduct = selectUpsellProduct(cartItems)
    if (upsellProduct) {
      showUpsell(upsellProduct, order.orderId)
    } else {
      // No upsell → go to thank you directly
      await finalizeOrder(order.orderId)
      router.push(`/thank-you?order=${order.orderId}`)
    }
    
  } catch (error) {
    setError('حدث خطأ — حاول مرة أخرى')
    setIsSubmitting(false)
  }
}
```

---

## 4. Upsell Popup

### Component: `UpsellPopup.tsx`

**Trigger:** Immediately after order creation succeeds  
**Timer:** 10 seconds (configurable)  
**Z-index:** 70 (above everything)  
**Backdrop:** blur + dark overlay  
**Cannot be closed by clicking backdrop** — must use buttons

### Upsell Popup Structure
```tsx
<UpsellPopup product={upsellProduct} orderId={orderId}>
  {/* Header */}
  <div className="bg-gold-500 text-white text-center py-3 rounded-t-xl">
    🎁 عرض خاص لك — لوقت محدود!
  </div>

  {/* Content */}
  <div className="p-6">
    <Image src={product.images.hero} width={200} height={200} className="mx-auto" />
    
    <h3 className="text-xl font-bold text-center mt-4">{product.nameAr}</h3>
    <p className="text-center text-muted">{product.taglineAr}</p>
    
    <p className="text-center mt-3 text-sm">
      "العملاء اللي طلبو من ريلاكسيا اختاروا {product.nameAr} كذلك لنتائج أشمل"
    </p>

    {/* Countdown */}
    <div className="mt-4">
      <p className="text-center text-sm text-muted">هذا العرض ينتهي خلال:</p>
      <CountdownTimer
        seconds={10}
        onExpire={handleExpire}
      />
    </div>

    {/* Price */}
    <p className="text-center text-2xl font-bold text-brand-700 mt-4">
      229 درهم فقط
    </p>
    <p className="text-center text-sm text-muted">يُضاف لنفس طلبك — الدفع عند الاستلام</p>

    {/* CTAs */}
    <Button
      variant="primary"
      size="lg"
      fullWidth
      onClick={handleAcceptUpsell}
      loading={isProcessing}
      className="mt-4"
    >
      ✅ نعم، أضفه لطلبي
    </Button>
    
    <button
      onClick={handleDeclineUpsell}
      className="w-full text-center text-sm text-muted mt-3 py-2 hover:text-brand-700"
    >
      لا شكرًا، أكمل بدونه
    </button>
  </div>
</UpsellPopup>
```

### CountdownTimer Component
```tsx
function CountdownTimer({ seconds, onExpire }) {
  const [remaining, setRemaining] = useState(seconds)
  
  useEffect(() => {
    if (remaining <= 0) {
      onExpire()
      return
    }
    const timer = setTimeout(() => setRemaining(r => r - 1), 1000)
    return () => clearTimeout(timer)
  }, [remaining])
  
  const progress = (remaining / seconds) * 100
  
  return (
    <div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-700 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-center font-bold text-lg mt-1">{remaining}s</p>
    </div>
  )
}
```

### Upsell Accept Handler
```typescript
async function handleAcceptUpsell() {
  setIsProcessing(true)
  try {
    // Add upsell item to existing order
    await addUpsellToOrder(orderId, {
      product: upsellProduct,
      qty: 1,
      offerId: 'one',
      price: 229,
      isUpsell: true,
    })
    
    // Navigate to thank you
    router.push(`/thank-you?order=${orderId}&upsell=true`)
  } catch {
    // On error, still go to thank you without upsell
    router.push(`/thank-you?order=${orderId}`)
  }
}

async function handleDeclineUpsell() {
  // Finalize order without upsell
  await finalizeOrder(orderId)
  router.push(`/thank-you?order=${orderId}`)
}

async function handleExpire() {
  // Timer ran out → finalize without upsell
  await finalizeOrder(orderId)
  router.push(`/thank-you?order=${orderId}`)
}
```

---

## 5. Thank You Page

### URL: `/thank-you?order=RLX-20260519-1234`

### Data Loading
```typescript
// Fetch order data from backend on page load
const order = await fetchOrder(searchParams.order)
// Contains: customer name, phone, city, items, total, date
```

### Confirmation Call Banner Logic
```typescript
function getCallMessage(orderTime: Date): string {
  const hour = orderTime.getHours()
  
  if (hour >= 9 && hour < 21) {
    // Business hours
    return {
      title: '📞 سنتصل بك خلال أقل من 10 دقائق!',
      subtitle: `سيتصل بك فريقنا على ${formatPhone(order.phone)} لتأكيد طلبك وعنوانك`,
      hours: 'ساعات التواصل: من 9 صباحًا إلى 9 مساءً',
    }
  } else {
    // Outside business hours
    return {
      title: '📞 طلبك وصلنا بنجاح!',
      subtitle: `سنتصل بك على ${formatPhone(order.phone)} بكرا الصباح حال فتح ساعات العمل`,
      hours: '⏰ سنتصل بك من الساعة 9 صباحًا',
    }
  }
}
```

### Thank You Page Cart Behavior
- Cart is cleared on successful order creation (before navigating to thank-you)
- Cart drawer is closed
- Checkout modal is closed
- Local cart state is reset

### Phone Number Display Format
```typescript
// Display partially masked for privacy + confirmation
function formatPhoneDisplay(phone: string): string {
  // 0612345678 → 0612 *** 678
  return `${phone.slice(0, 4)} *** ${phone.slice(-3)}`
}
```

---

## 6. Order Finalization (Backend)

### Order States
```
pending_upsell  → Order created, waiting for upsell decision
confirmed       → Upsell decision made, sent to Google Sheets
processing      → Admin confirmed, being prepared
shipped         → Dispatched to customer
delivered       → Customer received
cancelled       → Order cancelled
returned        → Customer returned
```

### Finalize Order API Call
```typescript
// POST /api/orders/{orderId}/finalize
// Called after: upsell accepted/declined/expired
// Action: changes status → confirmed, triggers Google Sheets webhook
```

### Google Sheets Webhook (async)
- Order finalization triggers background task
- Backend sends order data to Google Sheets webhook URL
- Non-blocking: customer goes to thank-you immediately
- Retries up to 3 times on failure
- Marks `sheet_synced = true` when successful

---

## 7. Order ID Generation

```typescript
// Format: RLX-YYYYMMDD-XXXX (random 4-char alphanumeric)
function generateOrderId(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `RLX-${dateStr}-${random}`
}
// Example: RLX-20260519-K7M2
```

---

## 8. State Management Summary

### Cart Store (Zustand + localStorage persistence)
```typescript
// Persist cart in localStorage so it survives page refresh
const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      // ... actions
    }),
    {
      name: 'relaxia-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

### UI Store (no persistence — ephemeral)
```typescript
const useUIStore = create((set) => ({
  checkoutModalOpen: false,
  upsellModalOpen: false,
  upsellProduct: null,
  currentOrderId: null,
  // ... actions
}))
```

---

## 9. Error Handling

### Network Errors
```typescript
// Show toast notification
toast.error('حدث خطأ في الاتصال — حاول مرة أخرى')
// Keep checkout form open, don't navigate away
```

### Validation Errors
```typescript
// Show inline field errors
// Button stays enabled (validate on submit, not on blur)
```

### Upsell API Error
```typescript
// If upsell addition fails → silently proceed to thank-you without upsell
// Log error in backend
// User experience not disrupted
```

---

## 10. Mobile UX Specifics

### Cart Drawer on Mobile
- Full viewport width (100vw)
- Closes with swipe gesture (left swipe for RTL)
- Bottom sheet style on very small screens (< 375px)

### Checkout Modal on Mobile
- Full screen (100vh, 100vw)
- Keyboard-aware scrolling (form fields don't get hidden behind keyboard)
- Use `viewport-fit: cover` for notched phones

### Sticky CTA Bar (Mobile only)
```tsx
// Appears after scrolling past product hero section
<div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t p-4 shadow-up">
  <Button variant="primary" size="lg" fullWidth onClick={handleAddToCart}>
    أضف للسلة — {formatPrice(selectedOffer.price)}
  </Button>
</div>
```

---

## 11. Scroll Behavior Fix

```typescript
// When sticky CTA is clicked, scroll to product card heading (not top of page)
function scrollToProductCard() {
  const heading = document.getElementById('product-heading')
  heading?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
```

This ensures the product name stays at top of screen, not the very top of the page.
