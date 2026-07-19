export interface Product {
  id: number;
  name: string;
  category: string;
  categoryName?: string;
  brand: string;
  model: string;
  year: string;
  price: number;
  originalPrice?: number;
  condition: string;
  conditionText: string;
  image: string;
  description: string;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
}

export const productsData: Product[] = [
  {
    id: 1,
    name: "طقم كشافات أمامي كامل (LED)",
    category: "body",
    brand: "kia",
    model: "niro",
    year: "2018-2022",
    price: 28,
    originalPrice: 35,
    condition: "new",
    conditionText: "جديد",
    image: "assets/images/products/fog-lights.webp",
    description: "طقم كشافات ليد أمامي عالي الجودة متوافق مع كيا نيرو، إضاءة قوية ومقاومة للعوامل الجوية.",
    featured: true,
    bestSeller: true,
    newArrival: false
  },
  {
    id: 2,
    name: "بوق هواء رياضي (هون)",
    category: "accessories",
    brand: "all",
    model: "جميع الموديلات",
    year: "all",
    price: 12,
    originalPrice: 15,
    condition: "new",
    conditionText: "جديد",
    image: "assets/images/products/air-horn.webp",
    description: "بوق هواء قوي ومميز متوافق مع كافة أنواع السيارات وسهل التركيب.",
    featured: false,
    bestSeller: false,
    newArrival: true
  },
  {
    id: 3,
    name: "فيش لمبة أمامي H7 سيراميك",
    category: "electrical",
    brand: "all",
    model: "جميع الموديلات",
    year: "all",
    price: 4,
    originalPrice: 5,
    condition: "new",
    conditionText: "جديد",
    image: "assets/images/products/bulb-socket.webp",
    description: "فيش لمبة حراري مصنوع من السيراميك المقاوم للحرارة العالية والاهتزاز لمنع ذوبان الأسلاك.",
    featured: false,
    bestSeller: true,
    newArrival: false
  },
  {
    id: 4,
    name: "بريك أمامي أصلي (فحمات)",
    category: "mechanical",
    brand: "toyota",
    model: "prius",
    year: "2016-2022",
    price: 20,
    originalPrice: 25,
    condition: "new",
    conditionText: "جديد",
    image: "assets/images/products/front-brakes.webp",
    description: "فحمات بريك أمامية أصلية لسيارة تويوتا بريوس تمنحك استجابة فرملة سريعة وعمر تشغيلي طويل دون إصدار أصوات.",
    featured: true,
    bestSeller: true,
    newArrival: true
  },
  {
    id: 5,
    name: "بريك خلفي أصلي (فحمات)",
    category: "mechanical",
    brand: "toyota",
    model: "prius",
    year: "2016-2022",
    price: 18,
    originalPrice: 22,
    condition: "new",
    conditionText: "جديد",
    image: "assets/images/products/rear-brakes.webp",
    description: "فحمات فرامل خلفية ممتازة لسيارة تويوتا بريوس، تضمن توقفاً آمناً وثابتاً في مختلف ظروف الطرق.",
    featured: false,
    bestSeller: false,
    newArrival: true
  },
  {
    id: 6,
    name: "مروحة تبريد بطارية الهايبرد",
    category: "hybrid",
    brand: "toyota",
    model: "camry",
    year: "2012-2017",
    price: 45,
    originalPrice: 55,
    condition: "used",
    conditionText: "مستعمل نظيف",
    image: "assets/images/products/hybrid-fan.webp",
    description: "مروحة تبريد بطارية هايبرد أصلية مستعملة بحالة ممتازة لسيارات كامري، تم فحصها وتعمل بكفاءة 100%.",
    featured: true,
    bestSeller: false,
    newArrival: true
  },
  {
    id: 7,
    name: "مساعد أمامي يمين/يسار كامل",
    category: "suspension",
    brand: "ford",
    model: "fusion",
    year: "2014-2020",
    price: 35,
    originalPrice: 42,
    condition: "new",
    conditionText: "جديد",
    image: "assets/images/products/shock-absorber.webp",
    description: "مساعدات تعليق أمامية تمنح سيارة فورد فيوجن ثباتاً استثنائياً وامتصاصاً ممتازاً للصدمات على الطرق غير الممهدة.",
    featured: false,
    bestSeller: true,
    newArrival: false
  },
  {
    id: 8,
    name: "عاكس كهرباء هايبرد (Inverter)",
    category: "hybrid",
    brand: "toyota",
    model: "prius",
    year: "2010-2015",
    price: 120,
    originalPrice: 150,
    condition: "used",
    conditionText: "مستعمل نظيف",
    image: "assets/images/products/inverter.webp",
    description: "إنفيرتر (عاكس طاقة) أصلي مستعمل مجرب مع كفالة تشغيل حقيقية لسيارات تويوتا بريوس الجيل الثالث.",
    featured: true,
    bestSeller: false,
    newArrival: false
  },
  {
    id: 9,
    name: "فلتر هواء محرك أصلي",
    category: "mechanical",
    brand: "hyundai",
    model: "sonata",
    year: "2015-2019",
    price: 8,
    originalPrice: 10,
    condition: "new",
    conditionText: "جديد",
    image: "assets/images/products/air-filter.webp",
    description: "فلتر هواء للمحرك عالي الكفاءة يضمن حماية المحرك من الأتربة والشوائب لزيادة كفاءة استهلاك الوقود.",
    featured: false,
    bestSeller: true,
    newArrival: true
  },
  {
    id: 10,
    name: "حساس ضغط الإطارات (TPMS)",
    category: "electrical",
    brand: "all",
    model: "جميع الموديلات",
    year: "all",
    price: 15,
    originalPrice: 20,
    condition: "new",
    conditionText: "جديد",
    image: "assets/images/products/tpms.webp",
    description: "حساس مراقبة ضغط الإطارات لاسلكي متوافق مع معظم السيارات، يقيس الضغط بدقة عالية ويرسل إشارات لوحة العدادات.",
    featured: false,
    bestSeller: false,
    newArrival: true
  }
];

export function getProductCategory(product: Product): "mechanical" | "body" | "lights" {
  const name = (product.name || "").toLowerCase();
  
  // 1. Check Lights (اضوية)
  const isLights = 
    product.category === "lights" ||
    name.includes("ضوء") || 
    name.includes("اضوء") || 
    name.includes("أضواء") || 
    name.includes("لمبة") || 
    name.includes("لمبات") || 
    name.includes("كشاف") || 
    name.includes("كشافات") || 
    name.includes("زينون") || 
    name.includes("فانوس") || 
    name.includes("فوانيس") || 
    name.includes("ليد") || 
    name.includes("led");
  if (isLights) return "lights";

  // 2. Check Body & Structure (الهيكل والبودي)
  const isBody = 
    product.category === "body" ||
    name.includes("طبون") || 
    name.includes("طمبون") || 
    name.includes("صدام") || 
    name.includes("غطاء") || 
    name.includes("غطا") || 
    name.includes("خلفي") || 
    name.includes("امامي") || 
    name.includes("مرايا") || 
    name.includes("مريا") || 
    name.includes("رفرف") || 
    name.includes("باب") || 
    name.includes("ابواب") || 
    name.includes("جناح") || 
    name.includes("شبك") || 
    name.includes("بودي") || 
    name.includes("هيكل") || 
    name.includes("فخذة") || 
    name.includes("شنطة") || 
    name.includes("صندوق") || 
    name.includes("بطانة") || 
    name.includes("دعمة") || 
    name.includes("بطانه");
  if (isBody) return "body";

  // 3. Default to Mechanical (محركات)
  return "mechanical";
}
