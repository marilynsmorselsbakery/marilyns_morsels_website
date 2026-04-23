import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Common questions about Marilyn's Morsels Bakery — ordering, shipping, freshness, allergens, local pickup, storage, and more.",
};

const faqs = [
  {
    question: "Where are you located?",
    answer:
      "We're a licensed home bakery in Westerville, Ohio. We don't have a walk-in storefront — all orders are placed online and fulfilled via local delivery or nationwide shipping.",
  },
  {
    question: "How do you ship cookies?",
    answer:
      "We ship baked cookies nationwide via USPS or UPS. Cookies are carefully packaged to arrive fresh. Cookie dough is not available for nationwide shipping because it's perishable. Orders typically ship within 2–4 business days of payment.",
  },
  {
    question: "Can I pick up locally instead of having them shipped?",
    answer:
      "Yes! We offer local delivery within approximately 10 miles of Westerville, Ohio. After placing your order, we'll contact you by email to arrange a delivery time. We don't offer in-person pickup from our home — local delivery is the equivalent.",
  },
  {
    question: "How long do cookies stay fresh?",
    answer:
      "Our cookies are best within 5–7 days of baking at room temperature in an airtight container. For longer storage, they can be frozen for up to 3 months. We recommend letting frozen cookies thaw at room temperature for about an hour before eating.",
  },
  {
    question: "How should I store cookie dough?",
    answer:
      "Cookie dough should be refrigerated and used within 7–10 days, or frozen for up to 3 months. Keep it sealed in its container when refrigerating. For best results, let refrigerated dough sit at room temperature for 10–15 minutes before baking.",
  },
  {
    question: "Do you make custom or themed orders?",
    answer:
      "Our menu focuses on our three signature cookie varieties and dough. We don't currently offer decorated or themed cookies. For large or custom-quantity orders for events, use our Bulk Orders page to submit an inquiry.",
  },
  {
    question: "Do you do bulk or event orders?",
    answer:
      "Yes — we love baking for events, corporate gifts, weddings, and more. Head to our Bulk Orders page to submit a request with your quantity, date, and details, and we'll follow up with a custom quote.",
  },
  {
    question: "Are your products allergen-safe?",
    answer:
      "Our cookies are baked in a home kitchen that handles common allergens including wheat, eggs, dairy, peanuts, and tree nuts. Products may contain trace amounts of these allergens due to shared equipment and surfaces. If you have a severe food allergy, please contact us before ordering so we can advise whether our products are appropriate for you.",
  },
  {
    question: "Do you offer gluten-free or vegan options?",
    answer:
      "We don't currently offer gluten-free or vegan varieties. Our recipes use real butter, eggs, and wheat flour — and our kitchen is not allergen-separated. We appreciate your interest and may expand our menu in the future.",
  },
  {
    question: "How quickly can you fulfill a large order?",
    answer:
      "For standard orders, please allow 2–4 business days. For large or bulk orders, lead time depends on quantity and timing — typically 5–10 business days. Submit your request through our Bulk Orders page as early as possible so we can plan accordingly.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="max-w-3xl mx-auto px-4 py-14 md:py-20 mt-16">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-morselCocoa mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-morselBrown/70 mb-10">
          Can&apos;t find your answer here?{" "}
          <a href="/contact" className="text-morselGold hover:underline">
            Email us
          </a>{" "}
          — we typically respond within 24 hours.
        </p>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-card border border-morselGold/10 p-6"
            >
              <h2 className="text-lg font-display font-semibold text-morselCocoa mb-3">
                {faq.question}
              </h2>
              <p className="text-morselBrown/80 leading-relaxed text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
