import React from "react";
import Link from "next/link";
import { Phone, MapPin, Mail, ShieldAlert } from "lucide-react";

export default function Footer() {
  const categories = [
    { name: "قطع الهايبرد والكهرباء", href: "/store?category=hybrid" },
    { name: "المحركات والميكانيك", href: "/store?category=mechanical" },
    { name: "الكهرباء والتكييف", href: "/store?category=electrical" },
    { name: "الهيكل الخارجي والبودي", href: "/store?category=body" },
    { name: "إكسسوارات وعناية بالسيارات", href: "/store?category=accessories" },
  ];

  const quickLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "خدماتنا", href: "/services" },
    { name: "المتجر", href: "/store" },
    { name: "الوظائف", href: "/careers" },
    { name: "من نحن", href: "/about" },
    { name: "تواصل معنا", href: "/contact" },
  ];

  return (
    <footer className="bg-black text-slate-300 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center">
              <img
                src="/assets/images/PPP2.webp"
                alt="شعار الجارحي لقطع السيارات"
                className="h-14 w-auto object-contain brightness-0 invert"
                onError={(e) => {
                  e.currentTarget.src = "/assets/images/logo.png";
                  e.currentTarget.className = "h-14 w-auto object-contain";
                }}
              />
            </div>
            <p className="text-slate-400 text-xs leading-relaxed text-justify">
              تأسست شركة الجارحي لتجارة قطع غيار السيارات لتكون الخيار الأول والأكثر ثقة لمالكي السيارات الهجينة والكهربائية والميكانيك في المملكة الأردنية الهاشمية. نوفر الجودة المضمونة بأفضل الأسعار.
            </p>
            <div className="flex items-center gap-2 border border-slate-900 bg-slate-900/30 p-3 rounded-lg text-[0.7rem] text-slate-400">
              <ShieldAlert className="text-brand-yellow shrink-0" size={16} />
              <span>جميع القطع المتوفرة لدينا أصلية ومكفولة كفالة تشغيل حقيقية.</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-extrabold text-sm border-r-2 border-white pr-2.5">
              تصنيفات قطع الغيار
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
              {categories.map((cat, idx) => (
                <li key={idx}>
                  <Link href={cat.href} className="hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-extrabold text-sm border-r-2 border-white pr-2.5">
              روابط سريعة
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Details */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-extrabold text-sm border-r-2 border-white pr-2.5">
              معلومات الاتصال والفروع
            </h3>
            <ul className="flex flex-col gap-4 text-xs text-slate-400">
              <li className="flex gap-3 text-right">
                <MapPin className="text-white shrink-0 mt-0.5" size={16} />
                <div className="flex flex-col gap-1 text-[0.7rem]">
                  <span className="font-bold text-white">الفرع الأول - البيادر:</span>
                  <span>عمان - البيادر - إشارات الصناعة - بجانب الكابتن.</span>
                  <span className="font-bold text-white mt-1.5">الفرع الثاني - القويسمة:</span>
                  <span>عمان - القويسمة الصناعية - شارع الحارث بن عوف.</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-white shrink-0" size={16} />
                <div className="flex flex-col font-en gap-0.5 text-left text-[0.72rem]">
                  <a href="tel:0789089842" className="hover:text-white transition-colors font-bold text-white">
                    فرع البيادر: 0789089842
                  </a>
                  <a href="tel:0788088097" className="hover:text-white transition-colors">
                    فرع القويسمة: 0788088097
                  </a>
                  <a href="tel:0788088027" className="hover:text-white transition-colors">
                    مبيعات الجملة: 0788088027
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-white shrink-0" size={16} />
                <a href="mailto:aljarhee@hotmail.com" className="hover:text-white transition-colors font-en font-bold">
                  aljarhee@hotmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-900 my-8"></div>

        {/* Copyrights and Credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[0.7rem] text-slate-500">
          <p className="text-center sm:text-right">
            © {new Date().getFullYear()} الجارحي لقطع غيار السيارات. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-1.5" dir="ltr">
            <span>Created by</span>
            <a
              href="https://weblix-jo.com/en"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold font-en text-slate-400 hover:text-green-500 transition-colors duration-200"
            >
              Weblix-JO
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
