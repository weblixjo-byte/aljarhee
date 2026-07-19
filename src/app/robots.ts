import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/cart/", "/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/cart/", "/api/"],
        crawlDelay: 2,
      },
    ],
    sitemap: "https://aljarhi-parts.com/sitemap.xml",
    host: "https://aljarhi-parts.com",
  };
}
