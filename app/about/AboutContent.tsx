"use client";

import Image from "next/image";
import { useParallax } from "@/hooks/useParallax";
import cookieSpread from "@/assets/cookie_spread.png";
import plateDisplay from "@/assets/plate_display.png";

export default function AboutContent() {
  const offsetTop = useParallax({ speed: 0.18, offset: -60 });
  const offsetBottom = useParallax({ speed: 0.12, offset: 80 });

  return (
    <section className="relative max-w-3xl mx-auto px-4 py-14 md:py-20 mt-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-5rem] -right-28 w-80 h-80 opacity-25 blur-sm">
          <div
            className="relative w-full h-full"
            style={{ transform: `translateY(${offsetTop}px)` }}
          >
            <Image src={cookieSpread} alt="" fill className="object-contain" aria-hidden="true" />
          </div>
        </div>
        <div className="absolute bottom-[-6rem] -left-32 w-96 h-96 opacity-25 blur-sm">
          <div
            className="relative w-full h-full"
            style={{ transform: `translateY(${offsetBottom}px)` }}
          >
            <Image src={plateDisplay} alt="" fill className="object-contain" aria-hidden="true" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-morselCream/40 via-white/70 to-white" />
      </div>

      <div className="relative z-10 space-y-4">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-morselCocoa mb-4">
          About Marilyn&apos;s Morsels
        </h1>
        <p className="text-base text-morselBrown/80 leading-relaxed">
          Marilyn&apos;s Morsels began in a home kitchen, where every batch was tested on brutally
          honest friends and family until the recipe was right every time. Today, each order is
          baked in a licensed home kitchen with the same care: real butter, premium chocolate, and a
          strict &quot;no shortcuts&quot; policy.
        </p>
        <p className="text-base text-morselBrown/80 leading-relaxed">
          We keep the menu focused so every morsel that leaves the oven is consistent: golden edges,
          soft centers, and flavors that actually justify reordering.
        </p>

        {/* Marilyn's Quote */}
        <div className="mt-12 pt-8 border-t border-morselGold/20">
          <div className="relative bg-gradient-to-br from-morselCream/50 to-morselGold/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-xl shadow-morselGold/10 border border-morselGold/20">
            <div className="absolute top-6 left-6 text-6xl md:text-7xl font-display text-morselGold/25 leading-none">
              &quot;
            </div>
            <blockquote className="relative z-10 text-lg md:text-xl text-morselBrown/90 leading-relaxed font-body italic pl-8 md:pl-12 space-y-4">
              <p>
                I&apos;ve loved baking cookies since I was in the fifth grade, and I especially love
                the aroma it creates in my home. When my kids were in school, I had to keep a batch
                of cookies at the ready for them and their friends.
              </p>
              <p>
                Now, many years later, those friends still keep in touch, pleading with me to share
                my tasty cookies with their kids.
              </p>
              <p className="font-semibold text-morselCocoa">What an honor that is!</p>
              <p>
                Nine grandkids later, the aroma of fresh baked cookies still permeates my home, and
                my grandkids love helping me bake! I now love seeing the excitement of people&apos;s
                faces when I deliver them cookies. It&apos;s time for you to see why my family, my
                kids&apos; friends, and my current friends love my cookies!
              </p>
            </blockquote>
            <div className="mt-6 pt-6 border-t border-morselGold/20">
              <p className="text-base font-display font-semibold text-morselCocoa">— Marilyn</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

