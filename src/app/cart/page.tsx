"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "../../context/ToastContext";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  PhoneCall, 
  MapPin, 
  User, 
  ClipboardList,
  CheckCircle
} from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  quantity: number;
  brand?: string;
  model?: string;
}

export default function CartPage() {
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCity, setCustomerCity] = useState("Amman");
  const [customerAddress, setCustomerAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  // Load cart from local storage
  const loadCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("aljarhee_cart") || "[]");
      setCartItems(cart);
    } catch (e) {
      setCartItems([]);
    }
  };

  useEffect(() => {
    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  // Update item quantity
  const updateQuantity = (id: number, delta: number) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const q = (item.quantity || 1) + delta;
        return { ...item, quantity: q > 0 ? q : 1 };
      }
      return item;
    });
    localStorage.setItem("aljarhee_cart", JSON.stringify(updated));
    setCartItems(updated);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Remove item from cart
  const removeItem = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    localStorage.setItem("aljarhee_cart", JSON.stringify(updated));
    setCartItems(updated);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const JO_CITIES = [
    { key: "Amman", name: "عمان (العاصمة)", fee: 3 },
    { key: "Irbid", name: "إربد", fee: 5 },
    { key: "Zarqa", name: "الزرقاء", fee: 5 },
    { key: "Balqa", name: "البلقاء (السلط)", fee: 5 },
    { key: "Mafraq", name: "المفرق", fee: 5 },
    { key: "Jerash", name: "جرش", fee: 5 },
    { key: "Ajloun", name: "عجلون", fee: 5 },
    { key: "Madaba", name: "مأدبا", fee: 5 },
    { key: "Karak", name: "الكرك", fee: 5 },
    { key: "Tafilah", name: "الطفيلة", fee: 5 },
    { key: "Maan", name: "معان", fee: 5 },
    { key: "Aqaba", name: "العقبة", fee: 5 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const selectedCityObj = JO_CITIES.find((c) => c.key === customerCity) || JO_CITIES[0];
  const shippingFee = subtotal >= 20 ? 0 : selectedCityObj.fee;
  const total = subtotal + shippingFee;

  // Handle direct dashboard checkout submission
  const handleDashboardCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      showToast("يرجى ملء جميع حقول التوصيل المطلوبة.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerCity,
          customerAddress: customerAddress.trim(),
          cartItems,
          subtotal,
          shippingFee,
          total,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to submit order");
      }

      const result = await res.json();

      // Clear local cart
      localStorage.setItem("aljarhee_cart", JSON.stringify([]));
      setCartItems([]);
      window.dispatchEvent(new Event("cartUpdated"));

      setOrderSuccessId(result.orderId);
      showToast("تم إرسال طلبك بنجاح وسيتواصل معك الفني لتأكيد التوصيل!", "success");
    } catch (err: any) {
      showToast(err.message || "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Success Screen
  if (orderSuccessId) {
    return (
      <main className="flex-grow max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full mt-[100px] text-center" dir="rtl">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-[#2d7a1f]/10 text-[#2d7a1f] rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle size={44} />
          </div>
          
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">تم إرسال الطلب بنجاح!</h1>
            <p className="text-[#2d7a1f] font-black text-sm">رقم الطلب: {orderSuccessId}</p>
          </div>

          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-md font-medium">
            نشكرك على ثقتك بمركز الجارحي لقطع غيار السيارات. لقد استلمنا طلبك في نظام لوحة التحكم، وسيقوم فنيو المبيعات بالتواصل معك فوراً على الرقم <span className="font-en font-black text-slate-800">{customerPhone}</span> لتأكيد الشحن والتوصيل والدفع كاش عند الاستلام.
          </p>

          <div className="bg-slate-50 rounded-2xl p-5 w-full flex flex-col gap-2.5 text-right text-xs">
            <h4 className="font-black text-slate-800 border-b border-slate-200/60 pb-2 mb-1 flex items-center gap-1.5">
              <ClipboardList size={13} className="text-[#2d7a1f]" />
              <span>تفاصيل التوصيل</span>
            </h4>
            <div className="flex justify-between text-slate-500 font-bold">
              <span>اسم العميل:</span>
              <span className="text-slate-800 font-black">{customerName}</span>
            </div>
            <div className="flex justify-between text-slate-500 font-bold">
              <span>الهاتف:</span>
              <span className="text-slate-800 font-black font-en">{customerPhone}</span>
            </div>
            <div className="flex justify-between text-slate-500 font-bold">
              <span>العنوان:</span>
              <span className="text-slate-800 font-black">
                {selectedCityObj ? selectedCityObj.name : customerCity} - {customerAddress}
              </span>
            </div>
            <div className="flex justify-between text-slate-500 font-bold border-t border-slate-200/50 pt-2 mt-1">
              <span>طريقة الدفع:</span>
              <span className="text-[#2d7a1f] font-black">كاش عند الاستلام</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <Link 
              href="/store"
              className="flex-1 py-3 bg-[#2d7a1f] hover:bg-[#246118] text-white rounded-xl font-black text-xs transition-all shadow-md shadow-[#2d7a1f]/20 hover:-translate-y-0.5 text-center"
            >
              العودة للمتجر
            </Link>
            <Link 
              href="/"
              className="flex-1 py-3 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-black text-xs transition-all text-center"
            >
              الصفحة الرئيسية
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="flex-grow max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full mt-[100px]" dir="rtl">
        
        {/* Title */}
        <div className="text-right mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-2">سلة المشتريات</h1>
          <p className="text-slate-500 text-xs font-bold">يرجى مراجعة القطع المطلوبة وتعبئة معلومات التوصيل لإكمال الطلب مباشرة.</p>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs hover:border-slate-200/80 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 rounded-2xl object-cover bg-slate-50 shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = "/assets/images/placeholder-product.png";
                      }}
                    />
                    <div className="text-right flex flex-col">
                      {item.brand && (
                        <span className="text-[0.62rem] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                          {item.brand} {item.model}
                        </span>
                      )}
                      <span className="text-xs font-black text-slate-800 leading-tight">
                        {item.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t border-slate-50 pt-3 sm:pt-0 sm:border-0">
                    {/* Unit price */}
                    <div className="text-right">
                      <span className="text-[0.65rem] text-slate-400 font-bold block mb-0.5">السعر الفردي</span>
                      <span className="text-xs font-black text-slate-800 font-en">
                        {item.price > 0 ? `${item.price} د.أ` : "طلب السعر"}
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-xl">
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-slate-600 hover:text-brand-green transition-colors border-0 bg-transparent cursor-pointer p-0.5"
                      >
                        <Plus size={14} />
                      </button>
                      <span className="font-en text-xs font-black text-slate-800 w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-slate-600 hover:text-brand-green transition-colors border-0 bg-transparent cursor-pointer p-0.5"
                      >
                        <Minus size={14} />
                      </button>
                    </div>

                    {/* Total item price */}
                    <div className="text-right hidden sm:block w-20">
                      <span className="text-[0.65rem] text-slate-400 font-bold block mb-0.5">المجموع</span>
                      <span className="text-xs font-black text-brand-green font-en">
                        {item.price > 0 ? `${item.price * item.quantity} د.أ` : "طلب السعر"}
                      </span>
                    </div>

                    {/* Delete button */}
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors border-0 bg-transparent cursor-pointer p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                </div>
              ))}

              <Link 
                href="/store"
                className="flex items-center justify-center gap-2 text-xs font-black text-slate-600 hover:text-brand-green border border-slate-200 hover:border-brand-green/20 py-3 rounded-2xl transition-all"
              >
                <ArrowRight size={14} />
                <span>الرجوع للمتجر وإضافة المزيد من القطع</span>
              </Link>
            </div>

            {/* Checkout Form & Order Summary */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <form 
                onSubmit={handleDashboardCheckout}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col gap-5 text-right"
              >
                <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <ClipboardList size={16} className="text-brand-green" />
                  <span>معلومات التوصيل والشحن</span>
                </h3>

                {/* Input Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.7rem] font-black text-slate-600 flex items-center gap-1.5">
                    <User size={13} className="text-slate-400" />
                    <span>الاسم بالكامل *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أحمد محمد علي"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-800 outline-none focus:border-brand-green focus:bg-white transition-all text-right font-sans"
                  />
                </div>

                {/* Input Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.7rem] font-black text-slate-600 flex items-center gap-1.5">
                    <PhoneCall size={13} className="text-slate-400" />
                    <span>رقم الهاتف *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="مثال: 0790000000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-800 outline-none focus:border-brand-green focus:bg-white transition-all text-right font-sans font-en"
                  />
                </div>

                {/* Free Shipping Progress Notice */}
                {subtotal > 0 && (
                  <div className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 transition-all ${
                    subtotal >= 20 
                      ? "bg-emerald-50/80 border-emerald-200 text-[#2d7a1f]" 
                      : "bg-amber-50/80 border-amber-200 text-amber-800"
                  }`}>
                    {subtotal >= 20 ? (
                      <span className="font-black flex items-center gap-1.5">
                        <span>🎉 مبروك! طلبك فوق 20 د.أ وحصلت على توصيل مجاني لكل المحافظات.</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <span>🚚 أضف بضائع بقيمة <strong className="font-en font-black text-amber-900">{(20 - subtotal).toFixed(1)} د.أ</strong> إضافية للحصول على توصيل مجاني!</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Select City */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.7rem] font-black text-slate-600 flex items-center gap-1.5">
                    <MapPin size={13} className="text-slate-400" />
                    <span>المحافظة / المدينة *</span>
                  </label>
                  <select
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs font-bold text-slate-700 outline-none focus:border-brand-green focus:bg-white cursor-pointer text-right appearance-none font-sans"
                  >
                    {JO_CITIES.map((city) => (
                      <option key={city.key} value={city.key}>
                        {city.name} {subtotal >= 20 ? "(توصيل مجاني 🎉)" : `(توصيل ${city.fee} د.أ - مجاني فوق 20 د.أ)`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Input Detail Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.7rem] font-black text-slate-600">العنوان بالتفصيل *</label>
                  <textarea
                    required
                    placeholder="الشارع، البناية، الطابق، بجانب معلم معروف..."
                    rows={3}
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-800 outline-none focus:border-brand-green focus:bg-white transition-all text-right font-sans resize-none"
                  />
                </div>

                {/* Payment Method Option */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <span className="text-[0.7rem] font-black text-slate-600">طريقة الدفع المتاحة</span>
                  <div className="bg-[#2d7a1f]/5 border border-[#2d7a1f]/20 rounded-xl p-3.5 flex items-center justify-between text-[0.7rem] font-black text-slate-800">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#2d7a1f] animate-pulse shrink-0" />
                      <span>الدفع عند الاستلام (كاش عند التوصيل)</span>
                    </span>
                    <span className="text-[#2d7a1f] font-black shrink-0">فقط كاش</span>
                  </div>
                </div>

                {/* Bill details */}
                <div className="border-t border-slate-100 pt-4 mt-2 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>المجموع الفرعي:</span>
                    <span className="font-en font-black text-slate-800">{subtotal} د.أ</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>تكلفة التوصيل:</span>
                    <span className="font-en font-black text-slate-850">
                      {shippingFee === 0 ? (
                        <span className="text-brand-green font-black">مجاني</span>
                      ) : (
                        `${shippingFee} د.أ`
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm font-black text-slate-900">
                    <span>المجموع الإجمالي:</span>
                    <span className="font-en text-brand-green text-base">{total} د.أ</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#2d7a1f] hover:bg-[#246118] text-white rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#2d7a1f]/20 hover:-translate-y-0.5 mt-2 border-0"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>تأكيد الطلب والدفع عند الاستلام</span>
                  )}
                </button>
              </form>
            </div>

          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-16 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
              <ShoppingBag size={28} />
            </div>
            <h3 className="text-base font-black text-slate-800">السلة فارغة حالياً</h3>
            <p className="text-slate-400 text-xs font-bold max-w-sm">
              لم تقم بإضافة أي قطع غيار إلى سلتك بعد. تصفح الموقع والمنتجات المستوردة الآن.
            </p>
            <Link 
              href="/store"
              className="mt-2 bg-[#2d7a1f] hover:bg-[#246118] text-white px-8 py-3 rounded-xl font-black text-xs transition-all shadow-md shadow-[#2d7a1f]/20 hover:-translate-y-0.5 text-center"
            >
              اذهب للتسوق من المتجر
            </Link>
          </div>
        )}

      </main>
    </>
  );
}
