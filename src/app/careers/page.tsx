"use client";

import React, { useState, useEffect } from "react";
import { Briefcase, MapPin, Calendar, MessageCircle, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

interface CareerItem {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  location: string;
  image?: string;
  created_at: string;
}

export default function CareersPage() {
  const [careers, setCareers] = useState<CareerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCareers() {
      try {
        if (!supabase) return;
        const { data } = await supabase
          .from("careers")
          .select("*")
          .order("created_at", { ascending: false });
        setCareers(data || []);
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    }
    fetchCareers();
  }, []);

  const getWhatsAppApplyUrl = (jobTitle: string) => {
    const storePhone = "962790007962";
    const text = `مرحباً متجر الجارحي، أرغب في التقدم لوظيفة (${jobTitle}) المعلنة في موقعكم الإلكتروني. يرجى تزويدي بالتعليمات لإرسال سيرتي الذاتية.`;
    return `https://wa.me/${storePhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <main
      className="flex-grow w-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-[100px]"
      dir="rtl"
    >
      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="mb-12 text-right">
        <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-black text-[#2d7a1f] border border-[#2d7a1f]/20 bg-[#2d7a1f]/5 px-3 py-1.5 rounded-full mb-4">
          <Briefcase size={11} />
          انضم إلى فريقنا
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 leading-tight tracking-tight">
          الوظائف المتاحة
        </h1>
        <p className="text-slate-500 text-sm font-medium max-w-lg leading-relaxed">
          نبحث دائماً عن أشخاص شغوفين بمجال السيارات والهايبرد للانضمام إلى فريق الجارحي.
          تصفّح الشواغر أدناه وقدّم طلبك مباشرة عبر واتساب.
        </p>
      </div>

      {/* ── Divider ───────────────────────────────────────────────── */}
      <div className="border-t border-slate-100 mb-10" />

      {/* ── Loading ───────────────────────────────────────────────── */}
      {loading && (
        <div className="flex items-center justify-center py-24 gap-3">
          <Loader2 className="animate-spin text-[#2d7a1f]" size={26} />
          <span className="text-slate-400 text-sm font-bold">جاري التحميل...</span>
        </div>
      )}

      {/* ── Jobs ──────────────────────────────────────────────────── */}
      {!loading && careers.length > 0 && (
        <div className="flex flex-col gap-6">
          {careers.map((job) => (
            <article
              key={job.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row hover:border-slate-300 hover:shadow-sm transition-all group"
            >
              {/* Image — left side on desktop */}
              {job.image && (
                <div className="w-full md:w-56 h-52 md:h-auto shrink-0 overflow-hidden bg-slate-50">
                  <img
                    src={job.image}
                    alt={job.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col flex-grow p-6 gap-4">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-black text-slate-500 border border-slate-200 px-2.5 py-1 rounded-lg">
                    <MapPin size={11} className="text-red-400" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-black text-slate-500 border border-slate-200 px-2.5 py-1 rounded-lg">
                    <Calendar size={11} />
                    {new Date(job.created_at).toLocaleDateString("ar-JO")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-black text-[#2d7a1f] border border-[#2d7a1f]/20 bg-[#2d7a1f]/5 px-2.5 py-1 rounded-lg">
                    <Briefcase size={11} />
                    دوام كامل
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg font-black text-slate-900 group-hover:text-[#2d7a1f] transition-colors leading-snug">
                  {job.title}
                </h2>

                {/* Description */}
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {job.description}
                </p>

                {/* Requirements */}
                {job.requirements && (
                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-[0.7rem] font-black text-slate-700 mb-2">المتطلبات:</p>
                    <p className="text-slate-500 text-[0.72rem] leading-relaxed font-medium whitespace-pre-line">
                      {job.requirements}
                    </p>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-auto pt-2">
                  <a
                    href={getWhatsAppApplyUrl(job.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#2d7a1f] hover:bg-[#246118] text-white text-xs font-black px-6 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                  >
                    <MessageCircle size={14} />
                    قدّم الآن عبر واتساب
                    <ArrowLeft size={13} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ── Empty State ───────────────────────────────────────────── */}
      {!loading && careers.length === 0 && (
        <div className="border border-slate-200 rounded-2xl p-16 text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 border border-slate-200 rounded-2xl flex items-center justify-center">
            <Briefcase size={24} className="text-slate-300" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-700 mb-1">لا توجد شواغر حالياً</h3>
            <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto">
              يتم تحديث الشواغر باستمرار. أرسل سيرتك الذاتية وسنتواصل معك عند توفر فرصة مناسبة.
            </p>
          </div>
          <a
            href="https://wa.me/962790007962?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A5%D8%B1%D8%B3%D8%A7%D9%84%20%D8%B3%D9%8A%D8%B1%D8%AA%D9%8A%20%D8%A7%D9%84%D8%B0%D8%A7%D8%AA%D9%8A%D8%A9."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#2d7a1f] hover:bg-[#246118] text-white text-xs font-black px-6 py-2.5 rounded-xl transition-all"
          >
            <MessageCircle size={14} />
            أرسل سيرتك الذاتية
          </a>
        </div>
      )}
    </main>
  );
}
