import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Learn how Marilyn's Morsels Bakery ships cookies and dough. Local delivery near Westerville, Ohio and nationwide shipping for cookies.",
};

export default function ShippingPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-14 md:py-20 mt-16">
      <h1 className="text-3xl md:text-4xl font-display font-bold text-morselCocoa mb-6">
        Shipping Policy
      </h1>
      <p className="text-sm text-morselBrown/60 mb-10">Last updated: April 23, 2026</p>

      <div className="space-y-10 text-morselBrown/80 leading-relaxed">
        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Local Delivery — Westerville, OH Area
          </h2>
          <p>
            We offer local delivery within approximately 10 miles of Westerville, Ohio for all
            products, including cookies and cookie dough. Dough is perishable and is only
            available for local delivery — it cannot be shipped nationally.
          </p>
          <p className="mt-3">
            After placing a local delivery order, we will contact you via email to coordinate a
            delivery time. Please allow 1–3 business days for order preparation.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Nationwide Shipping — Cookies Only
          </h2>
          <p>
            We ship baked cookies nationwide via USPS or UPS. Cookie dough is not available for
            national shipping due to its perishable nature.
          </p>
          <p className="mt-3">
            Orders are typically prepared and shipped within 2–4 business days of payment. Once
            shipped, delivery time depends on your location and selected carrier service. We will
            send you a tracking number by email when your order ships.
          </p>
          <p className="mt-3">
            Shipping rates are calculated at checkout based on your location and order size.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Order Cutoff & Freshness
          </h2>
          <p>
            Cookies are baked to order in small batches. To ensure maximum freshness, we bake
            after your order is placed rather than shipping from pre-baked inventory. Orders
            placed over the weekend may begin preparation on the following business day.
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
          This shipping policy may be updated without notice. Please review it before each order.
          For questions, email marilynsmorselsbakery@gmail.com.
        </p>
      </div>
    </section>
  );
}
