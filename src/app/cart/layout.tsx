import { SITE_URL } from "../../lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سلة التسوق | الجارحي لقطع غيار السيارات",
  description:
    "مراجعة سلة تسوقك لدى الجارحي لقطع غيار السيارات. أتمّ طلبك بسهولة وأمان مع خيارات توصيل متعددة وضمان جودة على جميع قطع الغيار.",
  keywords: [
    "سلة تسوق قطع غيار",
    "شراء قطع غيار أونلاين الأردن",
    "طلب قطع غيار سيارة",
    "الجارحي أونلاين",
  ],
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  alternates: {
    canonical: `${SITE_URL}/cart`,
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
