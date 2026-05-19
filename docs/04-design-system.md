# Design System

## Core Design Principles

1. **Premium Medical Authority** — looks like a trusted pharmacy, not a marketplace
2. **Warm & Moroccan** — never cold/clinical; always human, culturally resonant
3. **Conversion First** — every design decision serves CRO, confirmation, and delivery rate
4. **Mobile First RTL** — 80%+ of Moroccan traffic is mobile, RTL Arabic
5. **Speed** — never sacrifice performance for visual flourish

---

## Color System

```css
/* tailwind.config.ts custom colors */
colors: {
  brand: {
    50:  '#F0F7F4',
    100: '#D4E8DD',
    200: '#A9D1BB',
    300: '#7DBA99',
    400: '#52A377',
    500: '#268C55',
    600: '#1B7344',   /* primary light */
    700: '#0B4D2E',   /* PRIMARY — main CTAs, headings */
    800: '#083A22',
    900: '#0A2116',   /* darkest — near black text */
  },
  gold: {
    300: '#E8D08A',
    400: '#D4B85A',
    500: '#C9A84C',   /* GOLD ACCENT — stars, badges, premium */
    600: '#B8960A',
    700: '#8C7208',
  },
  neutral: {
    warm: '#FAFAF8',  /* page background */
    surface: '#F0F7F4', /* card/section background */
    border: '#D4E8DD',  /* borders */
    muted: '#4A6555',   /* secondary text */
  },
  status: {
    success: '#27AE60',
    warning: '#F39C12',
    error:   '#C0392B',
    info:    '#2980B9',
  }
}
```

### Color Usage Rules
- **Primary CTA buttons**: `bg-brand-700 hover:bg-brand-800 text-white`
- **Secondary buttons**: `border border-brand-700 text-brand-700 hover:bg-brand-50`
- **Gold elements**: stars, "بيست سيلر" badge, "مضمون" badge
- **Red/urgency**: scarcity banners only — never overuse
- **White text on dark**: only on brand-700 or darker backgrounds

---

## Typography

### Font Setup (next/font/google)
```typescript
import { Cairo, Tajawal, Inter } from 'next/font/google'

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
})

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-tajawal',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})
```

### Typography Scale & Usage
```
Section Headings (H1):     Cairo 800, 36-48px, brand-900
Product Names (H2):        Cairo 700, 28-36px, brand-900
Section Titles (H3):       Cairo 700, 22-28px, brand-900
Card Titles:               Cairo 600, 18-22px, brand-900
Body text:                 Tajawal 400, 16-18px, brand-900/80
Secondary text:            Tajawal 400, 14-16px, neutral-muted
Prices:                    Cairo 800, LTR, brand-700
Badges/Labels:             Cairo 600, 12-14px, uppercase
Numbers/Stats:             Inter 700, brand-700 or gold
```

### RTL Text Rules
```css
/* Root */
html { direction: rtl; }

/* Prices — always LTR */
.price { direction: ltr; display: inline-flex; }

/* Icons that imply direction */
.arrow-icon { transform: scaleX(-1); }
```

---

## Spacing System (Tailwind defaults)

```
Section vertical padding: py-16 (64px) desktop, py-10 (40px) mobile
Container max-width: max-w-6xl (1152px) with px-4 sm:px-6 lg:px-8
Card padding: p-6 desktop, p-4 mobile
Gap between cards: gap-6 desktop, gap-4 mobile
```

---

## Component Library

### Button Component

```tsx
// Primary CTA — used for "أضف للسلة", main conversions
<Button variant="primary" size="lg" fullWidth>
  أضف للسلة — الدفع عند الاستلام
</Button>

// Variants:
// primary: bg-brand-700 text-white hover:bg-brand-800
// secondary: border-brand-700 text-brand-700 hover:bg-brand-50
// gold: bg-gold-500 text-white hover:bg-gold-600
// ghost: text-brand-700 hover:bg-brand-50
// danger: bg-red-600 text-white

// Sizes: sm | md | lg | xl
// lg is default for CTAs
```

