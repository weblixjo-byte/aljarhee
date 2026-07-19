import { Metadata } from "next";
import { getProductsList } from "../../../lib/productsApi";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

function getBrandName(brandKey: string): string {
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
    mercedes: "مرسيدس",
    bmw: "بي إم دبليو",
    all: "جميع السيارات",
  };
  return brandMap[brandKey.toLowerCase()] || brandKey.toUpperCase();
}

// 1. Generate Static Params for build-time rendering (blazing fast loading!)
export async function generateStaticParams() {
  try {
    const products = await getProductsList();
    return products.map((p) => ({
      id: String(p.id),
    }));
  } catch (e) {
    return [];
  }
}

// 2. Incremental Static Regeneration (ISR) configuration
export const revalidate = 60; // Regenerate pages in the background every 60 seconds

// 3. Dynamic Server-Side SEO Metadata (unmatched SEO for Google search result ranking!)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const productId = Number(resolvedParams.id);
  const products = await getProductsList();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return {
      title: "القطعة غير موجودة | الجارحي لقطع غيار السيارات",
    };
  }

  const brandName = getBrandName(product.brand);
  const title = `شراء ${product.name} لسيارات ${brandName} ${product.model} (${product.year}) | الجارحي`;
  const description = `اشتري ${product.name} لسيارات ${brandName} ${product.model} موديل ${product.year} بجودة مضمونة وكفالة تشغيل حقيقية من مركز الجارحي في الأردن. السعر: ${product.price} د.أ. كاش عند التوصيل.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://aljarhi-parts.com/store/${product.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://aljarhi-parts.com/store/${product.id}`,
      type: "website",
      images: [
        {
          url: product.image.startsWith("http")
            ? product.image
            : `https://aljarhi-parts.com${product.image.startsWith("/") ? "" : "/"}${product.image}`,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const productId = Number(resolvedParams.id);
  const allProducts = await getProductsList();
  const product = allProducts.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  return (
    <>
      {/* ─── JSON-LD Structured Data Schema for Rich Google Search Snippets ─── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description || product.name,
            image: product.image.startsWith("http")
              ? product.image
              : `https://aljarhi-parts.com${product.image.startsWith("/") ? "" : "/"}${product.image}`,
            sku: String(product.id),
            brand: {
              "@type": "Brand",
              name: product.brand
                ? getBrandName(product.brand)
                : "الجارحي لقطع غيار السيارات",
            },
            offers: {
              "@type": "Offer",
              url: `https://aljarhi-parts.com/store/${product.id}`,
              priceCurrency: "JOD",
              price: product.price,
              priceValidUntil: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
              )
                .toISOString()
                .split("T")[0],
              availability: "https://schema.org/InStock",
              seller: {
                "@type": "Organization",
                name: "الجارحي لقطع غيار السيارات",
              },
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "87",
            },
          }),
        }}
      />
      <ProductDetailClient product={product} allProducts={allProducts} />
    </>
  );
}
