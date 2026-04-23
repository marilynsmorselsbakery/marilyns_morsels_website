import type { Metadata } from "next";
import Hero from "@/components/Hero";
import BestSellers from "@/components/BestSellers";
import WhyMarilyn from "@/components/WhyMarilyn";
import HomeCTASection from "./HomeCTASection";

export const metadata: Metadata = {
  title: "Marilyn's Morsels Bakery — Fresh-Baked Cookies from Westerville, OH",
  description:
    "Small-batch cookies and cookie dough baked fresh in Marilyn's home kitchen in Westerville, Ohio. Order online for local delivery or nationwide shipping.",
  openGraph: {
    title: "Marilyn's Morsels Bakery — Fresh-Baked Cookies from Westerville, OH",
    description:
      "Small-batch cookies and cookie dough baked fresh in Marilyn's home kitchen. Order online.",
    url: "https://marilynsmorsels.com",
    type: "website",
  },
  twitter: {
    title: "Marilyn's Morsels Bakery",
    description:
      "Small-batch cookies and cookie dough from a Westerville, OH home kitchen.",
  },
};

// LocalBusiness JSON-LD (Bakery subtype) — rendered on the homepage where it
// semantically belongs. Lives here rather than in the root layout so it
// doesn't interact with Next.js metadata streaming (keeping the layout clean
// preserves React 19's auto-hoisting of <title>/<meta> to <head>).
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "Marilyn's Morsels Bakery",
  url: "https://marilynsmorsels.com",
  email: "marilynsmorselsbakery@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Westerville",
    addressRegion: "OH",
    addressCountry: "US",
  },
  priceRange: "$",
  servesCuisine: "Bakery",
  description:
    "Home bakery in Westerville, Ohio offering small-batch cookies and cookie dough. Order online for local delivery or nationwide cookie shipping.",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <div className="pt-16">
        <Hero />
      </div>

      <BestSellers />

      <WhyMarilyn />

      <HomeCTASection />
    </>
  );
}
