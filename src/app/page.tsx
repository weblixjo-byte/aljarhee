"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import HeroSlider from "../components/HeroSlider";
import SearchWidget from "../components/SearchWidget";
import BrandsMarquee from "../components/BrandsMarquee";
import { useToast } from "../context/ToastContext";
import { productsData, Product, getProductCategory } from "../data/products";
import { useProducts } from "../context/ProductContext";
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

export default function Home() {
  const { showToast } = useToast();
  const { products } = useProducts();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [selectedHomeCategory, setSelectedHomeCategory] = useState("all");
  const [randomHomeProducts, setRandomHomeProducts] = useState<Product[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Shuffle and set 6 random products for the "All" category tab
  useEffect(() => {
    if (products.length > 0 && randomHomeProducts.length === 0) {
      setRandomHomeProducts([...products].sort(() => 0.5 - Math.random()).slice(0, 6));
    }
  }, [products, randomHomeProducts.length]);

  // Auto-play video with sound when it enters viewport, pause when scrolled away
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Unmute and play
            video.muted = false;
            video.play().catch((err) => {
              console.log("Autoplay with sound blocked, playing muted as fallback:", err);
              // Fallback: play muted if browser blocks sound auto-play
              video.muted = true;
              video.play().catch((e) => console.error("Error playing video:", e));
            });
          } else {
            // Pause when scrolled out of view
            video.pause();
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the video is visible
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

  const categories = [
    { id: "all", name: "الكل" },
    { id: "mechanical", name: "محركات" },
    { id: "body", name: "الهيكل والبودي" },
    { id: "lights", name: "اضوية" },
  ];

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
                "@id": "https://aljarhi-parts.com/#organization",
                name: "الجارحي لقطع غيار السيارات",
                alternateName: "Aljarhi Car Spare Parts",
                url: "https://aljarhi-parts.com",
                logo: {
                  "@type": "ImageObject",
                  url: "https://aljarhi-parts.com/assets/images/logo.png",
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
                "@id": "https://aljarhi-parts.com/#localbusiness",
                name: "الجارحي لقطع غيار السيارات",
                image: "https://aljarhi-parts.com/assets/images/logo.png",
                url: "https://aljarhi-parts.com",
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
                "@id": "https://aljarhi-parts.com/#website",
                url: "https://aljarhi-parts.com",
                name: "الجارحي لقطع غيار السيارات",
                publisher: { "@id": "https://aljarhi-parts.com/#organization" },
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://aljarhi-parts.com/store?q={search_term_string}",
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

        {/* Categories Section (Interactive Catalog) */}
        <section className="py-20 bg-white border-b border-slate-50">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="text-right">
                <span className="text-brand-green text-xs font-black uppercase tracking-wider block mb-1.5 font-en">أقسام المتجر</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">تصفح القطع حسب القسم</h2>
                <p className="text-slate-400 text-xs font-bold mt-1">اختر التصنيف المطلوب لعرض المنتجات المتوفرة فوراً</p>
              </div>
              <Link 
                href="/store" 
                className="inline-flex items-center gap-2 border border-slate-200 hover:border-brand-green hover:bg-brand-green/5 text-slate-600 hover:text-brand-green px-6 py-3 rounded-xl font-black text-xs transition-all shadow-sm shrink-0"
              >
                تصفح المتجر بالكامل ←
              </Link>
            </div>

            {/* Categories Tab Switcher */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-10 scrollbar-none justify-start md:justify-center w-full">
              {categories.map((cat) => {
                const isActive = cat.id === selectedHomeCategory;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedHomeCategory(cat.id);
                      if (cat.id === "all") {
                        setRandomHomeProducts([...products].sort(() => 0.5 - Math.random()).slice(0, 6));
                      }
                    }}
                    className={`px-7 py-3 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer border-0 shadow-xs ${
                      isActive
                        ? "bg-[#2d7a1f] text-white shadow-md shadow-[#2d7a1f]/10 scale-102"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-750"
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Category Products Grid (Exact 6 products) */}
            {(() => {
              const filteredList = selectedHomeCategory === "all"
                ? randomHomeProducts
                : products.filter(p => getProductCategory(p) === selectedHomeCategory).slice(0, 6);

              if (filteredList.length > 0) {
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredList.map((product) => {
                      const hasDiscount = product.originalPrice && product.originalPrice > product.price;
                      const discountPct = hasDiscount 
                        ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
                        : 0;

                      return (
                        <Link
                          key={product.id}
                          href={`/store/${product.id}`}
                          className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-slate-200/80 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between p-4 animate-fade-in text-right cursor-pointer"
                        >
                          {/* Image Area */}
                          <div className="relative w-full aspect-square bg-slate-50/50 rounded-2xl flex items-center justify-center overflow-hidden p-2">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-4/5 h-4/5 object-contain group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.currentTarget.src = "/assets/images/placeholder-product.png";
                              }}
                            />
                            
                            {/* Top Action Tags */}
                            {hasDiscount && (
                              <span className="absolute top-3 right-3 bg-red-550 text-red-600 font-bold text-[0.62rem] px-2 py-0.5 rounded-md shadow-xs z-10 border border-red-100 bg-red-50">
                                {discountPct}% خصم
                              </span>
                            )}
                            
                            {product.conditionText && (
                              <span className="absolute top-3 left-3 bg-slate-100 text-slate-600 font-bold text-[0.62rem] px-2 py-0.5 rounded-md z-10">
                                {product.conditionText}
                              </span>
                            )}
                          </div>

                          {/* Content Details */}
                          <div className="pt-4 flex flex-col flex-1 text-right">
                            {/* Brand Label */}
                            <span className="text-[0.62rem] font-bold text-slate-400 uppercase tracking-wider mb-1 font-en">
                              {product.brand}
                            </span>
                            
                            {/* Title */}
                            <h3 className="text-[0.88rem] font-black text-slate-800 leading-snug line-clamp-2 min-h-[2.4rem] hover:text-[#2d7a1f] transition-colors">
                              {product.name}
                            </h3>

                            {/* Model & Year Details */}
                            <p className="text-[0.65rem] font-bold text-slate-400 tracking-wide uppercase font-en mt-1">
                              {product.model} · {product.year}
                            </p>

                            {/* Pricing & Add to Cart */}
                            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-50 mt-auto">
                                {product.price > 0 ? (
                                  <>
                                    {hasDiscount && (
                                      <span className="text-[0.65rem] font-bold text-slate-400 line-through mb-0.5">
                                        {product.originalPrice} د.أ
                                      </span>
                                    )}
                                    <span className="font-en text-base font-black text-slate-900">
                                      {product.price} <span className="text-[0.65rem] font-bold text-slate-500 mr-0.5">د.أ</span>
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-xs font-black text-[#2d7a1f]">
                                    طلب السعر
                                  </span>
                                )}

                              <button
                                onClick={(e) => handleAddToCart(product, e)}
                                className="bg-[#2d7a1f] hover:bg-[#246118] text-white p-2.5 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer border-0"
                                title="أضف إلى السلة"
                              >
                                <ShoppingCart size={15} />
                              </button>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                );
              } else {
                return (
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-16 text-center flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                      <ShoppingCart size={22} />
                    </div>
                    <h3 className="text-sm font-black text-slate-850">لا توجد قطع غيار متوفرة حالياً</h3>
                    <p className="text-slate-400 text-xs font-bold max-w-sm">
                      لم نجد أي قطع غيار مضافة في هذا القسم حالياً. يرجى التصفح لاحقاً.
                    </p>
                  </div>
                );
              }
            })()}

            {/* View All Button below */}
            <div className="flex justify-center mt-12">
              <Link
                href={selectedHomeCategory === "all" ? "/store" : `/store?category=${selectedHomeCategory}`}
                className="inline-flex items-center gap-2 bg-[#2d7a1f] hover:bg-[#246118] text-white px-8 py-3.5 rounded-2xl font-black text-xs transition-all shadow-md shadow-[#2d7a1f]/20 hover:-translate-y-0.5 cursor-pointer border-0"
              >
                <span>
                  {selectedHomeCategory === "all" 
                    ? "عرض كل منتجات المتجر" 
                    : `عرض الكل في قسم ${categories.find(c => c.id === selectedHomeCategory)?.name || ""}`}
                </span>
                <span>←</span>
              </Link>
            </div>

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
                    نحن هنا في منطقة البيادر والقويسمة لمساعدتك في فحص ومطابقة وتحديد قطع الغيار الملائمة لرقم شاصي سيارتك بكل دقة ومصداقية.
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
