"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";

export default function SearchWidget() {
  const router = useRouter();
  const [brand, setBrand] = useState("all");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchQuery = query.trim();
    let path = `/store?`;
    const params = [];
    
    if (brand !== "all") params.push(`brand=${brand}`);
    if (category !== "all") params.push(`category=${category}`);
    if (searchQuery) params.push(`query=${encodeURIComponent(searchQuery)}`);
    
    path += params.join("&");
    router.push(path);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-30 mb-8">
      <div className="bg-white shadow-[0_15px_50px_-15px_rgba(0,0,0,0.06)] rounded-2xl md:rounded-3xl p-6 md:p-8">
        {/* Header Title with Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-50">
          <div className="text-right">
            <h2 className="flex items-center gap-2.5 text-base sm:text-lg font-black text-slate-900">
              <SlidersHorizontal size={20} className="text-brand-green" />
              البحث الفوري الذكي
            </h2>
            <p className="text-xs font-bold text-slate-400 mt-1">ابحث في أكثر من 1500 قطعة غيار مكفولة متوفرة بمخازننا</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
          {/* Brand Selection (Span 3) */}
          <div className="flex flex-col gap-2 md:col-span-3 relative">
            <label htmlFor="search-brand" className="text-xs font-extrabold text-slate-400 mr-1">
              ماركة السيارة
            </label>
            <div className="relative w-full">
              <select
                id="search-brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full h-12 pr-4 pl-10 rounded-xl bg-slate-100/60 hover:bg-slate-100 text-slate-800 text-sm font-bold outline-none cursor-pointer focus:bg-slate-200/50 transition-all appearance-none text-right"
              >
                <option value="all">جميع ماركات السيارات</option>
                <option value="toyota">تويوتا (Toyota)</option>
                <option value="kia">كيا (Kia)</option>
                <option value="ford">فورد (Ford)</option>
                <option value="nissan">نيسان (Nissan)</option>
                <option value="mitsubishi">ميتسوبيشي (Mitsubishi)</option>
                <option value="hyundai">هيونداي (Hyundai)</option>
              </select>
              <ChevronDown size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Category Selection (Span 3) */}
          <div className="flex flex-col gap-2 md:col-span-3 relative">
            <label htmlFor="search-category" className="text-xs font-extrabold text-slate-400 mr-1">
              تصنيف القطع
            </label>
            <div className="relative w-full">
              <select
                id="search-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-12 pr-4 pl-10 rounded-xl bg-slate-100/60 hover:bg-slate-100 text-slate-800 text-sm font-bold outline-none cursor-pointer focus:bg-slate-200/50 transition-all appearance-none text-right"
              >
                <option value="all">جميع التصنيفات</option>
                <option value="hybrid">قطع غيار هايبرد وكهرباء</option>
                <option value="mechanical">المحركات والميكانيك</option>
                <option value="body">الهيكل الخارجي والبودي</option>
                <option value="electrical">الكهرباء والتكييف</option>
                <option value="accessories">إكسسوارات وعناية بالسيارة</option>
              </select>
              <ChevronDown size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Part Name / Number (Span 4) */}
          <div className="flex flex-col gap-2 md:col-span-4">
            <label htmlFor="search-query" className="text-xs font-extrabold text-slate-400 mr-1">
              اسم القطعة أو رقمها
            </label>
            <input
              type="text"
              id="search-query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="مثال: فحمات بريك، مروحة بطارية..."
              className="w-full h-12 px-4 rounded-xl bg-slate-100/60 hover:bg-slate-100 text-slate-800 text-sm font-bold outline-none focus:bg-slate-200/50 transition-all text-right placeholder-slate-400/80"
            />
          </div>

          {/* Search Button (Span 2) */}
          <div className="md:col-span-2 w-full">
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-brand-yellow hover:bg-brand-yellow-hover text-black text-sm font-black shadow-md hover:shadow-brand-yellow/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:-translate-y-0.5"
            >
              <Search size={18} />
              <span>بحث سريع</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
