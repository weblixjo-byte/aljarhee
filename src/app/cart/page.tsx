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
  ClipboardList 
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
        const newQty = (item.quantity || 1) + delta;
        return { ...item, quantity: Math.max(1, newQty) };
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
    showToast("تم إزالة القطعة من السلة.", "success");
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  
  // Free shipping above 20 JD
  const shippingFee = subtotal >= 20 ? 0 : 3;
  const total = subtotal + shippingFee;

  // Handle WhatsApp checkout submission
  const handleWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      showToast("يرجى ملء جميع حقول التوصيل المطلوبة.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Build order details message text
      const storePhone = "962790007962";
      let message = `*طلب جديد من متجر قطع الجارحي للسيارات*\n\n`;
      message += `*معلومات المشتري:*\n`;
      message += `• الاسم: ${customerName.trim()}\n`;
      message += `• الهاتف: ${customerPhone.trim()}\n`;
      message += `• المدينة: ${customerCity === "Amman" ? "عمان" : customerCity === "Zarqa" ? "الزرقاء" : customerCity === "Irbid" ? "إربد" : customerCity === "Salt" ? "السلط" : "باقي المحافظات"}\n`;
      message += `• العنوان بالتفصيل: ${customerAddress.trim()}\n\n`;

      message += `*القطع المطلوبة:*\n`;
      cartItems.forEach((item, index) => {
        message += `${index + 1}. *${item.name}* (الكمية: ${item.quantity})\n`;
        message += `   السعر: ${item.price} د.أ\n`;
        if (item.brand || item.model) {
          message += `   التوافق: ${item.brand || ""} ${item.model || ""}\n`;
        }
        message += `\n`;
      });

      message += `*تفاصيل الفاتورة:*\n`;
      message += `• المجموع الفرعي: ${subtotal} د.أ\n`;
      message += `• تكلفة التوصيل: ${shippingFee === 0 ? "مجاني" : `${shippingFee} د.أ`}\n`;
      message += `• *المجموع الإجمالي: ${total} د.أ*\n\n`;
      message += `يرجى تأكيد الطلب وتجهيز الشحن.`;

      // Encode URL for WhatsApp
      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${storePhone}?text=${encodedMsg}`;

      // Open in new window
      window.open(whatsappUrl, "_blank");

      // Optional: Clear cart after checkout
      localStorage.setItem("aljarhee_cart", JSON.stringify([]));
      setCartItems([]);
      window.dispatchEvent(new Event("cartUpdated"));

      showToast("تم إنشاء طلبك وفتح واتساب لإرساله!", "success");
    } catch (err) {
      showToast("حدث خطأ أثناء إعداد الطلب.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="flex-grow max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full mt-[100px]">
        
        {/* Title */}
        <div className="text-right mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-2">سلة المشتريات</h1>
          <p className="text-slate-500 text-xs font-bold">يرجى مراجعة القطع المطلوبة وتعبئة معلومات التوصيل لإكمال الطلب عبر الواتساب.</p>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white border border-slate-100 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center overflow-hidden shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/assets/images/placeholder-product.png";
                        }}
                      />
                    </div>

                    <div className="text-right">
                      <h3 className="text-xs font-black text-slate-800 line-clamp-1 mb-1">{item.name}</h3>
                      <span className="text-[0.65rem] font-bold text-slate-400 font-en uppercase">
                        {item.brand || "جميع الموديلات"}
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                    {/* Unit Price */}
                    <div className="text-right">
                      <span className="text-[0.65rem] text-slate-400 font-bold block mb-0.5">السعر الفردي</span>
                      <span className="text-xs font-black text-slate-800 font-en">{item.price} د.أ</span>
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
                      <span className="text-xs font-black text-brand-green font-en">{item.price * item.quantity} د.أ</span>
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
                onSubmit={handleWhatsAppCheckout}
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
                    <span>رقم الهاتف (واتساب) *</span>
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
                    <option value="Amman">العاصمة عمان (توصيل 3 د.أ / مجاني فوق 20)</option>
                    <option value="Zarqa">الزرقاء (توصيل 3 د.أ / مجاني فوق 20)</option>
                    <option value="Irbid">إربد (توصيل 3 د.أ / مجاني فوق 20)</option>
                    <option value="Salt">السلط (توصيل 3 د.أ / مجاني فوق 20)</option>
                    <option value="Others">محافظة أخرى</option>
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
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966C16.59 1.977 14.113.953 11.488.95c-5.442 0-9.866 4.372-9.87 9.802 0 1.689.451 3.336 1.309 4.792L1.9 21.03l5.747-1.876zm10.957-7.466c-.29-.144-1.716-.836-1.978-.93-.262-.093-.453-.14-.645.144-.19.284-.738.93-.907 1.116-.168.187-.337.21-.628.067-.29-.144-1.226-.445-2.336-1.422-.864-.76-1.448-1.7-1.617-1.987-.169-.285-.018-.439.124-.581.127-.128.283-.327.425-.49.141-.164.19-.28.283-.467.094-.188.047-.352-.023-.497-.07-.145-.646-1.536-.885-2.1-.233-.559-.47-.482-.646-.492-.167-.008-.36-.01-.553-.01-.193 0-.507.07-.773.354-.266.285-1.013.978-1.013 2.383s1.028 2.766 1.17 2.953c.143.187 2.024 3.045 4.904 4.263.684.29 1.218.463 1.634.593.687.215 1.312.185 1.806.11.55-.083 1.716-.69 1.956-1.356.242-.665.242-1.235.17-1.356-.071-.122-.262-.215-.552-.36z" />
                  </svg>
                  <span>إرسال الطلب وتأكيد الشحن</span>
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
              className="mt-2 bg-[#2d7a1f] hover:bg-[#246118] text-white px-8 py-3 rounded-xl font-black text-xs transition-all shadow-md shadow-[#2d7a1f]/20 hover:-translate-y-0.5"
            >
              اذهب للتسوق من المتجر
            </Link>
          </div>
        )}

      </main>
    </>
  );
}
