"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    {
      id: 1,
      image: "/assets/images/HERO (1).jpg",
      alt: "هيرو سلايدر 1 - الجارحي لقطع غيار السيارات",
    },
    {
      id: 2,
      image: "/assets/images/HERO (1).png",
      alt: "هيرو سلايدر 2 - الجارحي لقطع غيار السيارات",
    },
    {
      id: 3,
      image: "/assets/images/HERO (2).png",
      alt: "هيرو سلايدر 3 - الجارحي لقطع غيار السيارات",
    },
    {
      id: 4,
      image: "/assets/images/HERO (3).png",
      alt: "هيرو سلايدر 4 - الجارحي لقطع غيار السيارات",
    },
    {
      id: 5,
      image: "/assets/images/HERO (4).png",
      alt: "هيرو سلايدر 5 - الجارحي لقطع غيار السيارات",
    },
    {
      id: 6,
      image: "/assets/images/HERO (5).png",
      alt: "هيرو سلايدر 6 - الجارحي لقطع غيار السيارات",
    },
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer.current = setInterval(handleNext, 5000);
  };

  const stopAutoplay = () => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, []);

  const resetAutoplay = () => {
    startAutoplay();
  };

  return (
    <section className="relative w-full overflow-hidden bg-white h-[260px] sm:h-[380px] md:h-[500px] lg:h-[580px] xl:h-[650px]">
      {/* Slides Wrapper */}
      <div className="relative w-full h-full">
        {slides.map((slide, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={slide.id}
              className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10 visible" : "opacity-0 z-0 invisible"
              }`}
            >
              {/* Slide Image with nice SVG fallback inside onerror */}
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => {
          handlePrev();
          resetAutoplay();
        }}
        className="absolute top-1/2 -translate-y-1/2 left-4 md:left-6 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/90 border border-slate-200 hover:border-brand-green text-slate-800 hover:text-brand-green flex items-center justify-center cursor-pointer transition-all shadow-sm hover:scale-105"
        aria-label="البانر السابق"
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>

      <button
        onClick={() => {
          handleNext();
          resetAutoplay();
        }}
        className="absolute top-1/2 -translate-y-1/2 right-4 md:right-6 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/90 border border-slate-200 hover:border-brand-green text-slate-800 hover:text-brand-green flex items-center justify-center cursor-pointer transition-all shadow-sm hover:scale-105"
        aria-label="البانر التالي"
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>

      {/* Dots Indicators */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              handleDotClick(idx);
              resetAutoplay();
            }}
            className={`h-2.5 rounded-full transition-all duration-300 border-0 cursor-pointer ${
              idx === activeIndex
                ? "w-7 bg-brand-yellow"
                : "w-2.5 bg-slate-300 hover:bg-slate-400"
            }`}
            aria-label={`الذهاب للبانر ${idx + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
}
