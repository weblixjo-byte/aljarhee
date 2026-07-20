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
} from "lucide-react";

// List of available brands with premium vector SVGs
const BRANDS = [
  {
    key: "toyota",
    name: "تويوتا",
    logo: (
      <svg viewBox="0 0 100 65" className="w-20 h-auto transition-transform group-hover:scale-105 duration-300 fill-current" aria-hidden="true">
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
      <svg viewBox="0 0 120 80" className="w-20 h-auto transition-transform group-hover:scale-105 duration-300" fill="none" stroke="currentColor" strokeWidth="5" aria-hidden="true">
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
      <svg viewBox="0 0 100 100" className="w-18 h-auto transition-transform group-hover:scale-105 duration-300 fill-current" aria-hidden="true">
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
      <svg viewBox="0 0 120 70" className="w-22 h-auto transition-transform group-hover:scale-105 duration-300" fill="none" stroke="currentColor" strokeWidth="4" aria-hidden="true">
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
      <svg viewBox="0 0 120 80" className="w-22 h-auto transition-transform group-hover:scale-105 duration-300" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <rect x="48" y="10" width="24" height="42" rx="10" />
        <line x1="60" y1="15" x2="60" y2="47" strokeWidth="2.5" />
        <line x1="52" y1="31" x2="68" y2="31" strokeWidth="2.5" />
        <path d="M 60 21 C 57 27 54 31 54 31 C 54 31 57 35 60 41 C 63 35 66 31 66 31 C 66 31 63 27 60 21 Z" fill="currentColor" stroke="none" />
        <text x="60" y="70" fontFamily="var(--font-outfit), sans-serif" fontSize="9" fontWeight="950" letterSpacing="5" textAnchor="middle" fill="currentColor" stroke="none">LINCOLN</text>
      </svg>
    )
  }
];

// Available categories matching the green selector bars in the user mockup
const CATEGORIES = [
  { key: "body", label: "قطع بودي" },
  { key: "electrical", label: "قطع كهرباء" },
  { key: "mechanical", label: "قطع ميكانيك" },
];

