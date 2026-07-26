import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Security Headers ───────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Stop MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Force HTTPS for 1 year
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          // Referrer info
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Restrict browser features
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // XSS filter for older browsers
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
      // Cache static assets aggressively
      {
        source: "/assets/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Prevent robots & crawlers from indexing the admin panel
      {
        source: "/admin(.*)",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },

  // ─── Image Optimisation ─────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wohmrmlthkmxkebmupdn.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // ─── 301 Permanent Redirects for ALL Legacy URLs Straight to /store ────────
  async redirects() {
    return [
      {
        source: "/product/:slug*",
        destination: "/store",
        permanent: true,
      },
      {
        source: "/products/:slug*",
        destination: "/store",
        permanent: true,
      },
      {
        source: "/shop/:slug*",
        destination: "/store",
        permanent: true,
      },
      {
        source: "/product-category/:slug*",
        destination: "/store",
        permanent: true,
      },
      {
        source: "/category/:slug*",
        destination: "/store",
        permanent: true,
      },
      {
        source: "/categories/:slug*",
        destination: "/store",
        permanent: true,
      },
      {
        source: "/النوع/:slug*",
        destination: "/store",
        permanent: true,
      },
      {
        source: "/الماركة/:slug*",
        destination: "/store",
        permanent: true,
      },
      {
        source: "/التصنيف/:slug*",
        destination: "/store",
        permanent: true,
      },
      {
        source: "/المنتج/:slug*",
        destination: "/store",
        permanent: true,
      },
      {
        source: "/المنتجات/:slug*",
        destination: "/store",
        permanent: true,
      },
      {
        source: "/product-tag/:slug*",
        destination: "/store",
        permanent: true,
      },
      {
        source: "/tag/:slug*",
        destination: "/store",
        permanent: true,
      },
      {
        source: "/tags/:slug*",
        destination: "/store",
        permanent: true,
      },
      {
        source: "/brand/:slug*",
        destination: "/store",
        permanent: true,
      },
      {
        source: "/brands/:slug*",
        destination: "/store",
        permanent: true,
      },
      {
        source: "/archives/:slug*",
        destination: "/store",
        permanent: true,
      },
      {
        source: "/item/:slug*",
        destination: "/store",
        permanent: true,
      },
      {
        source: "/items/:slug*",
        destination: "/store",
        permanent: true,
      },
      // ─── Legacy Arabic Pages Redirects ───
      {
        source: "/خدماتنا/:slug*",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%D9%86%D8%A7/:slug*",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/وظائف/:slug*",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/%D9%88%D8%B8%D8%A7%D8%A6%D9%81/:slug*",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/من-نحن-2/:slug*",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/%d9%85%d9%86-%d9%86%d8%ad%d9%86-2/:slug*",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/من-نحن/:slug*",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/%d9%85%d9%86-%d9%86%d8%ad%d9%86/:slug*",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/اتصل-بنا/:slug*",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/%d8%a7%d8%aa%d8%b5%d9%84-%d8%a8%d9%86%d8%a7/:slug*",
        destination: "/contact",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
