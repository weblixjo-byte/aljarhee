"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingCart, Menu, X, Phone } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load cart count from local storage
  useEffect(() => {
    const updateCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("aljarhee_cart") || "[]");
        const totalItems = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
        setCartCount(totalItems);
      } catch (e) {
        setCartCount(0);
      }
    };

    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("cartUpdated", updateCount);

    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("cartUpdated", updateCount);
    };
  }, []);

  // Monitor scroll for scrolled header style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/store?category=${searchCategory}&query=${encodeURIComponent(query)}`);
    } else {
      router.push(`/store?category=${searchCategory}`);
    }
    setIsSearchOpen(false);
  };

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/services", label: "خدماتنا" },
    { href: "/store", label: "المتجر" },
    { href: "/careers", label: "الوظائف" },
    { href: "/about", label: "من نحن" },
    { href: "/contact", label: "تواصل معنا" },
  ];

  return (
    <>
      {/* ── Announcement Ticker Banner ── */}
      <div className="w-full overflow-hidden relative" style={{ height: "38px", background: "#ffc72c", direction: "ltr" }}>
        {/* Edge fades */}
        <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #ffc72c, transparent)" }} />
        <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #ffc72c, transparent)" }} />

        {/* Single flat list — 10 identical copies, animate 0 → -50% = perfect seamless loop */}
        <div className="animate-banner flex items-center h-full" style={{ width: "max-content", direction: "ltr" }}>
          {Array.from({ length: 10 }, (_, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 text-slate-900 text-[0.78rem] font-black"
              style={{ whiteSpace: "nowrap", padding: "0 52px" }}
              dir="rtl"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d60000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <span style={{ color: "#d60000" }}>التوصيل مجاني</span>
              <span style={{ color: "#0f172a" }}>عند الشراء من متجرنا الإلكتروني بقيمة</span>
              <span style={{ background: "#166534", padding: "2px 9px", borderRadius: "6px", color: "#bbf7d0", fontWeight: 900 }}>
                20 د.أ
              </span>
              <span style={{ color: "#0f172a" }}>أو أكثر</span>
            </span>
          ))}
        </div>
      </div>





      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.03)] py-3"
            : "bg-white py-4 shadow-[0_2px_15px_rgba(0,0,0,0.015)]"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[52px] gap-4">
            
            {/* Left Actions: Search, Cart, WhatsApp Contact */}
            <div className="flex items-center gap-3 shrink-0">
              {/* WhatsApp Button */}
              <a
                href="https://wa.me/962789089842"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border-0 px-4 py-2.5 rounded-full transition-all text-xs font-black shadow-sm"
              >
                <span className="font-en text-slate-800">0789089842</span>
                <Phone size={13} className="text-slate-800" />
              </a>

              {/* Search Toggle Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center justify-center w-[44px] h-[44px] rounded-full bg-slate-50 hover:bg-slate-100 text-text-primary transition-all shadow-xs border-0 cursor-pointer"
                title="بحث"
              >
                <Search size={20} strokeWidth={2} />
              </button>

              {/* Cart Icon */}
              <button
                onClick={() => window.dispatchEvent(new Event("openCartDrawer"))}
                className="relative flex items-center justify-center w-[44px] h-[44px] rounded-full bg-slate-50 hover:bg-slate-100 text-text-primary transition-all shadow-xs border-0 cursor-pointer"
              >
                <ShoppingCart size={20} strokeWidth={2} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brand-yellow font-en text-[0.65rem] font-extrabold text-text-primary border-2 border-white shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex md:hidden items-center justify-center w-[44px] h-[44px] rounded-full bg-slate-50 hover:bg-slate-100 text-text-primary transition-all"
                aria-label="قائمة التنقل"
              >
                <Menu size={20} />
              </button>
            </div>

            {/* Center Navigation Links (Desktop) */}
            <nav className="hidden md:flex items-center justify-center gap-8 h-full">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center h-full px-1 text-sm font-black transition-all border-b-2 py-1 ${
                      isActive
                        ? "border-[#2d7a1f] text-[#2d7a1f]"
                        : "border-transparent text-text-secondary hover:text-brand-yellow"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side: Brand Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <img
                src="/assets/images/PPP2.webp"
                alt="شعار الجارحي لقطع السيارات"
                className="h-[52px] w-auto object-contain transition-transform duration-300 hover:scale-103"
                onError={(e) => {
                  e.currentTarget.src = "/assets/images/logo.png";
                }}
              />
            </Link>

          </div>
        </div>
      </header>

      {/* Modern Center Modal Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-[500px] mx-4 shadow-2xl relative text-right animate-scale-in border-0">
            {/* Close Button */}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all border-0 cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-black text-slate-900 mb-4 pr-1">البحث السريع عن قطع الغيار</h3>
            
            <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3">
              <div>
                <input
                  type="text"
                  placeholder="ادخل اسم القطعة أو رقمها أو موديل السيارة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-0 bg-slate-100 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-800 outline-none focus:bg-slate-100/80 transition-all text-right font-sans"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="flex-1 bg-slate-100 text-slate-750 font-bold text-xs p-3.5 rounded-xl outline-none cursor-pointer text-right appearance-none border-0 font-sans"
                >
                  <option value="all">كل التصنيفات</option>
                  <option value="hybrid">قطع الهايبرد والكهرباء</option>
                  <option value="mechanical">المحركات والميكانيك</option>
                  <option value="body">الهيكل والبودي</option>
                  <option value="electrical">الكهرباء والتكييف</option>
                  <option value="accessories">إكسسوارات وعناية بالسيارات</option>
                </select>
                <button
                  type="submit"
                  className="bg-brand-yellow hover:bg-brand-yellow/90 text-text-primary px-6 rounded-xl font-black text-xs transition-all shadow-sm shrink-0 cursor-pointer border-0 font-sans"
                >
                  ابحث الآن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Navigation Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          {/* Black overlay */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Menu Drawer */}
          <div className="relative w-full max-w-[300px] h-full bg-white flex flex-col p-6 shadow-2xl transition-transform animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-slate-900">قائمة التنقل</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-text-primary hover:bg-slate-200 transition-all border-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="my-6">
              <div className="relative flex items-center border-0 rounded-xl overflow-hidden bg-slate-100 focus-within:bg-slate-100/80 transition-all">
                <input
                  type="text"
                  placeholder="ابحث عن قطعة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 px-4 text-xs font-bold outline-none text-right bg-transparent border-0 font-sans"
                />
                <button type="submit" className="px-4 text-slate-600 bg-transparent border-0 cursor-pointer">
                  <Search size={16} />
                </button>
              </div>
            </form>

            {/* Links */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`py-3.5 px-4 rounded-xl text-sm font-black transition-all text-right ${
                      isActive
                        ? "bg-slate-100 text-[#2d7a1f]"
                        : "text-text-secondary hover:bg-slate-50 hover:text-brand-yellow"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-3">
              <a
                href="https://wa.me/962790000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-black hover:bg-slate-900 text-white text-xs font-black shadow-sm transition-all border-0 font-sans"
              >
                تواصل واتساب
              </a>
              <a
                href="tel:+962790000000"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-slate-100 text-text-primary text-xs font-black hover:bg-slate-50 transition-all font-sans"
              >
                اتصل بنا هاتفياً
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
