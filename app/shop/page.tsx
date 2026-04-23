import type { Metadata } from "next";
import ShopGrid from "./ShopGrid";
import { getProducts } from "@/lib/products";
import ProductSchema from "@/components/ProductSchema";

export const metadata: Metadata = {
  title: "Shop Fresh-Baked Cookies & Cookie Dough",
  description:
    "Order small-batch cookies and cookie dough from Marilyn's home kitchen in Westerville, Ohio. Available in half-dozen, dozen, and larger sizes. Local delivery and nationwide cookie shipping.",
  openGraph: {
    title: "Shop — Marilyn's Morsels Bakery",
    description:
      "Small-batch cookies and cookie dough baked fresh in Westerville, Ohio. Order online.",
    url: "https://marilynsmorsels.com/shop",
    type: "website",
  },
  twitter: {
    title: "Shop — Marilyn's Morsels Bakery",
    description: "Fresh-baked cookies and cookie dough — order online.",
  },
};

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <>
      <ProductSchema products={products} />
      <ShopGrid products={products} />
    </>
  );
}
