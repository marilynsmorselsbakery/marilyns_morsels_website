"use client";

import { useState } from "react";
import type { Product, ProductVariant } from "@/lib/products";
import Image from "next/image";
import toast from "react-hot-toast";
import { useCart } from "./CartProvider";
import QuantitySelector from "./QuantitySelector";
import { getProductImage } from "@/lib/product-images";
import {
  HALF_HALF_COOKIE_FLAVORS,
  getHalfHalfLabel,
} from "@/lib/flavors";

interface ProductCardProps {
  product: Product;
  tag?: string;
  onInfoClick?: () => void;
}

export default function ProductCard({ product, tag, onInfoClick }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [halfHalfFirst, setHalfHalfFirst] = useState<string>(
    HALF_HALF_COOKIE_FLAVORS[0]
  );
  const [halfHalfSecond, setHalfHalfSecond] = useState<string>(
    HALF_HALF_COOKIE_FLAVORS[1]
  );
  const { addItem } = useCart();

  const isHalfHalf = product.id === "half_half";

  const handleAddToCart = () => {
    const choices = isHalfHalf
      ? { first: halfHalfFirst, second: halfHalfSecond }
      : undefined;
    addItem(selectedVariant, product, quantity, choices);
    const label = isHalfHalf
      ? `${getHalfHalfLabel(halfHalfFirst)} + ${getHalfHalfLabel(halfHalfSecond)}`
      : selectedVariant.packLabel;
    toast.success(
      `${quantity > 1 ? `${quantity}× ` : ""}${product.name} (${label}) added to cart`
    );
    setQuantity(1);
  };

  const productImage = getProductImage(product.id);

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
        <p className="text-sm text-morselBrown/80 mb-4">{product.description}</p>

        {/* Size selector */}
        {product.variants.length > 1 && (
          <div className="mb-3">
            <label className="block text-xs font-semibold text-morselBrown/70 mb-1 uppercase tracking-wide">
              Size
            </label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.sku}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-150 ${
                    selectedVariant.sku === v.sku
                      ? "bg-morselCocoa text-white border-morselCocoa"
                      : "border-morselGold/40 text-morselBrown hover:border-morselGold hover:bg-morselGold/10"
                  }`}
                >
                  {v.packLabel}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Half & Half picker */}
        {isHalfHalf && (
          <div className="mb-3 space-y-2">
            <label className="block text-xs font-semibold text-morselBrown/70 uppercase tracking-wide">
              Pick your 2 flavors
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-morselBrown/60 mb-1">Cookie 1</label>
                <select
                  value={halfHalfFirst}
                  onChange={(e) => setHalfHalfFirst(e.target.value)}
                  className="w-full text-xs border border-morselGold/40 rounded-lg px-2 py-1.5 focus:border-morselGold focus:outline-none focus:ring-1 focus:ring-morselGold/30 bg-white"
                >
                  {HALF_HALF_COOKIE_FLAVORS.map((f) => (
                    <option key={f} value={f}>
                      {getHalfHalfLabel(f)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-morselBrown/60 mb-1">Cookie 2</label>
                <select
                  value={halfHalfSecond}
                  onChange={(e) => setHalfHalfSecond(e.target.value)}
                  className="w-full text-xs border border-morselGold/40 rounded-lg px-2 py-1.5 focus:border-morselGold focus:outline-none focus:ring-1 focus:ring-morselGold/30 bg-white"
                >
                  {HALF_HALF_COOKIE_FLAVORS.map((f) => (
                    <option key={f} value={f}>
                      {getHalfHalfLabel(f)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-morselGold/10">
        <div className="text-xl font-display font-bold text-morselCocoa">
          ${(selectedVariant.priceCents / 100).toFixed(2)}
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
                aria-label={`View details for ${product.name}`}
                className="px-5 py-2.5 text-sm font-semibold rounded-full border-2 border-morselGold/40 text-morselBrown hover:border-morselGold hover:text-morselGold hover:bg-morselGold/10 transition-all duration-200 hover:scale-[1.02]"
              >
                Details
              </button>
            )}
            <button
              onClick={handleAddToCart}
              aria-label={`Add to cart: ${product.name} ${selectedVariant.packLabel}`}
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
