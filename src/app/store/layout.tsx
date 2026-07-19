import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "متجر قطع غيار السيارات | الجارحي - تصفح أكثر من 500 قطعة",
  description:
    "تصفح أضخم تشكيلة من قطع غيار السيارات في الأردن. قطع محركات الهايبرد، أنظمة الكهرباء، الميكانيك، قطع الهيكل والبودي بضمان جودة 100% وتوصيل سريع.",
  keywords: [
    "قطع غيار سيارات",
    "قطع غيار هايبرد",
    "قطع غيار تويوتا",
    "قطع غيار كيا",
    "قطع غيار الأردن",
    "متجر قطع غيار",
    "قطع غيار أصلية",
    "بريك سيارة",
    "فلتر هواء",
    "الجارحي",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://aljarhi-parts.com/store",
  },
  openGraph: {
    title: "متجر قطع غيار السيارات | الجارحي",
    description:
      "أضخم تشكيلة قطع غيار السيارات في الأردن. تويوتا، كيا، هيونداي، فورد وأكثر. جودة مضمونة وأسعار حصرية.",
    url: "https://aljarhi-parts.com/store",
    siteName: "الجارحي لقطع غيار السيارات",
    locale: "ar_JO",
    type: "website",
    images: [
      {
        url: "/assets/images/logo.png",
        width: 1080,
        height: 1080,
        alt: "متجر الجارحي لقطع غيار السيارات",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "متجر قطع غيار السيارات | الجارحي",
    description:
      "أضخم تشكيلة قطع غيار هايبرد، كهرباء وميكانيك في الأردن. جودة مضمونة وتوصيل سريع.",
    images: ["/assets/images/logo.png"],
  },
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
