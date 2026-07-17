"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import type { Product } from "@/lib/products";
import { track } from "@/lib/analytics/client";
import { ecommerceValue, productAnalyticsItem } from "@/lib/analytics/items";

type Props = {
  products: Product[];
};

export default function ShopGrid({ products }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const items = products.flatMap((product) => {
      const variant = product.variants[0];
      return variant ? [productAnalyticsItem(product, variant)] : [];
    });
    if (items.length === 0) return;
    track({
      event: "view_item_list",
      ecommerce: {
        currency: "USD",
        value: ecommerceValue(items),
        item_list_id: "shop_catalog",
        item_list_name: "Shop catalog",
        items,
      },
    });
  }, [products]);

  const openProductModal = (product: Product) => {
    const variant = product.variants[0];
    if (variant) {
      const item = productAnalyticsItem(product, variant);
      track({
        event: "select_item",
        ecommerce: {
          currency: "USD",
          value: ecommerceValue([item]),
          item_list_id: "shop_catalog",
          item_list_name: "Shop catalog",
          items: [item],
        },
      });
    }
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Group by category for section headers
  const cookies = products.filter((p) => p.category === "cookie");
  const doughs = products.filter((p) => p.category === "dough");

  return (
    <section className="max-w-6xl mx-auto px-4 pt-28 pb-16 md:pt-32 md:pb-20">
      <h1 className="text-4xl md:text-5xl font-display font-bold text-morselCocoa mb-3">
        Shop
      </h1>
      <p className="text-lg text-morselBrown/80 mb-12">
        Baked to order in small batches. Please allow a short lead time for
        freshness.
      </p>

      {cookies.length > 0 && (
        <div className="mb-14">
          <div className="mb-6 pb-3 border-b-2 border-morselGold/30">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-morselCocoa">
              Cookies
            </h2>
            <p className="text-morselBrown/80 mt-2">
              Fresh-baked in small batches — choose your flavor and pack size.
            </p>
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
            {cookies.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onInfoClick={() => openProductModal(product)}
              />
            ))}
          </div>
        </div>
      )}

      {doughs.length > 0 && (
        <div className="mb-14">
          <div className="mb-6 pb-3 border-b-2 border-morselGold/30">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-morselCocoa">
              Cookie Dough
            </h2>
            <p className="text-morselBrown/80 mt-2">
              Ready-to-bake at home — same great recipes, straight from the
              freezer.
            </p>
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
            {doughs.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onInfoClick={() => openProductModal(product)}
              />
            ))}
          </div>
        </div>
      )}

      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={selectedProduct}
      />
    </section>
  );
}
