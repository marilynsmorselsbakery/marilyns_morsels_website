"use client";

import Hero from "@/components/Hero";
import BestSellers from "@/components/BestSellers";
import WhyMarilyn from "@/components/WhyMarilyn";
import Link from "next/link";
import Image from "next/image";
import { useParallax } from "@/hooks/useParallax";
import cookieSpread from "@/assets/cookie_spread.png";
import milkStack from "@/assets/milk_stack.png";

export default function HomePage() {
  const parallaxOffset1 = useParallax({ speed: 0.25 });
  const parallaxOffset2 = useParallax({ speed: 0.18 });

  return (
    <>
      <div className="pt-16">
        <Hero />
      </div>

      <BestSellers />

      <WhyMarilyn />

      {/* Clear pathways section */}
      <section className="relative bg-white py-20 border-t border-morselGold/10 overflow-hidden">
        {/* Decorative background images with parallax */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-10 left-10 w-48 h-48 opacity-5"
            style={{ transform: `translateY(${parallaxOffset1}px)` }}
          >
            <Image
              src={cookieSpread}
              alt=""
              fill
              className="object-contain"
              aria-hidden="true"
            />
          </div>
          <div
            className="absolute bottom-10 right-10 w-52 h-52 opacity-5"
            style={{ transform: `translateY(${parallaxOffset2}px)` }}
          >
            <Image
              src={milkStack}
              alt=""
              fill
              className="object-contain"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 z-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-morselCream rounded-2xl p-8 border border-morselGold/20">
              <h3 className="text-2xl font-display font-bold text-morselCocoa mb-3">
                Order for Yourself
              </h3>
              <p className="text-morselBrown/70 mb-6">
                Browse our selection of small-batch cookies, baked fresh to order. Perfect for
                treating yourself or sharing with loved ones.
              </p>
              <Link
                href="/shop"
                className="inline-block px-6 py-3 bg-morselCocoa text-white text-sm font-semibold rounded-full shadow-button hover:shadow-button-hover hover:scale-[1.02] transition-all duration-200"
              >
                Shop Now
              </Link>
            </div>

            <div className="bg-morselCream rounded-2xl p-8 border border-morselGold/20">
              <h3 className="text-2xl font-display font-bold text-morselCocoa mb-3">
                Catering & Events
              </h3>
              <p className="text-morselBrown/70 mb-6">
                Need cookies for your office, event, or special occasion? We offer bulk orders
                with custom pricing and flexible lead times.
              </p>
              <Link
                href="/bulk-orders"
                className="inline-block px-6 py-3 bg-morselCocoa text-white text-sm font-semibold rounded-full shadow-button hover:shadow-button-hover hover:scale-[1.02] transition-all duration-200"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
