# Master Prompt — For AI Coder

Use this prompt to brief your AI coding assistant to build the RELAXIA store.

---

## PROMPT TO GIVE YOUR AI CODER

---

Build a complete branded DTC e-commerce store for **RELAXIA** (relaxia.store) — a premium natural wellness brand in Morocco selling 3 health supplement products via COD (Cash on Delivery). The store must be in Arabic (Moroccan Darija), fully RTL, mobile-first, and engineered for maximum conversion, confirmation, and delivery rate.

Read and implement **everything** in the `docs/` folder before writing a single line of code.

---

## DOCS INDEX (read all before starting)

| File | Contents |
|------|---------|
| `docs/01-brand-identity.md` | Brand name, identity, colors, typography, voice, logo |
| `docs/02-icp-messaging.md` | Target customer profiles, pain points, Darija copy bank, objections |
| `docs/03-architecture.md` | Full tech stack, folder structure, data models, coding rules |
| `docs/04-design-system.md` | Color system, components, layouts, mobile rules, animations |
| `docs/05-products.md` | All 3 products: ingredients, copy, testimonials, FAQ (complete) |
| `docs/06-pricing-offers.md` | Pricing logic, bundle strategy, upsell flow, AOV tactics |
| `docs/07-pages-structure.md` | All pages: homepage, collection, product pages, about, contact, policies, thank-you |
| `docs/08-cart-checkout-flow.md` | Cart drawer, checkout modal, upsell popup, thank-you page — full spec + code |
| `docs/09-backend-api.md` | FastAPI endpoints, SQLAlchemy models, Alembic migrations, full code |
| `docs/10-pixels-tracking.md` | Facebook, TikTok, Snapchat web pixels + CAPI implementation |
| `docs/11-google-sheets.md` | Apps Script webhook, sheet columns, order payload format |
| `docs/12-admin-dashboard.md` | Admin metrics, orders table, order preview, auth |
| `docs/13-deployment.md` | Docker, EasyPanel, env variables, domain setup |
| `docs/14-cro-copywriting.md` | CRO rules, micro-copy, confirmation rate optimization, scarcity tactics |

---

## WHAT TO BUILD

### Frontend (Next.js 15 + React 19 + TypeScript + Tailwind CSS)

**Pages to build:**
- `/` — Homepage with hero, trust bar, products grid, why us, how it works, testimonials, final CTA
- `/products` — Collection page with all 3 products + comparison table
- `/products/coloflora` — COLOFLORA product page (full)
- `/products/pylorex` — PYLOREX product page (full)
- `/products/flexima` — FLEXIMA product page (full)
- `/about` — Brand story + values + numbers
- `/contact` — Contact form + info
- `/thank-you` — Order confirmation with call prep, order summary, excitement builder, cross-sells
- `/policies/privacy` — Privacy policy
- `/policies/refund` — Refund policy (30-day gold guarantee)
- `/policies/terms` — Terms & conditions
- `/admin/login` — Admin login
- `/admin` — Dashboard with metrics + charts (Recharts)
- `/admin/orders` — Orders table with filters, search, export

**Components to build:**
- Global: Header (sticky, RTL, with cart badge), Footer, CartDrawer, CheckoutModal, UpsellPopup
- Common: Button, Badge, StarRating, OfferSelector, PriceDisplay, TrustBadges, ScarcityBanner, CountdownTimer
- Product: ProductCard (hero), ProblemSection, SolutionSection, IngredientsSection, HowToUseSection, TestimonialsSection, GuaranteeSection, FAQSection, CrossSellSection, StickyAddToCart
- Admin: MetricsCard, OrdersTable, OrderPreview, DateRangePicker

**State management:**
- Zustand for cart (persisted to localStorage) and UI state
- RTL direction on `<html>` element
- Cairo + Tajawal Google Fonts via next/font

**Tracking:**
- Deferred pixel loading (setTimeout 0 after hydration)
- trackViewContent, trackAddToCart, trackInitiateCheckout, trackPurchase
- Event ID generation for deduplication

### Backend (Python FastAPI + PostgreSQL + Alembic)

