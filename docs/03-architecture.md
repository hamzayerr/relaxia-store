# Technical Architecture

## Stack Overview

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 15.x (App Router) | React framework, SSR, routing |
| React | 19.x | UI components |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling (RTL configured) |
| Zustand | 5.x | Client state (cart, UI) |
| React Hook Form | 7.x | Form handling |
| Zod | 3.x | Schema validation |
| Framer Motion | 11.x | Animations |
| next-intl | 3.x | i18n (Arabic RTL) |
| Lucide React | latest | Icons |
| Cairo + Tajawal | Google Fonts | Arabic typography |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.12 | Runtime |
| FastAPI | 0.115.x | API framework |
| SQLAlchemy | 2.x | ORM |
| Alembic | 1.x | DB migrations |
| PostgreSQL | 16.x | Database |
| Pydantic | 2.x | Data validation |
| httpx | 0.27.x | Async HTTP (for CAPI calls) |
| python-jose | 3.x | JWT (admin auth) |
| passlib | 1.x | Password hashing |
| uvicorn | 0.30.x | ASGI server |

### Infrastructure
| Service | Purpose |
|---------|---------|
| EasyPanel | Hosting + deployment |
| PostgreSQL (EasyPanel) | Database |
| Docker | Containerization |
| GitHub | Version control |
| Google Sheets | Order storage via webhook |

---

## Repository Structure

```
relaxia-store/
├── frontend/                          # Next.js App
│   ├── app/
│   │   ├── (store)/                   # Main store layout group
│   │   │   ├── layout.tsx             # Store layout (header, footer)
│   │   │   ├── page.tsx               # Homepage
│   │   │   ├── products/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx       # Product page
│   │   │   ├── collections/
│   │   │   │   └── page.tsx           # Collection/shop page
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   ├── thank-you/
│   │   │   │   └── page.tsx
│   │   │   └── policies/
│   │   │       ├── privacy/page.tsx
│   │   │       ├── refund/page.tsx
│   │   │       └── terms/page.tsx
│   │   ├── admin/                     # Admin dashboard (separate layout)
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── page.tsx               # Dashboard home
│   │   │   ├── orders/page.tsx
│   │   │   └── orders/[id]/page.tsx
│   │   ├── api/                       # Next.js API routes (for CAPI server-side)
│   │   │   └── track/
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx                 # Root layout
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── AdminHeader.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── TrustBar.tsx
│   │   │   ├── ProductsGrid.tsx
│   │   │   ├── WhyRelaxia.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── IngredientsHighlight.tsx
│   │   │   └── FinalCTA.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx        # Hero product card with offers
│   │   │   ├── ProblemSection.tsx
│   │   │   ├── SolutionSection.tsx
│   │   │   ├── IngredientsSection.tsx
│   │   │   ├── HowToUseSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── GuaranteeSection.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   ├── CrossSellSection.tsx
│   │   │   └── StickyAddToCart.tsx
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartUpsell.tsx
│   │   │   └── CartSummary.tsx
│   │   ├── checkout/
│   │   │   ├── CheckoutModal.tsx
│   │   │   ├── CheckoutForm.tsx
│   │   │   └── UpsellPopup.tsx
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── StarRating.tsx
│   │   │   ├── CountdownTimer.tsx
│   │   │   ├── TrustBadges.tsx
│   │   │   ├── ScarcityBanner.tsx
│   │   │   └── ImageWithFallback.tsx
│   │   └── admin/
│   │       ├── MetricsCard.tsx
│   │       ├── OrdersTable.tsx
│   │       ├── OrderPreview.tsx
│   │       └── DateRangePicker.tsx
│   ├── lib/
│   │   ├── store/
│   │   │   ├── cartStore.ts           # Zustand cart state
│   │   │   └── uiStore.ts             # Drawer/modal open state
│   │   ├── hooks/
│   │   │   ├── useCart.ts
│   │   │   └── usePixels.ts
│   │   ├── utils/
│   │   │   ├── formatPrice.ts
│   │   │   ├── generateOrderId.ts
│   │   │   └── phoneValidation.ts
│   │   ├── api.ts                     # API client (fetch wrapper)
│   │   ├── pixels.ts                  # Pixel event helpers
│   │   └── products.ts                # Product data/config
│   ├── public/
│   │   ├── images/
│   │   │   ├── products/
│   │   │   │   ├── coloflora/
│   │   │   │   ├── pylorex/
│   │   │   │   └── flexima/
│   │   │   ├── icons/
│   │   │   └── brand/
│   │   ├── favicon.ico
│   │   └── favicon/                   # All favicon sizes
│   ├── styles/
│   │   └── globals.css
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   ├── Dockerfile
│   ├── .env.example
│   └── .dockerignore
│
├── backend/                           # FastAPI App
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # FastAPI app entry
│   │   ├── config.py                  # Settings from env
│   │   ├── database.py                # DB connection
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── order.py
│   │   │   └── tracking.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── order.py
│   │   │   └── tracking.py
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── orders.py
│   │   │   ├── tracking.py
│   │   │   └── admin.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── sheets.py              # Google Sheets webhook
│   │   │   ├── capi.py                # Facebook/TikTok/Snap CAPI
│   │   │   └── admin_auth.py
│   │   └── migrations/
│   │       └── versions/
│   ├── alembic.ini
│   ├── alembic/
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   └── .dockerignore
│
├── sheets/
│   ├── google-apps-script-webhook.js  # Apps Script code
│   └── orders-template.csv            # Sheet template
│
└── docker-compose.yml                 # Local dev compose
```

