# Pages Structure & Content

## Site Map

```
relaxia.store/
├── /                           # Homepage
├── /products/                  # Collections page
├── /products/coloflora         # COLOFLORA product page
├── /products/pylorex           # PYLOREX product page
├── /products/flexima           # FLEXIMA product page
├── /about                      # About us
├── /contact                    # Contact
├── /thank-you                  # Order confirmation (dynamic)
├── /policies/
│   ├── /policies/privacy       # Privacy policy
│   ├── /policies/refund        # Refund & return policy
│   └── /policies/terms         # Terms & conditions
└── /admin/                     # Admin dashboard (separate, protected)
    ├── /admin/login
    ├── /admin/                  # Metrics dashboard
    └── /admin/orders            # Orders management
```

---

## Page 1: Homepage (`/`)

### Metadata
```typescript
export const metadata = {
  title: 'ريلاكسيا | المتجر الطبيعي رقم 1 للصحة الهضمية والمفاصل في المغرب',
  description: 'اكتشف كولوفلورا، بيلوريكس وفليكسيما — منتجات طبيعية مثبتة علميًا لدعم القولون، مكافحة جرثومة المعدة، وتخفيف آلام المفاصل. الدفع عند الاستلام. ضمان 30 يوم.',
  openGraph: { /* Arabic og tags */ }
}
```

### Section Structure (in order)

#### 1. Hero Section
```
Layout: Full-width, min-height 85vh
Background: brand-700 gradient (dark green) OR hero image

Content:
  [Trust pill: "✅ أكثر من 10,000 مغربي وثقوا فينا"]
  [H1: ريلاكسيا — الصحة الطبيعية بقوة العلم]
  [Subhead: مكملات طبيعية مثبتة علميًا، مصممة لجسمك، بضمان 30 يوم]
  [CTA: اكتشف منتجاتنا ←]
  [Secondary CTA: تعرف علينا]
  [Hero image: products styled photo or 3-product flat lay]

Mobile: stacked, text above image
Desktop: text left (RTL: right), image right (RTL: left)
```

#### 2. Trust Bar (Sticky strip below hero)
```
Layout: Horizontal strip, bg-brand-700, text white
Items (4, equal width):
  [🚚 الدفع عند الاستلام]
  [🏅 ضمان 30 يوم]  
  [🌿 طبيعي 100%]
  [📦 توصيل 2-4 أيام]

Mobile: horizontal scroll, 4 chips
Desktop: 4 columns equal
```

#### 3. Products Grid Section
```
Heading: [منتجاتنا — حلول طبيعية حقيقية]
Subheading: [3 منتجات، 3 مشاكل — حل واحد: ريلاكسيا]

Grid: 3 product cards (1 col mobile, 3 col desktop)

Each Product Card:
  [Product Image — square, branded]
  [Category Badge: "دعم الهضم" | "المفاصل"]
  [Product Name Arabic — Cairo Bold]
  [Tagline — 1 line]
  [Stars: ⭐⭐⭐⭐⭐ (x reviews)]
  [Price from: 229 درهم]
  [CTA: اكتشف المنتج ←]

Card hover: subtle lift + shadow
```

#### 4. Why RELAXIA Section
```
Heading: [علاش ريلاكسيا وماشي أي منتج آخر؟]

Grid: 2×3 (6 differentiators) on desktop, 2 col mobile

Each differentiator card:
  [Icon: large, brand-green]
  [Title: bold]
  [Description: 2 lines]

Content:
  🔬 مكونات مثبتة علميًا | نسب دقيقة في كل فورمولا
  🏅 ضمان ذهبي 30 يوم | نرجعوا ليك فلوسك بلا أسئلة
  💰 الدفع عند الاستلام | ما خسرتيش شي
  🇲🇦 مصنوع للمغربي | فهمنا ما تمر منو
  🌿 طبيعي 100% | بدون مواد حافظة ضارة
  🚚 توصيل سريع | 2-4 أيام في جميع المدن
```

#### 5. How It Works Section
```
Heading: [كيفاش تعمل ريلاكسيا؟]
Layout: 3 steps horizontal (desktop), vertical (mobile)

Step 1: [🛒 اختار منتجك]
  "اختار المنتج المناسب لمشكلتك واختار العرض اللي يناسبك"

Step 2: [📦 استلم في بيتك]
  "كنوصلوا ليك خلال 2-4 أيام — والدفع عند الاستلام"

Step 3: [✨ شوف الفرق]
  "ابدأ تحس بالفرق من الأسبوع الأول — أو نردوا ليك فلوسك"

Connector arrows between steps (RTL-aware)
```

