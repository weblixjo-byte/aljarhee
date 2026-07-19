"use client";

import React, { useState } from "react";
import Link from "next/link";

import { useToast } from "../../context/ToastContext";
import { 
  PhoneCall, 
  MapPin, 
  Clock, 
  Mail, 
  Send, 
  MessageCircle,
  Car,
  FileText,
  User,
  CheckCircle2
} from "lucide-react";

export default function ContactPage() {
  const { showToast } = useToast();
  
  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [carDetails, setCarDetails] = useState("");
  const [message, setMessage] = useState("");
  const [chassisNumber, setChassisNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactCards = [
    {
      icon: <PhoneCall className="w-6 h-6 text-[#2d7a1f]" />,
      title: "فرع البيادر",
      details: "0789089842",
      subtext: "عمان - البيادر - إشارات الصناعة - بجانب الكابتن",
      actionLabel: "اتصل بفرع البيادر",
      actionHref: "tel:0789089842"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-[#2d7a1f]" />,
      title: "فرع القويسمة",
      details: "0788088097",
      subtext: "عمان - القويسمة الصناعية - شارع الحارث بن عوف",
      actionLabel: "اتصل بفرع القويسمة",
      actionHref: "tel:0788088097"
    },
    {
      icon: <MapPin className="w-6 h-6 text-[#2d7a1f]" />,
      title: "مبيعات الجملة",
      details: "0788088027",
      subtext: "للطلبات الكبرى وأسعار الجملة المميزة",
      actionLabel: "اتصل لأسعار الجملة",
      actionHref: "tel:0788088027"
    },
    {
      icon: <Clock className="w-6 h-6 text-[#2d7a1f]" />,
      title: "ساعات العمل والاستقبال",
      details: "السبت - الخميس: 8:30 ص - 7:00 م",
      subtext: "يوم الجمعة عطلة رسمية للمستودعات والمعرض",
      actionLabel: "راسلنا على واتساب",
      actionHref: "https://wa.me/962789089842?text=مرحبا، اريد الاستفسار عن قطعة غيار"
    }
  ];

  // Submit handler: Formats message and opens WhatsApp for direct ordering
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      showToast("يرجى ملء جميع الحقول المطلوبة (الاسم، الهاتف، الاستفسار)", "error");
      return;
    }

    setIsSubmitting(true);

    // Format WhatsApp message text
    const waText = encodeURIComponent(
      `*استفسار قطعة غيار - متجر الجارحي*\n\n` +
      `👤 *الاسم:* ${name}\n` +
      `📞 *الهاتف:* ${phone}\n` +
      `🚗 *السيارة:* ${carDetails || "غير محدد"}\n` +
      `🆔 *رقم الشاصي:* ${chassisNumber || "غير محدد"}\n\n` +
      `💬 *الطلب/الاستفسار:*\n${message}`
    );

    // Simulated short delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast("تم تجهيز طلبك بنجاح! سيتم تحويلك إلى واتساب للإرسال.", "success");
      
      // Redirect to WhatsApp
      window.open(`https://wa.me/962789089842?text=${waText}`, "_blank");
      
      // Reset form on submission
      setName("");
      setPhone("");
      setCarDetails("");
      setChassisNumber("");
      setMessage("");
    }, 1200);
  };

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
              <span className="text-white">تواصل معنا</span>
            </div>
            <h1 className="text-3xl sm:text-4.5xl font-black tracking-tight leading-tight mb-4">
              يسعدنا دائماً تواصلك معنا
            </h1>
            <p className="text-slate-350 text-sm sm:text-base max-w-3xl leading-relaxed font-medium">
              هل تبحث عن قطعة غيار محددة؟ أو ترغب بالاستفسار عن أسعار بطاريات الهايبرد وكفالاتها؟ املأ النموذج الفني بالأسفل أو تواصل معنا فوراً عبر القنوات المتاحة.
            </p>
          </div>
        </section>

        {/* ── Contact Info Cards Grid ── */}
        <section className="py-24 bg-white relative z-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactCards.map((card, idx) => (
                <div 
                  key={idx}
                  className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-slate-200/80 transition-all duration-300 flex flex-col justify-between text-right"
                >
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#2d7a1f]/10 flex items-center justify-center shrink-0 shadow-xs">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 mb-1">{card.title}</h3>
                      <p className="text-xs font-black text-slate-800 font-en leading-normal mb-1.5">{card.details}</p>
                      <p className="text-slate-450 text-[0.68rem] leading-relaxed font-medium">{card.subtext}</p>
                    </div>
                  </div>
                  <div className="pt-5 border-t border-slate-50 mt-5">
                    <a 
                      href={card.actionHref}
                      target={card.actionHref.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="text-xs font-black text-[#2d7a1f] hover:text-[#246118] flex items-center gap-1 hover:translate-x-[-2px] transition-all"
                    >
                      <span>{card.actionLabel}</span>
                      <span className="font-en">←</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Interactive Contact Form & Location Map ── */}
        <section className="py-24 bg-slate-50/50 border-t border-slate-100">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              
              {/* Right Column: Google Maps Location Map */}
              <div className="lg:col-span-6 w-full flex flex-col gap-6 order-2 lg:order-1">
                <div className="text-right">
                  <h3 className="text-lg font-black text-slate-900 mb-2">موقعنا الجغرافي على الخريطة</h3>
                  <p className="text-slate-450 text-xs font-bold">تفضل بزيارة معرضنا الرئيسي في عمان لمشاهدة وفحص القطع بنفسك قبل الاستلام.</p>
                </div>
                <div className="w-full aspect-[4/3] sm:aspect-video lg:aspect-square max-h-[500px] rounded-[2rem] overflow-hidden shadow-lg border border-slate-200/80 bg-white p-2">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3385.556636406542!2d35.8387753!3d31.945792500000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca1621f0175eb%3A0xc7f00f3cba340412!2z2KfZhNis2KfYsdit2Yog2YTZgti32Lkg2LPZitin2LHYp9iqINin2YTZh9in2YrYqNix2K8!5e0!3m2!1sar!2sjo!4v1784403825269!5m2!1sar!2sjo"
                    className="w-full h-full rounded-2xl"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  ></iframe>
                </div>
              </div>

              {/* Left Column: Form Container */}
              <div className="lg:col-span-6 bg-white border border-slate-150 shadow-xl rounded-[2.5rem] p-8 sm:p-10 text-right order-1 lg:order-2">
                <div className="mb-8">
                  <h3 className="text-xl font-black text-slate-900 mb-2">نموذج الاستفسار الفني</h3>
                  <p className="text-slate-400 text-xs font-bold">يرجى ملء النموذج، وسيقوم النظام الفني بمطابقة القطعة والرد عليك فوراً.</p>
                </div>

                {isSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center flex flex-col items-center gap-4 animate-fade-in">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#2d7a1f] flex items-center justify-center">
                      <CheckCircle2 size={32} />
                    </div>
                    <h4 className="text-base font-black text-slate-900">تم إرسال الطلب بنجاح!</h4>
                    <p className="text-slate-600 text-xs leading-relaxed max-w-sm">
                      تم تحويل استفسارك إلى الواتساب الخاص بالدعم الفني لمطابقته الفورية مع رقم الشاصي لسيارتك.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black px-6 py-2.5 rounded-xl transition-all cursor-pointer mt-2"
                    >
                      إرسال استفسار آخر
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                        <User size={14} className="text-slate-400" />
                        <span>الاسم الكامل <span className="text-red-500">*</span></span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="مثال: محمد علي"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-3 px-4 text-xs font-bold text-slate-800 text-right font-sans"
                      />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                        <PhoneCall size={14} className="text-slate-400" />
                        <span>رقم الهاتف / الواتساب <span className="text-red-500">*</span></span>
                      </label>
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="مثال: 0790000000"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-3 px-4 text-xs font-bold text-slate-800 text-right font-sans"
                      />
                    </div>

                    {/* Car Model */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                        <Car size={14} className="text-slate-400" />
                        <span>نوع السيارة وسنة الصنع <span className="text-slate-400 font-normal">(اختياري)</span></span>
                      </label>
                      <input 
                        type="text" 
                        value={carDetails}
                        onChange={(e) => setCarDetails(e.target.value)}
                        placeholder="مثال: تويوتا بريوس 2018"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-3 px-4 text-xs font-bold text-slate-800 text-right font-sans"
                      />
                    </div>

                    {/* Chassis Number */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                        <FileText size={14} className="text-slate-400" />
                        <span>رقم الشاصي - VIN <span className="text-slate-400 font-normal">(اختياري لمطابقة أدق)</span></span>
                      </label>
                      <input 
                        type="text" 
                        value={chassisNumber}
                        onChange={(e) => setChassisNumber(e.target.value)}
                        placeholder="رقم الشاصي المكون من 17 رمزاً"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-3 px-4 text-xs font-bold text-slate-800 text-right font-sans font-en uppercase"
                        maxLength={17}
                      />
                    </div>

                    {/* Inquiry Message */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                        <Send size={14} className="text-slate-400" />
                        <span>الطلب أو تفاصيل القطعة المطلوبة <span className="text-red-500">*</span></span>
                      </label>
                      <textarea 
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="مثال: أريد استفسار عن مروحة تبريد راديتر وبطارية هايبرد كاملة لسيارة تويوتا..."
                        rows={4}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-3 px-4 text-xs font-bold text-slate-800 text-right font-sans resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#2d7a1f] hover:bg-[#246118] text-white py-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#2d7a1f]/10 hover:-translate-y-0.5 border-0 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:-translate-y-0"
                    >
                      <MessageCircle size={16} />
                      <span>{isSubmitting ? "جاري التجهيز..." : "إرسال الاستفسار عبر واتساب"}</span>
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </section>

      </main>
    </>
  );
}
