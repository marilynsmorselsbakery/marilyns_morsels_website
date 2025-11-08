"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import IngredientLabelModal from "@/components/IngredientLabelModal";
import { products } from "@/lib/products";

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

export default function ShopPage() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    labelUrl: string;
    cookieName: string;
  }>({
    isOpen: false,
    labelUrl: "",
    cookieName: "",
  });

  const openModal = (flavor: string) => {
    const label = ingredientLabels[flavor];
    if (label) {
      setModalState({
        isOpen: true,
        labelUrl: label.url,
        cookieName: label.name,
      });
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, labelUrl: "", cookieName: "" });
  };

  // Get unique flavors from products
  const uniqueFlavors = Array.from(
    new Set(products.map((p) => p.flavor).filter((f) => f !== "half_half"))
  );

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-2">Shop Cookies</h1>
      <p className="text-sm text-morselBrown/70 mb-6">
        Baked to order in small batches. Please allow a short lead time for freshness.
      </p>

      <div className="mb-6 pb-6 border-b border-morselGold/20">
        <h2 className="text-sm font-semibold mb-3">View Ingredient Labels</h2>
        <div className="flex flex-wrap gap-3">
          {uniqueFlavors.map((flavor) => {
            const label = ingredientLabels[flavor];
            if (!label) return null;
            return (
              <button
                key={flavor}
                onClick={() => openModal(flavor)}
                className="px-4 py-2 text-xs rounded-full border border-morselBrown/40 text-morselBrown hover:border-morselGold hover:text-morselGold hover:bg-morselGold/10 transition"
              >
                View {label.name} Ingredients
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <IngredientLabelModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        labelUrl={modalState.labelUrl}
        cookieName={modalState.cookieName}
      />
    </section>
  );
}

