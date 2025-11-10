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
        <div className="w-full h-48 relative rounded-xl mb-4 overflow-hidden bg-gradient-to-br from-morselGoldLight/20 to-morselGold/10">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
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
        <div className="flex gap-2">
          {onInfoClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInfoClick();
              }}
              className="px-5 py-2.5 text-sm font-semibold rounded-full border-2 border-morselGold/40 text-morselBrown hover:border-morselGold hover:text-morselGold hover:bg-morselGold/10 transition-all duration-200 hover:scale-[1.02]"
            >
              Details
            </button>
          )}
          <button
            onClick={handleCheckout}
            className="px-5 py-2.5 text-sm font-semibold rounded-full bg-morselCocoa text-white shadow-button hover:shadow-button-hover hover:scale-[1.02] transition-all duration-200"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
