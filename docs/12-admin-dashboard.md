# Admin Dashboard

## Overview

Protected admin interface at `/admin` — separate from the store.  
Login with username + password → JWT stored in localStorage → API calls with Bearer token.

**No customer-facing access:** Admin routes completely separate from store layout.  
**URL:** `relaxia.store/admin` (or `admin.relaxia.store` if subdomain preferred)

---

## Authentication

### Login Page (`/admin/login`)

```tsx
// Simple, clean login form
<div className="min-h-screen flex items-center justify-center bg-gray-50">
  <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
    <div className="text-center mb-6">
      <h1 className="text-2xl font-bold text-brand-700">RELAXIA Admin</h1>
      <p className="text-sm text-muted">لوحة التحكم</p>
    </div>
    
    <form>
      <input type="text" placeholder="اسم المستخدم" />
      <input type="password" placeholder="كلمة المرور" />
      <Button fullWidth>دخول</Button>
    </form>
  </div>
</div>
```

**Auth flow:**
```typescript
// POST /api/admin/login → { access_token, token_type }
// Store in localStorage: 'relaxia_admin_token'
// All admin API calls: Authorization: Bearer {token}
// Token expiry: 24 hours
// On 401: redirect to /admin/login
```

**Backend env variables for admin:**
```env
ADMIN_USERNAME=relaxia_admin
ADMIN_PASSWORD_HASH=$2b$12$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# Generate hash with: python -c "from passlib.context import CryptContext; ctx = CryptContext(schemes=['bcrypt']); print(ctx.hash('your_password_here'))"
```

---

## Dashboard Layout

### Admin Header
```
[≡ Menu] [RELAXIA Admin] [لوحة التحكم] [خروج]
```

### Sidebar Navigation
```
📊 الإحصائيات (Dashboard)
📦 الطلبيات (Orders)
────────
⚙️ الإعدادات (Settings)
🚪 خروج (Logout)
```

---

## Page 1: Dashboard/Metrics (`/admin`)

### Date Range Selector
```
[اليوم] [أمس] [آخر 7 أيام] [آخر 30 يوم] [تاريخ مخصص: من___ إلى___]
```
Default: Last 30 days

### Key Metrics Cards (Row 1)

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   إجمالي الطلبيات │  │  رقم الأعمال   │  │  متوسط الطلبية │  │  معدل التحويل   │
│      247         │  │  84,230 MAD     │  │    341 MAD      │  │    3.2%         │
│  +12% vs prev   │  │  +8% vs prev    │  │  +5% vs prev   │  │  -0.3% vs prev  │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Key Metrics Cards (Row 2)

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  طلبيات مؤكدة   │  │  طلبيات مشحونة  │  │  طلبيات ملغاة   │
│      189 (76%)   │  │      145 (59%)   │  │      21 (8.5%)   │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

### Charts

**Orders Over Time (Line Chart)**
```
X-axis: dates in selected period
Y-axis: number of orders
Color: brand-700 green
Show: daily orders, 7-day moving average
```

**Revenue Over Time (Bar Chart)**
```
Same period, daily revenue in MAD
Color: gold accent
```

**Orders by Status (Donut Chart)**
```
Segments: confirmed, shipping, delivered, cancelled, returned
Colors: success=green, shipping=blue, delivered=brand, cancelled=red, returned=orange
```

**Top Products (Horizontal Bar)**
```
COLOFLORA: ████████████████ 142 orders
PYLOREX:   ████████████     98 orders
FLEXIMA:   ████████         87 orders
```

**Orders by City (Bar Chart)**
```
Top 10 cities — shows where customers are
Casablanca, Rabat, Marrakech...
```

---

## Page 2: Orders (`/admin/orders`)

### Filters & Search Bar
```
[🔍 بحث: اسم / هاتف / رقم الطلبية]  [Status filter ▼]  [Date range ▼]  [Export CSV 📥]
```

### Orders Table

```
| # | رقم الطلبية | التاريخ | الاسم | الهاتف | المدينة | المنتجات | الإجمالي | الحالة | إجراءات |
|---|------------|---------|-------|--------|---------|---------|---------|--------|---------|
| 1 | RLX-2026... | 19/05 | محمد أ | 0612... | الدار البيضاء | كولوفلورا ×2 | 345 MAD | مؤكد ✅ | 👁 |
| 2 | RLX-2026... | 19/05 | فاطمة م | 0661... | مراكش | بيلوريكس ×1 | 229 MAD | جديد 🆕 | 👁 |
```

**Status badges:**
- جديد: gray badge
- قيد التأكيد: yellow badge  
- مؤكد: green badge
- شحن: blue badge
- تم التسليم: dark green badge
- ملغى: red badge
- مرتجع: orange badge

**Pagination:** 20 per page, show total count

**Export CSV:** Downloads all filtered orders as CSV matching sheet format

---

## Page 3: Order Detail (`/admin/orders/[id]`)

### Order Preview Modal/Page

