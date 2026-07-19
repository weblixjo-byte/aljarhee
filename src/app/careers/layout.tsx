import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الوظائف وفرص العمل | الجارحي لقطع غيار السيارات",
  description:
    "انضم إلى فريق عمل شركة الجارحي لقطع غيار السيارات في الأردن. تصفح أحدث الشواغر المتاحة لمهندسي صيانة، فنيي فحص كمبيوتر، موظفي مبيعات قطع غيار وأكثر.",
  keywords: ["وظائف قطع غيار", "شواغر الأردن", "فرص عمل عمان", "فني سيارات عمان", "وظائف الجارحي"],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://aljarhi-parts.com/careers",
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