#### 6. Testimonials Section
```
Heading: [آراء عملاؤنا — أصدق من أي كلام]
Subheading: [+1,000 مراجعة حقيقية من مغاربة حقيقيين]

Layout: 3-column card grid desktop, 1-column mobile
Show 6 testimonials total (2 per product)

Overall rating: ⭐⭐⭐⭐⭐ 4.8/5 — displayed prominently above grid
```

#### 7. Instagram/UGC Strip (placeholder)
```
Heading: [عيلة ريلاكسيا على السوشيال ميديا]
Layout: 6 square image tiles (placeholder for UGC)
CTA: [شارك تجربتك #ريلاكسيا]
```

#### 8. Final CTA Section
```
Background: brand-700 (dark green)
Text: white

[H2: جاهز تبدل حياتك؟ الآن هو الوقت الصح.]
[Subtext: الدفع عند الاستلام. ضمان 30 يوم. توصيل مجاني.]
[CTA button (gold): اكتشف منتجاتنا الآن ←]
[Trust line: +10,000 مغربي وثقوا فينا]
```

---

## Page 2: Collections Page (`/products`)

### Metadata
```typescript
title: 'منتجات ريلاكسيا | كولوفلورا | بيلوريكس | فليكسيما',
description: 'اكتشف مجموعة ريلاكسيا الكاملة من المكملات الطبيعية...'
```

### Section Structure

#### 1. Page Header
```
[ريلاكسيا — منتجاتنا الطبيعية]
[3 منتجات. مشاكل حقيقية. حلول طبيعية مثبتة.]
```

#### 2. Trust Bar (same as homepage)

#### 3. Products Grid
```
Layout: 3 columns desktop, 1 column mobile (full-width cards)
Each card is larger/more detailed than homepage card

Enhanced Product Card:
  [Product Image — 1:1 ratio, branded]
  [Category Badge]
  [Product Name]
  [Tagline]
  [Stars + review count]
  [Short benefit list: 3 bullet points]
  [Price display: original crossed + current]
  [Offer selector mini: 1/2/3 qty chips]
  [CTA: أضف للسلة — الدفع عند الاستلام]
  
Mobile: each card is full-width, vertical scroll
```

#### 4. Comparison Table
```
Heading: [أيّ منتج يناسبك؟]

Table:
  | | كولوفلورا | بيلوريكس | فليكسيما |
  |---|---|---|---|
  | القولون العصبي | ✅ مثالي | ✅ يساعد | — |
  | النفخة والغازات | ✅ مثالي | ✅ | — |
  | جرثومة المعدة | ✅ يساعد | ✅ مثالي | — |
  | حرقة المعدة | ✅ | ✅ مثالي | — |
  | آلام المفاصل | — | — | ✅ مثالي |
  | آلام العضلات | — | — | ✅ |
  
Each ✅ = clickable → goes to that product page
```

---

## Page 3: Product Pages (`/products/[slug]`)

See [docs/05-products.md] for complete product-specific copy.

### Standard Product Page Structure (all 3 products)

```
1. [StickyAddToCart — mobile, appears after scrolling past product card]
2. [ProductCard — hero: images + offer selector + CTA]
3. [TrustBar — COD | guarantee | shipping | natural]
4. [ProblemSection — agitate the pain]
5. [SolutionSection — this product fixes it]
6. [IngredientsSection — each ingredient with details]
7. [HowToUseSection — 3 easy steps]
8. [ResultsSection — expected timeline]
9. [TestimonialsSection — 6 reviews with stars]
10. [GuaranteeSection — 30-day gold guarantee]
11. [FAQSection — 5-7 Q&A]
12. [CrossSellSection — 2 other products]
13. [FinalCTA — repeat offer selector + CTA]
```

### Product Page Metadata (example for COLOFLORA)
```typescript
{
  title: 'كولوفلورا | مكمل دعم القولون والجهاز الهضمي — ريلاكسيا',
  description: 'كولوفلورا — فورمولا طبيعية متكاملة لدعم القولون: بروبيوتيك، ألياف الأكاسيا، وصبار الألوفيرا. الدفع عند الاستلام. ضمان 30 يوم. توصيل سريع في المغرب.',
}
```

