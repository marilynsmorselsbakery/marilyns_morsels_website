import "server-only";
import { unstable_cache } from "next/cache";
import type Stripe from "stripe";
import { getStripe } from "./stripe";

export type ProductCategory = "cookie" | "dough";

export interface ProductOption {
  id: string;
  stripeProductId: string;
  stripePriceId: string;
  name: string;
  description: string;
  flavor: string;
  packSize: string;
  category: ProductCategory;
  priceCents: number;
}

const PACK_ORDER: Record<string, number> = {
  "6": 1,
  "12": 2,
  pint: 3,
  quart: 4,
};

const FLAVOR_ORDER = [
  "chocolate_chip",
  "butterscotch_chip",
  "half_half",
  "pbcup_sugar_cookie",
  "chocolate_chip_dough",
  "butterscotch_chip_dough",
  "pbcup_sugar_cookie_dough",
];

function sortProducts(products: ProductOption[]): ProductOption[] {
  return [...products].sort((a, b) => {
    const ai = FLAVOR_ORDER.indexOf(a.flavor);
    const bi = FLAVOR_ORDER.indexOf(b.flavor);
    const aFlavor = ai === -1 ? 999 : ai;
    const bFlavor = bi === -1 ? 999 : bi;
    if (aFlavor !== bFlavor) return aFlavor - bFlavor;
    return (PACK_ORDER[a.packSize] ?? 99) - (PACK_ORDER[b.packSize] ?? 99);
  });
}

async function fetchProductsFromStripe(): Promise<ProductOption[]> {
  let productsResp, pricesResp;
  try {
    const stripe = getStripe();
    [productsResp, pricesResp] = await Promise.all([
      stripe.products.list({ active: true, limit: 100 }),
      stripe.prices.list({ active: true, limit: 100 }),
    ]);
  } catch (error) {
    console.error("[lib/products] Stripe fetch failed:", error);
    throw error;
  }

  const priceByProduct = new Map<string, Stripe.Price>();
  for (const price of pricesResp.data) {
    const productId =
      typeof price.product === "string" ? price.product : price.product.id;
    if (!priceByProduct.has(productId)) {
      priceByProduct.set(productId, price);
    }
  }

  const products: ProductOption[] = [];
  for (const product of productsResp.data) {
    const slug = product.metadata?.slug;
    const flavor = product.metadata?.flavor;
    const packSize = product.metadata?.pack_size;
    const category = product.metadata?.category as ProductCategory | undefined;
    if (!slug || !flavor || !packSize || !category) continue;

    const price = priceByProduct.get(product.id);
    if (!price || price.unit_amount == null) continue;

    products.push({
      id: slug,
      stripeProductId: product.id,
      stripePriceId: price.id,
      name: product.name,
      description: product.description ?? "",
      flavor,
      packSize,
      category,
      priceCents: price.unit_amount,
    });
  }

  return sortProducts(products);
}

export const getProducts = unstable_cache(
  fetchProductsFromStripe,
  ["stripe-products-v2"],
  { revalidate: 3600, tags: ["products"] }
);

export async function getProductBySlug(
  slug: string
): Promise<ProductOption | undefined> {
  const all = await getProducts();
  return all.find((p) => p.id === slug);
}
