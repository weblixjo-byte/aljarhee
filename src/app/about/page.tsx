import type { Metadata } from "next";
import AboutClient from "./AboutClient";

// Unmatched Server-side SEO Metadata for the About page
export const metadata: Metadata = {
  title: "من نحن - قصة وتأسيس مركز الجارحي لقطع السيارات",
  description:
    "تعرف على متجر الجارحي لقطع غيار السيارات في عمان الأردن. قصة نجاحنا وقيمنا في توفير قطع غيار محركات الهايبرد والكهرباء والقطع الميكانيكية بجودة مضمونة.",
  keywords: [
    "قصة متجر الجارحي",
    "قطع غيار سيارات الأردن البيادر",
    "تأسيس مركز الجارحي",
    "مبيعات قطع السيارات عمان",
    "ضمان قطع غيار السيارات",
    "كفالة قطع سيارات الأردن",
  ],
  alternates: {
    canonical: "https://aljarhi-parts.com/about",
  },
  openGraph: {
    title: "من نحن - قصة وتأسيس مركز الجارحي لقطع السيارات | الجارحي",
    description:
      "تأسس مركز الجارحي ليكون شريكك الموثوق لتأمين قطع غيار سيارات الهايبرد والكهرباء الأصلية بجودة مضمونة في الأردن.",
    url: "https://aljarhi-parts.com/about",
    siteName: "الجارحي لقطع غيار السيارات",
    locale: "ar_JO",
    type: "website",
    images: [
      {
        url: "/assets/images/logo.png",
        width: 1080,
        height: 1080,
        alt: "من نحن - الجارحي لقطع غيار السيارات",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "من نحن | الجارحي لقطع غيار السيارات",
    description:
      "تعرف على رؤيتنا وقيمنا في توفير أفضل قطع غيار سيارات الهايبرد والميكانيك بالأردن.",
    images: ["/assets/images/logo.png"],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
