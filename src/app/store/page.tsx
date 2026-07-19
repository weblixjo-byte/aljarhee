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
} from "lucide-react";

function StoreContent() {
  const { products } = useProducts();
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState<number>(500);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const catParam = searchParams.get("category");
    const queryParam = searchParams.get("query");
    if (catParam) setSelectedCategory(catParam);
    if (queryParam) setSearchQuery(queryParam);
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedBrand, priceRange, sortBy]);

  const categoriesList: [string, string][] = [
    ["all", "كل الأقسام"],
    ["mechanical", "محركات"],
    ["body", "الهيكل والبودي"],
    ["lights", "اضوية"],
  ];

  const brandsList = Array.from(
    new Set(products.map((p) => p.brand).filter(Boolean))
  );

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
      all: "كل الماركات",
    };
    return brandMap[brandKey.toLowerCase()] || brandKey.toUpperCase();
  };

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
    } catch {
      showToast("عذراً، حدث خطأ أثناء إضافة المنتج.", "error");
    }
  };

  const normalizeText = (str: string): string => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/[أإآ]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/ى/g, "ي")
      .replace(/[\u064B-\u0652]/g, "")
      .trim();
  };

  const filteredProducts = products.filter((p) => {
    const searchNormalized = normalizeText(searchQuery);
    if (!searchNormalized) {
      const matchesCategory =
        selectedCategory === "all" || getProductCategory(p) === selectedCategory;
      const matchesBrand = selectedBrand === "all" || p.brand === selectedBrand;
      const matchesPrice = p.price <= priceRange;
      return matchesCategory && matchesBrand && matchesPrice;
    }
    const matchesSearch =
      normalizeText(p.name).includes(searchNormalized) ||
      (p.description && normalizeText(p.description).includes(searchNormalized)) ||
      (p.model && normalizeText(p.model).includes(searchNormalized)) ||
      (p.brand && normalizeText(p.brand).includes(searchNormalized)) ||
      (p.category && normalizeText(p.category).includes(searchNormalized)) ||
      ((p as any).categoryName &&
        normalizeText((p as any).categoryName).includes(searchNormalized));
    const matchesCategory =
      selectedCategory === "all" || getProductCategory(p) === selectedCategory;
    const matchesBrand = selectedBrand === "all" || p.brand === selectedBrand;
    const matchesPrice = p.price <= priceRange;
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "discount") {
      const discA = a.originalPrice ? a.originalPrice - a.price : 0;
      const discB = b.originalPrice ? b.originalPrice - b.price : 0;
      return discB - discA;
    }
    if (sortBy === "name-asc") return a.name.localeCompare(b.name, "ar");
    if (sortBy === "name-desc") return b.name.localeCompare(a.name, "ar");
    return 0;
  });

  const ITEMS_PER_PAGE = 20;
  const paginatedProducts = sortedProducts.slice(0, currentPage * ITEMS_PER_PAGE);
  const maxPriceLimit = products.reduce(
    (max, p) => (p.price > max ? p.price : max),
    100
  );

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSortBy("default");
    setPriceRange(maxPriceLimit);
  };

  const activeFilterCount = [
    selectedCategory !== "all",
    selectedBrand !== "all",
    priceRange < maxPriceLimit,
    searchQuery !== "",
  ].filter(Boolean).length;

  return (
    <>
      <main className="flex-grow w-full mt-[100px]" style={{ background: "#f8fafc" }}>

        {/* Page Header */}
        <div className="w-full border-b border-slate-100 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 text-right">
            <h1 className="text-2xl font-black text-slate-900 mb-1">
              متجر قطع غيار الجارحي
            </h1>
            <p className="text-slate-400 text-xs font-bold">
              تصفح القطع المستوردة بضمان الجودة وكفالة تشغيل حقيقية.
            </p>
          </div>
        </div>

        {/* ── Filter Bar (not sticky) ── */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-2">
          <div
            className="w-full rounded-2xl bg-white border border-slate-200 overflow-hidden"
            style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
          >
            {/* Main filter row */}
            <div className="flex flex-wrap items-stretch divide-x divide-x-reverse divide-slate-100">

              {/* Categories */}
              <div className="flex items-center gap-2 px-6 py-4 flex-1 min-w-0 overflow-x-auto">
                {categoriesList.map(([id, name]) => (
                  <button
                    key={id}
                    onClick={() => setSelectedCategory(id)}
                    className="shrink-0 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border-0"
                    style={
                      selectedCategory === id
                        ? { background: "#2d7a1f", color: "#fff" }
                        : { background: "#f1f5f9", color: "#64748b" }
                    }
                  >
                    {name}
                  </button>
                ))}
              </div>

              {/* Brand */}
              <div className="px-5 py-4 hidden sm:flex items-center gap-2 shrink-0">
                <span className="text-[0.68rem] font-bold text-slate-400 whitespace-nowrap">
                  الماركة
                </span>
                <div className="relative">
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="appearance-none bg-slate-50 border-0 rounded-xl pr-3 pl-6 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer text-right font-sans"
                    style={{ minWidth: "110px" }}
                  >
                    <option value="all">الكل</option>
                    {brandsList.map((brand) => (
                      <option key={brand} value={brand}>
                        {getBrandName(brand)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={11}
                    className="absolute top-1/2 left-1.5 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Price */}
              <div className="px-5 py-4 hidden lg:flex items-center gap-3 shrink-0">
                <span className="text-[0.68rem] font-bold text-slate-400 whitespace-nowrap">
                  السعر
                </span>
                <input
                  type="range"
                  min="0"
                  max={maxPriceLimit || 500}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-24 accent-[#2d7a1f] h-1 cursor-pointer"
                />
                <span className="text-xs font-black text-[#2d7a1f] font-en whitespace-nowrap">
                  {priceRange} د.أ
                </span>
              </div>

              {/* Sort */}
              <div className="px-5 py-4 hidden sm:flex items-center gap-2 shrink-0">
                <span className="text-[0.68rem] font-bold text-slate-400 whitespace-nowrap">
                  ترتيب
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-slate-50 border-0 rounded-xl pr-3 pl-6 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer text-right font-sans"
                    style={{ minWidth: "120px" }}
                  >
                    <option value="default">الافتراضي</option>
                    <option value="price-low">الأقل سعراً</option>
                    <option value="price-high">الأعلى سعراً</option>
                    <option value="discount">الأعلى خصماً</option>
                    <option value="name-asc">أ — ي</option>
                    <option value="name-desc">ي — أ</option>
                  </select>
                  <ChevronDown
                    size={11}
                    className="absolute top-1/2 left-1.5 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Search */}
              <div className="px-5 py-4 hidden md:flex items-center shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ابحث عن قطعة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-50 border-0 rounded-xl py-2 pr-9 pl-3 text-xs font-bold text-slate-700 focus:bg-slate-100 outline-none transition-all text-right font-sans"
                    style={{ width: "170px" }}
                  />
                  <Search
                    size={13}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* Mobile filter button */}
              <div className="px-4 py-4 flex items-center md:hidden">
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="flex items-center gap-1.5 bg-slate-100 px-3 py-2 rounded-xl text-xs font-black text-slate-700 cursor-pointer border-0"
                >
                  <SlidersHorizontal size={13} className="text-[#2d7a1f]" />
                  فلاتر
                  {activeFilterCount > 0 && (
                    <span className="bg-[#2d7a1f] text-white text-[0.6rem] font-black w-4 h-4 flex items-center justify-center rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Footer row: result count + reset */}
            <div className="flex items-center justify-between px-6 py-2.5 border-t border-slate-100 bg-slate-50/60">
              <div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 text-red-400 hover:text-red-500 text-[0.68rem] font-black transition-all cursor-pointer border-0 bg-transparent"
                  >
                    <X size={11} />
                    مسح الفلاتر
                  </button>
                )}
              </div>
              <span className="text-[0.68rem] font-bold text-slate-400">
                <span className="font-black text-slate-600 font-en">
                  {sortedProducts.length}
                </span>{" "}
                قطعة متاحة
              </span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-300 flex flex-col text-right cursor-pointer"
                    style={{ padding: "14px" }}
                  >
                    {/* Image */}
                    <div
                      className="relative w-full bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden mb-3"
                      style={{ aspectRatio: "1/1" }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-4/5 h-4/5 object-contain group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/assets/images/placeholder-product.png";
                        }}
                      />
                      {hasDiscount && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white font-black text-[0.58rem] px-1.5 py-0.5 rounded-md z-10">
                          {discountPct}%
                        </span>
                      )}
                      {product.conditionText && (
                        <span className="absolute top-2 left-2 bg-slate-100 text-slate-600 font-bold text-[0.58rem] px-1.5 py-0.5 rounded-md z-10">
                          {product.conditionText}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1">
                      <span className="text-[0.58rem] font-bold text-slate-400 uppercase tracking-wider mb-0.5 font-en">
                        {product.brand}
                      </span>
                      <h3 className="text-[0.8rem] font-black text-slate-800 leading-snug line-clamp-2 mb-1 hover:text-[#2d7a1f] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-[0.6rem] font-bold text-slate-400 uppercase font-en mb-3">
                        {product.model} · {product.year}
                      </p>

                      {/* Price + Cart */}
                      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-50 mt-auto">
                        <div className="flex flex-col">
                          {hasDiscount && (
                            <span className="text-[0.6rem] font-bold text-slate-400 line-through">
                              {product.originalPrice} د.أ
                            </span>
                          )}
                          <span className="font-en text-sm font-black text-slate-900">
                            {product.price}{" "}
                            <span className="text-[0.6rem] font-bold text-slate-500">
                              د.أ
                            </span>
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          className="bg-[#2d7a1f] hover:bg-[#246118] text-white p-2 rounded-lg transition-all duration-300 flex items-center justify-center cursor-pointer border-0 shrink-0"
                          title="أضف إلى السلة"
                        >
                          <ShoppingCart size={14} />
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-3xl p-20 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-base font-black text-slate-800">
                لا توجد قطع غيار مطابقة
              </h3>
              <p className="text-slate-400 text-xs font-bold max-w-xs">
                لم نجد أي نتائج تطابق معايير البحث الحالية. جرب تغيير الفلاتر أو
                إعادة الضبط.
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 bg-[#2d7a1f] hover:bg-[#246118] text-white px-6 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer border-0"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          )}

          {/* Load More */}
          {sortedProducts.length > paginatedProducts.length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                className="bg-white border border-slate-200 hover:border-[#2d7a1f]/40 hover:bg-[#2d7a1f]/5 text-slate-700 hover:text-[#2d7a1f] px-10 py-3 rounded-2xl font-black text-xs transition-all cursor-pointer"
              >
                تحميل المزيد من القطع
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 lg:hidden flex justify-end animate-fade-in">
          <div className="bg-white w-full max-w-[320px] h-full shadow-2xl flex flex-col p-6 text-right animate-slide-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer rounded-full hover:bg-slate-100 p-1.5 transition-all"
              >
                <X size={20} />
              </button>
              <span className="text-sm font-black text-slate-900 flex items-center gap-2">
                <SlidersHorizontal size={15} className="text-[#2d7a1f]" />
                فلاتر البحث
              </span>
            </div>

            <div className="flex-grow overflow-y-auto flex flex-col gap-5 pr-1">
              {/* Search */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-black text-slate-700">بحث سريع</span>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ابحث عن قطعة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2d7a1f] outline-none rounded-xl py-2.5 pr-9 pl-3 text-xs font-bold text-slate-800 text-right font-sans"
                  />
                  <Search size={14} className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-black text-slate-700">التصنيفات</span>
                <div className="flex flex-col gap-1.5">
                  {categoriesList.map(([id, name]) => (
                    <button
                      key={id}
                      onClick={() => setSelectedCategory(id)}
                      className="text-right py-2.5 px-3 rounded-xl text-xs font-black transition-all border cursor-pointer"
                      style={
                        selectedCategory === id
                          ? { background: "#f0fdf4", color: "#2d7a1f", borderColor: "#bbf7d0" }
                          : { background: "#f8fafc", color: "#475569", borderColor: "#e2e8f0" }
                      }
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-black text-slate-700">ماركة السيارة</span>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 outline-none focus:border-[#2d7a1f] cursor-pointer text-right appearance-none font-sans"
                >
                  <option value="all">كل الماركات</option>
                  {brandsList.map((brand) => (
                    <option key={brand} value={brand}>
                      {getBrandName(brand)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-black text-slate-700">
                  <span className="font-en text-[#2d7a1f]">{priceRange} د.أ</span>
                  <span>الحد الأقصى للسعر</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxPriceLimit || 500}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#2d7a1f] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Sort */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-black text-slate-700">الترتيب</span>
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
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs py-3 rounded-xl border-0 cursor-pointer transition-all"
              >
                إعادة ضبط
              </button>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 bg-[#2d7a1f] hover:bg-[#246118] text-white font-black text-xs py-3 rounded-xl border-0 cursor-pointer transition-all"
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

export default function StorePage() {
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
