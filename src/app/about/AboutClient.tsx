"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Award, 
  ChevronDown, 
  Users, 
  CheckCircle2, 
  PhoneCall, 
  ArrowLeft, 
  Package, 
  Truck, 
  Building2, 
  FileCheck2,
  Sparkles,
  HelpCircle
} from "lucide-react";

export default function AboutClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const stats = [
    { value: "+10,000", label: "عميل راضٍ ومستمر", sub: "في جميع محافظات المملكة", icon: <Users size={20} className="text-[#2d7a1f]" /> },
    { value: "100%", label: "كفالة فحص وتشغيل", sub: "حق إرجاع واستبدال مضمون", icon: <ShieldCheck size={20} className="text-[#2d7a1f]" /> },
    { value: "+15,000", label: "قطعة غيار متوفرة", sub: "جديد ومستعمل فحص كامل", icon: <Package size={20} className="text-[#2d7a1f]" /> },
    { value: "24-48h", label: "سرعة التوصيل", sub: "شحن آمن لكل المحافظات", icon: <Truck size={20} className="text-[#2d7a1f]" /> },
  ];

  const pillars = [
    {
      icon: <ShieldCheck size={24} className="text-[#2d7a1f]" />,
      title: "الجودة والمصداقية التامة",
      desc: "لا نتهاون أبداً في المعايير. جميع القطع تخضع لفحص فني شامل قبل عرضها لضمان الملاءمة والعمل بكفاءة 100%."
    },
    {
      icon: <FileCheck2 size={24} className="text-[#2d7a1f]" />,
      title: "المطابقة الدقيقة برقم الشاصي",
      desc: "نعتمد نظام مطابقة آلي باستخدام كود (VIN / Chassis) لمنع أخطاء الطلب وتحديد القطعة الملائمة لسيارتك بالضبط."
    },
    {
      icon: <Award size={24} className="text-[#2d7a1f]" />,
      title: "كفالة تشغيل حقيقية",
      desc: "نلتزم بكفالة تشغيل حقيقية وسارية المفعول تعطي العميل الأمان الكامل في الشراء وحق الاستبدال أو الترجيع دون تعقيد."
    },
    {
      icon: <Building2 size={24} className="text-[#2d7a1f]" />,
      title: "تخصص في سيارات الهايبرد والكهرباء",
      desc: "خبرة متعمقة وأسطول متكامل من القطع الكهربائية والهيكلية لسيارات تويوتا، لكزس، نيسان، فورد، ولينكولن."
    }
  ];

  const faqs = [
    {
      q: "ما هي شروط كفالة التشغيل لقطع الغيار في مركز الجارحي؟",
      a: "نضمن عمل القطعة بشكل مثالي فور تركيبها. الكفالة تشمل إرجاع القطعة أو استبدالها مجاناً في حال وجود أي خلل مصنعي أو فني خلال فترة الكفالة، بشرط التركيب لدى مركز صيانة معتمد وتجنب سوء الاستخدام."
    },
    {
      q: "كيف أضمن مطابقة القطعة لسيارتي بنسبة 100% قبل الشراء؟",
      a: "يمكنك تزويدنا برقم الشاصي (Chassis / VIN) المكون من 17 حرفاً ورقماً عبر واتساب أو نموذج الطلب، وسيقوم فريقنا بمطابقة القطعة في الكتالوج الرسمي للصانع مجاناً قبل الشحن."
    },
    {
      q: "ما هي مدة التوصيل والشحن لجميع المحافظات؟",
      a: "التوصيل داخل عمان يستغرق من 2 إلى 6 ساعات في نفس اليوم. أما المحافظات الأخرى فيستغرق الشحن من 24 إلى 48 ساعة كحد أقصى مع تغليف محمي وضمان استلام القطعة بحالة ممتازة."
    },
    {
      q: "هل توفرون مبيعات وخصومات خاصة لمراكز الصيانة والجملة؟",
      a: "نعم، لدينا قسم مخصص لمبيعات الجملة وتوريد المراكز بأسعار تفضيلية وعروض خاصة للكميات. يمكنك التواصل مباشرة مع قسم الجملة على الرقم (0789089842)."
    }
  ];

  return (
    <main className="flex-grow w-full font-sans pb-20 text-slate-800 bg-white" dir="rtl">
      
      {/* ── 1. SOFT ELEGANT HERO SECTION ── */}
      <section className="bg-slate-50/70 border-b border-slate-200/60 pt-28 pb-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-[#2d7a1f] font-black text-xs px-4 py-1.5 rounded-full mb-5">
            <Sparkles size={14} className="text-[#2d7a1f]" />
            <span>الريادة والمصداقية في الأردن منذ 2021</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-5 max-w-3xl">
            الجارحي لقطع غيار السيارات <br />
            <span className="text-[#2d7a1f]">جودة مضمونة وخبرة نعتز بها</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium max-w-2xl mb-8">
            نجمع بين تشكيلة واسعة من قطع الغيار الأصلية والمفحوصة لسيارات الهايبرد، والدقة المتناهية في مطابقة أرقام الشاصي، لتصلك القطعة المناسبة لسيارتك بحالة ممتازة وبكفالة حقيقية.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/store"
              className="inline-flex items-center gap-2 bg-[#2d7a1f] hover:bg-[#246118] text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-xs"
            >
              <span>تصفح كتالوج المنتجات</span>
              <ArrowLeft size={16} />
            </Link>
            <a
              href="tel:0789089842"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-xs"
            >
              <PhoneCall size={16} className="text-[#2d7a1f]" />
              <span>اتصال مباشر مع خبراء قطع الغيار</span>
            </a>
          </div>

        </div>
      </section>

      {/* ── 2. STATS CARDS ── */}
      <section className="py-12 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((st, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-2.5"
            >
              <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
                {st.icon}
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 font-en tracking-tight block">
                  {st.value}
                </span>
                <span className="text-xs font-black text-slate-800 block mt-0.5">
                  {st.label}
                </span>
                <span className="text-[11px] font-bold text-slate-400 block mt-0.5">
                  {st.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. CORE PILLARS & VALUES ── */}
      <section className="py-16 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#2d7a1f] text-xs font-black uppercase tracking-wider block mb-1 font-en">مبادئنا وقيمنا</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            لماذا يثق بنا آلاف مالكي السيارات ومراكز الصيانة؟
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-2">
            تأسست سمعتنا على الدقة، الأمانة، والكفالة الحقيقية في كل قطعة غيار تخرج من مستودعاتنا.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((pil, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 hover:border-green-300 rounded-2xl p-6 transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-green-50 text-[#2d7a1f] flex items-center justify-center mb-4">
                  {pil.icon}
                </div>
                <h3 className="text-sm font-black text-slate-900 mb-2">
                  {pil.title}
                </h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">
                  {pil.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-5 flex items-center gap-1 text-[11px] font-black text-[#2d7a1f]">
                <span>معيار الجارحي الأصلي</span>
                <CheckCircle2 size={13} className="text-[#2d7a1f]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. ACCORDION FAQS ── */}
      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-[#2d7a1f] text-xs font-black uppercase tracking-wider block mb-1 font-en">الأسئلة الشائعة</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            كل ما تود معرفته عن خدماتنا وكفالتنا
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-2">
            إجابات سريعة وتفصيلية عن أبرز استفسارات العملاء والزبائن.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`border rounded-xl overflow-hidden transition-all ${
                  isOpen 
                    ? "bg-white border-green-300 shadow-xs" 
                    : "bg-white border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-right px-5 py-4 flex items-center justify-between font-black text-slate-900 text-xs sm:text-sm bg-transparent border-0 cursor-pointer transition-colors outline-none"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle size={16} className={isOpen ? "text-[#2d7a1f]" : "text-slate-400"} />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-[#2d7a1f]" : "text-slate-400"
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-xs font-medium leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 6. FINAL CTA BANNER (SOLID BRAND GREEN) ── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2d7a1f] rounded-3xl p-8 sm:p-12 text-white text-center flex flex-col items-center shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3 max-w-xl">
            هل تحتاج قطعة غيار محددة لسيارتك الآن؟
          </h2>
          <p className="text-green-50 text-xs sm:text-sm font-medium max-w-md mb-6 leading-relaxed">
            تواصل مباشرة مع مهندسي القطع في مركز الجارحي لمطابقة رقم الشاصي وتزويدك بأفضل الأسعار والكفالة الحقيقية.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/store"
              className="bg-white hover:bg-slate-50 text-slate-900 font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition-all"
            >
              ابحث في المتجر الإلكتروني
            </Link>
            <a
              href="https://wa.me/962789089842?text=مرحبا، اريد الاستفسار عن قطعة غيار"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#246118] hover:bg-[#1c4d12] text-white border border-white/20 font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition-all"
            >
              راسلنا على واتساب فوراً
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
