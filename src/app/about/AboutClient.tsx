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
  Sparkle
} from "lucide-react";

export default function AboutClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = [
    { value: "+10,000", label: "عميل راضٍ ومستمر" },
    { value: "100%", label: "كفالة فحص وتشغيل" },
    { value: "+5 سنوات", label: "خبرة متخصصة في الأردن" },
    { value: "15,000+", label: "قطعة غيار متوفرة" },
  ];

  const timeline = [
    {
      year: "2021",
      title: "التأسيس والانطلاقة",
      desc: "بدأنا كمعرض محلي متخصص بقطع الهايبرد والكهرباء في منطقة البيادر بعمان، بهدف توفير قطع موثوقة ونادرة بأعلى معايير المصداقية."
    },
    {
      year: "2023",
      title: "التوسع الرقمي والتوصيل للمحافظات",
      desc: "أطلقنا خدمات الشحن الفوري والتوصيل الآمن لجميع محافظات المملكة، مع بناء شراكات مع كبرى مراكز صيانة الهايبرد بالأردن."
    },
    {
      year: "2025",
      title: "إطلاق الكتالوج الذكي",
      desc: "تطوير أنظمتنا الإلكترونية للربط بين القطع وأرقام الشاصي آلياً، لتمكين العملاء من البحث والشراء المباشر بدقة 100%."
    },
    {
      year: "2026",
      title: "الريادة والتطوير المستمر",
      desc: "نخدم اليوم أكثر من 10 آلاف عميل في الأردن بكتالوج ضخم يشمل أكثر من 15 ألف قطعة غيار نشطة ومفحوصة بالكامل."
    }
  ];

  const faqs = [
    {
      q: "ما هي شروط كفالة التشغيل لقطع الغيار التي يقدمها متجر الجارحي؟",
      a: "نحن نضمن أن تعمل القطعة بشكل مثالي فور تركيبها في السيارة. الكفالة تشمل إرجاع القطعة أو استبدالها مجاناً في حال وجود أي خلل مصنعي أو فني خلال فترة الكفالة المتفق عليها (والتي تبدأ من تاريخ استلام القطعة)، بشرط أن يتم التركيب لدى مركز صيانة معتمد وتجنب سوء الاستخدام."
    },
    {
      q: "كيف يمكنني التأكب من ملاءمة قطعة الغيار لسيارتي بنسبة 100% قبل الشراء؟",
      a: "يمكنك الاعتماد على كود القطعة المصنعي (OEM) أو الاستعانة بمحرك البحث الذكي في موقعنا. كخيار أفضل وأكثر أماناً، يمكنك نسخ رقم الشاصي (Chassis / VIN) المكون من 17 حرفاً وإرساله لنا عبر نموذج الطلب أو واتساب، وسيقوم مهندسونا بمطابقة القطعة بكتالوج صانع السيارة الخاص بك مجاناً."
    },
    {
      q: "ما هي خيارات التوصيل المتوفرة ومدة الشحن لجميع المحافظات؟",
      a: "نوفر خدمة التوصيل والشحن الفوري لجميع محافظات المملكة. التوصيل داخل عمان يستغرق 2-6 ساعات، والمحافظات الأخرى بين 24 إلى 48 ساعة كحد أقصى. جميع الطلبات تُشحن مغلفة بشكل آمن ومحمي لمنع التلف."
    },
    {
      q: "هل يقدم متجر الجارحي مبيعات لقطع الغيار بالجملة؟",
      a: "نعم، نحن فخورون بتوريد قطع الغيار لعدد كبير من محلات بيع قطع السيارات ومراكز صيانة الهايبرد المعتمدة في الأردن. للمبيعات الكبرى أو شراكات الجملة، يرجى التواصل معنا مباشرة على رقم قسم الجملة (0788088027) للحصول على عروض أسعار تفضيلية."
    }
  ];

  return (
    <main className="flex-grow max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full mt-[80px] font-sans pb-24" dir="rtl">
      
      {/* 1. Elegant Light Hero Block */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 mb-12 text-right relative overflow-hidden shadow-xs">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,122,31,0.02),transparent_60%)] pointer-events-none" />
        <div className="max-w-3xl relative z-10">
          <span className="inline-flex items-center gap-1 bg-[#2d7a1f]/5 border border-[#2d7a1f]/10 text-[#2d7a1f] font-black text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4">
            <Sparkle size={10} className="fill-[#2d7a1f]" />
            <span>قصتنا ورسالتنا</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mb-4 tracking-tight leading-tight text-slate-900">
            الجارحي لقطع الغيار — الريادة والمصداقية في خدمة سياراتكم
          </h1>
          <p className="text-slate-400 text-xs sm:text-xs font-bold leading-relaxed max-w-2xl">
            تأسس مركز الجارحي لقطع غيار السيارات لتلبية حاجة قطاع السيارات في الأردن لقطع غيار موثوقة ومضمونة الجودة. نحن نجمع بين تشكيلة واسعة من قطع الغيار الأصلية الجديدة والمستعملة الفحص، وبين الدقة والخدمة الفنية المحترفة لتأمين القطعة المناسبة لسيارتك من المرة الأولى.
          </p>
        </div>
      </div>

      {/* 2. Minimalist Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center shadow-xs flex flex-col gap-1.5 hover:border-[#2d7a1f]/35 transition-all duration-300">
            <span className="text-xl sm:text-2xl font-black text-[#2d7a1f] font-en">{stat.value}</span>
            <span className="text-slate-500 text-[10px] font-black">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* 3. Core Values with Cohesive Color Scheme */}
      <div className="mb-16">
        <div className="text-right border-b border-slate-100 pb-5 mb-8">
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Award className="text-[#2d7a1f]" size={20} />
            <span>قيمنا ومبادئنا المهنية</span>
          </h2>
          <p className="text-slate-400 text-xs font-bold mt-1">الأسس التي نبني عليها علاقتنا وثقة عملائنا الأوفياء</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 text-right shadow-xs hover:border-[#2d7a1f]/30 hover:shadow-[0_12px_35px_rgba(45,122,31,0.04)] transition-all duration-300 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#2d7a1f]/5 text-[#2d7a1f] flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-xs sm:text-sm font-black text-slate-800">الجودة المضمونة</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed font-bold">
              لا نتهاون أبداً بجودة قطع الغيار. جميع القطع المستعملة تخضع لفحص دقيق للتأكد من الملاءمة التشغيلية، ومطابقتها لمعايير الشركة المصنعة.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 text-right shadow-xs hover:border-[#2d7a1f]/30 hover:shadow-[0_12px_35px_rgba(45,122,31,0.04)] transition-all duration-300 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#2d7a1f]/5 text-[#2d7a1f] flex items-center justify-center shrink-0">
              <Target size={20} />
            </div>
            <h3 className="text-xs sm:text-sm font-black text-slate-800">الدقة والمطابقة آلياً</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed font-bold">
              نطابق قطع الغيار بالاعتماد على رقم الشاصي (Chassis / VIN ID) لنضمن ملاءمتها الكاملة لسيارتك 100% ومنع حدوث أي أخطاء في الطلبات.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 text-right shadow-xs hover:border-[#2d7a1f]/30 hover:shadow-[0_12px_35px_rgba(45,122,31,0.04)] transition-all duration-300 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#2d7a1f]/5 text-[#2d7a1f] flex items-center justify-center shrink-0">
              <HeartHandshake size={20} />
            </div>
            <h3 className="text-xs sm:text-sm font-black text-slate-800">المصداقية والكفالة الحقيقية</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed font-bold">
              كفالتنا هي كفالة تشغيل حقيقية وسارية المفعول، هدفنا مصلحة العميل قبل كل شيء ونلتزم التزاماً كاملاً بشروط الترجيع والاستبدال.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Elegant Open Timeline Story */}
      <div className="mb-16">
        <div className="text-right border-b border-slate-100 pb-5 mb-8">
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Calendar className="text-[#2d7a1f]" size={20} />
            <span>مسيرة نمونا ونجاحنا</span>
          </h2>
          <p className="text-slate-400 text-xs font-bold mt-1">تطورنا خطوة بخطوة لتقديم أفضل تجربة لعملائنا بالأردن</p>
        </div>

        <div className="relative border-r border-slate-250/70 mr-2 flex flex-col gap-10 max-w-3xl">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative pr-6 group">
              {/* Timeline dot */}
              <div className="absolute right-0 top-1.5 w-3 h-3 bg-white border-2 border-[#2d7a1f] rounded-full translate-x-1/2 flex items-center justify-center transition-all duration-300 group-hover:scale-125 group-hover:bg-[#2d7a1f]" />
              <div className="flex flex-col gap-1 text-right">
                <span className="text-[10px] font-black text-[#2d7a1f] font-en tracking-wider">{item.year}</span>
                <h4 className="text-xs sm:text-sm font-black text-slate-800 group-hover:text-[#2d7a1f] transition-colors">{item.title}</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed max-w-2xl font-bold mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. FAQs Block */}
      <div className="max-w-4xl">
        <div className="text-right border-b border-slate-100 pb-5 mb-8">
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <HelpCircle className="text-[#2d7a1f]" size={20} />
            <span>الأسئلة المتكررة والشائعة</span>
          </h2>
          <p className="text-slate-400 text-xs font-bold mt-1">إجابات سريعة وتفصيلية عن أبرز استفسارات عملائنا الكرام</p>
        </div>

        <div className="flex flex-col gap-4 max-w-3xl">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:border-[#2d7a1f]/30 transition-all duration-300">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-right px-6 py-4 flex items-center justify-between font-black text-slate-700 hover:text-[#2d7a1f] bg-transparent border-0 cursor-pointer text-xs sm:text-sm transition-colors outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className="text-slate-400 transition-transform duration-200 shrink-0 ml-2"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1.5 text-slate-400 text-[11px] sm:text-xs font-bold leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </main>
  );
}
