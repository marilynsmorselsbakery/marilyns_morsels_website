import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Marilyn",
  description:
    "Meet Marilyn — the baker behind Marilyn's Morsels. A lifelong love of baking cookies from her home kitchen in Westerville, Ohio, passed down through family and neighbors for decades.",
  openGraph: {
    title: "About Marilyn's Morsels Bakery",
    description:
      "Meet Marilyn, the baker behind every morsel. Small-batch cookies from a Westerville, OH home kitchen.",
    url: "https://marilynsmorsels.com/about",
    type: "website",
  },
  twitter: {
    title: "About Marilyn's Morsels",
    description: "Meet Marilyn — the baker behind every morsel.",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
