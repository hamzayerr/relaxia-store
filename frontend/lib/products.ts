export interface Ingredient {
  nameAr: string
  nameFr: string
  percentage?: string
  amount?: string
  benefit: string
  icon?: string
}

export interface Product {
  id: string
  slug: string
  sku: string
  nameAr: string
  nameFr: string
  taglineAr: string
  subTaglineAr: string
  descriptionAr: string
  type: 'capsule' | 'cream'
  volume?: string
  capsules?: number
  category: 'digestive' | 'joints'
  images: {
    hero: string
    gallery: string[]
  }
  ingredients: Ingredient[]
  benefits: string[]
  howToUse: string[]
  warnings: string[]
  crossSells: string[]
  rating: number
  reviewCount: number
  problemHeading: string
  problemBody: string
  solutionHeading: string
  solutionBody: string
  resultsTimeline: { week: string; result: string }[]
  testimonials: {
    name: string
    city: string
    text: string
    rating: number
  }[]
  faq: { q: string; a: string }[]
}

export const PRODUCTS: Product[] = [
  {
    id: 'coloflora',
    slug: 'coloflora',
    sku: 'colon30',
    nameAr: 'كولوفلورا',
    nameFr: 'COLOFLORA',
    taglineAr: 'راحة، خفة وهضم مريح — مع كولوفلورا',
    subTaglineAr: 'مزيج طبيعي لدعم الهضم وتوازن الفلورا المعوية، من أجل راحة حقيقية وإحساس بالخفة كل يوم.',
    descriptionAr: 'كولوفلورا فورمولا علمية متكاملة لدعم القولون والجهاز الهضمي. مزيج دقيق من البروبيوتيك الفعال، ألياف الأكاسيا الطبيعية، وصبار الألوفيرا — كلها بنسب مثبتة في الدراسات الإكلينيكية.',
    type: 'capsule',
    capsules: 30,
    category: 'digestive',
    images: {
      hero: '/images/products/coloflora/hero.png?v=2',
      gallery: [
        '/images/products/coloflora/hero.png?v=2',
      ],
    },
    ingredients: [
      { nameAr: 'ألياف الأكاسيا', nameFr: 'Fibres d\'acacia', percentage: '39.99%', benefit: 'البريبيوتيك الأقوى لتغذية البكتيريا النافعة في أمعائك', icon: '🌿' },
      { nameAr: 'بروبيوتيك (لاكتوباسيلوس + بيفيدوباكتيريوم)', nameFr: 'Lactobacillus + Bifidobacterium', percentage: '10% + 10%', benefit: 'سلالتان مثبتتان علميًا لاستعادة توازن الأمعاء', icon: '🦠' },
      { nameAr: 'مستخلص الصبار', nameFr: 'Extrait d\'aloe vera', percentage: '10%', benefit: 'يهدئ الجدار الهضمي ويقلل الالتهابات', icon: '🌵' },
      { nameAr: 'مستخلص النعناع', nameFr: 'Extrait de menthe poivrée', percentage: '10%', benefit: 'يفك التشنجات ويخفف الغازات والنفخة', icon: '🌱' },
      { nameAr: 'حمض الهيالورونيك', nameFr: 'Acide hyaluronique', percentage: '10%', benefit: 'يحمي ويرطب الجدار الهضمي من الداخل', icon: '💧' },
      { nameAr: 'فيتامين سي + الحديد + ب12 + د3', nameFr: 'Vitamine C, Fer, B12, D3', percentage: '12% + 7.7% + ...', benefit: 'دعم شامل للطاقة والمناعة والصحة العامة', icon: '⚡' },
    ],
    benefits: [
      'يخفف النفخة والغازات من الأسبوع الأول',
      'ينظم حركة الجهاز الهضمي',
      'يوازن الميكروبيوم الهضمي',
      'يهدئ القولون العصبي',
      'يدعم المناعة والطاقة العامة',
    ],
    howToUse: [
      'خذ 1 إلى 2 كبسولة يوميًا',
      'بعد الوجبة مباشرة',
      'مع كوب كامل من الماء',
    ],
    warnings: [
      'يحفظ بعيدا عن متناول الأطفال',
      'لا تتجاوز الجرعة اليومية الموصى بها',
      'يُنصح بمراجعة الطبيب للحوامل والمرضعات',
      'يحفظ في مكان بارد وجاف',
    ],
    crossSells: ['pylorex', 'flexima'],
    rating: 4.9,
    reviewCount: 1287,
    problemHeading: 'كتعرف تمامًا اش كتمر منّو؟',
    problemBody: 'النفخة، الغازات، التقلصات، أو اضطرابات الهضم بحال الإمساك والإسهال بالتداول… أعراض كتأثر على راحتك اليومية وكتخلي نهارك أقل راحة وتركيز.\n\nمشاكل القولون ما كتأثرش غير على المعدة — كتأثر حتى على نفسيتك وطاقة نهارك. يمكن تكون جربتي أدوية، أعشاب أو وصفات مختلفة، لكن النتيجة كانت مؤقتة والأعراض رجعات من جديد.\n\nهاد المعاناة ما خاصهاش تبقى جزء من يومك… والحل كيبدأ بفهم السبب الحقيقي ومعالجته بالطريقة المناسبة.',
    solutionHeading: 'كولوفلورا — مو غير مكمل. هي فورمولا هضمية متكاملة.',
    solutionBody: 'الجهاز الهضمي محتاج توازن حقيقي — مو غير تخفيف الأعراض.\nكولوفلورا طُوِّرت بمزيج دقيق من البروبيوتيك الفعال، ألياف الأكاسيا الطبيعية، وصبار الألوفيرا الخالص — كلها بنسب محددة علميًا.',
    resultsTimeline: [
      { week: 'الأسبوع الأول', result: 'انخفاض ملحوظ في النفخة والغازات' },
      { week: 'الأسبوع الثاني', result: 'انتظام في حركة الجهاز الهضمي' },
      { week: 'الشهر الأول', result: 'إحساس حقيقي بالارتياح من الداخل' },
    ],
    testimonials: [
      { name: 'نورة م.', city: 'فاس', text: 'من 3 سنين وأنا نعاني من القولون. بعد 15 يوم مع كولوفلورا، النفخة خفت والحركة انتظمت. أخيرًا حاجة تنجح!', rating: 5 },
      { name: 'عبد الرحمان ك.', city: 'الدار البيضاء', text: 'كنت خايف نجرب آخر شي أونلاين، لكن الدفع عند الاستلام والضمان خلاني نجرب. من الأسبوع الأول فرق واضح.', rating: 5 },
      { name: 'فاطمة ب.', city: 'مراكش', text: 'طلبت للقولون العصبي، وفعلًا المشكلة خفت بشكل ملحوظ. التوصيل جاء في 3 أيام.', rating: 5 },
      { name: 'أمين ط.', city: 'أكادير', text: 'نوصي بيه لكل واحد كيعاني من الهضم. مكونات واضحة، نسب مذكورة، وضمان. هاد هو الفرق.', rating: 5 },
      { name: 'مريم ع.', city: 'الرباط', text: 'رجعت طلبت مرة ثانية. مو أحسن دليل على النجاح.', rating: 5 },
      { name: 'الحسين ب.', city: 'طنجة', text: 'ولادي لاحظو الفرق قبل ما يلاحظه أنا — قالولي "عاد ولا مزيان" 😄', rating: 5 },
    ],
    faq: [
      { q: 'كم من الوقت قبل ما نشوف نتيجة؟', a: 'أغلب العملاء يشوفو تحسن من الأسبوع الأول — خصوصًا في النفخة والغازات. النتائج الكاملة بعد 3-4 أسابيع.' },
      { q: 'واش يمكن ناخذو مع الأدوية؟', a: 'كولوفلورا طبيعي 100%. لكن إلا كنتي تاخذ دواء معين، تشاور مع طبيبك.' },
      { q: 'واش فيه آثار جانبية؟', a: 'مكونات طبيعية بالكامل. بعض الناس يحسو بتغيير بسيط في الأيام الأولى — هذا طبيعي لأن الميكروبيوم كيتوازن.' },
      { q: 'واش الضمان حقيقي؟', a: 'نعم. 30 يوم كاملين — إلا ما عجبكش، نردو ليك فلوسك بلا أسئلة.' },
      { q: 'إلا أنا حامل أو مرضعة؟', a: 'نوصي تشاوري مع طبيبتك قبل الاستعمال.' },
      { q: 'الدفع كيكون فاش؟', a: 'الدفع عند الاستلام — كتدفع فقط مللي تستلم طلبيتك.' },
    ],
  },
  {
    id: 'pylorex',
    slug: 'pylorex',
    sku: 'gastro-balance30',
    nameAr: 'بيلوريكس',
    nameFr: 'PYLOREX',
    taglineAr: 'وداعًا لجرثومة المعدة — راحة دائمة مع بيلوريكس',
    subTaglineAr: 'تركيبة طبيعية لمحاربة جرثومة المعدة وتهدئة الالتهابات، من أجل هضم سليم وراحة كل يوم.',
    descriptionAr: 'بيلوريكس صُممت بستة مكونات طبيعية معروفة علميًا بفعاليتها ضد H. pylori. كلها بجرعات دقيقة ومثبتة — مو خلطة عشوائية.',
    type: 'capsule',
    capsules: 30,
    category: 'digestive',
    images: {
      hero: '/images/products/pylorex/hero.png?v=2',
      gallery: [
        '/images/products/pylorex/hero.png?v=2',
      ],
    },
    ingredients: [
      { nameAr: 'مستخلص الثوم', nameFr: 'Extrait d\'ail', amount: '150 mg', benefit: 'الأقوى في مكافحة H. pylori طبيعيًا', icon: '🧄' },
      { nameAr: 'عرق السوس منزوع الجليسرين', nameFr: 'Réglisse déglycyrrhiziné', amount: '100 mg', benefit: 'يهدئ ويحمي جدار المعدة من الالتهاب', icon: '🌿' },
      { nameAr: 'الدنج (العكبر)', nameFr: 'Propolis', amount: '75 mg', benefit: 'مضاد حيوي طبيعي قوي — يعزز المناعة ويقاوم البكتيريا', icon: '🍯' },
      { nameAr: 'مستخلص القرنفل', nameFr: 'Extrait de clou de girofle', amount: '75 mg', benefit: 'مضاد التهاب ومضاد حيوي فعال', icon: '🌺' },
      { nameAr: 'الزنجبيل', nameFr: 'Gingembre', amount: '50 mg', benefit: 'يوقف الغثيان ويريح المعدة المتهيجة', icon: '🫚' },
      { nameAr: 'مستخلص النعناع', nameFr: 'Extrait de menthe poivrée', amount: '50 mg', benefit: 'يرخي عضلات المعدة ويريح التشنجات', icon: '🌱' },
    ],
    benefits: [
      'يكافح جرثومة المعدة H. pylori طبيعيًا',
      'يخفف حرقة المعدة والغثيان',
      'يهدئ ويحمي جدار المعدة',
      'يعزز المناعة ضد البكتيريا',
      'بديل طبيعي للمضادات الحيوية القاسية',
    ],
    howToUse: [
      'خذ 1 إلى 2 كبسولة يوميًا',
      'بعد الوجبة مباشرة',
      'مع كوب كامل من الماء',
    ],
    warnings: [
      'يحفظ بعيدا عن متناول الأطفال',
      'لا تتجاوز الجرعة اليومية الموصى بها',
      'يُنصح بمراجعة الطبيب للحوامل والمرضعات',
      'يحفظ في مكان بارد وجاف',
    ],
    crossSells: ['coloflora', 'flexima'],
    rating: 4.8,
    reviewCount: 943,
    problemHeading: 'الجرثومة ما غادرتك — حتى بعد العلاج؟',
    problemBody: 'حرقة المعدة. الألم بعد الأكل. الغثيان الصباحي. الشعور بالانتفاخ.\nالجرثومة (H. pylori) مو مجرد مشكلة صغيرة — هي سبب رئيسي لقرحة المعدة وآلام مزمنة.\n\nالمضادات الحيوية الكلاسيكية؟ آثارها الجانبية قاسية، والجرثومة أحيانًا تقاوم وترجع.\nالأدوية التقليدية؟ تخفف الأعراض ولكن ما تقتلش الجرثومة من الجذور.',
    solutionHeading: 'بيلوريكس — حل طبيعي متكامل ضد الجرثومة',
    solutionBody: 'بيلوريكس صُممت بستة مكونات طبيعية معروفة علميًا بفعاليتها ضد H. pylori.\nكلها بجرعات دقيقة ومثبتة — مو خلطة عشوائية.\n\nمستخلص الثوم بـ150mg، الدنج بـ75mg، القرنفل بـ75mg، وعرق السوس — كلهم شغلو سويًا باش يضعفو الجرثومة، يهدئو المعدة، ويمنعو الرجوع.',
    resultsTimeline: [
      { week: 'الأسبوع الأول', result: 'انخفاض الحرقة والغثيان' },
      { week: 'الأسبوع الثالث', result: 'تحسن ملحوظ في كل أعراض المعدة' },
      { week: 'الشهر الثاني', result: 'معدة مرتاحة وحماية من الرجوع' },
    ],
    testimonials: [
      { name: 'يوسف ع.', city: 'الرباط', text: 'الجرثومة عندي من 2 سنين. جربت 3 دورات مضادات حيوية. بيلوريكس من الأسبوع الأول الحرقة خفت. 6 أسابيع وحمدلله الأعراض ولاو معدومة.', rating: 5 },
      { name: 'لطيفة م.', city: 'مكناس', text: 'ما كنتش مصدق في حاجة أونلاين — لكن الكمية والمكونات المفصلة خلاوني نجرب. صح وخيت!', rating: 5 },
      { name: 'سمير ب.', city: 'الدار البيضاء', text: 'الطبيب عطاني المضادات وخلفت مشاكل في الجهاز الهضمي. بيلوريكس خلاني نتعافى بطريقة طبيعية.', rating: 5 },
      { name: 'أسماء ك.', city: 'طنجة', text: 'توصية صادقة: إلا عندك أعراض جرثومة المعدة — جرب بيلوريكس. الدفع عند استلام الطلب مع الضمان.', rating: 5 },
    ],
    faq: [
      { q: 'واش بيلوريكس يحل محل المضادات الحيوية؟', a: 'بيلوريكس ليس دواء — هو مكمل غذائي طبيعي. للحالات الشديدة، شاور طبيبك. لكن للدعم الطبيعي وتخفيف الأعراض، فعال جدًا.' },
      { q: 'كم الوقت قبل ما تتحسن؟', a: 'معظم العملاء يحسون بفرق من الأسبوع الأول في الحرقة والغثيان. التحسن الكامل بعد 4-6 أسابيع.' },
      { q: 'واش الثوم كيدي ريحة؟', a: 'المستخلص في كبسولة مغلقة — ما كايناش ريحة ثوم ملحوظة.' },
      { q: 'واش يمكن نجمعو مع كولوفلورا؟', a: 'نعم — كثير من عملاؤنا يجمعوا بيلوريكس مع كولوفلورا لدعم شامل للجهاز الهضمي.' },
      { q: 'الدفع كيكون فاش؟', a: 'الدفع عند الاستلام — الدفع عند استلام الطلب.' },
    ],
  },
  {
    id: 'flexima',
    slug: 'flexima',
    sku: 'joint-creme',
    nameAr: 'فليكسيما',
    nameFr: 'FLEXIMA',
    taglineAr: 'راحة المفاصل وحركة بحرية — مع فليكسيما',
    subTaglineAr: 'كريم طبيعي لتخفيف آلام المفاصل والعضلات، يمنحك راحة فورية وحركة مرنة كل يوم.',
    descriptionAr: 'فليكسيما كريم موضعي متخصص لتخفيف آلام المفاصل والعضلات. فورمولا نشطة عميقة تجمع الجلوكوزامين وMSM والأرنيكا مع المنثول وزيت الزنجبيل.',
    type: 'cream',
    volume: '100ml',
    category: 'joints',
    images: {
      hero: '/images/products/flexima/hero.png?v=2',
      gallery: [
        '/images/products/flexima/hero.png?v=2',
      ],
    },
    ingredients: [
      { nameAr: 'الجلوكوزامين', nameFr: 'Glucosamine', benefit: 'يغذي الغضروف ويساعد على إعادة بنائه', icon: '🦴' },
      { nameAr: 'MSM (ميثيل سولفونيل ميثان)', nameFr: 'MSM', benefit: 'مضاد التهاب قوي — مثبت علميًا لتخفيف آلام المفاصل', icon: '⚗️' },
      { nameAr: 'مستخلص الأرنيكا', nameFr: 'Extrait d\'Arnica', benefit: 'يقلل التورم والالتهاب بسرعة', icon: '🌼' },
      { nameAr: 'الكبسيكم (الفلفل الحار)', nameFr: 'Extrait de Capsicum', benefit: 'يحفز الدورة الدموية ويجلب الدفء العلاجي', icon: '🌶️' },
      { nameAr: 'المنثول', nameFr: 'Menthol', benefit: 'تبريد فوري وتخفيف سريع للألم من أول لمسة', icon: '❄️' },
      { nameAr: 'زيت الزنجبيل', nameFr: 'Huile de gingembre', benefit: 'مضاد التهاب ومحفز للدورة الدموية', icon: '🫚' },
    ],
    benefits: [
      'يخفف آلام الركبة والظهر والكتف',
      'يحفز الدورة الدموية في المنطقة المؤلمة',
      'يقلل الالتهاب والتورم',
      'يحسن مرونة المفاصل',
      'ارتياح فوري من أول استخدام',
    ],
    howToUse: [
      'ضع كمية مناسبة على المنطقة المؤلمة',
      'دلك بحركات دائرية لمدة 2-3 دقائق',
      'كرر مرتين يوميًا: صباحًا وقبل النوم',
    ],
    warnings: [
      'للاستخدام الخارجي فقط',
      'تجنب في حالة الحساسية للفلفل أو البشرة الحساسة',
      'لا تستخدم على الجروح أو الجلد المكسور',
      'ابعد عن متناول الأطفال',
      'تجنب ملامسة العيون — اغسل يديك بعد الاستخدام',
    ],
    crossSells: ['coloflora', 'pylorex'],
    rating: 4.7,
    reviewCount: 876,
    problemHeading: 'واش الألم بدا يحكم عليك في حياتك اليومية؟',
    problemBody: 'الصبح كتصحى وركبتك تعمر عليك.\nصعود الدرج ولا حمل الحوائج ولا حتى المشي بعيد — كلو بدا يبان صعيب.\n\nالأدوية المسكنة كتاخذها، وترتاح مؤقتًا، ثم يرجع الألم.\nبعض الناس وصلو لدرجة اضطرو يوقفو عن الرياضة، أو يتجنبو نشاطات مع العيلة.\n\nالجسم ما يستاهلش يعيش في ألم.',
    solutionHeading: 'فليكسيما — كريم موضعي يتغلغل في عمق المفصل',
    solutionBody: 'الكريمات العادية كتمس على السطح فقط.\nفليكسيما صُممت بفورمولا نشطة عميقة: الجلوكوزامين يغذي الغضروف، MSM يقلل الالتهاب، الأرنيكا تخفف التورم، والمنثول يعطيك تخفيفًا فوريًا من أول استخدام.',
    resultsTimeline: [
      { week: 'اليوم الأول', result: 'إحساس بالدفء والارتياح' },
      { week: 'الأسبوع الثاني', result: 'انخفاض ملحوظ في شدة الألم' },
      { week: 'الشهر الأول', result: 'مرونة أحسن وحركة أريح' },
    ],
    testimonials: [
      { name: 'حليمة ب.', city: 'مراكش', text: 'ركبتي تعمر عليا من سنة. جربت مراهم كثيرة. فليكسيما من أول يوم حسيت بدفء وارتياح. من الأسبوع الثاني الألم خف بشكل واضح.', rating: 5 },
      { name: 'عبد الله م.', city: 'فاس', text: 'كنت ما نقدرش نمشي كثير بسبب ألم الظهر والركبة. دابا مع فليكسيما رجعت للمشي الصباحي. شكرًا!', rating: 5 },
      { name: 'سناء ع.', city: 'الرباط', text: 'أوصيت بيه لأمي اللي عندها آلام المفاصل — وكانت مفاجأة للعيلة كلها. منتج رائع.', rating: 5 },
      { name: 'كمال ط.', city: 'الدار البيضاء', text: 'من المسكنات الكيميائية لفليكسيما الطبيعي. قرار ما ندمتش عليه.', rating: 5 },
    ],
    faq: [
      { q: 'هل فليكسيما للعضلات فقط أم المفاصل أيضًا؟', a: 'للاثنين — يعمل على الركبة، الكتف، الظهر، الرقبة، والمعصم. وكذلك لآلام العضلات بعد الرياضة.' },
      { q: 'كم مرة نستخدمه في اليوم؟', a: 'مرتين في اليوم — صباحًا وقبل النوم.' },
      { q: 'متى أبدأ نشوف نتيجة؟', a: 'الارتياح الأولي من اليوم الأول (دفء + تبريد). التحسن في شدة الألم من الأسبوع الثاني.' },
      { q: 'كم تكفي العبوة؟', a: '100ml تكفي 4-6 أسابيع مع الاستخدام الموصى به.' },
    ],
  },
]

