"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import HeroSlider from "../components/HeroSlider";
import SearchWidget from "../components/SearchWidget";
import BrandsMarquee from "../components/BrandsMarquee";
import { useToast } from "../context/ToastContext";
import { productsData, Product, getProductCategory } from "../data/products";
import { useProducts } from "../context/ProductContext";
import { SITE_URL } from "../lib/config";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Percent, 
  Truck, 
  Star, 
  ChevronRight, 
  ChevronLeft,
  MessageCircle,
  PhoneCall,
  ShoppingCart,
  Calendar,
  CheckCircle2,
  Bookmark,
  ChevronDown,
  BatteryCharging,
  Settings,
  Disc,
  Car,
  Zap,
  MapPin,
  Clock,
  Mail
} from "lucide-react";

// List of available brands with premium vector SVGs as defaults
const BRANDS = [
  {
    key: "toyota",
    name: "تويوتا",
    logo: (
      <svg viewBox="0 0 100 65" className="w-24 h-auto transition-transform group-hover:scale-105 duration-300 fill-current" aria-hidden="true">
        <path d="M50 0C22.4 0 0 14.5 0 32.5S22.4 65 50 65s50-14.5 50-32.5S77.6 0 50 0zm0 58.5C26.5 58.5 7.5 46.8 7.5 32.5S26.5 6.5 50 6.5s42.5 11.7 42.5 26S73.5 58.5 50 58.5z"/>
        <path d="M50 8.5C36.2 8.5 25 19.3 25 32.5c0 10.7 7.4 19.8 17.5 22.9V49c-6.8-2.6-11.5-9.1-11.5-16.5 0-9.9 8.5-18 19-18s19 8.1 19 18c0 7.4-4.7 13.9-11.5 16.5v6.4c10.1-3.1 17.5-12.2 17.5-22.9 0-13.2-11.2-24-25-24z"/>
        <path d="M50 14.5c-4.1 0-7.5 8.1-7.5 18s3.4 18 7.5 18 7.5-8.1 7.5-18-3.4-18-7.5-18zm0 31.5c-1.9 0-3.5-6.1-3.5-13.5s1.6-13.5 3.5-13.5 3.5 6.1 3.5 13.5-1.6 13.5-3.5 13.5z"/>
      </svg>
    )
  },
  {
    key: "lexus",
    name: "لكزس",
    logo: (
      <svg viewBox="0 0 120 80" className="w-24 h-auto transition-transform group-hover:scale-105 duration-300" fill="none" stroke="currentColor" strokeWidth="5" aria-hidden="true">
        <ellipse cx="60" cy="35" rx="48" ry="28" />
        <path d="M35 25 L50 53 L85 24 M50 53 L90 53" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
        <text x="60" y="76" fontFamily="var(--font-outfit), sans-serif" fontSize="11" fontWeight="900" letterSpacing="4" textAnchor="middle" fill="currentColor" stroke="none">LEXUS</text>
      </svg>
    )
  },
  {
    key: "nissan",
    name: "نيسان",
    logo: (
      <svg viewBox="0 0 100 100" className="w-20 h-auto transition-transform group-hover:scale-105 duration-300 fill-current" aria-hidden="true">
        <path d="M50 10C27.9 10 10 27.9 10 50s17.9 40 40 40 40-17.9 40-40-17.9-40-40-40zm0 72c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"/>
        <rect x="5" y="42" width="90" height="16" rx="2" />
        <text x="50" y="52" fontFamily="var(--font-outfit), sans-serif" fontSize="10" fontWeight="bold" letterSpacing="2" textAnchor="middle" fill="white">NISSAN</text>
      </svg>
    )
  },
  {
    key: "ford",
    name: "فورد",
    logo: (
      <svg viewBox="0 0 120 70" className="w-24 h-auto transition-transform group-hover:scale-105 duration-300" fill="none" stroke="currentColor" strokeWidth="4" aria-hidden="true">
        <ellipse cx="60" cy="35" rx="52" ry="28" />
        <ellipse cx="60" cy="35" rx="48" ry="24" strokeWidth="1.5" />
        <text x="60" y="44" fontFamily="Georgia, serif" fontSize="24" fontWeight="bold" fontStyle="italic" textAnchor="middle" fill="currentColor" stroke="none">Ford</text>
      </svg>
    )
  },
  {
    key: "lincoln",
    name: "لينكولن",
    logo: (
      <svg viewBox="0 0 120 80" className="w-24 h-auto transition-transform group-hover:scale-105 duration-300" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <rect x="48" y="10" width="24" height="42" rx="10" />
        <line x1="60" y1="15" x2="60" y2="47" strokeWidth="2.5" />
        <line x1="52" y1="31" x2="68" y2="31" strokeWidth="2.5" />
        <path d="M 60 21 C 57 27 54 31 54 31 C 54 31 57 35 60 41 C 63 35 66 31 66 31 C 66 31 63 27 60 21 Z" fill="currentColor" stroke="none" />
        <text x="60" y="70" fontFamily="var(--font-outfit), sans-serif" fontSize="9" fontWeight="950" letterSpacing="5" textAnchor="middle" fill="currentColor" stroke="none">LINCOLN</text>
      </svg>
    )
  }
];

