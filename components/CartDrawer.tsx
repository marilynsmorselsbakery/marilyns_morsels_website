"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { useCart, cartRowKey } from "./CartProvider";
import { getProductImage } from "@/lib/product-images";
import { getHalfHalfLabel } from "@/lib/flavors";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
};

export default function CartDrawer({ isOpen, onClose, onCheckout }: Props) {
  const { items, updateQuantity, removeItem, totalCents, itemCount } = useCart();

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 transition-opacity" />

        {/* Drawer panel */}
        <Dialog.Content
          className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col focus:outline-none"
          aria-describedby="cart-drawer-description"
        >
          {/* Visually hidden description for screen readers */}
          <p id="cart-drawer-description" className="sr-only">
            Your shopping cart. Review items and proceed to checkout.
          </p>

          <div className="flex items-center justify-between p-6 border-b border-morselGold/20">
            <Dialog.Title asChild>
              <h2 className="text-2xl font-semibold text-morselCocoa">
                Your Cart ({itemCount})
              </h2>
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="text-morselBrown/70 hover:text-morselBrown transition-colors"
                aria-label="Close cart"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-morselBrown/70 mb-4">Your cart is empty</p>
                <Dialog.Close asChild>
                  <button className="rounded-md bg-morselGold px-6 py-2 text-white transition hover:bg-morselGold/90">
                    Continue Shopping
                  </button>
                </Dialog.Close>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const rowKey = cartRowKey(item);
                  const image = getProductImage(item.flavorId);

                  return (
                    <div
                      key={rowKey}
                      className="flex gap-4 p-4 border border-morselGold/20 rounded-lg"
                    >
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gradient-to-br from-morselGoldLight/20 to-morselGold/10">
                        <Image
                          src={image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-morselCocoa mb-0.5 truncate">
                          {item.name}
                        </h3>
                        {item.halfHalfChoices && (
                          <p className="text-xs text-morselBrown/60 mb-1">
                            {getHalfHalfLabel(item.halfHalfChoices.first)} +{" "}
                            {getHalfHalfLabel(item.halfHalfChoices.second)}
                          </p>
                        )}
                        <p className="text-sm text-morselBrown/70 mb-2">
                          ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(rowKey, item.quantity - 1)
                            }
                            className="w-7 h-7 rounded border border-morselGold/40 flex items-center justify-center hover:border-morselGold hover:bg-morselGold/10 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(rowKey, item.quantity + 1)
                            }
                            className="w-7 h-7 rounded border border-morselGold/40 flex items-center justify-center hover:border-morselGold hover:bg-morselGold/10 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => removeItem(rowKey)}
                            className="ml-auto text-red-600 hover:text-red-700 text-sm transition-colors"
                            aria-label="Remove item"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-morselGold/20 p-6 space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold text-morselCocoa">
                <span>Total</span>
                <span>${(totalCents / 100).toFixed(2)}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full rounded-md bg-morselGold px-6 py-3 text-white font-semibold transition hover:bg-morselGold/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Proceed to Checkout
              </button>
              <Dialog.Close asChild>
                <button className="w-full rounded-md border border-morselGold/60 px-6 py-3 text-morselBrown transition hover:border-morselGold hover:bg-morselGold/10">
                  Continue Shopping
                </button>
              </Dialog.Close>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
