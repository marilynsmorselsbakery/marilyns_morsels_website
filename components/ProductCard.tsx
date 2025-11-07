"use client";

import { ProductOption } from "@/lib/products";

export default function ProductCard({ product }: { product: ProductOption }) {
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-morselGold/10 p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-semibold mb-1">{product.name}</h3>
        <p className="text-xs text-morselBrown/70 mb-3">{product.description}</p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="text-sm font-semibold">${(product.priceCents / 100).toFixed(2)}</div>
        <button
          onClick={handleCheckout}
          className="px-3 py-2 text-xs rounded-full bg-morselBrown text-morselCream hover:bg-morselGold hover:text-morselBrown transition"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

