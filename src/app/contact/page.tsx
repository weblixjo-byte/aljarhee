import type { Metadata } from "next";
import ContactClient from "./ContactClient";

// Unmatched Server-side SEO Metadata for Contact page
export const metadata: Metadata = {
  title: "تواصل معنا - أرقام فروع متجر الجارحي لقطع السيارات",
  description:
    "اتصل بمركز الجارحي لقطع غيار السيارات في الأردن. أرقام هواتف الفروع وقسم مبيعات الجملة. أرسل استفسارك ورقم الشاصي لمطابقة القطعة فوراً.",
  keywords: [
    "تواصل مع الجارحي قطع غيار",
    "رقم هاتف الجارحي للسيارات",
    "الجارحي البيادر",
    "مبيعات الجملة قطع سيارات الأردن",
    "رقم شاصي سيارة استفسار",
  ],
  alternates: {
    canonical: "https://aljarhi-parts.com/contact",
  },
  openGraph: {
    title: "تواصل معنا - أرقام فروع متجر الجارحي لقطع السيارات | الجارحي",
    description:
      "تواصل مع فروعنا، أو أرسل رقم الشاصي لطلب القطعة ومطابقتها مباشرة عبر واتساب.",
    url: "https://aljarhi-parts.com/contact",
    siteName: "الجارحي لقطع غيار السيارات",
    locale: "ar_JO",
    type: "website",
    images: [
      {
        url: "/assets/images/logo.png",
        width: 1080,
        height: 1080,
        alt: "تواصل معنا - الجارحي لقطع غيار السيارات",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "تواصل معنا | الجارحي لقطع غيار السيارات",
    description:
      "أرقام هواتف فروعنا ونموذج الاستفسار الفني لمطابقة قطع الغيار برقم الشاصي.",
    images: ["/assets/images/logo.png"],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
