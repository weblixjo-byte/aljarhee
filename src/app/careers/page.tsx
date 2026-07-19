"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Briefcase, MapPin, Calendar, ArrowRight, MessageCircle, AlertCircle, Loader2 } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCareers() {
      try {
        setLoading(true);
        if (!supabase) {
          throw new Error("Supabase client is not initialized.");
        }
        
        const { data, error: dbError } = await supabase
          .from("careers")
          .select("*")
          .order("created_at", { ascending: false });

        if (dbError) throw dbError;
        setCareers(data || []);
      } catch (err: any) {
        console.error("Failed to load careers from Supabase:", err);
        setError(err.message || "حدث خطأ غير متوقع أثناء تحميل الوظائف.");
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
    <main className="flex-grow max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full mt-[100px]" dir="rtl">
      
      {/* Intro Hero Section */}
      <div className="bg-gradient-to-r from-emerald-850 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 mb-12 text-right relative overflow-hidden shadow-lg shadow-emerald-900/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,211,102,0.1),transparent_70%)] pointer-events-none" />
        <div className="max-w-2xl relative z-10">
          <span className="bg-emerald-700/40 text-emerald-300 text-[0.65rem] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full inline-block mb-4 border border-emerald-500/20">
            انضم إلينا
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight leading-tight">
            ابدأ مسيرتك المهنية في الجارحي لقطع غيار السيارات
          </h1>
          <p className="text-emerald-100/80 text-xs sm:text-sm font-medium leading-relaxed">
            نحن نبحث دائماً عن العقول المبدعة والشغوفة بمجال السيارات والهايبرد. إذا كنت تمتلك الخبرة في المبيعات، فحص الكمبيوتر، أو الأعمال الفنية، انضم لفريقنا المتكامل وساهم في خدمة عملائنا بأفضل صورة.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col gap-8">
        
        {/* Section Heading */}
        <div className="text-right border-b border-slate-100 pb-4">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Briefcase className="text-[#2d7a1f]" size={22} />
            <span>فرص العمل المتاحة حالياً</span>
          </h2>
          <p className="text-slate-400 text-xs font-bold mt-1">تصفح الشواغر وأرسل سيرتك الذاتية بكبسة زر واحدة</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-[#2d7a1f]" size={36} />
            <span className="text-slate-400 text-xs font-bold">جاري تحميل أحدث الشواغر المتاحة...</span>
          </div>
        )}

        {/* Error / Offline State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-2xl text-right flex items-start gap-3">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-sm font-black mb-1">تعذر تحميل الوظائف من السيرفر</h4>
              <p className="text-xs font-bold opacity-90">
                تأكد من إعداد متغيرات Supabase بشكل صحيح في Vercel ليتمكن الموقع من سحب الوظائف الحية.
              </p>
            </div>
          </div>
        )}

        {/* Content list */}
        {!loading && !error && (
          <>
            {careers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {careers.map((job) => (
                  <div 
                    key={job.id} 
                    className="bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between text-right group"
                  >
                    {/* Header Image if available */}
                    {job.image && (
                      <div className="w-full h-48 bg-slate-50 overflow-hidden relative border-b border-slate-100">
                        <img 
                          src={job.image} 
                          alt={job.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    {/* Job Details Body */}
                    <div className="p-6 flex-grow flex flex-col gap-4">
                      {/* Meta information */}
                      <div className="flex flex-wrap items-center gap-4 text-[0.65rem] font-bold text-slate-400">
                        <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                          <MapPin size={12} className="text-red-500" />
                          <span>{job.location}</span>
                        </span>
                        <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 font-en">
                          <Calendar size={12} className="text-slate-400" />
                          <span>{new Date(job.created_at).toLocaleDateString("ar-JO")}</span>
                        </span>
                      </div>

                      {/* Job Title */}
                      <h3 className="text-base font-black text-slate-800 tracking-tight group-hover:text-[#2d7a1f] transition-colors">
                        {job.title}
                      </h3>

                      {/* Job Description */}
                      <p className="text-slate-500 text-xs leading-relaxed font-bold">
                        {job.description}
                      </p>

                      {/* Requirements if available */}
                      {job.requirements && (
                        <div className="mt-2 bg-slate-50/50 border border-slate-100 rounded-2xl p-4">
                          <span className="text-[0.7rem] font-black text-slate-700 block mb-1">المتطلبات الأساسية:</span>
                          <p className="text-slate-500 text-[0.65rem] leading-relaxed font-bold whitespace-pre-line">
                            {job.requirements}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer Action Button */}
                    <div className="px-6 pb-6 pt-2">
                      <a
                        href={getWhatsAppApplyUrl(job.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-[#2d7a1f] hover:bg-[#246118] text-white rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                      >
                        <MessageCircle size={14} />
                        <span>قدّم الآن عبر الواتساب</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-16 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                  <Briefcase size={28} />
                </div>
                <h3 className="text-base font-black text-slate-800">لا توجد شواغر حالياً</h3>
                <p className="text-slate-400 text-xs font-bold max-w-sm">
                  شواغرنا يتم تحديثها باستمرار. يمكنك التواصل معنا لإرسال سيرتك الذاتية للاحتفاظ بها في قاعدة بياناتنا.
                </p>
                <a 
                  href="https://wa.me/962789089842?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20%D8%A7%D9%84%D8%AC%D8%A7%D8%B1%D8%AD%D9%8A%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A5%D8%B1%D8%B3%D8%A7%D9%84%20%D8%B3%D9%8A%D8%B1%D8%AA%D9%8A%20%D8%A7%D9%84%D8%B0%D8%A7%D8%AA%D9%8A%D8%A9%20%D9%84%D9%84%D8%B4%D9%88%D8%A7%D8%BA%D8%B1%20%D8%A7%D9%84%D9%85%D8%B3%D8%AA%D9%82%D8%A8%D9%84%D9%8A%D8%A9."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 bg-[#2d7a1f] hover:bg-[#246118] text-white px-8 py-3 rounded-xl font-black text-xs transition-all shadow-md shadow-[#2d7a1f]/20 hover:-translate-y-0.5"
                >
                  أرسل سيرتك الذاتية كاش
                </a>
              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}
