const ITEMS = [
  '🔒 دفع آمن عند الاستلام',
  '🚚 توصيل مجاني لجميع المدن',
  '⭐ 512 عميل راضي',
  '✅ ضمان استرداد 30 يوم',
]

export default function TrustBarMarquee() {
  // Duplicate items so the marquee loops seamlessly
  const loop = [...ITEMS, ...ITEMS]

  return (
    <div className="overflow-hidden bg-brand-50 border border-brand-100 rounded-xl py-2.5">
      <div className="flex w-max gap-8 animate-marquee whitespace-nowrap">
        {loop.map((item, i) => (
          <span key={i} className="font-cairo font-bold text-xs text-brand-800 px-2">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
