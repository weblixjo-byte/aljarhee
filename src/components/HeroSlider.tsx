"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { id: 1, image: "/assets/images/HERO (1).jpg",  alt: "هيرو سلايدر 1 - الجارحي لقطع غيار السيارات" },
  { id: 2, image: "/assets/images/HERO (1).png",  alt: "هيرو سلايدر 2 - الجارحي لقطع غيار السيارات" },
  { id: 3, image: "/assets/images/HERO (2).png",  alt: "هيرو سلايدر 3 - الجارحي لقطع غيار السيارات" },
  { id: 4, image: "/assets/images/HERO (3).png",  alt: "هيرو سلايدر 4 - الجارحي لقطع غيار السيارات" },
  { id: 5, image: "/assets/images/HERO (4).png",  alt: "هيرو سلايدر 5 - الجارحي لقطع غيار السيارات" },
  { id: 6, image: "/assets/images/HERO (5).png",  alt: "هيرو سلايدر 6 - الجارحي لقطع غيار السيارات" },
];

const AUTOPLAY_MS = 5000;

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStart = useRef<number | null>(null);
  const touchEnd   = useRef<number | null>(null);
  const MIN_SWIPE  = 50; // px

  // ── Navigation helpers ──────────────────────────────────────────
  const goTo = useCallback((idx: number) => {
    setActiveIndex(((idx % slides.length) + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // ── Autoplay ────────────────────────────────────────────────────
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const handleNav = useCallback((fn: () => void) => {
    fn();
    resetTimer();
  }, [resetTimer]);

  // ── Touch / Swipe handlers ──────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
    touchEnd.current   = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStart.current === null || touchEnd.current === null) return;
    const diff = touchStart.current - touchEnd.current;
    if (Math.abs(diff) >= MIN_SWIPE) {
      handleNav(diff > 0 ? next : prev);
    }
    touchStart.current = null;
    touchEnd.current   = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-white h-[260px] sm:h-[380px] md:h-[500px] lg:h-[580px] xl:h-[650px]"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Slides track (GPU-accelerated translateX) ── */}
      <div
        className="flex h-full will-change-transform"
        style={{
          width: `${slides.length * 100}%`,
          transform: `translateX(${-(activeIndex * (100 / slides.length))}%)`,
          transition: "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="h-full flex-shrink-0"
            style={{ width: `${100 / slides.length}%` }}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-contain select-none"
              draggable={false}
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          </div>
        ))}
      </div>

      {/* ── Arrows ── */}
      <button
        onClick={() => handleNav(prev)}
        className="absolute top-1/2 -translate-y-1/2 left-3 md:left-6 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/90 border border-slate-200 hover:border-brand-green text-slate-800 hover:text-brand-green flex items-center justify-center cursor-pointer transition-all shadow-sm hover:scale-105 active:scale-95"
        aria-label="البانر السابق"
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>

      <button
        onClick={() => handleNav(next)}
        className="absolute top-1/2 -translate-y-1/2 right-3 md:right-6 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/90 border border-slate-200 hover:border-brand-green text-slate-800 hover:text-brand-green flex items-center justify-center cursor-pointer transition-all shadow-sm hover:scale-105 active:scale-95"
        aria-label="البانر التالي"
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>

      {/* ── Dots ── */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { goTo(idx); resetTimer(); }}
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
