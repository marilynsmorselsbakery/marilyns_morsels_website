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

export default function HomePage() {
  return (
    <>
      <div className="pt-16">
        <Hero />
      </div>

      <BestSellers />

      <WhyMarilyn />

      <HomeCTASection />
    </>
  );
}
