import { SITE_URL } from "../../lib/config";
import type { Metadata } from "next";
import AboutClient from "./AboutClient";

// Unmatched Server-side SEO Metadata for the About page
export const metadata: Metadata = {
  title: "من نحن - قصة وتأسيس مركز الجارحي لقطع السيارات",
  description:
    "تعرف على مركز الجارحي لقطع غيار السيارات في عمان الأردن. قصة نجاحنا في توفير قطع غيار الهايبرد والكهرباء والميكانيك بجودة مضمونة وكفالة حقيقية.",
  keywords: [
    "قصة متجر الجارحي",
    "قطع غيار سيارات الأردن البيادر",
    "تأسيس مركز الجارحي",
    "مبيعات قطع السيارات عمان",
    "ضمان قطع غيار السيارات",
    "كفالة قطع سيارات الأردن",
  ],
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "من نحن - قصة وتأسيس مركز الجارحي لقطع السيارات | الجارحي",
    description:
      "تأسس مركز الجارحي ليكون شريكك الموثوق لتأمين قطع غيار سيارات الهايبرد والكهرباء الأصلية بجودة مضمونة في الأردن.",
    url: `${SITE_URL}/about`,
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

// ISR Caching configuration for Netlify Edge CDN
export const revalidate = 86400;

export default function AboutPage() {
  return <AboutClient />;
}
