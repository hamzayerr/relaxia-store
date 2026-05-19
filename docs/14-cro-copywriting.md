# CRO, Copywriting & Conversion Optimization

## CRO Philosophy for Morocco COD Market

In Morocco COD market, success depends on 3 numbers:
1. **Confirmation Rate** — % of orders where customer picks up the phone and confirms
2. **Delivery Rate** — % of confirmed orders where customer accepts the package and pays
3. **AOV** — Average Order Value (higher = more MAD per confirmed delivery)

Every design and copy decision must optimize for these 3 metrics.

---

## The Psychology of COD Selling

### Why COD Customers Are Different
- They don't trust online payment → won't buy without COD
- Lower purchase intent than card buyers → need more convincing
- More likely to cancel if surprised at delivery → need to set expectations
- Phone confirmation is a second chance to convert → thank-you page matters

### What Kills Confirmation Rate
1. Customer forgets they ordered (long time to call)
2. Customer doesn't recognize the call number
3. Customer had buyer's remorse — price seemed high after ordering
4. Customer thought it was a scam
5. Customer ordered multiple places, chose another

### What Kills Delivery Rate
1. Customer changed their mind when package arrives
2. Price felt too high at delivery moment
3. Package looks cheap/generic (no branding)
4. Customer couldn't afford it that day
5. Product not what they expected

### How Our Site Combats Each
- **Fast call**: "سنتصل بك خلال 10 دقائق" + thank-you page prep
- **Pre-sell the call**: "انتظر مكالمتنا — ساعدنا نوصلك أسرع"
- **Reinforce value**: thank-you page shows what they're getting
- **Trust proof before purchase**: testimonials, guarantee, ingredients
- **Clear expectations**: show timeline, what happens next

---

## Micro-Copy Rules

### CTAs — Never Use These Alone
❌ "اشتري الآن"
❌ "اضغط هنا"
❌ "طلب"

### CTAs — Always Use These
✅ "أضف للسلة — الدفع عند الاستلام"
✅ "اطلب الآن — مجانًا عند الاستلام"
✅ "تأكيد الطلب — الدفع عند الاستلام ←"
✅ "جرّب 30 يوم — إلا ما عجبكش نردو ليك فلوسك"

**Rule:** Every CTA must contain at least ONE of: price, COD assurance, or guarantee.

### Price Display
```
[~~270 درهم~~]  →  229 درهم
```
- Strikethrough price always in light gray
- Current price in brand-700 bold, large
- Show savings: "وفر 41 درهم"
- Show per-unit in bundles: "172 درهم للقطعة"

### Trust Micro-copy (appears near every CTA)
```
🔒 الدفع عند الاستلام
🏅 ضمان 30 يوم
🚚 توصيل مجاني في المغرب
```

---

## Scarcity & Urgency Tactics

### Stock Scarcity (shows on product page)
```javascript
// Rotate between these messages on page load
const scarcityMessages = [
  "⚠️ الكمية المتبقية: 7 قطع فقط",
  "⚠️ الكمية المتبقية: 5 قطع فقط",
  "⚠️ الكمية المتبقية: 11 قطعة فقط",
  "⚠️ الكمية المتبقية: 9 قطع فقط",
  "⚠️ الكمية المتبقية: 6 قطع فقط",
]
// Select randomly on component mount, display until page refresh
```

### Social Proof Recency
```
"🔥 12 شخص اضافوا هاد المنتج للسلة خلال آخر 24 ساعة"
"✅ آخر طلبية من فاس — منذ 2 ساعة"
```

### Bundle Value Urgency
```
"العرض: 2 قطع بـ345 درهم — بدل 540 درهم
(التوفير: 195 درهم — صالح حتى نفاذ الكمية)"
```

---

## Product Page CRO Checklist

### Above the Fold (visible without scrolling)
- [ ] Product name — clear, Arabic, large font
- [ ] Star rating + review count (builds instant trust)
- [ ] Hero product image (clean, professional)
- [ ] Offer selector (1/2/3 bundles — 2-pack pre-selected)
- [ ] Price with original crossed out
- [ ] CTA button — large, full width, green
- [ ] Trust badges: COD | 30-day guarantee | Free shipping
- [ ] Short tagline (1 line benefit)

### Product Card Hero (Complete Spec)
```tsx
<section id="product-heading">
  {/* Image gallery — left (RTL: right) */}
  <ProductGallery images={product.images.gallery} />
  
  {/* Info — right (RTL: left) */}
  <div>
    <Badge>{product.category}</Badge>
    <h1 className="text-3xl font-extrabold">{product.nameAr}</h1>
    <p className="tagline">{product.taglineAr}</p>
    
    <StarRating rating={4.9} count={1287} />
    
    <OfferSelector options={OFFERS} defaultSelected="two" />
    
    <PriceDisplay current={selectedOffer.price} original={selectedOffer.originalPrice} />
    
    <Button variant="primary" size="xl" fullWidth onClick={addToCart}>
      أضف للسلة — الدفع عند الاستلام
    </Button>
    
    <TrustBadges />
    
    <ScarcityBanner />
    
    {/* Accordion: short ingredient preview + link to section */}
    <details>
      <summary>المكونات الرئيسية</summary>
      <p>بروبيوتيك, ألياف الأكاسيا, صبار الألوفيرا...</p>
    </details>
  </div>
</section>
```