**Endpoints:**
- `POST /api/orders` — create order (returns order_id)
- `POST /api/orders/{id}/upsell` — add upsell item
- `POST /api/orders/{id}/finalize` — confirm order, trigger sheet sync + CAPI (background task)
- `GET /api/orders/{id}` — fetch order (for thank-you page)
- `POST /api/admin/login` — JWT auth
- `GET /api/admin/metrics` — dashboard metrics
- `GET /api/admin/metrics/chart` — chart data
- `GET /api/admin/orders` — paginated order list
- `GET /api/admin/orders/{id}` — order detail
- `PATCH /api/admin/orders/{id}/status` — update status
- `GET /api/health` — health check

**Services:**
- Google Sheets webhook (async background task, 3 retries)
- Facebook CAPI (Purchase event, SHA-256 hashed PII)
- TikTok CAPI (CompletePayment, phone in E.164)
- Snapchat CAPI (PURCHASE event)
- Alembic migrations run on startup

### Google Apps Script
Build `sheets/google-apps-script-webhook.js` (full Apps Script code as in docs/11) and `sheets/orders-template.csv`

---

## CRITICAL REQUIREMENTS

### RTL
- `<html dir="rtl" lang="ar">` on all store pages
- All Tailwind flex layouts must work RTL
- Prices always LTR within RTL context
- Cart drawer slides from LEFT (RTL end)
- Checkout modal centered
- Test every component in RTL

### Mobile First
- Build all components mobile first, then add `md:` / `lg:` breakpoints
- Sticky "أضف للسلة" bar on mobile product pages
- Cart drawer: full-width on mobile
- Checkout modal: full-screen on mobile
- Minimum tap target: 44×44px

### Pricing (ALL products, identical)
- 1 piece: **229 MAD** (original: ~~270 MAD~~)
- 2 pieces: **345 MAD** (172/piece, original: ~~540 MAD~~)
- 3 pieces: **430 MAD** (143/piece, original: ~~810 MAD~~)
- Default pre-selected: **2 pieces** (Zustand cart + OfferSelector)
- No discounts anywhere except visual original/current comparison
- Upsell price: always full price (229 MAD for 1 piece)

### Cart/Checkout Flow (EXACT sequence)
1. Add to cart → cart drawer opens
2. Click "إتمام الطلب" → cart drawer CLOSES → checkout modal OPENS
3. Fill name + phone (Moroccan format: 0XXXXXXXXX) + city
4. Submit → order created in backend (status: pending_upsell)
5. Checkout modal CLOSES → Upsell popup OPENS (10s timer)
6. Accept: add upsell to order → finalize → thank-you
7. Decline or timer: finalize without upsell → thank-you
8. Thank-you: cart cleared, call prep banner, order summary, cross-sells

### Order ID Format: `RLX-YYYYMMDD-XXXX`
- Example: `RLX-20260519-K7M2`

### Product SKUs
- COLOFLORA: `RLX-COL-30`
- PYLOREX: `RLX-PYL-30`
- FLEXIMA: `RLX-FLX-100`

### Google Sheets Columns
Order ID | Date (DD/MM/YYYY) | Country | Name | Phone | City | Product (ar, slash-sep) | SKU (slash-sep) | Quantity (pieces, slash-sep) | Total Price | Currency | Status (empty)

### Pixels
- Web pixels: DEFERRED (not on initial render — setTimeout 0 in useEffect)
- No hashing on web pixels
- CAPI: SHA-256 hash all PII (phone in E.164: +212XXXXXXXXX)
- Deduplication: same `event_id` on web pixel and CAPI
- All 3 platforms: Facebook, TikTok, Snapchat

---

## DESIGN

**Brand colors:**
- Primary: `#0B4D2E` (deep forest green)
- Gold: `#C9A84C` (Moroccan gold)
- Background: `#FAFAF8`
- Dark text: `#0F1F16`
- Border: `#D4E8DD`

**Fonts:** Cairo (headings, CTAs) + Tajawal (body) + Inter (numbers/prices)

**Tailwind config:** Add custom colors in `tailwind.config.ts`

**Images:** Use placeholder components with brand colors until real images provided. Every image slot must have correct dimensions and alt text in Arabic.

