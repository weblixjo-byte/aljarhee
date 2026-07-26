"use client";

import Link from "next/link";
import { ArrowLeft, Home, Search, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div 
      className="min-h-screen bg-white text-slate-800 flex items-center justify-center px-4 py-16 font-sans select-none" 
      dir="rtl"
    >
      <div className="w-full max-w-md text-center flex flex-col items-center gap-6">
        
        {/* Soft Badge & 404 Number */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center text-[#2d7a1f] shadow-xs">
            <Search size={28} />
          </div>
          <span className="font-en text-5xl sm:text-6xl font-black text-slate-900 tracking-tight mt-1">
            404
          </span>
        </div>

        {/* Text Area */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            عذراً، الصفحة غير موجودة!
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-sm">
            يبدو أن الرابط الذي دخلته غير صحيح أو تم تحديثه ونقله في الهيكلية الجديدة لمتجر قطع الغيار.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mt-2">
          <Link 
            href="/store"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2d7a1f] hover:bg-[#246118] text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-xs"
          >
            <Search size={16} />
            <span>تصفح كتالوج المتجر</span>
            <ArrowLeft size={14} />
          </Link>

          <Link 
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all"
          >
            <Home size={16} className="text-[#2d7a1f]" />
            <span>الصفحة الرئيسية</span>
          </Link>
        </div>

        {/* Support Note */}
        <div className="mt-6 pt-6 border-t border-slate-100 w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
          <AlertCircle size={14} className="text-[#2d7a1f]" />
          <span>تحتاج قطعة محددة؟ تواصل معنا عبر الواتساب على 0789089842</span>
        </div>

      </div>
    </div>
  );
}