**Button Styling:**
```css
/* Primary button */
.btn-primary {
  background: #0B4D2E;
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  font-family: Cairo;
  font-weight: 700;
  font-size: 18px;
  width: 100%;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(11, 77, 46, 0.3);
}
.btn-primary:hover {
  background: #083A22;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(11, 77, 46, 0.4);
}
.btn-primary:active {
  transform: translateY(0);
}
```

### Card Component

```css
.card {
  background: white;
  border: 1px solid #D4E8DD;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(11, 77, 46, 0.06);
}
.card:hover {
  box-shadow: 0 4px 16px rgba(11, 77, 46, 0.12);
  transform: translateY(-2px);
  transition: all 0.2s;
}
```

### Trust Badge Component
```tsx
// Displays COD, Guarantee, Natural icons row
<TrustBadges items={[
  { icon: '🚚', text: 'الدفع عند الاستلام' },
  { icon: '🏅', text: 'ضمان ذهبي 30 يوم' },
  { icon: '🌿', text: 'طبيعي 100%' },
  { icon: '🔒', text: 'توصيل آمن' },
]} />
```

### Star Rating Component
```tsx
// Always use gold stars: ⭐⭐⭐⭐⭐
// Rating display: "4.8/5 (1,247 تقييم)"
<StarRating rating={4.8} count={1247} />
```

### Price Display Component
```tsx
// Shows: [crossed-out original] → [offer price] in MAD
<PriceDisplay 
  original={270}    // crossed out
  current={229}     // highlighted in brand-700
  currency="درهم"
/>
```

### Offer Selector Component (in product card)
```tsx
// 3 buttons to select quantity bundle
<OfferSelector
  options={[
    { qty: 1, price: 229, label: '1 قطعة', tag: null },
    { qty: 2, price: 345, label: '2 قطع', tag: 'الأكثر مبيعًا', popular: true },
    { qty: 3, price: 430, label: '3 قطع', tag: 'أفضل قيمة' },
  ]}
  selected={selectedOffer}
  onChange={setSelectedOffer}
/>
```

### Countdown Timer Component
```tsx
// Used in upsell popup (10-15 second countdown)
<CountdownTimer 
  seconds={15}
  onExpire={() => closeUpsell()}
  label="هذا العرض ينتهي خلال:"
/>
```

### Scarcity Banner Component
```tsx
<ScarcityBanner text="⚠️ الكمية المتبقية: 7 قطع فقط" />
```

---

## Page Layout Patterns

### Section Layout (Alternating image/text)
```
Desktop:  [Image Left] [Text Right] → [Text Left] [Image Right]
Mobile:   [Image Top] [Text Bottom] always

Implementation:
<section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
  <div className="order-2 md:order-1">   /* Image */
  <div className="order-1 md:order-2">   /* Text */
</section>

/* Next section reverses */
<section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
  <div className="order-1">              /* Text */
  <div className="order-2">             /* Image */
</section>
```

### Product Card Layout (Hero section on product page)
```
Mobile (stacked):
  [Product Images Carousel]
  [Product Name + Stars + Price]
  [Offer Selector (1/2/3 qty)]
  [Add to Cart CTA]
  [Trust Badges Row]
  [Short Description]

Desktop (2-col):
  Left: [Product Images Gallery]
  Right: [Name] [Stars] [Short Tagline]
         [Offer Selector]
         [Price]
         [Add to Cart CTA — large]
         [Trust Badges]
         [Accordion: Description | Ingredients | How to Use]
```

---

## Header Design

### Structure
```
[🌿R] RELAXIA    [الرئيسية] [المنتجات] [من نحن] [تواصل]    [🛒 2]
```

**Desktop:**
- Fixed/sticky, blurs on scroll (`backdrop-blur-md bg-white/90`)
- Height: 72px
- Logo: Circle avatar (40px) + RELAXIA text in Cairo Bold 20px
- Nav links: Cairo 500, 16px, brand-900, hover: brand-700
- Cart icon: brand-700, with badge count (gold background, white text)