---

## Frontend Architecture Details

### App Router Layout

```
Root Layout (app/layout.tsx)
└── fonts, RTL dir, global providers
    ├── Store Layout (app/(store)/layout.tsx)
    │   └── Header + Footer wrapping all store pages
    └── Admin Layout (app/admin/layout.tsx)
        └── Admin header + sidebar
```

### State Management (Zustand)

**cartStore.ts:**
```typescript
interface CartState {
  items: CartItem[]           // [{product, quantity, offer}]
  isOpen: boolean             // cart drawer open
  addItem: (product, qty, offer) => void
  removeItem: (productId) => void
  updateQuantity: (productId, qty) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  total: number               // computed
  itemCount: number           // computed
}
```

**uiStore.ts:**
```typescript
interface UIState {
  checkoutModalOpen: boolean
  upsellModalOpen: boolean
  upsellProduct: Product | null
  openCheckout: () => void
  closeCheckout: () => void
  showUpsell: (product) => void
  closeUpsell: () => void
}
```

### Product Data Structure

```typescript
// lib/products.ts — static product config
interface Product {
  id: string                   // 'coloflora' | 'pylorex' | 'flexima'
  slug: string
  sku: string                  // e.g. 'RLX-COL-30'
  nameAr: string
  nameFr: string
  taglineAr: string
  descriptionAr: string
  type: 'capsule' | 'cream'
  images: {
    hero: string               // product card hero
    gallery: string[]          // product page gallery
    ingredients?: string
    lifestyle?: string[]
  }
  ingredients: Ingredient[]
  benefits: string[]
  howToUse: string
  warnings: string
  category: 'digestive' | 'joints'
  crossSells: string[]         // other product ids
}

interface Ingredient {
  nameAr: string
  nameFr: string
  percentage?: string
  amount?: string              // e.g. "150 mg"
  benefit: string
}
```

### Pricing (Consistent across ALL products)

```typescript
// lib/products.ts
export const PRICING = {
  one: { qty: 1, price: 229, label: '1 قطعة', originalPrice: 270 },
  two: { qty: 2, price: 345, label: '2 قطع', pricePerUnit: 172, originalPrice: 540 },
  three: { qty: 3, price: 430, label: '3 قطع', pricePerUnit: 143, originalPrice: 810 },
}
// All prices in MAD (Moroccan Dirham)
// "original price" is crossed-out comparison price for visual discount
```

---

## Backend Architecture Details

### API Endpoints

```
POST   /api/orders              # Create new order
GET    /api/orders              # List orders (admin, paginated)
GET    /api/orders/{id}         # Get single order (admin)
PATCH  /api/orders/{id}/status  # Update order status (admin)

POST   /api/track/event         # Track frontend event (page views, etc.)
POST   /api/track/capi          # Server-side CAPI event forwarding

POST   /api/admin/login         # Admin login → JWT
GET    /api/admin/metrics       # Dashboard metrics
GET    /api/admin/metrics/chart # Chart data (orders over time)

GET    /api/health              # Health check
```

### Database Schema (PostgreSQL)

