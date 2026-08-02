"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { id: 1, image: "/assets/images/HERO (1).jpg", alt: "الجارحي لقطع غيار السيارات - العروض والقطع 1" },
  { id: 2, image: "/assets/images/HERO (2).jpg", alt: "الجارحي لقطع غيار السيارات - العروض والقطع 2" },
  { id: 3, image: "/assets/images/HERO (3).jpg", alt: "الجارحي لقطع غيار السيارات - العروض والقطع 3" },
  { id: 4, image: "/assets/images/HERO (4).jpg", alt: "الجارحي لقطع غيار السيارات - العروض والقطع 4" },
  { id: 5, image: "/assets/images/HERO (5).jpg", alt: "الجارحي لقطع غيار السيارات - العروض والقطع 5" },
];

const AUTOPLAY_MS = 3800;

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const MIN_SWIPE = 35; // px threshold for swipe

  // 1. Bulletproof Autoplay Loop (Runs continuously without state dependency deadlocks)
  useEffect(() => {
    // Preload all slider images into browser cache immediately for zero-lag transitions
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => clearInterval(interval);
  }, []);

  const goTo = (idx: number) => {
    setActiveIndex(((idx % slides.length) + slides.length) % slides.length);
  };

  const next = () => goTo(activeIndex + 1);
  const prev = () => goTo(activeIndex - 1);

  // ── Touch / Swipe handlers for mobile ───────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
    touchEnd.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStart.current === null || touchEnd.current === null) return;
    const diff = touchStart.current - touchEnd.current;
    if (Math.abs(diff) >= MIN_SWIPE) {
      // In RTL layout: dragging left (diff > 0) goes next, dragging right goes prev
      if (diff > 0) next();
      else prev();
    }
    touchStart.current = null;
    touchEnd.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-white h-[260px] sm:h-[380px] md:h-[500px] lg:h-[580px] xl:h-[650px] select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Slides Container ── */}
      <div className="relative w-full h-full">
        {slides.map((slide, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 visible" : "opacity-0 z-0 invisible pointer-events-none"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-contain select-none"
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      {/* ── Navigation Arrows ── */}
      <button
        onClick={prev}
        className="absolute top-1/2 -translate-y-1/2 left-3 md:left-6 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/90 border border-slate-200 hover:border-brand-green text-slate-800 hover:text-brand-green flex items-center justify-center cursor-pointer transition-all shadow-sm hover:scale-105 active:scale-95"
        aria-label="البانر السابق"
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>

      <button
        onClick={next}
        className="absolute top-1/2 -translate-y-1/2 right-3 md:right-6 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-[#2d7a1f] hover:bg-[#236118] text-white flex items-center justify-center cursor-pointer transition-all shadow-sm hover:scale-105 active:scale-95"
        aria-label="البانر التالي"
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>

      {/* ── Pagination Dots ── */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`h-2.5 rounded-full border-0 cursor-pointer transition-all duration-300 ${
              idx === activeIndex
                ? "w-7 bg-brand-yellow"
                : "w-2.5 bg-slate-300 hover:bg-slate-400"
            }`}
            aria-label={`الذهاب للبانر ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
