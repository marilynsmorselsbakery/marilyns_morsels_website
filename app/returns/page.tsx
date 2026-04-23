import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Refund Policy",
  description:
    "Marilyn's Morsels Bakery returns and refund policy. Learn what happens if there's an issue with your order.",
};

export default function ReturnsPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-14 md:py-20 mt-16">
      <h1 className="text-3xl md:text-4xl font-display font-bold text-morselCocoa mb-6">
        Returns &amp; Refund Policy
      </h1>
      <p className="text-sm text-morselBrown/60 mb-10">Last updated: April 23, 2026</p>

      <div className="space-y-10 text-morselBrown/80 leading-relaxed">
        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Perishable Food Products
          </h2>
          <p>
            Because our products are fresh-baked perishable food items, we generally do not
            accept returns or issue refunds once an order has been delivered or shipped.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Exceptions: Defective or Incorrect Orders
          </h2>
          <p>
            If you receive a product that is defective, damaged in transit, or significantly
            different from what was ordered, we will make it right. Please{" "}
            <Link href="/contact" className="text-morselGold hover:underline">
              contact us
            </Link>{" "}
            within <strong>48 hours of delivery</strong> with:
          </p>
          <ul className="mt-3 list-disc list-inside space-y-1 pl-2">
            <li>A brief description of the issue</li>
            <li>Photos of the product as received</li>
            <li>Your order confirmation number or email address</li>
          </ul>
          <p className="mt-3">
            We will review your request promptly and offer a full or partial refund, or a
            replacement order, at our discretion.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Not-As-Described Claims
          </h2>
          <p>
            If the product you receive does not match the description on our site, contact us
            within 48 hours of delivery with photos and details. We will work with you to
            resolve the issue.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Shipping Delays
          </h2>
          <p>
            We are not responsible for delays caused by the shipping carrier once an order has
            been handed off. If your order is significantly delayed and perishability is a
            concern, contact us and we will do our best to help.
          </p>
        </div>

        <p className="text-xs text-morselBrown/80 border-t border-morselGold/20 pt-6">
          This policy may be updated without notice. For questions, email
          marilynsmorselsbakery@gmail.com.
        </p>
      </div>
    </section>
  );
}