```sql
-- orders table
CREATE TABLE orders (
  id            SERIAL PRIMARY KEY,
  order_id      VARCHAR(20) UNIQUE NOT NULL,  -- e.g. RLX-20260519-1234
  created_at    TIMESTAMP DEFAULT NOW(),
  customer_name VARCHAR(255) NOT NULL,
  phone         VARCHAR(20) NOT NULL,
  city          VARCHAR(100) NOT NULL,
  country       VARCHAR(50) DEFAULT 'Morocco',
  status        VARCHAR(50) DEFAULT 'pending',
  total_price   DECIMAL(10,2) NOT NULL,
  currency      VARCHAR(10) DEFAULT 'MAD',
  notes         TEXT,
  ip_address    VARCHAR(50),
  user_agent    TEXT,
  source        VARCHAR(100),               -- utm_source
  fbclid        VARCHAR(255),
  ttclid        VARCHAR(255),
  sheet_synced  BOOLEAN DEFAULT FALSE,
  sheet_synced_at TIMESTAMP
);

-- order_items table
CREATE TABLE order_items (
  id            SERIAL PRIMARY KEY,
  order_id      INTEGER REFERENCES orders(id),
  product_id    VARCHAR(50) NOT NULL,        -- 'coloflora', 'pylorex', 'flexima'
  product_name  VARCHAR(255) NOT NULL,
  sku           VARCHAR(50) NOT NULL,
  quantity      INTEGER NOT NULL,
  unit_price    DECIMAL(10,2) NOT NULL,
  offer_type    VARCHAR(20),                 -- 'one', 'two', 'three'
  is_upsell     BOOLEAN DEFAULT FALSE,
);

-- tracking_events table
CREATE TABLE tracking_events (
  id            SERIAL PRIMARY KEY,
  created_at    TIMESTAMP DEFAULT NOW(),
  event_type    VARCHAR(100) NOT NULL,       -- 'PageView', 'AddToCart', 'Purchase'
  order_id      VARCHAR(20),
  product_id    VARCHAR(50),
  value         DECIMAL(10,2),
  currency      VARCHAR(10) DEFAULT 'MAD',
  fbp           VARCHAR(255),               -- Facebook _fbp cookie
  fbc           VARCHAR(255),               -- Facebook _fbc cookie
  ttclid        VARCHAR(255),
  ip_address    VARCHAR(50),
  user_agent    TEXT,
  event_id      VARCHAR(100) UNIQUE,        -- dedup id
);
```

### Migrations

- Run automatically on app startup via `alembic upgrade head`
- All migrations in `alembic/versions/`

---

## Performance Requirements

### Frontend
- Lighthouse score target: 90+ on mobile
- LCP < 2.5s
- CLS < 0.1
- Pixels deferred: load after hydration (useEffect)
- Images: Next.js `<Image>` with WebP + AVIF, explicit width/height
- Fonts: `next/font/google` with `display: swap`
- Bundle: use dynamic imports for heavy components (cart drawer, modals)
- No layout shift on RTL fonts

### Backend
- Response time: < 200ms for order creation
- Order → Google Sheets sync: async background task (don't block response)
- CAPI calls: async, non-blocking, with retry logic
- Health check: < 50ms

---

## Environment Variables

### Frontend (.env.example)
```env
NEXT_PUBLIC_API_URL=https://api.relaxia.store
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAPCHAT_PIXEL_ID=
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_SITE_URL=https://relaxia.store
```

### Backend (.env.example)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/relaxia_store
SECRET_KEY=your-super-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=bcrypt-hashed-password
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
FACEBOOK_ACCESS_TOKEN=
FACEBOOK_PIXEL_ID=
TIKTOK_ACCESS_TOKEN=
TIKTOK_PIXEL_ID=
SNAPCHAT_ACCESS_TOKEN=
SNAPCHAT_PIXEL_ID=
CORS_ORIGINS=https://relaxia.store,https://www.relaxia.store
ALLOWED_HOSTS=relaxia.store,www.relaxia.store,api.relaxia.store
```

---

## Docker Setup

### Frontend Dockerfile
```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### Backend Dockerfile
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### docker-compose.yml (local dev)
```yaml
version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: relaxia_store
      POSTGRES_USER: relaxia
      POSTGRES_PASSWORD: localdevpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file: ./backend/.env
    depends_on:
      - postgres
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    env_file: ./frontend/.env
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## Coding Rules

1. **TypeScript strict mode** — no `any` types
2. **Server Components by default** — only use `'use client'` when needed
3. **RTL first** — all flex layouts must work RTL; test with Arabic text
4. **Mobile first** — build mobile, then add `md:` / `lg:` breakpoints
5. **No inline styles** — use Tailwind classes only
6. **Accessibility** — all images have `alt`, all CTAs have accessible labels
7. **SEO** — every page has metadata, og tags, and structured data
8. **Error boundaries** — wrap complex client components
9. **Loading states** — all async operations have loading UI
10. **Optimistic UI** — cart updates are instant, then synced
11. **No secrets in frontend** — all CAPI calls go through backend
12. **CORS** — backend only accepts requests from relaxia.store domain
