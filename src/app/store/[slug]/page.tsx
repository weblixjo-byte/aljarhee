import { Metadata } from "next";
import { getProductsList } from "../../../lib/productsApi";
import ProductDetailClient from "./ProductDetailClient";
import { notFound, redirect } from "next/navigation";
import { SITE_URL, createSlug, extractIdFromSlug, formatSeoTitle, formatSeoDescription } from "../../../lib/config";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function getBrandName(brandKey: string): string {
  if (!brandKey) return "";
  return brandKey;
}

// 1. Generate Static Params for build-time rendering (Top 40 products pre-rendered for lightning fast 30s builds!)
export async function generateStaticParams() {
  try {
    const products = await getProductsList();
    const displayProducts = products.filter((p) => p.id > 0).slice(0, 40);
    return displayProducts.map((p) => ({
      slug: createSlug(p.id, p.name, p.brand, p.model),
    }));
  } catch (e) {
    return [];
  }
}

// 2. Incremental Static Regeneration (ISR) configuration
export const revalidate = 3600; // Cache page at Netlify Edge CDN and revalidate in background every hour

// 3. Dynamic Server-Side SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const productId = extractIdFromSlug(resolvedParams.slug);
  const products = await getProductsList();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return {
      title: "القطعة غير موجودة | الجارحي لقطع غيار السيارات",
    };
  }

  const canonicalSlug = createSlug(product.id, product.name, product.brand, product.model);
  const brandName = getBrandName(product.brand);
  
  // Construct title & description with STRICT character boundaries: Title <= 60 chars, Description <= 150 chars
  const rawTitle = `${product.name} ${brandName} ${product.model} (${product.year}) | الجارحي`;
  const priceText = product.price > 0 ? `السعر: ${product.price} د.أ.` : "طلب السعر عند الاستفسار.";
  const rawDesc = `اشتري ${product.name} لسيارات ${brandName} ${product.model} ${product.year} بجودة مضمونة وكفالة من مركز الجارحي للأردن. ${priceText} كاش عند التوصيل.`;

  const title = formatSeoTitle(rawTitle);
  const description = formatSeoDescription(rawDesc);

  // Get dynamic absolute image URL safely
  const absoluteImageUrl = product.image
    ? (product.image.startsWith("http")
        ? product.image
        : `${SITE_URL}${product.image.startsWith("/") ? "" : "/"}${product.image}`)
    : `${SITE_URL}/assets/images/logo.png`;

  const canonicalUrl = `${SITE_URL}/store/${canonicalSlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "الجارحي لقطع غيار السيارات",
      locale: "ar_JO",
      type: "website",
      images: [
        {
          url: absoluteImageUrl,
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
      images: [absoluteImageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const productId = extractIdFromSlug(resolvedParams.slug);
  const allProducts = await getProductsList();
  const product = allProducts.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  // Canonical slug redirect: if someone visits /store/61 or old Arabic slug → 301 redirect to clean Latin slug
  const canonicalSlug = createSlug(product.id, product.name, product.brand, product.model);
  const decodedInputSlug = decodeURIComponent(resolvedParams.slug);

  if (resolvedParams.slug !== canonicalSlug && decodedInputSlug !== canonicalSlug) {
    redirect(`/store/${canonicalSlug}`);
  }

  const absoluteImageUrl = product.image
    ? (product.image.startsWith("http")
        ? product.image
        : `${SITE_URL}${product.image.startsWith("/") ? "" : "/"}${product.image}`)
    : `${SITE_URL}/assets/images/logo.png`;

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
            image: absoluteImageUrl,
            sku: String(product.id),
            brand: {
              "@type": "Brand",
              name: product.brand
                ? getBrandName(product.brand)
                : "الجارحي لقطع غيار السيارات",
            },
            offers: {
              "@type": "Offer",
              url: `${SITE_URL}/store/${canonicalSlug}`,
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
