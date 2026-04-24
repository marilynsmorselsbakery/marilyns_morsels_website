"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { useCart } from "@/components/CartProvider";
import { getProductImage } from "@/lib/product-images";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalCents, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Guest checkout — no login required. Just redirect if cart is empty.
    if (items.length === 0) {
      router.push("/shop");
    }
  }, [items, router]);

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || "Something went wrong starting checkout. Please try again.");
        setIsProcessing(false);
        return;
      }

      const data = await response.json();
      if (data.url) {
        clearCart();
        window.location.href = data.url;
      } else {
        toast.error("No checkout URL received. Please try again.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Checkout error", error);
      toast.error("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16 mt-16">
      <h1 className="text-3xl font-semibold mb-8">Review Your Order</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => {
            const image = getProductImage(item.flavorId);
            const rowKey = `${item.sku}|${item.halfHalfChoices?.first ?? ""}|${item.halfHalfChoices?.second ?? ""}`;

            return (
              <div
                key={rowKey}
                className="flex gap-4 p-4 border border-morselGold/20 rounded-lg bg-white/90"
              >
                <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gradient-to-br from-morselGoldLight/20 to-morselGold/10">
                  <Image
                    src={image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-morselCocoa mb-1">{item.name}</h3>
                  {item.halfHalfChoices && (
                    <p className="text-xs text-morselBrown/60 mb-1">
                      {item.halfHalfChoices.first.replace(/_/g, " ")} +{" "}
                      {item.halfHalfChoices.second.replace(/_/g, " ")}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-morselBrown/70">Quantity: {item.quantity}</span>
                    <span className="font-semibold text-morselCocoa">
                      ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-24 rounded-lg border border-morselGold/30 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-morselBrown/70">Subtotal</span>
                <span>${(totalCents / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-morselBrown/70">Shipping</span>
                <span className="text-morselBrown/70">Calculated at checkout</span>
              </div>
              <div className="border-t border-morselGold/20 pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${(totalCents / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full rounded-md bg-morselGold px-6 py-3 text-white font-semibold transition hover:bg-morselGold/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isProcessing ? "Processing..." : "Proceed to Payment"}
            </button>
            <button
              onClick={() => router.push("/shop")}
              className="w-full mt-3 rounded-md border border-morselGold/60 px-6 py-3 text-morselBrown transition hover:border-morselGold hover:bg-morselGold/10"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

