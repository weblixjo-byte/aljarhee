import { SITE_URL } from "../../lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تواصل معنا | الجارحي لقطع غيار السيارات - عمان، الأردن",
  description:
    "تواصل مع متجر الجارحي لقطع غيار السيارات في الأردن. اتصل بنا أو زرنا في معرضنا بمنطقة البيادر، عمان. متاحون للرد على استفساراتك عبر الواتساب والهاتف.",
  keywords: [
    "تواصل معنا الجارحي",
    "رقم هاتف قطع غيار الأردن",
    "عنوان الجارحي عمان",
    "واتساب قطع غيار",
    "فحص سيارة الأردن",
    "خدمة عملاء قطع غيار",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: "تواصل معنا | الجارحي لقطع غيار السيارات",
    description:
      "تواصل مع الجارحي عبر الهاتف أو الواتساب أو زرنا في معرضنا بالبيادر، عمان. نحن هنا لخدمتك.",
    url: `${SITE_URL}/contact`,
    siteName: "الجارحي لقطع غيار السيارات",
    locale: "ar_JO",
    type: "website",
    images: [
      {
        url: "/assets/images/logo.png",
        width: 1080,
        height: 1080,
        alt: "تواصل مع الجارحي لقطع غيار السيارات",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "تواصل معنا | الجارحي لقطع غيار السيارات",
    description:
      "اتصل بنا أو زرنا في البيادر، عمان. خدمة عملاء مميزة وردود سريعة عبر الواتساب.",
    images: ["/assets/images/logo.png"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
