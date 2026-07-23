"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Target, 
  Award, 
  HeartHandshake, 
  ChevronDown, 
  Calendar, 
  Zap, 
  Users, 
  CheckCircle2, 
  Wrench,
  HelpCircle,
  Sparkles,
  PhoneCall,
  ArrowLeft,
  Package,
  Truck,
  Building2,
  FileCheck2
} from "lucide-react";

export default function AboutClient() {
  const [openFaq, setOpenFaq] = useState<number | 0>(0);

  const stats = [
    { value: "+10,000", label: "عميل راضٍ ومستمر", sub: "في جميع محافظات المملكة", icon: <Users size={22} className="text-[#2d7a1f]" /> },
    { value: "100%", label: "كفالة فحص وتشغيل", sub: "حق إرجاع واستبدال مضمون", icon: <ShieldCheck size={22} className="text-[#2d7a1f]" /> },
    { value: "+15,000", label: "قطعة غيار متوفرة", sub: "جديد ومستعمل فحص كامل", icon: <Package size={22} className="text-[#2d7a1f]" /> },
    { value: "24-48h", label: "سرعة التوصيل", sub: "شحن آمن لكل المحافظات", icon: <Truck size={22} className="text-[#2d7a1f]" /> },
  ];

  const pillars = [
    {
      icon: <ShieldCheck size={28} className="text-[#2d7a1f]" />,
      title: "الجودة والمصداقية التامة",
      desc: "لا نتهاون أبداً في المعايير. جميع القطع المستعملة تخضع لفحص فني شامل قبل عرضها لضمان الملاءمة والعمل بكفاءة 100%."
    },
    {
      icon: <FileCheck2 size={28} className="text-[#2d7a1f]" />,
      title: "المطابقة الدقيقة برقم الشاصي",
      desc: "نعتمد نظام مطابقة آلي متقدم باستخدام كود (VIN ID / Chassis) لمنع أخطاء الطلب وتحديد القطعة الملائمة لسيارتك بالضبط."
    },
    {
      icon: <Award size={28} className="text-[#2d7a1f]" />,
      title: "كفالة تشغيل حقيقية",
      desc: "نلتزم بكفالة تشغيل حقيقية وسارية المفعول تعطي العميل الأمان الكامل في الشراء وحق الاستبدال أو الترجيع دون تعقيد."
    },
    {
      icon: <Building2 size={28} className="text-[#2d7a1f]" />,
      title: "تخصص في سيارات الهايبرد والكهرباء",
      desc: "خبرة متعمقة وأسطول متكامل من القطع الكهربائية والهيكلية لسيارات تويوتا، لكزس، نيسان، فورد، ولينكولن."
    }
  ];

  const timeline = [
    {
      year: "2021",
      title: "التأسيس والانطلاقة في البيادر",
      desc: "تأسس مركز الجارحي في منطقة البيادر بعمان كمعرض متخصص بقطع غيار سيارات الهايبرد بهدف توفير قطع موثوقة ومضمونة."
    },
    {
      year: "2023",
      title: "التوسع ورابط التوصيل لكل المحافظات",
      desc: "توسيع نطاق خدماتنا ليشمل التوصيل الفوري لجميع المحافظات مع بناء شبكة توزيع وشراكة مع مراكز الصيانة المعتمدة."
    },
    {
      year: "2025",
      title: "إطلاق الكتالوج الإلكتروني المطور",
      desc: "تحول رقمي شامل وإطلاق كتالوج إلكتروني ذكي يتيح للزبائن تصفح 15,000+ قطعة بالصور والتفاصيل والأسعار الحقيقية."
    },
    {
      year: "2026",
      title: "الريادة المستمرة وخدمة 10,000+ عميل",
      desc: "نفخر بخدمة أكثر من 10,000 عميل في الأردن مع استمرار التطوير وتوسيع تشكيلة القطع الكهربائية والميكانيكية الجديدة والمستعملة."
    }
  ];

  const faqs = [
    {
      q: "ما هي شروط كفالة التشغيل لقطع الغيار في مركز الجارحي؟",
      a: "نحن نضمن أن تعمل القطعة بشكل مثالي فور تركيبها في السيارة. الكفالة تشمل إرجاع القطعة أو استبدالها مجاناً في حال وجود أي خلل مصنعي أو فني خلال فترة الكفالة المتفق عليها، بشرط أن يتم التركيب لدى مركز صيانة معتمد وتجنب سوء الاستخدام."
    },
    {
      q: "كيف أضمن مطابقة القطعة لسيارتي بنسبة 100% قبل الشراء؟",
      a: "يمكنك الاعتماد على كود القطعة المصنعي (OEM) أو تزويدنا برقم الشاصي (Chassis / VIN) المكون من 17 حرفاً ورقمياً عبر واتساب أو نموذج الطلب، وسيقوم فريقنا بمطابقة القطعة في الكتالوج الرسمي للصانع مجاناً قبل الشحن."
    },
    {
      q: "ما هي مدة التوصيل والشحن لجميع المحافظات؟",
      a: "التوصيل داخل عمان يستغرق من 2 إلى 6 ساعات في نفس اليوم. أما المحافظات الأخرى فيستغرق الشحن بين 24 إلى 48 ساعة كحد أقصى مع تغليف محمي وضمان استلام القطعة بحالة ممتازة."
    },
    {
      q: "هل توفرون مبيعات وخصومات خاصة لمراكز الصيانة والجملة؟",
      a: "نعم، لدينا قسم مخصص لمبيعات الجملة وتوريد المراكز والمحلات بأسعار تفضيلية وعروض خاصة للكميات. يمكنك التواصل مباشرة مع قسم الجملة على الرقم (0788088027)."
    }
  ];

  return (
    <main className="flex-grow w-full font-sans pb-28 text-slate-800" dir="rtl">
      
      {/* ── 1. GRAND LUXURIOUS HERO SECTION ── */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-[#122e0d] text-white">
        {/* Subtle decorative glows */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#2d7a1f]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xs px-4 py-2 rounded-full mb-6 backdrop-blur-md">
            <Sparkles size={14} className="text-emerald-400 animate-pulse" />
            <span>الريادة والمصداقية في الأردن منذ 2021</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6 max-w-4xl">
            الجارحي لقطع غيار السيارات <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 via-green-300 to-white">
              جودة مضمونة وخبرة نعتز بها
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium max-w-2xl mb-10">
            نحن نجمع بين تشكيلة واسعة من قطع الغيار الأصلية والمفحوصة لسيارات الهايبرد، والدقة المتناهية في مطابقة أرقام الشاصي، لتصلك القطعة المناسبة لسيارتك بحالة ممتازة وبكفالة حقيقية.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/store"
              className="inline-flex items-center gap-3 bg-[#2d7a1f] hover:bg-[#246118] text-white font-black text-sm px-8 py-4 rounded-2xl shadow-lg shadow-[#2d7a1f]/30 hover:-translate-y-1 transition-all"
            >
              <span>تصفح كتالوج المنتجات</span>
              <ArrowLeft size={16} />
            </Link>
            <a
              href="tel:0789089842"
              className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-sm px-8 py-4 rounded-2xl backdrop-blur-md hover:-translate-y-1 transition-all"
            >
              <PhoneCall size={16} className="text-emerald-400" />
              <span>اتصال مباشر مع خبراء قطع الغيار</span>
            </a>
          </div>

        </div>
      </section>

      {/* ── 2. DYNAMIC STATS OVERLAP CARDS ── */}
      <section className="-mt-12 relative z-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((st, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xl shadow-slate-900/5 flex flex-col gap-3 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center">
                {st.icon}
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-en tracking-tight block">
                  {st.value}
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-800 block mt-0.5">
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
      <section className="py-24 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#2d7a1f] text-xs font-black uppercase tracking-wider block mb-2 font-en">مبادئنا وقيمنا</span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            لماذا يثق بنا آلاف مالكي السيارات ومراكز الصيانة؟
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-3">
            تأسست سمعتنا على الدقة، الأمانة، والكفالة الحقيقية في كل قطعة غيار تخرج من مستودعاتنا.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pil, idx) => (
            <div
              key={idx}
              className="group bg-white hover:bg-gradient-to-b hover:from-white hover:to-green-50/30 border-2 border-slate-100 hover:border-[#2d7a1f]/40 rounded-[2rem] p-7 transition-all duration-300 shadow-xs hover:shadow-xl hover:shadow-[#2d7a1f]/10 hover:-translate-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-[#2d7a1f] text-slate-700 group-hover:text-white flex items-center justify-center transition-colors duration-300 mb-6">
                  {pil.icon}
                </div>
                <h3 className="text-base font-black text-slate-900 mb-3 group-hover:text-[#2d7a1f] transition-colors">
                  {pil.title}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                  {pil.desc}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-1 text-[11px] font-black text-[#2d7a1f] opacity-80 group-hover:opacity-100">
                <span>معيار الجارحي الأصلي</span>
                <CheckCircle2 size={14} className="text-[#2d7a1f]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. TIMELINE JOURNEY ── */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#2d7a1f] text-xs font-black uppercase tracking-wider block mb-2 font-en">مسيرتنا عبر السنين</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              كيف تطورنا لخدمتكم بشكل أفضل
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-3">
              خطوات ثابتة من النجاح والنمو والابتكار المستمر في قطاع قطع غيار السيارات في الأردن.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((tm, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 rounded-3xl p-7 relative flex flex-col justify-between shadow-xs hover:border-[#2d7a1f]/50 transition-all"
              >
                <div>
                  <span className="inline-block bg-[#2d7a1f]/10 text-[#2d7a1f] font-black text-xs px-3.5 py-1.5 rounded-xl font-en mb-4">
                    {tm.year}
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 mb-2">
                    {tm.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                    {tm.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs font-bold font-en">
                  <span>المرحلة 0{idx + 1}</span>
                  <span className="w-2 h-2 rounded-full bg-[#2d7a1f]" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 5. ACCORDION FAQS ── */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-[#2d7a1f] text-xs font-black uppercase tracking-wider block mb-2 font-en">الأسئلة الشائعة</span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            كل ما تود معرفته عن خدماتنا وكفالتنا
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-3">
            إجابات شريعة وتفصيلية عن أبرز استفسارات العملاء والزبائن.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen 
                    ? "bg-white border-[#2d7a1f]/40 shadow-lg shadow-[#2d7a1f]/5" 
                    : "bg-white border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full text-right px-6 py-5 flex items-center justify-between font-black text-slate-900 text-sm sm:text-base bg-transparent border-0 cursor-pointer transition-colors outline-none"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle size={18} className={isOpen ? "text-[#2d7a1f]" : "text-slate-400"} />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180 text-[#2d7a1f]" : "text-slate-400"
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-slate-600 text-xs sm:text-sm font-medium leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 6. FINAL CTA BANNER ── */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#173a11] rounded-[2.5rem] p-8 sm:p-14 text-white text-center flex flex-col items-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 max-w-2xl">
            هل تحتاج قطعة غيار محددة لسيارتك الآن؟
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-xl mb-8 leading-relaxed">
            تواصل مباشرة مع مهندسي القطع في مركز الجارحي لمطابقة رقم الشاصي وتزويدك بأفضل الأسعار والكفالة الحقيقية.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/store"
              className="bg-[#2d7a1f] hover:bg-[#246118] text-white font-black text-sm px-8 py-4 rounded-2xl shadow-lg shadow-[#2d7a1f]/30 hover:-translate-y-1 transition-all"
            >
              ابحث في المتجر الإلكتروني
            </Link>
            <a
              href="https://wa.me/962789089842?text=مرحبا، اريد الاستفسار عن قطعة غيار"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-slate-100 text-slate-900 font-black text-sm px-8 py-4 rounded-2xl hover:-translate-y-1 transition-all"
            >
              راسلنا على واتساب فوراً
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
