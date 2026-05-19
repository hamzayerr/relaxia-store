import StarRating from '@/components/common/StarRating'

const testimonials = [
  { name: 'نورة م.', city: 'فاس', product: 'كولوفلورا', text: 'من 3 سنين وأنا نعاني من القولون. بعد 15 يوم مع كولوفلورا، النفخة خفت والحركة انتظمت.', rating: 5 },
  { name: 'يوسف ع.', city: 'الرباط', product: 'بيلوريكس', text: 'الجرثومة عندي من 2 سنين. بيلوريكس من الأسبوع الأول الحرقة خفت. 6 أسابيع وحمدلله الأعراض ولاو معدومة.', rating: 5 },
  { name: 'حليمة ب.', city: 'مراكش', product: 'فليكسيما', text: 'ركبتي تعمر عليا من سنة. فليكسيما من أول يوم حسيت بدفء وارتياح. من الأسبوع الثاني الألم خف بشكل واضح.', rating: 5 },
]

export default function TestimonialsHome() {
  return (
    <section className="py-14">
      <div className="container-custom">
        <div className="text-center mb-10">
          <p className="text-xs font-cairo font-bold text-brand-700 tracking-widest uppercase mb-2">آراء العملاء</p>
          <h2 className="section-heading mb-2">عميلات قرأن المكونات قبل ما يطلبن</h2>
          <p className="section-subheading">تجارب حقيقية من مغاربة حقيقيين</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="card p-6">
              <StarRating rating={t.rating} size="sm" className="mb-4" />
              <p className="font-tajawal text-brand-900 text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#E8E0C8]">
                <div className="w-9 h-9 rounded-full bg-brand-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-cairo font-bold text-sm">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-cairo font-bold text-sm text-brand-900">{t.name}</p>
                  <p className="font-tajawal text-xs text-[#4A6555]">{t.city} — {t.product}</p>
                </div>
                <span className="mr-auto flex items-center gap-1 text-[10px] text-brand-700 font-cairo font-bold bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-700" />
                  موثق
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
