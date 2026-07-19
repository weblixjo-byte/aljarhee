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
  HelpCircle
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
      q: "كيف يمكنني التأكد من ملاءمة قطعة الغيار لسيارتي بنسبة 100% قبل الشراء؟",
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
    <main className="flex-grow max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full mt-[100px]" dir="rtl">
      
      {/* 1. Hero Block */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-12 text-right relative overflow-hidden shadow-lg shadow-slate-900/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,122,31,0.2),transparent_70%)] pointer-events-none" />
        <div className="max-w-2xl relative z-10">
          <span className="bg-[#2d7a1f]/30 text-emerald-300 text-[0.65rem] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full inline-block mb-4 border border-emerald-500/20">
            من نحن
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight leading-tight">
            متجر الجارحي — الريادة في قطع غيار سيارات الهايبرد والكهرباء
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
            تأسس مركز الجارحي لقطع غيار السيارات لتلبية حاجة قطاع السيارات في الأردن لقطع غيار موثوقة ومضمونة الجودة. نحن نجمع بين تشكيلة واسعة من قطع الغيار الأصلية الجديدة والمستعملة الفحص، وبين الدقة والخدمة الفنية المحترفة لتأمين القطعة المناسبة لسيارتك من المرة الأولى.
          </p>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-150 rounded-2xl p-5 text-center shadow-xs flex flex-col gap-1 hover:border-slate-200 transition-colors">
            <span className="text-2xl font-black text-[#2d7a1f] font-en">{stat.value}</span>
            <span className="text-slate-500 text-[0.68rem] font-bold">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* 3. Core Values */}
      <div className="mb-16">
        <div className="text-right border-b border-slate-100 pb-4 mb-8">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Award className="text-[#2d7a1f]" size={22} />
            <span>قيمنا ومبادئنا المهنية</span>
          </h2>
          <p className="text-slate-400 text-xs font-bold mt-1">الأسس التي نبني عليها علاقتنا وثقة عملائنا الأوفياء</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-150 rounded-3xl p-6 text-right shadow-xs hover:border-slate-200 transition-all flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] text-[#2d7a1f] flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-sm font-black text-slate-800">الجودة المضمونة</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-bold">
              لا نتهاون أبداً بجودة قطع الغيار. جميع القطع المستعملة تخضع لفحص دقيق للتأكد من الملاءمة التشغيلية، ومطابقتها لمعايير الشركة المصنعة.
            </p>
          </div>

          <div className="bg-white border border-slate-150 rounded-3xl p-6 text-right shadow-xs hover:border-slate-200 transition-all flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Target size={20} />
            </div>
            <h3 className="text-sm font-black text-slate-800">الدقة والمطابقة آلياً</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-bold">
              نطابق قطع الغيار بالاعتماد على رقم الشاصي (Chassis / VIN ID) لنضمن ملاءمتها الكاملة لسيارتك 100% ومنع حدوث أي أخطاء في الطلبات.
            </p>
          </div>

          <div className="bg-white border border-slate-150 rounded-3xl p-6 text-right shadow-xs hover:border-slate-200 transition-all flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <HeartHandshake size={20} />
            </div>
            <h3 className="text-sm font-black text-slate-800">المصداقية والكفالة الحقيقية</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-bold">
              كفالتنا هي كفالة تشغيل حقيقية وسارية المفعول، هدفنا مصلحة العميل قبل كل شيء ونلتزم التزاماً كاملاً بشروط الترجيع والاستبدال.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Timeline Story */}
      <div className="mb-16 bg-slate-50 border border-slate-150 rounded-3xl p-8">
        <div className="text-right pb-4 mb-8">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Calendar className="text-[#2d7a1f]" size={22} />
            <span>مسيرة نمونا ونجاحنا</span>
          </h2>
          <p className="text-slate-400 text-xs font-bold mt-1">تطورنا خطوة بخطوة لتقديم أفضل تجربة لعملائنا بالأردن</p>
        </div>

        <div className="relative border-r border-slate-200 mr-2 flex flex-col gap-8">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative pr-6">
              <div className="absolute right-0 top-1.5 w-3.5 h-3.5 bg-white border-2 border-[#2d7a1f] rounded-full translate-x-1/2 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#2d7a1f] rounded-full" />
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-xs font-black text-[#2d7a1f] font-en">{item.year}</span>
                <h4 className="text-sm font-black text-slate-800">{item.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed max-w-2xl font-bold mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. FAQs Block */}
      <div>
        <div className="text-right border-b border-slate-100 pb-4 mb-8">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <HelpCircle className="text-[#2d7a1f]" size={22} />
            <span>الأسئلة المتكررة والشائعة</span>
          </h2>
          <p className="text-slate-400 text-xs font-bold mt-1">إجابات سريعة وتفصيلية عن أبرز استفسارات عملائنا الكرام</p>
        </div>

        <div className="flex flex-col gap-4 max-w-3xl">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs hover:border-slate-200 transition-colors">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-right px-6 py-4 flex items-center justify-between font-black text-slate-700 hover:text-slate-900 bg-transparent border-0 cursor-pointer text-xs sm:text-sm transition-colors outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className="text-slate-400 transition-transform duration-200 shrink-0 ml-2"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-slate-500 text-xs sm:text-sm font-bold leading-relaxed border-t border-slate-50">
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
