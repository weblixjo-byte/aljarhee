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

export default function AboutPage() {
  // FAQ accordion state
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
      q: "كيف تضمنون مطابقة قطعة الغيار لسيارتي وتوافقها التام؟",
      a: "لدينا نظام تصنيف ذكي وبرامج فحص متطورة نعتمد فيها على رقم الشاصي (VIN) الخاص بسيارتك. بمجرد تواصلك معنا أو إدخال تفاصيل سيارتك، يقوم خبراؤنا بمطابقة رمز القطعة المصنعي مع الكتالوج الأصلي لشركة تصنيع السيارة (مثل تويوتا، فورد، كيا، هيونداي) لضمان توافقها التام قبل الشحن."
    },
    {
      q: "كم تستغرق عملية التوصيل داخل الأردن، وما هي كلفة الشحن؟",
      a: "التوصيل داخل العاصمة عمان يستغرق من ساعتين إلى 4 ساعات في نفس اليوم. بالنسبة للمحافظات الأخرى (مثل إربد، الزرقاء، العقبة، الكرك، السلط)، يتم الشحن والتسليم خلال 24 ساعة كحد أقصى. كلفة الشحن رمزية وتحدد حسب المنطقة والوزن وتظهر لك بوضوح عند تأكيد الطلب."
    },
    {
      q: "هل يتوفر لديكم قطع غيار أصلية لبطاريات سيارات الهايبرد والكهرباء؟",
      a: "نعم، نحن متخصصون في استيراد وفحص بطاريات الهايبرد وأنظمة الطاقة لسيارات التويوتا، الكيا، الهيونداي، والفورد. نوفر خلايا بطاريات مفحوصة بدقة على أجهزة الشحن والتفريغ المحوسبة لضمان كفاءة أداء خلايا البطارية وعمرها التشغيلي."
    },
    {
      q: "هل يوفر متجر الجارحي خدمات تركيب القطع داخل المعرض؟",
      a: "معرضنا متخصص في بيع وتوفير قطع الغيار المستوردة والجديدة وتوصيلها، ولكننا نرتبط بشراكات وثيقة مع نخبة من أفضل مراكز الصيانة الفنية المعتمدة في البيادر ومختلف المناطق، حيث يمكننا توجيهكم للمركز الأنسب لتركيب القطعة بكفاءة عالية وأجور تفضيلية."
    }
  ];

  return (
    <>
      <main className="flex-1">
        
        {/* ── Breadcrumb & Hero Header ── */}
        <section className="bg-slate-900 text-white py-24 relative overflow-hidden text-right">
          {/* Decorative design */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(45,122,31,0.2),transparent_70%)]" />
          <div className="absolute top-0 right-0 w-full h-full bg-slate-950/20" />
          
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-4 justify-start">
              <Link href="/" className="hover:text-brand-green transition-colors">الرئيسية</Link>
              <span className="font-en">/</span>
              <span className="text-white">من نحن</span>
            </div>
            <h1 className="text-3xl sm:text-4.5xl font-black tracking-tight leading-tight mb-4">
              الجارحي لقطع غيار السيارات
            </h1>
            <p className="text-slate-350 text-sm sm:text-base max-w-3xl leading-relaxed font-medium">
              الوجهة الأولى والموثوقة في الأردن لتوفير قطع غيار سيارات الهايبرد، الكهرباء، والقطع الميكانيكية بجودة مضمونة، مطابقة تامة لرقم الشاصي، وبكفالة تشغيل حقيقية.
            </p>
          </div>
        </section>

        {/* ── Stats Highlight ── */}
        <section className="bg-white border-b border-slate-100 py-10 relative z-20 -mt-8 max-w-[1100px] mx-auto rounded-3xl shadow-xl px-6 sm:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-slate-50">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-1.5 border-l last:border-l-0 border-slate-100">
              <span className="text-2xl sm:text-3.5xl font-black text-[#2d7a1f] font-en leading-none">
                {stat.value}
              </span>
              <span className="text-slate-500 text-[0.7rem] font-bold">
                {stat.label}
              </span>
            </div>
          ))}
        </section>

        {/* ── Detailed Story & Vision Section ── */}
        <section className="py-24 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              
              {/* Left Column: Visual Overlapping Layout */}
              <div className="lg:col-span-6 relative flex justify-center">
                <div className="relative w-full max-w-[480px] aspect-square rounded-[3rem] bg-slate-50 border border-slate-100 p-3 shadow-md">
                  <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
                    <img 
                      src="/assets/images/about_store_interior.png" 
                      alt="معرض ومستودعات الجارحي" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/10" />
                  </div>

                  {/* Absolute Badge */}
                  <div className="absolute -bottom-4 -left-4 bg-slate-900 text-white rounded-2xl p-5 shadow-xl text-right max-w-[240px] border border-slate-800">
                    <Wrench className="text-brand-green mb-2" size={24} />
                    <h4 className="text-xs font-black mb-1">مطابقة لرقم الشاصي</h4>
                    <p className="text-slate-400 text-[0.65rem] font-medium leading-relaxed">
                      فحص دقيق ومطابقة فنية تامة لمنع استلام أي قطعة غير متوافقة مع موديل سيارتك.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Detailed Text */}
              <div className="lg:col-span-6 text-right flex flex-col gap-6">
                <span className="text-[#2d7a1f] text-xs font-black uppercase tracking-wider block mb-1">
                  قصتنا ورسالتنا
                </span>
                <h2 className="text-2xl sm:text-3.5xl font-black text-slate-900 tracking-tight leading-tight">
                  الريادة والموثوقية في توفير قطع السيارات الهجينة والكهربائية
                </h2>
                <p className="text-slate-650 text-sm leading-relaxed font-medium">
                  تأسس متجر الجارحي لقطع غيار السيارات لتلبية الطلب المتزايد في السوق الأردني على قطع غيار موثوقة وعالية الجودة للسيارات الهجينة (الهايبرد) والكهربائية الحديثة. نحن نتفهم المعاناة المستمرة لأصحاب المركبات في العثور على قطع غيار مطابقة ومضمونة وبكفالة حقيقية دون التعرض للتلاعب بالأسعار أو استلام قطع تالفة أو غير متوافقة فتيّاً مع سياراتهم.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  لذلك، قمنا ببناء فريق عمل فني متكامل وقاعدة بيانات ذكية تعتمد بشكل كامل على أرقام شواصي السيارات لمطابقة الرموز المصنعية قبل البيع. نحن لا نوفر مجرد قطع غيار، بل نمنحك تجربة تسوق آمنة وموثوقة مدعومة بالاستشارات الفنية الدقيقة لتسهيل عملية الصيانة ورفع كفاءة سيارتك.
                </p>
                <p className="text-slate-500 text-xs font-bold leading-relaxed border-r-4 border-[#2d7a1f] pr-4">
                  رسالتنا هي تمكين كل مالك سيارة في الأردن من الحصول على قطعة الغيار المناسبة بنقرة زر واحدة، مع شحن آمن وسريع وكفالة تشغيل حقيقية تضمن ثقتك الكاملة بمركزنا.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ── Milestones Timeline Section ── */}
        <section className="py-24 bg-slate-50/50 border-y border-slate-100">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-[#2d7a1f] text-xs font-black uppercase tracking-wider block mb-1.5">مسيرتنا</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">محطات تاريخية في قصة نجاحنا</h2>
              <p className="text-slate-400 text-xs font-bold mt-1">تطورنا وخطواتنا الثابتة نحو الريادة في سوق قطع الغيار بالأردن</p>
            </div>

            {/* Timeline Layout */}
            <div className="relative border-r border-slate-200 pr-8 md:pr-12 max-w-3xl mx-auto flex flex-col gap-12">
              {timeline.map((step, idx) => (
                <div key={idx} className="relative text-right group">
                  {/* Circle dot marker */}
                  <div className="absolute -right-[39px] md:-right-[55px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-[#2d7a1f] group-hover:scale-120 transition-transform duration-300 z-10 shadow-xs" />
                  
                  {/* Content Box */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs group-hover:shadow-md group-hover:border-slate-200/80 transition-all duration-300">
                    <span className="inline-block bg-[#2d7a1f]/10 text-[#2d7a1f] font-en text-sm font-black px-3 py-1 rounded-lg mb-3">
                      {step.year}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* ── Frequently Asked Questions Accordion ── */}
        <section className="py-24 bg-slate-50/50 border-t border-slate-100">
          <div className="max-w-[850px] mx-auto px-4 sm:px-6">
            
            <div className="text-center mb-16">
              <span className="text-[#2d7a1f] text-xs font-black uppercase tracking-wider block mb-2.5">
                الأسئلة الشائعة
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                هل لديك استفسارات؟ إليك الإجابات المباشرة
              </h2>
              <p className="text-slate-400 text-xs font-bold mt-2">
                إجابات تفصيلية وشاملة حول كفالات التشغيل، الشحن، المطابقة مع السيارات، والمزيد
              </p>
            </div>

            {/* FAQ List */}
            <div className="flex flex-col gap-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:border-slate-200 transition-all duration-200"
                  >
                    {/* Header trigger */}
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full px-6 py-5 flex items-center justify-between gap-4 text-right cursor-pointer bg-transparent border-0 outline-none"
                    >
                      <span className={`text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-[#2d7a1f]" : ""}`}>
                        <ChevronDown size={18} />
                      </span>
                      <span className={`text-xs sm:text-sm font-black transition-colors ${isOpen ? "text-[#2d7a1f]" : "text-slate-800"}`}>
                        {faq.q}
                      </span>
                    </button>

                    {/* Answer content */}
                    <div 
                      className={`transition-all duration-300 ease-in-out overflow-hidden text-right ${
                        isOpen ? "max-h-[300px] border-t border-slate-50" : "max-h-0"
                      }`}
                    >
                      <div className="p-6 text-xs sm:text-sm leading-relaxed text-slate-500 font-medium">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ── Call To Action Section ── */}


      </main>
    </>
  );
}
