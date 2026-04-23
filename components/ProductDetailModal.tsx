"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { ProductOption } from "@/lib/products";
import { getFlavorLabel, getPackSizeDisplay } from "@/lib/flavors";
import { useCart } from "./CartProvider";
import QuantitySelector from "./QuantitySelector";
import { getProductImage } from "@/lib/product-images";
import { useFocusTrap } from "@/hooks/useFocusTrap";

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
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  product,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(modalRef, isOpen && product !== null);

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

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    toast.success(`${quantity} ${product.name}${quantity > 1 ? "s" : ""} added to cart`);
    setQuantity(1);
    onClose();
  };

  if (!isOpen || !product) return null;

  const productImage = getProductImage(product.id);
  const ingredientLabel =
    product.flavor !== "half_half"
      ? ingredientLabels[product.flavor]
      : null;
  const packSizeDisplay = getPackSizeDisplay(product.packSize, product.category);
  const aboutLabel =
    product.category === "dough" ? "About This Dough" : "About This Cookie";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-heading"
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-morselGold/20">
          <div>
            <h2
              id="product-modal-heading"
              className="text-2xl font-display font-bold text-morselCocoa"
            >
              {product.name}
            </h2>
            <p className="text-sm text-morselBrown/70 mt-1">
              {getFlavorLabel(product.flavor)}
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
            <div className="w-full h-96 md:h-[500px] lg:h-[600px] relative rounded-xl mb-6 overflow-hidden bg-gradient-to-br from-morselGoldLight/20 to-morselGold/10">
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
                {aboutLabel}
              </h3>
              <p className="text-morselBrown/80 leading-relaxed mb-4">
                {product.description}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-morselCream/50 rounded-lg p-5 border border-morselGold/20 shadow-lg shadow-morselGold/20">
                  <p className="text-sm text-morselBrown/70 mb-2 font-medium">
                    {packSizeDisplay.label}
                  </p>
                  <p className="text-2xl font-bold text-morselCocoa">
                    {packSizeDisplay.value}
                  </p>
                </div>
                <div className="bg-morselCream/50 rounded-lg p-5 border border-morselGold/20 shadow-lg shadow-morselGold/20">
                  <p className="text-sm text-morselBrown/70 mb-2 font-medium">Price</p>
                  <p className="text-2xl font-bold text-morselCocoa">
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
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm font-medium text-morselBrown/70">Quantity:</span>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={12}
              />
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full px-8 py-4 bg-morselCocoa text-white text-base font-semibold rounded-full shadow-button hover:shadow-button-hover hover:scale-[1.02] transition-all duration-200"
            >
              Add to Cart - ${((product.priceCents * quantity) / 100).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

