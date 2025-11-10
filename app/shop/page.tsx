"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import { products, ProductOption } from "@/lib/products";

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

export default function ShopPage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openProductModal = (product: ProductOption) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleBuyNow = async (product: ProductOption) => {
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

  // Group products by flavor
  const chocolateChipProducts = products.filter((p) => p.flavor === "chocolate_chip");
  const butterscotchProducts = products.filter((p) => p.flavor === "butterscotch_chip");
  const halfHalfProducts = products.filter((p) => p.flavor === "half_half");

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 mt-16">
      <h1 className="text-4xl md:text-5xl font-display font-bold text-morselCocoa mb-3">
        Shop Cookies
      </h1>
      <p className="text-lg text-morselBrown/70 mb-12">
        Baked to order in small batches. Please allow a short lead time for freshness.
      </p>

      {/* Chocolate Chip Section */}
      <div className="mb-12">
        <div className="mb-6 pb-3 border-b-2 border-morselGold/30">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-morselCocoa">
            {getFlavorDisplayName("chocolate_chip")}
          </h2>
          <p className="text-morselBrown/70 mt-2">
            Classic, buttery chocolate chip morsels baked to perfection.
          </p>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
          {chocolateChipProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onInfoClick={() => openProductModal(product)}
            />
          ))}
        </div>
      </div>

      {/* Butterscotch Chocolate Chip Section */}
      <div className="mb-12">
        <div className="mb-6 pb-3 border-b-2 border-morselGold/30">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-morselCocoa">
            {getFlavorDisplayName("butterscotch_chip")}
          </h2>
          <p className="text-morselBrown/70 mt-2">
            Rich butterscotch & chocolate with caramelized edges.
          </p>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
          {butterscotchProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onInfoClick={() => openProductModal(product)}
            />
          ))}
        </div>
      </div>

      {/* Half & Half Section */}
      <div className="mb-12">
        <div className="mb-6 pb-3 border-b-2 border-morselGold/30">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-morselCocoa">
            {getFlavorDisplayName("half_half")}
          </h2>
          <p className="text-morselBrown/70 mt-2">
            The best of both worlds - a mix of chocolate chip and butterscotch chocolate chip.
          </p>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
          {halfHalfProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onInfoClick={() => openProductModal(product)}
            />
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={selectedProduct}
        onBuyNow={
          selectedProduct
            ? () => {
                closeModal();
                handleBuyNow(selectedProduct);
              }
            : undefined
        }
      />
    </section>
  );
}

