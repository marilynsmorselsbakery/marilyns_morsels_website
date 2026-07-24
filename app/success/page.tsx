import Link from "next/link";

export default function SuccessPage() {
  return (
    <section className="max-w-xl mx-auto px-4 py-16 text-center mt-16">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-4">
          <svg
            className="w-10 h-10 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-morselCocoa mb-4">
          Thank you for your order!
        </h1>
        <p className="text-base text-morselBrown/80 mb-6">
          Your cookies are now in the queue. You&apos;ll receive an email confirmation with details.
        </p>
      </div>

      <div className="bg-white/90 rounded-lg border border-morselGold/30 p-6 mb-6 text-left">
        <h2 className="text-lg font-semibold text-morselCocoa mb-4">What&apos;s Next?</h2>
        <ul className="space-y-3 text-sm text-morselBrown/70">
          <li className="flex items-start gap-2">
            <span className="text-morselGold mt-1">•</span>
            <span>You&apos;ll receive an email confirmation shortly with your order details</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-morselGold mt-1">•</span>
            <span>We&apos;ll contact you by email to coordinate local delivery</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-morselGold mt-1">•</span>
            <span>You can track your order status in your account dashboard</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/account"
          className="rounded-md border border-morselGold/60 px-6 py-3 text-morselBrown transition hover:border-morselGold hover:bg-morselGold/10"
        >
          View Account
        </Link>
        <Link
          href="/shop"
          className="rounded-md bg-morselGold px-6 py-3 text-white transition hover:bg-morselGold/90"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}

