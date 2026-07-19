import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن | الجارحي لقطع غيار السيارات - خبرة تمتد لأكثر من 15 عاماً",
  description:
    "تعرف على متجر الجارحي لقطع غيار السيارات في الأردن. خبرة تمتد لأكثر من 15 عاماً في توفير قطع غيار هايبرد وكهرباء وميكانيك أصلية بجودة مضمونة وكفالة تشغيل حقيقية.",
  keywords: [
    "الجارحي قطع غيار",
    "متجر قطع غيار الأردن",
    "قطع غيار هايبرد عمان",
    "تاريخ الجارحي",
    "من نحن قطع غيار",
    "معرض قطع غيار البيادر",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://aljarhi-parts.com/about",
  },
  openGraph: {
    title: "من نحن | الجارحي لقطع غيار السيارات",
    description:
      "خبرة تمتد لأكثر من 15 عاماً في توفير قطع غيار سيارات أصلية ومضمونة في الأردن. معرضنا في البيادر، عمان.",
    url: "https://aljarhi-parts.com/about",
    siteName: "الجارحي لقطع غيار السيارات",
    locale: "ar_JO",
    type: "website",
    images: [
      {
        url: "/assets/images/logo.png",
        width: 1080,
        height: 1080,
        alt: "معرض الجارحي لقطع غيار السيارات - عمان الأردن",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "من نحن | الجارحي لقطع غيار السيارات",
    description:
      "تعرف على الجارحي لقطع غيار السيارات في الأردن - أكثر من 15 عاماً من الخبرة والموثوقية.",
    images: ["/assets/images/logo.png"],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