**Animations:** Subtle only — no parallax, no heavy effects. Modals: scale + fade. Sections: fade-in-up on scroll (once). Hover: translateY(-2px).

---

## CODE QUALITY

- TypeScript strict mode — no `any`
- Server Components by default, `'use client'` only when needed
- No inline styles — Tailwind only
- All images: next/image with explicit dimensions
- SEO: metadata + OG tags on every page
- Structured data (JSON-LD) on product pages
- CORS: backend only accepts relaxia.store
- Error boundaries on cart and checkout components
- Loading states on all async operations

---

## FOLDER OUTPUT

Deliver:
```
relaxia-store/
├── frontend/            (complete Next.js app, ready to docker build)
├── backend/             (complete FastAPI app, ready to docker build)
├── sheets/
│   ├── google-apps-script-webhook.js
│   └── orders-template.csv
├── docker-compose.yml   (local dev)
└── README.md            (how to run locally + deploy)
```

Both frontend and backend must:
- Have a `Dockerfile`
- Have `.env.example` with all required variables
- Be ready to push to GitHub and deploy on EasyPanel

---

## PRIORITY ORDER

Build in this order:

1. **Setup**: project structure, Docker, env, Tailwind config, fonts, RTL
2. **Backend**: models, migrations, order creation endpoint, health check
3. **Product data**: `lib/products.ts` with all 3 products, pricing, copy
4. **Core components**: Header, Footer, Button, TrustBadges, OfferSelector, PriceDisplay
5. **Cart system**: CartDrawer, CartItem, Zustand store, AddToCart flow
6. **Checkout flow**: CheckoutModal, CheckoutForm, UpsellPopup, form validation
7. **Product pages**: all 3 products with all sections
8. **Homepage**: all sections
9. **Collection page**
10. **Thank-you page**: with call prep, order summary, timeline, cross-sells
11. **Tracking pixels**: web + CAPI
12. **Google Sheets**: backend service + Apps Script
13. **Admin dashboard**: login, metrics, orders
14. **Policy pages, About, Contact**
15. **SEO**: metadata, structured data, OG tags
16. **Performance**: image optimization, font optimization, pixel deferral

---

## IMPORTANT NOTES

- This is COD only — NO payment gateway integration
- No WhatsApp integration, no SMS, no email newsletter
- No quiz, no size guide, no subscription
- No Shopify or any other platform — pure custom Next.js + FastAPI
- All website copy must be in Moroccan Darija (not Fusha)
- The store sells 3 products: COLOFLORA, PYLOREX, FLEXIMA — all at the same price points
- The products are described fully in docs/05-products.md — use that copy verbatim
- The domain is relaxia.store — already registered

---

## SAMPLE ENV VALUES TO ADD IN EASYPANEL (after build)

**Frontend:**
```
NEXT_PUBLIC_API_URL=https://api.relaxia.store
NEXT_PUBLIC_SITE_URL=https://relaxia.store
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your_fb_pixel_id
NEXT_PUBLIC_TIKTOK_PIXEL_ID=your_tt_pixel_id
NEXT_PUBLIC_SNAPCHAT_PIXEL_ID=your_snap_pixel_id
```

**Backend:**
```
DATABASE_URL=postgresql://relaxia:PASSWORD@relaxia-postgres:5432/relaxia_store
SECRET_KEY=64-char-random-string
ADMIN_USERNAME=relaxia_admin
ADMIN_PASSWORD_HASH=bcrypt-hash-of-your-password
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_ID/exec
FACEBOOK_ACCESS_TOKEN=
FACEBOOK_PIXEL_ID=
TIKTOK_ACCESS_TOKEN=
TIKTOK_PIXEL_ID=
SNAPCHAT_ACCESS_TOKEN=
SNAPCHAT_PIXEL_ID=
CORS_ORIGINS=https://relaxia.store,https://www.relaxia.store
```

---

Start with `docs/03-architecture.md` to understand the full stack, then read all other docs, then begin building. Do not skip any doc. The copy in `docs/02-icp-messaging.md` and `docs/05-products.md` must be used as-is for all Arabic text on the website — do not invent new copy.
