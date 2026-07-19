"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { useProducts } from "../../context/ProductContext";
import { useToast } from "../../context/ToastContext";
import { Product, getProductCategory } from "../../data/products";
import {
  Search,
  SlidersHorizontal,
  X,
  ShoppingCart,
  ShoppingBag,
  ChevronDown,
  Car,
  Calendar,
  Layers,
} from "lucide-react";

function StoreContent() {
  const { products } = useProducts();
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  // Search and Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Advanced Filtering States (Smartest auto sorting/filtering system)
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedModel, setSelectedModel] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  // Dynamic Price Limit State
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [maxPriceInCatalog, setMaxPriceInCatalog] = useState<number>(1000);

  // Initialize dynamic max price from products
  useEffect(() => {
    if (products.length > 0) {
      const maxPrice = Math.max(...products.map((p) => p.price));
      const ceilMax = Math.ceil(maxPrice) || 1000;
      setMaxPriceInCatalog(ceilMax);
      setPriceRange(ceilMax);
    }
  }, [products]);

  // Read URL query params (for quick category navigation from main page)
  useEffect(() => {
    const catParam = searchParams.get("category");
    const queryParam = searchParams.get("query");
    if (catParam) setSelectedCategory(catParam);
    if (queryParam) setSearchQuery(queryParam);
  }, [searchParams]);

  // Reset page when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedBrand, selectedModel, selectedYear, priceRange, sortBy]);

  // Reset child filters when parent selector changes
  useEffect(() => {
    setSelectedModel("all");
    setSelectedYear("all");
  }, [selectedBrand]);

  useEffect(() => {
    setSelectedYear("all");
  }, [selectedModel]);

  // Build categories dynamically from real DB data (no more hardcoded zeros!)
  const dynamicCategoryKeys: string[] = Array.from(
    new Set(
      products
        .map((p) => (p.categoryName && p.categoryName.trim()) || (p.category && p.category.trim()) || "")
        .filter((c) => c && c !== "جميع القطع" && c !== "all")
    )
  ).sort();

  // All categories list = "كل الأقسام" + dynamic list from actual data
  const categoriesList: [string, string][] = [
    ["all", "كل الأقسام"],
    ...dynamicCategoryKeys.map((key): [string, string] => [key, key]),
  ];

  // Dynamic brands list based on loaded products
  const brandsList = Array.from(
    new Set(products.map((p) => p.brand).filter(Boolean))
  ).sort();

  // Dynamic models list based on selected brand
  const modelsList = Array.from(
    new Set(
      products
        .filter((p) => selectedBrand === "all" || p.brand === selectedBrand)
        .map((p) => p.model)
        .filter(Boolean)
    )
  ).sort();

  // Dynamic years list based on selected brand & model
  const yearsList = Array.from(
    new Set(
      products
        .filter((p) => selectedBrand === "all" || p.brand === selectedBrand)
        .filter((p) => selectedModel === "all" || p.model === selectedModel)
        .map((p) => String(p.year))
        .filter((y) => y && y !== "all")
    )
  ).sort((a, b) => b.localeCompare(a)); // Sort descending for years

  const getBrandName = (brandKey: string): string => {
    const brandMap: Record<string, string> = {
      toyota: "تويوتا",
      kia: "كيا",
      hyundai: "هيونداي",
      ford: "فورد",
      honda: "هوندا",
      chevrolet: "شفروليه",
      lexus: "لكزس",
      tesla: "تيسلا",
      byd: "بي واي دي",
      volkswagen: "فولكس فاجن",
      nissan: "نيسان",
      mitsubishi: "ميتسوبيشي",
      mercedes: "مرسيدس",
      bmw: "بي إم دبليو",
      all: "جميع السيارات",
    };
    return brandMap[brandKey.toLowerCase()] || brandKey.toUpperCase();
  };

  const getArabicCategoryName = (categoryKey: string): string => {
    if (categoryKey === "all") return "كل الأقسام";
    // Now category keys are already Arabic (from DB), just return as-is
    return categoryKey;
  };

  // Smart counting for categories to show counters in real-time
  const getCategoryCount = (categoryKey: string) => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.id.toString().includes(searchQuery);

      const matchesBrand = selectedBrand === "all" || product.brand === selectedBrand;
      const matchesModel = selectedModel === "all" || product.model === selectedModel;
      
      const matchesYear =
        selectedYear === "all" ||
        String(product.year).includes(selectedYear) ||
        selectedYear.includes(String(product.year));

      const matchesPrice = product.price <= priceRange;

      const matchesCategory =
        categoryKey === "all" ||
        product.category === categoryKey ||
        product.categoryName === categoryKey;

      return matchesSearch && matchesBrand && matchesModel && matchesYear && matchesPrice && matchesCategory;
    }).length;
  };

  // Filter products matching all criteria
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toString().includes(searchQuery) ||
      (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.model && product.model.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory ||
      product.categoryName === selectedCategory;

    const matchesBrand =
      selectedBrand === "all" || product.brand === selectedBrand;

    const matchesModel =
      selectedModel === "all" || product.model === selectedModel;

    const matchesYear =
      selectedYear === "all" ||
      String(product.year).includes(selectedYear) ||
      selectedYear.includes(String(product.year));

    const matchesPrice = product.price <= priceRange;

    return matchesSearch && matchesCategory && matchesBrand && matchesModel && matchesYear && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name, "ar");
    if (sortBy === "name-desc") return b.name.localeCompare(a.name, "ar");
    if (sortBy === "discount") {
      const discountA = a.originalPrice ? a.originalPrice - a.price : 0;
      const discountB = b.originalPrice ? b.originalPrice - b.price : 0;
      return discountB - discountA;
    }
    return 0; // default
  });

  // Pagination
  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 350, behavior: "smooth" });
    }
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
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
      showToast(`تم إضافة "${product.name}" إلى السلة!`, "success");
    } catch {
      showToast("حدث خطأ أثناء إضافة القطعة.", "error");
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSelectedModel("all");
    setSelectedYear("all");
    setPriceRange(maxPriceInCatalog);
    setSortBy("default");
    setCurrentPage(1);
    showToast("تم إعادة ضبط فلاتر البحث بنجاح.", "success");
  };

  const handleManualPriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setPriceRange(0);
      return;
    }
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      setPriceRange(Math.min(10000, Math.max(0, parsed)));
    }
  };

  return (
    <>
      {/* Search Header Banner */}
      <div className="bg-slate-900 text-white py-16 relative overflow-hidden text-right mt-[80px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(45,122,31,0.25),transparent_60%)]" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">
            كتالوج قطع غيار السيارات الأصلي
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-bold max-w-xl leading-relaxed">
            ابحث وتصفح التشكيلة الأوسع لقطع غيار سيارات الهايبرد، الكهرباء، والميكانيك. حدد الفلاتر للحصول على نتائج دقيقة لسيارتك.
          </p>

          {/* Quick Search Widget */}
          <div className="mt-8 max-w-2xl relative">
            <input
              type="text"
              placeholder="ابحث باسم القطعة، نوع السيارة، الموديل أو كود القطعة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-800 rounded-2xl py-4.5 pr-12 pl-4 text-xs font-bold border-0 focus:ring-2 focus:ring-[#2d7a1f] shadow-lg font-sans outline-none text-right placeholder-slate-400"
            />
            <Search className="absolute top-1/2 right-4.5 -translate-y-1/2 text-[#2d7a1f]" size={20} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-lg p-1 border-0 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Catalog View */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 1. Sidebar Filters (Desktop only) */}
          <aside className="hidden lg:col-span-3 lg:flex flex-col gap-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs text-right">
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-50 pb-3 flex items-center justify-between">
                <span>تصفية النتائج الذكية</span>
                <SlidersHorizontal size={14} className="text-[#2d7a1f]" />
              </h3>
            </div>

            {/* Category selection */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-black text-slate-700 mb-1 flex items-center gap-1.5">
                <Layers size={13} className="text-[#2d7a1f]" />
                القسم الرئيسي
              </span>
              {categoriesList.map(([key, label]) => {
                const count = getCategoryCount(key);
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`text-right py-2 px-3 rounded-xl text-xs font-bold transition-all border-0 cursor-pointer flex items-center justify-between ${
                      selectedCategory === key
                        ? "bg-[#2d7a1f]/10 text-[#2d7a1f] font-black"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <span>{getArabicCategoryName(key)}</span>
                    <span className={`text-[0.62rem] font-black px-1.5 py-0.5 rounded-md font-en ${
                      selectedCategory === key
                        ? "bg-[#2d7a1f] text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Vehicle Selection Block (Brand -> Model -> Year) */}
            <div className="flex flex-col gap-3.5 border-t border-slate-50 pt-5">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Car size={13} className="text-[#2d7a1f]" />
                ملاءمة السيارة
              </span>

              {/* Brand Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[0.65rem] text-slate-400 font-black mb-1">ماركة السيارة</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 outline-none focus:border-[#2d7a1f] cursor-pointer text-right appearance-none font-sans"
                >
                  <option value="all">جميع الماركات (الكل)</option>
                  {brandsList.map((brand) => (
                    <option key={brand} value={brand}>
                      {getBrandName(brand)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model Selector (Dynamic) */}
              <div className="flex flex-col gap-1">
                <label className="text-[0.65rem] text-slate-400 font-black mb-1">الموديل / الفئة</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={selectedBrand === "all" || modelsList.length === 0}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 outline-none focus:border-[#2d7a1f] cursor-pointer text-right appearance-none font-sans disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="all">جميع الموديلات</option>
                  {modelsList.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Selector (Dynamic) */}
              <div className="flex flex-col gap-1">
                <label className="text-[0.65rem] text-slate-400 font-black mb-1">سنة الصنع</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  disabled={selectedModel === "all" || yearsList.length === 0}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 outline-none focus:border-[#2d7a1f] cursor-pointer text-right appearance-none font-sans disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="all">جميع السنوات</option>
                  {yearsList.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Filter with Manual Typing + Slider */}
            <div className="flex flex-col gap-2.5 border-t border-slate-50 pt-5">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Calendar size={13} className="text-[#2d7a1f]" />
                نطاق السعر الأقصى
              </span>
              
              <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                  <input
                    type="number"
                    value={priceRange === 0 ? "" : priceRange}
                    onChange={handleManualPriceInput}
                    placeholder="السعر يدوياً"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-2 px-3 text-xs font-black text-slate-800 text-center font-sans"
                  />
                </div>
                <span className="text-xs text-slate-400 font-bold shrink-0">د.أ</span>
              </div>

              <input
                type="range"
                min="1"
                max={maxPriceInCatalog}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#2d7a1f] cursor-pointer mt-1"
              />
            </div>

            {/* Sorting */}
            <div className="flex flex-col gap-2 border-t border-slate-50 pt-5">
              <span className="text-xs font-black text-slate-700 mb-2.5">ترتيب حسب</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 outline-none focus:border-[#2d7a1f] cursor-pointer text-right appearance-none font-sans"
              >
                <option value="default">الافتراضي</option>
                <option value="price-low">الأقل سعراً</option>
                <option value="price-high">الأعلى سعراً</option>
                <option value="discount">الأعلى خصماً</option>
                <option value="name-asc">أ — ي</option>
                <option value="name-desc">ي — أ</option>
              </select>
            </div>

            {/* Reset Filters button */}
            <button
              onClick={resetFilters}
              className="mt-4 w-full bg-slate-50 hover:bg-slate-100 text-slate-500 font-black text-xs py-3 rounded-xl border border-slate-200 transition-all cursor-pointer"
            >
              إعادة ضبط الفلاتر
            </button>
          </aside>

          {/* 2. Products Catalog Grid */}
          <section className="lg:col-span-9 flex flex-col gap-8">
            
            {/* Header info bar */}
            <div className="flex items-center justify-between bg-white border border-slate-100 p-4 rounded-2xl shadow-xs text-right" dir="rtl">
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs px-4 py-2.5 rounded-xl border-0 cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <SlidersHorizontal size={14} />
                  <span>تصفية ({filteredProducts.length})</span>
                </button>
              </div>

              <div className="text-xs font-bold text-slate-400">
                عرض <span className="text-slate-800 font-black font-en">{sortedProducts.length}</span> قطعة غيار متوفرة
              </div>

              <div className="hidden lg:flex items-center gap-3">
                <span className="text-xs font-black text-slate-600">ترتيب سريع:</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setSortBy("default")}
                    className={`px-3 py-1.5 rounded-lg text-[0.65rem] font-black border-0 cursor-pointer transition-all ${
                      sortBy === "default"
                        ? "bg-[#2d7a1f] text-white"
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    الافتراضي
                  </button>
                  <button
                    onClick={() => setSortBy("price-low")}
                    className={`px-3 py-1.5 rounded-lg text-[0.65rem] font-black border-0 cursor-pointer transition-all ${
                      sortBy === "price-low"
                        ? "bg-[#2d7a1f] text-white"
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    السعر الأدنى
                  </button>
                  <button
                    onClick={() => setSortBy("discount")}
                    className={`px-3 py-1.5 rounded-lg text-[0.65rem] font-black border-0 cursor-pointer transition-all ${
                      sortBy === "discount"
                        ? "bg-[#2d7a1f] text-white"
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    الأعلى خصماً
                  </button>
                </div>
              </div>
            </div>

            {/* Empty products state */}
            {paginatedProducts.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mb-2">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="text-base font-black text-slate-800">لا توجد قطع غيار مطابقة للبحث</h3>
                <p className="text-slate-400 text-xs font-bold max-w-sm">
                  جرب تغيير كلمات البحث، خفض قيود الفلاتر، أو تصفح الأقسام الأخرى للعثور على ما تحتاجه.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-2 bg-[#2d7a1f] hover:bg-[#246118] text-white px-8 py-3 rounded-xl font-black text-xs transition-all shadow-md shadow-[#2d7a1f]/20 cursor-pointer border-0"
                >
                  إعادة ضبط فلاتر البحث
                </button>
              </div>
            ) : (
              /* Products Grid */
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
                    <Link
                      key={product.id}
                      href={`/store/${product.id}`}
                      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col p-4 text-right cursor-pointer"
                    >
                      {/* Image container */}
                      <div className="relative w-full bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden mb-4 aspect-square">
                        <img
                          src={product.image.startsWith("assets") ? `/${product.image}` : product.image}
                          alt={product.name}
                          className="w-[85%] h-[85%] object-contain group-hover:scale-105 transition-transform duration-500"
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
                      </div>

                      {/* Content block */}
                      <div className="flex flex-col flex-1">
                        <span className="text-[0.62rem] font-black text-slate-400 uppercase tracking-wider mb-1 font-en">
                          {getBrandName(product.brand)}
                        </span>
                        <h3 className="text-xs sm:text-sm font-black text-slate-800 leading-snug line-clamp-2 mb-1 group-hover:text-[#2d7a1f] transition-colors">
                          {product.name}
                        </h3>
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
                            className="bg-slate-50 group-hover:bg-[#2d7a1f] group-hover:text-white text-slate-500 p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center shrink-0 border-0 cursor-pointer"
                          >
                            <ShoppingCart size={15} />
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls — Smart with ellipsis */}
            {totalPages > 1 && (() => {
              const delta = 2; // pages shown around current
              const pages: (number | "...")[] = [];
              const left = Math.max(2, currentPage - delta);
              const right = Math.min(totalPages - 1, currentPage + delta);

              pages.push(1);
              if (left > 2) pages.push("...");
              for (let i = left; i <= right; i++) pages.push(i);
              if (right < totalPages - 1) pages.push("...");
              if (totalPages > 1) pages.push(totalPages);

              return (
                <div className="flex items-center justify-center gap-1.5 mt-8 pt-5 border-t border-slate-100 font-en flex-wrap">
                  {/* Prev */}
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 rounded-lg font-black text-xs transition-all border border-slate-100 cursor-pointer flex items-center justify-center bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="الصفحة السابقة"
                  >
                    ‹
                  </button>

                  {pages.map((page, i) =>
                    page === "..." ? (
                      <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-xs font-bold select-none">
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page as number)}
                        className={`w-9 h-9 rounded-lg font-black text-xs transition-all border-0 cursor-pointer flex items-center justify-center ${
                          currentPage === page
                            ? "bg-[#2d7a1f] text-white shadow-md shadow-[#2d7a1f]/20"
                            : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
                        }`}
                        aria-label={`صفحة ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    )
                  )}

                  {/* Next */}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 rounded-lg font-black text-xs transition-all border border-slate-100 cursor-pointer flex items-center justify-center bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="الصفحة التالية"
                  >
                    ›
                  </button>
                </div>
              );
            })()}
          </section>

        </div>
      </div>

      {/* Mobile Drawer Filter Panel */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden font-sans">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="relative w-80 max-w-xs bg-white h-full flex flex-col p-6 shadow-2xl text-right animate-slide-in-right overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-50 p-1.5 rounded-lg border-0 cursor-pointer"
              >
                <X size={16} />
              </button>
              <h3 className="text-sm font-black text-slate-800 font-sans">تصفية نتائج البحث</h3>
            </div>

            {/* Category Selector */}
            <div className="flex flex-col gap-2 mb-6">
              <span className="text-xs font-black text-slate-700 mb-1 flex items-center gap-1.5">
                <Layers size={13} className="text-[#2d7a1f]" />
                القسم الرئيسي
              </span>
              {categoriesList.map(([key, label]) => {
                const count = getCategoryCount(key);
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedCategory(key);
                    }}
                    className={`text-right py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all border-0 cursor-pointer flex items-center justify-between ${
                      selectedCategory === key
                        ? "bg-[#2d7a1f]/10 text-[#2d7a1f] font-black"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <span>{getArabicCategoryName(key)}</span>
                    <span className={`text-[0.62rem] font-black px-1.5 py-0.5 rounded-md font-en ${
                      selectedCategory === key
                        ? "bg-[#2d7a1f] text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Brand Selector */}
            <div className="flex flex-col gap-2 border-t border-slate-50 pt-5 mb-6">
              <span className="text-xs font-black text-slate-700 mb-2">ماركة السيارة</span>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 outline-none cursor-pointer text-right appearance-none font-sans"
              >
                <option value="all">جميع السيارات</option>
                {brandsList.map((brand) => (
                  <option key={brand} value={brand}>
                    {getBrandName(brand)}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Selector */}
            <div className="flex flex-col gap-2 border-t border-slate-50 pt-5 mb-6">
              <span className="text-xs font-black text-slate-700 mb-2">الموديل / الفئة</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={selectedBrand === "all" || modelsList.length === 0}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 outline-none cursor-pointer text-right appearance-none font-sans disabled:opacity-50"
              >
                <option value="all">جميع الموديلات</option>
                {modelsList.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Selector */}
            <div className="flex flex-col gap-2 border-t border-slate-50 pt-5 mb-6">
              <span className="text-xs font-black text-slate-700 mb-2">سنة الصنع</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                disabled={selectedModel === "all" || yearsList.length === 0}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 outline-none cursor-pointer text-right appearance-none font-sans disabled:opacity-50"
              >
                <option value="all">جميع السنوات</option>
                {yearsList.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Slider */}
            <div className="flex flex-col gap-2 border-t border-slate-50 pt-5 mb-6">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5 mb-1">
                نطاق السعر الأقصى
              </span>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  value={priceRange === 0 ? "" : priceRange}
                  onChange={handleManualPriceInput}
                  placeholder="السعر يدوياً"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-2 px-3 text-xs font-black text-slate-800 text-center font-sans"
                />
                <span className="text-xs text-slate-400 font-bold shrink-0">د.أ</span>
              </div>
              <input
                type="range"
                min="1"
                max={maxPriceInCatalog}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#2d7a1f] cursor-pointer"
              />
            </div>

            {/* Sorting */}
            <div className="flex flex-col gap-2 border-t border-slate-50 pt-5 mb-6">
              <span className="text-xs font-black text-slate-700 mb-2">ترتيب حسب</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 outline-none focus:border-[#2d7a1f] cursor-pointer text-right appearance-none font-sans"
              >
                <option value="default">الافتراضي</option>
                <option value="price-low">الأقل سعراً</option>
                <option value="price-high">الأعلى سعراً</option>
                <option value="discount">الأعلى خصماً</option>
                <option value="name-asc">أ — ي</option>
                <option value="name-desc">ي — أ</option>
              </select>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs py-3 rounded-xl border-0 cursor-pointer transition-all font-sans"
              >
                إعادة ضبط
              </button>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 bg-[#2d7a1f] hover:bg-[#246118] text-white font-black text-xs py-3 rounded-xl border-0 cursor-pointer transition-all font-sans"
              >
                عرض {filteredProducts.length} قطعة
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function StoreClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white font-sans">
          <div className="text-slate-400 font-black text-sm">
            جاري تحميل المتجر...
          </div>
        </div>
      }
    >
      <StoreContent />
    </Suspense>
  );
}
