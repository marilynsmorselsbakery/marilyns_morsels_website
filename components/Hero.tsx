import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-morselCream">
      <div className="max-w-6xl mx-auto px-4 py-16 grid gap-10 md:grid-cols-2 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-semibold leading-tight">
            Small-batch cookies that taste like{" "}
            <span className="text-morselGold">home, perfected.</span>
          </h1>
          <p className="mt-4 text-morselBrown/80 text-sm md:text-base">
            Marilyn&apos;s Morsels crafts rich, golden, slow-baked cookies in a
            licensed home kitchen, using real butter, premium chocolate, and no shortcuts.
          </p>
          <div className="mt-6 flex gap-4">
            <Link
              href="/shop"
              className="px-5 py-3 bg-morselBrown text-morselCream text-sm rounded-full hover:bg-morselGold hover:text-morselBrown transition"
            >
              Shop Cookies
            </Link>
            <Link
              href="/bulk-orders"
              className="px-5 py-3 border border-morselBrown/40 text-sm rounded-full hover:border-morselGold hover:text-morselGold transition"
            >
              Bulk & Events
            </Link>
          </div>
        </div>
        <div className="h-64 md:h-80 bg-white rounded-3xl shadow-lg flex items-center justify-center text-xs text-morselBrown/50">
          {/* TODO: Replace placeholder with polished cookie photography */}
          Elegant cookie photography goes here, not a phone flash crime.
        </div>
      </div>
    </section>
  );
}

