import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for Marilyn's Morsels Bakery. Governing law, limitations, and service availability.",
};

export default function TermsPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-14 md:py-20 mt-16">
      <h1 className="text-3xl md:text-4xl font-display font-bold text-morselCocoa mb-6">
        Terms of Service
      </h1>
      <p className="text-sm text-morselBrown/60 mb-2">Last updated: April 23, 2026</p>
      <p className="text-xs text-morselBrown/80 mb-10 italic">
        These are working terms of service drafted for operational use. This is not legal advice.
        Consult a qualified attorney before relying on this document.
      </p>

      <div className="space-y-10 text-morselBrown/80 leading-relaxed">
        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Acceptance of Terms
          </h2>
          <p>
            By using marilynsmorsels.com or placing an order, you agree to these Terms of
            Service. If you do not agree, please do not use this site.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Products and Orders
          </h2>
          <p>
            All products are made in a licensed home kitchen and are subject to availability.
            We reserve the right to refuse or cancel any order at our discretion, including if
            we are unable to fulfill a large or unusual request. If we cancel your order, you
            will receive a full refund.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Allergen Notice
          </h2>
          <p>
            Our products are baked in a home kitchen that handles common allergens including
            wheat, eggs, dairy, peanuts, and tree nuts. Products may contain trace amounts of
            these allergens. If you have severe food allergies, please contact us before ordering.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Service Availability
          </h2>
          <p>
            We operate as a small home bakery. While we strive to fulfill orders promptly,
            availability may be limited during high demand periods, holidays, or due to
            ingredient availability. We will notify you if your order cannot be fulfilled within
            the expected timeframe.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law, Marilyn&apos;s Morsels Bakery shall not be
            liable for any indirect, incidental, or consequential damages arising from your use
            of this site or your order. Our total liability for any claim related to an order
            shall not exceed the amount paid for that order.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Governing Law
          </h2>
          <p>
            These terms are governed by and construed in accordance with the laws of the State
            of Ohio, without regard to conflict of law principles. Any disputes shall be
            resolved in the courts of Franklin County, Ohio.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Changes to Terms
          </h2>
          <p>
            We may update these terms at any time. The &quot;Last updated&quot; date at the top
            of this page reflects the most recent revision. Continued use of the site after
            changes constitutes acceptance of the updated terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">Contact</h2>
          <p>
            Questions?{" "}
            <Link href="/contact" className="text-morselGold hover:underline">
              Reach out to us
            </Link>
            .
          </p>
        </div>

        <p className="text-xs text-morselBrown/80 border-t border-morselGold/20 pt-6">
          These terms may be updated without notice. Consult a lawyer before relying on this
          document for legal purposes.
        </p>
      </div>
    </section>
  );
}