---

## Section-by-Section CRO Notes

### Problem Section CRO
- Open with a question the ICP will answer "YES" to instantly
- "واش كتصحى الصباح وبطنك مستعجل؟" → immediate identification
- 5-7 bullet pains — each one = a separate customer segment saying "هاد أنا"
- End with: "هاد المشكلة عندها حل حقيقي — طبيعي ومثبت"
- Visual: problem illustration (no text-heavy walls)

### Solution Section CRO
- Never start with product name — start with the transformation
- "من الأسبوع الأول تبدأ تحس بالفرق" → specific timeline
- Use a timeline visual: Week 1 → Week 2 → Month 1
- Back with one scientific claim: "البروبيوتيك مثبت في أكثر من 50 دراسة كلينيكية"
- Photo: clean product image, not lifestyle here

### Ingredients Section CRO
- Each ingredient = a trust builder
- Lead with the most impressive/known ingredient
- Format: [Name] → [Amount %] → [Scientific benefit] → [Real-life benefit]
- "39.99% ألياف الأكاسيا — الأرضية الصحية لأمعاء متوازنة"
- Visual: ingredient icons or photos (natural, fresh)
- Quantity specificity = credibility: "مو تخمين — نسب دقيقة موثقة"

### Testimonials Section CRO
- Show 6 minimum — odd numbers feel more organic (5, 7, 9 work)
- Mix genders: 3 women + 3 men (or 4+2 depending on product)
- Mix ages visually (name implies age context)
- Mix cities: Casablanca, Rabat, Fès, Marrakech, Agadir, Tanger
- Include skeptic-who-converted story: "ما كنتش مصدق..."
- Include specific result: "بعد 15 يوم..."
- Include repeat buyer: "رجعت طلبت مرة ثانية"
- Rating: always 5 stars (or 4-5 — avoid perfect 5.0)

### Guarantee Section CRO
- The guarantee is a sales tool, not a footnote
- Give it a full section with gold visual
- Specify the exact terms: "30 يوم — من تاريخ الاستلام — كاملين — بلا أسئلة"
- What happens exactly: "تواصل معنا → نوفروا لك طريقة الإرجاع → نردو ليك فلوسك"
- Reframe: "Guarantee = confidence that our product works"
- "نكثر منتوجنا باش نضمنو ليك — كاينة ما كاينة"

### FAQ Section CRO
- Answer the hidden objections, not obvious questions
- Order by most conversion-blocking objection first:
  1. "متى أرى نتيجة?" → fastest answer possible
  2. "واش يصلح لحالتي؟" → yes + how
  3. "واش فيه آثار جانبية؟" → no, then explain why
  4. "علاش غالي؟" → explain value + guarantee removes risk
  5. "الضمان حقيقي؟" → yes + process
  6. "الدفع كيكون؟" → COD explanation
  7. "كمن وقت التوصيل؟" → 2-4 days

---

## Thank-You Page CRO

### Objective: Maximize Confirmation Rate

The thank-you page is the most underused CRO tool in COD stores.

**Timeline awareness:** Customer calls usually happen within 60-90 minutes of order. The thank-you page is seen by the customer RIGHT BEFORE or AT THE SAME TIME as the call.

Use thank-you page to:
1. **Prime them for the call** — tell them it's coming, make it feel normal
2. **Re-sell the decision** — remind them why they bought
3. **Reduce anxiety** — "ما خسرتيش شي، الدفع عند الاستلام"
4. **Create excitement** — build anticipation for delivery + results

### Thank-You Page Copy (Full)

**Section 1: Confirmation**
```
[✅ animated checkmark]

شكرًا {name}! طلبك وصلنا 🎉
طلبية رقم: #RLX-20260519-K7M2
```

**Section 2: Call Alert Banner (GOLD BACKGROUND)**
```
📞 سنتصل بك خلال أقل من 10 دقائق!

فريقنا المغربي سيتصل بك على ***-***-{last4digits} لتأكيد طلبك وعنوانك.

⏰ ساعات التواصل: من 9 صباحًا إلى 9 مساءً
```

If outside hours:
```
📅 طلبك وصلنا بنجاح!
سنتصل بك بكرا الصباح من الساعة 9 صباحًا لتأكيد طلبك.
جهّز نفسك للمكالمة!
```