### Structured Data (JSON-LD for SEO)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "كولوفلورا — مكمل دعم القولون",
  "brand": { "@type": "Brand", "name": "RELAXIA" },
  "offers": {
    "@type": "Offer",
    "price": "229",
    "priceCurrency": "MAD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "1287"
  }
}
```

---

## Page 4: About Us (`/about`)

### Section Structure

#### 1. Hero
```
[ريلاكسيا — من نحن]
[Background: soft green gradient]
[Tagline: "الصحة الطبيعية — بقوة العلم"]
```

#### 2. Brand Story
```
Heading: [ريلاكسيا ما بدات كتجارة — بدات كحل]

[Full brand story in Darija — see docs/01-brand-identity.md]

Layout: text with lifestyle brand image alongside
```

#### 3. Our Values (4 pillars)
```
[🔬 العلم أولًا] — كل مكوّن مثبت بدراسات
[🌿 الطبيعة] — بدون مواد كيماوية قاسية
[🤝 الثقة] — ضمان 30 يوم وشفافية كاملة
[🇲🇦 المغرب] — صنعنا لجسم المغربي وحياته
```

#### 4. Team / Authority (keep vague if no real team photos)
```
"طورنا ريلاكسيا بمعاونة خبراء في التغذية، الصيدلة، والصحة الطبيعية"
[3 icon cards: Nutritionist | Pharmacist | Natural Medicine Expert]
```

#### 5. Numbers
```
[+10,000 عميل راضي]   [4.8/5 تقييم وسطي]   [3 منتجات متخصصة]   [30 يوم ضمان]
```

#### 6. CTA
```
[اكتشف منتجاتنا الآن ←]
```

---

## Page 5: Contact (`/contact`)

### Section Structure

#### 1. Header
```
[تواصل معنا]
[نحن هنا لمساعدتك — فريقنا المغربي جاهز للرد]
```

#### 2. Contact Info
```
📧 Email: support@relaxia.store
📱 (Optional: WhatsApp button — if added later)
⏰ ساعات العمل: الاثنين–السبت، 9ص–6م
📦 لتتبع طلبك: أدخل رقم طلبك أدناه
```

#### 3. Contact Form
```
Fields:
  - الاسم الكامل (text)
  - البريد الإلكتروني أو رقم الهاتف (text)
  - رقم الطلب (optional)
  - الموضوع (select: سؤال | مشكلة في الطلب | الضمان | أخرى)
  - الرسالة (textarea)
  - [أرسل رسالتك]

