import Hero from "@/components/Hero";
import BestSellers from "@/components/BestSellers";
import WhyMarilyn from "@/components/WhyMarilyn";
import HomeCTASection from "./HomeCTASection";

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
