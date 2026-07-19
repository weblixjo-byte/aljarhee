import type { Metadata } from "next";
import Link from "next/link";
import { Cpu, Wrench, FileText, CheckCircle2, Shield, Clock, HelpCircle, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "خدماتنا - فحص الكمبيوتر وتشخيص الأعطال",
  description:
    "خدمات الجارحي لقطع غيار السيارات: فحص كمبيوتر السيارة، تشخيص الأعطال الكهربائية والميكانيكية، وإصدار تقرير مطبوع شامل. احجز موعدك الآن في عمان، الأردن.",
  keywords: [
    "فحص كمبيوتر سيارة الأردن",
    "تشخيص أعطال السيارة",
    "خدمة فحص المركبات عمان",
    "اكواد الخطأ سيارة",
    "فحص الكترونيات السيارة",
    "تقرير فحص سيارة",
    "صيانة هايبرد الأردن",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://aljarhi-parts.com/services",
  },
  openGraph: {
    title: "خدماتنا - فحص الكمبيوتر وتشخيص الأعطال | الجارحي",
    description:
      "فحص كمبيوتر متكامل، تشخيص دقيق للأعطال، وتقرير مطبوع شامل لسيارتك. خدماتنا في عمان، الأردن.",
    url: "https://aljarhi-parts.com/services",
    siteName: "الجارحي لقطع غيار السيارات",
    locale: "ar_JO",
    type: "website",
    images: [
      {
        url: "/assets/images/logo.png",
        width: 1080,
        height: 1080,
        alt: "خدمات الجارحي لقطع غيار السيارات - فحص وتشخيص",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "خدماتنا | الجارحي لقطع غيار السيارات",
    description:
      "فحص كمبيوتر متكامل وتقرير شامل لسيارتك. احجز موعدك الآن.",
    images: ["/assets/images/logo.png"],
  },
};

export default function ServicesPage() {
  const mainServices = [
    {
      icon: <Cpu className="w-6 h-6 text-brand-green" />,
      title: "فحص كمبيوتر السيارة",
      desc: "فحص إلكتروني متكامل لكافة الأنظمة والكمبيوترات والحساسات في السيارة باستخدام أحدث الأجهزة الفنية.",
    },
    {
      icon: <Wrench className="w-6 h-6 text-brand-green" />,
      title: "تحديد وتشخيص الأعطال",
      desc: "قراءة وتفسير أكواد الخطأ وتحديد المشاكل الميكانيكية والكهربائية بدقة لتجنب الصيانة الخاطئة.",
    },
    {
      icon: <FileText className="w-6 h-6 text-brand-green" />,
      title: "تقرير مطبوع وموثق",
      desc: "تقرير مطبوع وشامل يوضح كافة الأعطال المكتشفة لمساعدتك في عملية الإصلاح أو كمرجع لحالة السيارة.",
    },
  ];

  const specs = [
    {
      icon: <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />,
      title: "السيارات المشمولة بالفحص",
      desc: "تشمل الخدمة فحص مختلف فئات وماركات السيارات (الأمريكي، الياباني، الكوري، الصيني).",
    },
    {
      icon: <Shield className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />,
      title: "شروط وضوابط الخدمة",
      desc: "الخدمة مخصصة للفحص والتشخيص فقط ولا تشمل تكلفة إصلاح الأعطال المكتشفة.",
    },
    {
      icon: <Clock className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />,
      title: "صلاحية الخدمة وأوقات العمل",
      desc: "التقرير ساري لمدة 30 يوماً. أوقات العمل من السبت إلى الخميس (8:30 ص - 7:00 م).",
    },
  ];

  return (
    <div className="bg-slate-50/50 min-h-screen py-24 font-sans text-right" dir="rtl">
      <div className="max-w-[950px] mx-auto px-4 sm:px-6">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-4 justify-start">
          <Link href="/" className="hover:text-brand-green transition-colors">الرئيسية</Link>
          <span className="font-en">/</span>
          <span className="text-slate-650">خدماتنا</span>
        </div>

        {/* Hero Section Header */}
        <div className="text-right mb-14">
          <span className="text-[#2d7a1f] text-xs font-black uppercase tracking-wider block mb-2.5 font-en">مستوى جديد من الدقة</span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            خدمات الفحص والتشخيص
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-3 max-w-2xl leading-relaxed">
            نساعدك على معرفة حالة سيارتك الإلكترونية والميكانيكية بكل شفافية ودقة لتحديد القطع المناسبة وتجنب التكاليف الإضافية.
          </p>
        </div>

        {/* Grid of Main Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {mainServices.map((srv, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-slate-100/70 p-6 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.015)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:border-slate-200 transition-all duration-300 flex flex-col gap-4 text-right"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                {srv.icon}
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 mb-2">{srv.title}</h3>
                <p className="text-slate-550 text-xs sm:text-sm leading-relaxed font-medium">{srv.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Specs & Info Section */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.01)] mb-12">
          <h2 className="text-lg font-black text-slate-900 mb-6 border-r-4 border-[#2d7a1f] pr-3.5 leading-none">تفاصيل الخدمة وضوابطها</h2>
          
          <div className="flex flex-col gap-6">
            {specs.map((item, index) => (
              <div key={index} className="flex gap-4 items-start border-b border-slate-50 pb-5 last:border-b-0 last:pb-0">
                <div className="w-10 h-10 rounded-lg bg-emerald-50/50 flex items-center justify-center border border-emerald-100/30 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 mb-1">{item.title}</h4>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden text-right shadow-lg shadow-slate-900/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(45,122,31,0.15),transparent_70%)]" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-lg sm:text-xl font-black mb-2.5">هل ترغب بحجز موعد لفحص سيارتك؟</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                تواصل معنا مباشرة عبر الواتساب لتحديد الموعد الأنسب لك في فرع البيادر أو فرع القويسمة.
              </p>
            </div>
            
            <a
              href="https://wa.me/962789089842"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#2d7a1f] hover:bg-[#379427] text-white px-8 py-3.5 rounded-xl font-black text-xs transition-all shadow-md shrink-0 border-0 hover:-translate-y-0.5 cursor-pointer"
            >
              <Phone size={14} className="text-white" />
              <span>احجز موعد الآن</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
