"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function BrandsMarquee() {
  const router = useRouter();

  const handleBrandClick = (brandName: string) => {
    router.push(`/store?brand=${brandName}`);
  };

  const brands = [
    {
      name: "toyota",
      title: "تويوتا",
      image: "/assets/images/brands/toyota.png",
    },
    {
      name: "kia",
      title: "كيا",
      image: "/assets/images/brands/kia.png",
    },
    {
      name: "ford",
      title: "ford",
      image: "/assets/images/brands/ford.png",
    },
    {
      name: "nissan",
      title: "نيسان",
      image: "/assets/images/brands/nissan.png",
    },
    {
      name: "mitsubishi",
      title: "ميتسوبيشي",
      image: "/assets/images/brands/mitsubishi.png",
    },
    {
      name: "hyundai",
      title: "هيونداي",
      image: "/assets/images/brands/hyundai.png",
    },
    {
      name: "honda",
      title: "هوندا",
      image: "/assets/images/brands/honda.png",
    },
    {
      name: "lexus",
      title: "لكزس",
      image: "/assets/images/brands/lexus.png",
    },
    {
      name: "mazda",
      title: "مازدا",
      image: "/assets/images/brands/mazda.png",
    },
    {
      name: "chevrolet",
      title: "شيفروليه",
      image: "/assets/images/brands/chevrolet.png",
    },
    {
      name: "mercedes",
      title: "مرسيدس",
      image: "/assets/images/brands/mercedes.png",
    },
    {
      name: "bmw",
      title: "بي إم دبليو",
      image: "/assets/images/brands/bmw.png",
    },
    {
      name: "audi",
      title: "أودي",
      image: "/assets/images/brands/audi.png",
    },
  ];

  // Duplicate items 4 times to ensure seamless infinite looping track without gaps on wide viewports
  const marqueeItems = [...brands, ...brands, ...brands, ...brands];

  return (
    <section className="bg-white py-12 overflow-hidden w-full">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center font-extrabold text-sm sm:text-base text-text-secondary">
          نوفر قطع غيار لكبرى ماركات السيارات العالمية:
        </div>
      </div>

      <div className="relative w-full overflow-hidden" dir="ltr">
        {/* Soft edge fade overlay */}
        <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling track */}
        <div className="flex w-max gap-16 animate-marquee flex-nowrap">
          {marqueeItems.map((brand, idx) => (
            <div
              key={idx}
              onClick={() => handleBrandClick(brand.name)}
              title={brand.title}
              className="group flex items-center justify-center bg-transparent border-0 w-[200px] h-[100px] transition-transform duration-300 cursor-pointer hover:scale-112 shrink-0"
            >
              <img
                src={brand.image}
                alt={brand.title}
                className="max-w-full max-h-[80px] object-contain filter hover:brightness-105 transition-all duration-300 group-hover:scale-108"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
