import type { Metadata } from "next";
import { Cairo, Outfit } from "next/font/google";
import { ToastProvider } from "../context/ToastContext";
import { ProductProvider } from "../context/ProductContext";
import "./globals.css";

import ClientLayout from "../components/ClientLayout";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aljarhi-parts.com"),
  title: {
    default: "الجارحي لقطع غيار السيارات | Al-Jarhee Spare Parts",
    template: "%s | الجارحي لقطع غيار السيارات",
  },
  description:
    "الجارحي لقطع غيار السيارات - التشكيلة الأضخم من قطع غيار محركات الهايبرد، الكهرباء، والميكانيك في الأردن بجودة مضمونة وكفالة حقيقية وأسعار حصرية ومنافسة.",
  keywords: [
    "قطع غيار سيارات الأردن",
    "قطع غيار هايبرد",
    "محرك هايبرد",
    "قطع غيار تويوتا",
    "قطع غيار كيا",
    "قطع غيار هيونداي",
    "متجر قطع غيار عمان",
    "الجارحي قطع غيار",
    "فحص كمبيوتر سيارة",
    "قطع غيار اصلية",
    "spare parts jordan",
    "car parts amman",
    "hybrid parts jordan",
  ],
  authors: [{ name: "الجارحي لقطع غيار السيارات" }],
  creator: "الجارحي لقطع غيار السيارات",
  publisher: "الجارحي لقطع غيار السيارات",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://aljarhi-parts.com",
    languages: {
      "ar-JO": "https://aljarhi-parts.com",
    },
  },
  openGraph: {
    title: "الجارحي لقطع غيار السيارات | Al-Jarhee Spare Parts",
    description:
      "التشكيلة الأضخم من قطع غيار محركات الهايبرد، الكهرباء، والميكانيك في الأردن. جودة مضمونة وكفالة حقيقية.",
    url: "https://aljarhi-parts.com",
    siteName: "الجارحي لقطع غيار السيارات",
    locale: "ar_JO",
    type: "website",
    images: [
      {
        url: "/assets/images/logo.png",
        width: 1080,
        height: 1080,
        alt: "الجارحي لقطع غيار السيارات - Aljarhi For Car AutoParts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "الجارحي لقطع غيار السيارات",
    description:
      "التشكيلة الأضخم من قطع غيار محركات الهايبرد والكهرباء في الأردن.",
    images: ["/assets/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-text-primary">
        <ToastProvider>
          <ProductProvider>
            <ClientLayout>{children}</ClientLayout>
          </ProductProvider>
        </ToastProvider>


        {/* ── Global Floating WhatsApp Button ── */}
        <a
          href="https://wa.me/962789089842"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تواصل معنا على واتساب"
          className="whatsapp-float group"
        >
          {/* Pulse ring */}
          <span className="whatsapp-pulse" />
          {/* Tooltip */}
          <span className="whatsapp-tooltip">تواصل معنا الآن</span>
          {/* Icon */}
          <img
            src="/assets/images/social1.png"
            alt="واتساب"
            className="whatsapp-icon"
          />
        </a>

        <style>{`
          .whatsapp-float {
            position: fixed;
            bottom: 28px;
            left: 24px;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 62px;
            height: 62px;
            border-radius: 50%;
            cursor: pointer;
            text-decoration: none;
            transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
            filter: drop-shadow(0 6px 20px rgba(37, 211, 102, 0.45));
          }
          .whatsapp-float:hover {
            transform: scale(1.12) translateY(-3px);
            filter: drop-shadow(0 10px 28px rgba(37, 211, 102, 0.6));
          }
          .whatsapp-icon {
            width: 62px;
            height: 62px;
            border-radius: 50%;
            display: block;
            object-fit: cover;
          }
          /* Pulse ring animation */
          .whatsapp-pulse {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: rgba(37, 211, 102, 0.35);
            animation: whatsapp-ring 2.2s ease-out infinite;
            pointer-events: none;
          }
          @keyframes whatsapp-ring {
            0%   { transform: scale(1);   opacity: 0.7; }
            70%  { transform: scale(1.65); opacity: 0;   }
            100% { transform: scale(1.65); opacity: 0;   }
          }
          /* Tooltip */
          .whatsapp-tooltip {
            position: absolute;
            left: 74px;
            top: 50%;
            transform: translateY(-50%) translateX(-8px);
            background: #111827;
            color: #fff;
            font-size: 0.72rem;
            font-weight: 800;
            white-space: nowrap;
            padding: 6px 14px;
            border-radius: 10px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease, transform 0.2s ease;
            font-family: var(--font-cairo), sans-serif;
            direction: rtl;
            box-shadow: 0 4px 16px rgba(0,0,0,0.18);
          }
          .whatsapp-tooltip::after {
            content: '';
            position: absolute;
            top: 50%;
            left: -6px;
            transform: translateY(-50%);
            border: 6px solid transparent;
            border-right-color: #111827;
            border-left: 0;
          }
          .whatsapp-float:hover .whatsapp-tooltip {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
          /* Mobile: slightly smaller, tooltip hidden */
          @media (max-width: 640px) {
            .whatsapp-float {
              width: 56px;
              height: 56px;
              bottom: 20px;
              left: 16px;
            }
            .whatsapp-icon {
              width: 56px;
              height: 56px;
            }
            .whatsapp-tooltip {
              display: none;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
