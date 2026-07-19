import { Metadata } from "next";
import StoreClient from "./StoreClient";

// Unmatched Server-side SEO Metadata for the store catalog
export const metadata: Metadata = {
  title: "متجر قطع غيار السيارات الأصلي | الجارحي لقطع السيارات",
  description: "تسوق التشكيلة الأضخم من قطع غيار محركات الهايبرد، الكهرباء، والميكانيك في الأردن بجودة مضمونة وكفالة حقيقية وأسعار منافسة. شحن سريع لكافة المحافظات.",
  alternates: {
    canonical: "https://aljarhi-parts.com/store",
  },
  openGraph: {
    title: "متجر قطع غيار السيارات الأصلي | الجارحي لقطع السيارات",
    description: "تسوق التشكيلة الأضخم من قطع غيار محركات الهايبرد، الكهرباء، والميكانيك في الأردن بجودة مضمونة وكفالة حقيقية وأسعار منافسة. شحن سريع لكافة المحافظات.",
    url: "https://aljarhi-parts.com/store",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "متجر قطع غيار السيارات الأصلي | الجارحي لقطع السيارات",
    description: "تسوق التشكيلة الأضخم من قطع غيار محركات الهايبرد، الكهرباء، والميكانيك في الأردن بجودة مضمونة وكفالة حقيقية وأسعار منافسة. شحن سريع لكافة المحافظات.",
  },
};

export default function StorePage() {
  return <StoreClient />;
}
