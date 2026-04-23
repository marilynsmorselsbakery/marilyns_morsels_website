import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Marilyn's Morsels Bakery. Email us for order questions, bulk inquiries, or anything else.",
};

export default function ContactPage() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-14 md:py-20 mt-16 text-center">
      <h1 className="text-3xl md:text-4xl font-display font-bold text-morselCocoa mb-4">
        Contact Us
      </h1>
      <p className="text-morselBrown/70 mb-10 leading-relaxed">
        Marilyn&apos;s Morsels is a family-run home bakery in Westerville, Ohio. We&apos;re a
        small operation, so the fastest way to reach us is always email.
      </p>

      <div className="bg-white rounded-2xl shadow-card border border-morselGold/10 p-8 md:p-12 mb-8">
        <p className="text-sm font-semibold text-morselBrown/60 uppercase tracking-widest mb-3">
          Fastest way to reach us
        </p>
        <a
          href="mailto:marilynsmorselsbakery@gmail.com"
          className="inline-block text-xl md:text-2xl font-display font-semibold text-morselGold hover:text-morselCocoa transition-colors duration-200 break-all"
        >
          marilynsmorselsbakery@gmail.com
        </a>
        <p className="mt-4 text-sm text-morselBrown/60">
          We typically respond within 24 hours.
        </p>
      </div>

      <div className="text-left space-y-4 text-morselBrown/70 text-sm">
        <p>
          <strong className="text-morselBrown">Order questions?</strong> Include your order
          confirmation number in your email and we&apos;ll get back to you quickly.
        </p>
        <p>
          <strong className="text-morselBrown">Bulk or event orders?</strong> Head to our{" "}
          <a href="/bulk-orders" className="text-morselGold hover:underline">
            Bulk Orders page
          </a>{" "}
          to submit a detailed inquiry form — that&apos;s the fastest path to a custom quote.
        </p>
        <p>
          <strong className="text-morselBrown">Everything else</strong> — feedback, questions,
          just saying hi — email works great.
        </p>
      </div>
    </section>
  );
}