export default function Home() {
  const { showToast } = useToast();
  const { products, brandSettings, loading } = useProducts();
  const router = useRouter();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-play video when it enters viewport, pause when scrolled away (optimized for iOS/Android mobile browsers)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Explicitly set muted on mount to satisfy Safari/mobile autoplay policies
    video.muted = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Always autoplay as muted to bypass browser audio policies
            video.muted = true;
            video.play().catch((err) => {
              console.log("Autoplay failed:", err);
            });
          } else {
            // Pause when scrolled out of view
            video.pause();
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the video is visible
      }
    );

    observer.observe(video);

    return () => {
      if (video) observer.unobserve(video);
    };
  }, []);

  // 1. Countdown Timer Logic (resets weekly to keep it alive)
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 22, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          return { days: 3, hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2. Cart Add Functionality
  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const cart = JSON.parse(localStorage.getItem("aljarhee_cart") || "[]");
      const existing = cart.find((item: any) => item.id === product.id);
      
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      
      localStorage.setItem("aljarhee_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      
      showToast(`تم إضافة "${product.name}" إلى السلة بنجاح!`, "success");
    } catch (err) {
      showToast("عذراً، حدث خطأ أثناء إضافة المنتج.", "error");
    }
  };

  // Testimonials list
  const testimonials = [
    {
      id: 1,
      quote: "تعاملت مع محل الجارحي لشراء إنفيرتر تويوتا بريوس مستعمل. الصراحة القطعة كانت نظيفة جداً وكفالة التشغيل أعطتني راحة بال. والأسعار ممتازة جداً مقارنة بالسوق.",
      author: "المهندس أحمد عبيدات",
      role: "عميل من إربد",
      rating: 5,
    },
    {
      id: 2,
      quote: "أفضل متجر لقطع الهايبرد بالملكة، دايماً بلاقي القطع النادرة لسيارتي كيا نيرو عندهم. التوصيل سريع جداً وصلني المساعد لباب البيت في عمان خلال ساعات.",
      author: "أبو يزن الخلايلة",
      role: "عميل من عمان",
      rating: 5,
    },
    {
      id: 3,
      quote: "خدمة فنية ممتازة وشباب فهمانين. ساعدوني أعرف الفيش والقطعة المطابقة لرقم شاصي فورد فيوجن بسرعة عبر واتساب. أنصح بالتعامل معهم بشدة.",
      author: "محمود الطراونة",
      role: "عميل من الكرك",
      rating: 5,
    },
  ];



  // Promotional deals (products with discount)
  const dealsProducts = products.filter((p) => p.originalPrice && p.originalPrice > p.price).slice(0, 2);

  // Dynamic Brands mapping based on imported products
  const getDynamicBrandsList = () => {
    const uniqueBrandNames = Array.from(
      new Set(products.map((p) => p.brand).filter(Boolean))
    );

    if (uniqueBrandNames.length === 0) {
      return BRANDS;
    }

    return uniqueBrandNames.map((bName) => {
      const key = bName.toLowerCase();
      const imageUrl = brandSettings ? brandSettings[key] || "" : "";
      const staticBrand = BRANDS.find((sb) => sb.key === key);

      const logo = imageUrl ? (
        <img src={imageUrl} alt={bName} className="h-20 w-auto object-contain transition-transform group-hover:scale-105 duration-350" />
      ) : staticBrand ? (
        staticBrand.logo
      ) : (
        <span className="text-base font-black text-slate-800 uppercase font-en">{bName}</span>
      );

      return {
        key,
        name: bName,
        logo,
      };
    });
  };

  const dynamicBrands = getDynamicBrandsList();

  return (
    <>
      {/* ─── JSON-LD Structured Data for SEO ─── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                name: "الجارحي لقطع غيار السيارات",
                alternateName: "Aljarhi Car Spare Parts",
                url: SITE_URL,
                logo: {
                  "@type": "ImageObject",
                  url: `${SITE_URL}/assets/images/logo.png`,
                  width: 1080,
                  height: 1080,
                },
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+962-799-123456",
                  contactType: "customer service",
                  availableLanguage: ["Arabic", "English"],
                },
                sameAs: ["https://www.facebook.com/aljarhi", "https://www.instagram.com/aljarhi"],
              },
              {
                "@type": "LocalBusiness",
                "@id": `${SITE_URL}/#localbusiness`,
                name: "الجارحي لقطع غيار السيارات",
                image: `${SITE_URL}/assets/images/logo.png`,
                url: SITE_URL,
                telephone: "+962799123456",
                priceRange: "$$",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "البيادر",
                  addressLocality: "عمان",
                  addressCountry: "JO",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 31.9539,
                  longitude: 35.9106,
                },
                openingHoursSpecification: [
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
                    opens: "08:00",
                    closes: "22:00",
                  },
                ],
              },
              {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                url: SITE_URL,
                name: "الجارحي لقطع غيار السيارات",
                publisher: { "@id": `${SITE_URL}/#organization` },
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${SITE_URL}/store?q={search_term_string}`,
                  },
                  "query-input": "required name=search_term_string",
                },
              },
            ],
          }),
        }}
      />
      <main className="flex-1">
        {/* Full-width Image Slider */}
        <HeroSlider />

        {/* Brands Selector Section (Quick Store Link Shortcut) */}
        <section className="py-20 bg-white border-b border-slate-50">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="text-right">
                <span className="text-[#2d7a1f] text-xs font-black uppercase tracking-wider block mb-1.5 font-en">مساعد الشراء السريع</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">اختر نوع سيارتك للبدء</h2>
                <p className="text-slate-400 text-xs font-bold mt-1">اختر ماركة السيارة المطلوبة لعرض كافة القطع المتوافقة معها فوراً في المتجر</p>
              </div>
              <Link 
                href="/store" 
                className="inline-flex items-center gap-2 border border-slate-200 hover:border-[#ffc72c] hover:bg-[#ffc72c]/5 text-slate-600 hover:text-slate-900 px-6 py-3 rounded-xl font-black text-xs transition-all shadow-sm shrink-0"
              >
                تصفح المتجر بالكامل ←
              </Link>
            </div>

            {/* Brands Selection Cards (Copied from Store Client for visual consistency) */}
            {loading ? (
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 max-w-5xl mx-auto">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white border border-slate-100 rounded-3xl p-8 w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] animate-pulse flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl animate-pulse" />
                    <div className="h-4 bg-slate-100 rounded-md w-1/2" />
                  </div>
                ))}
              </div>
            ) : dynamicBrands.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center gap-4">
                <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                  <Car size={24} />
                </div>
                <h3 className="text-sm font-black text-slate-800">لا توجد ماركات متوفرة حالياً</h3>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 max-w-5xl mx-auto">
                {dynamicBrands.map((brand) => (
                  <button
                    key={brand.key}
                    onClick={() => router.push(`/store?brand=${brand.key}`)}
                    className="group bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-[#2d7a1f] rounded-3xl p-8 w-[150px] h-[150px] sm:w-[190px] sm:h-[190px] flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-[0_12px_45px_rgba(45,122,31,0.06)] hover:-translate-y-1"
                    aria-label={brand.name}
                  >
                    <div className="text-slate-700 group-hover:text-[#2d7a1f] transition-colors duration-300 flex items-center justify-center h-20 w-full overflow-hidden">
                      {brand.logo}
                    </div>
                    <span className="text-xs sm:text-sm font-black text-slate-800 group-hover:text-[#2d7a1f] transition-colors">
                      {brand.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Car Brands scrolling marquee */}
        <BrandsMarquee />

        {/* Video Showcase Section */}
        <section className="pb-16 pt-4 bg-white">
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-black shadow-[0_15px_40px_rgba(0,0,0,0.06)] aspect-video">
              <video
                ref={videoRef}
                src="/assets/WhatsApp-Video-2025-08-12-at-17.05.58.mp4"
                className="w-full h-full object-cover"
                loop
                playsInline
                muted
                autoPlay
                preload="auto"
                controls
              />
            </div>
          </div>
        </section>




        {/* About Us Section */}
        <section className="py-28 bg-slate-50/40 relative overflow-hidden border-b border-slate-100">
          {/* Decorative Background Accents */}
          <div className="absolute top-1/4 left-0 w-80 h-80 bg-brand-green/5 rounded-full filter blur-3xl -translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-brand-green/3 rounded-full filter blur-3xl translate-x-1/2 pointer-events-none" />

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              
              {/* Left Column: Square Showroom Image */}
              <div className="lg:col-span-6 relative flex justify-center">
                <div className="w-full max-w-[500px] aspect-square rounded-[2rem] overflow-hidden border border-slate-200/50 shadow-md">
                  <img 
                    src="/assets/images/about_store_interior.webp" 
                    alt="معرض الجارحي لقطع الغيار" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right Column: Premium Content & Details */}
              <div className="lg:col-span-6 text-right flex flex-col gap-8">
                <div>
                  <span className="text-[#2d7a1f] text-xs font-black uppercase tracking-wider block mb-2.5">
                    من نحن
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-5">
                    الجارحي لقطع غيار السيارات <br />
                    <span className="text-slate-900">الاسم الأول والأكثر ثقة</span>
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium mb-3">
                    نحن في متجر الجارحي نفخر بأننا شريككم الأول والأكثر ثقة لتأمين كافة قطع غيار سيارات الهايبرد والكهرباء والميكانيك في المملكة. نسعى جاهدين لتوفير أعلى معايير الجودة والكفاءة مع كفالة تشغيل حقيقية وأسعار مدروسة لتلبية احتياجاتكم بكفاءة وموثوقية عالية.
                  </p>
                  <p className="text-slate-400 text-xs leading-relaxed font-bold">
                    نحرص على مطابقة القطع المطلوبة لرقم الشاصي بدقة متناهية لتجنب أي أخطاء في الموديلات، بفضل خبراتنا التقنية الطويلة في السوق الأردني.
                  </p>
                </div>

                {/* Grid trust pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                    <CheckCircle2 className="text-[#2d7a1f] shrink-0" size={18} />
                    <span className="text-xs font-black text-slate-700">القطع مطابقة 100% لرقم الشاصي</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                    <CheckCircle2 className="text-[#2d7a1f] shrink-0" size={18} />
                    <span className="text-xs font-black text-slate-700">أسعار تنافسية ومدروسة</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                    <CheckCircle2 className="text-[#2d7a1f] shrink-0" size={18} />
                    <span className="text-xs font-black text-slate-700">توصيل آمن وسريع للمحافظات</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                    <CheckCircle2 className="text-[#2d7a1f] shrink-0" size={18} />
                    <span className="text-xs font-black text-slate-700">فحص شامل للبطاريات والأنظمة</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link 
                    href="/about"
                    className="inline-flex items-center gap-2.5 bg-[#2d7a1f] hover:bg-[#246118] text-white px-9 py-4 rounded-2xl font-black text-xs transition-all shadow-md shadow-[#2d7a1f]/20 hover:-translate-y-0.5 cursor-pointer border-0"
                  >
                    <span>تفاصيل أكثر عن الجارحي</span>
                    <span>←</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>
        {/* Contact Us & Location Map Section */}
        <section className="py-28 bg-[#fbfcfb] border-t border-slate-100">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              
              {/* Right Column: Premium Minimalist Typography & List Info */}
              <div className="lg:col-span-6 text-right flex flex-col gap-9">
                <div>
                  <span className="text-[#2d7a1f] text-xs font-black uppercase tracking-wider block mb-2 font-en">تواصل معنا</span>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-5">
                    تفضل بزيارة معرضنا في عمان <br />
                    <span className="text-slate-900">أو اتصل بخبرائنا مباشرة</span>
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    نحن هنا في منطقة البيادر لمساعدتك في فحص ومطابقة وتحديد قطع الغيار الملائمة لرقم شاصي سيارتك بكل دقة ومصداقية.
                  </p>
                </div>

                {/* Elegant Typography Row List */}
                <div className="flex flex-col gap-6">
                  
                  {/* Item 1 */}
                  <div className="flex gap-4 items-start border-r-2 border-[#2d7a1f]/30 pr-5">
                    <div>
                      <h4 className="text-xs font-black text-slate-450 mb-1">الفرع الأول - البيادر</h4>
                      <p className="text-sm font-black text-slate-800">عمان - البيادر - إشارات الصناعة - بجانب الكابتن</p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex gap-4 items-start border-r-2 border-[#2d7a1f]/30 pr-5">
                    <div>
                      <h4 className="text-xs font-black text-slate-450 mb-1">الاتصال المباشر والواتساب</h4>
                      <p className="text-sm font-black text-slate-800">0789089842</p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex gap-4 items-start border-r-2 border-[#2d7a1f]/30 pr-5">
                    <div>
                      <h4 className="text-xs font-black text-slate-450 mb-1">أوقات استقبال الاستفسارات والمعاينة</h4>
                      <p className="text-sm font-black text-slate-800">السبت - الخميس: 8:30 صباحاً - 7:00 مساءً</p>
                    </div>
                  </div>

                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-[#2d7a1f] hover:bg-[#246118] text-white px-9 py-4 rounded-2xl font-black text-xs transition-all shadow-md shadow-[#2d7a1f]/20 hover:-translate-y-0.5 cursor-pointer border-0"
                  >
                    <span>انتقل إلى صفحة تواصل معنا</span>
                    <span>←</span>
                  </Link>
                </div>
              </div>

              {/* Left Column: Full-size Borderless Map Element */}
              <div className="lg:col-span-6 w-full">
                <div className="w-full aspect-[4/3] sm:aspect-video lg:aspect-square max-h-[480px] rounded-[2rem] overflow-hidden shadow-md border border-slate-200/50 bg-white p-1.5">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3385.556636406542!2d35.8387753!3d31.945792500000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca1621f0175eb%3A0xc7f00f3cba340412!2z2KfZhNis2KfYsdit2Yog2YTZgti32Lkg2LPZitin2LHYp9iqINin2YTZh9in2YrYqNix2K8!5e0!3m2!1sar!2sjo!4v1784403825269!5m2!1sar!2sjo"
                    className="w-full h-full rounded-[1.8rem]"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  ></iframe>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
    </>
  );
}