**Section 3: Preparation Tips**
```
[Heading: حضّر نفسك للمكالمة]

✅ اعمل التليفون قريب منك
✅ تأكد أن الرقم {masked_phone} صحيح ويرد
✅ جهّز عنوانك الكامل للتوصيل
✅ الدفع يكون عند الاستلام — ما خسرتيش شي الآن
```

**Section 4: Order Summary**
```
[ملخص طلبتك]
[Product image] [Name] [Qty] [Price]
──────────────────────────
المجموع: XXX درهم
التوصيل: مجاني 🚚
طريقة الدفع: عند الاستلام 💰
```

**Section 5: Excitement Builder**
```
[Heading: اش باغيتي تشوفيه في الأسبوع الأول؟]

[Timeline visual]
📦 2-4 أيام: طلبيتك تصلك بأمان
🌿 الأسبوع الأول: تبدأ تحس الفرق
💪 الأسبوع الثاني: تحسن ملحوظ
✨ الشهر الأول: نتائج حقيقية وملموسة

"آلاف من المغاربة مروا بنفس المرحلة — ودابا راضين على قرارهم"
```

**Section 6: Social Proof Strip**
```
[3 mini-testimonials about delivery + results]
"وصل في يومين، النتائج من الأسبوع الأول" — فاطمة، مراكش ⭐⭐⭐⭐⭐
```

**Section 7: Cross-sell (full price)**
```
[يمكنك كذلك إضافة لطلبيتك:]
[2 product cards — products they didn't buy]
```

---

## Upsell Popup CRO

### The 10-Second Upsell Formula
- **Headline**: "🎁 عرض خاص — لوقت محدود"
- **Social proof**: "العملاء اللي طلبو [X] اختاروا [Y] كذلك"
- **Urgency**: countdown timer (visible, not hidden)
- **Risk removal**: "يُضاف لنفس طلبك — الدفع عند الاستلام"
- **Price**: prominent, no discount (full price is fine here)
- **Accept CTA**: large, green, clear
- **Decline**: small text link, not a button

### Why No Discount on Upsell
- Discount would train customers to wait for discounts
- COD market: customer isn't paying now — no price sensitivity at this moment
- Full price = product confidence

---

## Copy for Different Traffic Sources

### Facebook Traffic (Older, more skeptical)
- Lead with authority: "مثبت علميًا"
- Lead with testimonials from similar age group
- Emphasize guarantee heavily
- Less emoji, more formal Darija

### TikTok Traffic (Younger, impulse-driven)  
- Lead with visual transformation
- Shorter copy, bigger headlines
- More emoji
- "من الأسبوع الأول" - fast results messaging
- Trend language: "كل الناس كتتكلم على..."

### Snapchat Traffic (Young women, 18-35)
- More personal, emotional copy
- Before/after visual heavy
- "الانتفاخ والغازات — حرشمة فالضحية" (relatable humor)
- Confidence + beauty angle: "ريّحي بطنك — راحي في روحك"

---

## A/B Testing Priorities

Once store is live, test in this order:

1. **Bundle pre-selection**: Test 1-pack vs 2-pack as default → likely 2-pack wins
2. **CTA text**: "أضف للسلة" vs "اطلب الآن" vs "جرّب الآن"
3. **Price display**: with vs without savings callout
4. **Hero headline**: current vs 2 alternatives for each product
5. **Upsell timer**: 10s vs 15s
6. **Call timing messaging**: "10 دقائق" vs "ساعة واحدة"
7. **Guarantee placement**: below CTA only vs also above CTA

---

## Confirmation Rate Optimization

### Best Practices
1. **Call within 5-10 minutes** — drop in answer rate after 30 min
2. **Local number** — customers don't answer unknown foreign numbers
3. **Call script**: friendly, Darija, quick confirmation of address
4. **Fallback**: SMS with order details if no answer
5. **Retry**: call 3 times max, then mark as no-answer

### Script for Confirmation Call
```
"السلام عليكم [Name]، معاك ريلاكسيا، اتصلنا باش نأكدوا طلبيتك ديال [Product] بـ[Price] درهم.
تقدروا تعطوني عنوانكم الكامل باش نبعتو ليكم؟"

After address:
"خلال 2-4 أيام يصلكم. الدفع عند الاستلام — بلا قلق. شكرًا بزاف!"
```

---

## Performance Rules (CRO + Speed)

1. **LCP < 2.5s** — hero image must be preloaded with `priority`
2. **No layout shift** — all images have explicit width/height
3. **Instant cart response** — optimistic UI, don't wait for API
4. **Form submit feedback** — show spinner immediately, not after API call
5. **Smooth scroll** — all internal links use smooth scroll
6. **No jank on scroll** — no parallax, no heavy scroll animations
7. **Font fallback** — system-ui fallback so text shows before Cairo loads