Submission: sends to backend → stores in DB (or emails)
```

#### 4. FAQ Quick Links
```
الأسئلة الشائعة:
→ كيفاش أتتبع طلبيتي؟
→ كيفاش أستخدم الضمان؟
→ المنتج وصل مكسور — شنو نديرو؟
→ طلبيتي تأخرت
```

---

## Page 6: Thank You (`/thank-you`)

Dynamic page — receives order data via query params or stored in session.

### Section Structure

#### 1. Confirmation Header
```
[Large animated ✅ checkmark — green, brand color]
[شكرًا {customerName}! طلبك وصلنا بنجاح 🎉]
[Order ID: #RLX-20260519-1234]
```

#### 2. Call Confirmation Banner (CRITICAL for COD)
```
[📞 سنتصل بك قريبًا لتأكيد طلبك]

"سيتصل بك فريقنا على رقم {phone} خلال أقل من 10 دقائق لتأكيد طلبك وعنوانك"

If order placed 9am-9pm:
  "⏰ ساعات التواصل: من 9 صباحًا إلى 9 مساءً"
  
If order placed outside hours:
  "📅 طلبك وصلنا! سنتصل بك بكرا الصباح حال فتح ساعات العمل (9 صباحًا)"

Background: gold/amber — stands out, important
CTA style: not dismissible
```

#### 3. Order Summary Card
```
[طلبيتك #RLX-20260519-1234]
[التاريخ: 19/05/2026]

Items list:
  [Image] [Name] [Qty] [Price]
  
[المجموع: XXX درهم]
[التوصيل: مجاني 🚚]
[طريقة الدفع: عند الاستلام 💰]
[المدينة: {city}]
```

#### 4. Build Excitement / Results Preview
```
[Heading: اش كيصراك دابا؟]
[Timeline of what to expect:]

📦 خلال 2-4 أيام: طلبيتك توصلك
📞 خلال 10 دقائق: منتصلوا بيك لتأكيد
🌿 من الأسبوع الأول: تبدا تحس الفرق
✨ بعد شهر: نتائج حقيقية وملموسة
```

#### 5. Confirmation Encouragement
```
[Heading: نصيحة من تجربة عملاؤنا:]

"خلي تليفونك قريب — سنتصل بك خلال دقائق!"
"تأكد أن رقمك {phone} صحيح وشغال"
"إلا فاتك الاتصال، سنعاود الكرة"

[Testimonial strip — 3 quick reviews about delivery experience]
```

#### 6. Product Suggestions (Cross-sell)
```
[Heading: يمكنك كذلك تجربة:]
[2-3 product cards — products they didn't buy]
[Full price, normal CTA]
```

#### 7. Footer (minimal)
```
[© RELAXIA 2026 | relaxia.store]
[Trust badges strip]
```

---

## Policy Pages

### Privacy Policy (`/policies/privacy`)
Standard e-commerce privacy policy in Arabic covering:
- Data collected (name, phone, city)
- How used (order processing, delivery)
- Third parties (delivery company, Google Sheets)
- Cookies and tracking pixels
- Contact for data requests

### Refund Policy (`/policies/refund`)
```
ضماننا الذهبي — 30 يوم كاملين

إلا ما كنتيش راضي على المنتج في 30 يوم من تاريخ الاستلام:
1. تواصل معنا على support@relaxia.store
2. أخبرنا برقم طلبك والسبب
3. ترجع لينا المنتج غير المستخدم
4. نردو ليك فلوسك كاملين خلال 5-7 أيام عمل

ملاحظة: المنتجات المستخدمة بالكامل ما يمكن استرجاعها
```

### Terms & Conditions (`/policies/terms`)
Standard e-commerce terms covering:
- Ordering process (COD)
- Delivery terms (2-4 business days)
- Order cancellation (before shipping)
- Product use disclaimer (dietary supplement, not medicine)
- Governing law (Moroccan law)

---

## Header Navigation

```
Desktop (RTL):
[🌿R RELAXIA]    [الرئيسية] [منتجاتنا] [من نحن] [تواصل]    [🛒 (count)]

Mobile:
[🌿R RELAXIA]    [🛒]  [☰ menu]

Mobile Menu (slide-in from right, full height):
  [الرئيسية]
  [منتجاتنا]
    → كولوفلورا
    → بيلوريكس
    → فليكسيما
  [من نحن]
  [تواصل معنا]
  [──────]
  [Trust badges strip]
```

---

## Footer Structure

```
[LOGO + RELAXIA]
[الصحة الطبيعية — بقوة العلم]
[Brand description: 2 lines]

Column 1: منتجاتنا
  - كولوفلورا
  - بيلوريكس  
  - فليكسيما

Column 2: روابط سريعة
  - الرئيسية
  - من نحن
  - تواصل معنا
  - المنتجات

Column 3: الدعم
  - سياسة الاسترداد
  - سياسة الخصوصية
  - الشروط والأحكام

[Trust badges full-width strip]
🚚 الدفع عند الاستلام | 🏅 ضمان 30 يوم | 🌿 طبيعي 100% | 🇲🇦 فريق مغربي

[© 2026 RELAXIA. جميع الحقوق محفوظة — relaxia.store]
```

---

## SEO & Metadata Strategy

### Homepage
```
Title: ريلاكسيا | المتجر الطبيعي رقم 1 للصحة الهضمية والمفاصل في المغرب
Description: اكتشف منتجات ريلاكسيا الطبيعية المثبتة علميًا — دعم القولون، مكافحة جرثومة المعدة، وتخفيف آلام المفاصل. الدفع عند الاستلام. ضمان 30 يوم.
```

### Product Pages — Target keywords
- كولوفلورا: "علاج القولون العصبي طبيعي", "بروبيوتيك للقولون", "كبسولات دعم الهضم"
- بيلوريكس: "علاج جرثومة المعدة طبيعي", "مكمل ضد H pylori"
- فليكسيما: "كريم آلام المفاصل", "كريم الركبة", "علاج المفاصل طبيعي"

### Arabic OG Tags
```html
<meta property="og:locale" content="ar_MA" />
<meta property="og:site_name" content="ريلاكسيا" />
<meta property="og:type" content="website" />
```
