import ShopGrid from "./ShopGrid";
import { getProducts } from "@/lib/products";

export default async function ShopPage() {
  const products = await getProducts();
  return <ShopGrid products={products} />;
}
