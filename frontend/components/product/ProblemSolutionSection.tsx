interface ProblemSolutionSectionProps {
  productId: string
}

const DATA: Record<string, {
  title: string
  subtitle: string
  pairs: { problem: string; solution: string }[]
}> = {
  coloflora: {
    title: 'مشاكل تعرفها — وحلول من الداخل',
    subtitle: 'مو نخففو الأعراض. نحلّو السبب الحقيقي.',
    pairs: [
      {
        problem: '«الانتفاخ والغازات من الصبح، وكنحس بثقل طول اليوم في الخدمة والدار.»',
        solution: 'البروبيوتيك في كولوفلورا كيعيد توازن البكتيريا النافعة — الانتفاخ كيخف من الأسبوع الأول.',
      },
      {
        problem: '«تقلصات القولون خلاني نتجنب الخروج من الدار — ما كنثقش في جسمي.»',
        solution: 'مستخلص النعناع + صبار الألوفيرا كيهدي جدار القولون ويفك التشنجات من الداخل.',
      },
      {
        problem: '«جربت أدوية من الصيدلية — ساعدت أيام قليلة… لكن الأعراض رجعات من جديد.»',
        solution: 'كولوفلورا كيساعد على دعم التوازن الهضمي الطبيعي — بدل الاكتفاء بتخفيف الأعراض بشكل مؤقت.',
      },
      {
        problem: '«الإمساك والإسهال كيبدلو بالتداول وخلاني محتار وقلقان من السبب.»',
        solution: 'تركيبة غنية بالألياف الطبيعية كتساهم فتنظيم حركة الأمعاء بشكل متوازن ولطيف على الجهاز الهضمي.',
      },
    ],
  },
  melanex: {
    title: 'البهاق ما مرض — هو فقدان طبيعي للميلانين',
    subtitle: 'مو نغطيو البقع. نحفزو الميلانين من الداخل بطريقة طبيعية وآمنة.',
    pairs: [
      {
        problem: '«البقع البيضاء على وجهي خلاوني نتجنب المرآة، وكنحس بإحراج قدام الناس.»',
        solution: 'فيتامين B12 + النياسيناميد كيحفزو إنتاج الميلانين الطبيعي — لون البشرة يبدأ يتوحد تدريجيًا.',
      },
      {
        problem: '«جربت كريمات بالكورتيزون — ساعدت في البداية، لكن البشرة ولات رقيقة ومتهيجة.»',
        solution: 'ميلانكس بلا كورتيزون — تركيبة طبيعية 100% مع مستخلص الخلة، آمنة للاستخدام الطويل.',
      },
      {
        problem: '«البشرة جافة ومتهيجة، والبقع كتزيد كل ما البشرة تنشف.»',
        solution: 'الصبار + حمض الهيالورونيك كيرطبو البشرة في العمق، والترطيب أساس للشفاء الطبيعي.',
      },
      {
        problem: '«ما كنعرفش إذا غادي ينفع وما عاديش أصبر — كل العلاجات تاخذ وقت.»',
        solution: 'النتائج الأولى من الأسبوع الأول (ترطيب وتهدئة). تحفيز الميلانين يحتاج 4-8 أسابيع — والنتيجة دائمة.',
      },
    ],
  },
}

export default function ProblemSolutionSection({ productId }: ProblemSolutionSectionProps) {
  const d = DATA[productId]
  if (!d) return null

  return (
    <section className="py-16 lg:py-24" style={{ background: '#F5F1E8' }}>
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-cairo font-extrabold text-3xl lg:text-4xl text-brand-900 mb-3">
            {d.title}
          </h2>
          <p className="font-tajawal text-[#4A6555] text-base lg:text-lg">{d.subtitle}</p>
        </div>

        {/* Content — problem/solution pairs full width */}
        <div className="max-w-3xl mx-auto space-y-4">
          {d.pairs.map((pair, i) => (
            <div key={i} className="space-y-2">
              {/* Problem */}
              <div className="flex gap-3 items-start bg-white rounded-2xl p-4 shadow-sm border border-red-50">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                    <circle cx="10" cy="10" r="9" stroke="#EF4444" strokeWidth="1.5"/>
                    <path d="M13 7L7 13M7 7l6 6" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="font-cairo font-bold text-sm text-gray-800 leading-relaxed italic">
                  {pair.problem}
                </p>
              </div>

              {/* Solution */}
              <div className="flex gap-3 items-start rounded-2xl p-4 border border-brand-100" style={{ background: '#EEF5F0' }}>
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-700 flex items-center justify-center mt-0.5">
                  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                    <circle cx="10" cy="10" r="9" fill="#0B4D2E"/>
                    <path d="M6 10l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="font-tajawal text-sm text-brand-900 leading-relaxed">
                  {pair.solution}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