```
┌──────────────────────────────────────────────────────────────┐
│ طلبية #RLX-20260519-K7M2           [تغيير الحالة ▼]        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ معلومات العميل:                                              │
│  الاسم: محمد الأمين                                          │
│  الهاتف: 0612345678   [📞 اتصال]                            │
│  المدينة: الدار البيضاء                                      │
│  الدولة: المغرب                                              │
│                                                              │
│ تفاصيل الطلبية:                                              │
│  التاريخ: 19/05/2026 الساعة 14:32                           │
│  ┌─────────────────────────────────────────┐                │
│  │ المنتج          | الكمية | السعر        │                │
│  │ كولوفلورا ×2   | 1      | 345 MAD      │                │
│  │ بيلوريكس ×1   | 1      | 229 MAD      │                │
│  ├─────────────────────────────────────────┤                │
│  │ الإجمالي:               574 MAD        │                │
│  │ التوصيل:               مجاني           │                │
│  │ طريقة الدفع:           عند الاستلام    │                │
│  └─────────────────────────────────────────┘                │
│                                                              │
│ معلومات التتبع:                                              │
│  المصدر: facebook / campaign: ramadan-promo                  │
│  fbclid: xxxx  |  IP: 105.xxx.xxx.xxx                       │
│                                                              │
│ حالة مزامنة الشيت: ✅ تمت المزامنة 19/05/2026 14:35         │
│                                                              │
│ [ملاحظات داخلية] ________________                            │
└──────────────────────────────────────────────────────────────┘
```

### Status Change
```typescript
// Dropdown in order detail
const statuses = [
  { value: 'confirmed', label: 'مؤكد' },
  { value: 'processing', label: 'قيد التجهيز' },
  { value: 'shipped', label: 'تم الشحن' },
  { value: 'delivered', label: 'تم التسليم' },
  { value: 'cancelled', label: 'ملغى' },
  { value: 'returned', label: 'مرتجع' },
]

// PATCH /api/admin/orders/{order_id}/status
// { status: 'shipped' }
```

---

## Backend Metrics API

### GET /api/admin/metrics

**Response:**
```json
{
  "period": {
    "start": "2026-04-19T00:00:00",
    "end": "2026-05-19T23:59:59"
  },
  "total_orders": 247,
  "total_revenue": 84230.00,
  "avg_order_value": 341.00,
  "conversion_rate": 3.2,
  "page_views": 7719,
  "orders_by_status": {
    "confirmed": 189,
    "shipped": 145,
    "delivered": 120,
    "cancelled": 21,
    "returned": 8,
    "pending_upsell": 5
  },
  "previous_period": {
    "total_orders": 220,
    "total_revenue": 77980.00
  }
}
```

### GET /api/admin/metrics/chart

**Response:**
```json
{
  "daily": [
    { "date": "2026-05-01", "orders": 8, "revenue": 2750 },
    { "date": "2026-05-02", "orders": 12, "revenue": 4100 },
    ...
  ],
  "by_product": [
    { "product_id": "coloflora", "product_name": "كولوفلورا", "orders": 142, "revenue": 45678 },
    { "product_id": "pylorex", "product_name": "بيلوريكس", "orders": 98, "revenue": 32450 },
    { "product_id": "flexima", "product_name": "فليكسيما", "orders": 87, "revenue": 29000 }
  ],
  "by_city": [
    { "city": "الدار البيضاء", "orders": 72 },
    { "city": "الرباط", "orders": 48 },
    ...
  ]
}
```

---

## Environment Variables for Admin

```env
# Backend
ADMIN_USERNAME=relaxia_admin
ADMIN_PASSWORD_HASH=$2b$12$...  # bcrypt hash of your password

# JWT
SECRET_KEY=generate-a-random-64-char-string-here
JWT_ALGORITHM=HS256
JWT_EXPIRY_HOURS=24
```

### Generate Password Hash
```bash
python3 -c "
from passlib.context import CryptContext
ctx = CryptContext(schemes=['bcrypt'])
print(ctx.hash('your_secure_password_here'))
"
```

---

## DB Migration for Admin

No additional tables needed — admin uses existing orders and tracking_events tables.

Run initial migration which creates all tables:
```bash
alembic upgrade head
```

---

## Admin Security Notes

1. Admin routes (`/admin/*`) are only accessible via JWT
2. JWT is stateless — logout by deleting from localStorage
3. No need for session storage on backend (stateless auth)
4. Admin API rate-limited to 100 req/min
5. CORS still applies — admin can only be called from relaxia.store domain
6. Consider adding IP whitelist in production (EasyPanel nginx)

---

## Chart Library Recommendation

Use **Recharts** (already React-compatible, no extra setup):
```
npm install recharts
```

For the admin dashboard:
- `LineChart` — orders over time
- `BarChart` — revenue, by city, by product
- `PieChart` / `RadialBarChart` — orders by status
- All charts are responsive with `ResponsiveContainer`
