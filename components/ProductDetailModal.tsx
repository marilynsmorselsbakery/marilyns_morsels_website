"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ProductOption } from "@/lib/products";
import chipsBowl from "@/assets/chips_bowl.png";
import sixCookie from "@/assets/six_cookie.png";
import freshDozen from "@/assets/fresh_dozen.png";
import plateDisplay from "@/assets/plate_display.png";
import cookieSpread from "@/assets/cookie_spread.png";
import milkStack from "@/assets/milk_stack.png";

const productImageMap: Record<string, any> = {
  "cc-6": chipsBowl,
  "cc-12": freshDozen,
  "bc-6": sixCookie,
  "bc-12": plateDisplay,
  "hh-6": cookieSpread,
  "hh-12": milkStack,
};

const ingredientLabels: Record<string, { url: string; name: string }> = {
  chocolate_chip: {
    url: "/chocolate-chip-ingredients-1.png",
    name: "Chocolate Chip Cookie",
  },
  butterscotch_chip: {
    url: "/butterscotch-ingredients-1.png",
    name: "Butterscotch Chocolate Chip Cookie",
  },
};

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductOption | null;
  onBuyNow?: () => void;
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  product,
  onBuyNow,
}: ProductDetailModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const productImage = productImageMap[product.id] || chipsBowl;
  const ingredientLabel =
    product.flavor !== "half_half"
      ? ingredientLabels[product.flavor]
      : null;

  const getFlavorDisplayName = (flavor: string) => {
    switch (flavor) {
      case "chocolate_chip":
        return "Chocolate Chip";
      case "butterscotch_chip":
        return "Butterscotch Chocolate Chip";
      case "half_half":
        return "Half & Half";
      default:
        return flavor;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-morselGold/20">
          <div>
            <h2 className="text-2xl font-display font-bold text-morselCocoa">
              {product.name}
            </h2>
            <p className="text-sm text-morselBrown/70 mt-1">
              {getFlavorDisplayName(product.flavor)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-morselBrown/70 hover:text-morselBrown transition text-3xl leading-none w-8 h-8 flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="overflow-auto flex-1">
          <div className="p-6">
            {/* Product Image */}
            <div className="w-full h-64 md:h-80 relative rounded-xl mb-6 overflow-hidden bg-gradient-to-br from-morselGoldLight/20 to-morselGold/10">
              <Image
                src={productImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>

            {/* Product Details */}
            <div className="mb-6">
              <h3 className="text-xl font-display font-semibold text-morselCocoa mb-3">
                About This Cookie
              </h3>
              <p className="text-morselBrown/80 leading-relaxed mb-4">
                {product.description}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-morselCream/50 rounded-lg p-4">
                  <p className="text-xs text-morselBrown/60 mb-1">Pack Size</p>
                  <p className="text-lg font-semibold text-morselCocoa">
                    {product.packSize} Cookies
                  </p>
                </div>
                <div className="bg-morselCream/50 rounded-lg p-4">
                  <p className="text-xs text-morselBrown/60 mb-1">Price</p>
                  <p className="text-lg font-semibold text-morselCocoa">
                    ${(product.priceCents / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Ingredient Label */}
            {ingredientLabel && (
              <div className="mb-6">
                <h3 className="text-xl font-display font-semibold text-morselCocoa mb-3">
                  Ingredients
                </h3>
                <div className="bg-morselCream/30 rounded-xl p-4 flex justify-center">
                  <Image
                    src={ingredientLabel.url}
                    alt={`${ingredientLabel.name} Ingredient Label`}
                    width={600}
                    height={800}
                    className="w-auto h-auto max-w-full rounded-lg"
                    unoptimized
                  />
                </div>
              </div>
            )}

            {product.flavor === "half_half" && (
              <div className="mb-6">
                <h3 className="text-xl font-display font-semibold text-morselCocoa mb-3">
                  Ingredients
                </h3>
                <div className="bg-morselCream/30 rounded-xl p-6">
                  <p className="text-morselBrown/80 mb-4">
                    This pack contains both Chocolate Chip and Butterscotch Chocolate Chip cookies.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-morselCocoa mb-2">
                        Chocolate Chip Cookie
                      </h4>
                      <div className="flex justify-center">
                        <Image
                          src={ingredientLabels.chocolate_chip.url}
                          alt="Chocolate Chip Cookie Ingredient Label"
                          width={300}
                          height={400}
                          className="w-auto h-auto max-w-full rounded-lg"
                          unoptimized
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-morselCocoa mb-2">
                        Butterscotch Chocolate Chip Cookie
                      </h4>
                      <div className="flex justify-center">
                        <Image
                          src={ingredientLabels.butterscotch_chip.url}
                          alt="Butterscotch Chocolate Chip Cookie Ingredient Label"
                          width={300}
                          height={400}
                          className="w-auto h-auto max-w-full rounded-lg"
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-morselGold/20 bg-morselCream/20">
          <button
            onClick={onBuyNow}
            className="w-full px-8 py-4 bg-morselCocoa text-white text-base font-semibold rounded-full shadow-button hover:shadow-button-hover hover:scale-[1.02] transition-all duration-200"
          >
            Buy Now - ${(product.priceCents / 100).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}

