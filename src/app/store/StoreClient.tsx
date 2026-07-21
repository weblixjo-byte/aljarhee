"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useProducts } from "../../context/ProductContext";
import { useToast } from "../../context/ToastContext";
import { Product } from "../../data/products";
import {
  Car,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ShoppingCart,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Search,
  SlidersHorizontal,
  X,
  ShoppingBag,
  MessageCircle,
  Settings,
  Layers,
  Sparkle
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

function StoreContent() {
  const { products, categorySettings, brandSettings, modelSettings } = useProducts();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Wizard state variables
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Synchronise with URL parameters if loaded directly
  useEffect(() => {
    const brandParam = searchParams.get("brand");
    const modelParam = searchParams.get("model");
    const yearParam = searchParams.get("year");
    const categoryParam = searchParams.get("category");
    const queryParam = searchParams.get("query");

    if (brandParam) setSelectedBrand(brandParam);
    if (modelParam) setSelectedModel(modelParam);
    if (yearParam) setSelectedYear(yearParam);
    if (categoryParam) setSelectedCategory(categoryParam);
    if (queryParam) setSearchQuery(queryParam);
  }, [searchParams]);

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
      const imageUrl = brandSettings[key] || "";
      const staticBrand = BRANDS.find((sb) => sb.key === key);

      const logo = imageUrl ? (
        <img src={imageUrl} alt={bName} className="h-20 w-auto object-contain transition-transform group-hover:scale-105 duration-300" />
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

  // Dynamic Models and Years mapping based on selected brand
  const getDynamicModelYearCombos = () => {
    if (!selectedBrand) return [];

    const brandProducts = products.filter(
      (p) => p.brand && p.brand.toLowerCase() === selectedBrand.toLowerCase()
    );

    const combos: { model: string; year: string }[] = [];
    const seen = new Set<string>();

    brandProducts.forEach((p) => {
      if (p.model && p.year) {
        const key = `${p.model.trim().toLowerCase()}_${p.year.trim().toLowerCase()}`;
        if (!seen.has(key)) {
          seen.add(key);
          combos.push({
            model: p.model.trim(),
            year: p.year.trim(),
          });
        }
      }
    });

    return combos.sort((a, b) => a.model.localeCompare(b.model));
  };

  const modelYearCombos = getDynamicModelYearCombos();

  // Dynamic categories matching the vehicle
  const getDynamicCategories = () => {
    if (!selectedBrand || !selectedModel || !selectedYear) return [];

    const vehicleProducts = products.filter(
      (p) =>
        p.brand && p.brand.toLowerCase() === selectedBrand.toLowerCase() &&
        p.model && p.model.toLowerCase() === selectedModel.toLowerCase() &&
        p.year && String(p.year).toLowerCase() === String(selectedYear).toLowerCase()
    );

    const uniqueCats = Array.from(
      new Set(vehicleProducts.map((p) => p.categoryName || p.category).filter(Boolean))
    );

    if (uniqueCats.length === 0) {
      return ["قطع بودي", "قطع كهرباء", "قطع ميكانيك"];
    }

    return uniqueCats;
  };

  const dynamicVehicleCategories = getDynamicCategories();

  // Selection handlers
  const handleBrandSelect = (brandKey: string) => {
    setSelectedBrand(brandKey);
    setSelectedModel(null);
    setSelectedYear(null);
    setSelectedCategory(null);
    setCurrentPage(1);
    router.push(`/store?brand=${brandKey}`);
  };

  const handleModelYearSelect = (model: string, year: string) => {
    setSelectedModel(model);
    setSelectedYear(year);
    setSelectedCategory(null);
    setCurrentPage(1);
    router.push(`/store?brand=${selectedBrand}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}`);
  };

  const handleCategorySelect = (catKey: string) => {
    setSelectedCategory(catKey);
    setCurrentPage(1);
    router.push(
      `/store?brand=${selectedBrand}&model=${encodeURIComponent(
        selectedModel || ""
      )}&year=${encodeURIComponent(selectedYear || "")}&category=${encodeURIComponent(catKey)}`
    );
  };

  const resetAll = () => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedYear(null);
    setSelectedCategory(null);
    setSearchQuery("");
    setCurrentPage(1);
    router.push("/store");
  };

  // Add to cart helper
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

  // Filter products matching selections
  const getFilteredProducts = () => {
    return products.filter((product) => {
      const matchesBrand =
        !selectedBrand || selectedBrand === "all"
          ? true
          : product.brand && product.brand.toLowerCase() === selectedBrand.toLowerCase();

      const matchesModel =
        !selectedModel || selectedModel === "all"
          ? true
          : product.model && product.model.toLowerCase() === selectedModel.toLowerCase();

      const matchesYear =
        !selectedYear || selectedYear === "all"
          ? true
          : product.year && String(product.year).toLowerCase() === String(selectedYear).toLowerCase();

      const matchesCategory =
        !selectedCategory || selectedCategory === "all"
          ? true
          : product.category === selectedCategory || product.categoryName === selectedCategory;

      const matchesSearch =
        !searchQuery.trim()
          ? true
          : product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.id.toString().includes(searchQuery) ||
            (product.model && product.model.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesBrand && matchesModel && matchesYear && matchesCategory && matchesSearch;
    });
  };

  const filteredProducts = getFilteredProducts();

  // Pagination parameters
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  const isSearchActive = searchQuery.trim() !== "";

  // Stepper calculations
  let step = 0;
  if (selectedBrand) step = 1;
  if (selectedBrand && selectedModel && selectedYear) step = 2;
  if (selectedBrand && selectedModel && selectedYear && selectedCategory) step = 3;
  if (isSearchActive) step = 3;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-24 pt-[80px]" dir="rtl">
      
      {/* ── World-Class Minimalist Header ── */}
      <div className="bg-white border-b border-slate-100 py-16 text-center mb-10">
        <div className="max-w-4xl mx-auto px-4">
          <span className="inline-flex items-center gap-1 bg-[#2d7a1f]/5 border border-[#2d7a1f]/10 text-[#2d7a1f] font-black text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4">
            <Sparkle size={10} className="fill-[#2d7a1f]" />
            <span>متجر قطع غيار السيارات</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3 text-slate-900 leading-tight">
            كتالوج قطع الغيار الأصلي
          </h1>
          <p className="text-slate-400 text-xs sm:text-xs font-bold leading-relaxed max-w-lg mx-auto mb-8">
            تصفح أو ابحث مباشرة للوصول إلى قطع غيار البودي، الكهرباء، والميكانيك الملائمة لسيارتك بدقة.
          </p>

          {/* Clean SaaS-Style Search Input */}
          <div className="max-w-md mx-auto relative px-4">
            <input
              type="text"
              placeholder="ابحث بالاسم، الرقم، أو الموديل (مثال: حساس، بريوس...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/50 text-slate-800 rounded-2xl py-3.5 pr-11 pl-4 text-xs font-bold border border-slate-200/80 focus:border-[#2d7a1f] focus:bg-white focus:ring-4 focus:ring-[#2d7a1f]/5 shadow-xs font-sans outline-none text-right placeholder-slate-400 transition-all duration-300"
            />
            <Search className="absolute top-1/2 right-7.5 -translate-y-1/2 text-slate-400" size={16} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute top-1/2 left-7.5 -translate-y-1/2 text-slate-400 hover:text-slate-650 bg-slate-200/50 rounded-lg p-1 border-0 cursor-pointer transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Modern Dynamic Stepper (Open Layout) ── */}
        {!isSearchActive && (
          <div className="max-w-2xl mx-auto flex items-center justify-between py-6 mb-12 relative select-none" dir="rtl">
            {/* Connecting Line Background */}
            <div className="absolute top-[21px] left-8 right-8 h-0.5 bg-slate-200/70 -z-10 rounded-full" />
            {/* Connecting Line Progress */}
            <div 
              className="absolute top-[21px] right-8 h-0.5 bg-[#2d7a1f] -z-10 rounded-full transition-all duration-500" 
              style={{ width: `${(step / 3) * 100}%`, left: 'auto' }}
            />
            
            {/* Steps */}
            {[
              { index: 0, label: "نوع السيارة" },
              { index: 1, label: "الموديل والسنة" },
              { index: 2, label: "القسم الرئيسي" },
              { index: 3, label: "تصفح القطع" }
            ].map((s) => {
              const isCompleted = step > s.index;
              const isActive = step === s.index;
              return (
                <div key={s.index} className="flex flex-col items-center gap-2.5 text-center">
                  <button
                    type="button"
                    disabled={s.index > step && !isCompleted}
                    onClick={() => {
                      if (s.index === 0) resetAll();
                      else if (s.index === 1 && selectedBrand) { setSelectedModel(null); setSelectedYear(null); setSelectedCategory(null); }
                      else if (s.index === 2 && selectedModel) { setSelectedCategory(null); }
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black transition-all border-2 cursor-pointer outline-none shadow-xs ${
                      isActive
                        ? "bg-[#2d7a1f] border-[#2d7a1f] text-white ring-4 ring-[#2d7a1f]/10 scale-110"
                        : isCompleted
                          ? "bg-[#2d7a1f]/10 border-[#2d7a1f] text-[#2d7a1f]"
                          : "bg-white border-slate-200 text-slate-400 disabled:cursor-not-allowed"
                    }`}
                  >
                    {isCompleted ? "✓" : s.index + 1}
                  </button>
                  <span className={`text-[10px] font-black tracking-wide ${isActive ? "text-[#2d7a1f]" : isCompleted ? "text-slate-800" : "text-slate-400"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Step 0: Choose Brand (Large Cards Layout) ── */}
        {step === 0 && (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-xs text-center">
            <h2 className="text-slate-800 text-base sm:text-lg font-black tracking-tight mb-8">
              اختر ماركة السيارة للبدء
            </h2>
            
            {dynamicBrands.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center gap-4">
                <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                  <ShoppingBag size={24} />
                </div>
                <h3 className="text-sm font-black text-slate-800">الموقع لا يحتوي على منتجات حالياً</h3>
                <p className="text-slate-400 text-xs font-bold max-w-xs leading-relaxed">
                  يرجى رفع ملف إكسيل للمنتجات من لوحة إدارة الموقع للبدء بعرض قطع الغيار والسيارات للزبائن.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 max-w-5xl mx-auto mb-6">
                {dynamicBrands.map((brand) => (
                  <button
                    key={brand.key}
                    onClick={() => handleBrandSelect(brand.key)}
                    className="group bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-[#2d7a1f] rounded-3xl p-8 w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] flex flex-col items-center justify-center gap-5 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-[0_12px_45px_rgba(45,122,31,0.06)] hover:-translate-y-1"
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

            {dynamicBrands.length > 0 && (
              <div className="mt-10 border-t border-slate-100 pt-8">
                <button
                  onClick={() => { setSelectedBrand("all"); setSelectedModel("all"); setSelectedYear("all"); setSelectedCategory("all"); }}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-black text-xs px-8 py-3.5 rounded-xl border border-slate-200/50 cursor-pointer transition-colors shadow-xs"
                >
                  تصفح جميع قطع الغيار المتاحة بالموقع مباشرة
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Step 1: Choose Model & Year (Distinct Combos with distinct images) ── */}
        {step === 1 && selectedBrand && (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-8">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">الماركة المختارة</span>
                <span className="text-xs font-black text-[#2d7a1f]">
                  {dynamicBrands.find((b) => b.key === selectedBrand)?.name || selectedBrand.toUpperCase()}
                </span>
              </div>
              <button
                onClick={resetAll}
                className="flex items-center gap-1 text-slate-400 hover:text-[#2d7a1f] font-bold text-xs bg-slate-50 px-3.5 py-2 rounded-xl border-0 cursor-pointer transition-all"
              >
                <span>رجوع للماركات</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <h2 className="text-base font-black text-slate-900 mb-6 pr-1">
              اختر موديل سيارتك وسنة الصنع:
            </h2>

            {modelYearCombos.length === 0 ? (
              <div className="text-center py-10 text-slate-400 font-bold text-xs">
                لا توجد موديلات مدرجة حالياً لهذه السيارة بجدول البيانات، اضغط رجوع أو تصفح الأقسام مباشرة.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {modelYearCombos.map((combo) => {
                  const comboKey = `${combo.model.toLowerCase()}_${combo.year.toLowerCase()}`;
                  const imageUrl = modelSettings[comboKey] || "/assets/images/placeholder-product.png";
                  return (
                    <button
                      key={`${combo.model}_${combo.year}`}
                      onClick={() => handleModelYearSelect(combo.model, combo.year)}
                      className="group bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-[#2d7a1f] rounded-3xl overflow-hidden p-4 flex flex-col items-center justify-between gap-4 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-[0_12px_40px_rgba(45,122,31,0.12)] hover:-translate-y-1.5 text-right w-full min-h-[220px]"
                    >
                      {/* Model Image container */}
                      <div className="relative w-full aspect-[4/3] rounded-2xl bg-slate-50 overflow-hidden flex items-center justify-center">
                        <img
                          src={imageUrl}
                          alt={combo.model}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = "/assets/images/placeholder-product.png";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      
                      {/* Model Details */}
                      <div className="w-full flex items-center justify-between mt-2 border-t border-slate-50 pt-3">
                        <div className="flex flex-col gap-0.5 text-right">
                          <span className="text-xs font-black text-slate-800 group-hover:text-[#2d7a1f] transition-colors">
                            {combo.model}
                          </span>
                          <span className="text-[10px] font-black text-slate-400 font-en">
                            موديل {combo.year}
                          </span>
                        </div>
                        <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#2d7a1f]/10 text-slate-400 group-hover:text-[#2d7a1f] flex items-center justify-center transition-all">
                          ←
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Choose Category ── */}
        {step === 2 && selectedBrand && selectedModel && selectedYear && (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-xs text-center">
            
            {/* Context breadcrumb */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-8 text-right">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">السيارة المحددة</span>
                <span className="text-xs font-black text-[#2d7a1f]">
                  {dynamicBrands.find((b) => b.key === selectedBrand)?.name || selectedBrand.toUpperCase()} · {selectedModel} {selectedYear}
                </span>
              </div>
              <button
                onClick={() => { setSelectedModel(null); setSelectedYear(null); }}
                className="flex items-center gap-1 text-slate-400 hover:text-[#2d7a1f] font-bold text-xs bg-slate-50 px-3.5 py-2 rounded-xl border-0 cursor-pointer transition-all"
              >
                <span>تغيير الموديل</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <h2 className="text-slate-800 text-base sm:text-lg font-black tracking-tight mb-8">
              اختر قسم قطع الغيار المطلوب
            </h2>

            {/* Redesigned Premium Dynamic Category Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-6" dir="rtl">
              {dynamicVehicleCategories.map((catName) => {
                const imageUrl = categorySettings[catName] || "/assets/images/placeholder-product.png";
                return (
                  <button
                    key={catName}
                    onClick={() => handleCategorySelect(catName)}
                    className="group bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-[#2d7a1f] rounded-3xl overflow-hidden p-4 flex flex-col items-center justify-between gap-4 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-[0_12px_40px_rgba(45,122,31,0.12)] hover:-translate-y-1.5 text-right w-full min-h-[200px]"
                  >
                    {/* Category Image container */}
                    <div className="relative w-full aspect-[4/3] rounded-2xl bg-slate-50 overflow-hidden flex items-center justify-center">
                      <img
                        src={imageUrl}
                        alt={catName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = "/assets/images/placeholder-product.png";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Category Label */}
                    <div className="w-full flex items-center justify-between mt-2 border-t border-slate-50 pt-3">
                      <span className="text-xs font-black text-slate-800 group-hover:text-[#2d7a1f] transition-colors pr-1">
                        {catName}
                      </span>
                      <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#2d7a1f]/10 text-slate-400 group-hover:text-[#2d7a1f] flex items-center justify-center transition-all">
                        ←
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 3: Redesigned Catalog Grid with Sticky Sidebar ── */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in">
            
            {/* Sticky Sidebar Filter Panel */}
            <div className="lg:col-span-1 flex flex-col gap-6 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs text-right self-start sticky top-[100px] z-10">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xs font-black text-slate-800 flex items-center gap-2">
                  <Settings size={14} className="text-[#2d7a1f]" />
                  <span>تصفية واختيار النتائج</span>
                </h3>
              </div>

              {/* Active Selection Details */}
              <div className="flex flex-col gap-5">
                {/* Brand Selection */}
                {selectedBrand && selectedBrand !== "all" && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">الماركة</span>
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-xs font-black text-slate-700">
                      <span>{dynamicBrands.find((b) => b.key === selectedBrand)?.name || selectedBrand.toUpperCase()}</span>
                      <button
                        onClick={() => { setSelectedBrand(null); setSelectedModel(null); setSelectedYear(null); setSelectedCategory(null); }}
                        className="text-slate-400 hover:text-red-500 bg-transparent border-0 cursor-pointer p-0.5 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Model & Year Selection */}
                {selectedModel && selectedModel !== "all" && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">الموديل والسنة</span>
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-xs font-black text-slate-700">
                      <span>{selectedModel} {selectedYear}</span>
                      <button
                        onClick={() => { setSelectedModel(null); setSelectedYear(null); setSelectedCategory(null); }}
                        className="text-slate-400 hover:text-red-500 bg-transparent border-0 cursor-pointer p-0.5 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Category Selection */}
                {selectedCategory && selectedCategory !== "all" && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">القسم</span>
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl text-xs font-black text-[#2d7a1f]">
                      <span>{selectedCategory}</span>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="text-emerald-450 hover:text-red-500 bg-transparent border-0 cursor-pointer p-0.5 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Search Text */}
                {isSearchActive && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">نص البحث</span>
                    <div className="flex items-center justify-between bg-amber-50 border border-amber-100 px-3 py-2 rounded-xl text-xs font-black text-amber-700">
                      <span className="truncate">"{searchQuery}"</span>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-amber-500 hover:text-red-500 bg-transparent border-0 cursor-pointer p-0.5 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Reset Trail trigger */}
              <button
                onClick={resetAll}
                className="w-full flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-650 font-black text-xs py-3.5 rounded-xl border-0 cursor-pointer transition-colors mt-2"
              >
                <RotateCcw size={12} />
                <span>إعادة تصفية جديدة</span>
              </button>
            </div>

            {/* Catalog Grid Area */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              
              {/* Selections / Info Bar */}
              <div className="flex items-center justify-between bg-white border border-slate-100 px-5 py-4 rounded-2xl shadow-xs text-right">
                <div className="text-[10px] text-slate-400 font-bold">
                  تم العثور على <span className="text-slate-800 font-black font-en text-xs">{filteredProducts.length}</span> قطعة غيار متوافقة
                </div>
                <button
                  onClick={resetAll}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-500 font-black text-[10px] px-3.5 py-1.5 rounded-xl border-0 cursor-pointer transition-colors"
                >
                  تغيير السيارة المختارة
                </button>
              </div>

              {/* Products list or Empty status */}
              {paginatedProducts.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-450 flex items-center justify-center mb-2">
                    <ShoppingBag size={28} />
                  </div>
                  <h3 className="text-base font-black text-slate-800">لا توجد قطع غيار مطابقة حالياً</h3>
                  <p className="text-slate-400 text-xs font-bold max-w-sm leading-relaxed">
                    لم نجد أي قطع غيار تناسب هذا الاختيار في مستودعنا حالياً. اضغط للرجوع أو اطلب القطعة مباشرة عبر واتساب.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={resetAll}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-3 rounded-xl font-black text-xs transition-colors cursor-pointer border-0"
                    >
                      رجوع للمتجر
                    </button>
                    <a
                      href={`https://wa.me/962789089842?text=${encodeURIComponent(
                        `أبحث عن قطعة غيار غير متوفرة لسيارة ${selectedModel || ""} ${selectedYear || ""} قسم ${selectedCategory || ""}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] hover:bg-[#1ebd59] text-white px-6 py-3 rounded-xl font-black text-xs transition-colors cursor-pointer border-0 decoration-none flex items-center gap-1.5 shadow-sm"
                    >
                      <MessageCircle size={14} fill="currentColor" />
                      <span>طلب مباشر واتساب</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    {paginatedProducts.map((product) => {
                      const hasDiscount = product.originalPrice && product.originalPrice > product.price;
                      const discountPct = hasDiscount
                        ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
                        : 0;

                      return (
                        <div
                          key={product.id}
                          className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-slate-250 hover:shadow-[0_16px_40px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 flex flex-col p-4 text-right"
                        >
                          {/* Image box */}
                          <Link
                            href={`/store/${product.id}`}
                            className="relative w-full bg-slate-50/70 rounded-2xl flex items-center justify-center overflow-hidden mb-4 aspect-square cursor-pointer"
                          >
                            <img
                              src={product.image.startsWith("assets") ? `/${product.image}` : product.image}
                              alt={product.name}
                              className="w-[85%] h-[85%] object-contain group-hover:scale-103 transition-transform duration-500"
                              onError={(e) => {
                                e.currentTarget.src = "/assets/images/placeholder-product.png";
                              }}
                            />
                            {hasDiscount && (
                              <span className="absolute top-3 right-3 bg-red-500 text-white font-black text-[0.62rem] px-2 py-0.5 rounded-lg z-10">
                                خصم {discountPct}%
                              </span>
                            )}
                            {product.conditionText && (
                              <span className="absolute top-3 left-3 bg-white text-slate-600 border border-slate-200/50 font-black text-[0.62rem] px-2 py-0.5 rounded-lg z-10">
                                {product.conditionText}
                              </span>
                            )}
                          </Link>

                          {/* Content block */}
                          <div className="flex flex-col flex-1">
                            <span className="text-[0.62rem] font-black text-slate-400 uppercase tracking-wider mb-1 font-en">
                              {product.brand ? product.brand.toUpperCase() : "SPARE PARTS"}
                            </span>
                            <Link href={`/store/${product.id}`}>
                              <h3 className="text-xs sm:text-sm font-black text-slate-800 leading-snug line-clamp-2 mb-1 hover:text-[#2d7a1f] transition-colors cursor-pointer">
                                {product.name}
                              </h3>
                            </Link>
                            <p className="text-[0.68rem] font-bold text-slate-400 uppercase font-en mb-4">
                              {product.model} · {product.year}
                            </p>

                            {/* Pricing area */}
                            <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-slate-50 mt-auto">
                              <div className="flex flex-col">
                                {product.price > 0 ? (
                                  <>
                                    {hasDiscount && (
                                      <span className="text-[0.68rem] font-bold text-slate-400 line-through">
                                        {product.originalPrice} د.أ
                                      </span>
                                    )}
                                    <span className="font-en text-sm sm:text-base font-black text-slate-900">
                                      {product.price}{" "}
                                      <span className="text-xs font-bold text-slate-500">د.أ</span>
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-xs font-black text-[#2d7a1f]">طلب السعر</span>
                                )}
                              </div>

                              <button
                                onClick={(e) => handleAddToCart(product, e)}
                                className="bg-slate-50 hover:bg-[#2d7a1f] text-slate-500 hover:text-white p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center shrink-0 border-0 cursor-pointer"
                                title="إضافة للسلة"
                                aria-label="إضافة المنتج للسلة"
                              >
                                <ShoppingCart size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Ellipsis Pagination */}
                  {totalPages > 1 && (() => {
                    const delta = 2;
                    const pages: (number | "...")[] = [];
                    const left = Math.max(2, currentPage - delta);
                    const right = Math.min(totalPages - 1, currentPage + delta);

                    pages.push(1);
                    if (left > 2) pages.push("...");
                    for (let i = left; i <= right; i++) pages.push(i);
                    if (right < totalPages - 1) pages.push("...");
                    if (totalPages > 1) pages.push(totalPages);

                    return (
                      <div className="flex items-center justify-center gap-1.5 mt-10 pt-5 border-t border-slate-100 font-en flex-wrap">
                        <button
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="w-9 h-9 rounded-lg font-black text-xs transition-all border border-slate-200 cursor-pointer flex items-center justify-center bg-white text-slate-650 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="الصفحة السابقة"
                        >
                          ‹
                        </button>

                        {pages.map((page, i) =>
                          page === "..." ? (
                            <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-xs font-bold select-none font-sans">
                              …
                            </span>
                          ) : (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page as number)}
                              className={`w-9 h-9 rounded-lg font-black text-xs transition-all border-0 cursor-pointer flex items-center justify-center ${
                                currentPage === page
                                  ? "bg-[#2d7a1f] text-white shadow-md shadow-[#2d7a1f]/20"
                                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                              }`}
                              aria-label={`صفحة ${page}`}
                              aria-current={currentPage === page ? "page" : undefined}
                            >
                              {page}
                            </button>
                          )
                        )}

                        <button
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="w-9 h-9 rounded-lg font-black text-xs transition-all border border-slate-200 cursor-pointer flex items-center justify-center bg-white text-slate-650 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="الصفحة التالية"
                        >
                          ›
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function StoreClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white font-sans">
          <div className="text-slate-450 font-black text-sm">جاري تحميل تفاصيل المتجر...</div>
        </div>
      }
    >
      <StoreContent />
    </Suspense>
  );
}
