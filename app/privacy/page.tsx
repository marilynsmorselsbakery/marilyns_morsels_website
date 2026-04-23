import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Marilyn's Morsels Bakery. Learn how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-14 md:py-20 mt-16">
      <h1 className="text-3xl md:text-4xl font-display font-bold text-morselCocoa mb-6">
        Privacy Policy
      </h1>
      <p className="text-sm text-morselBrown/60 mb-2">Last updated: April 23, 2026</p>
      <p className="text-xs text-morselBrown/50 mb-10 italic">
        This is a working privacy policy drafted for operational use. It is not legal advice.
        Consult a qualified attorney before relying on this document for regulatory compliance.
      </p>

      <div className="space-y-10 text-morselBrown/80 leading-relaxed">
        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Who We Are
          </h2>
          <p>
            Marilyn&apos;s Morsels Bakery is a home bakery in Westerville, Ohio. Our website is
            marilynsmorsels.com. Our contact email is marilynsmorselsbakery@gmail.com.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Information We Collect
          </h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong>Account information</strong> — email address, when you create an account
              via our site. Stored in Supabase.
            </li>
            <li>
              <strong>Order and payment information</strong> — name, email, and shipping address
              collected at checkout and processed by Stripe. We do not store your full credit
              card number; Stripe handles payment processing directly.
            </li>
            <li>
              <strong>Usage data</strong> — aggregate, anonymized page-view data collected via
              Vercel Analytics (cookieless, privacy-friendly). No personal identifiers are
              included.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            How We Use Your Information
          </h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>To process and fulfill your orders</li>
            <li>To send order confirmation and updates</li>
            <li>To respond to customer service inquiries</li>
            <li>To improve our website using aggregated analytics data</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Third-Party Services
          </h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong>Stripe</strong> — payment processing. Your payment data is governed by{" "}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-morselGold hover:underline"
              >
                Stripe&apos;s Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong>Supabase</strong> — authentication and order database. Data is stored on
              Supabase-managed servers.
            </li>
            <li>
              <strong>Vercel</strong> — website hosting and cookieless analytics. No personal
              data is included in analytics events.
            </li>
          </ul>
          <p className="mt-3">
            We do not sell, rent, or share your personal information with advertisers or
            unrelated third parties.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Cookies
          </h2>
          <p>
            Our site uses session cookies for authentication (keeping you logged in). We do not
            use advertising cookies or third-party tracking cookies. Vercel Analytics is
            cookieless.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Your Rights
          </h2>
          <p>
            You may request access to, correction of, or deletion of your personal data at any
            time by contacting us at marilynsmorselsbakery@gmail.com. We will respond within a
            reasonable timeframe.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-morselCocoa mb-3">
            Contact
          </h2>
          <p>
            Questions about this policy?{" "}
            <Link href="/contact" className="text-morselGold hover:underline">
              Reach out to us
            </Link>
            .
          </p>
        </div>

        <p className="text-xs text-morselBrown/50 border-t border-morselGold/20 pt-6">
          This privacy policy may be updated without notice. Consult a lawyer before relying
          on this document for legal or regulatory purposes.
        </p>
      </div>
    </section>
  );
}
