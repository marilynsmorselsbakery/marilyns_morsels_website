"use client";

import Image from "next/image";
import { useParallax } from "@/hooks/useParallax";
import plateStack from "@/assets/plate_stack.png";

export default function WhyMarilyn() {
  const parallaxOffset1 = useParallax({ speed: 0.2 });
  const parallaxOffset2 = useParallax({ speed: 0.15 });

  return (
    <section className="relative bg-morselCream py-20 overflow-hidden">
      {/* Decorative background images with parallax */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 -right-20 w-64 h-64 opacity-10"
          style={{ transform: `translateY(${parallaxOffset1}px)` }}
        >
          <Image
            src={plateStack}
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </div>
        <div
          className="absolute bottom-20 -left-20 w-56 h-56 opacity-10"
          style={{ transform: `translateY(${parallaxOffset2}px)` }}
        >
          <Image
            src={plateStack}
            alt=""
            fill
            className="object-contain rotate-180"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-morselCocoa mb-6">
            Why Marilyn&apos;s Morsels
          </h2>
          <p className="text-lg text-morselBrown/80 max-w-2xl mx-auto leading-relaxed">
            Marilyn bakes every batch in her licensed home kitchen, using family recipes
            passed down through generations. Small batches mean every cookie gets the
            attention it deserves—rich, golden, and still warm in spirit when it reaches you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div className="text-center">
            <div className="w-16 h-16 bg-morselGold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-morselCocoa"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-display font-semibold mb-2 text-morselCocoa">
              Licensed Kitchen
            </h3>
            <p className="text-sm text-morselBrown/70">
              Fully licensed and inspected. Every batch meets the highest food safety standards.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-morselGold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-morselCocoa"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-display font-semibold mb-2 text-morselCocoa">
              Premium Ingredients
            </h3>
            <p className="text-sm text-morselBrown/70">
              Real butter, quality chocolate, and time-tested recipes. No shortcuts, no compromises.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-morselGold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-morselCocoa"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-display font-semibold mb-2 text-morselCocoa">
              Small-Batch Quality
            </h3>
            <p className="text-sm text-morselBrown/70">
              Baked to order, never mass-produced. Every cookie gets individual attention.
            </p>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-morselGold/20">
          <p className="text-morselBrown/60 text-sm">
            <span className="font-semibold text-morselCocoa">10,000+</span> cookies baked and counting
          </p>
        </div>
      </div>
    </section>
  );
}