function StoreContent() {
  const { products } = useProducts();
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
    const catParam = searchParams.get("category");
    const qParam = searchParams.get("q");

    if (brandParam && BRANDS.some(b => b.key === brandParam)) {
      setSelectedBrand(brandParam);
    }
    if (modelParam) setSelectedModel(decodeURIComponent(modelParam));
    if (yearParam) setSelectedYear(decodeURIComponent(yearParam));
    if (catParam && CATEGORIES.some(c => c.key === catParam)) {
      setSelectedCategory(catParam);
    }
    if (qParam) setSearchQuery(decodeURIComponent(qParam));
  }, [searchParams]);

  // Reset page pagination on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrand, selectedModel, selectedYear, selectedCategory, searchQuery]);

  // Handle resetting the wizard
  const resetAll = () => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedYear(null);
    setSelectedCategory(null);
    setSearchQuery("");
    router.push("/store");
  };

  const handleBrandSelect = (brandKey: string) => {
    setSelectedBrand(brandKey);
    setSelectedModel(null);
    setSelectedYear(null);
    setSelectedCategory(null);
    router.push(`/store?brand=${brandKey}`);
  };

  const handleModelYearSelect = (model: string, year: string) => {
    setSelectedModel(model);
    setSelectedYear(year);
    setSelectedCategory(null);
    router.push(`/store?brand=${selectedBrand}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}`);
  };

  const handleCategorySelect = (catKey: string) => {
    setSelectedCategory(catKey);
    router.push(`/store?brand=${selectedBrand}&model=${encodeURIComponent(selectedModel || "")}&year=${encodeURIComponent(selectedYear || "")}&category=${catKey}`);
  };

  // Add product to Cart context
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
      showToast("عذراً، حدث خطأ أثناء إضافة المنتج للمشتريات.", "error");
    }
  };

  // Extract unique model + year combinations from active products dynamically
  const getDynamicModelYearCombos = () => {
    if (!selectedBrand) return [];
    
    // Filter database products matching this brand
    const brandProducts = products.filter(
      p => p.brand && p.brand.toLowerCase() === selectedBrand.toLowerCase()
    );

    // Group by unique combinations of model and year values
    const uniqueCombosMap: Record<string, { model: string; year: string }> = {};
    brandProducts.forEach(p => {
      const modelStr = (p.model || "").trim();
      const yearStr = (p.year || "").trim();
      if (modelStr && yearStr) {
        const key = `${modelStr}_${yearStr}`;
        uniqueCombosMap[key] = { model: modelStr, year: yearStr };
      }
    });

    // Convert map to list and sort
    const list = Object.values(uniqueCombosMap);
    list.sort((a, b) => {
      const modelCompare = a.model.localeCompare(b.model, "ar");
      if (modelCompare !== 0) return modelCompare;
      return b.year.localeCompare(a.year); // Latest years first
    });

    return list;
  };

  const modelYearCombos = getDynamicModelYearCombos();

  // Filter products matching current wizard selections
  const getFilteredProducts = () => {
    return products.filter(product => {
      // 1. Brand match
      const matchesBrand = !selectedBrand 
        ? true 
        : (product.brand && product.brand.toLowerCase() === selectedBrand.toLowerCase());

      // 2. Model match
      const matchesModel = !selectedModel
        ? true
        : (product.model && product.model.toLowerCase() === selectedModel.toLowerCase());

      // 3. Year match
      const matchesYear = !selectedYear
        ? true
        : (product.year && String(product.year).toLowerCase() === String(selectedYear).toLowerCase());

      // 4. Category match
      const matchesCategory = !selectedCategory
        ? true
        : (product.category === selectedCategory);

      // 5. Search query match (broad title match)
      const matchesSearch = !searchQuery.trim()
        ? true
        : (
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.id.toString().includes(searchQuery) ||
            (product.model && product.model.toLowerCase().includes(searchQuery.toLowerCase()))
          );

      return matchesBrand && matchesModel && matchesYear && matchesCategory && matchesSearch;
    });
  };

  const filteredProducts = getFilteredProducts();

  // Pagination calculations
  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // Determine current step index
  // If search query is typed, we bypass the wizard and display results immediately!
  const isSearchActive = searchQuery.trim() !== "";
  
  let step = 0;
  if (selectedBrand) step = 1;
  if (selectedBrand && selectedModel && selectedYear) step = 2;
  if (selectedBrand && selectedModel && selectedYear && selectedCategory) step = 3;
  if (isSearchActive) step = 3; // Force products view directly

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 pt-[80px]" dir="rtl">
      
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-100 py-10 shadow-xs mb-10 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
            كتالوج قطع غيار السيارات الأصلي
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-bold leading-relaxed max-w-lg mx-auto">
            أختر سيارتك وموديلها للوصول لقطع الغيار المطابقة والملائمة لرقم شاصي سيارتك بدقة 100%، وأضفها مباشرة لسلة المشتريات.
          </p>

          {/* Quick Search Input */}
          <div className="mt-8 max-w-md mx-auto relative px-4">
            <input
              type="text"
              placeholder="ابحث مباشرة باسم القطعة أو موديل السيارة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 rounded-2xl py-3.5 pr-11 pl-4 text-xs font-bold border border-slate-200 focus:border-[#2d7a1f] focus:bg-white shadow-sm font-sans outline-none text-right placeholder-slate-400"
            />
            <Search className="absolute top-1/2 right-7.5 -translate-y-1/2 text-slate-400" size={16} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute top-1/2 left-7.5 -translate-y-1/2 text-slate-400 hover:text-slate-650 bg-slate-100/80 hover:bg-slate-200/50 rounded-lg p-1 border-0 cursor-pointer transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4">
        
        {/* ── Wizard Progress Trail (Only visible when not performing global search) ── */}
        {!isSearchActive && (
          <div className="flex items-center justify-between bg-white border border-slate-100 rounded-2xl p-4 mb-8 shadow-xs overflow-x-auto gap-3 text-xs font-bold text-slate-400">
            <button 
              onClick={resetAll}
              className={`flex items-center gap-1.5 border-0 bg-transparent cursor-pointer font-bold ${step >= 0 ? "text-[#2d7a1f] font-black" : ""}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 0 ? "bg-[#2d7a1f] text-white" : "bg-slate-100 text-slate-500"}`}>١</span>
              <span>السيارة</span>
            </button>
            
            <span className="text-slate-300">←</span>
            
            <button 
              onClick={() => { if (selectedBrand) { setSelectedModel(null); setSelectedYear(null); setSelectedCategory(null); } }}
              disabled={!selectedBrand}
              className={`flex items-center gap-1.5 border-0 bg-transparent cursor-pointer font-bold disabled:opacity-50 disabled:cursor-not-allowed ${step >= 1 ? "text-[#2d7a1f] font-black" : ""}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? "bg-[#2d7a1f] text-white" : "bg-slate-100 text-slate-500"}`}>٢</span>
              <span>الموديل والسنة</span>
            </button>
            
            <span className="text-slate-300">←</span>
            
            <button 
              onClick={() => { if (selectedModel) { setSelectedCategory(null); } }}
              disabled={!selectedModel}
              className={`flex items-center gap-1.5 border-0 bg-transparent cursor-pointer font-bold disabled:opacity-50 disabled:cursor-not-allowed ${step >= 2 ? "text-[#2d7a1f] font-black" : ""}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? "bg-[#2d7a1f] text-white" : "bg-slate-100 text-slate-500"}`}>٣</span>
              <span>القسم الرئيسي</span>
            </button>
            
            <span className="text-slate-300">←</span>
            
            <div className={`flex items-center gap-1.5 font-bold ${step >= 3 ? "text-[#2d7a1f] font-black" : ""}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? "bg-[#2d7a1f] text-white" : "bg-slate-100 text-slate-500"}`}>٤</span>
              <span>تصفح القطع</span>
            </div>
          </div>
        )}

        {/* ── Step 0: Choose Brand ── */}
        {step === 0 && (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs text-center">
            <h2 className="text-[#2d7a1f] text-lg font-black tracking-tight mb-8">
              أختر نوع سيارتك
            </h2>
            
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 max-w-4xl mx-auto mb-6">
              {BRANDS.map((brand) => (
                <button
                  key={brand.key}
                  onClick={() => handleBrandSelect(brand.key)}
                  className="group bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-[#2d7a1f] rounded-2xl p-6 w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-[0_8px_30px_rgba(45,122,31,0.08)]"
                  aria-label={brand.name}
                >
                  <div className="text-slate-650 group-hover:text-[#2d7a1f] transition-colors duration-300 flex items-center justify-center h-16 w-full">
                    {brand.logo}
                  </div>
                  <span className="text-xs font-black text-slate-800 group-hover:text-[#2d7a1f] transition-colors">
                    {brand.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-8 border-t border-slate-50 pt-6">
              <button
                onClick={() => { setSelectedBrand("all"); setSelectedModel("all"); setSelectedYear("all"); setSelectedCategory("all"); }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs px-8 py-3.5 rounded-xl border-0 cursor-pointer transition-colors"
              >
                تصفح جميع قطع الغيار المتاحة بالموقع مباشرة
              </button>
            </div>
          </div>
        )}

        {/* ── Step 1: Choose Model & Year ── */}
        {step === 1 && selectedBrand && (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-8">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">الماركة المختارة</span>
                <span className="text-xs font-black text-[#2d7a1f]">
                  {BRANDS.find(b => b.key === selectedBrand)?.name}
                </span>
              </div>
              <button
                onClick={resetAll}
                className="flex items-center gap-1 text-slate-400 hover:text-[#2d7a1f] font-bold text-xs bg-slate-50 px-3 py-1.5 rounded-xl border-0 cursor-pointer transition-all animate-fade-in"
              >
                <span>رجوع للماركات</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <h2 className="text-base font-black text-slate-900 mb-6 pr-1">
              أختر الموديل وسنة الصنع للسيارة:
            </h2>

            {modelYearCombos.length === 0 ? (
              <div className="text-center py-10 text-slate-400 font-bold text-xs">
                لا توجد موديلات مدرجة حالياً لهذه السيارة بجدول البيانات، اضغط رجوع أو تصفح الأقسام مباشرة.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {modelYearCombos.map((combo) => (
                  <button
                    key={`${combo.model}_${combo.year}`}
                    onClick={() => handleModelYearSelect(combo.model, combo.year)}
                    className="bg-white hover:bg-slate-50/85 border border-slate-200 hover:border-[#2d7a1f] rounded-2xl p-5 text-right font-sans transition-all duration-300 cursor-pointer flex items-center justify-between group shadow-xs"
                  >
                    <span className="text-xs font-black text-slate-850 group-hover:text-[#2d7a1f] transition-colors">
                      {combo.model} {combo.year}
                    </span>
                    <ChevronLeft size={14} className="text-slate-400 group-hover:translate-x-[-4px] group-hover:text-[#2d7a1f] transition-all" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Choose Category (3 green bars) ── */}
        {step === 2 && selectedBrand && selectedModel && selectedYear && (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs text-center">
            
            {/* Context breadcrumb */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-8 text-right">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">السيارة المحددة</span>
                <span className="text-xs font-black text-[#2d7a1f]">
                  {BRANDS.find(b => b.key === selectedBrand)?.name} · {selectedModel} {selectedYear}
                </span>
              </div>
              <button
                onClick={() => { setSelectedModel(null); setSelectedYear(null); }}
                className="flex items-center gap-1 text-slate-400 hover:text-[#2d7a1f] font-bold text-xs bg-slate-50 px-3 py-1.5 rounded-xl border-0 cursor-pointer transition-all"
              >
                <span>تغيير الموديل</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <h2 className="text-[#2d7a1f] text-lg font-black tracking-tight mb-8">
              اختر قسم قطع الغيار المطلوب
            </h2>

            {/* Exactly 3 full-width green category button bars matching mockup */}
            <div className="flex flex-col gap-4 max-w-xl mx-auto mb-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => handleCategorySelect(cat.key)}
                  className="w-full bg-[#2d7a1f] hover:bg-[#246118] text-white py-4.5 rounded-xl font-black text-sm tracking-wide transition-all shadow-md shadow-[#2d7a1f]/10 cursor-pointer border-0 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 3: Filtered Products Catalog Grid ── */}
        {step === 3 && (
          <div className="flex flex-col gap-8 animate-fade-in">
            
            {/* Header / Active Selections Summary */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border border-slate-100 p-5 rounded-3xl shadow-xs gap-4 text-right" dir="rtl">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">القطع المعروضة لسيارتك</span>
                <div className="flex items-center flex-wrap gap-2 text-xs font-black text-slate-800">
                  {selectedBrand && selectedBrand !== "all" && (
                    <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg">
                      {BRANDS.find(b => b.key === selectedBrand)?.name}
                    </span>
                  )}
                  {selectedModel && selectedModel !== "all" && (
                    <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg">
                      {selectedModel} {selectedYear}
                    </span>
                  )}
                  {selectedCategory && selectedCategory !== "all" && (
                    <span className="bg-[#2d7a1f]/10 text-[#2d7a1f] px-3 py-1.5 rounded-lg">
                      {CATEGORIES.find(c => c.key === selectedCategory)?.label}
                    </span>
                  )}
                  {isSearchActive && (
                    <span className="bg-brand-yellow/20 text-slate-900 px-3 py-1.5 rounded-lg font-bold">
                      بحث: {searchQuery}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={resetAll}
                className="bg-slate-100 hover:bg-slate-200 text-slate-650 font-black text-xs px-6 py-3 rounded-2xl border-0 cursor-pointer flex items-center gap-1.5 transition-colors shrink-0"
              >
                <RotateCcw size={13} />
                <span>بدء اختيار سيارة جديدة</span>
              </button>
            </div>

            {/* Empty dynamic state */}
            {paginatedProducts.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-450 flex items-center justify-center mb-2">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="text-base font-black text-slate-800">لا توجد قطع غيار مطابقة للتحديد حالياً</h3>
                <p className="text-slate-400 text-xs font-bold max-w-sm leading-relaxed">
                  هذا القسم سيتم ربطه بملفات الإكسيل وقاعدة البيانات قريباً. يرجى الضغط للرجوع أو التواصل مباشرة لطلب القطعة.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={resetAll}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-3 rounded-xl font-black text-xs transition-colors cursor-pointer border-0"
                  >
                    رجوع للمتجر
                  </button>
                  <a
                    href={`https://wa.me/962789089842?text=${encodeURIComponent(`أبحث عن قطع غيار لسيارة ${selectedModel || ""} ${selectedYear || ""} قسم ${CATEGORIES.find(c => c.key === selectedCategory)?.label || ""}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#1ebd59] text-white px-6 py-3 rounded-xl font-black text-xs transition-colors cursor-pointer border-0 decoration-none flex items-center gap-1.5 shadow-sm"
                  >
                    <MessageCircle size={14} fill="currentColor" />
                    <span>طلب فوري واتساب</span>
                  </a>
                </div>
              </div>
            ) : (
              /* Products Grid displaying database items */
              <div>
                <div className="text-[10px] text-slate-400 font-bold mb-4 pr-1">
                  عرض <span className="text-slate-700 font-black font-en">{filteredProducts.length}</span> قطعة غيار مطابقة للتحديد
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {paginatedProducts.map((product) => {
                    const hasDiscount =
                      product.originalPrice && product.originalPrice > product.price;
                    const discountPct = hasDiscount
                      ? Math.round(
                          ((product.originalPrice! - product.price) /
                            product.originalPrice!) *
                            100
                        )
                      : 0;

                    return (
                      <div
                        key={product.id}
                        className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-slate-250 hover:shadow-[0_16px_40px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 flex flex-col p-4 text-right"
                      >
                        {/* Image container */}
                        <Link href={`/store/${product.id}`} className="relative w-full bg-slate-50/70 rounded-2xl flex items-center justify-center overflow-hidden mb-4 aspect-square cursor-pointer">
                          <img
                            src={product.image.startsWith("assets") ? `/${product.image}` : product.image}
                            alt={product.name}
                            className="w-[85%] h-[85%] object-contain group-hover:scale-103 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.src =
                                "/assets/images/placeholder-product.png";
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

                          {/* Price & Cart button */}
                          <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-slate-50 mt-auto">
                            <div className="flex flex-col">
                              {hasDiscount && (
                                <span className="text-[0.68rem] font-bold text-slate-400 line-through">
                                  {product.originalPrice} د.أ
                                </span>
                              )}
                              <span className="font-en text-sm sm:text-base font-black text-slate-900">
                                {product.price}{" "}
                                <span className="text-xs font-bold text-slate-500">
                                  د.أ
                                </span>
                              </span>
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
        )}

      </div>
    </div>
  );
}

// Safe build trigger comment to reactivate deployment pipelines
export default function StoreClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white font-sans">
          <div className="text-slate-450 font-black text-sm">
            جاري تحميل تفاصيل المتجر...
          </div>
        </div>
      }
    >
      <StoreContent />
    </Suspense>
  );
}
