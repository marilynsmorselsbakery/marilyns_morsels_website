"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import type { ProductOption } from "@/lib/products";
import { getFlavorLabel, getFlavorSubtitle } from "@/lib/flavors";

type Props = {
  products: ProductOption[];
};

export default function ShopGrid({ products }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openProductModal = (product: ProductOption) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const grouped = useMemo(() => {
    const byFlavor = new Map<string, ProductOption[]>();
    for (const product of products) {
      const existing = byFlavor.get(product.flavor) ?? [];
      existing.push(product);
      byFlavor.set(product.flavor, existing);
    }
    return Array.from(byFlavor.entries());
  }, [products]);

  return (
    <section className="max-w-6xl mx-auto px-4 pt-28 pb-16 md:pt-32 md:pb-20">
      <h1 className="text-4xl md:text-5xl font-display font-bold text-morselCocoa mb-3">
        Shop
      </h1>
      <p className="text-lg text-morselBrown/70 mb-12">
        Baked to order in small batches. Please allow a short lead time for freshness.
      </p>

      {grouped.map(([flavor, items]) => (
        <div key={flavor} className="mb-12">
          <div className="mb-6 pb-3 border-b-2 border-morselGold/30">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-morselCocoa">
              {getFlavorLabel(flavor)}
            </h2>
            {getFlavorSubtitle(flavor) && (
              <p className="text-morselBrown/70 mt-2">
                {getFlavorSubtitle(flavor)}
              </p>
            )}
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onInfoClick={() => openProductModal(product)}
              />
            ))}
          </div>
        </div>
      ))}

      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={selectedProduct}
      />
    </section>
  );
}
