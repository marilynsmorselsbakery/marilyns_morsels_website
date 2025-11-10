"use client";

import { ProductOption } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";
import chipsBowl from "@/assets/chips_bowl.png";
import sixCookie from "@/assets/six_cookie.png";
import freshDozen from "@/assets/fresh_dozen.png";
import plateDisplay from "@/assets/plate_display.png";
import cookieSpread from "@/assets/cookie_spread.png";
import milkStack from "@/assets/milk_stack.png";

// Map products to images arbitrarily
const productImageMap: Record<string, any> = {
  "cc-6": chipsBowl,
  "cc-12": freshDozen,
  "bc-6": sixCookie,
  "bc-12": plateDisplay,
  "hh-6": cookieSpread,
  "hh-12": milkStack,
};

interface ProductCardProps {
  product: ProductOption;
  tag?: string;
  onInfoClick?: () => void;
}

export default function ProductCard({ product, tag, onInfoClick }: ProductCardProps) {
  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, quantity: 1 }),
    });

    if (!res.ok) {
      alert("Something went wrong starting checkout. Try again.");
      return;
    }

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  const productImage = productImageMap[product.id] || chipsBowl;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-morselGold/10 p-6 flex flex-col hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
      {tag && (
        <div className="mb-3">
          <span className="inline-block px-2 py-1 text-xs font-semibold bg-morselGold/20 text-morselCocoa rounded-full">
            {tag}
          </span>
        </div>
      )}
      <div className="mb-4 flex-1">
        {/* Product image */}
        <div className="w-full h-48 relative rounded-xl mb-4 overflow-hidden bg-gradient-to-br from-morselGoldLight/20 to-morselGold/10 group">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {onInfoClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInfoClick();
              }}
              className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="View product details"
            >
              <svg
                className="w-5 h-5 text-morselCocoa"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          )}
        </div>
        <h3 className="text-base font-display font-semibold mb-2 text-morselCocoa">
          {product.name}
        </h3>
        <p className="text-sm text-morselBrown/70 mb-4">{product.description}</p>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-morselGold/10">
        <div className="text-xl font-display font-bold text-morselCocoa">
          ${(product.priceCents / 100).toFixed(2)}
        </div>
        <button
          onClick={handleCheckout}
          className="px-5 py-2.5 text-sm font-semibold rounded-full bg-morselCocoa text-white shadow-button hover:shadow-button-hover hover:scale-[1.02] transition-all duration-200"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
