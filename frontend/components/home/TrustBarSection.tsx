import { Truck, ShieldCheck, Leaf, FlaskConical } from 'lucide-react'

export default function TrustBarSection() {
  const items = [
    { Icon: ShieldCheck, title: 'الدفع عند الاستلام', sub: 'ما خسرتيش شي' },
    { Icon: Truck,       title: 'توصيل 48 ساعة',      sub: 'جميع مدن المغرب' },
    { Icon: ShieldCheck, title: 'ضمان 30 يوم',         sub: 'استرداد كامل' },
    { Icon: Leaf,        title: 'طبيعي 100%',          sub: 'بدون مواد كيميائية' },
  ]
  return (
    <div className="bg-brand-900 py-4">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map(b => (
            <div key={b.title} className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <b.Icon className="w-4 h-4 text-gold-400" />
              </div>
              <div>
                <p className="font-cairo font-bold text-sm leading-tight">{b.title}</p>
                <p className="font-tajawal text-white/60 text-xs">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
