import { MetadataRoute } from "next";
import { productsData } from "../data/products";
import importedProductsStatic from "../data/imported_products.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aljarhi-parts.com";

  // Combine static and imported products
  const allProducts = [...productsData];
  const staticImported = importedProductsStatic as any[];

  if (staticImported && staticImported.length > 0) {
    staticImported.forEach((p) => {
      if (!allProducts.some((item) => item.id === p.id)) {
        allProducts.push(p);
      }
    });
  }

  // Base static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamically map every product to the sitemap
  const productRoutes = allProducts.map((product) => ({
    url: `${baseUrl}/store/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...routes, ...productRoutes];
}
