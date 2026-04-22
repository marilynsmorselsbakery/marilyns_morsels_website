"use client";

import { useState } from "react";
import { ProductOption } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useCart } from "./CartProvider";
import QuantitySelector from "./QuantitySelector";
import chipsBowl from "@/assets/chips_bowl.png";
import sixCookie from "@/assets/six_cookie.png";
import freshDozen from "@/assets/fresh_dozen.png";
import plateDisplay from "@/assets/plate_display.png";
import cookieSpread from "@/assets/cookie_spread.png";
import milkStack from "@/assets/milk_stack.png";
import plateStack from "@/assets/plate_stack.png";
import cookieStackLean from "@/assets/cookie-stack-lean.jpg";

// Map products to images
const productImageMap: Record<string, any> = {
  "cc-6": plateStack, // Chocolate Chip 6-pack
  "cc-12": cookieStackLean, // Chocolate Chip 12-pack
  "bc-6": milkStack, // Butterscotch 6-pack
  "bc-12": chipsBowl, // Butterscotch 12-pack
  "hh-6": sixCookie, // Half & Half 6-pack
  "hh-12": freshDozen, // Half & Half 12-pack
};

interface ProductCardProps {
  product: ProductOption;
  tag?: string;
  onInfoClick?: () => void;
}

export default function ProductCard({ product, tag, onInfoClick }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${quantity} ${product.name}${quantity > 1 ? "s" : ""} added to cart`);
    setQuantity(1);
  };

  const productImage = productImageMap[product.id] || chipsBowl;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-morselGold/10 p-6 flex flex-col hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group">
      {tag && (
        <div className="mb-3">
          <span className="inline-block px-2 py-1 text-xs font-semibold bg-morselGold/20 text-morselCocoa rounded-full">
            {tag}
          </span>
        </div>
      )}
      <div className="mb-4 flex-1">
        {/* Product image */}
        <div className="w-full h-64 md:h-72 relative rounded-xl mb-4 overflow-hidden bg-gradient-to-br from-morselGoldLight/20 to-morselGold/10 group-hover:scale-105 transition-transform duration-300">
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
        <div className="flex flex-col gap-2 items-end">
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={12}
            className="mb-2"
          />
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
              onClick={handleAddToCart}
              className="px-5 py-2.5 text-sm font-semibold rounded-full bg-morselCocoa text-white shadow-button hover:shadow-button-hover hover:scale-[1.02] transition-all duration-200"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
