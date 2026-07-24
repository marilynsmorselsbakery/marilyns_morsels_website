import type { Metadata } from "next";
import Link from "next/link";
import { FULFILLMENT_POLICY } from "@/lib/storefront/fulfillment";

export const metadata: Metadata = {
  title: "Delivery Policy",
  description:
    "Learn about local delivery for Marilyn's Morsels Bakery orders in the Westerville, Ohio area.",
};

export default function ShippingPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-14 md:py-20 mt-16">
      <h1 className="text-3xl md:text-4xl font-display font-bold text-morselCocoa mb-6">
        Delivery Policy
      </h1>
      <p className="text-sm text-morselBrown/60 mb-10">Last updated: July 24, 2026</p>

      <div className="space-y-10 text-morselBrown/80 leading-relaxed">
        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Local Delivery — Westerville, OH Area
          </h2>
          <p>
            Marilyn&apos;s Morsels is currently accepting orders for local delivery in the{" "}
            {FULFILLMENT_POLICY.serviceArea}.
          </p>
          <p className="mt-3">
            After your order is placed, Marilyn will contact you by email to coordinate delivery.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Orders Outside the Area
          </h2>
          <p>
            If your delivery address is outside the Westerville area, please{" "}
            <Link href="/contact" className="text-morselGold hover:underline">
              contact the bakery
            </Link>{" "}
            before ordering.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Order Cutoff & Freshness
          </h2>
          <p>
            Cookies are baked to order in small batches. To ensure maximum freshness, we bake
            after your order is placed rather than using pre-baked inventory.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Questions?
          </h2>
          <p>
            If you have questions about your order status or delivery,{" "}
            <Link href="/contact" className="text-morselGold hover:underline">
              contact us
            </Link>
            . We typically respond within 24 hours.
          </p>
        </div>

        <p className="text-xs text-morselBrown/80 border-t border-morselGold/20 pt-6">
          This delivery policy may be updated without notice. Please review it before each order.
          For questions, email marilynsmorselsbakery@gmail.com.
        </p>
      </div>
    </section>
  );
}