export const OFFERS = [
  { id: 'one' as const, qty: 1, price: 229, originalPrice: 270, pricePerUnit: 229, label: '1 قطعة', tag: null, popular: false },
  { id: 'two' as const, qty: 2, price: 345, originalPrice: 540, pricePerUnit: 172, label: '2 قطع', tag: '⭐ الأكثر مبيعًا', popular: true },
  { id: 'three' as const, qty: 3, price: 430, originalPrice: 810, pricePerUnit: 143, label: '3 قطع', tag: '💰 أفضل قيمة', popular: false },
]

export type OfferId = 'one' | 'two' | 'three'

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id)
}

export function getCrossSells(productId: string): Product[] {
  const product = getProductById(productId)
  if (!product) return []
  return product.crossSells
    .map(id => getProductById(id))
    .filter(Boolean) as Product[]
}

export function getOfferById(offerId: OfferId) {
  return OFFERS.find(o => o.id === offerId) || OFFERS[1]
}

export function selectUpsellProduct(cartProductIds: string[]): Product | null {
  if (cartProductIds.length >= 3) return null

  if (cartProductIds.includes('coloflora') && !cartProductIds.includes('pylorex'))
    return getProductById('pylorex') || null
  if (cartProductIds.includes('pylorex') && !cartProductIds.includes('coloflora'))
    return getProductById('coloflora') || null
  if (cartProductIds.includes('flexima') && !cartProductIds.includes('coloflora'))
    return getProductById('coloflora') || null
  if (cartProductIds.includes('coloflora') && cartProductIds.includes('pylorex'))
    return getProductById('flexima') || null

  return null
}