**Mobile:**
- Height: 60px
- Logo only + Cart icon (no nav)
- Hamburger menu → slide-in sheet from right (RTL)
- Menu sheet: full height, all nav links + trust badge strip

**Scroll behavior:**
- On scroll down > 50px: add `shadow-md`
- Background transitions from transparent (only on homepage hero) to white

### Cart Icon Badge
```css
.cart-badge {
  background: #C9A84C;   /* gold */
  color: white;
  font-size: 11px;
  font-weight: 700;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  position: absolute;
  top: -6px;
  /* RTL: left: -6px instead of right */
}
```

---

## Footer Design

### Structure
```
[Logo + Tagline + Brand Description]

[Products]          [روابط]           [مساعدة]
- COLOFLORA         - الرئيسية         - سياسة الاسترداد
- PYLOREX           - المنتجات         - سياسة الخصوصية
- FLEXIMA           - من نحن           - الشروط والأحكام
                    - تواصل معنا       - تتبع الطلب

[Trust Badges Row — full width]
🚚 الدفع عند الاستلام | 🏅 ضمان 30 يوم | 🌿 طبيعي 100% | 📞 دعم مغربي

[© 2026 RELAXIA — relaxia.store — جميع الحقوق محفوظة]
```

**Colors:** Dark section `bg-brand-900 text-white`  
**Links:** Tajawal 400, 14px, white/70, hover: white  
**Trust badges:** Small icons, white text, brand-700 background pills

---

## Cart Drawer Design

**Position:** Slides in from left (RTL convention: left = end of reading)  
**Width:** 400px desktop, full width mobile  
**Overlay:** Black 50% opacity backdrop  
**Z-index:** 50

**Structure:**
```
[Header: سلتك — X close]
[Items list]
  [Product image | Name | Qty controls | Price | Remove]
[Crosssell strip: "أضف معه أيضًا →"]
  [Crossell product cards — horizontal scroll]
[Subtotal]
[CTA: إتمام الطلب — مجانًا عند الاستلام]
[Trust note: 🔒 الدفع عند الاستلام | ضمان 30 يوم]
```

---

## Checkout Modal Design

**Type:** Centered modal overlay  
**Width:** 500px desktop, full screen mobile  
**Animation:** Scale up + fade in

**Structure:**
```
[X Close]
[Order Summary (compact) — items, subtotal]
[Divider]
[Form:]
  [الاسم الكامل — text input]
  [رقم الهاتف — tel input, direction: ltr, placeholder: 0612345678]
  [المدينة — text input or dropdown of Moroccan cities]
[CTA: تأكيد الطلب →]
[Trust: الدفع عند الاستلام | توصيل 2-4 أيام | ضمان 30 يوم]
```

**Form Validation:**
- Name: required, min 2 chars
- Phone: required, must match `/^0[5-7]\d{8}$/` (Moroccan mobile)
- City: required
- CTA always visible/clickable — validation fires on submit, not on blur

---

## Upsell Popup Design

**Trigger:** Fires immediately after successful checkout form validation + order creation  
**Type:** Modal  
**Timer:** 10 seconds countdown (visible progress bar)

**Structure:**
```
[🎁 عرض خاص لك — لوقت محدود!]
[Product Image]
[Product Name + tagline]
[Timer bar — counts down 10s]
["أضف [Product] بـ [price] درهم فقط — الدفع عند الاستلام"]
[CTA: نعم، أضفه لطلبي ✓]
[Secondary: لا شكرًا (small, text link)]
```

**Timer behavior:**
- Progress bar shrinks over 10-15 seconds
- On expire: modal closes, goes to thank-you page
- On "نعم": adds upsell to order, updates sheet, goes to thank-you

---

## Thank You Page Design

**URL:** /thank-you?order={orderId}

**Structure:**
```
[✅ Big animated checkmark]
[شكرًا {name}! طلبك وصلنا 🎉]
[Call confirmation banner:]
  "سنتصل بك على {phone} لتأكيد طلبك خلال أقل من 10 دقائق"
  "⏰ ساعات التواصل: 9 صباحًا إلى 9 مساءً"
  (if outside hours: "سنتصل بك بكرا الصباح")

[Order Summary Card:]
  [Order #] [Date] [Items] [Total]
  
[Excitement copy — build anticipation for delivery]

[Products they'll love section — crosssells at full price]
[Reviews strip]
[Trust badges]
```

