"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "../../../context/ToastContext";
import { getProductCategory, Product } from "../../../data/products";
import {
  ShoppingCart,
  Truck,
  ShieldCheck,
  ChevronRight,
  Plus,
  Minus,
  Share2,
  Heart,
  Clock,
  ArrowRight,
} from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  allProducts: Product[];
}

export default function ProductDetailClient({ product, allProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [viewerCount, setViewerCount] = useState(31);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Simulation of live viewers ticking up and down
  useEffect(() => {
    setViewerCount(Math.floor(Math.random() * 25) + 18);

    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const nextValue = prev + change;
        return nextValue > 10 && nextValue < 60 ? nextValue : prev;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Fetch related products from static list passed in props
  useEffect(() => {
    if (!product) return;

    const currentCategory = getProductCategory(product);
    let filtered = allProducts.filter(
      (p) => p.id !== product.id && (getProductCategory(p) === currentCategory || p.brand === product.brand)
    );

    if (filtered.length < 4) {
      const extra = allProducts.filter(
        (p) => p.id !== product.id && !filtered.find((f) => f.id === p.id)
      );
      filtered = [...filtered, ...extra];
    }

    const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 4);
    setRelatedProducts(shuffled);
  }, [product, allProducts]);

  // Check if product is in wishlist on load
  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem("aljarhee_favorites") || "[]");
      setIsFavorite(favs.includes(product.id));
    } catch {
      setIsFavorite(false);
    }
  }, [product.id]);

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      const cart = JSON.parse(localStorage.getItem("aljarhee_cart") || "[]");
      const existing = cart.find((item: any) => item.id === product.id);

      if (existing) {
        existing.quantity = (existing.quantity || 1) + quantity;
      } else {
        cart.push({ ...product, quantity });
      }

      localStorage.setItem("aljarhee_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      showToast(`تم إضافة ${quantity} من "${product.name}" إلى السلة!`, "success");
    } catch {
      showToast("حدث خطأ أثناء إضافة المنتج إلى السلة.", "error");
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("تم نسخ رابط المنتج بنجاح لمشاركته!", "success");
    }
  };

  const handleToggleFavorite = () => {
    try {
      const favs = JSON.parse(localStorage.getItem("aljarhee_favorites") || "[]");
      let updatedFavs: number[];
      
      if (isFavorite) {
        updatedFavs = favs.filter((id: number) => id !== product.id);
        showToast("تم إزالة القطعة من المفضلة", "success");
      } else {
        updatedFavs = [...favs, product.id];
        showToast("تم إضافة القطعة للمفضلة", "success");
      }
      
      localStorage.setItem("aljarhee_favorites", JSON.stringify(updatedFavs));
      setIsFavorite(!isFavorite);
    } catch {
      showToast("حدث خطأ ما.", "error");
    }
  };

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

  const getCategoryName = (categoryKey: string): string => {
    const catMap: Record<string, string> = {
      mechanical: "المحركات والميكانيك",
      body: "الهيكل والبودي",
      lights: "أضوية وإنارة",
      hybrid: "قطع الهايبرد والكهرباء",
      electrical: "الكهرباء والتكييف",
      accessories: "إكسسوارات وعناية بالسيارات",
      suspension: "نظام التعليق والدوزان",
    };
    return catMap[categoryKey] || categoryKey;
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-16">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between text-xs font-bold text-slate-400" dir="rtl">
          <div className="flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#2d7a1f] transition-colors">الرئيسية</Link>
            <ChevronRight size={12} />
            <Link href="/store" className="hover:text-[#2d7a1f] transition-colors">جميع القطع</Link>
            <ChevronRight size={12} />
            <span className="text-slate-800 font-black">{product.name}</span>
          </div>
          <Link href="/store" className="text-[#2d7a1f] hover:underline flex items-center gap-1 text-[0.7rem] font-black">
            <span>← العودة للتسوق</span>
          </Link>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        {/* Product Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Product Details */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs text-right order-2 lg:order-1 flex flex-col gap-6">
            <div>
              <span className="text-[0.68rem] font-black text-[#2d7a1f] bg-[#f0fdf4] border border-[#bbf7d0] px-3 py-1 rounded-full uppercase tracking-wider font-en inline-block mb-3">
                {getBrandName(product.brand)} · {product.model} ({product.year})
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Pricing Section */}
            <div className="flex items-center gap-4 py-2 border-y border-slate-50">
              <span className="text-3xl font-black text-slate-900 font-en">
                {product.price} <span className="text-sm font-bold text-slate-500 mr-0.5">د.أ</span>
              </span>
              {hasDiscount && (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-400 line-through font-en">
                    {product.originalPrice} د.أ
                  </span>
                  <span className="bg-red-500 text-white font-black text-[0.68rem] px-2 py-0.5 rounded-md">
                    وفرت {discountPct}%
                  </span>
                </div>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
              {/* Quantity select */}
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50/50 p-1 select-none shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 bg-transparent border-0 cursor-pointer text-lg transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-sm font-black text-slate-800 font-en">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 bg-transparent border-0 cursor-pointer text-lg transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 py-3.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <ShoppingCart size={15} />
                <span>أضف إلى السلة</span>
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                className="flex-1 w-full bg-[#2d7a1f] hover:bg-[#246118] text-white border-0 py-3.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-[#2d7a1f]/10"
              >
                <span>اشتري الآن</span>
              </button>
            </div>

            {/* Delivery details */}
            <div className="flex flex-col gap-3.5 border-t border-slate-50 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f0fdf4] text-[#2d7a1f] flex items-center justify-center shrink-0">
                  <Truck size={15} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-800">توصيل سريع ومجاني</span>
                  <span className="text-[0.65rem] font-bold text-slate-400">مجاناً عند الشراء بقيمة 20 د.أ أو أكثر داخل الأردن</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <Clock size={15} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-800">التوصيل خلال 24 - 48 ساعة</span>
                  <span className="text-[0.65rem] font-bold text-slate-400">شحن آمن مع كفالة تشغيل حقيقية قبل الاستلام</span>
                </div>
              </div>
            </div>

            {/* Meta details */}
            <div className="flex flex-col gap-2.5 border-t border-slate-50 pt-6 text-xs text-slate-500 font-bold">
              <div>
                <span>كود القطعة: </span>
                <span className="font-en text-slate-800 font-black">#{product.id}</span>
              </div>
              <div>
                <span>التصنيف: </span>
                <span className="text-slate-800 font-black">
                  {getCategoryName(product.categoryName || product.category)}
                </span>
              </div>
              <div>
                <span>حالة القطعة: </span>
                <span className="text-slate-800 font-black">
                  {product.conditionText} ({product.condition === "new" ? "جديد كلياً" : "مستعمل أصلي فحص"})
                </span>
              </div>
            </div>

            {/* Share & Wishlist */}
            <div className="flex items-center justify-between border-t border-slate-50 pt-5 mt-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-slate-500 hover:text-[#2d7a1f] bg-transparent border-0 cursor-pointer text-xs font-black transition-colors"
              >
                <Share2 size={15} />
                <span>مشاركة رابط القطعة</span>
              </button>

              <button
                onClick={handleToggleFavorite}
                className="flex items-center gap-1.5 bg-transparent border-0 cursor-pointer text-xs font-black transition-colors"
                style={{ color: isFavorite ? "#ef4444" : "#94a3b8" }}
              >
                <Heart size={15} fill={isFavorite ? "#ef4444" : "none"} />
                <span>{isFavorite ? "في المفضلة" : "إضافة للمفضلة"}</span>
              </button>
            </div>

            {/* Specifications description */}
            <div className="border-t border-slate-50 pt-6 text-right">
              <span className="text-xs font-black text-slate-800 block mb-2">الوصف والمواصفات:</span>
              <p className="text-slate-500 text-xs font-bold leading-relaxed">
                {product.description || "لا يوجد وصف إضافي متوفر لهذه القطعة حالياً. يرجى التواصل مع فريق الدعم الفني للاستفسار وتأكيد الملاءمة مع سيارتك."}
              </p>
            </div>
          </div>

          {/* Right Column: Product Image */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col gap-4">
            <div className="w-full bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex items-center justify-center overflow-hidden aspect-square relative group">
              <img
                src={product.image.startsWith("assets") ? `/${product.image}` : product.image}
                alt={product.name}
                className="w-4/5 h-4/5 object-contain group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src = "/assets/images/placeholder-product.png";
                }}
              />
              {hasDiscount && (
                <span className="absolute top-4 right-4 bg-red-500 text-white font-black text-[0.68rem] px-2.5 py-1 rounded-lg">
                  خصم {discountPct}%
                </span>
              )}
              {product.conditionText && (
                <span className="absolute top-4 left-4 bg-slate-100 text-slate-700 border border-slate-200/50 font-black text-[0.68rem] px-2.5 py-1 rounded-lg">
                  {product.conditionText}
                </span>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-[0.68rem] font-bold text-slate-400 bg-white border border-slate-100 rounded-2xl py-3.5 shadow-xs">
              <ShieldCheck size={14} className="text-[#2d7a1f]" />
              <span>كفالة تشغيل حقيقية ومطابقة 100% لكتالوج الشركة الصانعة</span>
            </div>
          </div>

        </div>

        {/* Recommended Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="text-right border-b border-slate-200/60 pb-4 mb-8">
              <h2 className="text-lg font-black text-slate-900">قطع غيار مقترحة قد تحتاجها</h2>
              <p className="text-slate-400 text-xs font-bold mt-1">
                تشكيلة مختارة من قطع الغيار المتوافقة أو ذات الصلة ببحثك.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((relProduct) => {
                const relHasDiscount =
                  relProduct.originalPrice && relProduct.originalPrice > relProduct.price;
                const relDiscountPct = relHasDiscount
                  ? Math.round(
                      ((relProduct.originalPrice! - relProduct.price) /
                        relProduct.originalPrice!) *
                        100
                    )
                  : 0;

                return (
                  <Link
                    key={relProduct.id}
                    href={`/store/${relProduct.id}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-300 flex flex-col p-3.5 text-right cursor-pointer"
                  >
                    {/* Image */}
                    <div
                      className="relative w-full bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden mb-3 aspect-square"
                    >
                      <img
                        src={relProduct.image.startsWith("assets") ? `/${relProduct.image}` : relProduct.image}
                        alt={relProduct.name}
                        className="w-4/5 h-4/5 object-contain group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/assets/images/placeholder-product.png";
                        }}
                      />
                      {relHasDiscount && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white font-black text-[0.58rem] px-1.5 py-0.5 rounded-md z-10">
                          {relDiscountPct}%
                        </span>
                      )}
                      {relProduct.conditionText && (
                        <span className="absolute top-2 left-2 bg-slate-100 text-slate-600 font-bold text-[0.58rem] px-1.5 py-0.5 rounded-md z-10">
                          {relProduct.conditionText}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1">
                      <span className="text-[0.58rem] font-bold text-slate-400 uppercase tracking-wider mb-0.5 font-en">
                        {relProduct.brand}
                      </span>
                      <h3 className="text-[0.8rem] font-black text-slate-800 leading-snug line-clamp-2 mb-1 group-hover:text-[#2d7a1f] transition-colors">
                        {relProduct.name}
                      </h3>
                      <p className="text-[0.6rem] font-bold text-slate-400 uppercase font-en mb-3">
                        {relProduct.model} · {relProduct.year}
                      </p>

                      {/* Price */}
                      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-50 mt-auto">
                        <div className="flex flex-col">
                          {relHasDiscount && (
                            <span className="text-[0.6rem] font-bold text-slate-400 line-through">
                              {relProduct.originalPrice} د.أ
                            </span>
                          )}
                          <span className="font-en text-sm font-black text-slate-900">
                            {relProduct.price}{" "}
                            <span className="text-[0.6rem] font-bold text-slate-500">
                              د.أ
                            </span>
                          </span>
                        </div>
                        
                        <div className="bg-slate-50 group-hover:bg-[#2d7a1f] group-hover:text-white text-slate-500 p-2 rounded-lg transition-all duration-300 flex items-center justify-center shrink-0">
                          <ShoppingCart size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
