import type { Metadata } from "next";
import { getProductsList } from "../../../lib/productsApi";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const productId = Number(id);

  // Fetch combined list (Supabase + local fallbacks)
  const allProducts = await getProductsList();
  const product = allProducts.find((p) => p.id === productId);

  if (!product) {
    return {
      title: "منتج غير موجود",
      description: "عذراً، المنتج الذي تبحث عنه غير متوفر حالياً في معرض الجارحي لقطع غيار السيارات.",
      robots: { index: false, follow: false },
    };
  }

  const getBrandName = (brandKey: string): string => {
    const brandMap: Record<string, string> = {
      toyota: "تويوتا",
      kia: "كيا",
      hyundai: "هيونداي",
      ford: "فورد",
      honda: "هوندا",
      chevrolet: "شفروليه",
      lexus: "لكزس",
      tesla: "تيسلا",
      byd: "بي واي دي",
      volkswagen: "فولكس فاجن",
      nissan: "نيسان",
      mitsubishi: "ميتسوبيشي",
    };
    return brandMap[brandKey] || brandKey;
  };

  const productBrand = product.brand ? getBrandName(product.brand) : "الجارحي";
  const title = `${product.name} (${productBrand}) | الجارحي لقطع غيار السيارات`;
  const description =
    product.description ||
    `${product.name} لسيارات ${productBrand} - متوفر بجودة عالية وضمان تشغيل حقيقي في معرض الجارحي بالأردن. اطلب الآن لتصلك القطعة سريعاً.`;

  return {
    title,
    description,
    keywords: [
      product.name,
      productBrand,
      product.model || "",
      "قطع غيار سيارات",
      "قطع غيار هايبرد الأردن",
      "الجارحي",
      "البيادر",
    ].filter(Boolean),
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    alternates: {
      canonical: `https://aljarhi-parts.com/store/${product.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://aljarhi-parts.com/store/${product.id}`,
      siteName: "الجارحي لقطع غيار السيارات",
      locale: "ar_JO",
      type: "website",
      images: [
        {
          url: product.image || "/assets/images/logo.png",
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image || "/assets/images/logo.png"],
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
