import { SITE_URL } from "../../lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الوظائف وفرص العمل | الجارحي لقطع غيار السيارات",
  description:
    "انضم لفريق عمل شركة الجارحي لقطع غيار السيارات في الأردن. تصفح الشواغر المتاحة لمهندسي وفنيي مبيعات وفحص قطع الغيار وقدم طلبك الآن.",
  keywords: ["وظائف قطع غيار", "شواغر الأردن", "فرص عمل عمان", "فني سيارات عمان", "وظائف الجارحي"],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: `${SITE_URL}/careers`,
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
