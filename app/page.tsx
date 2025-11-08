import Hero from "@/components/Hero";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Handcrafted with care, delivered fresh
          </h2>
          <p className="text-morselBrown/80 mb-8 text-sm md:text-base">
            Every batch is baked to order in our licensed home kitchen. We use
            premium ingredients—real butter, quality chocolate, and time-tested
            recipes—to create cookies that taste like they came straight from
            grandma&apos;s oven.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-morselBrown text-morselCream text-sm rounded-full hover:bg-morselGold hover:text-morselBrown transition"
          >
            Browse Our Cookies
          </Link>
        </div>
      </section>

      <section className="bg-white border-t border-morselGold/10 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Small-Batch Fresh</h3>
              <p className="text-sm text-morselBrown/70">
                Baked to order, never mass-produced. Every cookie is made with
                attention to detail.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Premium Ingredients</h3>
              <p className="text-sm text-morselBrown/70">
                Real butter, quality chocolate, and no shortcuts. We believe
                ingredients matter.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Licensed Kitchen</h3>
              <p className="text-sm text-morselBrown/70">
                Baked in a licensed home kitchen, following all food safety
                standards and regulations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
