"use client";

import Link from "next/link";
import Image from "next/image";
import { useParallax } from "@/hooks/useParallax";
import heroBg from "@/assets/cookie-stack-lean.jpg";
import clearLogo from "@/assets/clear-logo.png";

export default function Hero() {
  const parallaxOffset = useParallax({ speed: 0.3 });

  return (
    <section className="relative min-h-[calc(100vh-64px)] md:h-[85vh] md:min-h-[600px] flex items-center justify-center overflow-hidden py-12 md:py-0">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 w-full h-[120%]"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        >
          <Image
            src={heroBg}
            alt="Fresh baked cookies"
            fill
            className="object-cover"
            priority
            quality={90}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-morselCream/60 via-morselCream/70 to-morselCream/80 z-10" />
        <div className="absolute inset-0 bg-black/20 z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 w-full">
        <div className="max-w-2xl">
          {/* Large Logo */}
          <div className="mb-4 md:mb-8 flex justify-center md:justify-start">
            <Image
              src={clearLogo}
              alt="Marilyn's Morsels"
              width={400}
              height={200}
              className="w-40 sm:w-56 md:w-80 lg:w-96 h-auto drop-shadow-2xl max-w-full"
              priority
            />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-4 md:mb-6 text-white drop-shadow-lg [text-shadow:0_2px_8px_rgba(0,0,0,0.3)]">
            Small-batch cookies,{" "}
            <span className="text-morselGoldLight [text-shadow:0_2px_8px_rgba(0,0,0,0.4)]">still warm in spirit.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/95 mb-6 md:mb-8 font-body max-w-xl drop-shadow-md [text-shadow:0_1px_4px_rgba(0,0,0,0.3)]">
            Baked fresh in a licensed home kitchen with real butter, premium chocolate, and zero shortcuts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pb-4 md:pb-0">
            <Link
              href="/shop"
              className="px-6 py-3 md:px-8 md:py-4 bg-morselCocoa text-white text-base font-semibold rounded-full shadow-button hover:shadow-button-hover hover:scale-[1.02] transition-all duration-200 text-center"
            >
              Shop Cookies
            </Link>
            <Link
              href="/bulk-orders"
              className="px-6 py-3 md:px-8 md:py-4 bg-white/95 text-morselCocoa text-base font-semibold rounded-full shadow-button hover:shadow-button-hover hover:scale-[1.02] transition-all duration-200 text-center border-2 border-white/50"
            >
              Order for Events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
