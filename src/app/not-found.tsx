"use client";

import Link from "next/link";
import { ArrowLeft, Home, Search, AlertCircle, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div 
      className="min-h-screen bg-slate-900 flex items-center justify-center px-6 relative overflow-hidden font-sans select-none" 
      dir="rtl"
    >
      {/* Premium background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#ffc72c]/10 blur-[120px] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-lg text-center flex flex-col items-center gap-8 py-10 animate-fade-in">
        
        {/* Animated Tire/Gear Badge */}
        <div className="relative flex items-center justify-center w-28 h-28 bg-slate-800/80 rounded-[2.5rem] border border-slate-700/50 shadow-2xl">
          {/* Outer rotating tire thread simulation */}
          <div className="absolute inset-2 rounded-[2rem] border-4 border-dashed border-[#ffc72c]/30 animate-[spin_20s_linear_infinite]" />
          {/* Inner details */}
          <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-tr from-slate-950 to-slate-900 flex items-center justify-center shadow-inner">
            <Compass size={32} className="text-[#ffc72c]" />
          </div>
          {/* absolute 404 badge */}
          <span className="absolute bottom-[-10px] bg-red-500/90 text-white font-en text-[11px] font-black px-3 py-0.5 rounded-full border border-red-400/30 shadow-md">
            404 ERROR
          </span>
        </div>

        {/* Text Area */}
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">
            عذراً، الصفحة غير موجودة!
          </h1>
          <p className="text-slate-400 text-sm font-bold leading-relaxed max-w-sm">
            يبدو أن الرابط الذي دخلته غير صحيح أو قد تم نقله وتحديثه في هيكلية الموقع الجديد لقطع الغيار.
          </p>
        </div>

        {/* Dynamic Help Options */}
        <div className="w-full bg-slate-800/40 border border-slate-700/30 rounded-3xl p-5 flex flex-col gap-3.5 shadow-xl backdrop-blur-xs">
          <span className="text-[10px] font-black text-[#ffc72c] tracking-widest block text-right uppercase">
            خيارات مقترحة للمساعدة:
          </span>
          
          <div className="flex flex-col gap-2.5">
            <Link 
              href="/store"
              className="flex items-center justify-between p-3.5 bg-slate-900/60 hover:bg-slate-900 text-right rounded-2xl border border-slate-700/50 hover:border-[#ffc72c]/40 group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#ffc72c]/10 flex items-center justify-center text-[#ffc72c] group-hover:scale-105 transition-all">
                  <Search size={14} />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-xs font-black text-slate-200">تصفح متجر قطع الغيار</span>
                  <span className="text-[9px] font-bold text-slate-400">ابحث عن القطع المناسبة لسيارتك</span>
                </div>
              </div>
              <ArrowLeft size={14} className="text-slate-500 group-hover:text-slate-350 transition-all translate-x-0 group-hover:-translate-x-1" />
            </Link>

            <Link 
              href="/"
              className="flex items-center justify-between p-3.5 bg-slate-900/60 hover:bg-slate-900 text-right rounded-2xl border border-slate-700/50 hover:border-[#2d7a1f]/40 group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#2d7a1f]/10 flex items-center justify-center text-[#2d7a1f] group-hover:scale-105 transition-all">
                  <Home size={14} />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-xs font-black text-slate-200">العودة للصفحة الرئيسية</span>
                  <span className="text-[9px] font-bold text-slate-400">الصفحة التعريفية وخدمات مركز الجارحي</span>
                </div>
              </div>
              <ArrowLeft size={14} className="text-slate-500 group-hover:text-slate-350 transition-all translate-x-0 group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Contact info support */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <AlertCircle size={14} className="text-[#ffc72c]" />
          <span>هل تحتاج مساعدة فورية؟ تواصل معنا عبر الواتساب على الرقم 0796016140</span>
        </div>

      </div>
    </div>
  );
}
