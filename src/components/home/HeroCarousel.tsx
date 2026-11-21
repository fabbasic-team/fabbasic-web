"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { HomepageBanner } from "@/types";

interface HeroCarouselProps {
  banners: HomepageBanner[];
}

// Fallback banner if admin has not yet uploaded banners to Supabase
const DEFAULT_FALLBACK_BANNER: HomepageBanner = {
  id: "default-banner-1",
  title: "Refined Fabrics for Modern Tailoring",
  eyebrow: "THE FABRIC EDIT",
  subtitle: "A curated range of shirting and suiting fabrics for every occasion.",
  cta_text: "Shop the Collection",
  cta_link: "/collections",
  desktop_image_url:
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=2000&q=85",
  mobile_image_url:
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85",
  text_alignment: "left",
  overlay_intensity: 45,
  display_order: 1,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default function HeroCarousel({ banners }: HeroCarouselProps) {
  const activeBanners = banners.length > 0 ? banners : [DEFAULT_FALLBACK_BANNER];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const totalBanners = activeBanners.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalBanners);
  }, [totalBanners]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalBanners) % totalBanners);
  }, [totalBanners]);

  // Subtle auto-slide timer (6 seconds), pauses on user hover
  useEffect(() => {
    if (totalBanners <= 1 || isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [totalBanners, isPaused, nextSlide]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  const currentBanner = activeBanners[currentIndex];

  const getAlignmentClasses = (alignment: string) => {
    switch (alignment) {
      case "center":
        return "items-center text-center mx-auto";
      case "right":
        return "items-end text-right ml-auto";
      default:
        return "items-start text-left";
    }
  };

  return (
    <section
      className="relative w-full h-[520px] sm:h-[580px] lg:h-[660px] xl:h-[720px] bg-navy-deep overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Editorial fabric showcase"
    >
      {/* Slides */}
      {activeBanners.map((banner, index) => {
        const isCurrent = index === currentIndex;
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isCurrent ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Desktop Image */}
            <div className="hidden sm:block absolute inset-0">
              <Image
                src={banner.desktop_image_url}
                alt={banner.title}
                fill
                priority={index === 0}
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>

            {/* Mobile Image (Portrait optimized) */}
            <div className="block sm:hidden absolute inset-0">
              <Image
                src={banner.mobile_image_url || banner.desktop_image_url}
                alt={banner.title}
                fill
                priority={index === 0}
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>

            {/* Configurable Darkness Gradient Overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-navy-deep/90 via-navy-deep/60 to-transparent"
              style={{
                opacity: (banner.overlay_intensity ?? 45) / 100,
              }}
            />
            {/* Subtle bottom vignette */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy-deep/80 to-transparent" />

            {/* Slide Content */}
            <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col justify-center">
              <div
                className={`max-w-xl flex flex-col ${getAlignmentClasses(
                  banner.text_alignment
                )} transform transition-transform duration-700 delay-100 ${
                  isCurrent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                {/* Eyebrow */}
                {banner.eyebrow && (
                  <span className="text-gold uppercase text-[11px] sm:text-xs tracking-widest font-semibold mb-3">
                    {banner.eyebrow}
                  </span>
                )}

                {/* Heading */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-ivory font-light leading-[1.12] mb-4 tracking-tight">
                  {banner.title}
                </h1>

                {/* Subtitle */}
                {banner.subtitle && (
                  <p className="text-ivory/80 text-sm sm:text-base font-light mb-8 max-w-md leading-relaxed">
                    {banner.subtitle}
                  </p>
                )}

                {/* CTA Button */}
                <Link
                  href={banner.cta_link || "/collections"}
                  className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 bg-gold hover:bg-gold-hover text-navy font-semibold text-xs sm:text-sm uppercase tracking-luxury rounded transition-all duration-300 shadow-lg hover:shadow-gold/20"
                >
                  <span>{banner.cta_text || "Shop the Collection"}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows (Visible if > 1 slide) */}
      {totalBanners > 1 && (
        <div className="absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-8 pointer-events-none">
          <button
            onClick={prevSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-ivory/30 bg-navy/40 hover:bg-navy/80 text-ivory flex items-center justify-center transition-all duration-200 pointer-events-auto backdrop-blur-sm"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-ivory/30 bg-navy/40 hover:bg-navy/80 text-ivory flex items-center justify-center transition-all duration-200 pointer-events-auto backdrop-blur-sm"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>
      )}

      {/* Slide Indicators: 01  02  03 */}
      {totalBanners > 1 && (
        <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-12 z-30 flex items-center space-x-6 sm:space-x-8">
          {activeBanners.map((_, index) => {
            const isCurrent = index === currentIndex;
            const slideNumber = (index + 1).toString().padStart(2, "0");
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="group flex flex-col items-start focus:outline-none"
                aria-label={`Go to slide ${index + 1}`}
              >
                <span
                  className={`text-xs font-mono tracking-widest transition-colors duration-300 ${
                    isCurrent ? "text-gold font-bold" : "text-ivory/40 group-hover:text-ivory/70"
                  }`}
                >
                  {slideNumber}
                </span>
                <span
                  className={`h-[2px] transition-all duration-500 mt-1 ${
                    isCurrent ? "w-8 bg-gold" : "w-4 bg-ivory/20 group-hover:bg-ivory/40"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
