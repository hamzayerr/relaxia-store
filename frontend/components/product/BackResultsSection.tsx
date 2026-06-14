'use client'
import Image from 'next/image'

const DATA: Record<string, { title: string; subtitle: string; images: { src: string; label: string }[] }> = {
  melanex: {
    title: 'يُستعمل للرجال والنساء',
    subtitle: 'تركيبة آمنة تساعد على استعادة لون البشرة الطبيعي للجميع',
    images: [
      { src: '/images/before-after-melanex.png?v=4', label: 'للنساء — استعادة لون البشرة' },
      { src: '/images/man-melanex.jpg?v=4', label: 'للرجال — نتائج طبيعية ومضمونة' },
    ],
  },
  keranex: {
    title: 'النتيجة قبل و بعد',
    subtitle: 'شوف الفرق بعد الاستعمال المنتظم لـ KERANEX على اليدين والقدمين',
    images: [
      { src: '/images/products/keranex/before-after-hands.png?v=1', label: 'لليدين — من أظافر هشة ومتكسرة إلى أظافر قوية ولامعة' },
      { src: '/images/products/keranex/before-after-feet.png?v=1', label: 'للقدمين — من فطريات وأظافر متضررة إلى أظافر صحية' },
    ],
  },
}

export default function BackResultsSection({ productId }: { productId: string }) {
  const data = DATA[productId]
  if (!data) return null

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-brand-50 to-white">
      <div className="container-custom">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="font-cairo font-extrabold text-2xl lg:text-3xl text-brand-900 mb-2">
            {data.title}
          </h2>
          <p className="font-tajawal text-[#4A6555] text-sm lg:text-base">
            {data.subtitle}
          </p>
        </div>

        <div className={`grid grid-cols-1 ${data.images.length > 1 ? 'md:grid-cols-2 max-w-5xl' : 'max-w-2xl'} gap-4 lg:gap-6 mx-auto`}>
          {data.images.map((img, i) => (
            <div key={i} className="space-y-2">
              <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
                <Image
                  src={img.src}
                  alt={img.label}
                  width={1200}
                  height={1200}
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="w-full h-auto"
                  loading="lazy"
                  quality={75}
                />
              </div>
              <p className="text-center font-tajawal text-sm text-brand-900 font-bold">
                {img.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