---

## Product Page Section Order

1. **Sticky CTA bar** (mobile only, shows on scroll past hero)
2. **Product Card** (hero: images + offer selector + CTA + trust)
3. **Trust Bar** (COD, guarantee, shipping, natural)
4. **Problem Section** — agitate the pain they know
5. **Solution Section** — how this product solves it
6. **Ingredients Section** — each ingredient with icon, name, benefit
7. **How It Works** — 3-step simple process
8. **Results / Before-After** — timeline of expected results
9. **Testimonials** — 6+ real reviews with stars, name, city
10. **Guarantee Section** — 30-day gold guarantee, prominent
11. **FAQ** — 5-7 common objections answered
12. **CrossSell Section** — "أضف معه لنتائج أفضل"
13. **Final CTA** — repeat offer selector + CTA

**Desktop Sticky CTA:** Fixed bar at bottom with product name + CTA button (visible after scrolling past product card)

---

## Animation Guidelines

```
Page transitions: fade in (0.3s ease)
Cart drawer: slide from left (0.3s ease)
Modals: scale(0.95)→scale(1) + opacity(0)→1 (0.25s)
Cart item add: subtle green flash on cart icon
Scroll-triggered sections: fade-in-up (once, on first view)
Hover on cards: translateY(-2px) + shadow (0.2s)
CTA buttons: translateY(-1px) on hover (0.15s)
```

**DO NOT:** use heavy animations, parallax effects, or anything that causes jank on low-end Moroccan phones.

---

## Image Guidelines

### Placeholder Images (until real images provided)
- Use: `bg-brand-100` with centered product name text
- Or: simple branded placeholder SVG with RELAXIA logo

### Real Image Specs
```
Product hero:    800×800px, WebP, transparent or white bg
Product gallery: 800×800px, WebP, multiple angles
Lifestyle:       1200×800px, WebP, product in use
Ingredient:      800×600px, WebP, natural ingredients flat lay
Before/After:    split image 800×600px
Testimonial:     Avatar 80×80px, WebP
Hero banner:     1920×800px desktop, 800×1000px mobile
```

### Next.js Image Component
```tsx
// Always use <Image> from next/image
<Image
  src="/images/products/coloflora/hero.webp"
  alt="كولوفلورا — مكمل دعم القولون"
  width={800}
  height={800}
  priority={isHero}           // priority=true only for hero/LCP
  placeholder="blur"
  blurDataURL="data:..."       // generate with plaiceholder
/>
```

---

## Mobile-Specific Rules

1. All tap targets minimum 44×44px
2. Bottom navigation on mobile: Home, Products, Cart
3. Sticky "Add to Cart" bar: fixed bottom, 64px height, full width
4. Product images: swipe carousel on mobile
5. Offer selector: 3 stacked cards on mobile (not horizontal)
6. Cart drawer: full width on mobile (100vw)
7. Checkout modal: full screen on mobile
8. Font size minimum: 14px (never smaller for readability)
9. Line height: 1.7 for Arabic body text (Arabic needs more breathing room)

---

## Trust Visual Design Patterns

### Ingredient Card
```
[🌿 icon or ingredient image]
[Ingredient Name — Arabic bold]
[Scientific name — small, muted]
[Percentage or amount — gold accent]
[1-line benefit text]
```

### Testimonial Card
```
[⭐⭐⭐⭐⭐]
["Quote text in Darija — 2-3 sentences"]
[Avatar initial circle — green bg, white letter]
[Name — bold] [City — muted] [Verified buyer badge — gold]
```

### Guarantee Box
```
[🏅 Large golden medal icon]
[ضمانتنا الذهبية — 30 يوم كاملين]
[Paragraph explaining guarantee]
[No-risk breakdown: COD | Return | No questions]
```
