"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import toast from "react-hot-toast";
import type { Product, ProductVariant } from "@/lib/products";
import { getFlavorLabel, getPackSizeDisplay, HALF_HALF_COOKIE_FLAVORS, getHalfHalfLabel } from "@/lib/flavors";
import { useCart } from "./CartProvider";
import QuantitySelector from "./QuantitySelector";
import { getProductImage } from "@/lib/product-images";

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
  product: Product | null;
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  product,
}: ProductDetailModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [halfHalfFirst, setHalfHalfFirst] = useState<string>(
    HALF_HALF_COOKIE_FLAVORS[0]
  );
  const [halfHalfSecond, setHalfHalfSecond] = useState<string>(
    HALF_HALF_COOKIE_FLAVORS[1]
  );
  const { addItem } = useCart();

  // Guard: don't render Radix content at all when product is null
  const open = isOpen && product !== null;

  // Resolve the active variant (selectedVariant state, or default to first)
  const activeVariant =
    product
      ? (selectedVariant && product.variants.some((v) => v.sku === selectedVariant.sku)
          ? selectedVariant
          : product.variants[0])
      : null;

  const isHalfHalf = product?.id === "half_half";

  const handleAddToCart = () => {
    if (!product || !activeVariant) return;
    const choices = isHalfHalf
      ? { first: halfHalfFirst, second: halfHalfSecond }
      : undefined;
    addItem(activeVariant, product, quantity, choices);
    const label = isHalfHalf
      ? `${getHalfHalfLabel(halfHalfFirst)} + ${getHalfHalfLabel(halfHalfSecond)}`
      : activeVariant.packLabel;
    toast.success(
      `${quantity > 1 ? `${quantity}× ` : ""}${product.name} (${label}) added to cart`
    );
    setQuantity(1);
    onClose();
  };

  const productImage = product ? getProductImage(product.id) : null;
  const ingredientLabel =
    product && !isHalfHalf ? ingredientLabels[product.flavor] : null;
  const packSizeDisplay =
    activeVariant && product
      ? getPackSizeDisplay(activeVariant.packSize, product.category)
      : null;
  const aboutLabel =
    product?.category === "dough" ? "About This Dough" : "About This Cookie";

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />

        {/* Modal panel */}
        <Dialog.Content
          className="fixed inset-0 z-50 flex items-center justify-center p-4 focus:outline-none"
          aria-describedby="product-modal-description"
        >
          {product && activeVariant && (
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Hidden description for screen readers */}
              <p id="product-modal-description" className="sr-only">
                Product details for {product.name}. Review ingredients, pricing,
                and add to cart.
              </p>

              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-morselGold/20">
                <div>
                  <Dialog.Title asChild>
                    <h2 className="text-2xl font-display font-bold text-morselCocoa">
                      {product.name}
                    </h2>
                  </Dialog.Title>
                  <p className="text-sm text-morselBrown/70 mt-1">
                    {getFlavorLabel(product.flavor)}
                  </p>
                </div>
                <Dialog.Close asChild>
                  <button
                    className="text-morselBrown/70 hover:text-morselBrown transition text-3xl leading-none w-8 h-8 flex items-center justify-center"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </Dialog.Close>
              </div>

              {/* Content */}
              <div className="overflow-auto flex-1">
                <div className="p-6">
                  {/* Product Image */}
                  {productImage && (
                    <div className="w-full h-96 md:h-[500px] lg:h-[600px] relative rounded-xl mb-6 overflow-hidden bg-gradient-to-br from-morselGoldLight/20 to-morselGold/10">
                      <Image
                        src={productImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    </div>
                  )}

                  {/* Size selector */}
                  {product.variants.length > 1 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-display font-semibold text-morselCocoa mb-3">
                        Choose a Size
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((v) => (
                          <button
                            key={v.sku}
                            type="button"
                            onClick={() => setSelectedVariant(v)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all duration-150 ${
                              activeVariant.sku === v.sku
                                ? "bg-morselCocoa text-white border-morselCocoa"
                                : "border-morselGold/40 text-morselBrown hover:border-morselGold hover:bg-morselGold/10"
                            }`}
                          >
                            {v.packLabel} — ${(v.priceCents / 100).toFixed(2)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Half & Half picker */}
                  {isHalfHalf && (
                    <div className="mb-6">
                      <h3 className="text-lg font-display font-semibold text-morselCocoa mb-3">
                        Pick Your 2 Flavors
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-morselBrown/70 mb-1">
                            Cookie 1
                          </label>
                          <select
                            value={halfHalfFirst}
                            onChange={(e) => setHalfHalfFirst(e.target.value)}
                            className="w-full border border-morselGold/40 rounded-lg px-3 py-2 focus:border-morselGold focus:outline-none focus:ring-1 focus:ring-morselGold/30 bg-white"
                          >
                            {HALF_HALF_COOKIE_FLAVORS.map((f) => (
                              <option key={f} value={f} disabled={f === halfHalfSecond}>
                                {getHalfHalfLabel(f)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-morselBrown/70 mb-1">
                            Cookie 2
                          </label>
                          <select
                            value={halfHalfSecond}
                            onChange={(e) => setHalfHalfSecond(e.target.value)}
                            className="w-full border border-morselGold/40 rounded-lg px-3 py-2 focus:border-morselGold focus:outline-none focus:ring-1 focus:ring-morselGold/30 bg-white"
                          >
                            {HALF_HALF_COOKIE_FLAVORS.map((f) => (
                              <option key={f} value={f} disabled={f === halfHalfFirst}>
                                {getHalfHalfLabel(f)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Product Details */}
                  {packSizeDisplay && (
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
                          <p className="text-sm text-morselBrown/70 mb-2 font-medium">
                            Price
                          </p>
                          <p className="text-2xl font-bold text-morselCocoa">
                            ${(activeVariant.priceCents / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

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

                  {isHalfHalf && (
                    <div className="mb-6">
                      <h3 className="text-xl font-display font-semibold text-morselCocoa mb-3">
                        Ingredients
                      </h3>
                      <div className="bg-morselCream/30 rounded-xl p-6">
                        <p className="text-morselBrown/80 mb-4">
                          This pack contains both Chocolate Chip and Butterscotch
                          Chocolate Chip cookies.
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
                                src={
                                  ingredientLabels.butterscotch_chip.url
                                }
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
                    <span className="text-sm font-medium text-morselBrown/70">
                      Quantity:
                    </span>
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
                    Add to Cart —{" "}
                    ${((activeVariant.priceCents * quantity) / 100).toFixed(2)}
                  </button>
                </div>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
