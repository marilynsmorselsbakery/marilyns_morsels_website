import "server-only";
import { unstable_cache } from "next/cache";
import type Stripe from "stripe";
import { getStripe } from "./stripe";

export type ProductCategory = "cookie" | "dough";

export interface ProductVariant {
  sku: string;              // e.g., "cc-6" — unique per variant
  stripeProductId: string;
  stripePriceId: string;
  packSize: string;         // "6" / "12" / "24" / "pint" / "quart" / "half_gallon"
  packLabel: string;        // "Half-Dozen" / "Dozen" / "2-Dozen" / "Pint" / "Quart" / "Half-Gallon"
  priceCents: number;
}

export interface Product {
  id: string;               // flavor slug — e.g., "chocolate_chip"
  flavor: string;           // same as id
  name: string;             // display name
  description: string;
  category: ProductCategory;
  variants: ProductVariant[]; // sorted by pack size (smallest → largest)
}

/** Legacy alias — keep so any lingering imports don't break. Removed from new code. */
export type ProductOption = ProductVariant & {
  id: string;
  name: string;
  description: string;
  flavor: string;
  packSize: string;
  category: ProductCategory;
};

const PACK_ORDER: Record<string, number> = {
  "6": 1,
  "12": 2,
  "24": 3,
  pint: 4,
  quart: 5,
  half_gallon: 6,
};

const PACK_LABEL: Record<string, string> = {
  "6": "Half-Dozen",
  "12": "Dozen",
  "24": "2-Dozen",
  pint: "Pint",
  quart: "Quart",
  half_gallon: "Half-Gallon",
};

const FLAVOR_ORDER = [
  "chocolate_chip",
  "butterscotch_chip",
  "pbcup_sugar_cookie",
  "half_half",
  "trio",
  "chocolate_chip_dough",
  "butterscotch_chip_dough",
  "pbcup_sugar_cookie_dough",
];

export const FLAVOR_DISPLAY_NAMES: Record<string, string> = {
  chocolate_chip: "Old Fashion Chocolate Chip",
  butterscotch_chip: "Butterscotch Chocolate Chip",
  half_half: "Half & Half",
  pbcup_sugar_cookie: "Peanut Butter Cup",
  trio: "Trio",
  chocolate_chip_dough: "Chocolate Chip Cookie Dough",
  butterscotch_chip_dough: "Butterscotch Chocolate Chip Cookie Dough",
  pbcup_sugar_cookie_dough: "Peanut Butter Cup Cookie Dough",
};

export const FLAVOR_DESCRIPTIONS: Record<string, string> = {
  chocolate_chip:
    "The classic — soft-centered chocolate chip cookies baked fresh in Marilyn's kitchen.",
  butterscotch_chip:
    "Rich butterscotch and chocolate chips with caramelized edges.",
  half_half: "Your pick of any 2 of our 3 signature cookie flavors.",
  pbcup_sugar_cookie:
    "Soft sugar cookies with a peanut butter cup pressed in the center.",
  trio:
    "All three cookies in one pack — chocolate chip, butterscotch chocolate chip, and peanut butter cup. 6-pack has 2 of each.",
  chocolate_chip_dough: "Ready-to-bake chocolate chip cookie dough.",
  butterscotch_chip_dough:
    "Ready-to-bake butterscotch chocolate chip cookie dough.",
  pbcup_sugar_cookie_dough:
    "Ready-to-bake peanut butter cup sugar cookie dough.",
};

async function fetchProductsFromStripe(): Promise<Product[]> {
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

  // Build raw variants from Stripe products
  const variantsByFlavor = new Map<string, ProductVariant[]>();
  const metaByFlavor = new Map<
    string,
    { name: string; description: string; category: ProductCategory }
  >();

  for (const product of productsResp.data) {
    const slug = product.metadata?.slug;
    const flavor = product.metadata?.flavor;
    const packSize = product.metadata?.pack_size;
    const category = product.metadata?.category as ProductCategory | undefined;
    if (!slug || !flavor || !packSize || !category) continue;

    const price = priceByProduct.get(product.id);
    if (!price || price.unit_amount == null) continue;

    const variant: ProductVariant = {
      sku: slug,
      stripeProductId: product.id,
      stripePriceId: price.id,
      packSize,
      packLabel: PACK_LABEL[packSize] ?? packSize,
      priceCents: price.unit_amount,
    };

    const existing = variantsByFlavor.get(flavor) ?? [];
    existing.push(variant);
    variantsByFlavor.set(flavor, existing);

    // Keep first-seen metadata as fallback for display name/description
    if (!metaByFlavor.has(flavor)) {
      metaByFlavor.set(flavor, {
        name: product.name,
        description: product.description ?? "",
        category,
      });
    }
  }

  // Assemble grouped Products, sorted by FLAVOR_ORDER
  const products: Product[] = [];

  const sortedFlavors = Array.from(variantsByFlavor.keys()).sort((a, b) => {
    const ai = FLAVOR_ORDER.indexOf(a);
    const bi = FLAVOR_ORDER.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  for (const flavor of sortedFlavors) {
    const variants = (variantsByFlavor.get(flavor) ?? []).sort(
      (a, b) => (PACK_ORDER[a.packSize] ?? 99) - (PACK_ORDER[b.packSize] ?? 99)
    );
    const meta = metaByFlavor.get(flavor)!;

    products.push({
      id: flavor,
      flavor,
      name: FLAVOR_DISPLAY_NAMES[flavor] ?? meta.name,
      description: FLAVOR_DESCRIPTIONS[flavor] ?? meta.description,
      category: meta.category,
      variants,
    });
  }

  return products;
}

export const getProducts = unstable_cache(
  fetchProductsFromStripe,
  ["stripe-products-v3"],
  { revalidate: 3600, tags: ["products"] }
);

export async function getProductByFlavor(
  flavor: string
): Promise<Product | undefined> {
  const all = await getProducts();
  return all.find((p) => p.flavor === flavor);
}

/** @deprecated Use getProductByFlavor instead. Kept for checkout route compatibility. */
export async function getProductBySlug(
  slug: string
): Promise<ProductVariant | undefined> {
  const all = await getProducts();
  for (const product of all) {
    const variant = product.variants.find((v) => v.sku === slug);
    if (variant) return variant;
  }
  return undefined;
}
