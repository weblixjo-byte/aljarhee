"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";

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

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();

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

    const handleCartUpdate = () => {
      loadCart();
      // Auto open drawer when items are updated, unless on /cart page
      if (typeof window !== "undefined" && window.location.pathname !== "/cart") {
        setIsOpen(true);
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("openCartDrawer", () => setIsOpen(true));

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("openCartDrawer", () => setIsOpen(true));
    };
  }, []);

  const updateQuantity = (id: number, delta: number) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    });
    localStorage.setItem("aljarhee_cart", JSON.stringify(updated));
    setCartItems(updated);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    localStorage.setItem("aljarhee_cart", JSON.stringify(updated));
    setCartItems(updated);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-55 flex justify-start animate-fade-in" style={{ direction: "rtl" }}>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Cart Drawer Panel (Slides from left as requested) */}
      <div className="relative w-full max-w-[420px] h-full bg-white flex flex-col shadow-2xl z-10 animate-slide-in-left">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
          {/* Close button with circular background */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 transition-all border-0 cursor-pointer"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
          
          <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
            <span>سلة المشتريات</span>
            <span className="font-en text-slate-500">({totalCount})</span>
          </h2>
        </div>

        {/* Scrollable Items list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 py-3 border-b border-slate-50 relative group"
              >
                {/* Delete Button (Yellow circle with X) */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="w-6 h-6 rounded-full bg-[#ffc72c] hover:bg-[#ebd048] flex items-center justify-center text-slate-900 transition-all border-0 cursor-pointer shrink-0"
                  title="حذف القطعة"
                >
                  <X size={12} strokeWidth={3} />
                </button>

                {/* Info and Quantity Selector */}
                <div className="flex-1 flex flex-col gap-2 text-right mr-2">
                  <span className="text-xs font-black text-slate-800 line-clamp-1">
                    {item.name}
                  </span>
                  
                  {/* Quantity selector inside drawer item */}
                  <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50/50 p-0.5 select-none w-fit">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-900 bg-transparent border-0 cursor-pointer"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-xs font-black text-slate-800 font-en">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-900 bg-transparent border-0 cursor-pointer"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <span className="font-en text-xs font-black text-[#2d7a1f]">
                    {item.price * item.quantity} د.أ
                  </span>
                </div>

                {/* Product Image */}
                <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={item.image.startsWith("assets") ? `/${item.image}` : item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/assets/images/placeholder-product.png";
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
              <ShoppingBag size={32} />
              <span className="text-xs font-bold">سلة المشتريات فارغة حالياً</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 p-6 bg-slate-50 shrink-0">
          <div className="flex items-center justify-between mb-6">
            <span className="font-en text-base font-black text-slate-900">
              {subtotal} د.أ
            </span>
            <span className="text-sm font-black text-slate-800">مجموع</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Show Cart Button (Yellow) */}
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/cart");
              }}
              className="w-full bg-[#ffc72c] hover:bg-[#ebd048] text-slate-900 py-3 rounded-xl font-black text-xs transition-all cursor-pointer text-center border-0 shadow-sm"
            >
              إظهار السلة
            </button>

            {/* Continue Shopping (Grey) */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-slate-350 hover:bg-slate-400 text-slate-800 py-3 rounded-xl font-black text-xs transition-all cursor-pointer text-center border-0"
              style={{ backgroundColor: "#b2b7c2" }}
            >
              متابعة الشراء
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
