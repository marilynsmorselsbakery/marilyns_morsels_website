import type { Metadata } from "next";
import BulkOrdersContent from "./BulkOrdersContent";

export const metadata: Metadata = {
  title: "Bulk & Corporate Orders",
  description:
    "Order cookies in bulk for events, corporate gifts, weddings, and more. Marilyn's Morsels Bakery in Westerville, Ohio takes bulk inquiries for large-quantity fresh-baked cookie orders.",
  openGraph: {
    title: "Bulk & Corporate Orders — Marilyn's Morsels Bakery",
    description:
      "Need cookies for your event or office? Submit a bulk order inquiry to Marilyn's Morsels.",
    url: "https://marilynsmorsels.com/bulk-orders",
    type: "website",
  },
  twitter: {
    title: "Bulk Orders — Marilyn's Morsels",
    description: "Corporate gifts, events, and bulk cookie orders from a Westerville, OH home bakery.",
  },
};

export default function BulkOrdersPage() {
  return <BulkOrdersContent />;
}
